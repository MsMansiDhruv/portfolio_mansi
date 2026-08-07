export const architectureKnowledge = {
  id: "architecture/principles",
  title: "Architecture",
  category: "architecture",
  kind: "architecture",
  tags: ["architecture", "lakehouse", "platform", "design"],
  technologies: ["databricks", "spark", "sql", "terraform"],
  projects: ["project/amc-datalake", "project/small-datalake-poc"],
  topics: ["enterprise architecture", "platform design", "governance"],
  summary: "I design data platforms around business reliability, governance, and reuse, not just around the latest tool choice.",
  businessContext: "A good data architecture should improve trust, reduce support cost, and make it easier for teams to deliver analytics repeatedly.",
  problemStatement: "The common failure mode is selecting tools before defining freshness, ownership, consumers, and recovery expectations.",
  principles: [
    "I define freshness and SLA expectations before I lock the stack.",
    "I separate ingestion, transformation, and serving boundaries.",
    "I keep semantic logic close to the consumption layer.",
    "I treat lineage and data quality as first-class architecture concerns."
  ],
  technologySelection: [
    "Kafka for durable event ingestion.",
    "Databricks or Spark for scalable transformations.",
    "Delta Lake or Snowflake for governed analytical storage.",
    "Power BI or a semantic layer for enterprise consumption."
  ],
  tradeoffs: [
    "More governance improves trust but adds ceremony.",
    "Batch-first designs are simpler; streaming reduces latency but increases operational complexity.",
    "Centralized models improve consistency; distributed ownership can improve speed."
  ],
  scalability: [
    "Design for reprocessing and backfills early.",
    "Partition by how data is used, not just how it arrives.",
    "Keep compute elastic where workloads are bursty."
  ],
  security: [
    "Use least privilege and masked sensitive fields.",
    "Treat lineage and auditability as security primitives."
  ],
  monitoring: [
    "Monitor freshness, volume, schema drift, and failed retries.",
    "Alert on business-impacting conditions, not raw technical noise."
  ],
  risks: [
    "Undefined ownership leads to brittle pipelines.",
    "Too many point tools create hidden integration cost."
  ],
  relatedTechnologies: ["Kafka", "Databricks", "Delta Lake", "Power BI"],
  followUps: [
    "Show how I would design a lakehouse from scratch",
    "Explain the trade-offs between batch and streaming",
    "Describe the governance controls I put in early"
  ]
};
