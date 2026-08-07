import { runReasoningPipeline } from "../lib/ai/reasoning/index.ts";

const BLOCKED = "I design data platforms around business reliability";

const CASES: Array<[string, string]> = [
  ["Streaming architecture for IoT.", "architecture"],
  ["Why Power BI?", "ask"],
  ["Kafka -> Spark -> S3 -> Power BI", "pipeline"],
];

let ok = true;

for (const [question, mode] of CASES) {
  const response = runReasoningPipeline(question, mode);
  const bodies = (response.sections || []).map((s) => String(s.body || s.content || ""));

  const blockedHits = bodies.filter((b) => b.includes(BLOCKED)).length;
  if (blockedHits > 0) {
    console.error("FAIL blocked phrase in", question, "sections:", blockedHits);
    ok = false;
  }

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      if (bodies[i].length > 40 && bodies[i] === bodies[j]) {
        console.error("FAIL identical sections", i, j, "for", question);
        ok = false;
      }
    }
  }

  console.log("OK", question.slice(0, 40), "| sections:", bodies.length, "| blocked:", blockedHits);
}

process.exit(ok ? 0 : 1);
