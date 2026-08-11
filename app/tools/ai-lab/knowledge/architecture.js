export const architectureKnowledge = {
  id: "architecture/principles",
  title: "Architecture",
  category: "architecture",
  kind: "architecture",
  tags: ["architecture", "platform", "design", "workload separation", "lakehouse"],
  technologies: ["databricks", "spark", "sql", "terraform", "redshift", "dynamodb", "s3"],
  projects: [
    "project/amc-datalake",
    "project/olap-workload-architecture",
    "project/brain-mvp",
    "experience/fintech-ml-platform",
  ],
  skills: ["data architecture", "system design"],
  topics: ["enterprise architecture", "platform design", "workload-first design", "governance"],
  difficulty: ["intermediate", "advanced"],
  relatedDocuments: ["philosophy/engineering", "project/olap-workload-architecture", "technology/redshift"],
  summary:
    "I design data platforms around workload fit, business reliability, and operability — choosing storage engines by access pattern, not popularity.",
  businessContext:
    "Good data architecture improves trust, reduces support cost, and makes analytics repeatable. The failure mode is picking tools before defining freshness, ownership, consumers, and recovery expectations.",
  problemStatement:
    "Teams often force one database to serve analytical scans, operational lookups, and bulk loads — then pay in cost, latency, and operational pain.",
  principles: [
    "Workload-first: match the storage engine to the access pattern (see OLAP separation and lake-plus-warehouse modernization).",
    "I define freshness and SLA expectations before I lock the stack.",
    "I separate ingestion, transformation, and serving boundaries — Bronze/Silver/Gold and lake vs warehouse are practical expressions of this.",
    "I treat lineage, validation, and observability as first-class architecture concerns.",
    "Progressive modernization: migrate when evidence and business need justify it.",
    "Hybrid architectures are valid when benchmarks show no universal winner.",
  ],
  technologySelection: [
    "S3 + Glue/PySpark for durable lake processing and ETL modernization.",
    "Redshift for analytical serving and BI — not default application point-lookup serving.",
    "DynamoDB for key-based high-frequency serving when benchmarks support it.",
    "S3 Tables + Athena/Presto for bulk and aggregation-heavy analytics paths.",
    "Kafka/Kinesis when event durability and streaming latency requirements justify operational complexity.",
    "Databricks/Spark for large-scale batch and mixed lakehouse processing.",
    "Power BI or a semantic layer for governed enterprise consumption.",
  ],
  tradeoffs: [
    "More governance improves trust but adds ceremony.",
    "Batch-first designs are simpler; streaming reduces latency but increases operational complexity.",
    "Centralized models improve consistency; federated ownership can improve team speed.",
    "Separating serving and analytics adds sync complexity but improves fit and cost.",
  ],
  scalability: [
    "Design for reprocessing and backfills early.",
    "Partition by how data is used, not just how it arrives.",
    "Keep compute elastic where workloads are bursty; right-size steady serving stores.",
  ],
  security: [
    "Use least privilege, encryption, and masked sensitive fields.",
    "Treat lineage and auditability as security primitives.",
    "Never expose confidential client identifiers in public portfolio or AI responses.",
  ],
  monitoring: [
    "Monitor freshness, volume, schema drift, failed retries, and business-impacting conditions.",
    "Cost signals (e.g., warehouse serving spend) can indicate architectural mismatch.",
    "Alert on conditions operators can act on — not raw technical noise alone.",
  ],
  risks: [
    "Undefined ownership leads to brittle pipelines.",
    "Using an analytical warehouse as an application serving layer.",
    "Too many point tools create hidden integration cost.",
  ],
  relatedTechnologies: ["Redshift", "DynamoDB", "S3", "Glue", "Kafka", "Databricks", "Terraform"],
  followUps: [
    "How do you think about database selection?",
    "Explain batch vs streaming trade-offs",
    "Describe governance controls I put in early",
  ],
};
