import type { ReasoningContext } from "./reasoning-types";
import type { QuestionType } from "./input-analyzer";
import type { AiLabModeId } from "../mode-agents";

export type QuestionGrounding = "general" | "personal" | "mixed";

const PERSONAL_QUESTION_TYPES: QuestionType[] = [
  "PROJECT_QUESTION",
  "PERSONAL_EXPERIENCE",
  "CAREER",
  "PORTFOLIO_OVERVIEW",
  "TECHNOLOGIES_OVERVIEW",
];

const PERSONAL_INTENTS = new Set([
  "project-discussion",
  "career-question",
  "resume-question",
  "leadership",
  "mentoring",
  "engineering-philosophy",
]);

const PERSONAL_PHRASES =
  /\b(you|your|why did you|how did you|tell me about your|what was your role|my role|did you build|have you worked|in your experience|your experience|your project|your approach|you choose|you used|you use|what did you do|what have you learned)\b/i;

const GENERAL_PHRASES =
  /\b(what is|what are|how does|how do|explain|define|when should|when would|compare|difference between|vs\.?|versus)\b/i;

const NON_ASK_MODES = new Set<AiLabModeId>(["architecture", "pipeline", "sql", "cloud"]);

export function classifyQuestionGrounding(context: ReasoningContext): QuestionGrounding {
  const { questionType, question, intent, mode } = context;
  const modeId = mode as AiLabModeId;
  const asksPersonal = PERSONAL_PHRASES.test(question);
  const asksGeneral = GENERAL_PHRASES.test(question);

  if (modeId === "ask") {
    if (PERSONAL_QUESTION_TYPES.includes(questionType)) {
      return "personal";
    }
    if (PERSONAL_INTENTS.has(intent.primary)) {
      return "personal";
    }
    if (asksPersonal) {
      return asksGeneral && questionType === "EXPLANATION" ? "mixed" : "personal";
    }
    if (questionType === "EXPLANATION" || questionType === "COMPARISON") {
      if (asksPersonal && context.documents.some((doc) => doc.category === "project" || doc.category === "experience")) {
        return "mixed";
      }
      return "general";
    }
    return asksPersonal ? "personal" : "general";
  }

  if (modeId === "interview") {
    if (PERSONAL_QUESTION_TYPES.includes(questionType) || PERSONAL_INTENTS.has(intent.primary)) {
      return "personal";
    }
    if (asksPersonal) return "mixed";
    return "general";
  }

  if (NON_ASK_MODES.has(modeId)) {
    if (asksGeneral && !asksPersonal) return "general";
    if (asksPersonal && (questionType === "EXPLANATION" || questionType === "COMPARISON" || questionType === "ARCHITECTURE_DESIGN")) {
      return "mixed";
    }
    if (PERSONAL_QUESTION_TYPES.includes(questionType) || PERSONAL_INTENTS.has(intent.primary)) {
      return "general";
    }
    return "general";
  }

  if (PERSONAL_QUESTION_TYPES.includes(questionType)) return "personal";
  if (PERSONAL_INTENTS.has(intent.primary)) return "personal";
  if (asksPersonal) return "personal";
  return "general";
}

export function isOutOfModePersonalScope(context: ReasoningContext): boolean {
  const modeId = context.mode as AiLabModeId;
  if (modeId === "ask" || modeId === "interview") return false;

  if (PERSONAL_QUESTION_TYPES.includes(context.questionType)) return true;
  if (PERSONAL_INTENTS.has(context.intent.primary)) return true;
  if (/\b(mansi|your career|about you|tell me about you|your background|your resume)\b/i.test(context.question)) return true;
  return PERSONAL_PHRASES.test(context.question);
}

export function groundingLabel(grounding: QuestionGrounding): string {
  switch (grounding) {
    case "personal":
      return "personal experience (portfolio context is authoritative)";
    case "mixed":
      return "mixed general + personal";
    default:
      return "general engineering";
  }
}
