/**
 * Canonical project detail for portfolio pages.
 * Sourced from app/projects/[slug]/page.js META and app/tools/ai-lab/knowledge/projects.js
 * where aligned. Do not add claims that are not backed by these records.
 */

export const FEATURED_PROJECT_SLUG = "project-amc-datalake-solution";

export const SUPPORTING_PROJECT_SLUGS = [
  "brain-mvp",
  "automated-intelligence-pipeline",
  "gpu-bench",
  "olap-workload-architecture",
];

export const PROJECT_META = {
  "project-amc-datalake-solution": {
    slug: "project-amc-datalake-solution",
    caseStudy: "amc",
    title: "Legacy Data Modernization & ETL",
    cardTitle: "Legacy Data Modernization & ETL",
    category: "Data Engineering · Cloud · Analytics",
    purpose: "Legacy Data Modernization & Automated ETL Infrastructure for a confidential asset-management client.",
    desc: "Cloud-native data lake, Glue ETL, and Redshift analytics for a confidential asset-management client",
    role: "Lead Data Engineer",
    client: "Confidential asset-management client",
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
      "Internal self-service tooling and Power BI for reporting and operational workflows.",
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
        decision: "Self-service internal tooling + Power BI",
        why: "Internal users needed simpler data access and report workflows.",
        tradeoff: "More product-style delivery alongside core ETL work.",
      },
    ],
    tradeoffs: {
      optimizedFor: ["Scalable centralized data", "Modern ETL operability", "Layered analytics consumption"],
      sacrificed: ["Minimal moving parts", "Fastest possible lift-and-shift"],
      risks: ["Cross-team coordination across ETL and self-service tooling workstreams", "Quality gates across many sources"],
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
      "Delivered internal self-service data workflows for operational updates.",
    ],
    documentedMetrics: null,
    whatIWouldChangeToday: [
      "Formalize consumer contracts earlier between lake, warehouse, and BI layers.",
      "Expand automated lineage and replay documentation across Glue workflows.",
    ],
    relatedSlugs: ["brain-mvp", "automated-intelligence-pipeline", "olap-workload-architecture", "gpu-bench"],
  },

  "automated-intelligence-pipeline": {
    slug: "automated-intelligence-pipeline",
    caseStudy: "intelligence",
    title: "Automated Web Intelligence Pipeline",
    cardTitle: "Web Intelligence Pipeline",
    category: "Data Engineering · Automation · AWS",
    purpose:
      "Build an automated pipeline to discover, extract, process, and surface business-relevant content from distributed web sources.",
    desc: "Crawlers, extraction, deduplication, DS model integration, and reporting on AWS — confidential client",
    role: "Lead Data Engineer",
    client: "Confidential client engagement",
    tech: ["Python", "Scrapy", "Selenium", "AWS Lambda", "Amazon S3", "EC2", "Terraform", "Bitbucket Pipelines"],
    summary:
      "Engineered a production pipeline from source discovery through deduplication and storage, integrating a Data Science classification model and automated reporting.",
    problem:
      "Relevant public web content was spread across inconsistent page structures and feeds; manual monitoring, extraction, and deduplication did not scale.",
    architectureLayers: null,
    architectureNotes: null,
    decisions: [],
    tradeoffs: null,
    responsibilities: [
      "Built crawlers and article extraction for RSS, generic, and site-specific sources",
      "Processed and normalized data; removed duplicate articles before persistence",
      "Integrated the Data Science team's classification model into the production pipeline",
      "Automated execution, deployed AWS infrastructure, and monitored pipeline operations",
      "Generated downstream reports from classified, relevant content",
    ],
    outcomes: [
      "Delivered an automated intelligence workflow from web discovery through reporting",
      "Connected engineering pipeline stages with DS-owned model inference",
    ],
    documentedMetrics: null,
    whatIWouldChangeToday: [],
    relatedSlugs: ["project-amc-datalake-solution", "brain-mvp", "olap-workload-architecture"],
  },

  "brain-mvp": {
    slug: "brain-mvp",
    caseStudy: "brain",
    title: "Productionizing an ML-Driven Allocation Engine",
    cardTitle: "ML-Driven Allocation Engine",
    category: "Machine Learning · Data Engineering · AWS",
    purpose:
      "Productionize an ML-driven allocation system that translates user eligibility and behavioral signals into personalized product recommendations.",
    desc: "End-to-end ML allocation — classification, deployment pipeline, and production serving on AWS",
    role: "Lead Data Engineer",
    client: "Confidential fintech engagement",
    tech: ["Amazon S3", "Databricks", "Delta", "MLflow", "Amazon ECR", "EC2", "GraphQL"],
    summary:
      "Built and productionized an allocation engine: persona classification models, deployment pipeline, and decisioning from signals to user-facing recommendations.",
    problem:
      "Users signed up for paid tiers but did not consistently adopt the broader product stack; the team needed a decisioning layer—not another funnel—to drive relevant allocations.",
    architectureLayers: null,
    architectureNotes: null,
    decisions: [],
    tradeoffs: null,
    responsibilities: [
      "Contributed to ML allocation architecture and production deployment pipeline",
      "Worked across model tracking, containerization, and serving integration",
      "Supported production allocation flow and separation of prediction vs. decision logic",
    ],
    outcomes: [
      "Delivered end-to-end path from model development through serving",
      "Separated classification, allocation logic, processing, and API layers",
    ],
    documentedMetrics: null,
    whatIWouldChangeToday: [],
    relatedSlugs: ["project-amc-datalake-solution", "automated-intelligence-pipeline", "olap-workload-architecture"],
  },

  "olap-workload-architecture": {
    slug: "olap-workload-architecture",
    caseStudy: "olap",
    title: "From OLAP to Workload-Specific Data Architecture",
    cardTitle: "OLAP → Workload-Specific Architecture",
    category: "Data Architecture · Cloud · Performance Engineering",
    purpose:
      "Production migration: separate application serving and analytical workloads after a Redshift cost signal from high-frequency point lookups.",
    desc: "Benchmark Redshift, S3 Tables, Aurora, and DynamoDB for mixed OLTP/OLAP patterns",
    role: "Lead Data Engineer",
    client: "Confidential financial services client",
    tech: [
      "AWS",
      "Redshift Serverless",
      "S3 Tables",
      "Aurora PostgreSQL",
      "DynamoDB",
      "Athena / Presto",
    ],
    summary:
      "Production migration shaped by high-frequency point-lookups on Redshift Serverless — benchmarked engines and separated serving from analytics rather than picking one universal database.",
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
      "Achieved material performance improvement on selected kernels (project record)",
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
    relatedSlugs: ["cuda-tiling"],
  },

  "cuda-tiling": {
    slug: "cuda-tiling",
    title: "CUDA Tiling Experiments",
    category: "GPU / HPC",
    purpose: "Shared-memory tiling microbenchmarks",
    desc: "Shared memory tiling microbenchmarks",
    role: "Research Engineer",
    tech: ["CUDA"],
    summary: "CUDA kernel experiments focused on shared-memory tiling and measurable performance gains.",
    problem: "Isolate whether tiling and shared-memory layout improved kernel throughput for representative workloads.",
    architectureLayers: null,
    decisions: [],
    tradeoffs: null,
    responsibilities: ["Designed microbenchmarks", "Compared tiling strategies", "Interpreted profiling results"],
    outcomes: ["Informed GPU optimization patterns used in broader benchmark work"],
    documentedMetrics: null,
    whatIWouldChangeToday: [],
    relatedSlugs: ["gpu-bench", "pc-accessories"],
  },

  "acrylic-store": {
    slug: "acrylic-store",
    title: "Acrylic Mods — Shop",
    category: "Business",
    purpose: "MVP storefront for custom acrylic GPU mods",
    desc: "MVP for custom acrylic GPU backplates",
    role: "Founder",
    tech: ["Design"],
    summary: "Early MVP to validate demand and fulfillment for custom acrylic PC mods.",
    problem: "Test whether a lightweight shop could support custom orders without heavy upfront inventory.",
    architectureLayers: null,
    decisions: [],
    tradeoffs: null,
    responsibilities: ["Product design", "Vendor coordination", "Customer fulfillment"],
    outcomes: ["Validated demand for custom acrylic components"],
    documentedMetrics: null,
    whatIWouldChangeToday: [],
    relatedSlugs: ["pc-accessories", "saffron-research"],
  },

  "saffron-research": {
    slug: "saffron-research",
    title: "Saffron Harvesting Research",
    category: "Research",
    purpose: "Feasibility research and pilot plots",
    desc: "Feasibility research and pilot plots",
    role: "Research lead",
    tech: ["Agro"],
    summary: "Field research and pilot plots to assess saffron harvesting feasibility and operating constraints.",
    problem: "Understand whether local conditions and process choices could support a viable harvest workflow.",
    architectureLayers: null,
    decisions: [],
    tradeoffs: null,
    responsibilities: ["Pilot design", "Data collection", "Feasibility analysis"],
    outcomes: ["Documented operational learnings from pilot plots"],
    documentedMetrics: null,
    whatIWouldChangeToday: [],
    relatedSlugs: ["acrylic-store"],
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
