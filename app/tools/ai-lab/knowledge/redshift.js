export const redshiftKnowledge = {
  id: "technology/redshift",
  title: "Redshift",
  category: "technology",
  kind: "technology",
  tags: ["redshift", "warehouse", "analytics", "sql"],
  technologies: ["sql", "s3", "redshift spectrum", "aws"],
  projects: ["project/amc-datalake", "project/olap-workload-architecture"],
  skills: ["cloud data warehousing", "sql"],
  topics: ["analytical serving", "workload fit", "cost"],
  difficulty: ["intermediate", "advanced"],
  relatedDocuments: ["project/olap-workload-architecture", "technology/dynamodb", "philosophy/engineering"],
  summary:
    "I use Redshift as an analytical serving layer — strong for scans, aggregations, and BI — not as a default operational serving store for high-frequency point lookups.",
  whyIChooseIt: [
    "I choose Redshift when downstream consumers need SQL analytics, BI connectivity, and centralized warehouse semantics on structured/curated data.",
    "In data lake modernization I pair S3 (durable lake) with Redshift (query-optimized consumption) rather than forcing one store to do both jobs.",
  ],
  whenIUseIt: [
      "Legacy data modernization: Gold marts and reporting backend for Power BI and internal analytics.",
      "Analytical workloads: aggregations and scans where benchmark evidence showed Redshift competitive (e.g., aggregation ~5.3s vs Aurora ~42s in OLAP PoC).",
  ],
  whenIAvoidIt: [
    "I avoid using Redshift (especially Serverless) as an application serving layer for continuous high-frequency point lookups — cost and fit suffer.",
    "I avoid warehouse-first design when the dominant pattern is key-value operational access (DynamoDB or similar may fit better).",
  ],
  pros: [
    "Strong analytical query performance for scans and BI",
    "Integrates with S3 via Spectrum for lakehouse-style patterns",
    "Familiar SQL surface for analytics teams",
  ],
  cons: [
    "Poor fit for high-frequency small point reads in my OLAP engagement benchmarks",
    "Single-row insert/update latency was high in PoC samples (~9s) compared to Aurora for OLTP-style patterns",
    "Economic mismatch when misused for serving workloads",
  ],
  operationalConsiderations: [
    "Monitor whether application traffic is using the warehouse as a serving layer — cost signals may indicate architectural mismatch.",
    "Separate serving and analytics paths when access patterns diverge.",
  ],
  relatedTechnologies: ["S3", "Redshift Spectrum", "Power BI", "SQL", "DynamoDB"],
  relatedProjects: ["Legacy Data Modernization & ETL", "OLAP Workload Architecture"],
  followUps: ["Why did you use Redshift?", "Why would you separate OLTP and OLAP workloads?"],
};
