/**
 * Canonical project detail for portfolio pages.
 * Sourced from app/projects/[slug]/page.js META and app/tools/ai-lab/knowledge/projects.js
 * where aligned. Do not add claims that are not backed by these records.
 */

export const FEATURED_PROJECT_SLUG = "project-amc-datalake-solution";

export const SUPPORTING_PROJECT_SLUGS = ["gpu-bench", "olap-workload-architecture"];

export const PROJECT_META = {
  "project-amc-datalake-solution": {
    slug: "project-amc-datalake-solution",
    caseStudy: "amc",
    title: "Legacy Data Modernization & ETL",
    cardTitle: "Legacy Data Modernization & ETL",
    category: "Data Engineering · Cloud · Analytics",
    purpose: "Legacy Data Modernization & Automated ETL Infrastructure for a Leading AMC.",
    desc: "Cloud-native data lake, Glue ETL, and Redshift analytics for a Leading AMC",
    role: "Lead Data Engineer",
    client: "Leading AMC",
    tech: ["AWS S3", "AWS Glue", "Redshift", "Redshift Spectrum", "Lambda", "DMS", "Power BI", "PySpark", "Terraform"],
    summary:
      "Centralized legacy sources on AWS with layered Bronze/Silver/Gold processing, modern Glue ETL, and improved BI and self-service workflows.",
    problem:
      "Legacy shell-script ETL, fragmented siloed data, constrained dashboard performance, and limited self-service discovery for internal users.",
    architectureLayers: [
      "Bronze — ingest & raw storage",
      "Silver — clean & standardize",
      "Gold — transform & marts",
      "Redshift / Spectrum · Power BI",
    ],
    architectureNotes: [
      "S3 as the unified lake; Glue and orchestration for processing; Redshift for analytical serving.",
      "Navigator Tool and Power BI for self-service reporting and operational workflows.",
    ],
    decisions: [
      {
        decision: "Move away from legacy shell ETL",
        why: "Legacy scripts created reliability and maintenance challenges.",
        tradeoff: "Migration effort up front; more operable pipelines long term.",
      },
      {
        decision: "Separate storage from analytical serving",
        why: "Durable lake storage and a centralized warehouse serve different consumption needs.",
        tradeoff: "More platform layers to govern; clearer boundaries for teams.",
      },
      {
        decision: "Bronze → Silver → Gold layering",
        why: "Raw, cleaned, and curated zones improve organization and downstream reuse.",
        tradeoff: "Additional modeling and orchestration; better structure at scale.",
      },
      {
        decision: "Self-service Navigator + Power BI",
        why: "Internal users needed simpler data access and report workflows.",
        tradeoff: "More product-style delivery alongside core ETL work.",
      },
    ],
    tradeoffs: {
      optimizedFor: ["Scalable centralized data", "Modern ETL operability", "Layered analytics consumption"],
      sacrificed: ["Minimal moving parts", "Fastest possible lift-and-shift"],
      risks: ["Cross-team coordination across ETL and Navigator workstreams", "Quality gates across many sources"],
      constraints: ["Legacy shell ETL", "Multiple source systems", "Existing reporting dependencies"],
    },
    responsibilities: [
      "Contributed to ETL modernization and data lake architecture",
      "Worked across data modeling and Glue / PySpark workflow design",
      "Supported analytical storage and reporting integration patterns",
      "Supported pipeline quality, deployment, and self-service data workflows",
    ],
    outcomes: [
      "Achieved centralized and scalable data management through an S3 data lake.",
      "Migrated legacy shell-script ETL processes to AWS Glue jobs.",
      "Improved dashboard performance through an optimized database backend.",
      "Launched an internal Navigator Tool for self-service data updates.",
    ],
    documentedMetrics: null,
    whatIWouldChangeToday: [
      "Formalize consumer contracts earlier between lake, warehouse, and BI layers.",
      "Expand automated lineage and replay documentation across Glue workflows.",
    ],
    relatedSlugs: ["olap-workload-architecture", "gpu-bench"],
  },

  "olap-workload-architecture": {
    slug: "olap-workload-architecture",
    caseStudy: "olap",
    title: "From OLAP to Workload-Specific Data Architecture",
    cardTitle: "OLAP → Workload-Specific Architecture",
    category: "Data Architecture · Cloud · Performance Engineering",
    purpose:
      "Production migration: separate application serving and analytical workloads after Redshift cost signal from high-frequency XIRR serving.",
    desc: "Benchmark Redshift, S3 Tables, Aurora, and DynamoDB for mixed OLTP/OLAP patterns",
    role: "Lead Data Engineer",
    client: "Leading mutual fund provider (anonymous)",
    tech: [
      "AWS",
      "Redshift Serverless",
      "S3 Tables",
      "Aurora PostgreSQL",
      "DynamoDB",
      "Athena / Presto",
    ],
    summary:
      "Production migration shaped by ~60K/day point-lookups on Redshift Serverless — benchmarked engines and separated serving from analytics rather than picking one universal database.",
    problem:
      "An analytical warehouse was also serving high-frequency application lookups; continuous queries prevented effective scale-down and raised cost.",
    architectureLayers: null,
    architectureNotes: null,
    decisions: [],
    tradeoffs: null,
    responsibilities: [
      "Contributed to architecture investigation and benchmark design",
      "Compared operational vs analytical workload fit across candidate stores",
    ],
    outcomes: [
      "Reframed the problem from replacing Redshift to separating workloads",
      "Identified hybrid direction: dedicated serving layer plus S3-based analytics",
    ],
    documentedMetrics: null,
    whatIWouldChangeToday: [],
    relatedSlugs: ["project-amc-datalake-solution", "gpu-bench"],
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
    relatedSlugs: ["project-amc-datalake-solution", "olap-workload-architecture"],
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
