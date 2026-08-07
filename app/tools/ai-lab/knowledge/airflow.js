export const airflowKnowledge = {
  id: "technology/airflow",
  title: "Airflow",
  category: "technology",
  kind: "technology",
  tags: ["airflow", "orchestration", "workflow", "scheduler"],
  technologies: ["python", "sql"],
  projects: [],
  topics: ["workflow orchestration", "dependency management"],
  summary: "I use Airflow when orchestration needs to be explicit, observable, and easy for operators to reason about.",
  businessContext: "Most pipeline failures are not caused by the transform itself. They come from scheduling, dependency, or recovery gaps.",
  problemStatement: "The challenge is to make pipeline execution predictable when data arrival, retries, and downstream dependencies are not perfectly stable.",
  whyIChooseIt: [
    "I choose it when task dependencies and retries need to be visible and manageable.",
    "I choose it when the workflow itself is part of the operational contract."
  ],
  alternatives: ["Managed schedulers", "Event-driven orchestration", "Simple cron jobs"],
  pros: [
    "Clear DAG structure",
    "Good visibility into dependency chains",
    "Useful for retry and recovery design"
  ],
  cons: [
    "Can become brittle if DAGs are overgrown",
    "Not every problem needs orchestration overhead",
    "Misuse turns DAGs into unreadable workflow dumps"
  ],
  whenIUseIt: [
    "I use it when the pipeline needs explicit orchestration and recovery behavior."
  ],
  whenIAvoidIt: [
    "I avoid it for trivial scheduling that does not justify a workflow engine.",
    "I avoid relying on it as a substitute for data quality or idempotency design."
  ],
  scalingConsiderations: [
    "DAG size, task fan-out, and retry behavior need to stay understandable.",
    "Backfill and reprocessing support has to be designed up front."
  ],
  operationalConsiderations: [
    "I monitor freshness, failures, and alert quality rather than raw task noise.",
    "I keep recovery paths documented and testable."
  ],
  relatedTechnologies: ["Python", "SQL"],
  followUps: [
    "Show how I would harden an Airflow DAG",
    "Explain the recovery strategy I would use",
    "Compare Airflow with a lighter scheduling approach"
  ]
};
