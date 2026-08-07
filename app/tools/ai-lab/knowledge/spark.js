export const sparkKnowledge = {
  id: "technology/spark",
  title: "Spark",
  category: "technology",
  kind: "technology",
  tags: ["spark", "pyspark", "distributed compute", "etl"],
  technologies: ["databricks", "sql", "python"],
  projects: ["project/amc-datalake", "project/small-datalake-poc", "project/gpu-benchmark"],
  topics: ["distributed compute", "transformation", "performance"],
  summary: "I use Spark when I need parallel data processing that still lets me reason about the shape of the workload and the cost of the transformation.",
  businessContext: "Spark matters when a team has more data, more joins, or more transformation complexity than a single-node pattern can handle cleanly.",
  problemStatement: "The hard part is not writing the transformation. It is keeping the workload efficient, maintainable, and observable at scale.",
  whyIChooseIt: [
    "I choose Spark when I need distributed execution for large data volumes.",
    "I choose it when the same code path must support batch-style ETL and larger-scale processing."
  ],
  alternatives: ["SQL engine", "Pandas", "Warehouse-native transforms", "Streaming-only engines"],
  pros: [
    "Scales well across data volume",
    "Flexible for ETL and transformation logic",
    "Works well with lakehouse storage patterns",
    "Good for controlled performance tuning"
  ],
  cons: [
    "Poorly written jobs can create expensive shuffles",
    "It is easy to overuse Spark for small problems",
    "Debugging distributed failures takes discipline"
  ],
  whenIUseIt: [
    "I use it when joins, aggregations, or reshaping exceed small-engine comfort levels.",
    "I use it when the transformation is part of a bigger data platform, not a one-off script."
  ],
  whenIAvoidIt: [
    "I avoid it for simple logic that a smaller engine can handle more cheaply.",
    "I avoid it when the team does not have a plan for code review, partitioning, and job monitoring."
  ],
  scalingConsiderations: [
    "Partitioning strategy matters.",
    "Shuffle-heavy workloads need extra scrutiny.",
    "File sizing and data layout have a first-order effect on runtime."
  ],
  operationalConsiderations: [
    "I prefer repeatable jobs over ad hoc notebook runs.",
    "I keep an eye on skew, retries, and executor pressure.",
    "I treat observability as part of the Spark design."
  ],
  relatedTechnologies: ["Databricks", "SQL", "Delta Lake"],
  relatedProjects: ["AMC - Datalake Solution", "GPU Benchmark Pod"],
  followUps: [
    "Show how I would tune a Spark job with skew and shuffles",
    "Explain when Spark is the wrong tool",
    "Walk through the operational controls I would add"
  ]
};
