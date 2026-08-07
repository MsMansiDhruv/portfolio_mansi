import type { ReasoningMode, ReasoningIntent, IntentClassification } from "./reasoning-types";
import type { UserInputAnalysis } from "./input-analyzer";
import { mapQuestionTypeToIntent } from "./input-analyzer";

type IntentRule = {
  intent: ReasoningIntent;
  patterns: RegExp[];
  signals: string[];
};

const TECHNICAL_TERMS = [
  "databricks",
  "spark",
  "kafka",
  "delta lake",
  "delta",
  "power bi",
  "powerbi",
  "snowflake",
  "airflow",
  "terraform",
  "azure",
  "aws",
  "s3",
  "python",
  "sql",
];

const FLOW_PATTERN = /(?:->|→|➜|=>)/;

const INTENT_RULES: IntentRule[] = [
  {
    intent: "technology-comparison",
    patterns: [/\b(compare|comparison|vs\.?|versus|trade[- ]offs?|difference between|why not)\b/i],
    signals: ["comparison language"],
  },
  {
    intent: "architecture-review",
    patterns: [/\b(architecture review|review my architecture|architecture|system design|design review)\b/i, FLOW_PATTERN],
    signals: ["architecture language", "flow chain"],
  },
  {
    intent: "pipeline-review",
    patterns: [/\b(pipeline|etl|elt|dag|orchestration|data flow|streaming|batch)\b/i],
    signals: ["pipeline language"],
  },
  {
    intent: "performance-optimization",
    patterns: [/\b(performance|slow|latency|throughput|optimize|bottleneck)\b/i],
    signals: ["performance language"],
  },
  {
    intent: "cloud-cost-review",
    patterns: [/\b(cost|costs|bill|spend|pricing|idle compute|waste)\b/i],
    signals: ["cost language"],
  },
  {
    intent: "sql-review",
    patterns: [/\b(sql|query|join|group by|window|execution plan|cte)\b/i],
    signals: ["sql language"],
  },
  {
    intent: "debugging",
    patterns: [/\b(debug|debugging|troubleshoot|error|failure|broken|incident|root cause)\b/i],
    signals: ["debugging language"],
  },
  {
    intent: "interview-preparation",
    patterns: [/\b(interview|mock interview|prep|preparation)\b/i],
    signals: ["interview language"],
  },
  {
    intent: "behavioral-interview",
    patterns: [/\b(behavioral|tell me about a time|conflict|stakeholder|difficult conversation)\b/i],
    signals: ["behavioral language"],
  },
  {
    intent: "mentoring",
    patterns: [/\b(mentor|mentoring|coach|coaching|teach|guidance)\b/i],
    signals: ["mentoring language"],
  },
  {
    intent: "leadership",
    patterns: [/\b(leadership|lead|team leadership|stakeholder management|influence)\b/i],
    signals: ["leadership language"],
  },
  {
    intent: "career-question",
    patterns: [/\b(career|background|timeline|experience)\b/i],
    signals: ["career language"],
  },
  {
    intent: "resume-question",
    patterns: [/\b(resume|cv|cv review)\b/i],
    signals: ["resume language"],
  },
  {
    intent: "technology-explanation",
    patterns: [/\b(why|what is|when should i use|when do i use|why do you use|explain)\b/i],
    signals: ["explanatory language"],
  },
  {
    intent: "decision-making",
    patterns: [/\b(decide|decision|choose|alternatives|trade[- ]offs?)\b/i],
    signals: ["decision language"],
  },
  {
    intent: "engineering-philosophy",
    patterns: [/\b(philosophy|principles|how do you think|approach|how i think)\b/i],
    signals: ["philosophy language"],
  },
  {
    intent: "best-practices",
    patterns: [/\b(best practices|guidelines|patterns|recommended)\b/i],
    signals: ["best-practices language"],
  },
  {
    intent: "scenario-analysis",
    patterns: [/\b(what would you do|how would you handle|scenario|if you had|imagine)\b/i],
    signals: ["scenario language"],
  },
  {
    intent: "system-design",
    patterns: [/\b(system design|design a system|scalable design|architecture)\b/i],
    signals: ["system design language"],
  },
  {
    intent: "project-discussion",
    patterns: [/\b(project|portfolio|tell me about|worked on|case study)\b/i],
    signals: ["project language"],
  },
];

const MODE_HINTS: Record<string, ReasoningIntent> = {
  architecture: "architecture-review",
  pipeline: "pipeline-review",
  sql: "sql-review",
  interview: "interview-preparation",
  cloud: "cloud-cost-review",
  ask: "career-question",
};

const MODE_PRIORITIES: Record<string, ReasoningIntent[]> = {
  architecture: ["architecture-review", "system-design", "pipeline-review", "technology-explanation"],
  pipeline: ["pipeline-review", "architecture-review", "performance-optimization"],
  sql: ["sql-review", "performance-optimization", "debugging"],
  interview: ["interview-preparation", "behavioral-interview", "scenario-analysis", "leadership"],
  cloud: ["cloud-cost-review", "architecture-review", "performance-optimization"],
  ask: ["career-question", "project-discussion", "technology-explanation"],
};

function normalize(value = "") {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function countMatches(text: string, patterns: RegExp[]) {
  return patterns.reduce((count, pattern) => (pattern.test(text) ? count + 1 : count), 0);
}

function scoreByKeywords(text: string, intent: ReasoningIntent) {
  switch (intent) {
    case "architecture-review":
    case "system-design":
      return countMatches(text, [/\barchitecture\b/i, /\bdesign\b/i, FLOW_PATTERN, /\bscalab/i, /\breview\b/i]) * 3;
    case "technology-explanation":
      return countMatches(text, [/\bwhy\b/i, /\bwhat is\b/i, /\bwhen should i use\b/i, /\bexplain\b/i]) * 2;
    case "technology-comparison":
      return countMatches(text, [/\bcompare\b/i, /\bvs\b/i, /\bversus\b/i, /\bdifference\b/i]) * 3;
    case "project-discussion":
      return countMatches(text, [/\bproject\b/i, /\bworked on\b/i, /\btell me about\b/i, /\bcase study\b/i]) * 2;
    case "career-question":
    case "resume-question":
      return countMatches(text, [/\bcareer\b/i, /\bresume\b/i, /\btimeline\b/i, /\bexperience\b/i]) * 2;
    case "leadership":
    case "mentoring":
      return countMatches(text, [/\blead\b/i, /\bmentor\b/i, /\bcoach\b/i, /\bstakeholder\b/i]) * 2;
    case "interview-preparation":
    case "behavioral-interview":
      return countMatches(text, [/\binterview\b/i, /\bbehavioral\b/i, /\bstory\b/i, /\btell me about a time\b/i]) * 3;
    case "cloud-cost-review":
      return countMatches(text, [/\bcost\b/i, /\bbill\b/i, /\bspend\b/i, /\bpricing\b/i]) * 3;
    case "sql-review":
      return countMatches(text, [/\bsql\b/i, /\bquery\b/i, /\bjoin\b/i, /\bwindow\b/i, /\bexecution plan\b/i]) * 3;
    case "pipeline-review":
      return countMatches(text, [/\bpipeline\b/i, /\bdag\b/i, /\borchestrat/i, /\bstream/i, /\bbatch\b/i]) * 3;
    case "debugging":
      return countMatches(text, [/\bdebug/i, /\berror\b/i, /\bfail/i, /\bincident\b/i, /\broot cause\b/i]) * 3;
    case "performance-optimization":
      return countMatches(text, [/\bperformance\b/i, /\bslow\b/i, /\blatency\b/i, /\bthroughput\b/i, /\boptimiz/i]) * 3;
    case "decision-making":
      return countMatches(text, [/\bchoose\b/i, /\bdecision\b/i, /\balternatives\b/i, /\btrade[- ]offs?\b/i]) * 2;
    case "engineering-philosophy":
      return countMatches(text, [/\bphilosophy\b/i, /\bprinciples\b/i, /\bapproach\b/i, /\bhow i think\b/i]) * 2;
    case "best-practices":
      return countMatches(text, [/\bbest practices\b/i, /\bguidelines\b/i, /\bpatterns\b/i]) * 2;
    case "scenario-analysis":
      return countMatches(text, [/\bwhat would you do\b/i, /\bhow would you handle\b/i, /\bscenario\b/i]) * 3;
    default:
      return 0;
  }
}

function hasTechnicalTerms(text: string) {
  return TECHNICAL_TERMS.filter((term) => normalize(text).includes(term)).length;
}

export function classifyIntent(question: string, mode: ReasoningMode = "ask", analysis?: UserInputAnalysis): IntentClassification {
  const text = String(question || "").trim();
  const normalized = normalize(text);
  const scores = new Map<ReasoningIntent, number>();
  const signals: string[] = [];
  const matchedPatterns: string[] = [];

  for (const rule of INTENT_RULES) {
    const matchCount = rule.patterns.reduce((count, pattern) => (pattern.test(text) ? count + 1 : count), 0);
    if (!matchCount) continue;
    scores.set(rule.intent, (scores.get(rule.intent) || 0) + matchCount * 4);
    signals.push(...rule.signals);
    matchedPatterns.push(rule.intent);
  }

  const technicalCount = hasTechnicalTerms(text);
  if (technicalCount > 0) {
    scores.set("technology-explanation", (scores.get("technology-explanation") || 0) + technicalCount * 2);
    scores.set("technology-comparison", (scores.get("technology-comparison") || 0) + (normalized.includes(" vs ") || normalized.includes(" compare ") ? 2 : 0));
  }

  if (FLOW_PATTERN.test(text) || technicalCount >= 3) {
    scores.set("architecture-review", (scores.get("architecture-review") || 0) + 8);
    scores.set("pipeline-review", (scores.get("pipeline-review") || 0) + 6);
    scores.set("system-design", (scores.get("system-design") || 0) + 4);
    signals.push("flow chain");
  }

  if (/\bdesign\b/i.test(text) && !/\bwhy\b/i.test(text)) {
    scores.set("system-design", (scores.get("system-design") || 0) + 12);
    scores.set("architecture-review", (scores.get("architecture-review") || 0) - 4);
  }

  if (analysis) {
    const mapped = mapQuestionTypeToIntent(analysis.questionType);
    if (mapped !== "unknown") {
      scores.set(mapped, (scores.get(mapped) || 0) + 14);
      signals.push(`questionType:${analysis.questionType}`);
    }
    if (analysis.questionType === "ARCHITECTURE_DESIGN") {
      scores.set("technology-explanation", (scores.get("technology-explanation") || 0) - 10);
      scores.set("engineering-philosophy", (scores.get("engineering-philosophy") || 0) - 8);
    }
    if (analysis.questionType === "ARCHITECTURE_REVIEW") {
      scores.set("system-design", (scores.get("system-design") || 0) - 6);
    }
  }

  if (/why\s+[a-z]/i.test(text) && technicalCount > 0) {
    scores.set("technology-explanation", (scores.get("technology-explanation") || 0) + 6);
  }

  if (/\bcompare\b|\bvs\b|\bversus\b/i.test(text)) {
    scores.set("technology-comparison", (scores.get("technology-comparison") || 0) + 8);
  }

  if (/\btell me about\b|\bworked on\b/i.test(text)) {
    scores.set("project-discussion", (scores.get("project-discussion") || 0) + 8);
  }

  if (/^\s*(how|why)\s+do\s+you\s+(mentor|lead|design|think)/i.test(text)) {
    scores.set("mentoring", (scores.get("mentoring") || 0) + 6);
    scores.set("leadership", (scores.get("leadership") || 0) + 4);
    scores.set("engineering-philosophy", (scores.get("engineering-philosophy") || 0) + 3);
  }

  const modeHint = MODE_HINTS[mode] || "unknown";
  if (modeHint !== "unknown") {
    scores.set(modeHint, (scores.get(modeHint) || 0) + 3);
    signals.push(`mode:${modeHint}`);
  }

  const priority = MODE_PRIORITIES[mode] || MODE_PRIORITIES.ask;
  for (const intent of priority) {
    scores.set(intent, (scores.get(intent) || 0) + scoreByKeywords(text, intent));
  }

  if (!scores.size) {
    return {
      primary: modeHint,
      secondary: [],
      confidence: 0.25,
      signals: ["fallback to mode"],
      matchedPatterns: [],
    };
  }

  const ranked = Array.from(scores.entries())
    .filter(([, score]) => score > 0)
    .sort((left, right) => right[1] - left[1]);

  const [primaryIntent, primaryScore] = ranked[0] || ["unknown", 0];
  const secondScore = ranked[1]?.[1] || 0;
  const secondary = ranked
    .slice(1)
    .filter(([, score]) => score >= Math.max(3, primaryScore * 0.5))
    .slice(0, 3)
    .map(([intent]) => intent);

  const confidence = Math.max(
    0.1,
    Math.min(0.98, (primaryScore / Math.max(primaryScore + secondScore + 4, 1)) + (primaryScore > secondScore ? 0.15 : 0))
  );

  return {
    primary: primaryIntent as ReasoningIntent,
    secondary,
    confidence,
    signals,
    matchedPatterns,
  };
}
