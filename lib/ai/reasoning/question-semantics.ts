import type { QuestionType } from "./input-analyzer";
import type { EntityExtraction, ReasoningIntent } from "./reasoning-types";

export type QuestionAction =
  | "explain"
  | "compare"
  | "recommend"
  | "review"
  | "design"
  | "optimize"
  | "troubleshoot"
  | "architecture-placement"
  | "component-placement"
  | "estimate"
  | "summarize"
  | "challenge"
  | "coach"
  | "critique"
  | "debug"
  | "describe"
  | "answer";

export type FollowUpContext = {
  label?: string;
  text?: string;
  targetSubject?: string;
  targetAction?: QuestionAction;
  targetIntent?: ReasoningIntent;
  targetQuestionType?: QuestionType;
  parentTopic?: string;
};

export type ConversationState = {
  currentSubject?: string;
  currentIntent?: ReasoningIntent;
  currentMode?: string;
  currentAction?: QuestionAction;
  currentEntities?: string[];
  recentQuestions: string[];
  recentSubjects: string[];
};

export type QuestionSemantics = {
  mode: string;
  intent: ReasoningIntent;
  subject: string;
  action: QuestionAction;
  entities: string[];
  constraints: string[];
  conversationContext: ConversationState;
};

export function emptyConversation(mode = "ask"): ConversationState {
  return {
    currentMode: mode,
    recentQuestions: [],
    recentSubjects: [],
    currentEntities: [],
  };
}

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isAffirmation(text: string) {
  const n = normalize(text);
  return /^(yes|yeah|yep|sure|ok|okay|please do|go ahead|do it)$/.test(n) || n === "y";
}

export function isSubjectContinuation(text: string) {
  const n = normalize(text);
  return /^(what about|how about|and )/.test(n) || (n.split(" ").length <= 4 && /\b(performance|cost|security|latency|governance|scaling)\b/.test(n));
}

export function resolveSubjectFromEntities(entities: EntityExtraction, technologies: string[]): string {
  if (entities.technologies[0]?.label) return entities.technologies[0].label;
  if (entities.projects[0]?.label) return entities.projects[0].label;
  if (entities.flowEntities.length === 1) return entities.flowEntities[0].label;
  if (technologies[0]) return technologies[0];
  return "";
}

export function mergeFollowUpIntoQuestion(
  rawQuestion: string,
  followUp?: FollowUpContext,
  conversation?: ConversationState
): string {
  if (!followUp && !conversation) return rawQuestion;

  if (isAffirmation(rawQuestion) && followUp?.label) {
    const subject = followUp.targetSubject || followUp.parentTopic || conversation?.currentSubject || "this topic";
    const action = followUp.targetAction || "explain";
    if (action === "architecture-placement") {
      return `Where does ${subject} sit in a reference architecture?`;
    }
    return followUp.label.replace(/\?$/, "") + ".";
  }

  if (isSubjectContinuation(rawQuestion) && conversation?.currentSubject) {
    const topic = normalize(rawQuestion).replace(/^what about /, "").replace(/^how about /, "");
    return `What about ${topic} for ${conversation.currentSubject}?`;
  }

  if (followUp?.targetSubject && !resolveExplicitSubject(rawQuestion)) {
    if (followUp.targetAction === "architecture-placement") {
      return `Where does ${followUp.targetSubject} sit in a reference architecture?`;
    }
  }

  return rawQuestion;
}

export function resolveExplicitSubject(text: string, technologies: string[] = []): string {
  for (const tech of technologies) {
    if (new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)) return tech;
  }
  const patterns: Array<[RegExp, string]> = [
    [/\bpower\s*bi\b/i, "Power BI"],
    [/\bspark\b/i, "Spark"],
    [/\bkafka\b/i, "Kafka"],
    [/\btableau\b/i, "Tableau"],
    [/\bdatabricks\b/i, "Databricks"],
    [/\bsnowflake\b/i, "Snowflake"],
    [/\blegacy data\b|\bdatalake modernization\b/i, "Legacy Data Modernization"],
    [/\biot\b/i, "IoT"],
  ];
  for (const [re, label] of patterns) {
    if (re.test(text)) return label;
  }
  return "";
}

export function updateConversationState(
  state: ConversationState,
  question: string,
  semantics: Pick<QuestionSemantics, "subject" | "intent" | "action" | "entities">,
  mode: string
): ConversationState {
  const subject = semantics.subject || state.currentSubject || "";
  return {
    currentSubject: subject || state.currentSubject,
    currentIntent: semantics.intent,
    currentMode: mode,
    currentAction: semantics.action,
    currentEntities: semantics.entities.length ? semantics.entities : state.currentEntities,
    recentQuestions: [question, ...state.recentQuestions].slice(0, 5),
    recentSubjects: subject ? [subject, ...state.recentSubjects.filter((s) => s !== subject)].slice(0, 5) : state.recentSubjects,
  };
}
