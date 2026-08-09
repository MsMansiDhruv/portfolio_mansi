export const projectKnowledge = [
  {
    id: "project/amc-datalake",
    title: "AMC - Datalake Solution",
    category: "project",
    kind: "project",
    tags: ["amc", "datalake", "lakehouse", "asset management"],
    technologies: ["s3", "iceberg", "pyspark", "terraform", "redshift", "sql"],
    projects: ["gpu-benchmark", "olap-workload-architecture"],
    topics: ["enterprise analytics", "migration", "governed lakehouse"],
    summary: "I built a reusable cloud analytics foundation that replaced fragmented on-prem reporting paths with a more reliable and cost-aware lakehouse pattern.",
    businessContext: "The client needed a single analytics foundation that could unify legacy sources, improve trust in reporting, and reduce the operational burden of the old platform.",
    problemStatement: "The main problem was not just moving data. It was creating a platform that downstream teams could trust, operate, and reuse without paying the cost of repeated full reloads.",
    myRole: "I owned the architecture conversation, the ingestion and validation patterns, and the delivery discipline around infrastructure and CI/CD.",
    architecture: [
      "I used durable landing storage, incremental processing, and separate serving layers so the platform could evolve without breaking consumers.",
      "I kept transformation logic close to the data and pushed business-facing logic toward curated outputs.",
      "I treated validation and repeatability as core platform concerns instead of bolt-ons."
    ],
    decisions: [
      "I chose incremental processing over repeated full reloads because the data volume and operational cost made brute-force refreshes a bad long-term bet.",
      "I chose open table storage so the team could support downstream reuse without locking the platform into one narrow consumption path.",
      "I invested in Terraform and CI/CD early because manual environment management becomes technical debt very quickly."
    ],
    tradeoffs: [
      "Incremental design added engineering discipline, but it gave us a platform that was much easier to trust and scale.",
      "Open table storage improved flexibility, but it required stronger governance around file sizing, layout, and ownership.",
      "Automation increased the upfront design effort, but it removed a lot of future drift and hand-built environment work."
    ],
    outcomes: [
      "The platform unified customer, transaction, and portfolio data into a more consistent source of truth.",
      "The design improved reliability for downstream BI usage.",
      "The operating model was simpler to extend than the original fragmented setup."
    ],
    lessonsLearned: [
      "The best architecture decisions are the ones that reduce future onboarding and support cost.",
      "Data quality checks matter more when the platform is shared across teams.",
      "A clean deployment model is a force multiplier for every later change."
    ],
    scale: "Large enough that repeated full reloads and manual operations were no longer defensible.",
    whatIWouldImproveToday: [
      "I would add explicit quality SLAs and richer lineage automation.",
      "I would formalize consumer contracts earlier so downstream dependencies are visible sooner."
    ],
    relatedTechnologies: ["Databricks", "Delta Lake", "SQL", "Terraform"],
    relatedProjects: ["GPU Benchmark Pod", "OLAP Workload Architecture"],
    followUps: [
      "Walk through the ingestion and validation flow",
      "Explain the trade-offs versus a warehouse-first design",
      "Show how I would make the platform easier to operate"
    ]
  },
  {
    id: "project/gpu-benchmark",
    title: "GPU Benchmark Pod",
    category: "project",
    kind: "project",
    tags: ["gpu", "benchmark", "performance", "cuda"],
    technologies: ["cuda", "python", "linux", "profiling"],
    projects: ["amc-datalake"],
    topics: ["performance tuning", "benchmarking", "compute selection"],
    summary: "I used this work to validate whether a GPU-backed workflow actually justified its cost and operational overhead.",
    businessContext: "When teams add GPU compute, they usually need a business case, not just enthusiasm for faster runs.",
    problemStatement: "The problem was to separate real performance gain from expensive overprovisioning so the team could make a rational compute decision.",
    myRole: "I designed the benchmark approach, interpreted the results, and translated the findings into a platform recommendation.",
    architecture: [
      "I isolated the benchmark workload so hardware effects were easier to measure.",
      "I compared compute behavior against the expected workload pattern instead of chasing peak numbers in a vacuum.",
      "I focused on repeatability so the numbers could be discussed with confidence."
    ],
    decisions: [
      "I favored a controlled benchmark harness over ad hoc testing because repeatability mattered more than one-off speed wins.",
      "I looked at memory movement and kernel behavior, not just wall-clock time, because the bottleneck is often not where people assume it is.",
      "I treated the benchmark as a decision tool for capacity planning, not as a vanity performance demo."
    ],
    tradeoffs: [
      "A more rigorous benchmark takes longer to set up, but it produces decisions people can defend.",
      "Narrow tests are faster to run, but they can mislead if they do not represent the real workload shape."
    ],
    outcomes: [
      "The exercise gave a clearer view of where GPU acceleration was worth the cost.",
      "It created a more evidence-based conversation around performance and budget."
    ],
    lessonsLearned: [
      "Benchmarking without a business question is usually wasted effort.",
      "Hardware selection should be anchored in the actual workload profile."
    ],
    scale: "Useful for workload evaluation and platform sizing discussions.",
    whatIWouldImproveToday: [
      "I would add more automated profiling capture so comparisons are easier to reproduce.",
      "I would tie the benchmark results more directly to cost-per-run analysis."
    ],
    relatedTechnologies: ["CUDA", "Python", "Spark"],
    relatedProjects: ["AMC - Datalake Solution", "OLAP Workload Architecture"],
    followUps: [
      "Show how I would turn this into a production sizing model",
      "Explain when GPU compute is actually worth the spend",
      "Compare this approach with CPU-first tuning"
    ]
  }
];
