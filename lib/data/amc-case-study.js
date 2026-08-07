/** Indian AMC legacy modernization — portfolio case study (client anonymized; no invented metrics). */

export const AMC_CASE_STUDY_SLUG = "project-amc-datalake-solution";

/** Drop your diagram at public/projects/amc/architecture.png (or .webp / .jpg). */
export const AMC_ARCHITECTURE_IMAGE = "/projects/amc/architecture.png";

export const AMC_CASE_STUDY = {
  slug: AMC_CASE_STUDY_SLUG,
  eyebrow: "Data Engineering · AWS · Data Platform",
  title: "Legacy Data Modernization & Automated ETL Infrastructure",
  subtitle: "Modernizing legacy ETL and analytics infrastructure for a Leading AMC.",
  client: "Leading AMC",
  focus: "Data Platform · ETL · Analytics",
  cloud: "AWS",
  stackLine: "S3 · Glue · Redshift · Power BI",
  role: "Lead Data Engineer",
  engagement: "SG Analytics · asset management client (India)",

  snapshot: [
    { label: "Challenge", value: "Legacy ETL + fragmented data" },
    { label: "Approach", value: "Cloud-native lake + modern ETL" },
    { label: "Analytics", value: "Centralized warehouse + BI" },
    { label: "Outcome", value: "More scalable data operations" },
  ],

  problems: [
    {
      n: "01",
      title: "Fragile ETL",
      body: "Legacy shell-script workflows were prone to failures.",
    },
    {
      n: "02",
      title: "Slow analytics",
      body: "Dashboard and data retrieval performance was constrained by the existing backend.",
    },
    {
      n: "03",
      title: "Fragmented data",
      body: "Transactional data was distributed across siloed systems.",
    },
    {
      n: "04",
      title: "Limited self-service",
      body: "Internal users had limited ability to discover and update data efficiently.",
    },
  ],

  architecture: {
    heading: "From legacy ETL to a layered data platform",
    intro:
      "The modernization separated ingestion, transformation, analytical storage, and reporting into clearer platform layers.",
    legend: [
      { tier: "Bronze", note: "Ingest + raw storage" },
      { tier: "Silver", note: "Clean + standardize" },
      { tier: "Gold", note: "Transform + aggregate" },
      { tier: "Serving", note: "Analytics + reporting" },
    ],
    flow: [
      { n: "01", title: "Ingest", body: "Source systems land data into the platform." },
      { n: "02", title: "Process", body: "Glue-based workflows clean and transform data." },
      { n: "03", title: "Curate", body: "Data is organized into analytical models and marts." },
      { n: "04", title: "Serve", body: "Redshift and BI tools provide consumption layers." },
    ],
    imageAlt:
      "Bronze, Silver, and Gold AWS data platform architecture for a Leading AMC, showing ingestion, Glue processing, Redshift, and Power BI consumption.",
  },

  legacyToModern: {
    heading: "From legacy to modern",
    intro:
      "The modernization moved the platform from fragmented, script-driven workflows toward a more structured cloud data platform.",
    pairs: [
      { legacy: "Shell-script ETL", modern: "AWS Glue / PySpark" },
      { legacy: "Siloed data sources", modern: "Centralized S3 data lake" },
      { legacy: "Fragmented processing", modern: "Bronze → Silver → Gold" },
      { legacy: "Reporting bottlenecks", modern: "Redshift + optimized data models" },
      { legacy: "Limited self-service", modern: "Navigator + Power BI" },
    ],
  },

  decisions: [
    {
      n: "01",
      decision: "Move away from legacy shell ETL",
      why: "Legacy scripts created reliability and maintenance challenges.",
      direction: "Modernize processing through AWS Glue and PySpark-based jobs.",
    },
    {
      n: "02",
      decision: "Separate storage from analytical serving",
      why: "A centralized durable storage layer provides a stronger foundation for downstream analytics.",
      direction: "Use S3 as the data lake and Redshift as the analytical backend.",
    },
    {
      n: "03",
      decision: "Introduce layered data processing",
      why: "Separating raw, cleaned, and curated data improves organization and downstream consumption.",
      direction: "Bronze → Silver → Gold processing pattern.",
    },
    {
      n: "04",
      decision: "Improve self-service consumption",
      why: "Users needed simpler access to data and reporting workflows.",
      direction: "Refactor the Navigator experience and improve Power BI reporting workflows.",
    },
  ],

  techPrimary: ["S3", "AWS Glue", "Redshift", "PySpark", "Power BI"],
  techSupporting: [
    "DMS",
    "Lambda",
    "EventBridge",
    "Step Functions",
    "Redshift Spectrum",
    "IAM",
    "KMS",
    "Secrets Manager",
    "CloudWatch",
    "QuickSight",
  ],

  operations: [
    {
      title: "Quality",
      body: "Two-level QC process for accuracy and completeness (team self-QC and delivery-lead review).",
    },
    {
      title: "Orchestration",
      body: "Automated workflows replaced fragile manual and script-driven processing.",
    },
    {
      title: "Observability",
      body: "CloudWatch and operational controls supported production workflows.",
    },
  ],

  outcomes: [
    {
      title: "Centralized data",
      body: "S3 became a scalable foundation for centralized data management.",
    },
    {
      title: "Modernized ETL",
      body: "Legacy shell-script workflows were migrated toward AWS Glue.",
    },
    {
      title: "Improved analytics",
      body: "The analytical backend was optimized to support better dashboard performance.",
    },
    {
      title: "Self-service",
      body: "The Navigator Tool improved internal data access and update workflows.",
    },
  ],

  contributionsIntro:
    "Contributed to platform modernization alongside delivery teams. Worked across the areas below; wording reflects engineering focus, not sole ownership of every workstream.",
  contributions: [
    "ETL modernization",
    "Data lake architecture",
    "Data modeling",
    "AWS Glue / PySpark workflows",
    "Analytical storage design",
    "Reporting and data-consumption integration",
    "Pipeline quality and deployment",
    "Self-service data workflows",
  ],

  takeaway:
    "Modernization wasn't simply a move from legacy scripts to AWS. The bigger shift was creating a clearer separation between ingestion, processing, analytical storage, and consumption.",

  technicalNotes: {
    sources: ["CAMS", "Oracle", "SQL Server", "MySQL", "Files / flat files"],
    objectives: [
      "Cost-efficient, scalable cloud-based AWS ETL and data lake infrastructure",
      "Integration with partner databases",
      "Foundational data marts for visualization, AI, and advanced analytics",
      "Navigator Tool refactor and report decoupling",
      "Power BI / Tableau dashboard enhancement and self-service tooling",
    ],
  },

  nextProject: { slug: "gpu-bench", title: "GPU Benchmark Pod" },
};
