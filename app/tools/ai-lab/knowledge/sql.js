export const sqlKnowledge = {
  id: "technology/sql",
  title: "SQL",
  category: "technology",
  kind: "technology",
  tags: ["sql", "query", "joins", "analytics"],
  technologies: ["spark", "snowflake", "power bi"],
  projects: ["project/amc-datalake", "project/olap-workload-architecture", "experience/enterprise-data-extraction"],
  topics: ["query design", "performance", "analytics"],
  summary: "I treat SQL as the language that turns data platforms into decision systems, so the query shape matters as much as the model underneath it.",
  businessContext: "SQL is where most teams feel the difference between a platform that is fast enough to trust and one that makes users wait for answers.",
  problemStatement: "The challenge is usually to express the business question cleanly without causing unnecessary scans, joins, or repeated work.",
  whyIChooseIt: [
    "I choose SQL because it is portable, readable, and still the fastest way to make analytics understandable to a broader team.",
    "I choose it when I want the logic to be obvious enough for code review and governance."
  ],
  alternatives: ["Procedural transformation code", "Warehouse-native modeling languages", "Notebook-only logic"],
  pros: [
    "Readable by a wider audience",
    "Easy to reason about in reviews",
    "Works across engines"
  ],
  cons: [
    "Bad SQL can explode scans and joins",
    "Complex window logic can be expensive",
    "Hidden assumptions around materialization can create surprises"
  ],
  whenIUseIt: [
    "I use it for filtering, joining, aggregating, and serving curated analytics.",
    "I use it when I want the business logic to stay close to the semantic layer."
  ],
  whenIAvoidIt: [
    "I avoid overcomplicating SQL when the logic belongs in a transformation layer first.",
    "I avoid writing opaque SQL that nobody can maintain."
  ],
  scalingConsiderations: [
    "Filter early.",
    "Reduce scanned columns.",
    "Pre-aggregate before large joins when it makes sense.",
    "Treat partitioning and clustering as workload design choices."
  ],
  operationalConsiderations: [
    "I look at explain plans and execution shape, not just syntax correctness.",
    "I watch for non-sargable predicates, repeated scans, and cartesian growth.",
    "I keep query ownership tied to the downstream use case."
  ],
  relatedTechnologies: ["Spark", "Snowflake", "Power BI"],
  relatedProjects: ["Legacy Data Modernization & ETL", "OLAP Workload Architecture"],
  followUps: [
    "Optimize a multi-join query",
    "Explain how I tune SQL for large fact tables",
    "Show when I would move logic out of SQL"
  ]
};
