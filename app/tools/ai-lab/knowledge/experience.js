/** Resume-sourced professional engagements without confidential client names. */

export const experienceKnowledge = [
  {
    id: "experience/fintech-ml-platform",
    title: "Financial Technology ML & Streaming Platform",
    category: "experience",
    kind: "project",
    tags: ["fintech", "streaming", "mlops", "databricks", "kafka", "cost optimization"],
    technologies: [
      "databricks",
      "pyspark",
      "scala",
      "airflow",
      "kafka",
      "kinesis",
      "dynamodb",
      "delta live tables",
      "aws",
      "docker",
      "lambda",
      "ecs",
      "cloudformation",
      "mlflow",
    ],
    projects: ["project/brain-mvp", "project/amc-datalake"],
    skills: ["streaming", "batch pipelines", "ml pipeline deployment", "technical leadership"],
    topics: ["real-time scoring", "pipeline optimization", "cost reduction", "productionization"],
    difficulty: ["advanced"],
    relatedDocuments: [
      "technology/databricks",
      "technology/kafka",
      "technology/mlflow",
      "technology/airflow",
      "story/pipeline-runtime-reduction",
      "story/cost-reduction",
    ],
    summary:
      "At a financial technology client I worked on Databricks/Spark batch and streaming pipelines, Kafka/Kinesis ingestion, Delta Live Tables, ML pipeline deployment with MLflow, and AWS infrastructure — with documented outcomes including roughly 40% reduction in end-to-end pipeline time and roughly 30% reduction in cost (resume-documented).",
    businessContext:
      "A financial technology organization needed scalable batch and near-real-time data processing, ML pipeline deployment, and production reliability across staging and production environments.",
    problemStatement:
      "Pipeline runtime and infrastructure cost were operational constraints. The team needed streaming and batch patterns that could support real-time scoring and ML workflows without runaway compute spend.",
    myRole:
      "I contributed to pipeline engineering, streaming and batch design, ML pipeline deployment, infrastructure automation (CloudFormation, Docker, Lambda, ECS), CI/CD, and client delivery — including work recognized with a GEM Award for exceptional business value (resume/credentials).",
    architecture: [
      "Batch and streaming ingestion via Kafka and Kinesis into Databricks/PySpark and Scala processing paths.",
      "Delta Live Tables for managed pipeline patterns on the lakehouse side.",
      "DynamoDB and AWS services for serving and integration patterns where appropriate.",
      "MLflow for model lifecycle support alongside Airflow orchestration.",
      "Docker/ECS/Lambda mix for deployment flexibility across workload types.",
    ],
    decisions: [
      "Combined batch and streaming where latency requirements justified operational complexity.",
      "Used managed lakehouse patterns (DLT) to reduce bespoke orchestration where it improved reliability.",
      "Invested in pipeline optimization and right-sizing after measuring end-to-end runtime and cost drivers.",
    ],
    tradeoffs: [
      "Streaming reduces latency but increases operational and debugging complexity versus batch-only paths.",
      "Multi-language stack (PySpark + Scala) adds hiring and maintenance surface but matched team and workload strengths.",
    ],
    outcomes: [
      "Documented ~40% reduction in end-to-end pipeline time (resume).",
      "Documented ~30% reduction in infrastructure cost (resume).",
      "GEM Award for delivering exceptional business value (credentials).",
    ],
    lessonsLearned: [
      "Measure end-to-end pipeline time and cost before optimizing individual stages.",
      "Production ML requires the same operational discipline as production data pipelines: testing, environments, monitoring, rollback.",
      "TODO: Add specific architecture decision anecdotes if verified for public discussion.",
    ],
    scale: "Enterprise-scale batch and streaming data platform with ML integration.",
    whatIWouldImproveToday: [
      "TODO: Add verified details on staging/production promotion gates.",
      "TODO: Add specific streaming vs batch decision examples without exposing client identifiers.",
    ],
    relatedTechnologies: ["Databricks", "Kafka", "Kinesis", "Airflow", "MLflow", "Delta Live Tables"],
    relatedProjects: ["ML-Driven Allocation Engine", "Legacy Data Modernization & ETL"],
    followUps: [
      "Tell me about your streaming experience",
      "Tell me about a time you reduced cloud cost",
      "How have you productionized machine learning?",
    ],
  },
  {
    id: "experience/media-entertainment-devops",
    title: "Media & Entertainment CI/CD & Platform Engineering",
    category: "experience",
    kind: "project",
    tags: ["devops", "ci/cd", "concourse", "terraform", "media"],
    technologies: [
      "concourse",
      "python",
      "terraform",
      "docker",
      "aws lambda",
      "git",
      "bitbucket pipelines",
      "yaml",
    ],
    projects: ["project/amc-datalake", "project/automated-intelligence-pipeline"],
    skills: ["ci/cd", "deployment troubleshooting", "infrastructure automation", "cloud collaboration"],
    topics: ["pipeline standardization", "environment synchronization", "devops collaboration"],
    difficulty: ["intermediate"],
    relatedDocuments: ["technology/terraform", "philosophy/engineering", "story/debugging-cicd-failures"],
    summary:
      "At a media and entertainment client I worked on CI/CD pipeline standardization, Concourse and Bitbucket Pipelines workflows, Terraform and Docker-based deployments, and troubleshooting environment synchronization issues alongside cloud/DevOps teams.",
    businessContext:
      "Media and entertainment platforms depend on repeatable deployments across environments. Inconsistent pipelines and environment drift create delivery risk and long troubleshooting cycles.",
    problemStatement:
      "Teams needed standardized YAML-driven workflows, reliable promotion between environments, and practical troubleshooting when deployments failed — without exposing fragile manual steps.",
    myRole:
      "I contributed to CI/CD setup and maintenance (Concourse, Bitbucket Pipelines, GitHub Actions-style YAML workflows where applicable), Terraform and Docker automation, AWS Lambda deployments, environment sync troubleshooting, and collaboration with platform/DevOps engineers.",
    architecture: [
      "Pipeline-as-code with version-controlled YAML workflow definitions.",
      "Terraform for reproducible infrastructure scaffolding.",
      "Docker for consistent application and job packaging.",
      "Lambda and cloud services integrated into deployment pipelines.",
    ],
    decisions: [
      "Standardize pipeline patterns so teams could reuse proven workflow templates instead of one-off scripts.",
      "Treat environment synchronization as a first-class concern — drift causes more incidents than application bugs.",
    ],
    tradeoffs: [
      "Standardization slows initial team autonomy but reduces long-term support burden.",
      "More pipeline stages increase visibility but add maintenance overhead.",
    ],
    outcomes: [
      "More consistent deployment paths across environments.",
      "Reduced time lost to environment drift and opaque manual deployment steps.",
      "TODO: Add measurable impact if verified for public portfolio use.",
    ],
    lessonsLearned: [
      "CI/CD failures are often environment problems disguised as application failures.",
      "Good pipeline design makes failures visible early rather than at production promotion.",
      "TODO: Add a specific debugging incident narrative if approved for publication.",
    ],
    scale: "Multi-environment cloud delivery for enterprise media platform teams.",
    whatIWouldImproveToday: [
      "Formalize pipeline contract tests between environments.",
      "TODO: Add specific Concourse vs Bitbucket trade-off example if safe to share.",
    ],
    relatedTechnologies: ["Terraform", "Docker", "Concourse", "Bitbucket Pipelines", "Lambda"],
    relatedProjects: ["Legacy Data Modernization & ETL", "Automated Web Intelligence Pipeline"],
    followUps: [
      "How have you used Terraform in CI/CD?",
      "Tell me about debugging a failed deployment",
    ],
  },
  {
    id: "experience/enterprise-data-extraction",
    title: "Enterprise Data Extraction & Intelligence Pipeline",
    category: "experience",
    kind: "project",
    tags: ["data extraction", "scrapy", "etl", "research data", "enterprise"],
    technologies: ["python", "scrapy", "sql", "aws", "ec2", "lambda", "terraform"],
    projects: ["project/automated-intelligence-pipeline"],
    skills: ["web scraping", "etl", "infrastructure automation", "structured reporting"],
    topics: ["data extraction", "etl", "ci/cd", "research intelligence"],
    difficulty: ["intermediate"],
    relatedDocuments: [
      "project/automated-intelligence-pipeline",
      "technology/terraform",
      "technology/lambda",
    ],
    summary:
      "I worked on enterprise data extraction and intelligence pipelines — Python/Scrapy-based extraction, SQL processing, AWS infrastructure (EC2, Lambda), Terraform automation, and CI/CD — producing structured reporting from heterogeneous sources. This experience aligns with the portfolio's Automated Web Intelligence Pipeline case study; no client name is published.",
    businessContext:
      "Enterprise research and intelligence teams need repeatable extraction from diverse web and feed sources, with structured downstream reporting — not ad hoc scripts.",
    problemStatement:
      "Heterogeneous source structures, unreliable manual processes, and lack of automated infrastructure made scaling extraction and reporting difficult.",
    myRole:
      "I contributed to extraction pipeline development (Scrapy, Python), SQL-based processing, AWS deployment (EC2, Lambda), Terraform infrastructure automation, and CI/CD for repeatable runs.",
    architecture: [
      "Extract (Scrapy/crawlers) → transform/normalize (Python/SQL) → persist (AWS) → structured reports.",
      "Terraform-managed infrastructure and CI/CD for scheduled, observable execution.",
    ],
    decisions: [
      "Invest in infrastructure automation early so extraction jobs were schedulable and recoverable.",
      "Separate extraction logic per source type while converging on a common downstream schema.",
    ],
    tradeoffs: [
      "Custom extractors per source type vs one generic crawler — chose hybrid approach for coverage and reliability.",
    ],
    outcomes: [
      "Repeatable extraction and reporting pipeline on AWS.",
      "Foundation patterns reused in the public portfolio case study for automated web intelligence.",
      "TODO: Add measurable impact metrics if approved for publication.",
    ],
    lessonsLearned: [
      "Extraction pipelines fail on edge cases in source HTML — observability and alerting matter as much as parser logic.",
      "TODO: Add specific incident if verified for public sharing.",
    ],
    scale: "Multi-source enterprise extraction with scheduled production runs.",
    whatIWouldImproveToday: [
      "Stronger contract tests on normalized record schemas upstream of reporting.",
    ],
    relatedTechnologies: ["Scrapy", "Python", "SQL", "Terraform", "Lambda", "EC2"],
    relatedProjects: ["Automated Web Intelligence Pipeline"],
    followUps: [
      "How do you design extraction pipelines for heterogeneous sources?",
      "Tell me about your Scrapy experience",
    ],
  },
];
