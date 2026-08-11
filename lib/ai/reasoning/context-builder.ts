import type { KnowledgeDocument, KnowledgeSearchCache } from "../types";
import { buildSearchCache } from "../knowledge-loader";
import { getModeAgent } from "../mode-agents";
import type {
  EntityExtraction,
  IntentClassification,
  ReasoningContext,
  RetrievedDocument,
  KnowledgeTier,
  RetrievalBuckets,
} from "./reasoning-types";
import type { QuestionType, UserInputAnalysis } from "./input-analyzer";

const PERSONAL_CATEGORIES = new Set(["resume", "leadership", "philosophy"]);
const INTERVIEW_CATEGORIES = new Set(["interview"]);
const BLOCKED_BY_QUESTION_TYPE: Partial<Record<QuestionType, string[]>> = {
  ARCHITECTURE_DESIGN: ["resume", "interview"],
  ARCHITECTURE_REVIEW: ["resume", "interview"],
  OPTIMIZATION: ["resume", "interview", "philosophy"],
  COST_ANALYSIS: ["interview"],
  EXPLANATION: ["resume", "interview"],
  COMPARISON: ["resume", "interview"],
  SQL_OPTIMIZATION: ["resume", "interview", "philosophy"],
  TROUBLESHOOTING: ["resume", "interview"],
};

const PREFERRED_BY_QUESTION_TYPE: Partial<Record<QuestionType, string[]>> = {
  ARCHITECTURE_PLACEMENT: ["architecture", "technology", "project"],
  COMPONENT_PLACEMENT: ["architecture", "technology", "project"],
  INGESTION_RECOMMENDATION: ["architecture", "technology", "story"],
  ARCHITECTURE_REVIEW: ["architecture", "technology", "story", "project"],
  EXPLANATION: ["technology", "architecture", "project"],
  COMPARISON: ["technology", "architecture"],
  PROJECT_QUESTION: ["project", "technology", "story"],
  PERSONAL_EXPERIENCE: ["story", "philosophy", "leadership", "project", "resume"],
  CAREER: ["resume", "leadership", "project"],
  INTERVIEW: ["interview", "story", "project", "architecture"],
  COST_ANALYSIS: ["technology", "story", "project", "architecture"],
  OPTIMIZATION: ["technology", "story", "project"],
  SQL_OPTIMIZATION: ["technology", "story"],
  TROUBLESHOOTING: ["story", "technology", "project"],
};

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(items: string[]) {
  return Array.from(new Set(items.map((item) => normalize(item)).filter(Boolean)));
}

function tokenizeQuestion(question: string) {
  const stop = new Set(["the", "a", "an", "for", "and", "or", "to", "my", "this", "that", "how", "what", "why", "do", "you", "me", "is", "are", "in", "on", "at", "with", "would", "should", "can", "i", "we", "it", "of", "be", "as", "one", "time"]);
  return normalize(question)
    .split(" ")
    .filter((t) => t.length > 2 && !stop.has(t));
}

function isStreamingQuestion(question: string, analysis: UserInputAnalysis) {
  return analysis.processingPattern === "streaming" || /\bstream(ing)?\b/i.test(question);
}

function documentTier(document: KnowledgeDocument): KnowledgeTier {
  const cat = normalize(document.category);
  if (PERSONAL_CATEGORIES.has(cat) || cat === "resume") return "personal";
  if (cat === "project" || cat === "story") return "personal";
  return "general";
}

function isBlocked(document: KnowledgeDocument, questionType: QuestionType, analysis: UserInputAnalysis) {
  const cat = normalize(document.category);
  const blocked = BLOCKED_BY_QUESTION_TYPE[questionType] || [];
  if (blocked.includes(cat)) {
    const mentionsBlocked =
      (cat === "resume" && /\bresume\b|\bcareer\b|\btimeline\b/i.test(analysis.rawQuestion)) ||
      (cat === "interview" && /\binterview\b|\bask me\b/i.test(analysis.rawQuestion)) ||
      (cat === "philosophy" && /\bphilosophy\b|\bhow do you think\b|\bmentor\b/i.test(analysis.rawQuestion));
    return !mentionsBlocked;
  }
  return false;
}

function scoreDocument(
  document: KnowledgeDocument,
  question: string,
  questionType: QuestionType,
  intent: IntentClassification,
  entities: EntityExtraction,
  analysis: UserInputAnalysis,
  mode: string
) {
  if (isBlocked(document, questionType, analysis)) return null;

  const tokens = tokenizeQuestion(question);
  const haystack = normalize(
    [document.title, document.summary, document.excerpt, document.content, ...document.tags, ...document.topics, ...document.technologies].join(" ")
  );

  let score = 0;
  const reasons: string[] = [];
  const matchedEntities: string[] = [];

  for (const token of tokens) {
    if (haystack.includes(token)) {
      score += 3;
      reasons.push(`token:${token}`);
    }
  }

  for (const tech of analysis.technologies) {
    if (haystack.includes(normalize(tech))) {
      score += 8;
      reasons.push(`user-tech:${tech}`);
    }
  }

  for (const entity of entities.entities) {
    const label = normalize(entity.label);
    if (!label) continue;
    if (haystack.includes(label)) {
      matchedEntities.push(entity.label);
      score += entity.kind === "project" ? 14 : entity.kind === "technology" ? 10 : 6;
      reasons.push(`entity:${entity.label}`);
    }
  }

  const preferred = PREFERRED_BY_QUESTION_TYPE[questionType] || [];
  const cat = normalize(document.category);
  if (preferred.includes(cat)) score += 6;

  const modeAgent = getModeAgent(mode);
  const modeBoost = modeAgent.knowledgeBoost[cat] || 0;
  if (modeBoost) {
    score += modeBoost;
    reasons.push(`mode:${modeAgent.id}:${cat}`);
  }

  if (modeAgent.id === "sql") {
    const sqlHaystack = normalize([document.title, ...document.tags, ...document.technologies].join(" "));
    if (/\b(sql|spark|redshift|databricks|postgres|query|warehouse)\b/.test(sqlHaystack)) {
      score += 8;
      reasons.push("mode:sql-tech");
    }
  }

  if (modeAgent.id === "cloud") {
    const cloudHaystack = normalize([document.title, document.summary, ...document.tags, ...document.technologies].join(" "));
    if (/\b(aws|cost|redshift|glue|lambda|s3|dynamodb|finops|cloud|databricks|egress|compute|storage)\b/.test(cloudHaystack)) {
      score += 8;
      reasons.push("mode:cloud-tech");
    }
  }

  if (modeAgent.allowedKnowledge.length && modeAgent.id !== "ask") {
    const tier = documentTier(document);
    if (tier === "personal" && !modeAgent.allowedKnowledge.includes("personal") && !modeAgent.allowedKnowledge.includes("project")) {
      if (!/\b(you|your|mansi|career|project|role)\b/i.test(question)) {
        score -= 6;
      }
    }
  }

  if (questionType === "ARCHITECTURE_DESIGN" && cat === "project" && !/\bamc\b/i.test(question) && !entities.projects.length) {
    score -= 12;
  }

  if (questionType === "ARCHITECTURE_DESIGN" && /\bdatabricks\b/i.test(document.title) && !/\bdatabricks\b/i.test(question)) {
    score -= 8;
  }

  if (questionType === "ARCHITECTURE_DESIGN" && /\bspark\b/i.test(document.title) && !/\bspark\b/i.test(question)) {
    score -= 8;
  }

  if (questionType === "ARCHITECTURE_DESIGN" && /\bsnowflake\b/i.test(document.title) && !/\bsnowflake\b/i.test(question)) {
    score -= 8;
  }

  if (questionType === "ARCHITECTURE_DESIGN" && /\bsql\b/i.test(document.title) && !/\bsql\b/i.test(question) && !isStreamingQuestion(question, analysis)) {
    score -= 6;
  }

  if (questionType === "ARCHITECTURE_DESIGN" && /\bpower\s*bi\b/i.test(document.title) && !/\bpower\s*bi\b/i.test(question)) {
    score -= 14;
  }

  if (isStreamingQuestion(question, analysis) && /\bkafka\b/i.test(haystack)) score += 10;

  if (questionType === "ARCHITECTURE_DESIGN" && cat === "philosophy") score -= 12;

  if (questionType === "PROJECT_QUESTION" && cat === "project") {
    if (/\bamc\b/i.test(question) && /\bamc\b/i.test(haystack)) score += 20;
    if (/\bdatalake\b/i.test(question) && /\bdatalake\b/i.test(haystack)) score += 16;
    for (const project of entities.projects) {
      if (haystack.includes(normalize(project.label))) score += 18;
    }
  }

  if (questionType === "EXPLANATION" && cat === "technology") {
    const target = entities.technologies[0]?.label || analysis.technologies[0];
    if (target && normalize(document.title).includes(normalize(target))) score += 16;
  }

  if (questionType === "COMPARISON" && cat === "technology") score += 4;

  if (questionType === "EXPLANATION" && cat === "project") score -= 14;

  if (questionType === "EXPLANATION" && cat === "architecture" && !entities.technologies.some((t) => /architecture/i.test(t.label))) {
    score -= 8;
  }

  if (intent.primary === "cloud-cost-review" && (/\bcost\b/i.test(haystack) || cat === "story")) score += 5;

  if (score <= 0) return null;

  return {
    document,
    score,
    reasons: unique(reasons),
    matchedEntities: unique(matchedEntities),
    tier: documentTier(document),
  };
}

function toRetrieved(item: { document: KnowledgeDocument; score: number; reasons: string[]; matchedEntities: string[]; tier: KnowledgeTier }): RetrievedDocument {
  return {
    ...item.document,
    score: item.score,
    reasons: item.reasons,
    matchedEntities: item.matchedEntities,
    tier: item.tier,
  };
}

function bucketDocuments(documents: RetrievedDocument[]): RetrievalBuckets {
  const userContext: RetrievedDocument[] = [];
  const generalKnowledge: RetrievedDocument[] = [];
  const personalKnowledge: RetrievedDocument[] = [];

  for (const doc of documents) {
    if (doc.tier === "personal") personalKnowledge.push(doc);
    else generalKnowledge.push(doc);
    if (doc.matchedEntities.length || doc.reasons.some((r) => r.startsWith("token:"))) {
      userContext.push(doc);
    }
  }

  return { userContext, generalKnowledge, personalKnowledge };
}

export function buildContext(
  question: string,
  mode: string,
  intent: IntentClassification,
  questionType: QuestionType,
  analysis: UserInputAnalysis,
  entities: EntityExtraction,
  documents: KnowledgeDocument[],
  cache: KnowledgeSearchCache = buildSearchCache(documents)
): ReasoningContext {
  const scored = cache.documents
    .map((document) => scoreDocument(document, question, questionType, intent, entities, analysis, mode))
    .filter(Boolean) as Array<{
    document: KnowledgeDocument;
    score: number;
    reasons: string[];
    matchedEntities: string[];
    tier: KnowledgeTier;
  }>;

  scored.sort((a, b) => b.score - a.score);

  let ranked = scored.slice(0, 8).map(toRetrieved);

  if (!ranked.length) {
    ranked = cache.documents
      .filter((d) => !isBlocked(d, questionType, analysis))
      .slice(0, 2)
      .map((document) => ({
        ...document,
        score: 1,
        reasons: ["minimal-fallback"],
        matchedEntities: [],
        tier: documentTier(document),
      }));
  }

  const retrieval = bucketDocuments(ranked);

  const signals = unique([
    `questionType:${questionType}`,
    `intent:${intent.primary}`,
    ...intent.signals,
    ...analysis.signals,
    ...entities.signals.map((value) => `entity:${value}`),
  ]);

  return {
    question,
    mode,
    intent,
    questionType,
    analysis,
    entities,
    documents: ranked,
    primaryDocuments: ranked.slice(0, 3),
    supportingDocuments: ranked.slice(3, 8),
    retrieval,
    cache,
    signals,
  };
}
