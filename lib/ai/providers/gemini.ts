import { aiConfig } from "../config";
import {
  AIProvider,
  AIProviderError,
  type GenerateResponseParams,
  type GenerateResponseResult,
  type StreamDeltaHandler,
} from "./provider";

type GeminiPart = { text?: string };
type GeminiContent = { role?: string; parts?: GeminiPart[] };
type GeminiCandidate = { content?: GeminiContent; finishReason?: string };

type GeminiResponse = {
  candidates?: GeminiCandidate[];
  modelVersion?: string;
  error?: { message?: string; code?: number; status?: string };
};

function mapGeminiError(error: unknown): AIProviderError {
  if (error instanceof AIProviderError) return error;

  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (lower.includes("rate") || lower.includes("429") || lower.includes("quota")) {
    return new AIProviderError(message, "rate_limit", error);
  }
  if (lower.includes("timeout") || lower.includes("timed out") || lower.includes("abort")) {
    return new AIProviderError(message, "timeout", error);
  }
  if (lower.includes("api key") || lower.includes("401") || lower.includes("403") || lower.includes("permission")) {
    return new AIProviderError(message, "missing_api_key", error);
  }

  return new AIProviderError(message, "api_error", error);
}

function normalizeModel(model: string): string {
  return model.replace(/^models\//, "").trim();
}

function getModel(): string {
  return normalizeModel(aiConfig.gemini.model);
}

function getModelCandidates(): string[] {
  const preferred = getModel();
  const fallbacks = ["gemini-3.1-flash-lite", "gemini-3-flash-preview", "gemini-3.5-flash"];
  return [...new Set([preferred, ...fallbacks].filter(Boolean))];
}

function isModelUnavailableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /no longer available|not found for API version|404/i.test(message);
}

function getApiKey(): string {
  const apiKey = aiConfig.gemini.apiKey?.trim();
  if (!apiKey) {
    throw new AIProviderError("GEMINI_API_KEY is not configured.", "missing_api_key");
  }
  return apiKey;
}

function endpoint(model: string, stream: boolean): string {
  const action = stream ? "streamGenerateContent" : "generateContent";
  return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:${action}?key=${encodeURIComponent(getApiKey())}${stream ? "&alt=sse" : ""}`;
}

function buildContents(params: GenerateResponseParams): GeminiContent[] {
  return params.messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));
}

function buildRequestBody(params: GenerateResponseParams) {
  return {
    systemInstruction: {
      parts: [{ text: params.systemPrompt }],
    },
    contents: buildContents(params),
    generationConfig: {
      temperature: params.temperature ?? aiConfig.generation.temperature,
      maxOutputTokens: params.maxTokens ?? aiConfig.gemini.maxTokens,
      responseMimeType: "application/json",
    },
  };
}

function extractText(payload: GeminiResponse): string {
  const parts = payload.candidates?.[0]?.content?.parts || [];
  return parts
    .map((part) => part.text || "")
    .join("")
    .trim();
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as GeminiResponse;
    return payload?.error?.message || response.statusText || "Gemini API request failed.";
  } catch {
    return response.statusText || "Gemini API request failed.";
  }
}

function parseSseChunk(chunk: string, onDelta?: StreamDeltaHandler, accumulated?: { text: string }) {
  for (const line of chunk.split("\n")) {
    if (!line.startsWith("data:")) continue;
    const data = line.slice(5).trim();
    if (!data || data === "[DONE]") continue;

    let event: GeminiResponse;
    try {
      event = JSON.parse(data);
    } catch {
      continue;
    }

    const delta = extractText(event);
    if (!delta) continue;

    if (accumulated) {
      accumulated.text += delta;
      onDelta?.(delta, accumulated.text);
    }
  }
}

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";

  private async generateWithModel(model: string, params: GenerateResponseParams): Promise<GenerateResponseResult> {
    const response = await fetch(endpoint(model, false), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(buildRequestBody(params)),
      signal: params.signal,
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw new AIProviderError(
        message,
        response.status === 401 || response.status === 403 ? "missing_api_key" : "api_error"
      );
    }

    const payload = (await response.json()) as GeminiResponse;
    if (payload.error?.message) {
      throw new AIProviderError(payload.error.message, "api_error");
    }

    return {
      text: extractText(payload),
      model: payload.modelVersion || model,
      stopReason: payload.candidates?.[0]?.finishReason || null,
    };
  }

  async generate(params: GenerateResponseParams): Promise<GenerateResponseResult> {
    let lastError: unknown;
    for (const model of getModelCandidates()) {
      try {
        return await this.generateWithModel(model, params);
      } catch (error) {
        lastError = error;
        if (!isModelUnavailableError(error)) {
          throw mapGeminiError(error);
        }
      }
    }
    throw mapGeminiError(lastError);
  }

  private async streamWithModel(
    model: string,
    params: GenerateResponseParams,
    onDelta: StreamDeltaHandler
  ): Promise<GenerateResponseResult> {
    const response = await fetch(endpoint(model, true), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(buildRequestBody(params)),
      signal: params.signal,
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw new AIProviderError(
        message,
        response.status === 401 || response.status === 403 ? "missing_api_key" : "api_error"
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new AIProviderError("Streaming response body was empty.", "api_error");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    const accumulated = { text: "" };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() || "";
      for (const block of blocks) {
        parseSseChunk(block, onDelta, accumulated);
      }
    }

    if (buffer.trim()) {
      parseSseChunk(buffer, onDelta, accumulated);
    }

    return {
      text: accumulated.text.trim(),
      model,
      stopReason: null,
    };
  }

  async stream(params: GenerateResponseParams, onDelta: StreamDeltaHandler): Promise<GenerateResponseResult> {
    let lastError: unknown;
    for (const model of getModelCandidates()) {
      try {
        return await this.streamWithModel(model, params, onDelta);
      } catch (error) {
        lastError = error;
        if (!isModelUnavailableError(error)) {
          throw mapGeminiError(error);
        }
      }
    }
    throw mapGeminiError(lastError);
  }
}

let geminiProvider: GeminiProvider | null = null;

export function getGeminiProvider(): GeminiProvider {
  if (!geminiProvider) {
    geminiProvider = new GeminiProvider();
  }
  return geminiProvider;
}
