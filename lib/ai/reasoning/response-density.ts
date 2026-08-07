import type { QuestionType } from "./input-analyzer";
import type { ModeAgentConfig } from "../mode-agents";
import type { PlannedSection, ReasoningContext, ResponsePlan } from "./reasoning-types";
import type { ResponseDensity } from "../generate-ai-response";

function compactTechnologyDecision(context: ReasoningContext): PlannedSection[] {
  const subject = context.analysis.subject || context.entities.technologies[0]?.label || "this technology";
  return [
    { name: "Short answer", purpose: "Verdict in 1-2 sentences", kind: "body", generatorId: "tech-verdict" },
    { name: "Why it fits", purpose: "When this technology makes sense", kind: "bullets", generatorId: "tech-why-fit" },
    { name: "When I would not use it", purpose: "Anti-patterns", kind: "bullets", generatorId: "tech-avoid" },
    { name: "Key trade-off", purpose: "Main trade-off", kind: "body", generatorId: "tech-tradeoff" },
    { name: "Relevant experience", purpose: "Portfolio tie-in if grounded", kind: "bullets", generatorId: "tech-experience", optional: true } as PlannedSection & {
      optional?: boolean;
    },
  ].map((s) => ({ ...s, name: s.name.replace("this technology", subject) }));
}

function compactPipelineReview(context: ReasoningContext): PlannedSection[] {
  return [
    { name: "Architecture verdict", purpose: "2-4 sentence summary", kind: "body", generatorId: "pipe-verdict" },
    { name: "What works", purpose: "Strengths of the supplied chain", kind: "bullets", generatorId: "pipe-works" },
    { name: "What I'd change", purpose: "Prioritized improvements", kind: "bullets", generatorId: "pipe-changes" },
    { name: "Biggest risk", purpose: "Top reliability/ops risks", kind: "bullets", generatorId: "pipe-risk" },
    { name: "Recommended target state", purpose: "Compact target diagram", kind: "bullets", generatorId: "pipe-target" },
  ];
}

function mediumArchitectureDesign(context: ReasoningContext): PlannedSection[] {
  return [
    { name: "Architecture goal", purpose: "Outcomes", kind: "body", generatorId: "arch-goal" },
    { name: "Requirements / assumptions", purpose: "Assumptions", kind: "bullets", generatorId: "arch-requirements" },
    { name: "Recommended architecture", purpose: "Core design", kind: "body", generatorId: "arch-recommended" },
    { name: "Data flow", purpose: "End-to-end flow", kind: "bullets", generatorId: "arch-data-flow" },
    { name: "Reliability & failure handling", purpose: "Resilience", kind: "bullets", generatorId: "arch-failure" },
    { name: "Trade-offs", purpose: "Alternatives", kind: "bullets", generatorId: "arch-tradeoffs" },
    { name: "Questions I'd ask", purpose: "Clarifications", kind: "bullets", generatorId: "arch-questions" },
  ];
}

function compactPlacement(context: ReasoningContext): PlannedSection[] {
  const subject = context.analysis.subject || "the tool";
  return [
    { name: "Placement", purpose: "Where it sits", kind: "body", generatorId: "place-summary" },
    { name: "Reference flow", purpose: "Layer diagram", kind: "bullets", generatorId: "place-flow" },
    { name: `What ${subject} owns`, purpose: "Responsibilities", kind: "bullets", generatorId: "place-owns" },
    { name: `What ${subject} should not own`, purpose: "Boundaries", kind: "bullets", generatorId: "place-not-owns" },
    { name: "Serving & refresh", purpose: "Semantic/refresh notes", kind: "bullets", generatorId: "place-semantic" },
  ];
}

function portfolioOverviewPlan(): PlannedSection[] {
  return [
    { name: "Projects I've worked on", purpose: "Portfolio list from KB", kind: "bullets", generatorId: "portfolio-projects" },
    { name: "How my role evolved", purpose: "Career arc if known", kind: "body", generatorId: "portfolio-role" },
  ];
}

function technologiesOverviewPlan(): PlannedSection[] {
  return [
    { name: "Technologies", purpose: "Grouped tech from projects", kind: "bullets", generatorId: "portfolio-tech" },
  ];
}

function compactSageMakerCost(): PlannedSection[] {
  return [
    { name: "SageMaker focus", purpose: "Isolate SageMaker spend", kind: "body", generatorId: "cost-summary" },
    { name: "Likely SageMaker drivers", purpose: "Top cost drivers", kind: "bullets", generatorId: "cost-drivers" },
    { name: "Quick wins", purpose: "Immediate savings", kind: "bullets", generatorId: "cost-quick-wins" },
    { name: "What I need to narrow it down", purpose: "Clarifying inputs", kind: "bullets", generatorId: "cost-sagemaker-ask" },
    { name: "Structural changes", purpose: "Architecture-level savings", kind: "bullets", generatorId: "cost-structural" },
  ];
}

export function applyDensityAndMode(
  context: ReasoningContext,
  base: ResponsePlan,
  density: ResponseDensity,
  agent: ModeAgentConfig
): ResponsePlan {
  let sections = base.sections;
  const qt = context.questionType;

  if (qt === "PORTFOLIO_OVERVIEW") {
    sections = portfolioOverviewPlan();
  } else if (qt === "TECHNOLOGIES_OVERVIEW") {
    sections = technologiesOverviewPlan();
  } else if (density === "concise") {
    if (qt === "EXPLANATION" || (qt === "PERSONAL_EXPERIENCE" && context.analysis.subject)) {
      sections = compactTechnologyDecision(context);
    } else if (agent.id === "pipeline" && (qt === "ARCHITECTURE_REVIEW" || qt === "COMPONENT_PLACEMENT")) {
      sections = compactPipelineReview(context);
    } else if (qt === "ARCHITECTURE_PLACEMENT") {
      sections = compactPlacement(context);
    } else if (qt === "ARCHITECTURE_DESIGN") {
      if (density === "detailed") sections = base.sections;
      else sections = mediumArchitectureDesign(context);
    } else if (agent.id === "pipeline" && qt === "ARCHITECTURE_REVIEW") {
      sections = compactPipelineReview(context);
    } else if (qt === "ARCHITECTURE_REVIEW" && agent.id === "architecture") {
      sections = compactPipelineReview(context);
    } else if (qt === "COMPARISON") {
      sections = base.sections.slice(0, 5);
    } else if (qt === "PROJECT_QUESTION") {
      sections = base.sections.slice(0, 4);
    } else if (qt === "COST_ANALYSIS") {
      sections = /\bsagemaker\b/i.test(context.question) ? compactSageMakerCost() : base.sections.slice(0, 4);
    }
  }

  if (density === "concise" && sections.length > agent.maxPrimarySections + 2) {
    sections = sections.slice(0, agent.maxPrimarySections);
  }

  const primaryCount = Math.min(sections.length, agent.maxPrimarySections);
  sections = sections.map((section, index) => ({
    ...section,
    tier: index < primaryCount ? ("primary" as const) : ("detail" as const),
  }));

  return { ...base, sections, density };
}
