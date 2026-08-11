export type AIProviderName = "anthropic" | "openai" | "gemini" | "azure-openai";

export const aiConfig = {
  provider: (process.env.AI_PROVIDER || "anthropic") as AIProviderName,
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || "",
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
    maxTokens: Number(process.env.ANTHROPIC_MAX_TOKENS || 4096),
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
    maxTokens: Number(process.env.GEMINI_MAX_TOKENS || 4096),
  },
  retrieval: {
    maxDocuments: Number(process.env.AI_MAX_CONTEXT_DOCS || 6),
    maxDocumentChars: Number(process.env.AI_MAX_DOC_CHARS || 2800),
  },
  conversation: {
    maxHistoryMessages: Number(process.env.AI_MAX_HISTORY || 6),
  },
  generation: {
    temperature: Number(process.env.AI_TEMPERATURE || 0.4),
    requestTimeoutMs: Number(process.env.AI_REQUEST_TIMEOUT_MS || 60000),
  },
} as const;

export function isLLMConfigured(): boolean {
  switch (aiConfig.provider) {
    case "anthropic":
      return Boolean(aiConfig.anthropic.apiKey?.trim());
    case "gemini":
      return Boolean(aiConfig.gemini.apiKey?.trim());
    default:
      return false;
  }
}

export function getProviderMaxTokens(): number {
  switch (aiConfig.provider) {
    case "gemini":
      return aiConfig.gemini.maxTokens;
    case "anthropic":
      return aiConfig.anthropic.maxTokens;
    default:
      return 4096;
  }
}
