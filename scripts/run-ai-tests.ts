/**
 * AI Lab pipeline test runner (10 acceptance cases)
 * Run: npx tsx scripts/run-ai-tests.ts
 */

import { runReasoningPipeline } from "../lib/ai/reasoning/index.ts";

const CASES = [
  { id: 1, mode: "architecture", question: "Streaming architecture for IoT." },
  { id: 2, mode: "ask", question: "Why Power BI?" },
  { id: 3, mode: "ask", question: "Why Spark?" },
  { id: 4, mode: "pipeline", question: "Kafka -> Spark -> S3 -> Power BI" },
  { id: 5, mode: "cloud", question: "My AWS bill is high in SageMaker." },
  { id: 6, mode: "ask", question: "Tell me about the AMC project." },
  { id: 7, mode: "ask", question: "How do you mentor engineers?" },
  { id: 8, mode: "sql", question: "Optimize this Spark SQL query." },
  { id: 9, mode: "architecture", question: "Databricks vs Snowflake." },
  { id: 10, mode: "interview", question: "Ask me a system design interview question." },
];

function sectionHeadings(response) {
  return (response.sections || []).map((s) => s.heading).join(" | ");
}

function summarySnippet(response) {
  return String(response.summary || "").slice(0, 120);
}

for (const test of CASES) {
  console.log(`\n--- START TEST ${test.id} ---`);
  const response = runReasoningPipeline(test.question, test.mode);
  const trace = response.pipelineTrace;

  console.log("\n" + "=".repeat(72));
  console.log(`TEST ${test.id}`);
  console.log("Question:", test.question);
  console.log("Detected Mode:", test.mode);
  console.log("Detected Intent:", trace?.intent);
  console.log("Question Type:", trace?.questionType);
  console.log("Detected Entities:", (trace?.entities || []).join(", ") || "(none)");
  console.log(
    "Retrieved Knowledge:",
    (trace?.retrievedKnowledge || []).map((k) => `${k.title} (${k.tier}, ${k.score})`).join("; ") || "(none)"
  );
  console.log("Response Strategy:", trace?.responseStrategy);
  console.log("Section headings:", sectionHeadings(response));
  console.log("Summary:", summarySnippet(response));
  console.log("Follow-ups:", (response.followUps || []).slice(0, 3).join(" / "));
}

console.log("\n" + "=".repeat(72));
console.log("Done.");
process.exit(0);
