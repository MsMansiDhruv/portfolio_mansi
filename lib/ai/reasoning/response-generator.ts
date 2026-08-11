import { buildSystemPrompt } from "../prompts/build-system-prompt";
import { getAIProvider } from "../providers";
import type { AIProvider, StreamDeltaHandler } from "../providers/provider";
import { aiConfig, getProviderMaxTokens } from "../config";
import type { ModeAgentConfig } from "../mode-agents";
import { formatConversationHistory, formatRetrievedContext } from "./context-formatter";
import { classifyQuestionGrounding, groundingLabel } from "./question-grounding";
import { pipelineInputMissing, hasUserPipelineSpec } from "./pipeline-input";
import { sqlInputMissing, hasUserSqlSpec } from "./sql-input";
import { parseLLMResponse, normalizeLLMResponse } from "./llm-response-parser";
import type { ReasoningContext, ResponsePlan, ConfidenceAssessment } from "./reasoning-types";
import type { ResponseDensity } from "../generate-ai-response";
import type { ModeRoutingDecision } from "../routing/mode-router";
import { responseTitle } from "./response-titles";

export type GenerateLLMResponseInput = {
  context: ReasoningContext;
  plan: ResponsePlan;
  agent: ModeAgentConfig;
  density: ResponseDensity;
  confidence: ConfidenceAssessment;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  routing?: ModeRoutingDecision;
  provider?: AIProvider;
  onStreamDelta?: StreamDeltaHandler;
  signal?: AbortSignal;
};

export async function generateLLMResponse(input: GenerateLLMResponseInput) {
  const grounding = classifyQuestionGrounding(input.context);
  const systemPrompt = buildSystemPrompt(input.agent, grounding, input.context);
  const provider = input.provider || getAIProvider();
  const pipelineMissing =
    input.agent.id === "pipeline" &&
    pipelineInputMissing(input.context.mode, input.context.question, input.history, input.context.analysis);
  const sqlMissing =
    input.agent.id === "sql" &&
    sqlInputMissing(input.context.mode, input.context.question, input.history, input.context.analysis);
  const userPipelineProvided = hasUserPipelineSpec(
    input.context.question,
    input.history,
    input.context.analysis
  );
  const userSqlProvided = hasUserSqlSpec(input.context.question, input.history, input.context.analysis);
  const omitPortfolioContext =
    (input.agent.id === "pipeline" && !userPipelineProvided) ||
    (input.agent.id === "sql" && !userSqlProvided);

  const userSections = [
    `Active mode: ${input.agent.label}`,
    `Mode responsibility: ${input.agent.primaryResponsibility}`,
    `Detail level: ${input.density}`,
    `Question grounding: ${groundingLabel(grounding)}`,
    `Question type: ${input.context.questionType}`,
    `Primary intent: ${input.context.intent.primary}`,
    input.context.analysis.subject ? `Subject: ${input.context.analysis.subject}` : "",
    input.agent.id === "interview" && /\binterview me\b/i.test(input.context.question)
      ? "Interview protocol: ask ONE question only in this turn — wait for the user's answer before the next question."
      : "",
    input.agent.id === "interview" &&
    input.history?.length &&
    input.history.some((entry) => entry.role === "user" && /\binterview me\b/i.test(entry.content))
      ? "Interview protocol: the user requested a mock interview. Evaluate their latest answer if present, then ask the next single question."
      : "",
    input.routing?.allowPartialAnswer
      ? `Cross-mode note: answer briefly from personal experience if relevant, then recommend switching to ${input.routing.redirectLabel} for the technical deep dive. Include a natural suggestion to switch modes — do not impersonate the specialist mode.`
      : "",
    input.routing?.shouldRedirect && !input.routing.redirectOnly && !input.routing.allowPartialAnswer
      ? `Stay in ${input.agent.label}. If the question is slightly adjacent, answer within this mode's specialty.`
      : "",
    pipelineMissing
      ? `CRITICAL: The user has NOT pasted a pipeline to review. Do NOT invent, assume, or substitute portfolio/case-study architectures as their pipeline. Do NOT say "documented architecture" or review Bronze/Silver/Gold unless the user provided it. Ask them to paste the pipeline, or give a short generic production-readiness checklist clearly labeled as generic — not a scored review.`
      : sqlMissing
        ? `CRITICAL: The user has NOT pasted a SQL query to optimize. Do NOT invent Kafka, ksqlDB, or portfolio streaming workloads as their query. Do NOT analyze "this query" without query text. Ask them to paste the SQL (and engine/table sizes if known), or answer only as generic SQL education clearly labeled as general guidance — not a diagnosis of their query.`
        : userPipelineProvided && input.agent.id === "pipeline"
          ? "Review ONLY the pipeline the user pasted. Portfolio context is optional reference — not their system unless it matches what they supplied."
          : userSqlProvided && input.agent.id === "sql"
            ? "Optimize ONLY the SQL the user pasted. Portfolio context is optional reference — not their query unless they supplied the same SQL."
            : "",
    "",
    `USER QUESTION:\n${input.context.question}`,
    "",
    omitPortfolioContext
      ? input.agent.id === "sql"
        ? "PORTFOLIO CONTEXT: omitted — user has not supplied a SQL query to optimize."
        : "PORTFOLIO CONTEXT: omitted — user has not supplied a pipeline to review."
      : formatRetrievedContext(input.context.documents),
    "",
    formatConversationHistory(input.history?.slice(-aiConfig.conversation.maxHistoryMessages)),
    "",
    "Respond with JSON only. Choose sections that fit the question — do not pad with irrelevant headings.",
  ]
    .filter(Boolean)
    .join("\n");

  const params = {
    systemPrompt,
    messages: [{ role: "user" as const, content: userSections }],
    maxTokens: getProviderMaxTokens(),
    temperature: aiConfig.generation.temperature,
    signal: input.signal,
  };

  const result =
    input.onStreamDelta && provider.stream
      ? await provider.stream(params, input.onStreamDelta)
      : await provider.generate(params);

  const parsed = parseLLMResponse(result.text);
  const normalized = normalizeLLMResponse(parsed, responseTitle(input.context));

  return {
    ...normalized,
    model: result.model,
    grounding,
    rawText: result.text,
  };
}
