/** ML allocation engine — confidential fintech engagement. No client or internal resource names. */

export const BRAIN_CASE_STUDY_SLUG = "brain-mvp";

export const BRAIN_ARCH_PRODUCTION_IMAGE = "/projects/brain/architecture.jpg";

export const BRAIN_CASE_STUDY = {
  slug: BRAIN_CASE_STUDY_SLUG,

  eyebrow: "Machine Learning · Data Engineering · AWS",
  titleLine1: "Productionizing an",
  titleLine2: "ML-Driven Allocation Engine",
  subtitle:
    "An end-to-end ML system that translated user eligibility and behavioral signals into personalized product allocation recommendations.",
  engagementLabel: "Confidential fintech engagement",
  heroThesis: "ML model → decisioning system → user recommendation",

  heroFlow: ["User signals", "Eligibility", "Classification", "Allocation", "Recommendation"],

  productGap: {
    statement: [
      "Users signed up for paid tiers",
      "but did not adopt the broader",
      "product stack available to them.",
    ],
    ladder: ["Paid tier", "Available product stack", "Actual product adoption"],
    annotations: [
      "Funnel emphasized Invest",
      "Registration flow was exhaustive",
      "Additional products weren't obvious",
      "Users may not have understood the value",
    ],
  },

  decisioning: {
    statement: ["The solution wasn't another funnel.", "It was a decisioning layer."],
    before: ["User", "Funnel", "Product"],
    after: ["User signals", "Eligibility", "Classification", "Allocation logic", "Product recommendation"],
  },

  mlApproach:
    "Classification models were developed for different user personas and used as part of the allocation logic.",

  modelToProduction: {
    headline: ["The model was only one part", "of the system."],
    body:
      "Classification models were generated for different personas and incorporated into allocation logic. The project required an end-to-end deployment pipeline to take the ML workflow into a production-serving architecture.",
    pipeline: [
      { stage: "Data", tech: ["S3", "Databricks"] },
      { stage: "Model development", tech: [] },
      { stage: "Model tracking", tech: ["MLflow"] },
      { stage: "Containerization", tech: ["Amazon ECR"] },
      { stage: "Deployment", tech: ["EC2"] },
      { stage: "Serving", tech: ["GraphQL"] },
    ],
  },

  productionArch: {
    headline: ["From model output", "to a production decision."],
    layers: [
      {
        label: "User experience",
        items: ["Mobile / Web App", "GraphQL API"],
      },
      {
        label: "Decisioning",
        items: ["Allocation API", "Prediction / Processing", "Allocation logic"],
        primary: true,
      },
      {
        label: "ML + data infrastructure",
        items: ["Amazon S3", "Databricks / Delta", "MLflow", "Amazon ECR", "EC2"],
        stack: true,
      },
    ],
    requestPath: [
      "User",
      "GraphQL",
      "Allocation API",
      "Prediction",
      "Allocation logic",
      "Recommendation",
      "User",
    ],
    detailImageAlt: "Production architecture diagram.",
  },

  decisions: [
    {
      num: "01",
      title: "Model serving",
      body: "Classification models provide the predictive signal.",
    },
    {
      num: "02",
      title: "Decoupled processing",
      body: "Allocation processing can operate independently from the user-facing experience.",
    },
    {
      num: "03",
      title: "Separation of concerns",
      body: "Prediction, allocation logic, processing, API serving, and infrastructure remain distinct components.",
    },
    {
      num: "04",
      title: "Production pipeline",
      body: "Model development → tracking → containerization → deployment → serving.",
    },
  ],

  systemView: {
    flow: ["Signals", "Model", "Decision", "Action", "Feedback"],
    line: "The model doesn't own the decision. It supplies the signal that the system uses to make one.",
  },

  conclusion: {
    eyebrow: "The takeaway",
    pre: "A model creates a prediction.",
    headline: "A production system turns it into a decision.",
    supporting:
      "The engineering challenge was connecting classification, model infrastructure, allocation logic, and user-facing recommendations into one coherent system.",
  },

  takeaway:
    "A model creates predictions; a production system turns them into decisions. The engineering challenge was connecting classification, model infrastructure, allocation logic, and user-facing recommendations into one coherent system.",
};
