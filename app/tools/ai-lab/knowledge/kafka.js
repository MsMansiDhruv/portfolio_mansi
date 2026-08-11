export const kafkaKnowledge = {
  id: "technology/kafka",
  title: "Kafka",
  category: "technology",
  kind: "technology",
  tags: ["kafka", "streaming", "events"],
  technologies: ["kinesis", "spark", "databricks"],
  projects: ["experience/fintech-ml-platform"],
  skills: ["streaming", "event ingestion"],
  topics: ["batch vs streaming", "real-time scoring"],
  difficulty: ["intermediate", "advanced"],
  relatedDocuments: ["technology/airflow", "technology/databricks", "philosophy/engineering"],
  summary:
    "I use Kafka (and Kinesis in AWS contexts) when event durability, ordered ingestion, and fan-out to multiple consumers justify streaming operational complexity.",
  whyIChooseIt: [
    "I choose Kafka when downstream systems need durable, replayable event streams for near-real-time processing or scoring.",
    "At a financial technology client it supported streaming paths alongside batch Databricks/Spark pipelines.",
  ],
  whenIUseIt: [
    "Real-time and near-real-time scoring pipelines with Spark/Databricks consumers.",
    "Decoupling producers from multiple downstream processors.",
  ],
  whenIAvoidIt: [
    "I avoid streaming when batch latency is acceptable — operational cost and debugging complexity drop significantly.",
    "I avoid Kafka as a band-aid for poor batch design without clear latency requirements.",
  ],
  pros: [
    "Durable ordered ingestion",
    "Fan-out to multiple processing paths",
    "Replay supports recovery and reprocessing",
  ],
  cons: [
    "Operational overhead: consumer lag, schema drift, poison messages",
    "Requires explicit delivery semantics and monitoring",
  ],
  relatedTechnologies: ["Kinesis", "Spark", "Databricks", "Airflow"],
  relatedProjects: ["Financial Technology ML Platform"],
  followUps: ["Tell me about your streaming experience", "Streaming vs batch decisions?"],
};
