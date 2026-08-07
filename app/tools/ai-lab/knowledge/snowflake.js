export const snowflakeKnowledge = {
  id: "technology/snowflake",
  title: "Snowflake",
  category: "technology",
  kind: "technology",
  tags: ["snowflake", "warehouse", "analytics"],
  technologies: ["sql"],
  projects: [],
  topics: ["cloud warehouse", "governed analytics"],
  summary: "I use Snowflake when I want a governed warehouse model with strong SQL ergonomics and predictable consumption patterns.",
  businessContext: "It fits teams that want analytics simplicity, separation of concerns, and a clear warehouse-first operating model.",
  problemStatement: "The decision point is usually whether the workload benefits more from warehouse simplicity than from a broader lakehouse pattern.",
  whyIChooseIt: [
    "I choose it when the team wants straightforward analytics delivery and strong separation between storage and compute concerns.",
    "I choose it when the warehouse-first model is a better operational fit than managing Spark-style workloads."
  ],
  alternatives: ["Databricks", "BigQuery", "Synapse"],
  pros: [
    "Clean SQL experience",
    "Strong fit for governed analytics",
    "Simple operating model for many enterprise use cases"
  ],
  cons: [
    "Can be the wrong fit for some Spark-heavy workloads",
    "Cost and scaling still need attention",
    "Less flexible than a broader lakehouse design for some patterns"
  ],
  whenIUseIt: [
    "I use it for governed warehouse workloads with clear SQL semantics.",
    "I use it when the team wants a lighter operational surface area."
  ],
  whenIAvoidIt: [
    "I avoid it when the workload needs broader Spark flexibility or deeper custom processing."
  ],
  scalingConsiderations: [
    "Query design and warehouse sizing still matter.",
    "Modeling choices influence both performance and cost."
  ],
  operationalConsiderations: [
    "I watch access control and data sharing boundaries closely.",
    "I keep the semantic layer aligned to business ownership."
  ],
  relatedTechnologies: ["SQL"],
  followUps: [
    "Compare Snowflake with Databricks for this use case",
    "Explain where the warehouse model is operationally simpler",
    "Show the scenarios where I would avoid it"
  ]
};
