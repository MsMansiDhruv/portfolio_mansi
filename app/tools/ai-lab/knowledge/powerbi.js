export const powerBiKnowledge = {
  id: "technology/power-bi",
  title: "Power BI",
  category: "technology",
  kind: "technology",
  tags: ["power bi", "bi", "semantic layer", "reporting"],
  technologies: ["sql", "azure"],
  projects: ["project/amc-datalake"],
  relatedDocuments: ["project/amc-datalake"],
  topics: ["business intelligence", "semantic modeling"],
  summary: "I use Power BI when the business needs a governed semantic layer and self-service reporting that sits cleanly on top of the data platform.",
  businessContext: "The reporting layer is where platform decisions become visible to the business, so semantics and trust matter more than dashboard polish.",
  problemStatement: "The hard part is keeping the model understandable and governed while still making it flexible enough for analysts and business users.",
  whyIChooseIt: [
    "I choose it when the team is already Microsoft-oriented and needs a mature BI surface quickly.",
    "I choose it when semantic modeling and governance are more important than flashy front-end customization."
  ],
  alternatives: ["Tableau", "Looker", "Custom dashboards"],
  pros: [
    "Strong enterprise reporting fit",
    "Good semantic modeling story",
    "Fits Microsoft-heavy environments"
  ],
  cons: [
    "Model design still matters a lot",
    "Poor semantic boundaries create confusing reports",
    "It can hide platform issues if the upstream layer is weak"
  ],
  whenIUseIt: [
    "I use it for governed analytics delivery.",
    "I use it when self-service reporting needs a managed semantic layer."
  ],
  whenIAvoidIt: [
    "I avoid it when the reporting layer would just become another place to duplicate business logic."
  ],
  scalingConsiderations: [
    "Semantic models need ownership as report volume grows.",
    "Performance depends on upstream modeling quality and query shape."
  ],
  operationalConsiderations: [
    "I keep access control and model ownership visible.",
    "I avoid letting every report become a special case."
  ],
  relatedTechnologies: ["SQL", "Azure"],
  relatedProjects: ["Legacy Data Modernization & ETL"],
  followUps: [
    "Explain why I would choose Power BI over Tableau",
    "Show the semantic modeling trade-offs",
    "Describe how I keep reports governed at scale"
  ]
};
