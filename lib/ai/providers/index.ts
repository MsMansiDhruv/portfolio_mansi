import { aiConfig, isLLMConfigured } from "../config";
import { getAnthropicProvider } from "./anthropic";
import { getGeminiProvider } from "./gemini";
import type { AIProvider } from "./provider";

export function getAIProvider(): AIProvider {
  switch (aiConfig.provider) {
    case "anthropic":
      return getAnthropicProvider();
    case "gemini":
      return getGeminiProvider();
    default:
      throw new Error(`Unsupported AI provider: ${aiConfig.provider}`);
  }
}

export { isLLMConfigured };
