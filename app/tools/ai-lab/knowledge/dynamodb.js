export const dynamodbKnowledge = {
  id: "technology/dynamodb",
  title: "DynamoDB",
  category: "technology",
  kind: "technology",
  tags: ["dynamodb", "nosql", "serving", "operational"],
  technologies: ["aws", "kinesis"],
  projects: ["project/olap-workload-architecture", "experience/fintech-ml-platform"],
  skills: ["data architecture", "access pattern design"],
  topics: ["operational serving", "key-value access", "workload separation"],
  difficulty: ["intermediate", "advanced"],
  relatedDocuments: ["project/olap-workload-architecture", "technology/redshift"],
  summary:
    "I consider DynamoDB when access patterns are key-based, high-frequency, and latency-sensitive — not as a universal replacement for warehouses or analytical stores.",
  whyIChooseIt: [
    "I choose it for serving paths where point lookups dominate and access patterns can be modeled explicitly.",
    "In workload-separation architecture it fit the application serving role while analytics moved to S3 Tables + Athena/Presto.",
  ],
  whenIUseIt: [
    "Target serving layer after OLAP investigation for high-frequency application reads.",
    "Financial technology client integration patterns where key-value serving complemented batch/stream processing.",
  ],
  whenIAvoidIt: [
    "I avoid DynamoDB when the primary need is ad hoc analytical aggregation across large scans — warehouses or lake query engines fit better.",
    "I avoid it when access patterns are not yet understood — poor key design creates synchronization and modeling debt.",
  ],
  pros: [
    "Strong fit for key-based, high-frequency serving",
    "Managed operational scaling for predictable access patterns",
  ],
  cons: [
    "Access-pattern-driven modeling required upfront",
    "Data synchronization with analytical stores adds complexity",
    "Not a substitute for BI-style SQL analytics",
  ],
  operationalConsiderations: [
    "Model for the query, not the entity diagram — DynamoDB rewards explicit access design.",
    "Plan sync/replication to analytical paths when hybrid architecture splits serving and analytics.",
  ],
  relatedTechnologies: ["Redshift", "S3 Tables", "Athena", "Kinesis"],
  relatedProjects: ["OLAP Workload Architecture", "Financial Technology ML Platform"],
  followUps: ["How do you think about database selection?", "When would you not use DynamoDB?"],
};
