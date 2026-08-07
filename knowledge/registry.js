export const KNOWLEDGE_REGISTRY = [
  {
    id: "resume/profile",
    title: "Profile",
    category: "resume",
    tags: ["resume", "profile", "career"],
    technologies: ["python", "sql", "spark", "databricks", "aws", "terraform"],
    projects: ["amc-datalake", "gpu-benchmark", "small-datalake-poc"],
    skills: ["leadership", "architecture", "automation", "governance"],
    topics: ["career", "summary"],
    difficulty: ["basic"],
    relatedDocuments: ["resume/timeline.md", "resume/leadership.md"],
    source: `# Profile

Overview
- Lead data engineer focused on enterprise platforms, automation, and reliable analytics.

Business Context
- Work centers on building systems that make analytics trustworthy and easier to operate.

TODO
- Add a concise personal summary in your own voice.`,
  },
  {
    id: "resume/timeline",
    title: "Career Timeline",
    category: "resume",
    tags: ["resume", "timeline", "career"],
    technologies: ["databricks", "pyspark", "aws", "terraform"],
    projects: ["amc-datalake", "gpu-benchmark"],
    skills: ["leadership", "delivery", "mentorship"],
    topics: ["career", "leadership"],
    difficulty: ["basic"],
    relatedDocuments: ["resume/profile.md", "resume/leadership.md"],
    source: `# Career Timeline

Lead Data Engineer
- Dates: 2025
- Company: TODO
- Responsibilities: Led a cross-functional data team and architecture decisions.
- Achievements: Mentored four engineers and owned delivery standards.`,
  },
  {
    id: "project/amc-datalake",
    title: "AMC - Datalake Solution",
    category: "project",
    tags: ["project", "amc", "datalake", "lakehouse"],
    technologies: ["s3", "iceberg", "pyspark", "terraform", "redshift"],
    projects: ["gpu-benchmark", "small-datalake-poc"],
    skills: ["architecture", "automation", "governance"],
    topics: ["enterprise", "analytics"],
    difficulty: ["advanced"],
    relatedDocuments: ["technologies/databricks.md", "stories/optimization-wins.md"],
    source: `# AMC - Datalake Solution

Business Context
- Built a reusable, cost-efficient cloud-native analytics foundation for an asset management client.

Problem Statement
- Multiple on-prem sources needed to be unified with better reliability, lower cost, and faster analytics access.`,
  },
  {
    id: "technology/powerbi",
    title: "Power BI",
    category: "technology",
    tags: ["powerbi", "bi", "semantic-layer"],
    technologies: ["sql", "azure"],
    projects: [],
    skills: ["bi", "governance"],
    topics: ["business intelligence"],
    difficulty: ["intermediate"],
    relatedDocuments: ["technologies/sql.md"],
    source: `# Power BI

Overview
- Governed BI and semantic modeling platform for enterprise reporting.

Why I use it
- Fits Microsoft-centric enterprise analytics and self-service reporting.`,
  },
  {
    id: "technology/snowflake",
    title: "Snowflake",
    category: "technology",
    tags: ["snowflake", "warehouse"],
    technologies: ["sql"],
    projects: [],
    skills: ["warehouse", "governance"],
    topics: ["cloud warehouse"],
    difficulty: ["intermediate"],
    relatedDocuments: ["technologies/sql.md"],
    source: `# Snowflake

Overview
- Cloud warehouse platform for governed analytics and sharing.`,
  },
];

