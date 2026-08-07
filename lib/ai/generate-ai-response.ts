import { runReasoningPipeline, type PipelineOptions } from "./reasoning/index";
import type { BuiltResponse } from "./reasoning/reasoning-types";
import type { AiLabModeId } from "./mode-agents";
import { getModeAgent } from "./mode-agents";

export type ResponseDensity = "concise" | "detailed";

export type GenerateAIResponseInput = {
  mode: AiLabModeId | string;
  question: string;
  history?: string[];
  density?: ResponseDensity;
  conversation?: PipelineOptions["conversation"];
  followUp?: PipelineOptions["followUp"];
};

export type GenerateAIResponseResult = BuiltResponse & {
  modeAgent: string;
  density: ResponseDensity;
};

/**
 * Provider-agnostic entry point. Today uses the local reasoning pipeline;
 * swap the implementation here when Anthropic/OpenAI is added.
 */
export function generateAIResponse(input: GenerateAIResponseInput): GenerateAIResponseResult {
  const density = input.density || inferDensity(input.question);
  const agent = getModeAgent(String(input.mode));

  const response = runReasoningPipeline(input.question, input.mode, {
    conversation: input.conversation,
    followUp: input.followUp,
    density,
    modeAgent: agent,
    history: input.history,
  });

  return {
    ...response,
    modeAgent: agent.label,
    density,
  };
}

function inferDensity(question: string): ResponseDensity {
  if (/\b(deep dive|go deeper|explain in detail|detailed analysis|full breakdown)\b/i.test(question)) {
    return "detailed";
  }
  return "concise";
}
