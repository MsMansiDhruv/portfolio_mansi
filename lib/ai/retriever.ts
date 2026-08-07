import type { Intent, KnowledgeDocument, KnowledgeHit, KnowledgeSearchCache, RetrievalContext } from "./types";
import { buildSearchCache } from "./knowledge-loader";

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(question = "") {
  return normalize(question)
    .split(" ")
    .filter((token) => token.length > 1);
}

function scoreText(question = "", candidates: string[], weight: number) {
  const text = normalize(question);
  return candidates.reduce((score, candidate) => {
    const normalized = normalize(candidate);
    return normalized && text.includes(normalized) ? score + weight : score;
  }, 0);
}

function collectRelatedDocuments(document: KnowledgeDocument, cache: KnowledgeSearchCache) {
  const related = new Set<KnowledgeDocument>();
  const lookups = [
    ...document.relatedDocuments,
    ...document.projects.map((project) => `project/${normalize(project).replace(/\s+/g, "-")}`),
    ...document.technologies.map((technology) => `technology/${normalize(technology).replace(/\s+/g, "-")}`),
    ...document.topics,
    ...document.skills,
  ];

  for (const key of lookups) {
    const normalized = normalize(key);
    const direct = cache.byId.get(key) || cache.byId.get(normalized);
    if (direct) related.add(direct);
    (cache.byTitle.get(normalized) || []).forEach((item) => related.add(item));
    (cache.byTag.get(normalized) || []).forEach((item) => related.add(item));
    (cache.byTechnology.get(normalized) || []).forEach((item) => related.add(item));
    (cache.byTopic.get(normalized) || []).forEach((item) => related.add(item));
    (cache.bySkill.get(normalized) || []).forEach((item) => related.add(item));
    (cache.byProject.get(normalized) || []).forEach((item) => related.add(item));
    (cache.byRelatedDocument.get(normalized) || []).forEach((item) => related.add(item));
  }

  return Array.from(related);
}

function scoreDocument(document: KnowledgeDocument, question: string, intent: Intent, cache: KnowledgeSearchCache) {
  const tokens = tokenize(question);
  let score = 0;
  const reasons: string[] = [];
  const matchedTerms = new Set<string>();

  const titleScore = scoreText(question, [document.title], 16);
  if (titleScore) {
    score += titleScore;
    reasons.push(`title: ${document.title}`);
    matchedTerms.add(document.title);
  }

  const summaryScore = scoreText(question, [document.summary, document.excerpt], 6);
  if (summaryScore) {
    score += summaryScore;
    reasons.push("summary");
  }

  const tagMatches = document.tags.filter((tag) => tokens.some((token) => normalize(tag).includes(token) || token.includes(normalize(tag))));
  const topicMatches = document.topics.filter((topic) => tokens.some((token) => normalize(topic).includes(token) || token.includes(normalize(topic))));
  const technologyMatches = document.technologies.filter((technology) => tokens.some((token) => normalize(technology).includes(token) || token.includes(normalize(technology))));
  const projectMatches = document.projects.filter((project) => tokens.some((token) => normalize(project).includes(token) || token.includes(normalize(project))));
  const skillMatches = document.skills.filter((skill) => tokens.some((token) => normalize(skill).includes(token) || token.includes(normalize(skill))));
  const relatedMatches = document.relatedDocuments.filter((relatedDocument) => tokens.some((token) => normalize(relatedDocument).includes(token) || token.includes(normalize(relatedDocument))));

  if (tagMatches.length) {
    score += tagMatches.length * 5;
    tagMatches.forEach((value) => matchedTerms.add(value));
    reasons.push(`tags: ${tagMatches.join(", ")}`);
  }
  if (topicMatches.length) {
    score += topicMatches.length * 4;
    topicMatches.forEach((value) => matchedTerms.add(value));
    reasons.push(`topics: ${topicMatches.join(", ")}`);
  }
  if (technologyMatches.length) {
    score += technologyMatches.length * 6;
    technologyMatches.forEach((value) => matchedTerms.add(value));
    reasons.push(`technologies: ${technologyMatches.join(", ")}`);
  }
  if (projectMatches.length) {
    score += projectMatches.length * 4;
    projectMatches.forEach((value) => matchedTerms.add(value));
    reasons.push(`projects: ${projectMatches.join(", ")}`);
  }
  if (skillMatches.length) {
    score += skillMatches.length * 3;
    skillMatches.forEach((value) => matchedTerms.add(value));
    reasons.push(`skills: ${skillMatches.join(", ")}`);
  }
  if (relatedMatches.length) {
    score += relatedMatches.length * 2;
    relatedMatches.forEach((value) => matchedTerms.add(value));
    reasons.push(`related: ${relatedMatches.join(", ")}`);
  }

  const contentMatch = tokens.some((token) => normalize(document.content).includes(token));
  if (contentMatch) {
    score += 2;
    reasons.push("content");
  }

  const bucketMatches = [
    cache.byCategory.get(document.category)?.length || 0,
    cache.byTitle.get(normalize(document.title))?.length || 0,
  ];
  if (bucketMatches.some(Boolean)) score += 1;

  if (document.category === intent || document.frontmatter.kind === intent) score += 12;
  if (intent === "comparison" && ["technology", "architecture", "philosophy"].includes(document.category)) score += 6;
  if (intent === "career" && document.category === "resume") score += 6;
  if (intent === "leadership" && ["leadership", "philosophy", "resume"].includes(document.category)) score += 6;
  if (intent === "mentoring" && ["leadership", "philosophy", "resume"].includes(document.category)) score += 5;
  if (intent === "pipeline-review" && ["project", "technology", "story"].includes(document.category)) score += 4;
  if (intent === "troubleshooting" && ["story", "technology", "project"].includes(document.category)) score += 4;
  if (intent === "cloud-cost" && ["project", "technology", "story"].includes(document.category)) score += 3;
  if (intent === "architecture" && ["architecture", "technology", "philosophy", "project"].includes(document.category)) score += 6;

  return {
    id: document.id,
    title: document.title,
    category: document.category,
    score,
    reason: reasons,
    matchedTerms: Array.from(matchedTerms),
    sourcePath: document.path,
    summary: document.summary,
    tags: document.tags,
    technologies: document.technologies,
    topics: document.topics,
    sections: document.sections,
    relatedDocuments: document.relatedDocuments,
    content: document.content,
  };
}

function expandWithRelations(hits: KnowledgeHit[], cache: KnowledgeSearchCache) {
  const seen = new Set(hits.map((hit) => hit.id));
  const expansions: KnowledgeHit[] = [];

  for (const hit of hits.slice(0, 4)) {
    const source = cache.byId.get(hit.id);
    if (!source) continue;
    const relatedDocuments = collectRelatedDocuments(source, cache);
    for (const related of relatedDocuments) {
      if (seen.has(related.id)) continue;
      seen.add(related.id);
      expansions.push({
        id: related.id,
        title: related.title,
        category: related.category,
        score: Math.max(1, Math.round(hit.score * 0.55)),
        reason: [`related to ${hit.title}`],
        matchedTerms: [],
        sourcePath: related.path,
        summary: related.summary,
        tags: related.tags,
        technologies: related.technologies,
        topics: related.topics,
        sections: related.sections,
        relatedDocuments: related.relatedDocuments,
        content: related.content,
      });
    }
  }

  return expansions;
}

export function retrieveKnowledge(question: string, intent: Intent, documents: KnowledgeDocument[], cache?: KnowledgeSearchCache): RetrievalContext {
  const activeCache = cache || buildSearchCache(documents);
  const primaryHits = documents
    .map((document) => scoreDocument(document, question, intent, activeCache))
    .filter((document) => document.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 5);

  const expandedHits = expandWithRelations(primaryHits, activeCache);
  const hits = [...primaryHits, ...expandedHits]
    .sort((left, right) => right.score - left.score)
    .filter((hit, index, list) => list.findIndex((candidate) => candidate.id === hit.id) === index)
    .slice(0, 6);

  return {
    intent,
    question,
    documents,
    hits,
    cache: activeCache,
  };
}

