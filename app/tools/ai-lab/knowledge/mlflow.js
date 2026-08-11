export const mlflowKnowledge = {
  id: "technology/mlflow",
  title: "MLflow",
  category: "technology",
  kind: "technology",
  tags: ["mlflow", "mlops", "model tracking"],
  technologies: ["databricks", "s3", "python"],
  projects: ["project/brain-mvp", "experience/fintech-ml-platform"],
  skills: ["ml pipeline integration", "mlops"],
  topics: ["model tracking", "productionization", "reproducibility"],
  difficulty: ["intermediate"],
  relatedDocuments: ["project/brain-mvp", "story/productionizing-ml-pipelines", "philosophy/engineering"],
  summary:
    "I use MLflow for model tracking and lifecycle visibility in production ML paths — connecting Data Scientist-developed models to deployment pipelines I engineer.",
  whyIChooseIt: [
    "I choose MLflow when teams need experiment tracking, artifact lineage, and a bridge from model development to containerized deployment.",
    "It supports reproducibility and auditability without me claiming ownership of model training.",
  ],
  whenIUseIt: [
    "Brain MVP+: tracking stage between model development (DS) and ECR/EC2 deployment.",
    "Financial technology client ML pipeline deployment alongside Airflow/Databricks patterns.",
  ],
  whenIAvoidIt: [
    "I avoid MLflow as a substitute for pipeline reliability, monitoring, or serving design — tracking alone is not production.",
    "I avoid over-engineering tracking when the team has no defined promotion process to production.",
  ],
  pros: [
    "Clear handoff artifact between DS and engineering",
    "Supports reproducibility and version awareness",
    "Integrates with common ML stacks on AWS/Databricks",
  ],
  cons: [
    "Does not solve inference scaling, scheduling, or failure handling by itself",
    "Requires governance so experiments do not become production by accident",
  ],
  relatedTechnologies: ["Databricks", "S3", "ECR", "Airflow"],
  relatedProjects: ["ML-Driven Allocation Engine", "Financial Technology ML Platform"],
  followUps: ["How have you productionized machine learning?", "What was your role in the Brain project?"],
};
