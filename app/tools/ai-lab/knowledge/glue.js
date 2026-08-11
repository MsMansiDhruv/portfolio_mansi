export const glueKnowledge = {
  id: "technology/glue",
  title: "AWS Glue",
  category: "technology",
  kind: "technology",
  tags: ["glue", "etl", "pyspark", "aws"],
  technologies: ["pyspark", "s3", "aws", "python"],
  projects: ["project/amc-datalake"],
  skills: ["etl", "elt", "data engineering"],
  topics: ["managed etl", "migration", "modernization"],
  difficulty: ["intermediate"],
  relatedDocuments: ["project/amc-datalake", "technology/spark", "story/data-lake-modernization"],
  summary:
    "I use AWS Glue to replace fragile script-driven ETL with managed, repeatable PySpark jobs — especially during legacy modernization when reliability and operability matter more than bespoke scripts.",
  whyIChooseIt: [
    "I choose Glue when migrating off shell-script ETL toward managed workflows with scheduling and monitoring integration.",
    "I choose it when PySpark-scale transforms belong in the lake processing layer (Silver/Gold).",
  ],
  whenIUseIt: [
    "Legacy data modernization: Bronze → Silver → Gold processing alongside S3 and Redshift.",
    "Orchestrated ETL with EventBridge/Step Functions in the broader ingestion pipeline.",
  ],
  whenIAvoidIt: [
    "I avoid Glue for trivial single-file transforms that Lambda or SQL-native engines handle more cheaply.",
    "I avoid notebook-only Glue development without a path to tested, deployable jobs.",
  ],
  pros: [
    "Managed Spark runtime reduces cluster babysitting",
    "Fits AWS-native lake and warehouse patterns",
    "Better operational story than ad hoc shell scripts",
  ],
  cons: [
    "Job startup and cost need monitoring for small frequent workloads",
    "Requires discipline on partitioning, file sizes, and job parameters",
  ],
  operationalConsiderations: [
    "Pair Glue jobs with validation, CloudWatch monitoring, and deployment processes.",
    "TODO: Expand lineage/replay documentation practices if verified for publication.",
  ],
  relatedTechnologies: ["PySpark", "S3", "Redshift", "Lambda", "Step Functions"],
  relatedProjects: ["Legacy Data Modernization & ETL"],
  followUps: ["How do you approach data lake modernization?", "Glue vs self-managed Spark?"],
};
