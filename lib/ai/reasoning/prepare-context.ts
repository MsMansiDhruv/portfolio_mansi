import { buildSearchCache, loadKnowledge } from "../knowledge-loader";
import { getModeAgent, type ModeAgentConfig } from "../mode-agents";
import type { ResponseDensity } from "../generate-ai-response";
import { analyzeUserInput } from "./input-analyzer";
import { classifyIntent } from "./intent-classifier";
import { extractEntities } from "./entity-extractor";
import { buildContext } from "./context-builder";
import { routeStrategy } from "./strategy-router";
import { assessConfidence } from "./confidence";
import { generateFollowUps } from "./followup-generator";
import { buildResponsePlan } from "./response-plan";
import { applyDensityAndMode } from "./response-density";
import {
  emptyConversation,
  updateConversationState,
  type ConversationState,
  type FollowUpContext,
} from "./question-semantics";
import type {
  BuiltResponse,
  ConfidenceAssessment,
  ReasoningContext,
  ReasoningMode,
  ReasoningStrategy,
  ResponsePlan,
  PipelineTrace,
} from "./reasoning-types";

export type PipelineOptions = {
  conversation?: ConversationState;
  followUp?: FollowUpContext;
  density?: ResponseDensity;
  modeAgent?: ModeAgentConfig;
  history?: string[];
};

export type PreparedReasoningContext = {
  context: ReasoningContext;
  strategy: ReasoningStrategy;
  plan: ResponsePlan;
  confidence: ConfidenceAssessment;
  followUps: import("./reasoning-types").FollowUpSuggestion[];
  density: ResponseDensity;
  agent: ModeAgentConfig;
  conversation: ConversationState;
  effectiveQuestion: string;
  updatedConversation: ConversationState;
  pipelineTraceBase: Omit<PipelineTrace, "responseStrategy"> & { responseStrategySuffix: string };
};

export function prepareReasoningContext(
  question: string,
  mode: ReasoningMode = "ask",
  options: PipelineOptions = {}
): PreparedReasoningContext {
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

  return {
    context,
    strategy,
    plan,
    confidence,
    followUps,
    density,
    agent,
    conversation,
    effectiveQuestion,
    updatedConversation,
    pipelineTraceBase: {
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
      analysis,
      responseStrategySuffix: `${strategy.id} / plan:${plan.sections.length} sections / ${density}`,
    },
  };
}

export function finalizePipelineResponse(
  prepared: PreparedReasoningContext,
  response: BuiltResponse
): BuiltResponse {
  return {
    ...response,
    pipelineTrace: {
      ...prepared.pipelineTraceBase,
      responseStrategy: `${prepared.pipelineTraceBase.responseStrategySuffix} / llm`,
    },
    conversationState: prepared.updatedConversation,
  };
}

export { analyzeUserInput, classifyIntent, extractEntities, buildContext, buildResponsePlan, emptyConversation };
