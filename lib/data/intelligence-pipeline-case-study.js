/** Automated intelligence pipeline — anonymous client. No company names. DS owns the classifier. */

export const INTELLIGENCE_PIPELINE_SLUG = "automated-intelligence-pipeline";

export const INTELLIGENCE_ARCH_IMAGE = "/projects/intelligence/architecture.png";

export const INTELLIGENCE_CASE_STUDY = {
  slug: INTELLIGENCE_PIPELINE_SLUG,

  eyebrow: "Data Engineering · Automation · AWS",
  title: "Turning scattered web sources into an automated intelligence pipeline.",
  subtitle:
    "An automated data pipeline for discovering, extracting, processing and surfacing business-relevant company announcements.",
  engagementLabel: "Confidential client engagement",
  heroThesis: "Discover → extract → process → integrate → report",

  /** Short hero rail — full stages live in the pipeline section */
  heroFlow: ["Discover", "Extract & process", "Integrate", "Report"],

  problem: {
    headline: ["Relevant information was everywhere.", "The process wasn't."],
    body:
      "Company announcements were distributed across different newsroom structures and feeds. Manually monitoring sources, extracting useful information, identifying duplicates, and getting relevant content to stakeholders did not scale.",
    fragments: ["RSS", "Company newsroom", "Dynamic webpage", "Site-specific source"],
    friction: ["Different structures", "Different extraction logic", "Duplicate content", "Manual monitoring"],
  },

  engineeringChallenge: {
    headline: ["The model wasn't the hard part.", "Making the system reliable was."],
    body:
      "The classification model was developed by the Data Science team. The engineering challenge was building the production pipeline around it — from source discovery and extraction through inference, persistence, and reporting.",
  },

  pipeline: [
    { stage: "Source discovery", detail: "RSS / Crawlers", lane: "engineering" },
    { stage: "Extraction", detail: "Scrapy / Selenium", lane: "engineering" },
    { stage: "Processing", detail: "Normalize / Deduplicate", lane: "engineering" },
    { stage: "Storage", detail: "AWS S3", lane: "engineering" },
    { stage: "Model inference", detail: "DS-owned classifier", lane: "datascience" },
    { stage: "Reporting", detail: "Relevant intelligence", lane: "engineering" },
  ],

  sourceDiscovery: {
    headline: "Different sources required different extraction strategies.",
    approaches: [
      { title: "RSS", body: "For structured feeds" },
      { title: "Generic crawler", body: "For standard newsroom pages" },
      { title: "Site-specific extraction", body: "For sources requiring custom handling" },
    ],
  },

  extraction: {
    headline: "Raw pages became structured, deduplicated data.",
    body: "Extraction logic had to accommodate differences in source structures — the same downstream pipeline had to consume heterogeneous inputs.",
    flow: ["Web page", "Article content", "Normalized record", "Deduplicated dataset"],
  },

  modelIntegration: {
    eyebrow: "Data Science integration",
    headline: ["I didn't build the model.", "I built the path to production."],
    body: "Processed articles passed through inference automatically; classification results fed reporting and downstream consumers.",
    flow: ["Processed article", "Model inference", "Classification result", "Relevant content"],
  },

  aws: {
    headline: "Designed to run automatically, not manually.",
    body: "Infrastructure supported scheduled processing, repeatable deployments, and operational monitoring — not manual runs or one-off scripts.",
    services: [
      { label: "Amazon S3", role: "Persistence" },
      { label: "AWS Lambda", role: "Serverless processing" },
      { label: "EC2", role: "Crawler / batch workloads" },
      { label: "Terraform", role: "Infrastructure as code" },
      { label: "Bitbucket Pipelines", role: "CI/CD" },
    ],
  },

  operations: {
    headline: "From scheduled jobs to observable pipelines.",
    scheduleFlow: ["Schedule", "Discover", "Process", "Classify", "Report"],
    opsLayer: ["CI/CD", "Monitoring", "Alerting", "Failure handling"],
  },

  output: {
    headline: ["The output wasn't more data.", "It was less noise."],
    funnel: ["Many sources", "Many articles", "Automated processing", "Relevant articles", "Actionable reports"],
    body: "Stakeholders received filtered, relevant announcements — not another inbox of raw crawls.",
  },

  /** Compact scope summary — narrative sections carry the detail */
  contributions: [
    { label: "Discovery & extraction", detail: "RSS, generic, and site-specific crawlers" },
    { label: "Processing & storage", detail: "Normalize, deduplicate, persist on AWS" },
    { label: "Integration & operations", detail: "Model inference hookup, CI/CD, monitoring, reports" },
  ],

  conclusion: {
    eyebrow: "The takeaway",
    line1: "Good data engineering doesn't stop at collecting data.",
    headline: "It turns unreliable, fragmented inputs into a system people can depend on.",
    supporting: "The work was making every stage run on a schedule — and fail visibly when it didn't.",
  },
};
