import type { ComposedResponse } from "../types";
import type {
  BuiltResponse,
  ConfidenceAssessment,
  ReasoningContext,
  ReasoningStrategy,
  RelatedExperienceItem,
  ResponsePlan,
} from "./reasoning-types";
import { generateAllSections, containsBlockedPhrase } from "./section-generator";
import { validateAndRepairSections } from "./validator";
import { assembleSources } from "./source-assembler";
import { createUsageTracker } from "./usage-tracker";
import { responseTitle } from "./response-titles";

function voiceSummary(context: ReasoningContext, _strategy: ReasoningStrategy, density: "concise" | "detailed" = "concise") {
  const v = context.mode === "interview" ? "Let's" : context.mode === "ask" ? "I would" : "I'd";

  switch (context.questionType) {
    case "ARCHITECTURE_DESIGN":
      return isIot(context)
        ? `${v} start an IoT streaming design by clarifying event rate, latency tiers, and retention—then map ingest, processing, storage, and serving.`
        : `${v} define requirements and assumptions first, then propose an architecture matched to the workload—not a default stack.`;
    case "ARCHITECTURE_REVIEW":
      return `${v} review the exact chain you provided, stage by stage, and call out missing reliability, quality, and ops pieces.`;
    case "ARCHITECTURE_PLACEMENT": {
      const tech = context.analysis.subject || "the tool";
      return `${v} explain where ${tech} belongs in a reference stack—consumption vs transformation—and what must exist upstream.`;
    }
    case "COMPONENT_PLACEMENT": {
      const tech = context.analysis.subject || "the component";
      return `${v} explain ${tech}'s role between the stages you named—not a generic greenfield design.`;
    }
    case "INGESTION_RECOMMENDATION":
      return `${v} recommend IoT ingestion patterns after clarifying connectivity, volume, and latency—not a default broker choice.`;
    case "EXPLANATION": {
      const tech = context.analysis.subject || context.entities.technologies[0]?.label || "this topic";
      if (density === "concise") {
        return /power\s*bi/i.test(tech)
          ? `${v} use Power BI at the consumption layer for governed semantic models and self-service—not for heavy transformation.`
          : `${v} choose ${tech} when its operational sweet spot matches the workload—not as a default stack badge.`;
      }
      return `${v} explain ${tech} through fit, trade-offs, and operating model—not generic platform philosophy.`;
    }
    case "COMPARISON":
      return `${v} compare the options on cost, scale, skills, and lock-in for your workload.`;
    case "PROJECT_QUESTION":
      return context.mode === "ask"
        ? "Here's what I can share from documented project notes—I won't invent details that aren't in the portfolio."
        : `${v} answer from documented project context where available, and state clearly if details are missing.`;
    case "PERSONAL_EXPERIENCE":
      if (context.mode === "ask") {
        if (/\b(difficult|hard|challenging|tough)\b/i.test(context.question) && /\bdecision\b/i.test(context.question)) {
          return "One difficult decision that stands out for me is separating operational serving from analytical workloads — reframing the problem from 'which database' to 'which access pattern'.";
        }
        if (/\b(learned|lesson)\b/i.test(context.question)) {
          return "The biggest lessons I've taken from production are about workload fit, operational boundaries, and not forcing one tool to do everything.";
        }
        return "I can share what I actually did and learned from documented project work — without inventing details.";
      }
      return `${v} answer from mentoring and leadership experience where the knowledge base supports it.`;
    case "CAREER":
      return context.mode === "ask"
        ? "I'll summarize career progression from resume and project records—not generic philosophy."
        : `${v} summarize career progression, scope, and impact from resume and project records.`;
    case "PORTFOLIO_OVERVIEW":
      return context.mode === "ask"
        ? "I've worked across several data and platform projects—here are the ones best documented in this portfolio."
        : `${v} list portfolio projects from verified knowledge only.`;
    case "TECHNOLOGIES_OVERVIEW":
      return context.mode === "ask"
        ? "These are technologies that show up in my documented project work—not a generic stack list."
        : `${v} summarize technologies tied to actual projects.`;
    case "INTERVIEW":
      return /\bask me\b/i.test(context.question)
        ? "Here is a system-design interview prompt and how to approach it."
        : `${v} structure the answer the way a strong interview response should sound.`;
    case "COST_ANALYSIS":
      if (/\bsagemaker\b/i.test(context.question)) {
        return `${v} isolate SageMaker first—notebooks, endpoints, training jobs, and storage—before blaming the rest of the AWS bill.`;
      }
      return `${v} break the bill into drivers, quick wins, and structural fixes.`;
    case "SQL_OPTIMIZATION":
      return `${v} reduce data scanned and shuffle cost before micro-optimizing syntax.`;
    case "OPTIMIZATION":
      return /\bspark\b/i.test(context.question)
        ? `${v} reduce Spark cost by cutting shuffle bytes, idle cluster time, and expensive stages—not one-off config tweaks.`
        : `${v} locate the bottleneck stage first, then apply targeted fixes.`;
    default: {
      const modeDefault: Record<string, string> = {
        ask: "I'll answer from what I can share from my documented project and engineering experience.",
        architecture: `${v} assess the architecture question directly and map trade-offs to the workload described.`,
        pipeline: `${v} review what you supplied and call out production gaps with clear severity.`,
        sql: `${v} focus on query shape, scan cost, and execution strategy for this SQL.`,
        cloud: `${v} break down likely cost drivers and practical optimization paths.`,
        interview: `${v} coach this as a senior interviewer would — clear, structured, and actionable.`,
      };
      return modeDefault[context.mode] || `${v} address the question with mode-appropriate engineering depth.`;
    }
  }
}

function isIot(context: ReasoningContext) {
  return context.analysis.domain === "IoT" || /\biot\b/i.test(context.question);
}

function buildRelatedExperience(context: ReasoningContext): RelatedExperienceItem[] {
  if (context.questionType === "COST_ANALYSIS" && !context.entities.projects.length) {
    return [];
  }
  if (context.questionType === "SQL_OPTIMIZATION") {
    return [];
  }
  if (context.questionType === "INTERVIEW") {
    return [];
  }
  const items: RelatedExperienceItem[] = [];
  for (const doc of context.documents) {
    if (doc.category !== "project") continue;
    if (doc.score < 14) continue;
    if (context.questionType === "ARCHITECTURE_DESIGN") {
      const relevant =
        doc.matchedEntities.length > 0 ||
        (/\b(stream|iot|kafka|telemetry)\b/i.test(doc.content) && (context.analysis.processingPattern === "streaming" || /\biot\b/i.test(context.question)));
      if (!relevant) continue;
    }
    if (context.questionType === "EXPLANATION") {
      const tech = context.entities.technologies[0]?.label;
      if (tech && !doc.technologies.some((t) => t.toLowerCase().includes(tech.toLowerCase()))) continue;
      if (doc.score < 20 && !doc.matchedEntities.length) continue;
    }
    if (context.questionType === "ARCHITECTURE_PLACEMENT" || context.questionType === "ARCHITECTURE_REVIEW") {
      const chain = context.entities.flowEntities.map((e) => e.label.toLowerCase());
      const subject = (context.analysis.subject || "").toLowerCase();
      const touchesChain =
        chain.some((c) => doc.technologies.some((t) => t.toLowerCase().includes(c)) || doc.content.toLowerCase().includes(c)) ||
        doc.technologies.some((t) => subject && t.toLowerCase().includes(subject.split(" ")[0]));
      if (!touchesChain || doc.score < 30) continue;
    }
    const relevance = doc.matchedEntities.length
      ? `Relevant because this project aligns with ${doc.matchedEntities.slice(0, 3).join(", ")} in your question.`
      : `Relevant because the project involved ${doc.topics.slice(0, 2).join(" and ") || "similar platform patterns"}.`;
    const confidence: RelatedExperienceItem["confidence"] =
      doc.score >= 40 && doc.matchedEntities.length ? "high" : doc.score >= 25 ? "medium" : "low";
    if (confidence === "low") continue;
    items.push({
      title: doc.title,
      project: doc.title,
      relevance,
      relevanceReason: relevance,
      confidence,
    });
  }
  return items.slice(0, 2);
}

export function buildResponse(
  context: ReasoningContext,
  strategy: ReasoningStrategy,
  plan: ResponsePlan,
  confidence: ConfidenceAssessment,
  followUps: import("./reasoning-types").FollowUpSuggestion[],
  density: "concise" | "detailed" = "concise"
): BuiltResponse {
  const usage = createUsageTracker();
  const generated = generateAllSections(plan.sections, context, usage);
  let sections = validateAndRepairSections(generated, context, plan.sections, usage);

  const relatedExperience = buildRelatedExperience(context);

  if (relatedExperience.length && context.questionType !== "EXPLANATION") {
    sections.push({
      heading: "Related experience",
      bullets: relatedExperience.map((item) => `${item.title} — ${item.relevance}`),
    });
  }

  const sources = assembleSources(context, sections, relatedExperience, usage);

  if (confidence.shouldClarify && confidence.missingPieces.length) {
    sections.push({
      heading: "Clarifying questions",
      bullets: confidence.missingPieces.map((piece) => `I need ${piece} to tighten this answer.`),
    });
  }

  const summary = voiceSummary(context, strategy, density);
  const persona = context.mode === "ask" ? "first-person" : context.mode === "interview" ? "first-person" : "first-person";

  const citations = context.documents
    .filter((d) => usage.documentIds.has(d.id) || d.score >= 18)
    .slice(0, 6)
    .map((d) => d.id);

  return {
    title: responseTitle(context),
    summary: containsBlockedPhrase(summary) ? voiceSummary(context, strategy, density) : summary,
    sections,
    followUps,
    citations,
    persona,
    intent: context.intent.primary,
    sourceCount: citations.length,
    sources,
    density,
    strategyId: strategy.id,
    primaryIntent: strategy.primaryIntent,
    secondaryIntents: context.intent.secondary,
    confidence,
    relatedExperience,
  };
}
