import { getExperienceYearsLabel } from "@/lib/career/experience";

const experienceYears = getExperienceYearsLabel();

export const resumeKnowledge = {
  id: "resume/profile",
  title: "Resume and Career",
  category: "resume",
  kind: "resume",
  tags: ["resume", "profile", "timeline", "career", "mansi dhruv"],
  technologies: [
    "aws",
    "databricks",
    "spark",
    "pyspark",
    "terraform",
    "sql",
    "kafka",
    "airflow",
    "mlflow",
  ],
  projects: [
    "project/amc-datalake",
    "project/olap-workload-architecture",
    "project/brain-mvp",
    "project/automated-intelligence-pipeline",
    "experience/fintech-ml-platform",
    "experience/media-entertainment-devops",
  ],
  skills: [
    "data engineering",
    "data architecture",
    "etl",
    "elt",
    "cloud data warehousing",
    "distributed processing",
    "infrastructure as code",
    "ci/cd",
    "streaming",
    "mlops",
    "production engineering",
    "technical leadership",
  ],
  topics: ["career", "leadership", "mentoring", "professional profile"],
  difficulty: ["intermediate"],
  relatedDocuments: ["philosophy/engineering", "leadership/mentoring"],
  summary: `I am Mansi Dhruv, Lead Data Engineer with ${experienceYears} years of professional experience in data engineering, cloud data platforms, ETL/ELT, data architecture, production pipelines, and ML pipeline integration.`,
  profile: {
    name: "Mansi Dhruv",
    title: "Lead Data Engineer",
    experienceYears,
    focus: [
      "Data Engineering",
      "Data Architecture",
      "AWS cloud data platforms",
      "ETL / ELT",
      "Distributed processing (Databricks, Spark, PySpark, Scala)",
      "Infrastructure as Code and CI/CD",
      "Streaming and batch pipelines",
      "MLOps and ML pipeline integration",
      "Production engineering and technical leadership",
    ],
  },
  roles: [
    {
      year: "2025",
      title: "Lead Data Engineer",
      summary:
        "I lead a cross-functional data team, own architecture decisions, and mentor engineers across delivery and design.",
    },
    {
      year: "2023",
      title: "Senior Data Engineer",
      summary:
        "I drove end-to-end data initiatives, collaborating with product and analytics while guiding junior engineers.",
    },
    {
      year: "2021",
      title: "Data Engineer",
      summary:
        "I built scalable pipelines using Databricks, PySpark, and cloud data platforms.",
    },
    {
      year: "2019",
      title: "Software Engineer",
      summary:
        "I developed web and backend systems with a focus on high-reliability payment gateway integrations.",
    },
    {
      year: "2018",
      title: "Intern",
      summary:
        "I built iOS and web applications, gaining hands-on experience in production systems.",
    },
  ],
  credentials: [
    "AWS Certified Cloud Practitioner",
    "SQL for Data Analysis and Data Science",
    "Big Data Analytics using Spark",
    "Building Your First ETL Pipeline Using Azure Databricks",
  ],
  awards: [
    "Value-able Award",
    "GEM Award (resume/credentials — exceptional business value)",
    "Merit Based Scholarship",
    "Special mention - Innovative Project",
    "Student Scholarship - Grace Hopper Celebrations India",
  ],
  leadership: [
    "I care about delivery quality, mentoring, and making trade-offs explicit.",
    "I explain technical decisions in business and operational terms.",
    "I prefer systems that reduce future support cost over one-off heroics.",
    "I collaborate with Data Scientists on production paths without claiming model authorship I do not have.",
  ],
  portfolioProjects: [
    "Legacy Data Modernization & ETL — confidential asset-management client",
    "OLAP → Workload-Specific Data Architecture — confidential financial services client",
    "Productionizing an ML-Driven Allocation Engine — confidential fintech engagement",
    "Automated Web Intelligence Pipeline — confidential client engagement",
  ],
  followUps: [
    "Walk through my career timeline",
    "Summarize the projects that shaped my trajectory",
    "How do I describe my leadership style?",
  ],
};
