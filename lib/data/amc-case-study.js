/** Legacy data modernization — confidential asset-management client. */

export const AMC_CASE_STUDY_SLUG = "project-amc-datalake-solution";

/** Drop your diagram at public/projects/amc/architecture.png (or .webp / .jpg). */
export const AMC_ARCHITECTURE_IMAGE = "/projects/amc/architecture.png";

export const AMC_CASE_STUDY = {
  slug: AMC_CASE_STUDY_SLUG,
  eyebrow: "Data Engineering · AWS · Data Platform",
  title: "Legacy Data Modernization & Automated ETL Infrastructure",
  subtitle: "Modernizing legacy ETL and analytics infrastructure for a confidential asset-management client.",
  client: "Confidential asset-management client",
  focus: "Data Platform · ETL · Analytics",
  cloud: "AWS",
  stackLine: "S3 · Glue · Redshift · Power BI",

  heroTransform: {
    legacy: {
      label: "Legacy",
      items: ["Shell scripts", "Siloed data", "Fragile workflows", "Slow analytics"],
    },
    modern: {
      label: "Modernized platform",
      items: ["AWS data lake", "Automated ETL", "Layered architecture", "Centralized analytics"],
    },
  },

  snapshot: [
    { label: "Challenge", value: "Legacy ETL + fragmented data" },
    { label: "Approach", value: "Cloud-native lake + modern ETL" },
    { label: "Analytics", value: "Centralized warehouse + BI" },
    { label: "Outcome", value: "More scalable data operations" },
  ],

  transformation: {
    heading: "From fragmented legacy workflows to a modern data platform",
    before: [
      "Legacy shell-script ETL",
      "Fragmented transactional data",
      "Manual / fragile workflows",
      "Slow reporting backend",
      "Limited self-service",
    ],
    after: [
      "S3-based centralized data lake",
      "AWS Glue / PySpark ETL",
      "Layered Bronze → Silver → Gold architecture",
      "Redshift analytical serving",
      "Improved Power BI consumption",
      "Internal self-service data workflows",
    ],
  },

  problems: [
    {
      title: "Fragile ETL",
      body: "Legacy shell-script workflows were prone to failures and difficult to maintain.",
    },
    {
      title: "Slow analytics",
      body: "Existing backend constraints affected dashboard and data retrieval performance.",
    },
    {
      title: "Fragmented data",
      body: "Transactional data existed across siloed systems and sources.",
    },
    {
      title: "Limited self-service",
      body: "Internal users had limited ability to efficiently discover and update data.",
    },
  ],

  architecture: {
    heading: "From legacy ETL to a layered data platform",
    pipeline: [
      "Sources",
      "S3 / Bronze",
      "Glue + PySpark / Silver",
      "Curated data / Gold",
      "Redshift / serving",
      "Power BI / self-service tooling",
    ],
    diagramCaption:
      "A layered architecture separated ingestion, transformation, analytical storage, and consumption.",
    legend: [
      { tier: "Bronze", note: "Ingest + raw storage" },
      { tier: "Silver", note: "Clean + standardize" },
      { tier: "Gold", note: "Transform + aggregate" },
      { tier: "Serving", note: "Analytics + reporting" },
    ],
    flow: [
      {
        n: "01",
        title: "Ingest",
        body: "Data from partner databases and files enters the platform.",
      },
      {
        n: "02",
        title: "Process",
        body: "AWS Glue / PySpark workflows clean and transform the data.",
      },
      {
        n: "03",
        title: "Curate",
        body: "Data is organized into analytical models and data marts.",
      },
      {
        n: "04",
        title: "Serve",
        body: "Redshift and BI tools provide consumption and reporting.",
      },
    ],
    imageAlt:
      "Layered AWS data platform: ingestion, Bronze/Silver/Gold processing, Redshift, and Power BI.",
  },

  decisions: [
    {
      n: "01",
      title: "Why move away from legacy shell ETL?",
      problem: "Reliability and maintenance.",
      decision: "AWS Glue + PySpark.",
      reasoning:
        "Move from fragile script-driven processing toward managed, repeatable ETL workflows.",
    },
    {
      n: "02",
      title: "Why separate S3 and Redshift?",
      problem: "Storage and analytics had competing concerns.",
      decision: "S3 for durable data lake storage + Redshift for analytical serving.",
      reasoning: "Separate scalable storage from query-optimized consumption.",
    },
    {
      n: "03",
      title: "Why Bronze → Silver → Gold?",
      problem: "Data processing lacked clear separation.",
      decision: "Layered data architecture.",
      reasoning: "Establish clearer boundaries between raw, standardized, and curated data.",
    },
    {
      n: "04",
      title: "Why improve self-service?",
      problem: "Users depended heavily on existing workflows for data access.",
      decision: "Refactor self-service tooling and improve Power BI consumption.",
      reasoning: "Reduce friction between the data platform and business users.",
    },
  ],

  techGroups: [
    { group: "Storage", items: ["S3", "Redshift", "Redshift Spectrum"] },
    { group: "Processing", items: ["AWS Glue", "PySpark", "Lambda"] },
    { group: "Ingestion / orchestration", items: ["DMS", "EventBridge", "Step Functions"] },
    { group: "Analytics", items: ["Power BI", "QuickSight"] },
    { group: "Security / operations", items: ["IAM", "KMS", "Secrets Manager", "CloudWatch"] },
  ],

  stackRationale: [
    { name: "S3", why: "Durable, scalable object storage for the centralized data lake." },
    { name: "AWS Glue", why: "Managed ETL platform suited to replacing legacy script-driven workflows." },
    { name: "PySpark", why: "Distributed transformation capability for larger ETL workloads." },
    { name: "Redshift", why: "Analytical serving layer for structured reporting and downstream consumption." },
    { name: "Power BI", why: "Business-facing analytics and reporting layer." },
  ],

  operations: [
    {
      title: "Quality",
      body: "Two-level QC process covering team self-QC and delivery-lead validation.",
    },
    {
      title: "Orchestration",
      body: "Automated workflows replaced fragile manual and script-driven processing.",
    },
    {
      title: "Observability",
      body: "CloudWatch and operational controls supported production workflows.",
    },
    {
      title: "Deployment",
      body: "Quality checks and deployment processes were part of the delivery lifecycle.",
    },
  ],

  outcomes: [
    {
      title: "Centralized data",
      body: "S3 established a scalable foundation for centralized data management.",
    },
    {
      title: "Modernized ETL",
      body: "Legacy shell-script workflows were migrated toward AWS Glue.",
    },
    {
      title: "Better analytics",
      body: "The analytical backend was optimized to support improved dashboard performance.",
    },
    {
      title: "Self-service",
      body: "Self-service tooling improved internal data access and update workflows.",
    },
  ],

  contributionsIntro:
    "Engineering focus included platform modernization alongside delivery teams. Wording reflects contribution areas, not sole ownership of every workstream.",
  contributions: [
    "ETL modernization",
    "Data lake architecture",
    "Data modeling",
    "AWS Glue / PySpark workflows",
    "Analytical storage design",
    "Reporting and data consumption integration",
    "Pipeline quality and deployment",
    "Self-service data workflows",
  ],

  takeaway:
    "The biggest shift wasn't simply moving ETL to AWS. It was creating clearer boundaries between ingestion, transformation, analytical storage, and consumption — making the platform easier to operate, evolve, and consume.",

  technicalNotes: {
    sources: ["Partner / registrar feeds", "Oracle", "SQL Server", "MySQL", "Files / flat files"],
  },
};
