import { PROJECT_META } from "@/lib/data/project-meta";
import type { ModeAgentConfig } from "../mode-agents";
import type { ReasoningContext, RelatedProjectLink } from "../reasoning/reasoning-types";
import { knowledgeIdToPageSlug, projectHref } from "./project-slugs";

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function addProject(
  map: Map<string, RelatedProjectLink>,
  slug: string | null,
  reason: string,
  relevance: "high" | "medium"
) {
  if (!slug || !PROJECT_META[slug]) return;
  const meta = PROJECT_META[slug];
  const existing = map.get(slug);
  if (existing && existing.relevance === "high") return;
  map.set(slug, {
    title: meta.title,
    slug,
    href: projectHref(slug),
    reason,
    relevance,
  });
}

function isGeneralStoryQuestion(question: string): boolean {
  return (
    (/\b(difficult|hard|challenging|tough)\b/i.test(question) &&
      /\b(engineering )?(decision|problem|challenge|situation|trade-off)\b/i.test(question)) ||
    /\bwhat have you learned\b/i.test(question) ||
    /\bwhat did you learn\b/i.test(question) ||
    /\bhow do you (approach|think about|handle)\b/i.test(question) ||
    /\btell me about yourself\b/i.test(question)
  );
}

function mentionsSpecificProject(context: ReasoningContext): boolean {
  if (context.entities.projects.length) return true;
  return /\b(brain|olap|amc|datalake|intelligence pipeline|gpu|legacy data|modernization|workload architecture)\b/i.test(
    context.question
  );
}

export function discoverRelatedProjects(context: ReasoningContext, agent: ModeAgentConfig): RelatedProjectLink[] {
  if (agent.id !== "ask") return [];

  const personalQuestion =
    context.questionType === "PROJECT_QUESTION" ||
    context.questionType === "PERSONAL_EXPERIENCE" ||
    context.questionType === "CAREER" ||
    /\b(tell me about|why did you|what did you|your experience|what have you learned|how did you)\b/i.test(context.question);

  if (!personalQuestion) return [];

  if (isGeneralStoryQuestion(context.question) && !mentionsSpecificProject(context)) {
    return [];
  }

  const map = new Map<string, RelatedProjectLink>();

  for (const project of context.entities.projects) {
    const slug = knowledgeIdToPageSlug(project.label);
    addProject(map, slug, `Matches "${project.label}" from your question.`, "high");
  }

  if (context.questionType === "PROJECT_QUESTION" || mentionsSpecificProject(context)) {
    for (const doc of context.primaryDocuments) {
      if (doc.category === "project" && doc.score >= 14) {
        const slug = knowledgeIdToPageSlug(doc.id) || knowledgeIdToPageSlug(doc.title);
        addProject(
          map,
          slug,
          doc.summary ? doc.summary.slice(0, 160) : `Portfolio project: ${doc.title}.`,
          "high"
        );
      }
    }
  }

  const topicMatches: Array<{ pattern: RegExp; slug: string; reason: string }> = [
    {
      pattern: /\b(ml pipeline|machine learning|allocation|brain)\b/i,
      slug: "brain-mvp",
      reason: "Covers ML pipeline productionization and allocation-engine work.",
    },
    {
      pattern: /\b(web intelligence|automated extraction|crawler|scrapy)\b/i,
      slug: "automated-intelligence-pipeline",
      reason: "Covers automated web extraction and intelligence pipeline engineering.",
    },
    {
      pattern: /\b(cloud migration|datalake|legacy etl|modernization|amc)\b/i,
      slug: "project-amc-datalake-solution",
      reason: "Covers legacy data modernization and lake/warehouse migration patterns.",
    },
    {
      pattern: /\b(olap|redshift|workload[- ]specific|dynamodb|point lookup)\b/i,
      slug: "olap-workload-architecture",
      reason: "Demonstrates workload separation and database selection from access patterns.",
    },
    {
      pattern: /\b(gpu|cuda|benchmark)\b/i,
      slug: "gpu-bench",
      reason: "Covers GPU benchmarking and performance evidence.",
    },
  ];

  const haystack = normalize(context.question);
  for (const match of topicMatches) {
    if (match.pattern.test(haystack)) {
      addProject(map, match.slug, match.reason, "medium");
    }
  }

  return Array.from(map.values())
    .sort((a, b) => (a.relevance === b.relevance ? 0 : a.relevance === "high" ? -1 : 1))
    .slice(0, 2);
}
