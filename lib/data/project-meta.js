/**
 * Canonical project detail for portfolio pages.
 * Sourced from app/projects/[slug]/page.js META and app/tools/ai-lab/knowledge/projects.js
 * where aligned. Do not add claims that are not backed by these records.
 */

export const FEATURED_PROJECT_SLUG = "project-amc-datalake-solution";

export const SUPPORTING_PROJECT_SLUGS = ["gpu-bench", "small-data-lake"];

export const PROJECT_META = {
  "project-amc-datalake-solution": {
    slug: "project-amc-datalake-solution",
    title: "AMC - Datalake Solution",
    category: "Data Engineering",
    purpose: "Reusable, cost-efficient cloud-native analytics for asset management companies",
    desc: "Reusable, cost-efficient cloud-native solution for Asset Management Companies",
    timeline: "6 months",
    role: "Lead Data Engineer",
    tech: ["AWS", "S3", "PySpark", "Iceberg", "Terraform", "Redshift"],
    summary:
      "Unified on-prem sources into a governed cloud analytics foundation with incremental processing, open-table storage, and a path to reliable BI.",
    problem:
      "Fragmented on-prem reporting and repeated full reloads made it hard to trust metrics, control cost, and onboard new data domains without operational drag.",
    architectureLayers: [
      "On-prem & legacy sources",
      "Ingestion & cloud migration",
      "PySpark ETL (incremental, validated)",
      "S3 + Apache Iceberg",
      "Redshift / BI & metrics",
    ],
    architectureNotes: [
      "Durable landing storage and incremental processing kept downstream consumers stable while the platform evolved.",
      "Transformation stayed close to the data; curated outputs carried business-facing metrics.",
    ],
    decisions: [
      {
        decision: "Incremental processing",
        why: "Data volume and operating cost made repeated full reloads a poor long-term default.",
        tradeoff: "More engineering discipline up front; easier to trust and extend later.",
      },
      {
        decision: "Open table storage (Iceberg on S3)",
        why: "Downstream teams needed reuse and schema evolution without locking into one consumption path.",
        tradeoff: "Stronger governance needed around file layout, compaction, and ownership.",
      },
      {
        decision: "Terraform & CI/CD early",
        why: "Manual environment drift becomes expensive quickly on a shared platform.",
        tradeoff: "Higher initial design effort; less hand-built ops work over time.",
      },
    ],
    tradeoffs: {
      optimizedFor: ["Incremental reliability", "Reusable platform blueprint", "Cost-aware storage & processing"],
      sacrificed: ["Fastest possible first delivery", "Single-tool simplicity"],
      risks: ["Operational complexity if validation and replay are underspecified", "Consumer coupling without clear contracts"],
      constraints: ["On-prem to cloud migration", "Multiple legacy sources", "Need for trustworthy BI surfaces"],
    },
    responsibilities: [
      "Led end-to-end architecture design for a cloud-native solution",
      "Built incremental ingestion pipelines with reliability, validation, and idempotency guarantees",
      "Designed SCD-aware dimensions and transaction fact tables",
      "Developed CI/CD infrastructure using Terraform and CodeCommit",
      "Implemented partitioning, compaction, and file optimization strategies",
      "Collaborated with business and analytics teams to define KPIs and reporting surfaces",
    ],
    outcomes: [
      "Unified customer, transaction, and portfolio data into a single source of truth",
      "Enabled sub-10s BI queries on large transactional datasets (project record)",
      "Reduced operational complexity and improved data reliability",
      "Created a reusable blueprint that can onboard new AMCs with minimal changes",
    ],
    documentedMetrics: {
      notes: [
        "~35–40% reduction in monthly compute cost compared to legacy warehouse-based setup",
        "Typical BI queries improved from minutes to seconds; dashboard refresh from hours to minutes",
        "Partition pruning and compaction reduced read amplification",
      ],
    },
    whatIWouldChangeToday: [
      "Add explicit data-quality SLAs and richer lineage automation.",
      "Formalize consumer contracts earlier so downstream dependencies are visible sooner.",
    ],
    relatedSlugs: ["gpu-bench", "small-data-lake"],
  },

  "gpu-bench": {
    slug: "gpu-bench",
    title: "GPU Benchmark Pod",
    category: "GPU / HPC",
    purpose: "Evidence-based GPU performance and sizing decisions",
    desc: "CUDA kernels, shared memory optimization, and GPU performance tuning",
    timeline: "3 months",
    role: "Research Engineer",
    tech: ["CUDA", "Profiling"],
    summary: "Controlled CUDA microbenchmarks to separate real speedups from expensive overprovisioning.",
    problem:
      "Teams needed a rational compute decision—not peak benchmark numbers disconnected from workload shape and cost.",
    architectureLayers: [
      "Isolated benchmark harness",
      "CUDA kernels & shared-memory tuning",
      "Profiling (occupancy, memory throughput)",
      "Sizing & platform recommendation",
    ],
    architectureNotes: [
      "Repeatability mattered more than one-off wall-clock wins.",
      "Memory movement and kernel behavior were measured, not assumed.",
    ],
    decisions: [
      {
        decision: "Controlled harness vs ad hoc tests",
        why: "Results had to be defensible in capacity and budget conversations.",
        tradeoff: "Slower to stand up; comparable runs over time.",
      },
      {
        decision: "Profile memory & kernels",
        why: "Bottlenecks are often not where teams first assume.",
        tradeoff: "More analysis work; fewer wrong hardware bets.",
      },
    ],
    tradeoffs: {
      optimizedFor: ["Repeatable measurement", "Decision-quality evidence"],
      sacrificed: ["Breadth of production-like scenarios in a short window"],
      risks: ["Narrow benchmarks misrepresenting real workload shape"],
      constraints: ["Limited time box", "Need to tie results to business questions"],
    },
    responsibilities: [
      "Write CUDA microbenchmarks",
      "Optimize kernels using shared memory and tiling strategies",
      "Capture low-level metrics (occupancy, memory throughput, PTX behavior)",
    ],
    outcomes: [
      "Achieved ~2x performance improvement for selected kernels (project record)",
      "Built reusable benchmarking harness for future GPU experiments",
    ],
    documentedMetrics: null,
    whatIWouldChangeToday: [
      "Add automated profiling capture so comparisons are easier to reproduce.",
      "Tie benchmark results more directly to cost-per-run analysis.",
    ],
    relatedSlugs: ["project-amc-datalake-solution", "small-data-lake"],
  },

  "small-data-lake": {
    slug: "small-data-lake",
    title: "Small Data Lake (PoC)",
    category: "Data Engineering",
    purpose: "Validate lakehouse patterns before enterprise scale-up",
    desc: "Lightweight data lake using Iceberg and Spark",
    timeline: "PoC",
    role: "Data Engineer",
    tech: ["Iceberg", "Spark", "AWS"],
    summary: "Small, deliberate PoC to prove ingestion, transformation, and serving before broadening scope.",
    problem:
      "The team needed confidence that the pattern could deliver reliability and reuse without undue cost or complexity.",
    architectureLayers: [
      "Source samples",
      "Ingestion",
      "Spark transformation",
      "Iceberg tables",
      "Serving / validation",
    ],
    architectureNotes: [
      "Scope stayed narrow so the critical path was easy to reason about.",
      "The prototype was treated as a decision artifact, not throwaway code.",
    ],
    decisions: [
      {
        decision: "Narrow PoC scope",
        why: "Early validation only helps when important variables can be isolated.",
        tradeoff: "Fast signal; some operational issues only appear at scale.",
      },
      {
        decision: "Open table patterns",
        why: "Lessons needed to transfer to the larger AMC platform design.",
        tradeoff: "Less production completeness by design.",
      },
    ],
    tradeoffs: {
      optimizedFor: ["Fast learning", "Transferable patterns"],
      sacrificed: ["Production-grade ops and full domain coverage"],
      risks: ["Hidden scale issues not exercised in the PoC"],
      constraints: ["Time-boxed validation goal"],
    },
    responsibilities: [
      "Shaped the architecture and tested the core data flow",
      "Used the PoC to de-risk the larger implementation",
    ],
    outcomes: [
      "Gave confidence the architecture could extend into the production platform",
      "Helped narrow scope for the later enterprise implementation",
    ],
    documentedMetrics: null,
    whatIWouldChangeToday: [
      "Formalize success criteria earlier.",
      "Capture operational assumptions alongside prototype results.",
    ],
    relatedSlugs: ["project-amc-datalake-solution", "gpu-bench"],
  },

  "pc-accessories": {
    slug: "pc-accessories",
    title: "Custom PC Accessories",
    category: "Business",
    purpose: "Custom PC aesthetic products",
    desc: "Side business building aesthetic GPU and PC customization components",
    timeline: "Ongoing",
    role: "Founder",
    tech: ["Design", "Laser-cut"],
    summary: "Founded a niche side business for custom GPU backplates and acrylic mods.",
    problem: "Validate demand for custom PC aesthetic components through a small product line.",
    architectureLayers: null,
    decisions: [],
    tradeoffs: null,
    responsibilities: [
      "Product design and prototyping",
      "Vendor coordination and laser cutting",
      "Client fulfillment and iteration based on feedback",
    ],
    outcomes: ["Launched MVP with paying customers", "Validated demand for custom PC aesthetic components"],
    documentedMetrics: null,
    whatIWouldChangeToday: [],
    relatedSlugs: [],
  },
};

export function getProjectMeta(slug) {
  return PROJECT_META[slug] || null;
}

export function resolveProjectSlug(rawSlug) {
  if (rawSlug === "amc") return "project-amc-datalake-solution";
  return rawSlug;
}

export function getRelatedProjects(slug) {
  const meta = getProjectMeta(slug);
  if (!meta?.relatedSlugs?.length) return [];
  return meta.relatedSlugs.map((s) => PROJECT_META[s]).filter(Boolean);
}
