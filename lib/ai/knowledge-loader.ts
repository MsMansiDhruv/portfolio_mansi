import { knowledgeCatalog as sourceKnowledgeCatalog } from "../../app/tools/ai-lab/knowledge/index.js";
import type {
  KnowledgeDocument,
  KnowledgeFrontmatter,
  KnowledgeSearchCache,
  KnowledgeSection,
  KnowledgeSourceAdapter,
  KnowledgeSourceRecord,
} from "./types";

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function list(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((item) => String(item).trim()).filter(Boolean)));
}

function slugify(value = "") {
  return normalize(value).replace(/\s+/g, "-");
}

function sectionFromArray(heading: string, values: unknown): KnowledgeSection | null {
  const bullets = list(values);
  if (!bullets.length) return null;
  return { heading, paragraphs: [], bullets };
}

function sectionFromText(heading: string, value: unknown): KnowledgeSection | null {
  const text = String(value || "").trim();
  if (!text) return null;
  return { heading, paragraphs: [text], bullets: [] };
}

function sectionFromRoles(roles: unknown): KnowledgeSection | null {
  if (!Array.isArray(roles) || !roles.length) return null;
  const bullets = roles
    .map((role) => {
      if (!role || typeof role !== "object") return "";
      const entry = role as Record<string, unknown>;
      const year = String(entry.year || "").trim();
      const title = String(entry.title || "").trim();
      const summary = String(entry.summary || "").trim();
      const parts = [year, title].filter(Boolean).join(" - ");
      return [parts, summary].filter(Boolean).join(": ");
    })
    .filter(Boolean);
  return bullets.length ? { heading: "Career Timeline", paragraphs: [], bullets } : null;
}

function buildSections(source: Record<string, unknown>): KnowledgeSection[] {
  const kind = String(source.kind || "");
  const sections: KnowledgeSection[] = [];

  const addArray = (heading: string, values: unknown) => {
    const section = sectionFromArray(heading, values);
    if (section) sections.push(section);
  };

  const addText = (heading: string, value: unknown) => {
    const section = sectionFromText(heading, value);
    if (section) sections.push(section);
  };

  if (kind === "project") {
    addText("Business Context", source.businessContext);
    addText("Problem Statement", source.problemStatement);
    addText("My Responsibilities", source.myRole);
    addArray("Architecture", source.architecture);
    addArray("Technologies", source.technologies);
    addArray("Engineering Decisions", source.decisions);
    addArray("Alternatives Considered", source.alternatives);
    addArray("Trade-offs", source.tradeoffs);
    addArray("Challenges", source.challenges);
    addArray("Business Impact", source.outcomes);
    addText("Scale", source.scale);
    addText("Performance", source.performance);
    addArray("Lessons Learned", source.lessonsLearned);
    addArray("What I Would Improve Today", source.whatIWouldImproveToday);
    addArray("Related Technologies", source.relatedTechnologies);
    addArray("Related Projects", source.relatedProjects);
    return sections;
  }

  if (kind === "technology") {
    addText("Overview", source.summary);
    addArray("Why I Use It", source.whyIChooseIt);
    addArray("When I Choose It", source.whenIUseIt);
    addArray("When I Avoid It", source.whenIAvoidIt);
    addArray("Advantages", source.pros);
    addArray("Disadvantages", source.cons);
    addArray("Alternatives", source.alternatives);
    addArray("Enterprise Considerations", source.operationalConsiderations);
    addArray("Scaling Considerations", source.scalingConsiderations);
    addArray("Common Mistakes", source.commonMistakes);
    addArray("Best Practices", source.bestPractices);
    addArray("Related Technologies", source.relatedTechnologies);
    addArray("Related Projects", source.relatedProjects);
    return sections;
  }

  if (kind === "philosophy") {
    addArray("How I Design Systems", source.systems);
    addArray("How I Mentor Engineers", source.mentoring);
    addArray("How I Make Architecture Decisions", source.architecture);
    addArray("How I Balance Delivery With Quality", source.delivery);
    addArray("How I Think About Scalability", source.scalability);
    addArray("How I Think About Observability", source.observability);
    addArray("How I Approach Automation", source.automation);
    addArray("How I Approach Governance", source.governance);
    return sections;
  }

  if (kind === "story") {
    addArray("Summary", source.summaryPoints);
    addArray("What Happened", source.whatHappened);
    addArray("What I Did", source.actions);
    addArray("What I Learned", source.lessonsLearned);
    addArray("What I Would Do Differently Today", source.whatIDoDifferently);
    return sections;
  }

  if (kind === "interview") {
    addArray("Rubric", source.rubric);
    addArray("Guidance", source.guidance);
    addArray("Improvements", source.improvements);
    addArray("Related Experience", source.relatedExperience);
    return sections;
  }

  if (kind === "resume") {
    const timeline = sectionFromRoles(source.roles);
    if (timeline) sections.push(timeline);
    addArray("Credentials", source.credentials);
    addArray("Awards", source.awards);
    addArray("Leadership", source.leadership);
    return sections;
  }

  if (kind === "architecture") {
    addText("Overview", source.summary);
    addArray("Principles", source.principles);
    addArray("Technology Selection", source.technologySelection);
    addArray("Trade-offs", source.tradeoffs);
    addArray("Scalability", source.scalability);
    addArray("Security", source.security);
    addArray("Monitoring", source.monitoring);
    addArray("Risks", source.risks);
    addArray("Related Technologies", source.relatedTechnologies);
    return sections;
  }

  addText("Overview", source.summary);
  return sections;
}

function toPath(category = "", slug = "") {
  if (category === "project") return `knowledge/projects/${slug}.md`;
  if (category === "technology") return `knowledge/technologies/${slug}.md`;
  if (category === "story") return `knowledge/stories/${slug}.md`;
  if (category === "resume") return `knowledge/resume/${slug}.md`;
  if (category === "philosophy") return `knowledge/philosophy/${slug}.md`;
  if (category === "interview") return `knowledge/interview/${slug}.md`;
  return `knowledge/${category}/${slug}.md`;
}

const relatedLookup = new Map(
  sourceKnowledgeCatalog.map((entry) => {
    const category = String(entry.category || "");
    const kind = String(entry.kind || category);
    return [normalize(String(entry.title || entry.id || "")), String(entry.id || `${category}/${slugify(String(entry.title || kind))}`)];
  })
);

function resolveRelatedReference(reference: string, defaultCategory: string) {
  const normalized = normalize(reference);
  if (!normalized) return "";
  return (
    relatedLookup.get(normalized) ||
    relatedLookup.get(normalized.replace(/\s+/g, "-")) ||
    `${defaultCategory}/${slugify(reference)}`
  );
}

function normalizeRelatedDocuments(source: Record<string, unknown>, category: string) {
  const relatedDocuments = list(source.relatedDocuments).map((item) => resolveRelatedReference(item, category));
  const relatedProjects = list(source.relatedProjects).map((project) => resolveRelatedReference(project, "project"));
  const relatedTechnologies = list(source.relatedTechnologies).map((technology) => resolveRelatedReference(technology, "technology"));
  return Array.from(new Set([...relatedDocuments, ...relatedProjects, ...relatedTechnologies].filter(Boolean)));
}

function buildDocument(source: KnowledgeSourceRecord): KnowledgeDocument {
  const category = String(source.category || "misc");
  const kind = String(source.kind || category);
  const title = String(source.title || source.name || kind).trim();
  const slugSource = String(source.slug || source.id || title || category).trim();
  const slug = slugSource
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const tags = list(source.tags);
  const technologies = list(source.technologies);
  const projects = list(source.projects);
  const skills = list(source.skills);
  const topics = list(source.topics);
  const difficulty = list(source.difficulty);
  const sections = buildSections(source);
  const summary = String(source.summary || source.excerpt || sections[0]?.paragraphs[0] || sections[0]?.bullets[0] || "").trim();
  const excerpt = String(source.excerpt || summary || "").trim();
  const relatedDocuments = normalizeRelatedDocuments(source, category);
  const frontmatter: KnowledgeFrontmatter = {
    title,
    tags,
    technologies,
    projects,
    skills,
    topics,
    difficulty,
    relatedDocuments,
    summary,
    category,
    kind,
  };

  return {
    id: String(source.id || `${category}/${slug}`),
    title,
    path: String(source.path || toPath(category, slug)),
    slug,
    category,
    tags,
    technologies,
    projects,
    skills,
    topics,
    difficulty,
    relatedDocuments,
    summary,
    excerpt,
    sections,
    frontmatter,
    content: String(source.content || source.body || buildContentFromSections(title, sections)),
  };
}

function buildContentFromSections(title: string, sections: KnowledgeSection[]) {
  const lines = [`# ${title}`, ""];
  for (const section of sections) {
    lines.push(section.heading);
    for (const paragraph of section.paragraphs) lines.push(paragraph);
    for (const bullet of section.bullets) lines.push(`- ${bullet}`);
    lines.push("");
  }
  return lines.join("\n").trim();
}

function makeSearchMap(documents: KnowledgeDocument[], selector: (document: KnowledgeDocument) => string[]) {
  const map = new Map<string, KnowledgeDocument[]>();
  for (const document of documents) {
    for (const value of selector(document)) {
      const key = normalize(value);
      if (!key) continue;
      const bucket = map.get(key) || [];
      bucket.push(document);
      map.set(key, bucket);
    }
  }
  return map;
}

export function buildSearchCache(documents: KnowledgeDocument[]): KnowledgeSearchCache {
  return {
    documents,
    byId: new Map(documents.map((document) => [document.id, document])),
    byTitle: makeSearchMap(documents, (document) => [document.title]),
    byCategory: makeSearchMap(documents, (document) => [document.category]),
    byTag: makeSearchMap(documents, (document) => document.tags),
    byTechnology: makeSearchMap(documents, (document) => document.technologies),
    byTopic: makeSearchMap(documents, (document) => document.topics),
    bySkill: makeSearchMap(documents, (document) => document.skills),
    byProject: makeSearchMap(documents, (document) => document.projects),
    byRelatedDocument: makeSearchMap(documents, (document) => document.relatedDocuments),
  };
}

export function loadKnowledge(): KnowledgeDocument[] {
  return sourceKnowledgeCatalog.map(buildDocument);
}

export function createKnowledgeLoader(adapter: KnowledgeSourceAdapter = { kind: "static", load: loadKnowledge }) {
  return async function loadAndIndexKnowledge() {
    const documents = await adapter.load();
    return {
      documents,
      cache: buildSearchCache(documents),
    };
  };
}
