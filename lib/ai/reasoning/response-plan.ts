import type { QuestionType } from "./input-analyzer";
import type { ReasoningContext, ReasoningStrategy, PlannedSection, ResponsePlan } from "./reasoning-types";

function planForArchitectureDesign(context: ReasoningContext): PlannedSection[] {
  const streaming = context.analysis.processingPattern === "streaming" || /\bstream/i.test(context.question);
  const iot = context.analysis.domain === "IoT";

  return [
    { name: "Architecture Goal", purpose: "Define what the system must accomplish", kind: "body", generatorId: "arch-goal" },
    { name: "Requirements / Assumptions", purpose: "State explicit requirements and assumptions", kind: "bullets", generatorId: "arch-requirements" },
    { name: "Recommended Architecture", purpose: "Propose a concrete architecture", kind: "body", generatorId: "arch-recommended" },
    { name: "Data Flow", purpose: "Explain movement of data end to end", kind: "bullets", generatorId: "arch-data-flow" },
    { name: "Ingestion", purpose: "Describe ingestion layer choices", kind: "bullets", generatorId: "arch-ingestion" },
    { name: "Processing", purpose: "Describe stream/batch processing", kind: "bullets", generatorId: "arch-processing" },
    { name: "Storage", purpose: "Describe storage semantics", kind: "bullets", generatorId: "arch-storage" },
    { name: "Serving", purpose: "Describe consumption/serving layer", kind: "bullets", generatorId: "arch-serving" },
    { name: "Observability", purpose: "Monitoring, metrics, and tracing for this design", kind: "bullets", generatorId: "arch-observability" },
    { name: "Data Quality", purpose: "Validation, schema, and quality controls", kind: "bullets", generatorId: "arch-quality" },
    { name: "Security", purpose: "Security controls specific to this design", kind: "bullets", generatorId: "arch-security" },
    { name: "Scalability", purpose: "How the design scales under load", kind: "bullets", generatorId: "arch-scalability" },
    { name: "Failure Handling", purpose: "Resilience, replay, and recovery", kind: "bullets", generatorId: "arch-failure" },
    { name: "Cost Considerations", purpose: "Cost drivers for this architecture", kind: "bullets", generatorId: "arch-cost" },
    { name: "Trade-offs", purpose: "Alternatives and trade-offs", kind: "bullets", generatorId: "arch-tradeoffs" },
    { name: "Alternative Designs", purpose: "Viable alternative patterns", kind: "bullets", generatorId: "arch-alternatives" },
    { name: "Questions I'd Ask", purpose: "Clarifying questions before finalizing", kind: "bullets", generatorId: "arch-questions" },
  ].filter((section) => {
    if (!streaming && (section.generatorId === "arch-ingestion" || section.generatorId === "arch-processing")) return true;
    return true;
  });
}

function planForArchitecturePlacement(context: ReasoningContext): PlannedSection[] {
  const subject = context.analysis.subject || "the tool";
  return [
    { name: "Architecture placement", purpose: `Where ${subject} belongs in a reference stack`, kind: "body", generatorId: "place-summary" },
    { name: "Reference flow", purpose: "End-to-end layers from sources to consumers", kind: "bullets", generatorId: "place-flow" },
    { name: "What happens upstream", purpose: "Prerequisites before this layer", kind: "bullets", generatorId: "place-upstream" },
    { name: `What ${subject} owns`, purpose: "Responsibilities at this layer", kind: "bullets", generatorId: "place-owns" },
    { name: `What ${subject} should not own`, purpose: "Anti-patterns and boundaries", kind: "bullets", generatorId: "place-not-owns" },
    { name: "Semantic model & serving", purpose: "Models, refresh, DirectQuery", kind: "bullets", generatorId: "place-semantic" },
    { name: "Example stack", purpose: "Concrete layering example", kind: "bullets", generatorId: "place-example" },
    { name: "Relevant experience", purpose: "Grounded project tie-in if any", kind: "bullets", generatorId: "place-experience", optional: true } as PlannedSection & { optional?: boolean },
  ];
}

function planForComponentPlacement(context: ReasoningContext): PlannedSection[] {
  const subject = context.analysis.subject || context.entities.technologies[0]?.label || "the component";
  return [
    { name: `${subject} in this chain`, purpose: `Role of ${subject} between adjacent stages`, kind: "body", generatorId: "component-role-summary" },
    { name: "Inputs & outputs", purpose: "Data contracts at boundaries", kind: "bullets", generatorId: "component-io" },
    { name: "Processing responsibilities", purpose: "What transforms happen here", kind: "bullets", generatorId: "component-processing" },
    { name: "Failure & replay", purpose: "Checkpointing and recovery", kind: "bullets", generatorId: "component-failure" },
    { name: "Observability", purpose: "Metrics for this stage", kind: "bullets", generatorId: "component-observability" },
    { name: "Common mistakes", purpose: "What teams get wrong at this stage", kind: "bullets", generatorId: "component-mistakes" },
  ];
}

function planForIngestionRecommendation(context: ReasoningContext): PlannedSection[] {
  return [
    { name: "Ingestion goal", purpose: "What ingestion must satisfy for this domain", kind: "body", generatorId: "ingest-goal" },
    { name: "Requirements to clarify", purpose: "Volume, latency, connectivity assumptions", kind: "bullets", generatorId: "ingest-requirements" },
    { name: "Recommended patterns", purpose: "Ingestion options matched to constraints", kind: "bullets", generatorId: "ingest-patterns" },
    { name: "Trade-offs", purpose: "Managed vs self-operated, cost, ops", kind: "bullets", generatorId: "ingest-tradeoffs" },
    { name: "Questions I'd ask", purpose: "Clarifying questions", kind: "bullets", generatorId: "ingest-questions" },
  ];
}

function planForArchitectureReview(context: ReasoningContext): PlannedSection[] {
  const components = context.entities.flowEntities.length
    ? context.entities.flowEntities.map((e) => e.label)
    : context.analysis.architectureComponents;

  const componentSections: PlannedSection[] = components.slice(0, 6).map((name, idx) => ({
    name: `Component: ${name}`,
    purpose: `Analyze the role and risks of ${name} in the user's chain`,
    kind: "bullets" as const,
    generatorId: `review-component-${idx}`,
  }));

  return [
    { name: "Architecture Overview", purpose: "Summarize the submitted architecture chain", kind: "body", generatorId: "review-overview" },
    ...componentSections,
    { name: "Stage connections", purpose: "Evaluate handoffs between components", kind: "bullets", generatorId: "review-connections" },
    { name: "Missing Components", purpose: "Identify gaps in the provided chain", kind: "bullets", generatorId: "review-gaps" },
    { name: "Reliability Risks", purpose: "Failure modes for this chain", kind: "bullets", generatorId: "review-reliability" },
    { name: "Operational Concerns", purpose: "Operations and ownership gaps", kind: "bullets", generatorId: "review-ops" },
    { name: "Monitoring", purpose: "Observability specific to this chain", kind: "bullets", generatorId: "review-monitoring" },
    { name: "Governance", purpose: "Lineage, catalog, and access", kind: "bullets", generatorId: "review-governance" },
    { name: "Security", purpose: "Security gaps for this chain", kind: "bullets", generatorId: "review-security" },
    { name: "Suggested Improvements", purpose: "Targeted improvements", kind: "bullets", generatorId: "review-improvements" },
    { name: "Questions I'd Ask", purpose: "Clarifying questions", kind: "bullets", generatorId: "review-questions" },
  ];
}

function planForExplanation(context: ReasoningContext): PlannedSection[] {
  const tech = context.entities.technologies[0]?.label || context.analysis.technologies[0] || "";
  if (/\bpower\s*bi\b/i.test(tech) || /\bpower\s*bi\b/i.test(context.question)) {
    return [
      { name: "My perspective", purpose: "Grounded personal view from knowledge base", kind: "body", generatorId: "explain-pbi-perspective" },
      { name: "Why it made sense", purpose: "Decision drivers for choosing Power BI", kind: "bullets", generatorId: "explain-pbi-why" },
      { name: "Technical considerations", purpose: "Models, refresh, identity, performance", kind: "bullets", generatorId: "explain-pbi-technical" },
      { name: "Trade-offs", purpose: "Licensing, modeling, and ops trade-offs", kind: "bullets", generatorId: "explain-pbi-tradeoffs" },
      { name: "When I would not choose it", purpose: "Anti-patterns and misfits", kind: "bullets", generatorId: "explain-pbi-avoid" },
      { name: "Alternatives", purpose: "Credible alternatives and comparisons", kind: "bullets", generatorId: "explain-pbi-alternatives" },
      { name: "Relevant experience", purpose: "Project tie-in only if documented", kind: "bullets", generatorId: "explain-pbi-experience", optional: true } as PlannedSection & { optional?: boolean },
    ];
  }

  return [
    { name: "Executive Summary", purpose: "Direct answer to the explanation question", kind: "body", generatorId: "explain-summary" },
    { name: "What It Is", purpose: "Define the technology or concept", kind: "bullets", generatorId: "explain-what" },
    { name: "When It Fits", purpose: "Appropriate use cases", kind: "bullets", generatorId: "explain-when-fit" },
    { name: "When to Avoid It", purpose: "Anti-patterns and misfits", kind: "bullets", generatorId: "explain-when-avoid" },
    { name: "Trade-offs", purpose: "Key trade-offs", kind: "bullets", generatorId: "explain-tradeoffs" },
  ];
}

function planForComparison(): PlannedSection[] {
  return [
    { name: "Executive Summary", purpose: "Comparison conclusion upfront", kind: "body", generatorId: "compare-summary" },
    { name: "Comparison Dimensions", purpose: "Dimensions used to compare", kind: "bullets", generatorId: "compare-dimensions" },
    { name: "Option A — Strengths", purpose: "Strengths of first option", kind: "bullets", generatorId: "compare-a-pros" },
    { name: "Option A — Weaknesses", purpose: "Weaknesses of first option", kind: "bullets", generatorId: "compare-a-cons" },
    { name: "Option B — Strengths", purpose: "Strengths of second option", kind: "bullets", generatorId: "compare-b-pros" },
    { name: "Option B — Weaknesses", purpose: "Weaknesses of second option", kind: "bullets", generatorId: "compare-b-cons" },
    { name: "Recommendation", purpose: "Which to choose under which constraints", kind: "body", generatorId: "compare-recommendation" },
  ];
}

function planForProject(): PlannedSection[] {
  return [
    { name: "Executive Summary", purpose: "Project overview", kind: "body", generatorId: "project-summary" },
    { name: "Business Context", purpose: "Business problem", kind: "body", generatorId: "project-context" },
    { name: "Architecture", purpose: "Architecture delivered", kind: "bullets", generatorId: "project-architecture" },
    { name: "Engineering Decisions", purpose: "Key decisions", kind: "bullets", generatorId: "project-decisions" },
    { name: "Outcomes", purpose: "Impact and outcomes", kind: "bullets", generatorId: "project-outcomes" },
    { name: "Lessons Learned", purpose: "Lessons from delivery", kind: "bullets", generatorId: "project-lessons" },
  ];
}

function planForMentoring(): PlannedSection[] {
  return [
    { name: "Executive Summary", purpose: "Answer the mentoring/people question", kind: "body", generatorId: "mentor-summary" },
    { name: "How I Mentor", purpose: "Mentoring approach", kind: "bullets", generatorId: "mentor-approach" },
    { name: "Examples", purpose: "Concrete examples if available", kind: "bullets", generatorId: "mentor-examples" },
    { name: "What I Optimize For", purpose: "Outcomes mentoring targets", kind: "bullets", generatorId: "mentor-outcomes" },
  ];
}

function planForInterview(context: ReasoningContext): PlannedSection[] {
  if (/\bask me\b/i.test(context.question)) {
    return [
      { name: "Interview Prompt", purpose: "Present the interview question", kind: "body", generatorId: "interview-prompt" },
      { name: "How to Approach It", purpose: "Framework for answering", kind: "bullets", generatorId: "interview-approach" },
      { name: "Follow-up Probes", purpose: "Harder follow-ups an interviewer might ask", kind: "bullets", generatorId: "interview-probes" },
    ];
  }
  const behavioral =
    /\btell me about\b/i.test(context.question) ||
    /\bdifficult\b.*\b(decision|problem|challenge|situation|conflict|incident)\b/i.test(context.question);
  if (behavioral) {
    return [
      { name: "What they're testing", purpose: "Interview intent", kind: "body", generatorId: "interview-summary" },
      { name: "Strong answer (STAR)", purpose: "Structured guidance", kind: "bullets", generatorId: "interview-answer" },
      { name: "What strong answers include", purpose: "Rubric", kind: "bullets", generatorId: "interview-rubric" },
      { name: "Weak answers to avoid", purpose: "Anti-patterns", kind: "bullets", generatorId: "interview-weak-answers" },
    ];
  }
  return [
    { name: "Executive Summary", purpose: "Interview guidance summary", kind: "body", generatorId: "interview-summary" },
    { name: "How I Would Answer", purpose: "Structured answer guidance", kind: "bullets", generatorId: "interview-answer" },
    { name: "What Strong Answers Include", purpose: "Rubric", kind: "bullets", generatorId: "interview-rubric" },
  ];
}

function planForCost(): PlannedSection[] {
  return [
    { name: "Executive Summary", purpose: "Cost issue summary", kind: "body", generatorId: "cost-summary" },
    { name: "Major Cost Drivers", purpose: "Drivers for this environment", kind: "bullets", generatorId: "cost-drivers" },
    { name: "Quick Wins", purpose: "Low-risk optimizations", kind: "bullets", generatorId: "cost-quick-wins" },
    { name: "Structural Changes", purpose: "Architecture-level savings", kind: "bullets", generatorId: "cost-structural" },
    { name: "Monitoring Cost", purpose: "How to track spend", kind: "bullets", generatorId: "cost-monitoring" },
  ];
}

function planForSql(): PlannedSection[] {
  return [
    { name: "Executive Summary", purpose: "SQL optimization summary", kind: "body", generatorId: "sql-summary" },
    { name: "Query Shape Issues", purpose: "Structural problems", kind: "bullets", generatorId: "sql-shape" },
    { name: "Recommended Rewrites", purpose: "Specific improvements", kind: "bullets", generatorId: "sql-rewrites" },
    { name: "Execution Considerations", purpose: "Plans, partitions, shuffles", kind: "bullets", generatorId: "sql-exec" },
  ];
}

function planForOptimization(): PlannedSection[] {
  return [
    { name: "Executive Summary", purpose: "Performance issue framing", kind: "body", generatorId: "perf-summary" },
    { name: "Likely Bottlenecks", purpose: "Where time is spent", kind: "bullets", generatorId: "perf-bottlenecks" },
    { name: "Optimization Steps", purpose: "Ordered optimization steps", kind: "bullets", generatorId: "perf-steps" },
    { name: "Validation", purpose: "How to verify improvements", kind: "bullets", generatorId: "perf-validate" },
  ];
}

export function buildResponsePlan(context: ReasoningContext, strategy: ReasoningStrategy): ResponsePlan {
  let sections: PlannedSection[] = [];

  switch (context.questionType) {
    case "ARCHITECTURE_DESIGN":
      sections = planForArchitectureDesign(context);
      break;
    case "ARCHITECTURE_REVIEW":
      sections = planForArchitectureReview(context);
      break;
    case "ARCHITECTURE_PLACEMENT":
      sections = planForArchitecturePlacement(context);
      break;
    case "COMPONENT_PLACEMENT":
      sections = planForComponentPlacement(context);
      break;
    case "INGESTION_RECOMMENDATION":
      sections = planForIngestionRecommendation(context);
      break;
    case "EXPLANATION":
      sections = planForExplanation(context);
      break;
    case "COMPARISON":
      sections = planForComparison();
      break;
    case "PROJECT_QUESTION":
      sections = planForProject();
      break;
    case "PERSONAL_EXPERIENCE":
      if (context.analysis.subject && /\bwhy did you (use|choose)\b/i.test(context.question)) {
        sections = planForExplanation(context);
      } else {
        sections = planForMentoring();
      }
      break;
    case "CAREER":
      sections = planForProject().slice(0, 4);
      break;
    case "INTERVIEW":
      sections = planForInterview(context);
      break;
    case "COST_ANALYSIS":
      sections = planForCost();
      break;
    case "SQL_OPTIMIZATION":
      sections = planForSql();
      break;
    case "OPTIMIZATION":
      sections = planForOptimization();
      break;
    case "PORTFOLIO_OVERVIEW":
    case "TECHNOLOGIES_OVERVIEW":
      break;
    default:
      sections = strategy.sectionTemplates.map((template) => ({
        name: template.heading,
        purpose: `Address ${template.heading} for this question`,
        kind: template.kind,
        generatorId: `legacy-${template.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      }));
  }

  return {
    questionType: context.questionType,
    strategyId: strategy.id,
    sections,
  };
}
