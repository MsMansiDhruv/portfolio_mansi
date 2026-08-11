import { buildResponse } from "./response-builder";
import { validateSemantics } from "./quality-gate";
import {
  prepareReasoningContext,
  finalizePipelineResponse,
  type PipelineOptions,
} from "./prepare-context";
import type { BuiltResponse, ReasoningMode } from "./reasoning-types";

export type { PipelineOptions };

export function runReasoningPipeline(
  question: string,
  mode: ReasoningMode = "ask",
  options: PipelineOptions = {}
): BuiltResponse {
  const prepared = prepareReasoningContext(question, mode, options);
  let response = buildResponse(
    prepared.context,
    prepared.strategy,
    prepared.plan,
    prepared.confidence,
    prepared.followUps,
    prepared.density
  );
  response = validateSemantics(prepared.context, prepared.plan, response);
  return finalizePipelineResponse(prepared, {
    ...response,
    pipelineTrace: {
      ...prepared.pipelineTraceBase,
      responseStrategy: `${prepared.pipelineTraceBase.responseStrategySuffix} / template`,
    },
    conversationState: prepared.updatedConversation,
  });
}

export { analyzeUserInput, classifyIntent, extractEntities, buildContext, buildResponsePlan, emptyConversation } from "./prepare-context";
