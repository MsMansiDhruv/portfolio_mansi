/**
 * Semantic understanding tests (10 + follow-up chain)
 * Run: npx tsx scripts/run-ai-tests-semantics.ts
 */

import { emptyConversation, runReasoningPipeline } from "../lib/ai/reasoning/index.ts";

const CASES = [
  { id: 1, mode: "architecture", question: "Streaming architecture for IoT." },
  { id: 2, mode: "ask", question: "Why Power BI?" },
  { id: 3, mode: "ask", question: "Where does Power BI sit in a reference architecture?" },
  { id: 4, mode: "ask", question: "Why Spark?" },
  { id: 5, mode: "pipeline", question: "Where does Spark sit in a Kafka → Spark → S3 architecture?" },
  { id: 6, mode: "ask", question: "Compare Power BI and Tableau." },
  { id: 7, mode: "architecture", question: "What would you use for IoT ingestion?" },
  { id: 8, mode: "ask", question: "Why did you use Power BI?" },
  { id: 9, mode: "ask", question: "What did you build in the AMC project?" },
  { id: 10, mode: "pipeline", question: "How would you optimize the Spark stage?" },
];

function formatSources(sources) {
  if (!sources) return "(none)";
  const parts = [];
  if (sources.generalEngineering?.length) parts.push(`General: ${sources.generalEngineering.join("; ")}`);
  if (sources.technologiesDiscussed?.length) parts.push(`Tech: ${sources.technologiesDiscussed.join("; ")}`);
  if (sources.relatedProjects?.length) parts.push(`Projects: ${sources.relatedProjects.join("; ")}`);
  return parts.join(" | ") || "(empty)";
}

function passFail(test, response, trace) {
  if (test.id === 1 && trace.questionType !== "ARCHITECTURE_DESIGN") return "FAIL wrong type";
  if (test.id === 3 && trace.questionType === "ARCHITECTURE_DESIGN") return "FAIL IoT design template";
  if (test.id === 3 && trace.subject !== "Power BI") return `FAIL subject=${trace.subject}`;
  if (test.id === 3 && trace.action !== "architecture-placement") return `FAIL action=${trace.action}`;
  const headings = (response.sections || []).map((s) => s.heading).join(" ");
  if (test.id === 3 && /\bArchitecture Goal\b/.test(headings)) return "FAIL full design sections";
  if (test.id === 3 && !/\bArchitecture placement\b/i.test(headings)) return "FAIL missing placement sections";
  if (test.id === 5 && trace.questionType !== "COMPONENT_PLACEMENT") return `FAIL type=${trace.questionType}`;
  if (test.id === 6 && trace.questionType !== "COMPARISON") return "FAIL not comparison";
  if (test.id === 7 && trace.questionType !== "INGESTION_RECOMMENDATION") return `FAIL type=${trace.questionType}`;
  return "Pass";
}

let conversation = emptyConversation("ask");

for (const test of CASES) {
  const response = runReasoningPipeline(test.question, test.mode, { conversation });
  conversation = response.conversationState || conversation;
  const trace = response.pipelineTrace;

  console.log("\n" + "=".repeat(72));
  console.log(`TEST ${test.id}`);
  console.log("Question:", test.question);
  console.log("Mode:", test.mode);
  console.log("Intent:", trace?.intent);
  console.log("Subject:", trace?.subject);
  console.log("Action:", trace?.action);
  console.log("Question type:", trace?.questionType);
  console.log("Sources:", formatSources(response.sources));
  console.log("Summary:", String(response.summary || "").slice(0, 140));
  console.log("Sections:", (response.sections || []).map((s) => s.heading).join(" | "));
  console.log(
    "Follow-ups:",
    (response.followUps || [])
      .map((f) => f.label)
      .slice(0, 3)
      .join(" / ")
  );
  console.log("Result:", passFail(test, response, trace));
}

console.log("\n" + "=".repeat(72));
console.log("FOLLOW-UP CHAIN TEST");
let conv = emptyConversation("ask");
const first = runReasoningPipeline("Why Power BI?", "ask", { conversation: conv });
conv = first.conversationState || conv;
const follow = (first.followUps || []).find((f) => /reference architecture/i.test(f.label));
console.log("Step 1 subject:", first.pipelineTrace?.subject, "type:", first.pipelineTrace?.questionType);
const second = runReasoningPipeline(follow?.label || "Where does Power BI sit in a reference architecture?", "ask", {
  conversation: conv,
  followUp: follow,
});
console.log("Step 2 subject:", second.pipelineTrace?.subject, "type:", second.pipelineTrace?.questionType);
console.log("Step 2 sections include placement:", /\bArchitecture placement\b/i.test((second.sections || []).map((s) => s.heading).join(" ")));
const third = runReasoningPipeline("What about performance?", "ask", { conversation: second.conversationState || conv });
console.log("Step 3 subject:", third.pipelineTrace?.subject, "effective:", third.pipelineTrace?.analysis?.effectiveQuestion);
console.log("Step 3 mentions Power BI in summary or headings:", /\bpower bi\b/i.test(JSON.stringify(third.sections) + third.summary));
console.log("Follow-up chain:", second.pipelineTrace?.questionType !== "ARCHITECTURE_DESIGN" && third.pipelineTrace?.subject === "Power BI" ? "Pass" : "Fail");

console.log("\nDone.");
process.exit(0);
