import type { BuiltResponse } from "./reasoning-types";
import type { PreparedReasoningContext } from "./prepare-context";
import { assembleSources } from "./source-assembler";
import { trackDocument, createUsageTracker } from "./usage-tracker";
import type { FollowUpSuggestion } from "./reasoning-types";

type LLMNormalizedResponse = {
  title: string;
  summary: string;
  sections: BuiltResponse["sections"];
  followUps: FollowUpSuggestion[];
};

export function assembleLLMResponse(
  prepared: PreparedReasoningContext,
  llm: LLMNormalizedResponse
): BuiltResponse {
  const usage = createUsageTracker();
  for (const doc of prepared.context.documents.slice(0, 6)) {
    trackDocument(usage, doc.id);
  }

  const sections = llm.sections.length ? llm.sections : llm.summary ? [] : [{ heading: "Answer", body: llm.summary }];
  const followUps = llm.followUps.length ? llm.followUps : prepared.followUps;
  const sources = assembleSources(prepared.context, sections, [], usage);
  const citations = prepared.context.documents
    .slice(0, 6)
    .map((doc) => doc.id);

  return {
    title: llm.title,
    summary: llm.summary,
    sections,
    followUps,
    citations,
    persona: prepared.context.mode === "ask" ? "first-person" : "expert",
    intent: prepared.context.intent.primary,
    sourceCount: citations.length,
    sources,
    density: prepared.density,
    strategyId: prepared.strategy.id,
    primaryIntent: prepared.strategy.primaryIntent,
    secondaryIntents: prepared.context.intent.secondary,
    confidence: prepared.confidence,
  };
}
