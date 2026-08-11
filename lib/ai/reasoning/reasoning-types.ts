import type { ComposedResponse, KnowledgeDocument, KnowledgeSearchCache } from "../types";
import type { QuestionType, UserInputAnalysis } from "./input-analyzer";

export type KnowledgeTier = "user" | "general" | "personal";

export type ReasoningIntent =
  | "architecture-review"
  | "technology-explanation"
  | "technology-comparison"
  | "project-discussion"
  | "career-question"
  | "leadership"
  | "mentoring"
  | "interview-preparation"
  | "cloud-cost-review"
  | "sql-review"
  | "pipeline-review"
  | "debugging"
  | "performance-optimization"
  | "system-design"
  | "best-practices"
  | "decision-making"
  | "engineering-philosophy"
  | "resume-question"
  | "behavioral-interview"
  | "scenario-analysis"
  | "unknown";

export type ReasoningMode = "ask" | "architecture" | "pipeline" | "sql" | "interview" | "cloud" | string;

export type EntityKind = "technology" | "project" | "concept" | "philosophy" | "story" | "resume" | "unknown";

export type ExtractedEntity = {
  label: string;
  normalized: string;
  kind: EntityKind;
  confidence: number;
  aliases: string[];
  source: "question" | "knowledge";
};

export type IntentClassification = {
  primary: ReasoningIntent;
  secondary: ReasoningIntent[];
  confidence: number;
  signals: string[];
  matchedPatterns: string[];
};

export type EntityExtraction = {
  entities: ExtractedEntity[];
  technologies: ExtractedEntity[];
  projects: ExtractedEntity[];
  concepts: ExtractedEntity[];
  flowEntities: ExtractedEntity[];
  confidence: number;
  signals: string[];
};

export type RetrievedDocument = KnowledgeDocument & {
  score: number;
  reasons: string[];
  matchedEntities: string[];
  tier?: KnowledgeTier;
};

export type RetrievalBuckets = {
  userContext: RetrievedDocument[];
  generalKnowledge: RetrievedDocument[];
  personalKnowledge: RetrievedDocument[];
};

export type PlannedSection = {
  name: string;
  purpose: string;
  kind: "body" | "bullets";
  generatorId: string;
  tier?: "primary" | "detail";
  optional?: boolean;
};

export type ResponsePlan = {
  questionType: QuestionType;
  strategyId: string;
  sections: PlannedSection[];
  density?: "concise" | "detailed";
};

export type RelatedExperienceItem = {
  title: string;
  project: string;
  relevance: string;
  relevanceReason: string;
  confidence: "high" | "medium" | "low";
};

export type FollowUpSuggestion = {
  label: string;
  targetSubject?: string;
  targetAction?: string;
  targetIntent?: ReasoningIntent;
  targetQuestionType?: QuestionType;
  parentTopic?: string;
  targetMode?: string;
  preservedQuestion?: string;
};

export type ModeRedirect = {
  targetMode: string;
  label: string;
  preserveQuestion: string;
  reason?: string;
};

export type RelatedProjectLink = {
  title: string;
  slug: string;
  href: string;
  reason: string;
  relevance: "high" | "medium";
};

export type SiteLink = {
  title: string;
  href: string;
  label: string;
  reason: string;
  primary?: boolean;
  /** Open in a new tab (external URLs, mailto) */
  external?: boolean;
};

export type ResponseSources = {
  generalEngineering: string[];
  personalExperience: string[];
  technologiesDiscussed: string[];
  relatedProjects: string[];
};

export type PipelineTrace = {
  mode: string;
  questionType: QuestionType;
  intent: ReasoningIntent;
  subject: string;
  action: string;
  entities: string[];
  conversationSubject?: string;
  retrievedKnowledge: Array<{ id: string; title: string; tier: KnowledgeTier; score: number }>;
  responseStrategy: string;
  analysis: UserInputAnalysis;
};

export type ReasoningContext = {
  question: string;
  mode: ReasoningMode;
  intent: IntentClassification;
  questionType: QuestionType;
  analysis: UserInputAnalysis;
  entities: EntityExtraction;
  documents: RetrievedDocument[];
  primaryDocuments: RetrievedDocument[];
  supportingDocuments: RetrievedDocument[];
  retrieval: RetrievalBuckets;
  cache: KnowledgeSearchCache;
  signals: string[];
};

export type SectionTemplate = {
  heading: string;
  kind: "body" | "bullets";
  sourceSections?: string[];
  sourceKinds?: string[];
  from?: "primary" | "supporting" | "any";
  optional?: boolean;
  limit?: number;
};

export type ReasoningStrategy = {
  id: string;
  title: string;
  primaryIntent: ReasoningIntent;
  sectionTemplates: SectionTemplate[];
  followUpHints: string[];
  clarifyWhenLowConfidence: boolean;
};

export type ConfidenceLevel = "high" | "medium" | "low";

export type ConfidenceAssessment = {
  score: number;
  level: ConfidenceLevel;
  reasons: string[];
  shouldClarify: boolean;
  missingPieces: string[];
};

export type BuiltResponse = ComposedResponse & {
  strategyId: string;
  primaryIntent: ReasoningIntent;
  secondaryIntents: ReasoningIntent[];
  confidence: ConfidenceAssessment;
  relatedExperience?: RelatedExperienceItem[];
  relatedProjects?: RelatedProjectLink[];
  siteLinks?: SiteLink[];
  modeRedirect?: ModeRedirect;
  sources?: ResponseSources;
  pipelineTrace?: PipelineTrace;
  conversationState?: import("./question-semantics").ConversationState;
};
