/**
 * Credentials page content — visual structure + technical map.
 * Factual awards/certs/timeline live in career.js (LinkedIn cross-checked).
 */

export const PROFILE = {
  name: "Mansi Dhruv",
  headline: "Lead Data Engineer · Solution Architect",
  domains: "Data Engineering · Cloud · AI",
  linkedInUrl: "https://www.linkedin.com/in/mansidhruv/",
};

/** Visual career arc — concepts supported by portfolio timeline, not new claims */
export const CAREER_EVOLUTION = [
  { label: "Software Engineering", era: "2019" },
  { label: "Data Engineering", era: "2021" },
  { label: "Cloud & distributed systems", era: "2023" },
  { label: "Lead data engineering", era: "2025" },
  { label: "Architecture & applied AI", era: "now" },
];

/** Technologies from portfolio projects — compact capability map (max 6 groups) */
export const TECHNICAL_PROFILE = {
  "Data engineering": ["Spark", "PySpark", "SQL", "Glue"],
  Cloud: ["AWS", "S3", "Redshift", "Lambda"],
  Compute: ["Databricks"],
  Languages: ["Python", "Scala", "SQL"],
  Databases: ["Redshift", "DynamoDB", "Aurora"],
  "DevOps / ML": ["Terraform", "Docker", "Delta", "MLflow", "Applied AI"],
};
