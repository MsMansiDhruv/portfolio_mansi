import { buildSearchCache, loadKnowledge } from "../knowledge-loader";
import { analyzeUserInput } from "./input-analyzer";
import { classifyIntent } from "./intent-classifier";
import { extractEntities } from "./entity-extractor";
import { buildContext } from "./context-builder";
import { routeStrategy } from "./strategy-router";
import { assessConfidence } from "./confidence";
import { generateFollowUps } from "./followup-generator";
import { buildResponsePlan } from "./response-plan";
import { buildResponse } from "./response-builder";
import { validateSemantics } from "./quality-gate";
import {
  emptyConversation,
  updateConversationState,
  type ConversationState,
  type FollowUpContext,
} from "./question-semantics";
import type { BuiltResponse, ReasoningMode, PipelineTrace } from "./reasoning-types";

import { applyDensityAndMode } from "./response-density";
import { getModeAgent, type ModeAgentConfig } from "../mode-agents";
import type { ResponseDensity } from "../generate-ai-response";

export type PipelineOptions = {
  conversation?: ConversationState;
  followUp?: FollowUpContext;
  density?: ResponseDensity;
  modeAgent?: ModeAgentConfig;
  history?: string[];
};

export function runReasoningPipeline(
  question: string,
  mode: ReasoningMode = "ask",
  options: PipelineOptions = {}
): BuiltResponse {
  const conversation = options.conversation || emptyConversation(String(mode));
  const analysis = analyzeUserInput(question, {
    conversation,
    followUp: options.followUp,
    mode: String(mode),
  });
  const effectiveQuestion = analysis.effectiveQuestion;
  const documents = loadKnowledge();
  const cache = buildSearchCache(documents);
  const intent = classifyIntent(effectiveQuestion, mode, analysis);
  const entities = extractEntities(effectiveQuestion, documents);
  const context = buildContext(effectiveQuestion, mode, intent, analysis.questionType, analysis, entities, documents, cache);
  const strategy = routeStrategy(context);
  const basePlan = buildResponsePlan(context, strategy);
  const density = options.density || "concise";
  const agent = options.modeAgent || getModeAgent(String(mode));
  const plan = applyDensityAndMode(context, basePlan, density, agent);
  const confidence = assessConfidence(context, strategy);
  const followUps = generateFollowUps(context, strategy, confidence);
  let response = buildResponse(context, strategy, plan, confidence, followUps, density);
  response = validateSemantics(context, plan, response);

  const updatedConversation = updateConversationState(
    conversation,
    effectiveQuestion,
    {
      subject: analysis.subject,
      intent: intent.primary,
      action: analysis.action,
      entities: entities.entities.map((e) => e.label),
    },
    String(mode)
  );

  const pipelineTrace: PipelineTrace = {
    mode: String(mode),
    questionType: analysis.questionType,
    intent: intent.primary,
    subject: analysis.subject,
    action: analysis.action,
    entities: entities.entities.map((e) => e.label),
    conversationSubject: updatedConversation.currentSubject,
    retrievedKnowledge: context.documents.map((d) => ({
      id: d.id,
      title: d.title,
      tier: d.tier || "general",
      score: d.score,
    })),
    responseStrategy: `${strategy.id} / plan:${plan.sections.length} sections / ${density}`,
    analysis,
  };

  return { ...response, pipelineTrace, conversationState: updatedConversation };
}

export { analyzeUserInput, classifyIntent, extractEntities, buildContext, buildResponsePlan, emptyConversation };
