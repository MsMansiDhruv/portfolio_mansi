export const cloudKnowledge = {
  id: "cloud/cost",
  title: "Cloud Cost",
  category: "cloud",
  kind: "cloud",
  tags: ["cloud", "cost", "spend", "optimization"],
  technologies: ["aws", "azure", "databricks"],
  projects: ["project/amc-datalake", "project/gpu-benchmark"],
  topics: ["cost control", "capacity planning", "platform economics"],
  summary: "I treat cloud cost as an architecture problem, not a late-stage cleanup exercise.",
  businessContext: "The business rarely wants lower cost in isolation. It wants lower cost without losing reliability, speed, or governance.",
  problemStatement: "The real cost drivers are usually compute idle time, reprocessing, oversized instances, and unnecessary data movement.",
  drivers: [
    "Idle compute",
    "Overprovisioned GPU or memory tiers",
    "Repeated reprocessing",
    "Premium storage retention",
    "Data egress and cross-region traffic",
    "Orchestration overhead"
  ],
  diagnosticQuestions: [
    "How many clusters or endpoints are running?",
    "Is the workload batch or real time?",
    "Are GPUs actually required?",
    "Which region and storage tier are used?",
    "How much data is reprocessed each day?"
  ],
  mitigations: [
    "Use autoscaling only when the workload profile supports it.",
    "Schedule shutdowns for idle environments.",
    "Prefer ephemeral compute for bursty workloads.",
    "Move cold data to cheaper storage tiers."
  ],
  savings: [
    "Idle cleanup often saves meaningful money quickly.",
    "Right-sizing compute is usually more effective than micro-optimizing storage first."
  ],
  scale: "Cost pressure gets worse as environments multiply and data movement becomes a bigger part of the architecture.",
  operationalConsiderations: [
    "I watch for idle environments, orphaned endpoints, and repeated full refreshes.",
    "I tie savings work back to business impact instead of generic tuning advice."
  ],
  relatedTechnologies: ["AWS", "Databricks", "Terraform"],
  relatedProjects: ["GPU Benchmark Pod", "AMC - Datalake Solution"],
  followUps: [
    "Estimate the main cost drivers in this architecture",
    "Show where I would cut spend first",
    "Explain the operational guardrails I would add"
  ]
};
