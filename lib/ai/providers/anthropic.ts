import { aiConfig } from "../config";
import {
  AIProvider,
  AIProviderError,
  type GenerateResponseParams,
  type GenerateResponseResult,
  type StreamDeltaHandler,
} from "./provider";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

type AnthropicContentBlock = { type: "text"; text: string };

type AnthropicMessageResponse = {
  id: string;
  model: string;
  stop_reason?: string | null;
  content: AnthropicContentBlock[];
};

function mapAnthropicError(error: unknown): AIProviderError {
  if (error instanceof AIProviderError) return error;

  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (lower.includes("rate") || lower.includes("429")) {
    return new AIProviderError(message, "rate_limit", error);
  }
  if (lower.includes("timeout") || lower.includes("timed out") || lower.includes("abort")) {
    return new AIProviderError(message, "timeout", error);
  }
  if (lower.includes("authentication") || lower.includes("api key") || lower.includes("401")) {
    return new AIProviderError(message, "missing_api_key", error);
  }

  return new AIProviderError(message, "api_error", error);
}

function getApiKey(): string {
  const apiKey = aiConfig.anthropic.apiKey?.trim();
  if (!apiKey) {
    throw new AIProviderError("ANTHROPIC_API_KEY is not configured.", "missing_api_key");
  }
  return apiKey;
}

function buildRequestBody(params: GenerateResponseParams, stream: boolean) {
  return {
    model: aiConfig.anthropic.model,
    max_tokens: params.maxTokens ?? aiConfig.anthropic.maxTokens,
    temperature: params.temperature ?? aiConfig.generation.temperature,
    system: params.systemPrompt,
    stream,
    messages: params.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  };
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = await response.json();
    return payload?.error?.message || payload?.message || response.statusText;
  } catch {
    return response.statusText || "Anthropic API request failed.";
  }
}

function extractText(response: AnthropicMessageResponse): string {
  return (response.content || [])
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic";

  async generate(params: GenerateResponseParams): Promise<GenerateResponseResult> {
    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "x-api-key": getApiKey(),
          "anthropic-version": ANTHROPIC_VERSION,
          "content-type": "application/json",
        },
        body: JSON.stringify(buildRequestBody(params, false)),
        signal: params.signal,
      });

      if (!response.ok) {
        const message = await readErrorMessage(response);
        throw new AIProviderError(message, response.status === 401 ? "missing_api_key" : "api_error");
      }

      const payload = (await response.json()) as AnthropicMessageResponse;
      return {
        text: extractText(payload),
        model: payload.model,
        stopReason: payload.stop_reason,
      };
    } catch (error) {
      throw mapAnthropicError(error);
    }
  }

  async stream(params: GenerateResponseParams, onDelta: StreamDeltaHandler): Promise<GenerateResponseResult> {
    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "x-api-key": getApiKey(),
          "anthropic-version": ANTHROPIC_VERSION,
          "content-type": "application/json",
        },
        body: JSON.stringify(buildRequestBody(params, true)),
        signal: params.signal,
      });

      if (!response.ok) {
        const message = await readErrorMessage(response);
        throw new AIProviderError(message, response.status === 401 ? "missing_api_key" : "api_error");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new AIProviderError("Streaming response body was empty.", "api_error");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";
      let model = aiConfig.anthropic.model;
      let stopReason: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;

          let event: Record<string, unknown>;
          try {
            event = JSON.parse(data);
          } catch {
            continue;
          }

          if (event.type === "message_start" && event.message && typeof event.message === "object") {
            const message = event.message as { model?: string };
            if (message.model) model = message.model;
          }

          if (event.type === "content_block_delta" && event.delta && typeof event.delta === "object") {
            const delta = event.delta as { type?: string; text?: string };
            if (delta.type === "text_delta" && delta.text) {
              accumulated += delta.text;
              onDelta(delta.text, accumulated);
            }
          }

          if (event.type === "message_delta" && event.delta && typeof event.delta === "object") {
            const delta = event.delta as { stop_reason?: string | null };
            if (delta.stop_reason) stopReason = delta.stop_reason;
          }
        }
      }

      return {
        text: accumulated.trim(),
        model,
        stopReason,
      };
    } catch (error) {
      throw mapAnthropicError(error);
    }
  }
}

let anthropicProvider: AnthropicProvider | null = null;

export function getAnthropicProvider(): AnthropicProvider {
  if (!anthropicProvider) {
    anthropicProvider = new AnthropicProvider();
  }
  return anthropicProvider;
}
