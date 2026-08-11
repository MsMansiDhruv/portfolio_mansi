export const terraformKnowledge = {
  id: "technology/terraform",
  title: "Terraform",
  category: "technology",
  kind: "technology",
  tags: ["terraform", "iac", "automation", "infrastructure"],
  technologies: ["aws", "azure"],
  projects: ["project/amc-datalake", "project/automated-intelligence-pipeline", "experience/media-entertainment-devops", "experience/enterprise-data-extraction"],
  topics: ["infrastructure as code", "automation", "governance"],
  summary: "I use Terraform to make the platform reproducible, reviewable, and less dependent on manual setup work.",
  businessContext: "Infrastructure that cannot be recreated reliably becomes a delivery and support risk as soon as the team or environment grows.",
  problemStatement: "The real problem is drift: if the platform is created by hand, the team eventually spends time debugging environment differences instead of delivering value.",
  whyIChooseIt: [
    "I choose it when I want infrastructure to be versioned and reviewed like application code.",
    "I choose it when repeatability matters more than one-off convenience."
  ],
  alternatives: ["Cloud consoles", "Custom scripts", "Other IaC tools"],
  pros: [
    "Versioned and reviewable",
    "Reproducible across environments",
    "Good fit for change control"
  ],
  cons: [
    "State management needs discipline",
    "It can become noisy if modules are not designed well",
    "It adds a learning curve for smaller teams"
  ],
  whenIUseIt: [
    "I use it for environment provisioning, permissions, and platform scaffolding.",
    "I use it when the environment needs to be recreated safely and consistently."
  ],
  whenIAvoidIt: [
    "I avoid overly clever module structures that make the platform harder to understand than the infrastructure it manages."
  ],
  scalingConsiderations: [
    "Module boundaries and state ownership matter more as the platform grows.",
    "CI/CD around plan and apply becomes part of the operating model."
  ],
  operationalConsiderations: [
    "I keep drift detection and approvals visible.",
    "I make sure automation has guardrails, not just speed."
  ],
  relatedTechnologies: ["AWS", "Azure", "Databricks"],
  relatedProjects: ["Legacy Data Modernization & ETL", "Automated Web Intelligence Pipeline", "Media & Entertainment CI/CD"],
  followUps: [
    "Show how I would structure modules and state",
    "Explain the governance controls I would put around Terraform",
    "Compare Terraform with manual provisioning"
  ]
};
