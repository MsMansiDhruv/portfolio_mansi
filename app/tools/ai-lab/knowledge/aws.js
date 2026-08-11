export const awsKnowledge = {
  id: "technology/aws",
  title: "AWS",
  category: "technology",
  kind: "technology",
  tags: ["aws", "cloud", "s3", "lambda", "glue", "redshift"],
  technologies: ["s3", "lambda", "glue", "redshift", "dms", "cloudwatch", "terraform"],
  projects: [
    "project/amc-datalake",
    "project/olap-workload-architecture",
    "project/brain-mvp",
    "project/automated-intelligence-pipeline",
    "experience/fintech-ml-platform",
  ],
  skills: ["cloud data platforms", "production engineering"],
  topics: ["cloud architecture", "data platforms", "cost optimization"],
  difficulty: ["intermediate"],
  relatedDocuments: ["technology/s3", "technology/redshift", "technology/glue", "cloud/cost"],
  summary:
    "AWS is my primary cloud for data platforms — I use it where managed services (S3, Glue, Lambda, Redshift, DMS) reduce operational burden while keeping boundaries clear between storage, compute, and serving.",
  whyIChooseIt: [
    "I choose AWS when the workload needs durable object storage, managed ETL, serverless processing, and warehouse serving in one ecosystem.",
    "I choose it when teams already operate on AWS and need IaC-driven, reproducible environments.",
  ],
  whenIUseIt: [
    "Data lake modernization: S3 lake, Glue ETL, Redshift serving, DMS ingestion, Step Functions orchestration.",
    "Intelligence pipelines: S3 persistence, Lambda processing, EC2 batch/crawl workloads.",
    "ML production: S3 data paths, ECR/EC2 deployment, Lambda integration at a financial technology client.",
    "Architecture investigations: Redshift Serverless, DynamoDB, Aurora, S3 Tables, Athena comparisons.",
  ],
  whenIAvoidIt: [
    "I avoid defaulting to AWS when the team's operational home is elsewhere and migration cost exceeds benefit — though I still design workload-first regardless of cloud.",
    "I avoid using Lambda for sustained heavy compute where EC2 or managed Spark fit better economically.",
  ],
  pros: [
    "Broad managed data service catalog",
    "Strong IaC ecosystem (Terraform, CloudFormation)",
    "Mature observability with CloudWatch",
  ],
  cons: [
    "Service sprawl can hide integration cost",
    "Wrong service for the workload pattern gets expensive quickly (e.g., warehouse as serving layer)",
  ],
  operationalConsiderations: [
    "IAM least privilege, KMS, and Secrets Manager are part of design — not late add-ons.",
    "I watch for idle compute, cross-AZ egress, and serving misuse of analytical stores.",
  ],
  relatedTechnologies: ["S3", "Glue", "Redshift", "Lambda", "Terraform", "CloudWatch"],
  relatedProjects: [
    "Legacy Data Modernization & ETL",
    "OLAP Workload Architecture",
    "Automated Web Intelligence Pipeline",
    "ML-Driven Allocation Engine",
  ],
  followUps: ["Why did you use Redshift?", "How do you approach AWS cost optimization?"],
};
