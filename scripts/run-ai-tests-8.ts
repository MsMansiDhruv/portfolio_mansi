/**
 * AI Lab quality report (8 differentiation cases)
 * Run: npx tsx scripts/run-ai-tests-8.ts
 */

import { runReasoningPipeline } from "../lib/ai/reasoning/index.ts";

const CASES = [
  { id: "A", mode: "architecture", question: "Streaming architecture for IoT" },
  { id: "B", mode: "ask", question: "Why Power BI?" },
  { id: "C", mode: "pipeline", question: "Kafka → Spark → S3 → Power BI" },
  { id: "D", mode: "cloud", question: "How would you reduce my Spark costs?" },
  { id: "E", mode: "ask", question: "Tell me about the AMC project." },
  { id: "F", mode: "ask", question: "How do you mentor engineers?" },
  { id: "G", mode: "architecture", question: "Databricks vs Snowflake" },
  { id: "H", mode: "interview", question: "Ask me a system design interview question." },
];

function formatSources(sources) {
  if (!sources) return "(none)";
  const parts = [];
  if (sources.generalEngineering?.length) parts.push(`General: ${sources.generalEngineering.join("; ")}`);
  if (sources.technologiesDiscussed?.length) parts.push(`Tech: ${sources.technologiesDiscussed.join("; ")}`);
  if (sources.relatedProjects?.length) parts.push(`Projects: ${sources.relatedProjects.join("; ")}`);
  if (sources.personalExperience?.length) parts.push(`Personal: ${sources.personalExperience.join("; ")}`);
  return parts.length ? parts.join(" | ") : "(empty categories)";
}

function sectionHeadings(response) {
  return (response.sections || []).map((s) => s.heading).join(" | ");
}

for (const test of CASES) {
  const response = runReasoningPipeline(test.question, test.mode);
  const trace = response.pipelineTrace;

  console.log("\n" + "=".repeat(72));
  console.log(`TEST ${test.id}`);
  console.log("Question:", test.question);
  console.log("Mode:", test.mode);
  console.log("Intent:", trace?.intent);
  console.log("Question type:", trace?.questionType);
  console.log(
    "Knowledge retrieved (top):",
    (trace?.retrievedKnowledge || [])
      .slice(0, 6)
      .map((k) => `${k.title}(${k.score})`)
      .join(", ") || "(none)"
  );
  console.log("Response summary:", String(response.summary || "").slice(0, 160));
  console.log("Section structure:", sectionHeadings(response));
  console.log("Sources shown:", formatSources(response.sources));
  console.log("Follow-ups:", (response.followUps || []).slice(0, 4).join(" / "));
  console.log(
    "Quality:",
    `sections=${response.sections?.length || 0}`,
    `citations=${response.citations?.length || 0}`,
    `sourceCount=${response.sourceCount ?? 0}`
  );
}

console.log("\n" + "=".repeat(72));
console.log("Done.");
process.exit(0);
