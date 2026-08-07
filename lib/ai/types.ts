export type Intent =
  | "project"
  | "technology"
  | "architecture"
  | "comparison"
  | "troubleshooting"
  | "career"
  | "leadership"
  | "mentoring"
  | "interview"
  | "cloud-cost"
  | "sql"
  | "pipeline-review"
  | "unknown";

export type KnowledgeFrontmatter = {
  title?: string;
  tags?: string[];
  technologies?: string[];
  projects?: string[];
  skills?: string[];
  topics?: string[];
  difficulty?: string[];
  relatedDocuments?: string[];
  summary?: string;
  category?: string;
  kind?: string;
  status?: string;
};

export type KnowledgeSection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

export type KnowledgeDocument = {
  id: string;
  title: string;
  path: string;
  slug: string;
  category: string;
  tags: string[];
  technologies: string[];
  projects: string[];
  skills: string[];
  topics: string[];
  difficulty: string[];
  relatedDocuments: string[];
  summary: string;
  excerpt: string;
  sections: KnowledgeSection[];
  frontmatter: KnowledgeFrontmatter;
  content: string;
};

export type KnowledgeSourceRecord = Record<string, unknown>;

export type KnowledgeHit = {
  id: string;
  title: string;
  category: string;
  score: number;
  reason: string[];
  matchedTerms: string[];
  sourcePath: string;
  summary: string;
  tags: string[];
  technologies: string[];
  topics: string[];
  sections: KnowledgeSection[];
  relatedDocuments: string[];
  content: string;
};

export type KnowledgeSearchCache = {
  documents: KnowledgeDocument[];
  byId: Map<string, KnowledgeDocument>;
  byTitle: Map<string, KnowledgeDocument[]>;
  byCategory: Map<string, KnowledgeDocument[]>;
  byTag: Map<string, KnowledgeDocument[]>;
  byTechnology: Map<string, KnowledgeDocument[]>;
  byTopic: Map<string, KnowledgeDocument[]>;
  bySkill: Map<string, KnowledgeDocument[]>;
  byProject: Map<string, KnowledgeDocument[]>;
  byRelatedDocument: Map<string, KnowledgeDocument[]>;
};

export type RetrievalContext = {
  intent: Intent;
  question: string;
  documents: KnowledgeDocument[];
  hits: KnowledgeHit[];
  cache: KnowledgeSearchCache;
};

export type ResponseSection = {
  heading: string;
  body?: string;
  bullets?: string[];
  score?: string;
  kind?: "body" | "bullets";
  tier?: "primary" | "detail";
  type?: "text" | "bullets" | "project";
};

export type ComposedResponse = {
  title: string;
  summary?: string;
  sections: ResponseSection[];
  followUps: import("./reasoning/reasoning-types").FollowUpSuggestion[];
  citations: string[];
  persona?: "first-person";
  intent?: Intent;
  sourceCount?: number;
  sources?: import("./reasoning/reasoning-types").ResponseSources;
  density?: "concise" | "detailed";
  mode?: string;
};

export type KnowledgeSourceAdapter = {
  kind: "markdown" | "json" | "database" | "vector" | "static";
  load: () => KnowledgeDocument[] | Promise<KnowledgeDocument[]>;
};
