import type { UserInputAnalysis } from "./input-analyzer";

const GENERIC_SQL_PATTERN =
  /\b(optimize|review|rewrite|tune|fix|diagnose|analyze|assess).{0,32}(this |my )?(sql |query|join|cte|statement)\b/i;

const GENERIC_SLOW_QUERY_PATTERN =
  /\bwhy is (this |my )?(query|join|sql|statement)\b.{0,24}\bslow\b/i;

const USER_SQL_MARKERS =
  /\b(here('s| is)|my query|our query|following query|query:|sql:)\b/i;

type HistoryEntry = { role: "user" | "assistant"; content: string };

/** True when text contains an actual SQL statement or pasted query body. */
export function looksLikeSqlStatement(text: string): boolean {
  const t = String(text || "").trim();
  if (!t) return false;
  return (
    /\bselect\b[\s\S]{0,800}\bfrom\b/i.test(t) ||
    /\b(with|insert into|update)\b[\s\S]{0,400}\b(from|set)\b/i.test(t) ||
    /\bexplain\b[\s\S]{0,200}\b(select|with)\b/i.test(t)
  );
}

function quickAnalyze(text: string): Pick<UserInputAnalysis, "signals" | "technologies"> {
  const technologies: string[] = [];
  const techPatterns: Array<[RegExp, string]> = [
    [/\bspark\b/i, "Spark"],
    [/\bredshift\b/i, "Redshift"],
    [/\bpostgres\b/i, "PostgreSQL"],
    [/\bdatabricks\b/i, "Databricks"],
    [/\bsnowflake\b/i, "Snowflake"],
    [/\bbigquery\b/i, "BigQuery"],
    [/\bksqldb\b/i, "ksqlDB"],
    [/\bflink\b/i, "Flink"],
  ];
  for (const [pattern, label] of techPatterns) {
    if (pattern.test(text)) technologies.push(label);
  }
  return { signals: [], technologies };
}

/** True when the user supplied SQL or enough query context to optimize. */
export function userProvidedSqlContent(
  question: string,
  analysis?: Pick<UserInputAnalysis, "technologies">
): boolean {
  const text = String(question || "").trim();
  if (!text) return false;

  if (looksLikeSqlStatement(text)) {
    return true;
  }

  if (USER_SQL_MARKERS.test(text) && text.length > 60) {
    return true;
  }

  // Schema + symptom without full SQL — still enough to start (tables, keys, engine).
  if (
    text.length >= 180 &&
    /\b(from|join|where|group by|table|schema)\b/i.test(text) &&
    (analysis?.technologies?.length || quickAnalyze(text).technologies.length)
  ) {
    return true;
  }

  return false;
}

export function isGeneralSqlConceptQuestion(question: string): boolean {
  const text = String(question || "").trim();
  if (!text || looksLikeSqlStatement(text)) return false;

  const refersToSpecificQuery =
    /\b(this |my )+(query|sql|join|cte|statement)\b/i.test(text) ||
    /\b(this query|my query|this sql|my sql|this join|my join|this statement|execution plan for (this|my))\b/i.test(text);

  if (refersToSpecificQuery) return false;

  return (
    /\b(what is|explain|how does|how do|difference between|when should|when to use|when would|best practice)\b/i.test(
      text
    ) ||
    (/\bcompare\b/i.test(text) &&
      /\b(join|index|partition|distribution|cluster|cte|window)\b/i.test(text) &&
      !/\b(this|my)\b/i.test(text))
  );
}

export function isGenericSqlRequest(question: string): boolean {
  const text = String(question || "").trim();
  if (!text || looksLikeSqlStatement(text)) return false;
  if (isGeneralSqlConceptQuestion(text)) return false;

  if (GENERIC_SQL_PATTERN.test(text)) return true;
  if (GENERIC_SLOW_QUERY_PATTERN.test(text)) return true;
  if (/\b(sql execution (strategy|plan)|execution plan for (this|my))\b/i.test(text)) return true;
  if (
    /\b(review|optimize|rewrite)\b/i.test(text) &&
    /\b(this |my )?(sql|query)\b/i.test(text) &&
    text.length < 160
  ) {
    return true;
  }

  return false;
}

export function hasUserSqlSpec(
  question: string,
  history?: HistoryEntry[],
  analysis?: UserInputAnalysis
): boolean {
  if (userProvidedSqlContent(question, analysis)) {
    return true;
  }

  for (const entry of history || []) {
    if (entry.role !== "user") continue;
    if (userProvidedSqlContent(entry.content, quickAnalyze(entry.content) as UserInputAnalysis)) {
      return true;
    }
  }

  return false;
}

function isSqlAssumptionFollowUp(question: string): boolean {
  const text = String(question || "").trim();
  if (!text || looksLikeSqlStatement(text)) return false;

  if (/\b(this query|the query|that query|my query|this sql|the sql|execution plan|query plan)\b/i.test(text)) {
    return true;
  }

  if (
    /\b(join key|partition (key|column|pruning)|distribution key|sort key|cluster key|shuffle|broadcast join|line-by-line)\b/i.test(
      text
    ) &&
    /\b(are you|do you|can you|how are|what is|which)\b/i.test(text)
  ) {
    return true;
  }

  if (
    /\b(ksqldb|flink sql|spark sql|redshift|postgres)\b/i.test(text) &&
    /\b(using|engine|platform)\b/i.test(text) &&
    /\b(are you|do you|which|what)\b/i.test(text)
  ) {
    return true;
  }

  return false;
}

export function sqlInputMissing(
  mode: string,
  question: string,
  history?: HistoryEntry[],
  analysis?: UserInputAnalysis
): boolean {
  if (mode !== "sql") return false;
  if (hasUserSqlSpec(question, history, analysis)) return false;
  if (isGeneralSqlConceptQuestion(question)) return false;
  if (isGenericSqlRequest(question)) return true;
  if (isSqlAssumptionFollowUp(question)) return true;
  return false;
}

export function buildSqlMissingInputResponse() {
  return {
    title: "Paste the query to optimize",
    summary:
      "I don't have a specific SQL statement from you yet — so I can't diagnose bottlenecks or propose rewrites. Paste the query (or EXPLAIN output), note the engine (Spark SQL, Redshift, PostgreSQL, etc.), and share table sizes or partition keys if you know them.",
    sections: [
      {
        heading: "What to paste",
        bullets: [
          "Full query text — SELECT / JOIN / CTE / window functions",
          "Engine and version — Spark SQL, Redshift, PostgreSQL, Databricks SQL, etc.",
          "Table sizes or row counts and partition / distribution keys",
          "Symptom — runtime, shuffle spill, full table scan, skew, etc.",
          "EXPLAIN or query-plan output if you have it",
        ],
        tier: "primary" as const,
      },
      {
        heading: "Until then",
        body: "I can tune your query once you share it. I won't assume portfolio case studies or unrelated streaming pipelines are your workload.",
        tier: "primary" as const,
      },
    ],
    followUps: [
      {
        label:
          "Why is this slow? SELECT o.* FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.created_at > '2024-01-01'",
      },
      {
        label:
          "Optimize (Redshift): SELECT customer_id, SUM(amount) FROM sales GROUP BY 1 — 500M rows, DISTKEY on customer_id",
      },
    ],
  };
}
