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

  heroFlow: ["User signals", "Eligibility", "Classification", "Allocation", "Recommendation"],

  productGap: {
    statement: [
      "Users were signing up for a tier,",
      "but not discovering the products",
      "already available to them.",
    ],
    ladder: ["User", "Paid tier", "Available product stack", "Lower-than-expected adoption"],
    causes: [
      "Users may not have been interested in the additional products.",
      "The existing registration funnel emphasized Invest.",
      "The registration flow was exhaustive.",
      "Users may not have understood the benefits of the broader product stack.",
    ],
  },

  decisioning: {
    statement: ["The solution wasn't another funnel.", "It was a decisioning layer."],
    flow: ["User signals", "Eligibility", "Classification", "Allocation logic", "Product recommendations"],
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
      },
      {
        label: "ML + data infrastructure",
        items: ["Amazon S3", "Databricks / Delta", "MLflow", "Amazon ECR", "EC2"],
      },
    ],
    detailImageAlt: "Production architecture diagram.",
  },

  decisions: [
    {
      title: "Model serving",
      body: "Classification models provided the predictive signal used by the allocation system.",
    },
    {
      title: "Decoupled processing",
      body: "Allocation processing could run independently from the user-facing experience.",
    },
    {
      title: "Separation of concerns",
      body: "Prediction, allocation logic, processing, API serving, and data infrastructure were separated into understandable system components.",
    },
    {
      title: "Production pipeline",
      body: "The workflow covered the path from model development and tracking through containerization, deployment, and serving.",
    },
  ],

  systemView: {
    flow: ["Signals", "Model", "Decision", "Action", "Feedback"],
    line: "The model doesn't own the decision. It supplies the signal that the system uses to make one.",
  },

  conclusion: {
    eyebrow: "The takeaway",
    line1: ["A model creates predictions.", "A production system turns them into decisions."],
    line2: "The engineering challenge was connecting the two.",
    supporting:
      "From classification and model infrastructure to allocation logic and user-facing recommendations.",
  },

  takeaway:
    "A model creates predictions; a production system turns them into decisions. The engineering challenge was connecting classification, model infrastructure, allocation logic, and user-facing recommendations into one coherent system.",
};
