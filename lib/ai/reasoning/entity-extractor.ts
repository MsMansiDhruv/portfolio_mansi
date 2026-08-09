import type { KnowledgeDocument } from "../types";
import type { EntityExtraction, EntityKind, ExtractedEntity } from "./reasoning-types";

type EntitySeed = {
  label: string;
  aliases: string[];
  kind: EntityKind;
};

const FALLBACK_SEEDS: EntitySeed[] = [
  { label: "Databricks", aliases: ["databricks"], kind: "technology" },
  { label: "Spark", aliases: ["spark", "apache spark"], kind: "technology" },
  { label: "Kafka", aliases: ["kafka", "apache kafka"], kind: "technology" },
  { label: "Delta Lake", aliases: ["delta lake", "delta"], kind: "technology" },
  { label: "Power BI", aliases: ["power bi", "powerbi"], kind: "technology" },
  { label: "Snowflake", aliases: ["snowflake"], kind: "technology" },
  { label: "Tableau", aliases: ["tableau"], kind: "technology" },
  { label: "Airflow", aliases: ["airflow", "apache airflow"], kind: "technology" },
  { label: "Terraform", aliases: ["terraform"], kind: "technology" },
  { label: "Azure", aliases: ["azure"], kind: "technology" },
  { label: "AWS", aliases: ["aws", "amazon web services"], kind: "technology" },
  { label: "S3", aliases: ["s3", "amazon s3"], kind: "technology" },
  { label: "Python", aliases: ["python"], kind: "technology" },
  { label: "SQL", aliases: ["sql"], kind: "technology" },
  { label: "AMC", aliases: ["amc", "amc datalake", "datalake solution"], kind: "project" },
  { label: "GPU Benchmark", aliases: ["gpu benchmark"], kind: "project" },
  { label: "OLAP Workload Architecture", aliases: ["olap", "olap workload", "workload architecture"], kind: "project" },
  { label: "architecture review", aliases: ["architecture review", "system design", "architecture"], kind: "concept" },
  { label: "lakehouse", aliases: ["lakehouse"], kind: "concept" },
  { label: "streaming", aliases: ["streaming"], kind: "concept" },
  { label: "batch", aliases: ["batch"], kind: "concept" },
  { label: "medallion", aliases: ["medallion"], kind: "concept" },
  { label: "governance", aliases: ["governance"], kind: "concept" },
  { label: "observability", aliases: ["observability", "monitoring"], kind: "concept" },
  { label: "engineering principles", aliases: ["engineering principles", "principles"], kind: "philosophy" },
  { label: "architecture philosophy", aliases: ["architecture philosophy"], kind: "philosophy" },
  { label: "leadership philosophy", aliases: ["leadership philosophy"], kind: "philosophy" },
  { label: "mentoring style", aliases: ["mentoring style", "mentoring"], kind: "philosophy" },
];

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phrasePattern(value: string) {
  const normalized = normalize(value);
  const escaped = escapeRegExp(normalized).replace(/\s+/g, "[\\s\\-/]+");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

function pushEntity(list: ExtractedEntity[], entity: ExtractedEntity) {
  if (list.some((item) => item.normalized === entity.normalized)) return;
  list.push(entity);
}

function seedFromDocument(document: KnowledgeDocument): EntitySeed[] {
  const seeds: EntitySeed[] = [];
  seeds.push({ label: document.title, aliases: [document.title], kind: document.category === "project" ? "project" : document.category === "resume" ? "resume" : document.category === "philosophy" ? "philosophy" : document.category === "story" ? "story" : "technology" });

  for (const technology of document.technologies || []) {
    seeds.push({ label: technology, aliases: [technology], kind: "technology" });
  }

  for (const project of document.projects || []) {
    seeds.push({ label: project, aliases: [project], kind: "project" });
  }

  for (const topic of document.topics || []) {
    seeds.push({ label: topic, aliases: [topic], kind: "concept" });
  }

  for (const skill of document.skills || []) {
    seeds.push({ label: skill, aliases: [skill], kind: "concept" });
  }

  for (const tag of document.tags || []) {
    seeds.push({ label: tag, aliases: [tag], kind: "concept" });
  }

  return seeds;
}

function buildSeeds(documents: KnowledgeDocument[]) {
  const byNormalized = new Map<string, EntitySeed>();
  for (const seed of [...FALLBACK_SEEDS, ...documents.flatMap(seedFromDocument)]) {
    const normalized = normalize(seed.label);
    if (!normalized) continue;
    if (!byNormalized.has(normalized)) byNormalized.set(normalized, seed);
  }
  return Array.from(byNormalized.values()).sort((left, right) => right.label.length - left.label.length);
}

function entityFromSeed(seed: EntitySeed, alias: string, source: "question" | "knowledge"): ExtractedEntity {
  const normalized = normalize(alias || seed.label);
  return {
    label: seed.label,
    normalized,
    kind: seed.kind,
    confidence: normalize(alias) === normalize(seed.label) ? 0.96 : 0.82,
    aliases: seed.aliases,
    source,
  };
}

function extractFlowEntities(question: string, seeds: EntitySeed[], entities: ExtractedEntity[]) {
  const segments = String(question || "")
    .split(/(?:->|→|➜|=>|,|\/)/g)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const flowEntities: ExtractedEntity[] = [];
  for (const segment of segments) {
    const normalized = normalize(segment);
    const match =
      entities.find((entity) => normalized === entity.normalized || normalized.includes(entity.normalized) || entity.normalized.includes(normalized)) ||
      seeds.find((seed) => seed.aliases.some((alias) => phrasePattern(alias).test(segment)));
    if (!match) continue;
    const extracted = "label" in match ? entityFromSeed({ label: match.label, aliases: match.aliases, kind: match.kind }, match.label, "question") : entityFromSeed(match, segment, "question");
    pushEntity(flowEntities, extracted);
  }
  return flowEntities;
}

export function extractEntities(question: string, documents: KnowledgeDocument[] = []): EntityExtraction {
  const seeds = buildSeeds(documents);
  const text = String(question || "");
  const entities: ExtractedEntity[] = [];

  for (const seed of seeds) {
    for (const alias of seed.aliases) {
      if (!alias) continue;
      if (normalize(alias) === "architecture" && (/\bdesign\b|\bstream|\biot\b/i.test(text))) {
        continue;
      }
      if (normalize(alias) === "bi") {
        continue;
      }
      if (normalize(seed.label) === "architecture review" && /\bask me\b|\binterview\b/i.test(text) && !/\breview\b/i.test(text)) {
        continue;
      }
      if (normalize(alias) === "design" && /\bsystem design\b/i.test(text) && !/\bdesign\b.*\barchitect/i.test(text)) {
        continue;
      }
      const pattern = phrasePattern(alias);
      if (!pattern.test(text)) continue;
      pushEntity(entities, entityFromSeed(seed, alias, "question"));
      break;
    }
  }

  const technologies = entities.filter((entity) => entity.kind === "technology");
  const projects = entities.filter((entity) => entity.kind === "project");
  const concepts = entities.filter((entity) => entity.kind === "concept" || entity.kind === "philosophy" || entity.kind === "resume" || entity.kind === "story");
  const flowEntities = extractFlowEntities(text, seeds, entities);

  const confidenceBase = entities.length ? Math.min(0.95, 0.4 + entities.length * 0.12 + (flowEntities.length > 1 ? 0.12 : 0)) : 0.2;

  return {
    entities,
    technologies,
    projects,
    concepts,
    flowEntities,
    confidence: confidenceBase,
    signals: entities.map((entity) => entity.label),
  };
}
