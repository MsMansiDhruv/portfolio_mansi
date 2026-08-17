import { FEATURED_PROJECT_SLUG, SUPPORTING_PROJECT_SLUGS, getProjectMeta } from "./project-meta";
import { EXPERIMENT_PROJECT_SLUGS } from "./identity";

export const HOME_FEATURED = (() => {
  const amc = getProjectMeta(FEATURED_PROJECT_SLUG);
  const supporting = SUPPORTING_PROJECT_SLUGS.map((s) => getProjectMeta(s)).filter(Boolean);
  const experiments = EXPERIMENT_PROJECT_SLUGS.map((s) => getProjectMeta(s)).filter(
    (p) => p && !SUPPORTING_PROJECT_SLUGS.includes(p.slug) && p.slug !== FEATURED_PROJECT_SLUG
  );
  const seen = new Set();
  return [amc, ...supporting, ...experiments].filter((p) => {
    if (!p || seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
})();

/** Visual hints derived from documented project data — not invented claims */
function projectVisual(meta) {
  if (!meta) return null;

  if (meta.architectureLayers?.length) {
    return {
      label: "Architecture",
      type: "layers",
      nodes: meta.architectureLayers.slice(0, 4),
    };
  }

  switch (meta.slug) {
    case "brain-mvp":
      return {
        label: "ML allocation flow",
        type: "flow",
        nodes: ["Signals", "Classification", "Allocation", "Recommendations"],
      };
    case "automated-intelligence-pipeline":
      return {
        label: "Pipeline stages",
        type: "flow",
        nodes: ["Discover", "Extract", "Classify", "Report"],
      };
    case "olap-workload-architecture":
      return {
        label: "Workload separation",
        type: "split",
        leftLabel: "Before",
        rightLabel: "After",
        left: "One warehouse serving OLTP + OLAP",
        right: "Dedicated serving + S3 analytics",
      };
    default:
      return null;
  }
}

export const HOME_CASE_STUDIES = HOME_FEATURED.map((p) => ({
  slug: p.slug,
  title: p.title,
  category: p.category,
  techLabel: (p.tech || []).join(" · "),
  problem: p.problem,
  visual: projectVisual(p),
  kind: EXPERIMENT_PROJECT_SLUGS.includes(p.slug) ? "experiment" : "client",
  editorialLabel: p.decisions?.[0] ? "Why this architecture" : null,
  editorialNote: p.decisions?.[0]?.why || p.whatIWouldChangeToday?.[0] || null,
  outcome:
    p.slug === "project-amc-datalake-solution"
      ? "Centralized data on AWS, modern Glue ETL, and stronger BI and self-service reporting."
      : p.slug === "gpu-bench"
        ? "Repeatable CUDA benchmarks to justify GPU spend with evidence, not hype."
        : p.slug === "brain-mvp"
          ? "Production ML allocation — from persona classification through deployment to user-facing recommendations."
          : p.slug === "automated-intelligence-pipeline"
            ? "Automated web intelligence — crawlers, deduplication, DS model integration, and reporting on AWS."
            : p.slug === "olap-workload-architecture"
              ? "Production migration separating serving and analytics after cost and benchmark evidence."
              : p.slug === "saffron-research"
                ? "Field research and pilot plots for saffron harvesting feasibility."
                : p.slug === "pc-accessories" || p.slug === "acrylic-store"
                  ? "Side business building and selling custom PC aesthetic components."
                  : p.slug === "cuda-tiling"
                    ? "Shared-memory tiling microbenchmarks informing broader GPU work."
                    : p.summary || p.desc,
}));

export const ENGINEERING_PRINCIPLES = [
  { title: "Reliability", phrase: "Design for failure, not just the happy path." },
  { title: "Simplicity", phrase: "Prefer clear ownership and fewer moving parts." },
  { title: "Cost awareness", phrase: "Treat cloud cost as an architecture concern." },
  { title: "Automation", phrase: "Make repeat work boring so people focus on decisions." },
  { title: "Observability", phrase: "If we can't explain what the system is doing, we can't operate it well." },
];

export const AI_AGENTS = [
  {
    id: "architecture",
    label: "Architecture Expert",
    purpose: "Design and evaluate architectures — trade-offs, scale, reliability, cost.",
  },
  {
    id: "pipeline",
    label: "Pipeline Reviewer",
    purpose: "Review production readiness, gaps, and operational risks.",
  },
  { id: "sql", label: "SQL Optimizer", purpose: "Diagnose query performance and execution strategy." },
  {
    id: "interview",
    label: "Interview Coach",
    purpose: "Practice senior data engineering interviews with structured feedback.",
  },
  {
    id: "ask",
    label: "Ask Mansi",
    purpose: "Career narrative, project decisions, and production lessons from my work.",
  },
  {
    id: "cloud",
    label: "Cloud Cost Advisor",
    purpose: "Analyze cloud cost drivers and practical optimization paths.",
  },
];

export const BEYOND_STACK =
  "I like understanding how systems behave under real constraints — performance, cost, reliability, and the people who have to operate them.";

/** Compact ingest → analyze flow — technologies from featured projects & documented portfolio stack */
export const PLATFORM_ARCHITECTURE_FLOW = [
  {
    stage: "Ingest",
    tech: ["S3", "DMS", "Lambda"],
  },
  {
    stage: "Transform",
    tech: ["Glue", "PySpark", "Databricks"],
  },
  {
    stage: "Serve",
    tech: ["Redshift", "DynamoDB"],
  },
  {
    stage: "Analyze",
    tech: ["Athena", "Power BI", "Redshift Spectrum"],
  },
];
