import type { UserInputAnalysis } from "./input-analyzer";

const GENERIC_REVIEW_PATTERN =
  /\b(review|rate|audit|assess|evaluate|check|score).{0,48}(pipeline|architecture|dag|etl|elt|flow|system)\b/i;

const PIPELINE_REVIEW_PATTERN =
  /\b(production readiness|what('s| is) missing|readiness review|ready for production)\b/i;

const USER_PIPELINE_MARKERS =
  /\b(here('s| is)|my pipeline|our pipeline|following pipeline|pipeline:|architecture:|flow:)\b/i;

type HistoryEntry = { role: "user" | "assistant"; content: string };

function quickAnalyze(text: string): Pick<UserInputAnalysis, "signals" | "architectureComponents" | "technologies"> {
  const signals: string[] = [];
  const architectureComponents: string[] = [];
  const technologies: string[] = [];

  if (/(->|→|➜|=>)/.test(text)) {
    signals.push("flow-chain");
    text
      .split(/(?:->|→|➜|=>)/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((seg) => architectureComponents.push(seg));
  }

  const techPatterns: Array<[RegExp, string]> = [
    [/\bkafka\b/i, "Kafka"],
    [/\bspark\b/i, "Spark"],
    [/\bs3\b/i, "S3"],
    [/\bairflow\b/i, "Airflow"],
    [/\bglue\b/i, "Glue"],
    [/\bredshift\b/i, "Redshift"],
    [/\blambda\b/i, "Lambda"],
    [/\bkinesis\b/i, "Kinesis"],
    [/\bdatabricks\b/i, "Databricks"],
  ];

  for (const [pattern, label] of techPatterns) {
    if (pattern.test(text)) technologies.push(label);
  }

  return { signals, architectureComponents, technologies };
}

/** True when the user supplied an actual pipeline/architecture to review (not just a meta-request). */
export function userProvidedPipelineContent(
  question: string,
  analysis?: Pick<UserInputAnalysis, "signals" | "architectureComponents" | "technologies">
): boolean {
  const text = String(question || "").trim();
  if (!text) return false;

  const derived = analysis || quickAnalyze(text);
  const merged = { ...quickAnalyze(text), ...derived };

  if (merged.signals.includes("flow-chain") || merged.architectureComponents.length >= 2) {
    return true;
  }

  if (USER_PIPELINE_MARKERS.test(text) && text.length > 50) {
    return true;
  }

  if (text.length >= 280) {
    return true;
  }

  if (merged.technologies.length >= 2 && text.length >= 120) {
    return true;
  }

  // Layer names alone (e.g. "checks at the Silver layer") are not a pipeline description.
  if (
    /\b(step \d|task id|schedule|cron|dead.?letter|dlq|retry|idempotent)\b/i.test(text) &&
    text.length >= 80
  ) {
    return true;
  }

  if (
    /\b(bronze|silver|gold)\b/i.test(text) &&
    (/(->|→|➜|=>)/.test(text) ||
      /\b(bronze|silver|gold)\b[\s\S]{0,80}\b(bronze|silver|gold)\b/i.test(text) ||
      /\b(layer|zone|stage)\s*[:=]/i.test(text))
  ) {
    return true;
  }

  if (looksLikeSqlOrCode(text)) {
    return true;
  }

  return false;
}

function looksLikeSqlOrCode(text: string) {
  return (
    /\bselect\b[\s\S]{0,400}\bfrom\b/i.test(text) ||
    /\b(def |class |import |@dag|DAG\(|SparkSession)/i.test(text) ||
    /```/.test(text)
  );
}

export function isGenericPipelineReviewRequest(question: string): boolean {
  const text = String(question || "").trim();
  if (!text) return false;
  if (GENERIC_REVIEW_PATTERN.test(text)) return true;
  if (PIPELINE_REVIEW_PATTERN.test(text)) return true;
  if (/\breview my\b/i.test(text) && /\b(pipeline|etl|elt|dag|architecture)\b/i.test(text) && text.length < 120) {
    return true;
  }
  return false;
}

export function hasUserPipelineSpec(
  question: string,
  history?: HistoryEntry[],
  analysis?: UserInputAnalysis
): boolean {
  if (userProvidedPipelineContent(question, analysis)) {
    return true;
  }

  for (const entry of history || []) {
    if (entry.role !== "user") continue;
    if (userProvidedPipelineContent(entry.content, quickAnalyze(entry.content) as UserInputAnalysis)) {
      return true;
    }
  }

  return false;
}

export function pipelineInputMissing(
  mode: string,
  question: string,
  history?: HistoryEntry[],
  analysis?: UserInputAnalysis
): boolean {
  if (mode !== "pipeline") return false;
  if (hasUserPipelineSpec(question, history, analysis)) return false;

  if (isGenericPipelineReviewRequest(question)) return true;

  // Follow-ups that assume a pipeline exists without the user ever pasting one.
  if (isPipelineAssumptionFollowUp(question)) return true;

  return false;
}

/** Questions about "the pipeline" or layer details when nothing was supplied. */
function isPipelineAssumptionFollowUp(question: string): boolean {
  const text = String(question || "").trim();
  if (!text) return false;

  if (/\b(silver layer|bronze layer|gold layer|this pipeline|the pipeline|that pipeline|your pipeline|documented architecture)\b/i.test(text)) {
    return true;
  }

  if (
    /\b(great expectations|deequ|data quality checks?|validation rules?|schema evolution|rollback strategy|dead.?letter|dlq)\b/i.test(
      text
    ) &&
    /\b(pipeline|silver|bronze|gold|layer|etl|elt)\b/i.test(text)
  ) {
    return true;
  }

  if (
    /\b(are you(?:\s+\w+){0,2}\s+using|do you have|how are you handling|what is the strategy)\b/i.test(text) &&
    /\b(pipeline|validation|silver|bronze|gold|checks?|framework)\b/i.test(text)
  ) {
    return true;
  }

  return false;
}

export function buildPipelineMissingInputResponse() {
  return {
    title: "Paste the pipeline to review",
    summary:
      "I don't have a specific pipeline from you yet — so I can't score production readiness or review Silver/Gold layers. Paste your architecture, DAG, code, or flow (for example: Kafka → Spark → S3 → Redshift) and include volume, SLA, retries, and monitoring if you can.",
    sections: [
      {
        heading: "What to paste",
        bullets: [
          "Source → transform → sink stages (tools and handoffs)",
          "Orchestration — Airflow, Step Functions, Glue jobs, streaming, etc.",
          "Expected volume, latency/freshness SLA, and concurrency",
          "Failure handling — retries, DLQ, idempotency, backfill",
          "Observability and data quality checks you have today",
        ],
        tier: "primary" as const,
      },
      {
        heading: "Until then",
        body: "I can review your pipeline once you share it. I won't assume portfolio case studies or generic lakehouse patterns are your system.",
        tier: "primary" as const,
      },
    ],
    followUps: [
      { label: "Review: Kafka → Spark → S3 → Redshift (daily batch, 500GB/day)" },
      { label: "Review: Airflow DAG — ingest, validate, load to warehouse" },
    ],
  };
}
