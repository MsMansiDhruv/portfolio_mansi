import type { ReasoningIntent } from "./reasoning-types";

export type QuestionType =
  | "EXPLANATION"
  | "COMPARISON"
  | "ARCHITECTURE_DESIGN"
  | "ARCHITECTURE_REVIEW"
  | "ARCHITECTURE_PLACEMENT"
  | "COMPONENT_PLACEMENT"
  | "INGESTION_RECOMMENDATION"
  | "PORTFOLIO_OVERVIEW"
  | "TECHNOLOGIES_OVERVIEW"
  | "OPTIMIZATION"
  | "COST_ANALYSIS"
  | "TROUBLESHOOTING"
  | "PROJECT_QUESTION"
  | "PERSONAL_EXPERIENCE"
  | "INTERVIEW"
  | "CAREER"
  | "SQL_OPTIMIZATION"
  | "UNKNOWN";

export type { QuestionAction } from "./question-semantics";
import type { ConversationState, FollowUpContext, QuestionAction } from "./question-semantics";
import { mergeFollowUpIntoQuestion, resolveExplicitSubject } from "./question-semantics";

export type UserInputAnalysis = {
  rawQuestion: string;
  effectiveQuestion: string;
  intentHint: string;
  questionType: QuestionType;
  subject: string;
  action: QuestionAction;
  domain: string;
  processingPattern: string;
  technologies: string[];
  architectureComponents: string[];
  constraints: string[];
  requirements: string[];
  requestedAction: string;
  signals: string[];
};

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function has(text: string, pattern: RegExp) {
  return pattern.test(text);
}

export function analyzeUserInput(
  question: string,
  options?: { conversation?: ConversationState; followUp?: FollowUpContext; mode?: string }
): UserInputAnalysis {
  const rawQuestion = String(question || "").trim();
  const effectiveQuestion = mergeFollowUpIntoQuestion(rawQuestion, options?.followUp, options?.conversation);
  const text = effectiveQuestion;
  const n = normalize(text);

  const technologies: string[] = [];
  const architectureComponents: string[] = [];
  const constraints: string[] = [];
  const requirements: string[] = [];
  const signals: string[] = [];

  const techPatterns: Array<[RegExp, string]> = [
    [/\bkafka\b/i, "Kafka"],
    [/\bspark\b/i, "Spark"],
    [/\bs3\b/i, "S3"],
    [/\bpower\s*bi\b/i, "Power BI"],
    [/\bdatabricks\b/i, "Databricks"],
    [/\bdelta(\s+lake)?\b/i, "Delta Lake"],
    [/\bsnowflake\b/i, "Snowflake"],
    [/\bairflow\b/i, "Airflow"],
    [/\bsagemaker\b/i, "SageMaker"],
    [/\baws\b/i, "AWS"],
    [/\bazure\b/i, "Azure"],
    [/\bkinesis\b/i, "Kinesis"],
    [/\btableau\b/i, "Tableau"],
    [/\biot\b/i, "IoT"],
  ];

  for (const [pattern, label] of techPatterns) {
    if (pattern.test(text)) technologies.push(label);
  }

  if (/(->|→|➜|=>)/.test(text)) {
    signals.push("flow-chain");
    text
      .split(/(?:->|→|➜|=>)/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((seg) => architectureComponents.push(seg));
  }

  if (/\biot\b/i.test(text)) {
    signals.push("domain:iot");
  }
  if (/\bstream(ing)?\b/i.test(text)) {
    signals.push("pattern:streaming");
  }
  if (/\bbatch\b/i.test(text)) {
    signals.push("pattern:batch");
  }
  if (/\blatency\b/i.test(text)) {
    requirements.push("latency");
  }
  if (/\bthroughput\b/i.test(text)) {
    requirements.push("throughput");
  }
  if (/\bcost\b|\bbill\b|\bspend\b/i.test(text)) {
    constraints.push("cost");
  }

  let domain = "general";
  if (/\biot\b/i.test(text)) domain = "IoT";
  else if (/\bretail\b/i.test(text)) domain = "retail";
  else if (/\bfinance\b|\bfintech\b/i.test(text)) domain = "finance";

  let processingPattern = "unknown";
  if (/\bstream(ing)?\b/i.test(text)) processingPattern = "streaming";
  else if (/\bbatch\b/i.test(text)) processingPattern = "batch";
  else if (/\blakehouse\b/i.test(text)) processingPattern = "lakehouse";

  let requestedAction = "answer";
  if (/\bdesign\b/i.test(text)) requestedAction = "design/recommend architecture";
  else if (/\breview\b/i.test(text)) requestedAction = "review architecture";
  else if (/\boptimiz/i.test(text)) requestedAction = "optimize";
  else if (/\bexplain\b|\bwhat is\b/i.test(text)) requestedAction = "explain";
  else if (/\bcompare\b|\bvs\b/i.test(text)) requestedAction = "compare";
  else if (/\btell me about\b/i.test(text)) requestedAction = "describe project/experience";
  else if (/\bask me\b/i.test(text)) requestedAction = "interview prompt";

  let intentHint = "general-inquiry";
  if (requestedAction.includes("design")) intentHint = "architecture-design";
  else if (requestedAction.includes("review")) intentHint = "architecture-review";
  else if (constraints.includes("cost")) intentHint = "cost-analysis";
  else if (/\bmentor\b/i.test(text)) intentHint = "mentoring";
  else if (/\binterview\b/i.test(text) || /\bask me\b/i.test(text)) intentHint = "interview";

  const questionType = inferQuestionType(text, n, requestedAction, technologies, architectureComponents, options?.mode);
  const action = inferAction(text, questionType, requestedAction);
  let subject = resolveExplicitSubject(text, technologies);
  const whereSit = text.match(/\bwhere does\s+(.+?)\s+sit\b/i);
  if (whereSit) {
    const candidate = whereSit[1].trim();
    subject = resolveExplicitSubject(candidate, technologies) || candidate.split(/\s+in\b/i)[0].trim();
  }
  if (!subject && /\b(it|this tool|this)\b/i.test(text) && options?.conversation?.currentSubject) {
    subject = options.conversation.currentSubject;
  }
  if (!subject && options?.conversation?.currentSubject && (isAffirmation(rawQuestion) || isSubjectContinuation(rawQuestion))) {
    subject = options.conversation.currentSubject;
  }
  if (!subject && options?.followUp?.targetSubject) {
    subject = options.followUp.targetSubject;
  }
  if (!subject && questionType === "ARCHITECTURE_DESIGN" && domain === "IoT") {
    subject = "IoT streaming platform";
  }

  return {
    rawQuestion,
    effectiveQuestion,
    intentHint,
    questionType,
    subject,
    action,
    domain,
    processingPattern,
    technologies,
    architectureComponents,
    constraints,
    requirements,
    requestedAction,
    signals,
  };
}

function isAffirmation(text: string) {
  return /^(yes|yeah|yep|sure|ok|okay|please do|go ahead|do it)$/i.test(String(text).trim()) || /^y$/i.test(String(text).trim());
}

function isSubjectContinuation(text: string) {
  const n = normalize(text);
  return /^(what about|how about)/.test(n) || (n.split(" ").length <= 5 && /\b(performance|cost|security|latency|governance|scaling)\b/.test(n));
}

function inferAction(text: string, questionType: QuestionType, requestedAction: string): QuestionAction {
  if (questionType === "ARCHITECTURE_PLACEMENT") return "architecture-placement";
  if (questionType === "COMPONENT_PLACEMENT") return "component-placement";
  if (questionType === "INGESTION_RECOMMENDATION") return "recommend";
  if (questionType === "ARCHITECTURE_DESIGN") return "design";
  if (questionType === "ARCHITECTURE_REVIEW") return "review";
  if (questionType === "COMPARISON") return "compare";
  if (questionType === "OPTIMIZATION") return "optimize";
  if (questionType === "COST_ANALYSIS") return "estimate";
  if (questionType === "TROUBLESHOOTING") return "troubleshoot";
  if (questionType === "SQL_OPTIMIZATION") return "optimize";
  if (questionType === "INTERVIEW") return "coach";
  if (questionType === "PROJECT_QUESTION") return "describe";
  if (questionType === "PERSONAL_EXPERIENCE") return "explain";
  if (/\bexplain\b/i.test(text)) return "explain";
  if (requestedAction.includes("compare")) return "compare";
  if (requestedAction.includes("design")) return "design";
  return "explain";
}

function looksLikeSqlStatement(text: string) {
  return /\bselect\b[\s\S]{0,800}\bfrom\b/i.test(text) || /\b(with|insert into|update)\b[\s\S]{0,400}\b(from|set)\b/i.test(text);
}

function inferQuestionType(
  text: string,
  n: string,
  requestedAction: string,
  technologies: string[],
  flow: string[],
  mode?: string
): QuestionType {
  if (mode === "sql" && (looksLikeSqlStatement(text) || /\bsql\b/i.test(text))) {
    return "SQL_OPTIMIZATION";
  }
  if (looksLikeSqlStatement(text) && (mode === "sql" || !/\b(project|amc|portfolio|career)\b/i.test(text))) {
    return "SQL_OPTIMIZATION";
  }

  if (
    mode === "interview" &&
    (/\btell me about\b/i.test(text) ||
      /\bdifficult\b.*\b(decision|problem|challenge|situation|conflict|incident|failure|mistake)\b/i.test(text) ||
      /\bwhy should we hire\b/i.test(text))
  ) {
    if (!/\b(amc|datalake|project|portfolio|gpu|cuda)\b/i.test(text)) return "INTERVIEW";
  }
  const isPlacement =
    /\b(where|sit|sits|belong|belongs|fits|fit in|placement|layer)\b/i.test(text) &&
    /\b(reference architecture|architecture|stack|platform|pipeline|chain)\b/i.test(text);

  if (isPlacement && technologies.length >= 1) {
    if (/(->|→|➜|=>)/.test(text) || flow.length >= 2) return "COMPONENT_PLACEMENT";
    return "ARCHITECTURE_PLACEMENT";
  }

  if (/\bwhat would you use\b/i.test(text) && /\bingestion\b/i.test(text)) {
    return "INGESTION_RECOMMENDATION";
  }

  if (/\bwhat did you build\b/i.test(text) && /\bamc\b/i.test(text)) return "PROJECT_QUESTION";
  if (/\bcompare\b/i.test(text) && /\b(tableau|looker|snowflake|databricks|power bi|spark)\b/i.test(text)) return "COMPARISON";

  if (/\bwhat projects\b/i.test(text) && /\b(mansi|you|she|have you|worked on)\b/i.test(text)) {
    return "PORTFOLIO_OVERVIEW";
  }
  if (/\bwhat technologies\b/i.test(text) && /\b(mansi|you|she|worked with)\b/i.test(text)) {
    return "TECHNOLOGIES_OVERVIEW";
  }

  if (/\bask me\b.*\b(system design|interview)\b/i.test(text) || /\bask me a system design\b/i.test(text)) {
    return "INTERVIEW";
  }
  if (/\binterview\b/i.test(text) && !/\bproject\b/i.test(text)) return "INTERVIEW";
  if (/\btell me about\b.*\b(amc|datalake)\b/i.test(text)) return "PROJECT_QUESTION";
  if (/\btell me about\b.*\b(the\s+)?project\b/i.test(text) || (/\bproject\b/i.test(text) && /\btell me\b/i.test(text))) {
    return "PROJECT_QUESTION";
  }
  if (/\bhow do you mentor\b/i.test(text)) return "PERSONAL_EXPERIENCE";
  if (/\bwhy did you (use|choose)\b/i.test(text)) return "PERSONAL_EXPERIENCE";
  if (/\bwhat('s| is) your experience\b/i.test(text) || (/\bcareer\b/i.test(text) && !/\bdesign\b/i.test(text))) {
    return "CAREER";
  }
  if (/\bcompare\b|\bvs\.?\b|\bversus\b/i.test(text) && technologies.length >= 2) return "COMPARISON";
  if (/\bcompare\b|\bvs\.?\b/i.test(text) && /databricks|snowflake|kafka|kinesis/i.test(text)) return "COMPARISON";
  if (/\bwhat is\b/i.test(text) || (/\bwhy\b/i.test(text) && technologies.length === 1 && !/\bdesign\b/i.test(text))) {
    return "EXPLANATION";
  }
  if (/\bsql\b/i.test(text) && /\boptimiz/i.test(text)) return "SQL_OPTIMIZATION";
  if (/\b(reduce|reducing|lower|cut|save)\b/i.test(text) && /\b(costs?|spend)\b/i.test(text)) {
    if (/\bspark\b/i.test(text) || /\bjob\b/i.test(text) || /\bcluster\b/i.test(text)) return "OPTIMIZATION";
    return "COST_ANALYSIS";
  }
  if (/\boptimiz/i.test(text) && /\bstage\b/i.test(text)) return "OPTIMIZATION";
  if (/\boptimiz/i.test(text) || /\bslow\b/i.test(text) || /\bperformance\b/i.test(text)) return "OPTIMIZATION";
  if (/\bbill\b|\bcost\b|\bspend\b|\bsagemaker\b/i.test(text) && /\bhigh\b/i.test(text)) return "COST_ANALYSIS";
  if (/\bfail/i.test(text) || /\bbroken\b/i.test(text) || /\bdebug\b/i.test(text)) return "TROUBLESHOOTING";
  if (flow.length >= 2 || (/\breview\b/i.test(text) && flow.length >= 1)) return "ARCHITECTURE_REVIEW";

  if (
    /\bstreaming architecture\b/i.test(text) ||
    (/\biot\b/i.test(text) && /\barchitecture\b/i.test(text) && !isPlacement) ||
    (/\bdesign\b/i.test(text) && /\b(architecture|system|platform|stream)\b/i.test(text) && !isPlacement)
  ) {
    return "ARCHITECTURE_DESIGN";
  }

  if (requestedAction.includes("design") && !isPlacement) return "ARCHITECTURE_DESIGN";
  if (requestedAction.includes("review")) return "ARCHITECTURE_REVIEW";
  return "UNKNOWN";
}

export function mapQuestionTypeToIntent(questionType: QuestionType): ReasoningIntent {
  switch (questionType) {
    case "EXPLANATION":
      return "technology-explanation";
    case "COMPARISON":
      return "technology-comparison";
    case "ARCHITECTURE_DESIGN":
      return "system-design";
    case "ARCHITECTURE_REVIEW":
      return "architecture-review";
    case "ARCHITECTURE_PLACEMENT":
    case "COMPONENT_PLACEMENT":
      return "technology-explanation";
    case "INGESTION_RECOMMENDATION":
      return "system-design";
    case "OPTIMIZATION":
      return "performance-optimization";
    case "COST_ANALYSIS":
      return "cloud-cost-review";
    case "TROUBLESHOOTING":
      return "debugging";
    case "PROJECT_QUESTION":
      return "project-discussion";
    case "PORTFOLIO_OVERVIEW":
    case "TECHNOLOGIES_OVERVIEW":
      return "career-question";
    case "PERSONAL_EXPERIENCE":
      return "mentoring";
    case "INTERVIEW":
      return "interview-preparation";
    case "CAREER":
      return "career-question";
    case "SQL_OPTIMIZATION":
      return "sql-review";
    default:
      return "unknown";
  }
}
