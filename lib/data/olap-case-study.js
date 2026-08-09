/** Workload-separation production migration — client anonymized. */

export const OLAP_CASE_STUDY_SLUG = "olap-workload-architecture";

export const OLAP_COST_EVIDENCE_IMAGE = "/projects/olap/redshift-cost-evidence.png";

export const OLAP_CASE_STUDY = {
  slug: OLAP_CASE_STUDY_SLUG,

  eyebrow: "Data Architecture · Performance Engineering",
  titleLine1: "From OLAP to workload-specific",
  titleLine2: "data architecture",
  subtitle:
    "Production migration from a shared Redshift workload toward workload-specific data stores — starting from a cost spike and high-frequency application serving.",

  signal: {
    metric: "60K",
    metricLabel: "small queries / day",
    highFrequencyLead: "High-frequency access",
    costNote: "Redshift costs rose after XIRR login-serving — supporting signal, not sole cause.",
    costLabel: "Redshift service cost",
    serviceTotal: "$1,176.88",
    costImageAlt: "Redshift daily cost chart.",
    nodes: [
      { id: "user", label: "User", sub: "Login" },
      { id: "app", label: "App" },
      { id: "api", label: "API /", sub: "Backend" },
      { id: "lookup", label: "Point", sub: "Lookup" },
      { id: "rs", label: "Redshift", sub: "Serverless", emphasis: true },
    ],
  },

  mismatch: {
    pre: "The problem wasn't Redshift.",
    headline: ["One engine was serving", "two very different", "workloads."],
    problemInsight:
      "One analytical engine was being asked to serve two fundamentally different access patterns.",
    summary:
      "Redshift was effective for analytical workloads, but application-facing point lookups introduced a fundamentally different access pattern. The investigation focused on whether separating those workloads could improve performance, cost efficiency, and operational fit.",
    fork: {
      hub: "Redshift",
      left: {
        title: "Application serving",
        items: ["Point reads", "High frequency", "User latency"],
      },
      right: {
        title: "Analytics workload",
        items: ["Scans", "Aggregations", "BI"],
      },
      bottom: "Mismatch",
    },
  },

  benchmark: {
    pre: "We stopped guessing.",
    headline: "We benchmarked the alternatives.",
    verdict: "No universal winner.",
    closing: "Performance depended on workload shape.",
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
  },

  architecture: {
    eyebrow: "Production migration · target architecture",
    headline: ["Separate the serving", "workload from the", "analytical workload."],
    migrationNote:
      "Production migration from shared Redshift serving toward workload-specific data stores aligned to access patterns.",
    servingLabel: "Serving path",
    analyticsLabel: "Analytics path",
  },

  result: {
    label: "The result",
    title: "Workload-specific data architecture",
    serving: "Serving → DynamoDB",
    analytics: "Analytics → S3 Tables → Athena / Presto",
  },

  decision: {
    headline: ["The right engine", "depends on", "the access pattern."],
    tradeoffs: [
      {
        engine: "DynamoDB",
        role: "Serving",
        points: ["Key-based access", "High-frequency requests"],
        tradeoff: "Access-pattern-driven modelling · synchronization complexity",
      },
      {
        engine: "Aurora",
        role: "Operational",
        points: ["CRUD", "Relational workloads"],
        tradeoff: "Poor analytical aggregation in this benchmark",
      },
      {
        engine: "S3 Tables",
        role: "Analytics",
        points: ["Bulk workloads", "Aggregations"],
        tradeoff: "Poor interactive point lookup performance",
      },
      {
        engine: "Redshift",
        role: "Original analytical system",
        points: ["Strong for scans / BI"],
        tradeoff: "Poor economic fit for continuous point lookups",
      },
    ],
    stillOpen: [
      "Complex joins",
      "Stored procedure migration",
      "Query rewrites",
      "DynamoDB modelling",
      "Data synchronization",
      "Migration effort validation",
    ],
  },

  final: {
    line1: ["Architecture isn't about", 'choosing the "best" database.'],
    line2: ["Match the data store", "to the workload", "it serves."],
    supporting:
      "The migration showed that performance, cost, and operational fit are driven by access patterns — not by the database in isolation.",
  },
};
