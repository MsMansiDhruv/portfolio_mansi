import { generateAIResponse } from "../../../lib/ai/generate-ai-response";

export function generateResponse(mode, prompt, options = {}) {
  const history = options.history || [];
  return generateAIResponse({
    mode,
    question: prompt || "",
    conversation: options.conversation,
    followUp: options.followUp,
    density: options.density,
    history,
  });
}

export function formatResponseSections(response = {}) {
  const sections = Array.isArray(response.sections) ? response.sections : [];
  return sections.map((section) => ({
    heading: section.heading,
    body: section.body,
    bullets: section.bullets || [],
    score: section.score,
    tier: section.tier || "primary",
    type: section.bullets?.length ? "bullets" : "text",
  }));
}
