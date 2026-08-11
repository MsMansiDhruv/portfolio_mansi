import { isLLMConfigured } from "./config";
import { getModeAgent, type AiLabModeId } from "./mode-agents";
import { prepareReasoningContext, finalizePipelineResponse, type PipelineOptions } from "./reasoning/prepare-context";
import { buildResponse } from "./reasoning/response-builder";
import { validateSemantics } from "./reasoning/quality-gate";
import { validateModeResponse } from "./reasoning/mode-response-validator";
import { generateLLMResponse } from "./reasoning/response-generator";
import { assembleLLMResponse } from "./reasoning/assemble-llm-response";
import { runReasoningPipeline } from "./reasoning/index";
import { toUserSafeErrorMessage, AIProviderError } from "./providers/provider";
import {
  routeModeIntent,
  buildCasualResponse,
  buildRedirectResponse,
  type ModeRoutingDecision,
} from "./routing/mode-router";
import { isContactIntent, buildContactResponse } from "./routing/contact-intent";
import { discoverRelatedProjects } from "./routing/project-discovery";
import { pipelineInputMissing, buildPipelineMissingInputResponse } from "./reasoning/pipeline-input";
import { sqlInputMissing, buildSqlMissingInputResponse } from "./reasoning/sql-input";
import type { BuiltResponse } from "./reasoning/reasoning-types";
import type { StreamDeltaHandler } from "./providers/provider";

export type ResponseDensity = "concise" | "detailed";

export type GenerateAIResponseInput = {
  mode: AiLabModeId | string;
  question: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  density?: ResponseDensity;
  conversation?: PipelineOptions["conversation"];
  followUp?: PipelineOptions["followUp"];
  stream?: boolean;
  explicitModeChoice?: boolean;
  onStreamDelta?: StreamDeltaHandler;
  signal?: AbortSignal;
};

export type GenerateAIResponseResult = BuiltResponse & {
  modeAgent: string;
  density: ResponseDensity;
  generation: "llm" | "template" | "routing";
  error?: string;
};

function inferDensity(question: string): ResponseDensity {
  if (/\b(deep dive|go deeper|explain in detail|detailed analysis|full breakdown)\b/i.test(question)) {
    return "detailed";
  }
  return "concise";
}

function runTemplatePipeline(
  question: string,
  mode: AiLabModeId | string,
  options: PipelineOptions,
  density: ResponseDensity,
  agent: ReturnType<typeof getModeAgent>
): BuiltResponse {
  return runReasoningPipeline(question, mode, {
    ...options,
    density,
    modeAgent: agent,
    history: options.history,
  });
}

function attachRelatedProjects(response: BuiltResponse, prepared: ReturnType<typeof prepareReasoningContext>, agent: ReturnType<typeof getModeAgent>) {
  const relatedProjects = discoverRelatedProjects(prepared.context, agent);
  if (!relatedProjects.length) return response;
  return { ...response, relatedProjects };
}

function attachPartialRedirect(
  response: BuiltResponse,
  routing: ModeRoutingDecision,
  question: string
): BuiltResponse {
  if (!routing.shouldRedirect || routing.redirectOnly || !routing.allowPartialAnswer) {
    return response;
  }

  const switchFollowUp = {
    label: `Switch to ${routing.redirectLabel}`,
    targetAction: "mode-switch",
    targetMode: routing.bestMode,
    preservedQuestion: question,
  };

  const followUps = [switchFollowUp, ...(response.followUps || [])].filter(
    (item, index, list) => list.findIndex((entry) => entry.label === item.label) === index
  );

  return {
    ...response,
    summary: `${response.summary || ""} ${routing.reason} ${routing.explanation}`.trim(),
    followUps,
    modeRedirect: {
      targetMode: routing.bestMode,
      label: routing.redirectLabel,
      preserveQuestion: question,
      reason: routing.explanation,
    },
  };
}

function buildRoutedTemplateResponse(
  prepared: ReturnType<typeof prepareReasoningContext>,
  agent: ReturnType<typeof getModeAgent>,
  density: ResponseDensity,
  body: Partial<BuiltResponse> & Pick<BuiltResponse, "title" | "summary" | "sections" | "followUps">
): GenerateAIResponseResult {
  let response: BuiltResponse = {
    title: body.title,
    summary: body.summary,
    sections: body.sections,
    followUps: body.followUps,
    citations: prepared.context.documents.slice(0, 4).map((doc) => doc.id),
    persona: agent.id === "ask" ? "first-person" : "expert",
    intent: prepared.context.intent.primary,
    sourceCount: prepared.context.documents.length,
    strategyId: "mode-routing",
    primaryIntent: prepared.context.intent.primary,
    secondaryIntents: prepared.context.intent.secondary,
    confidence: prepared.confidence,
    modeRedirect: body.modeRedirect,
    siteLinks: body.siteLinks,
    relatedProjects: body.relatedProjects,
    density,
  };

  response = validateModeResponse(response);
  response = attachRelatedProjects(response, prepared, agent);

  return {
    ...response,
    modeAgent: agent.label,
    density,
    generation: "routing",
  };
}

/**
 * Provider-agnostic entry point.
 * Uses Gemini when configured; falls back to the local template pipeline.
 */
export async function generateAIResponse(input: GenerateAIResponseInput): Promise<GenerateAIResponseResult> {
  const density = input.density || inferDensity(input.question);
  const agent = getModeAgent(String(input.mode));
  const prepared = prepareReasoningContext(input.question, input.mode, {
    conversation: input.conversation,
    followUp: input.followUp,
    density,
    modeAgent: agent,
    history: input.history?.map((entry) => entry.content),
  });

  const fromModeSwitch = input.followUp?.targetAction === "mode-switch" || Boolean(input.explicitModeChoice);

  if (isContactIntent(input.question)) {
    return buildRoutedTemplateResponse(prepared, agent, density, buildContactResponse(agent.id));
  }

  if (
    pipelineInputMissing(String(input.mode), input.question, input.history, prepared.context.analysis)
  ) {
    return buildRoutedTemplateResponse(prepared, agent, density, buildPipelineMissingInputResponse());
  }

  if (sqlInputMissing(String(input.mode), input.question, input.history, prepared.context.analysis)) {
    return buildRoutedTemplateResponse(prepared, agent, density, buildSqlMissingInputResponse());
  }

  const routing = routeModeIntent(prepared.context, {
    respectExplicitMode: input.explicitModeChoice,
    fromModeSwitch,
  });

  if (routing.type === "casual") {
    const casual = buildCasualResponse(agent.id, input.question);
    return buildRoutedTemplateResponse(prepared, agent, density, casual);
  }

  if (routing.shouldRedirect && routing.redirectOnly) {
    const redirect = buildRedirectResponse(routing, input.question);
    return buildRoutedTemplateResponse(prepared, agent, density, redirect);
  }

  if (!isLLMConfigured()) {
    if (routing.shouldRedirect) {
      const redirect = buildRedirectResponse(routing, input.question);
      return buildRoutedTemplateResponse(prepared, agent, density, redirect);
    }
    const template = runTemplatePipeline(
      input.question,
      input.mode,
      {
        conversation: input.conversation,
        followUp: input.followUp,
        density,
        modeAgent: agent,
      },
      density,
      agent
    );
    return {
      ...validateModeResponse(attachRelatedProjects(template, prepared, agent)),
      modeAgent: agent.label,
      density,
      generation: "template",
    };
  }

  try {
    const llm = await generateLLMResponse({
      context: prepared.context,
      plan: prepared.plan,
      agent,
      density,
      confidence: prepared.confidence,
      history: input.history,
      routing,
      onStreamDelta: input.stream ? input.onStreamDelta : undefined,
      signal: input.signal,
    });

    let response = assembleLLMResponse(prepared, llm);
    response = attachPartialRedirect(response, routing, input.question);
    response = validateModeResponse(response);
    response = validateSemantics(prepared.context, prepared.plan, response);
    response = finalizePipelineResponse(prepared, response);
    response = attachRelatedProjects(response, prepared, agent);

    return {
      ...response,
      modeAgent: agent.label,
      density,
      generation: "llm",
    };
  } catch (error) {
    console.error("[ai-lab] LLM generation failed, falling back to template pipeline:", error);

    if (error instanceof AIProviderError && error.code === "missing_api_key") {
      throw error;
    }

    if (input.history?.length) {
      try {
        const llmRetry = await generateLLMResponse({
          context: prepared.context,
          plan: prepared.plan,
          agent,
          density,
          confidence: prepared.confidence,
          history: undefined,
          routing,
          onStreamDelta: input.stream ? input.onStreamDelta : undefined,
          signal: input.signal,
        });

        let retryResponse = assembleLLMResponse(prepared, llmRetry);
        retryResponse = attachPartialRedirect(retryResponse, routing, input.question);
        retryResponse = validateModeResponse(retryResponse);
        retryResponse = validateSemantics(prepared.context, prepared.plan, retryResponse);
        retryResponse = finalizePipelineResponse(prepared, retryResponse);
        retryResponse = attachRelatedProjects(retryResponse, prepared, agent);

        return {
          ...retryResponse,
          modeAgent: agent.label,
          density,
          generation: "llm",
        };
      } catch (retryError) {
        console.error("[ai-lab] LLM retry without history also failed:", retryError);
      }
    }

    if (routing.shouldRedirect) {
      const redirect = buildRedirectResponse(routing, input.question);
      return buildRoutedTemplateResponse(prepared, agent, density, redirect);
    }

    const template = buildResponse(
      prepared.context,
      prepared.strategy,
      prepared.plan,
      prepared.confidence,
      prepared.followUps,
      density
    );
    let fallback = validateModeResponse(template);
    fallback = validateSemantics(prepared.context, prepared.plan, fallback);
    fallback = finalizePipelineResponse(prepared, fallback);
    fallback = attachRelatedProjects(fallback, prepared, agent);

    return {
      ...fallback,
      modeAgent: agent.label,
      density,
      generation: "template",
      error: toUserSafeErrorMessage(error),
    };
  }
}
