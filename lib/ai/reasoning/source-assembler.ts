import type { GeneratedSection } from "./section-generator";
import type { ReasoningContext, RelatedExperienceItem, ResponseSources, RetrievedDocument } from "./reasoning-types";
import type { UsageTracker } from "./usage-tracker";

export type { ResponseSources };

const SOURCE_SCORE_THRESHOLD = 14;

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sectionText(sections: GeneratedSection[]) {
  return sections
    .map((s) => [s.body, ...(s.bullets || [])].filter(Boolean).join(" "))
    .join(" ");
}

function titleInText(title: string, text: string) {
  const t = normalize(title);
  if (!t || t.length < 3) return false;
  return normalize(text).includes(t);
}

function isPortfolioStackTitle(title: string) {
  return /\b(databricks|delta|gold layer|power bi|kafka)\b/i.test(title);
}

function docMateriallyUsed(
  doc: RetrievedDocument,
  context: ReasoningContext,
  answerText: string,
  tracker: UsageTracker | undefined
) {
  if (tracker?.documentIds.has(doc.id)) return true;
  if (doc.score < SOURCE_SCORE_THRESHOLD) return false;
  if (doc.matchedEntities.length > 0) return true;
  if (doc.reasons.some((r) => r.startsWith("user-tech:") || r.startsWith("entity:"))) return true;
  if (titleInText(doc.title, answerText)) return true;

  if (context.questionType === "EXPLANATION") {
    const target = context.entities.technologies[0]?.label;
    if (target && normalize(doc.title) === normalize(target)) return true;
  }

  if (context.questionType === "ARCHITECTURE_REVIEW") {
    const chain = context.entities.flowEntities.map((e) => e.label);
    if (chain.some((c) => normalize(c) === normalize(doc.title))) return true;
  }

  return false;
}

function filterDesignStackNoise(doc: RetrievedDocument, context: ReasoningContext, answerText: string) {
  if (context.questionType !== "ARCHITECTURE_DESIGN") return true;
  if (!isPortfolioStackTitle(doc.title)) return true;
  return titleInText(doc.title, answerText) || doc.matchedEntities.length > 0;
}

function generalLabels(context: ReasoningContext, usedDocs: RetrievedDocument[], answerText: string, tracker?: UsageTracker) {
  const labels: string[] = [];
  const seen = new Set<string>();

  const add = (label: string) => {
    const key = normalize(label);
    if (!key || seen.has(key)) return;
    seen.add(key);
    labels.push(label);
  };

  if (context.questionType === "ARCHITECTURE_DESIGN") {
    if (context.analysis.processingPattern === "streaming" || /\bstream/i.test(context.question)) {
      add("Streaming architecture patterns");
      add("Event-driven ingestion");
      add("Stream processing and retention");
    }
    if (context.analysis.domain === "IoT" || /\biot\b/i.test(context.question)) {
      add("IoT telemetry and device connectivity");
    }
  }

  if (context.questionType === "ARCHITECTURE_PLACEMENT") {
    add("Reference architecture layering");
    if (/\bpower\s*bi\b/i.test(context.analysis.subject || "")) {
      add("BI architecture");
      add("Semantic layer");
      add("Data serving");
    }
  }

  if (context.questionType === "PERSONAL_EXPERIENCE" || context.questionType === "CAREER") {
    for (const doc of usedDocs) {
      if (doc.category === "leadership" || doc.category === "resume") add(doc.title);
    }
    return labels.slice(0, 4);
  }

  for (const doc of usedDocs) {
    if (doc.category === "architecture") add(doc.title);
    if (doc.category === "story" && doc.score >= 18) {
      add(doc.topics[0] || doc.title);
    }
    if (doc.score >= 18 || tracker?.documentIds.has(doc.id)) {
      for (const topic of doc.topics.slice(0, 1)) add(topic);
    }
  }

  return labels.slice(0, 6);
}

function technologiesFromAnswer(context: ReasoningContext, answerText: string, tracker: UsageTracker | undefined) {
  const techs = new Set<string>();

  for (const entity of [...context.entities.technologies, ...context.entities.flowEntities]) {
    if (entity.kind === "technology") techs.add(entity.label);
  }

  for (const doc of context.documents) {
    if (doc.category !== "technology") continue;
    if (!docMateriallyUsed(doc, context, answerText, tracker)) continue;
    if (!filterDesignStackNoise(doc, context, answerText)) continue;
    techs.add(doc.title);
  }

  if (tracker) {
    for (const t of tracker.technologies) techs.add(t);
  }

  if (context.questionType === "ARCHITECTURE_DESIGN") {
    for (const name of Array.from(techs)) {
      if (isPortfolioStackTitle(name) && !titleInText(name, answerText)) techs.delete(name);
    }
  }

  if (context.questionType === "ARCHITECTURE_REVIEW") {
    const allowed = new Set(context.entities.flowEntities.map((e) => normalize(e.label)));
    for (const name of Array.from(techs)) {
      if (!allowed.has(normalize(name))) techs.delete(name);
    }
  }

  return Array.from(techs);
}

export function assembleSources(
  context: ReasoningContext,
  sections: GeneratedSection[],
  relatedExperience: RelatedExperienceItem[],
  tracker?: UsageTracker
): ResponseSources {
  const answerText = sectionText(sections);

  const usedDocs = context.documents.filter(
    (doc) => docMateriallyUsed(doc, context, answerText, tracker) && filterDesignStackNoise(doc, context, answerText)
  );

  const generalEngineering = generalLabels(context, usedDocs, answerText, tracker);

  const personalExperience: string[] = [];
  for (const doc of usedDocs) {
    if (doc.category === "leadership" || doc.category === "philosophy" || doc.category === "resume") {
      personalExperience.push(doc.title);
    }
  }
  if (tracker) {
    for (const id of tracker.documentIds) {
      const doc = context.documents.find((d) => d.id === id);
      if (doc && (doc.category === "leadership" || doc.category === "resume" || doc.category === "philosophy")) {
        if (!personalExperience.includes(doc.title)) personalExperience.push(doc.title);
      }
    }
  }

  const relatedProjects = relatedExperience.map((item) => item.title);

  const technologiesDiscussed = technologiesFromAnswer(context, answerText, tracker);

  return {
    generalEngineering,
    personalExperience,
    technologiesDiscussed,
    relatedProjects,
  };
}

export function sourcesAreEmpty(sources: ResponseSources) {
  return (
    !sources.generalEngineering.length &&
    !sources.personalExperience.length &&
    !sources.technologiesDiscussed.length &&
    !sources.relatedProjects.length
  );
}
