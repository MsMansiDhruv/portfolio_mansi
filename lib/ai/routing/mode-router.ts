import { MODE_AGENTS, type AiLabModeId } from "../mode-agents";
import type { ReasoningContext } from "../reasoning/reasoning-types";

export type ModeRoutingDecision = {
  type: "answer" | "redirect" | "casual";
  currentMode: AiLabModeId;
  bestMode: AiLabModeId;
  shouldRedirect: boolean;
  /** When true, return a redirect response without a full specialist answer. */
  redirectOnly: boolean;
  /** When true, the current mode may answer briefly before suggesting a switch. */
  allowPartialAnswer: boolean;
  redirectLabel: string;
  reason: string;
  explanation: string;
};

const CASUAL_PATTERN = /^(hi|hello|hey|good\s+(morning|afternoon|evening)|thanks|thank\s+you|yo|howdy)[!.?\s]*$/i;

const PERSONAL_ASK_PATTERNS = [
  /\bwhy did you (choose|use|pick|select)\b/i,
  /\bwhy do you (choose|use|pick|select)\b/i,
  /\btell me about yourself\b/i,
  /\btell me about your (experience|role|work|background|career|project|approach)\b/i,
  /\bwhat did you learn\b/i,
  /\bwhat have you learned\b/i,
  /\bwhat was your role\b/i,
  /\bhow do you (mentor|approach technical debt|think about)\b/i,
  /\bhow did you approach\b/i,
  /\bhow did you optimize\b/i,
  /\bdid you (build|design|choose|use|work on)\b/i,
  /\bwhat did you do with\b/i,
  /\bhow have you worked with\b/i,
  /\b(in|from) my (own )?work\b/i,
  /\btell me about (the )?(brain|olap|legacy|intelligence|gpu|amc|datalake|ml pipeline|allocation)/i,
  /\b(confidential client|your experience with)\b/i,
];

type ModeRule = {
  mode: AiLabModeId;
  patterns: RegExp[];
  weight: number;
};

const MODE_RULES: ModeRule[] = [
  {
    mode: "interview",
    weight: 10,
    patterns: [
      /\binterview me\b/i,
      /\bmock interview\b/i,
      /\bprepare (for|me for) (a |an )?(data engineering|lead|senior).*interview\b/i,
      /\bhow do i prepare for (a |an )?.*interview\b/i,
      /\bpractice interview\b/i,
    ],
  },
  {
    mode: "cloud",
    weight: 9,
    patterns: [
      /\bhow much (would|will|does|could).{0,40}cost\b/i,
      /\bestimate.{0,30}cost\b/i,
      /\baws bill\b/i,
      /\breduce.{0,24}(redshift|databricks|sagemaker|aws|cloud).{0,20}cost\b/i,
      /\bwhere.{0,30}(wasting|losing) money\b/i,
      /\bfinops\b/i,
      /\bworkload economics\b/i,
      /\bserverless.{0,30}expensive\b/i,
      /\bcost drivers\b/i,
    ],
  },
  {
    mode: "sql",
    weight: 9,
    patterns: [
      /\boptimize (this |my )?(spark sql|sql|query)\b/i,
      /\brewrite (this |my )?(sql|query)\b/i,
      /\bwhy is (this |my )?(query|join|sql) slow\b/i,
      /\bsql execution (strategy|plan)\b/i,
      /\bquery plan\b/i,
      /\bhow would you optimize this spark job\b/i,
      /\bhow do i optimize this spark job\b/i,
      /\boptimize this spark job\b/i,
      /\bpartition pruning\b/i,
      /\bbroadcast join\b/i,
      /\breduce shuffle\b/i,
      /\baqe\b/i,
      /\bdata skew\b/i,
    ],
  },
  {
    mode: "pipeline",
    weight: 8,
    patterns: [
      /\breview (this |my )?(etl|elt|pipeline|dag|airflow|spark pipeline)\b/i,
      /\brate (this |my )?(pipeline|architecture) for production\b/i,
      /\bwhat('s| is) missing (from )?(this |my )?(pipeline|architecture|production architecture)\b/i,
      /\bproduction readiness\b/i,
      /\bfind (reliability )?gaps\b/i,
      /\breview (this |my )?(kafka|spark|airflow).{0,40}(pipeline|chain|flow)\b/i,
      /\bhow should i optimize this databricks pipeline\b/i,
    ],
  },
  {
    mode: "architecture",
    weight: 8,
    patterns: [
      /\bdesign (a |an )?(scalable )?(lakehouse|data platform|architecture|system)\b/i,
      /\bhow should i design (a |an )?lakehouse\b/i,
      /\breview this architecture decision\b/i,
      /\breview (this |my )?architecture\b/i,
      /\barchitect(ure)? (for|of).{0,40}(mixed|operational|analytical)\b/i,
      /\b(redshift|dynamodb|kafka|kinesis).{0,20}(vs|versus).{0,20}(redshift|dynamodb|kafka|kinesis)\b/i,
      /\bwhen would you choose (each|between)\b/i,
      /\bworkload[- ]specific (data )?architecture\b/i,
      /\bmedallion architecture\b/i,
      /\bstorage[\/ ]compute separation\b/i,
    ],
  },
  {
    mode: "ask",
    weight: 7,
    patterns: [
      /\btell me about yourself\b/i,
      /\bwhat projects\b/i,
      /\bwhy did you\b/i,
      /\bwhat did you learn\b/i,
      /\bhow do you mentor\b/i,
      /\bwhat was your role\b/i,
      /\btell me about (the )?(brain|olap|legacy|intelligence|gpu|amc|datalake)/i,
    ],
  },
];

function isPersonalAskQuestion(question: string): boolean {
  return PERSONAL_ASK_PATTERNS.some((pattern) => pattern.test(question));
}

function scoreModes(question: string): Map<AiLabModeId, number> {
  const scores = new Map<AiLabModeId, number>();
  for (const rule of MODE_RULES) {
    let score = 0;
    for (const pattern of rule.patterns) {
      if (pattern.test(question)) score += rule.weight;
    }
    if (score > 0) scores.set(rule.mode, score);
  }
  return scores;
}

function redirectLabelFor(mode: AiLabModeId, question: string): string {
  const base = MODE_AGENTS[mode].label;
  if (mode === "sql" && /\bspark\b/i.test(question)) {
    return base;
  }
  return base;
}

function buildExplanation(bestMode: AiLabModeId, question: string): string {
  switch (bestMode) {
    case "sql":
      return /\bspark\b/i.test(question)
        ? "The question is primarily about Spark/SQL execution, partitioning, shuffles, joins, and optimization strategy."
        : "The question is primarily about SQL structure, query plans, and performance tuning.";
    case "pipeline":
      return "The question is primarily about reviewing an existing pipeline for production readiness, gaps, and operational risk.";
    case "architecture":
      return /\blakehouse\b/i.test(question)
        ? "The question is primarily about lakehouse/system architecture patterns, trade-offs, and design decisions."
        : "The question is primarily about system architecture, technology selection, and trade-offs.";
    case "cloud":
      return "The question is primarily about workload economics, cloud cost drivers, and optimization — not personal project narrative.";
    case "interview":
      return "The question is primarily about interview preparation, mock questions, and answer coaching.";
    case "ask":
      return "The question is primarily about Mansi's experience, projects, decisions, and lessons.";
    default:
      return MODE_AGENTS[bestMode].description;
  }
}

export type RouteModeOptions = {
  respectExplicitMode?: boolean;
  fromModeSwitch?: boolean;
};

export function routeModeIntent(
  context: ReasoningContext,
  options: RouteModeOptions = {}
): ModeRoutingDecision {
  const question = context.question.trim();
  const currentMode = (context.mode as AiLabModeId) in MODE_AGENTS ? (context.mode as AiLabModeId) : "ask";

  if (CASUAL_PATTERN.test(question)) {
    return {
      type: "casual",
      currentMode,
      bestMode: currentMode,
      shouldRedirect: false,
      redirectOnly: false,
      allowPartialAnswer: false,
      redirectLabel: MODE_AGENTS[currentMode].label,
      reason: "",
      explanation: "",
    };
  }

  const scores = scoreModes(question);
  let bestMode = currentMode;
  let bestScore = scores.get(currentMode) || 0;

  for (const [mode, score] of scores.entries()) {
    if (score > bestScore) {
      bestMode = mode;
      bestScore = score;
    }
  }

  if (isPersonalAskQuestion(question)) {
    bestMode = "ask";
    bestScore = Math.max(bestScore, 12);
  }

  if (currentMode === "ask" && isPersonalAskQuestion(question)) {
    return {
      type: "answer",
      currentMode,
      bestMode: "ask",
      shouldRedirect: false,
      redirectOnly: false,
      allowPartialAnswer: false,
      redirectLabel: MODE_AGENTS.ask.label,
      reason: "",
      explanation: "",
    };
  }

  const currentScore = scores.get(currentMode) || 0;
  const margin = options.fromModeSwitch || options.respectExplicitMode ? 6 : 3;
  const clearlyBetter = bestMode !== currentMode && bestScore >= 8 && bestScore >= currentScore + margin;

  if (!clearlyBetter) {
    return {
      type: "answer",
      currentMode,
      bestMode: currentMode,
      shouldRedirect: false,
      redirectOnly: false,
      allowPartialAnswer: false,
      redirectLabel: MODE_AGENTS[currentMode].label,
      reason: "",
      explanation: "",
    };
  }

  const redirectLabel = redirectLabelFor(bestMode, question);
  const explanation = buildExplanation(bestMode, question);

  const partialPersonalTechnical =
    currentMode === "ask" &&
    bestMode !== "ask" &&
    isPersonalAskQuestion(question) &&
    /\b(optimize|review|design|cost|interview)\b/i.test(question);

  const redirectOnly =
    !partialPersonalTechnical &&
    ((bestMode === "ask" && currentMode !== "ask" && (isPersonalAskQuestion(question) || context.questionType === "CAREER" || context.questionType === "PROJECT_QUESTION")) ||
      (currentMode === "ask" && bestMode !== "ask") ||
      (currentMode !== "ask" && bestMode !== "ask" && currentMode !== bestMode));

  return {
    type: "redirect",
    currentMode,
    bestMode,
    shouldRedirect: true,
    redirectOnly,
    allowPartialAnswer: partialPersonalTechnical,
    redirectLabel,
    reason: `That's better suited to ${redirectLabel}.`,
    explanation,
  };
}

export function buildCasualResponse(mode: AiLabModeId, question: string) {
  const greeting = CASUAL_PATTERN.test(question) ? question.replace(/[!.?\s]+$/g, "") : "Hello";
  const modeLabel = MODE_AGENTS[mode].label;
  return {
    title: "Hello",
    summary:
      mode === "ask"
        ? `${greeting.charAt(0).toUpperCase()}${greeting.slice(1)} — I'm glad you're here. Ask me about my projects, engineering decisions, lessons from production, or how I approach architecture and leadership.`
        : `${greeting.charAt(0).toUpperCase()}${greeting.slice(1)} — you're in ${modeLabel}. Share a question or paste code/architecture detail when you're ready.`,
    sections: [],
    followUps:
      mode === "ask"
        ? [
            { label: "Tell me about a difficult engineering decision." },
            { label: "What have you learned from production systems?" },
            { label: "Why did you choose this architecture?" },
          ]
        : MODE_AGENTS[mode].starterPrompts.slice(0, 3).map((label) => ({ label })),
  };
}

export function buildRedirectResponse(decision: ModeRoutingDecision, question: string) {
  const label = decision.redirectLabel;
  return {
    title: `Better suited to ${label}`,
    summary: `${decision.reason} ${decision.explanation}`,
    sections: [
      {
        heading: "Why this mode",
        body: `${label} is set up for this kind of problem. I can give you a focused analysis there instead of stretching the wrong persona.`,
        tier: "primary" as const,
      },
    ],
    followUps: [
      {
        label: `Switch to ${label}`,
        targetAction: "mode-switch",
        targetMode: decision.bestMode,
        preservedQuestion: question,
      },
    ],
    modeRedirect: {
      targetMode: decision.bestMode,
      label,
      preserveQuestion: question,
      reason: decision.explanation,
    },
  };
}
