import type { BuiltResponse } from "./reasoning-types";
import { repairMergedWords } from "./text-spacing";

const FORBIDDEN_PATTERNS = [
  /using retrieved context only where it helps/i,
  /i couldn't find (?:this|that|it) in (?:the|mansi'?s)? knowledge base/i,
  /not (?:found|in) (?:the|mansi'?s)? knowledge base/i,
  /retrieved context/i,
  /knowledge files?/i,
  /system prompt/i,
  /mode configuration/i,
  /chain-of-thought/i,
  /as an ai (?:language )?model/i,
];

function sanitizeText(text: string): string {
  let result = repairMergedWords(text);
  for (const pattern of FORBIDDEN_PATTERNS) {
    result = result.replace(pattern, " ").replace(/\s{2,}/g, " ").trim();
  }
  return result;
}

function sanitizeSection(section: BuiltResponse["sections"][number]) {
  return {
    ...section,
    heading: sanitizeText(section.heading || ""),
    body: section.body ? sanitizeText(section.body) : section.body,
    bullets: section.bullets?.map((bullet) => sanitizeText(bullet)).filter(Boolean),
  };
}

export function validateModeResponse(response: BuiltResponse): BuiltResponse {
  const summary = sanitizeText(response.summary || "");
  const sections = (response.sections || [])
    .map(sanitizeSection)
    .filter((section) => section.heading || section.body || (section.bullets && section.bullets.length));

  return {
    ...response,
    title: sanitizeText(response.title || response.summary?.slice(0, 80) || "Answer"),
    summary: summary || "Here's my analysis.",
    sections: sections.length
      ? sections
      : summary
        ? []
        : [{ heading: "Answer", body: "Here's my analysis." }],
  };
}
