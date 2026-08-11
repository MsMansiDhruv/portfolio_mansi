/**
 * AI Lab quality checks (11 cases from spec)
 * Run: npx tsx scripts/run-ai-lab-quality.ts
 */

import { generateAIResponse } from "../lib/ai/generate-ai-response.ts";

const CASES = [
  { id: 1, mode: "architecture", q: "Why Power BI?", expectSectionsMax: 6, forbidden: "Architecture Goal" },
  { id: 2, mode: "architecture", q: "Streaming architecture for IoT", expectSectionsMax: 10, need: "Requirements" },
  { id: 3, mode: "architecture", q: "Kafka → Spark → S3 → Power BI", expectSectionsMax: 7, need: "verdict" },
  { id: 4, mode: "architecture", q: "Why Spark instead of SQL?", expectSectionsMax: 6 },
  { id: 5, mode: "ask", q: "What projects has Mansi worked on?", expectSectionsMax: 4, need: "Projects" },
  { id: 6, mode: "ask", q: "Tell me about the AMC Datalake project.", expectSectionsMax: 6 },
  { id: 7, mode: "ask", q: "What technologies has Mansi worked with?", expectSectionsMax: 3 },
  { id: 8, mode: "cloud", q: "My AWS bill is high in SageMaker.", expectSectionsMax: 5, need: "SageMaker" },
  { id: 9, mode: "pipeline", q: "Review Kafka → Spark → S3.", expectSectionsMax: 6, need: "verdict" },
  { id: 10, mode: "sql", q: "SELECT * FROM orders o JOIN customers c ON o.id = c.id", expectSectionsMax: 5 },
  { id: 11, mode: "interview", q: "Tell me about a difficult technical decision.", expectSectionsMax: 5 },
];

function wordCount(response) {
  const text = [response.summary, ...(response.sections || []).flatMap((s) => [s.body, ...(s.bullets || [])])].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

async function run() {
for (const test of CASES) {
  const response = await generateAIResponse({ mode: test.mode, question: test.q, density: "concise" });
  const headings = (response.sections || []).map((s) => s.heading).join(" ");
  const wc = wordCount(response);
  let result = "Pass";
  if (test.expectSectionsMax && (response.sections?.length || 0) > test.expectSectionsMax) result = `Fail sections>${test.expectSectionsMax}`;
  if (test.forbidden && headings.includes(test.forbidden)) result = `Fail has ${test.forbidden}`;
  if (test.need && !headings.toLowerCase().includes(test.need.toLowerCase()) && !String(response.summary).toLowerCase().includes(test.need.toLowerCase())) {
    result = `Fail missing ${test.need}`;
  }
  if (wc > 550 && test.id === 1) result = "Fail too long for Why Power BI";

  console.log("\n" + "=".repeat(60));
  console.log(`TEST ${test.id} [${test.mode}] ${test.q}`);
  console.log("Intent:", response.intent, "| sections:", response.sections?.length, "| words:", wc);
  console.log("Title:", response.title);
  console.log("Summary:", String(response.summary).slice(0, 120));
  console.log("Headings:", headings.slice(0, 120));
  console.log("Result:", result);
}

console.log("\nDone.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
