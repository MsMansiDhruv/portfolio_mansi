import type { ConfidenceAssessment, ReasoningContext, ReasoningStrategy } from "./reasoning-types";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function assessConfidence(context: ReasoningContext, strategy: ReasoningStrategy): ConfidenceAssessment {
  const reasons: string[] = [];
  const missingPieces: string[] = [];

  const intentScore = context.intent.confidence;
  const entityScore = context.entities.confidence;
  const retrievalScore = clamp((context.primaryDocuments.length * 0.22) + (context.supportingDocuments.length * 0.08));
  const strategyScore = clamp(
    strategy.sectionTemplates.filter((template) => !template.optional).length / Math.max(strategy.sectionTemplates.length, 1)
  );

  let score = clamp(intentScore * 0.38 + entityScore * 0.22 + retrievalScore * 0.25 + strategyScore * 0.15);

  if (context.entities.flowEntities.length > 1) {
    score += 0.08;
    reasons.push("multi-entity flow detected");
  }

  if (context.primaryDocuments.length >= 2) {
    score += 0.05;
    reasons.push("multiple primary documents retrieved");
  }

  if (context.intent.primary === "architecture-review" && context.entities.flowEntities.length > 1) {
    score += 0.06;
    reasons.push("architecture flow match");
  }

  if (context.intent.primary === "technology-explanation" && context.entities.technologies.length > 0) {
    score += 0.05;
    reasons.push("technology entity match");
  }

  if (context.intent.primary === "technology-comparison" && context.entities.entities.length >= 2) {
    score += 0.08;
    reasons.push("comparison entities found");
  }

  if (context.intent.primary === "project-discussion" && context.entities.projects.length > 0) {
    score += 0.08;
    reasons.push("project entity match");
  }

  if (!context.entities.entities.length) missingPieces.push("specific entities");
  if (!context.primaryDocuments.length) missingPieces.push("grounded source documents");
  if (context.intent.primary === "technology-comparison" && context.entities.entities.length < 2) missingPieces.push("second comparison target");
  if (context.intent.primary === "project-discussion" && context.entities.projects.length === 0) missingPieces.push("project name");
  if (context.intent.primary === "architecture-review" && context.entities.flowEntities.length < 2) missingPieces.push("explicit system flow");
  if (context.intent.primary === "cloud-cost-review") missingPieces.push("usage volumes or environment size");
  if (context.intent.primary === "sql-review") missingPieces.push("query text or schema details");

  score = clamp(score);

  const level: ConfidenceAssessment["level"] = score >= 0.75 ? "high" : score >= 0.5 ? "medium" : "low";
  const shouldClarify = level === "low" || (strategy.clarifyWhenLowConfidence && score < 0.6);

  if (level === "low") reasons.push("low retrieval confidence");
  if (shouldClarify) reasons.push("clarification required");

  return {
    score,
    level,
    reasons,
    shouldClarify,
    missingPieces: Array.from(new Set(missingPieces)),
  };
}
