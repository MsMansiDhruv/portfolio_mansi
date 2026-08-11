export const lambdaKnowledge = {
  id: "technology/lambda",
  title: "AWS Lambda",
  category: "technology",
  kind: "technology",
  tags: ["lambda", "serverless", "aws"],
  technologies: ["aws", "s3", "python"],
  projects: ["project/amc-datalake", "project/automated-intelligence-pipeline", "experience/media-entertainment-devops"],
  skills: ["serverless", "pipeline engineering"],
  topics: ["event-driven processing", "automation"],
  difficulty: ["intermediate"],
  relatedDocuments: ["technology/aws", "project/automated-intelligence-pipeline"],
  summary:
    "I use Lambda for event-driven, short-lived processing steps — not as a default for heavy crawl or long-running Spark workloads.",
  whyIChooseIt: [
    "I choose Lambda when processing units are small, intermittent, and benefit from managed scaling without persistent servers.",
    "Intelligence pipeline: serverless processing stages alongside S3 persistence and EC2 for heavier crawl workloads.",
  ],
  whenIUseIt: [
    "Automated intelligence pipeline processing hooks on AWS.",
    "Media/entertainment and platform deployments integrating Lambda into CI/CD-delivered infrastructure.",
    "Supporting glue/orchestration patterns in broader AWS data platforms.",
  ],
  whenIAvoidIt: [
    "I avoid Lambda for sustained Scrapy/crawl workloads or large memory-bound transforms — EC2 or Glue fit better.",
    "I avoid chaining many Lambda steps without observability and idempotency design.",
  ],
  pros: [
    "No server management for bursty workloads",
    "Integrates cleanly with S3 events and scheduling",
  ],
  cons: [
    "Timeout and memory limits constrain workload shape",
    "Cold starts and per-invocation cost need monitoring at high frequency",
  ],
  relatedTechnologies: ["S3", "EC2", "Terraform", "EventBridge"],
  relatedProjects: ["Automated Web Intelligence Pipeline", "Legacy Data Modernization & ETL"],
  followUps: ["When would you use EC2 instead of Lambda?"],
};
