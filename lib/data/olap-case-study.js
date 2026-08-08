/** Workload-separation architecture PoC — client anonymized; investigation, not production migration. */

export const OLAP_CASE_STUDY_SLUG = "olap-workload-architecture";

export const OLAP_COST_EVIDENCE_IMAGE = "/projects/olap/redshift-cost-evidence.png";

export const OLAP_CASE_STUDY = {
  slug: OLAP_CASE_STUDY_SLUG,
  eyebrow: "Data Architecture · Performance Engineering",
  title: "From OLAP to workload-specific data architecture",
  subtitle:
    "Benchmarking Redshift, S3 Tables, Aurora PostgreSQL, and DynamoDB to separate analytical workloads from high-frequency application access.",
  shortDescription:
    "A database migration PoC that started with a cost spike and evolved into a workload-separation architecture.",
  pocNote: "Architecture investigation · PoC — not a completed production migration",
  metaTags: ["Architecture PoC", "Cost + performance", "Mixed OLTP / OLAP"],
  tech: [
    "AWS",
    "Redshift Serverless",
    "S3 Tables",
    "Aurora PostgreSQL",
    "DynamoDB",
    "Athena / Presto",
  ],

  trigger: {
    headline: "60K small queries a day were turning an analytical warehouse into an application serving layer.",
    body:
      "A new XIRR metric introduced a high-frequency access pattern: the application retrieved pre-calculated values during user login, generating approximately 60,000 queries per day against Redshift Serverless.",
    consequence:
      "Because queries arrived continuously, Redshift could not effectively scale down between requests, increasing the cost of serving a relatively small amount of operational data.",
    flow: ["User login", "API / backend", "Repeated point lookups", "Redshift Serverless", "Rising cost"],
  },

  costEvidence: {
    heading: "The cost signal",
    caption:
      "Redshift costs increased after the XIRR-serving workload was introduced, motivating a deeper workload and architecture investigation.",
    serviceTotal: "$1,176.88",
    daily: [
      { date: "Dec-19", amount: "$39.96" },
      { date: "Dec-20", amount: "$3.38" },
      { date: "Dec-21", amount: "$3.38" },
      { date: "Dec-22", amount: "$32.62" },
      { date: "Dec-23", amount: "$85.13" },
      { date: "Dec-24", amount: "$81.47" },
      { date: "Dec-25", amount: "$81.93" },
      { date: "Dec-26", amount: "$83.30" },
    ],
    imageAlt: "Redshift daily cost chart showing increased spend in late December.",
  },

  architectureQuestion: {
    preface: "The question wasn't \"Which database is fastest?\"",
    headline: "It was: which workload belongs on which storage engine?",
    operational: [
      "Frequent point lookups",
      "User-facing latency",
      "CRUD / serving patterns",
      "Predictable response time",
    ],
    analytical: ["Aggregations", "Scans", "Dashboards", "Large-scale analytical queries"],
    closing:
      "The PoC evaluated whether separating these workloads could improve cost, performance, and user experience.",
  },

  options: [
    {
      name: "Redshift Serverless",
      role: "Current analytical + serving layer",
      strength: "Strong analytical performance",
      problem: "Poor economic fit for continuous small point-lookups",
    },
    {
      name: "S3 Tables",
      role: "Analytical storage",
      strength: "Low-cost analytical storage and strong bulk/aggregation characteristics",
      problem: "Interactive application serving introduces latency and query/scan overhead",
    },
    {
      name: "Aurora PostgreSQL",
      role: "Transactional / operational database",
      strength: "Better suited to CRUD workloads",
      problem: "Poor fit for heavy analytical aggregation in this benchmark",
    },
    {
      name: "DynamoDB",
      role: "Potential application serving layer",
      strength: "Designed for high-volume key-value / point access",
      problem:
        "Requires access-pattern-driven data modeling and introduces additional data synchronization / operational complexity",
    },
  ],

  benchmark: {
    heading: "Then we benchmarked the alternatives.",
    intro: "The PoC compared representative read, write, bulk-load, delete, and aggregation workloads.",
    rows: [
      { workload: "Read", redshift: "267 ms", aurora: "967 ms", s3: "10,008 ms" },
      { workload: "Read", redshift: "117 ms", aurora: "571 ms", s3: "1,005 ms" },
      { workload: "Insert 1 row", redshift: "9,000 ms", aurora: "834 ms", s3: "2,003 ms" },
      { workload: "Update 1 row", redshift: "9,003 ms", aurora: "6,726 ms", s3: "3,000 ms" },
      { workload: "Bulk insert", redshift: "4 min", aurora: "4.1 min", s3: "50 sec" },
      { workload: "Delete 1 row", redshift: "4,600 ms", aurora: "4,460 ms", s3: "2,500 ms" },
      { workload: "Aggregation", redshift: "5,296 ms", aurora: "42,418 ms", s3: "2,600 ms" },
    ],
    config: ["Redshift Serverless: 4–8 RPUs", "Aurora PostgreSQL: 4–8 ACUs"],
    takeaway:
      "Performance depended heavily on workload shape. No single engine won across operational and analytical access patterns.",
  },

  targetArchitecture: {
    heading: "The result wasn't a database winner.",
    headline: "No single database was cost-effective for both operational and analytical workloads.",
    nodes: [
      { id: "app", label: "Application" },
      { id: "ddb", label: "DynamoDB", sub: "Serving layer" },
      { id: "ops", label: "Operational point reads", variant: "note" },
      { id: "pipe", label: "Data pipeline", variant: "pipe" },
      { id: "s3", label: "S3 Tables", sub: "Analytical storage" },
      { id: "ana", label: "Athena / Presto", sub: "Analytics" },
      { id: "bi", label: "BI / Analytics" },
    ],
  },

  whyDynamo: {
    heading: "Why DynamoDB for the serving path?",
    intro:
      "The application workload was fundamentally a high-frequency point-lookup problem. DynamoDB was evaluated as a dedicated serving layer rather than as a replacement for the analytical platform.",
    points: ["Key-based point access", "High-volume request handling", "Request-based / serverless economics"],
    tradeoff:
      "Trade-off: moving from relational storage to DynamoDB requires deliberate access-pattern-driven data modeling and introduces additional synchronization complexity.",
  },

  whyS3: {
    heading: "Why S3 Tables for analytics?",
    points: [
      "Lower-cost analytical storage",
      "Strong bulk and aggregation characteristics in the benchmark",
      "Better alignment with analytical workloads than application serving",
      "Can separate analytical storage from operational access",
    ],
    limitation:
      "Interactive point lookups were significantly slower in the benchmark, making it unsuitable as the primary login-serving path.",
  },

  insight: {
    quote: "Separate the serving workload from the analytical workload.",
    follow: "Instead of asking one database to serve every workload, match the storage engine to the access pattern.",
  },

  proved: [
    {
      title: "Cost",
      body: "Continuous point-lookups can make an analytical warehouse an expensive serving layer.",
    },
    {
      title: "Performance",
      body: "Workload shape matters more than a generic database speed ranking.",
    },
    {
      title: "Architecture",
      body: "Operational and analytical workloads can justify separate storage strategies.",
    },
  ],

  openItems: {
    heading: "What still needed investigation",
    bullets: [
      "Complex joins",
      "Stored procedure migration",
      "Query rewrites",
      "DynamoDB data modeling",
      "Synchronization between serving and analytical representations",
      "Final migration effort validation",
    ],
    closing:
      "The benchmark established the direction, but the migration design still required deeper analysis of joins, stored procedures, and application access patterns.",
  },

  outcome: {
    paragraphs: [
      "The benchmark shifted the architecture discussion from replacing Redshift to separating workloads.",
      "The resulting direction was a hybrid architecture: S3-based analytics with Aurora / DynamoDB-style operational serving, depending on the access pattern and application requirements.",
      "The PoC identified DynamoDB as a strong candidate for the high-frequency serving path, while Aurora remained a relational option for operational CRUD workloads.",
      "The investigation supported a hybrid architecture rather than a single-database replacement.",
    ],
    context:
      "Investigation for a leading mutual fund provider — XIRR login-serving pattern on Redshift Serverless.",
  },

  takeaway: {
    line1: "Architecture isn't about finding the best database.",
    line2: "It's about finding the right database for the workload.",
  },

  nextProject: { slug: "project-amc-datalake-solution", title: "Legacy Data Modernization & ETL" },
};
