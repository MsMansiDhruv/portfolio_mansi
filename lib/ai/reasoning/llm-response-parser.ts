import type { ComposedResponse } from "../types";
import type { FollowUpSuggestion } from "./reasoning-types";
import { AIProviderError } from "../providers/provider";
import { repairMergedWords } from "./text-spacing";

export type LLMResponsePayload = {
  title?: string;
  summary?: string;
  sections?: Array<{
    heading?: string;
    body?: string;
    bullets?: string[];
    tier?: "primary" | "detail";
  }>;
  followUps?: Array<{ label?: string; targetSubject?: string; targetAction?: string } | string>;
};

function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

export function parseLLMResponse(text: string): LLMResponsePayload {
  const cleaned = stripCodeFence(text);
  try {
    return JSON.parse(cleaned) as LLMResponsePayload;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as LLMResponsePayload;
      } catch (error) {
        throw new AIProviderError("Failed to parse model response as JSON.", "parse_error", error);
      }
    }
    throw new AIProviderError("Model response was not valid JSON.", "parse_error");
  }
}

export function normalizeLLMResponse(payload: LLMResponsePayload, fallbackTitle: string): Pick<ComposedResponse, "title" | "summary" | "sections" | "followUps"> {
  const sections = (payload.sections || [])
    .map((section) => ({
      heading: repairMergedWords(String(section.heading || "").trim()),
      body: section.body ? repairMergedWords(String(section.body).trim()) : undefined,
      bullets: Array.isArray(section.bullets)
        ? section.bullets.map((item) => repairMergedWords(String(item).trim())).filter(Boolean)
        : undefined,
      tier: section.tier === "detail" ? ("detail" as const) : ("primary" as const),
    }))
    .filter((section) => section.heading && (section.body || section.bullets?.length));

  const followUps: FollowUpSuggestion[] = (payload.followUps || [])
    .map((item) => {
      if (typeof item === "string") {
        return { label: repairMergedWords(item.trim()) };
      }
      return {
        label: repairMergedWords(String(item.label || "").trim()),
        targetSubject: item.targetSubject,
        targetAction: item.targetAction,
      };
    })
    .filter((item) => item.label)
    .slice(0, 5);

  return {
    title: repairMergedWords(String(payload.title || fallbackTitle).trim()) || fallbackTitle,
    summary: repairMergedWords(String(payload.summary || "").trim()),
    sections,
    followUps,
  };
}
