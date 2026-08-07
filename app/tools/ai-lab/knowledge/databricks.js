export const databricksKnowledge = {
  id: "technology/databricks",
  title: "Databricks",
  category: "technology",
  kind: "technology",
  tags: ["databricks", "spark", "lakehouse", "unity catalog"],
  technologies: ["spark", "delta lake", "unity catalog"],
  projects: ["project/amc-datalake", "project/small-datalake-poc"],
  topics: ["lakehouse", "governance", "distributed compute"],
  summary: "I reach for Databricks when I need one platform for large-scale Spark processing, governed lakehouse workflows, and a clean path from exploration to production.",
  businessContext: "Enterprise analytics teams usually need scale, governance, and shared semantics without stitching together too many point tools.",
  problemStatement: "The real problem is rarely just running Spark. It is keeping jobs reproducible, data governed, and costs predictable as usage grows.",
  whyIChooseIt: [
    "I choose it when the workload needs Spark-scale compute with managed orchestration and governance.",
    "I choose it when the team needs a path from notebook exploration to production jobs without rebuilding the platform around every use case."
  ],
  alternatives: ["Snowflake", "BigQuery", "Synapse", "Self-managed Spark"],
  pros: [
    "Spark-native scale",
    "Strong lakehouse integration",
    "Good fit for mixed batch and streaming patterns",
    "Clearer governance when the workspace is managed well"
  ],
  cons: [
    "Cost grows fast without discipline",
    "Notebook sprawl creates maintenance debt",
    "Operational boundaries need to be designed intentionally"
  ],
  whenIUseIt: [
    "I use it for scalable transformations",
    "I use it for governed lakehouse workflows",
    "I use it when batch and streaming need to coexist"
  ],
  whenIAvoidIt: [
    "I avoid it for small workloads that do not need Spark-scale compute",
    "I avoid it when the team wants a simple warehouse pattern with very little platform overhead"
  ],
  scalingConsiderations: [
    "Cluster strategy drives cost and performance.",
    "File sizing and partitioning matter more than people expect.",
    "Governance and workspace boundaries need to scale with team size, not just data volume."
  ],
  operationalConsiderations: [
    "I keep development and production concerns separated.",
    "I use jobs for repeatable execution instead of leaving notebooks as the only production artifact.",
    "I watch cluster idle time and workspace sprawl carefully."
  ],
  relatedTechnologies: ["Spark", "Delta Lake", "Terraform"],
  relatedProjects: ["AMC - Datalake Solution", "Small Data Lake (PoC)"],
  followUps: [
    "Explain why I would choose Databricks over Snowflake for a lakehouse",
    "Walk through the scaling and cost controls I would put around it",
    "Show the operational mistakes I avoid on Databricks"
  ]
};
