export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type GenerateResponseParams = {
  systemPrompt: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  signal?: AbortSignal;
};

export type GenerateResponseResult = {
  text: string;
  model: string;
  stopReason?: string | null;
};

export type StreamDeltaHandler = (delta: string, accumulated: string) => void;

export interface AIProvider {
  readonly name: string;
  generate(params: GenerateResponseParams): Promise<GenerateResponseResult>;
  stream?(params: GenerateResponseParams, onDelta: StreamDeltaHandler): Promise<GenerateResponseResult>;
}

export class AIProviderError extends Error {
  readonly code: "missing_api_key" | "rate_limit" | "timeout" | "api_error" | "parse_error" | "unknown";

  constructor(message: string, code: AIProviderError["code"] = "unknown", cause?: unknown) {
    super(message);
    this.name = "AIProviderError";
    this.code = code;
    if (cause instanceof Error) {
      this.cause = cause;
    }
  }
}

export function toUserSafeErrorMessage(error: unknown): string {
  if (error instanceof AIProviderError) {
    switch (error.code) {
      case "missing_api_key":
        return "The reasoning layer is not configured yet. Please try again later.";
      case "rate_limit":
        return "I'm receiving too many requests right now. Please wait a moment and try again.";
      case "timeout":
        return "This is taking longer than expected. Please try again with a shorter question.";
      default:
        break;
    }
  }
  return "I'm having trouble reaching the reasoning layer right now. Please try again.";
}
