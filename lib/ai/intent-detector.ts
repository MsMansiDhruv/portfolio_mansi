import type { Intent } from "./types";

export type IntentRule = {
  intent: Intent;
  patterns: RegExp[];
};

export const INTENT_RULES: IntentRule[] = [
  { intent: "comparison", patterns: [/(why not|compare|vs\.?|versus|alternatives)/i] },
  { intent: "troubleshooting", patterns: [/(slow|timeout|timed out|failing|error|refresh|broken|root cause|debug)/i] },
  { intent: "cloud-cost", patterns: [/(cost|bill|sagemaker|gpu|endpoint|spend|pricing)/i] },
  { intent: "sql", patterns: [/(select|join|group by|window|sql|query|optimize|execution plan)/i] },
  { intent: "pipeline-review", patterns: [/(pipeline|dag|review|reliability|score|orchestration)/i] },
  { intent: "interview", patterns: [/(interview|behavioral|system design|leadership question)/i] },
  { intent: "leadership", patterns: [/(lead|mentor|manage|team leadership|people management)/i] },
  { intent: "mentoring", patterns: [/(mentor|coaching|teach|guidance)/i] },
  { intent: "architecture", patterns: [/(architecture|design|lakehouse|warehouse|platform|governance)/i] },
  { intent: "technology", patterns: [/(databricks|spark|kafka|delta|power bi|snowflake|airflow|terraform|aws|azure|python)/i] },
  { intent: "career", patterns: [/(resume|timeline|career|experience|project|background)/i] },
];

const MODE_HINTS: Record<string, Intent> = {
  architecture: "architecture",
  pipeline: "pipeline-review",
  sql: "sql",
  interview: "interview",
  ask: "career",
  cloud: "cloud-cost",
};

export function detectIntent(question: string, mode = "ask", rules = INTENT_RULES): Intent {
  const text = question.trim();
  if (!text) return MODE_HINTS[mode] || "unknown";
  for (const rule of rules) {
    if (rule.patterns.some((pattern) => pattern.test(text))) return rule.intent;
  }
  return MODE_HINTS[mode] || "unknown";
}
