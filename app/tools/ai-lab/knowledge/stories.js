export const storyKnowledge = [
  {
    id: "story/cost-driven-architecture-investigation",
    title: "Cost-Driven Architecture Investigation",
    category: "story",
    kind: "story",
    tags: ["architecture", "cost", "benchmark", "redshift", "dynamodb"],
    technologies: ["redshift serverless", "dynamodb", "s3 tables", "aurora"],
    projects: ["project/olap-workload-architecture"],
    skills: ["data architecture", "benchmarking"],
    topics: ["workload separation", "cost optimization", "database selection"],
    difficulty: ["advanced"],
    relatedDocuments: ["project/olap-workload-architecture", "philosophy/engineering", "technology/redshift"],
    summary:
      "A sustained warehouse serving cost signal led me to investigate whether high-frequency point lookups belonged on an analytical engine — PoC benchmarks showed no universal winner and pointed to workload-specific storage.",
    summaryPoints: [
      "Trigger: analytical warehouse used for continuous application point lookups.",
      "Method: PoC benchmarks across Redshift Serverless, Aurora, S3 Tables, DynamoDB.",
      "Insight: match storage engine to access pattern, not popularity.",
    ],
    whatHappened: [
      "Application traffic generated frequent small lookups against Redshift Serverless.",
      "Cost increased; the team questioned workload fit rather than blaming the warehouse generically.",
      "Representative benchmarks compared read, write, bulk, and aggregation patterns.",
    ],
    actions: [
      "Contributed to benchmark design and interpretation.",
      "Documented trade-offs per engine without declaring one database universally superior.",
      "Helped shape hybrid direction: serving layer plus S3-based analytics.",
    ],
    lessonsLearned: [
      "Cost spikes are often architecture signals, not just tuning problems.",
      "Evidence beats debate when stakeholders ask 'why not just use X?'",
    ],
    whatIDoDifferently: [
      "Run benchmarks closer to anonymized production shapes earlier when safe.",
      "TODO: Add migration sequencing detail if verified for public discussion.",
    ],
    followUps: ["Tell me about your most interesting architecture problem"],
  },
  {
    id: "story/productionizing-ml-pipelines",
    title: "Productionizing ML Pipelines",
    category: "story",
    kind: "story",
    tags: ["mlops", "production", "pipeline", "integration"],
    technologies: ["mlflow", "databricks", "s3", "lambda", "graphql"],
    projects: ["project/brain-mvp", "project/automated-intelligence-pipeline", "experience/fintech-ml-platform"],
    skills: ["ml pipeline integration", "deployment", "orchestration"],
    topics: ["ml productionization", "working with data scientists"],
    difficulty: ["advanced"],
    relatedDocuments: ["project/brain-mvp", "technology/mlflow", "philosophy/engineering"],
    summary:
      "Across fintech allocation and web intelligence engagements, my consistent story is engineering the production path around models built by Data Scientists — not claiming model ownership.",
    summaryPoints: [
      "DS owns classifier/allocation model quality.",
      "Engineering owns pipelines, deployment, scheduling, monitoring, integration.",
      "A model creates predictions; production turns them into decisions.",
    ],
    whatHappened: [
      "Brain MVP+: classification models for personas fed allocation logic; needed MLflow, ECR, EC2, GraphQL serving path.",
      "Intelligence pipeline: DS classifier integrated after extract/normalize/deduplicate stages on AWS.",
      "Financial technology client: batch/streaming ML deployment with MLflow, Airflow, Databricks patterns.",
    ],
    actions: [
      "Built repeatable paths from processed data through inference to downstream consumers.",
      "Separated prediction signals from business decision logic where appropriate.",
      "Added CI/CD, IaC, and observability so runs were scheduled and failures visible.",
    ],
    lessonsLearned: [
      "The hard part is often reliability and integration, not the model notebook.",
      "Clear DS/engineering lane boundaries prevent ownership confusion in interviews and delivery.",
    ],
    whatIDoDifferently: [
      "Define inference contracts (schema, SLA, rollback) even earlier with DS partners.",
      "TODO: Add measurable production impact metrics if approved for publication.",
    ],
    followUps: ["How have you productionized machine learning?", "Did you build the classification model?"],
  },
  {
    id: "story/data-lake-modernization",
    title: "Data Lake Modernization",
    category: "story",
    kind: "story",
    tags: ["datalake", "etl", "migration", "glue"],
    technologies: ["s3", "aws glue", "pyspark", "redshift", "terraform"],
    projects: ["project/amc-datalake"],
    skills: ["data engineering", "migration"],
    topics: ["incremental ingestion", "medallion architecture"],
    difficulty: ["intermediate", "advanced"],
    relatedDocuments: ["project/amc-datalake", "technology/glue", "technology/terraform"],
    summary:
      "Modernizing a confidential asset-management client's legacy shell ETL meant layered Bronze/Silver/Gold design, Glue/PySpark processing, and clearer separation between lake storage and Redshift serving.",
    summaryPoints: [
      "Problem: fragile scripts, siloed data, slow analytics.",
      "Approach: AWS lake + managed ETL + warehouse serving + BI.",
      "Theme: boundaries between ingest, transform, serve, consume.",
    ],
    whatHappened: [
      "Multiple legacy sources (databases, partner feeds, files) needed centralization on AWS.",
      "Shell-script ETL was replaced with Glue/PySpark workflows and orchestration.",
      "Self-service and Power BI consumption improved alongside core ETL delivery.",
    ],
    actions: [
      "Contributed to lake architecture, modeling, Glue workflows, and deployment quality.",
      "Supported validation and operational monitoring for production pipelines.",
    ],
    lessonsLearned: [
      "Migration success is measured in operability and trust, not just cloud landing.",
      "Incremental, layered design beats big-bang cutover for complex source landscapes.",
    ],
    whatIDoDifferently: [
      "Formalize consumer contracts between lake, warehouse, and BI earlier.",
    ],
    followUps: ["How do you approach data lake modernization?"],
  },
  {
    id: "story/pipeline-runtime-reduction",
    title: "Reducing Pipeline Runtime",
    category: "story",
    kind: "story",
    tags: ["optimization", "spark", "databricks", "performance"],
    technologies: ["databricks", "pyspark", "airflow", "kafka"],
    projects: ["experience/fintech-ml-platform"],
    skills: ["performance engineering", "pipeline optimization"],
    topics: ["cost-aware engineering", "etl optimization"],
    difficulty: ["advanced"],
    relatedDocuments: ["experience/fintech-ml-platform", "technology/spark", "technology/databricks"],
    summary:
      "At a financial technology client I contributed to pipeline optimizations that achieved a documented ~40% reduction in end-to-end pipeline time (resume) by addressing runtime drivers across batch and streaming paths.",
    summaryPoints: [
      "Measure end-to-end before tuning individual stages.",
      "Optimize where latency and cost actually accumulate.",
    ],
    whatHappened: [
      "End-to-end pipeline time was a delivery and cost constraint for batch and near-real-time workloads.",
      "TODO: Add the specific bottleneck stages if verified for public discussion.",
    ],
    actions: [
      "Worked on Spark/Databricks processing paths, orchestration, and infrastructure right-sizing.",
      "TODO: Add specific optimization techniques applied if approved for publication.",
    ],
    lessonsLearned: [
      "Wall-clock wins require understanding dependency chains, not just faster transforms.",
      "Reprocessing design affects both runtime and cost.",
    ],
    whatIDoDifferently: [
      "TODO: Add architecture decision detail.",
    ],
    followUps: ["Tell me about a time you improved pipeline performance"],
  },
  {
    id: "story/cost-reduction",
    title: "Reducing Infrastructure Cost",
    category: "story",
    kind: "story",
    tags: ["cost", "optimization", "cloud", "architecture"],
    technologies: ["aws", "databricks", "redshift"],
    projects: ["experience/fintech-ml-platform", "project/olap-workload-architecture", "project/amc-datalake"],
    skills: ["cost-aware engineering", "architecture"],
    topics: ["cloud cost", "workload separation", "right-sizing"],
    difficulty: ["intermediate", "advanced"],
    relatedDocuments: ["cloud/cost", "project/olap-workload-architecture", "philosophy/engineering"],
    summary:
      "I approach cloud cost as an architecture problem — workload separation after a Redshift serving cost signal, pipeline right-sizing (~30% cost reduction at a financial technology client per resume), and avoiding idle or mismatched compute.",
    summaryPoints: [
      "Wrong engine for the access pattern wastes money.",
      "Idle compute and repeated full reprocessing are common hidden drivers.",
    ],
    whatHappened: [
      "OLAP engagement: warehouse cost signal from serving misuse triggered architecture investigation.",
      "Fintech engagement: documented ~30% infrastructure cost reduction alongside runtime improvements.",
    ],
    actions: [
      "Used benchmarks and workload analysis to justify separation instead of blanket scale-up.",
      "Applied pipeline and infrastructure optimization on Databricks/AWS paths.",
    ],
    lessonsLearned: [
      "Cost conversations land better when tied to workload evidence, not generic finops checklists.",
    ],
    whatIDoDifferently: [
      "TODO: Add measurable before/after context for OLAP engagement if approved.",
    ],
    followUps: ["Tell me about a time you reduced cloud cost"],
  },
  {
    id: "story/debugging-cicd-failures",
    title: "Debugging CI/CD Failures",
    category: "story",
    kind: "story",
    tags: ["ci/cd", "devops", "troubleshooting"],
    technologies: ["concourse", "terraform", "docker", "bitbucket pipelines"],
    projects: ["experience/media-entertainment-devops", "project/automated-intelligence-pipeline"],
    skills: ["deployment troubleshooting", "ci/cd"],
    topics: ["environment synchronization", "pipeline standardization"],
    difficulty: ["intermediate"],
    relatedDocuments: ["experience/media-entertainment-devops", "technology/terraform"],
    summary:
      "Across media/entertainment and intelligence pipeline work, I have spent significant time debugging CI/CD failures — often tracing environment drift, pipeline config mismatches, and infrastructure state issues rather than application logic alone.",
    summaryPoints: [
      "Failed deployments often trace to environment sync, not bad code.",
      "Standardized YAML pipelines reduce one-off failure modes.",
    ],
    whatHappened: [
      "TODO: Add the specific incident — deployment failure root cause.",
    ],
    actions: [
      "Troubleshot Concourse/Bitbucket pipeline failures and Terraform apply issues.",
      "Worked with platform teams to align environment configuration.",
    ],
    lessonsLearned: [
      "Reproducible IaC and pipeline templates reduce mean time to diagnose.",
    ],
    whatIDoDifferently: [
      "Add automated environment diff checks before promotion.",
    ],
    followUps: ["How do you troubleshoot a broken deployment?"],
  },
  {
    id: "story/working-with-data-scientists",
    title: "Working With Data Scientists",
    category: "story",
    kind: "story",
    tags: ["collaboration", "mlops", "integration"],
    technologies: ["mlflow", "s3", "lambda"],
    projects: ["project/brain-mvp", "project/automated-intelligence-pipeline"],
    skills: ["cross-functional collaboration"],
    topics: ["ml integration", "production handoffs"],
    difficulty: ["intermediate"],
    relatedDocuments: ["philosophy/engineering", "story/productionizing-ml-pipelines"],
    summary:
      "I collaborate with Data Scientists by owning the production contract — schedules, data paths, inference integration, monitoring — while they own model development and quality.",
    summaryPoints: [
      "Clear lanes: DS builds models; engineering builds dependable paths to production.",
      "Never claim model authorship I do not have.",
    ],
    whatHappened: [
      "Intelligence pipeline: integrated DS classifier into crawl/process/report flow.",
      "Brain MVP+: connected persona models to allocation and serving architecture.",
    ],
    actions: [
      "Defined handoff points between processed features/articles and inference.",
      "Built deployment, containerization, and API layers around model outputs.",
    ],
    lessonsLearned: [
      "Early agreement on schemas, SLAs, and failure modes prevents production surprises.",
    ],
    whatIDoDifferently: [
      "Involve DS in staging validation criteria before first production promotion.",
    ],
    followUps: ["How do you work with Data Scientists?"],
  },
  {
    id: "story/incremental-ingestion-design",
    title: "Designing Incremental Ingestion",
    category: "story",
    kind: "story",
    tags: ["ingestion", "etl", "datalake"],
    technologies: ["dms", "aws glue", "s3", "eventbridge", "step functions"],
    projects: ["project/amc-datalake"],
    skills: ["data engineering", "etl design"],
    topics: ["incremental processing", "migration"],
    difficulty: ["intermediate"],
    relatedDocuments: ["project/amc-datalake", "technology/glue"],
    summary:
      "In data lake modernization work I favor incremental ingestion and layered processing over repeated full reloads — DMS, orchestration, and Glue jobs support repeatable, operable pipelines.",
    summaryPoints: [
      "Full reloads do not scale operationally or economically.",
      "Incremental design requires idempotency and validation discipline.",
    ],
    whatHappened: [
      "Legacy sources required ongoing ingestion, not one-time migration only.",
      "Orchestration (EventBridge, Step Functions) and Glue replaced fragile manual runs.",
    ],
    actions: [
      "Contributed to ingestion and validation design alongside ETL modernization.",
      "TODO: Add specific incremental pattern detail if verified for publication.",
    ],
    lessonsLearned: [
      "Incremental pipelines pay off in trust and cost — but only with clear watermarking and recovery paths.",
    ],
    whatIDoDifferently: [
      "TODO: Add architecture decision on CDC vs batch incremental if safe to describe.",
    ],
    followUps: ["How do you design incremental ingestion?"],
  },
];
