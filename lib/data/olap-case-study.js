/** Workload-separation architecture PoC — client anonymized; investigation, not production migration. */

export const OLAP_CASE_STUDY_SLUG = "olap-workload-architecture";

export const OLAP_COST_EVIDENCE_IMAGE = "/projects/olap/redshift-cost-evidence.png";

export const OLAP_CASE_STUDY = {
  slug: OLAP_CASE_STUDY_SLUG,
  hero: {
    eyebrow: "Data Architecture · Performance Engineering",
    title: "From OLAP to workload-specific data architecture",
    description:
      "A database architecture PoC that started with a cost spike and evolved into a workload-separation strategy.",
    meta: ["Architecture PoC", "AWS", "Cost + Performance"],
    tech: [
      "Redshift Serverless",
      "S3 Tables",
      "Aurora PostgreSQL",
      "DynamoDB",
      "Athena / Presto",
    ],
    pocNote: "Architecture investigation · not a production migration",
  },

  signal: {
    eyebrow: "The signal",
    metric: "60K",
    metricLabel: "small queries / day",
    intro:
      "A new XIRR metric introduced a high-frequency access pattern: users retrieved pre-calculated values during login.",
    flow: ["User login", "Application", "API / backend", "Repeated point lookups", "Redshift Serverless"],
    analytical: ["Large scans", "Aggregations", "Dashboards", "Analytical queries"],
    serving: ["Small reads", "Frequent requests", "User-facing latency", "Point lookups"],
    mismatch: "Redshift was being asked to serve two fundamentally different workloads.",
    costCaption:
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
    costImageAlt: "Redshift daily cost chart showing increased spend in late December.",
  },

  investigation: {
    eyebrow: "The investigation",
    headline: "Which workload belongs on which storage engine?",
    support:
      "The question wasn't which database was universally fastest. It was whether each workload was being served by the right type of storage engine.",
    operational: [
      "Frequent point lookups",
      "User-facing latency",
      "CRUD / serving patterns",
      "Predictable response time",
    ],
    analytical: ["Aggregations", "Scans", "Dashboards", "Large-scale analytical queries"],
    options: [
      {
        name: "Redshift Serverless",
        role: "Current analytical + serving layer",
        strength: "Strong analytical performance",
        concern: "Poor economic fit for continuous small point lookups",
      },
      {
        name: "S3 Tables",
        role: "Analytical storage",
        strength: "Strong bulk and aggregation characteristics in the benchmark",
        concern: "Interactive application serving introduced significant latency / query overhead",
      },
      {
        name: "Aurora PostgreSQL",
        role: "Transactional / operational database",
        strength: "Relational CRUD workloads",
        concern: "Heavy analytical aggregation performed poorly in this benchmark",
      },
      {
        name: "DynamoDB",
        role: "Potential application serving layer",
        strength: "High-volume key-value / point access",
        concern: "Requires access-pattern-driven data modeling and introduces synchronization / operational complexity",
      },
    ],
  },

  evidence: {
    eyebrow: "The evidence",
    headline: "Then we benchmarked the alternatives.",
    intro:
      "The PoC compared representative read, write, bulk-load, delete, and aggregation workloads across the candidate architectures.",
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
    insightTitle: "There was no universal winner.",
    insightRows: [
      { pattern: "Point access", direction: "Operational / serving-oriented database" },
      { pattern: "Bulk + analytical workloads", direction: "Analytical storage / warehouse" },
    ],
    insightClosing: "Performance depended heavily on workload shape.",
  },

  architecture: {
    eyebrow: "The direction",
    headline: "Separate the serving workload from the analytical workload.",
    pocLabel: "Investigated architecture direction (PoC — not confirmed production)",
    line1: "The architecture changes because the workload changes.",
    line2: "Instead of asking one database to serve every workload, match the storage engine to the access pattern.",
  },

  tradeoff: {
    eyebrow: "The trade-off",
    headline: "Separation solves one problem by introducing another.",
    columns: [
      {
        title: "Serving",
        engine: "DynamoDB",
        points: ["Key-based point access", "High-frequency requests", "Request-oriented economics"],
        tradeoff: "Access-pattern-driven modeling + synchronization complexity.",
      },
      {
        title: "Analytics",
        engine: "S3 Tables",
        points: ["Bulk operations", "Aggregations", "Analytical storage economics"],
        tradeoff: "Poor fit for interactive point lookups in this benchmark.",
      },
      {
        title: "Relational alternative",
        engine: "Aurora PostgreSQL",
        points: ["CRUD", "Relational access patterns", "Operational workloads"],
        tradeoff: "Heavy analytical aggregation performed poorly in this benchmark.",
      },
    ],
  },

  changed: {
    eyebrow: "What changed",
    before: {
      title: "Before — one platform",
      platform: "Redshift",
      lines: ["Application serving", "Analytics"],
    },
    after: {
      title: "Investigated direction — workload-specific architecture",
      serving: "DynamoDB / Aurora — operational serving",
      analytics: "S3 Tables — analytical storage",
    },
    direction: [
      "The PoC identified DynamoDB as a strong candidate for the high-frequency serving path, while Aurora remained a relational option for operational CRUD workloads.",
      "The investigation supported a hybrid architecture rather than a single-database replacement.",
    ],
    validated: [
      {
        title: "Cost",
        body: "Continuous point lookups can make an analytical warehouse an expensive serving layer.",
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
    openHeading: "What still needed investigation",
    openBullets: [
      "Complex joins",
      "Stored procedure migration",
      "Query rewrites",
      "DynamoDB data modeling",
      "Synchronization between serving and analytical representations",
      "Final migration effort validation",
    ],
    openClosing:
      "The benchmark established the direction, but the migration design still required deeper analysis of joins, stored procedures, and application access patterns.",
  },

  takeaway: {
    eyebrow: "Final takeaway",
    line1: "Architecture isn't about finding the best database.",
    line2: "It's about finding the right database for the workload.",
  },

  nextProject: { slug: "project-amc-datalake-solution", title: "Legacy Data Modernization & ETL" },
};
