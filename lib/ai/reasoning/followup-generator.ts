import type { ComposedResponse } from "../types";
import type { ReasoningContext, ReasoningStrategy, ConfidenceAssessment } from "./reasoning-types";
import { getModeAgent } from "../mode-agents";

function followKey(item: { label: string; targetAction?: string; targetSubject?: string }) {
  return [item.targetAction || "", item.targetSubject || "", item.label.toLowerCase()].join("|");
}

function pushFollowUp(list: import("./reasoning-types").FollowUpSuggestion[], item: import("./reasoning-types").FollowUpSuggestion) {
  const key = followKey(item);
  if (list.some((existing) => followKey(existing) === key)) return;
  if (list.some((existing) => existing.label.toLowerCase() === item.label.toLowerCase())) return;
  list.push(item);
}

export function generateFollowUps(
  context: ReasoningContext,
  strategy: ReasoningStrategy,
  confidence: ConfidenceAssessment,
  draft?: ComposedResponse
) {
  const followUps: import("./reasoning-types").FollowUpSuggestion[] = [];
  const q = context.question;
  const subject = context.analysis.subject || context.entities.technologies[0]?.label || "";
  const mode = getModeAgent(String(context.mode));

  if (confidence.shouldClarify) {
    pushFollowUp(followUps, {
      label: "Can you share volume, latency, or environment size so I can tighten this answer?",
      targetAction: "explain",
      targetSubject: subject,
      parentTopic: subject,
    });
  }

  if (context.questionType === "PORTFOLIO_OVERVIEW") {
    pushFollowUp(followUps, { label: "Tell me about the legacy data modernization project.", targetAction: "describe", targetSubject: "Legacy Data Modernization", parentTopic: "projects" });
    pushFollowUp(followUps, { label: "What did you build with GPUs?", targetAction: "describe", targetSubject: "GPU Benchmark Pod" });
    pushFollowUp(followUps, { label: "How has your role evolved over time?", targetAction: "explain", targetSubject: "career" });
    return followUps.slice(0, 4);
  }

  switch (context.questionType) {
    case "ARCHITECTURE_DESIGN":
      if (mode.id === "architecture") {
        pushFollowUp(followUps, { label: "What throughput and latency should we design for?", targetAction: "design", targetSubject: subject });
        if (/\biot\b/i.test(q)) {
          pushFollowUp(followUps, { label: "Compare Kafka with a managed streaming service.", targetAction: "compare", targetSubject: "IoT ingestion" });
        }
      }
      break;
    case "ARCHITECTURE_REVIEW":
    case "COMPONENT_PLACEMENT":
      if (mode.id === "pipeline" || mode.id === "architecture") {
        pushFollowUp(followUps, { label: "Prioritize fixes by reliability impact.", targetAction: "review", targetSubject: subject });
        pushFollowUp(followUps, { label: "Add data quality gates between processing and storage.", targetAction: "review", targetSubject: subject });
      }
      break;
    case "EXPLANATION":
    case "PERSONAL_EXPERIENCE": {
      const tech = subject || "this tool";
      if (/power\s*bi/i.test(tech)) {
        pushFollowUp(followUps, { label: "Compare Power BI vs Tableau.", targetAction: "compare", targetSubject: "Power BI" });
        pushFollowUp(followUps, {
          label: "Show where Power BI belongs in this architecture.",
          targetAction: "architecture-placement",
          targetSubject: "Power BI",
        });
        pushFollowUp(followUps, { label: "Explain Import vs DirectQuery.", targetAction: "explain", targetSubject: "Power BI" });
      } else if (/spark/i.test(tech)) {
        pushFollowUp(followUps, { label: "Compare Spark vs warehouse SQL for this workload.", targetAction: "compare", targetSubject: "Spark" });
        pushFollowUp(followUps, { label: "Explain Spark shuffle costs.", targetAction: "explain", targetSubject: "Spark" });
        pushFollowUp(followUps, { label: "When is Spark unnecessary?", targetAction: "explain", targetSubject: "Spark" });
      } else {
        pushFollowUp(followUps, { label: `Compare ${tech} with the closest alternative.`, targetAction: "compare", targetSubject: tech });
        pushFollowUp(followUps, {
          label: "Explain where it sits in a reference architecture.",
          targetAction: "architecture-placement",
          targetSubject: tech,
        });
      }
      break;
    }
    case "COMPARISON":
      pushFollowUp(followUps, { label: "Add a decision matrix for team size and SLA.", targetAction: "compare", targetSubject: subject });
      break;
    case "COST_ANALYSIS":
      if (/\bsagemaker\b/i.test(q)) {
        pushFollowUp(followUps, { label: "Share instance types and endpoint hours for a sharper estimate.", targetAction: "estimate", targetSubject: "SageMaker" });
        pushFollowUp(followUps, { label: "Stop idle notebook and endpoint waste first.", targetAction: "optimize", targetSubject: "SageMaker" });
      }
      break;
    case "SQL_OPTIMIZATION":
      if (mode.id === "sql") {
        pushFollowUp(followUps, { label: "Paste the full query for a line-by-line rewrite.", targetAction: "optimize", targetSubject: "SQL" });
        pushFollowUp(followUps, {
          label: "Why is this slow? SELECT ... FROM ... JOIN ... (include engine + table sizes)",
          targetAction: "optimize",
          targetSubject: "SQL",
        });
      }
      break;
    case "OPTIMIZATION":
      pushFollowUp(followUps, { label: "Share Spark UI stage timings.", targetAction: "optimize", targetSubject: subject || "Spark" });
      break;
    case "INTERVIEW":
      if (/\bdifficult\b/i.test(q) || /\bfailure\b/i.test(q)) {
        pushFollowUp(followUps, { label: "Walk through this in STAR format.", targetAction: "coach", targetSubject: "behavioral" });
      }
      break;
    case "PROJECT_QUESTION":
      pushFollowUp(followUps, { label: "Go deeper on architecture decisions.", targetAction: "describe", targetSubject: subject });
      break;
    default:
      break;
  }

  if (followUps.length < 2 && mode.id === "ask") {
    pushFollowUp(followUps, { label: "What projects have you worked on?", targetAction: "describe", targetSubject: "portfolio" });
  }

  return followUps.slice(0, 4);
}
