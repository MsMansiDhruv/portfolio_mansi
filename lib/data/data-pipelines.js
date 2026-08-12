/** Project-specific data pipeline behaviours — derived from documented metaphors only */

/**
 * Each pipeline describes how particles should behave inside that exhibit.
 * No invented metrics — only structural metaphors from real project docs.
 */
export const PROJECT_PIPELINES = {
  "project-amc-datalake-solution": {
    id: "strata",
    label: "Bronze → Silver → Gold",
    /** Layered refinery: raw feeds clarify through strata; reuse over ad-hoc transforms */
    stages: [
      { id: "bronze", label: "Bronze — ingest & raw", y: 0.9, reject: 0 },
      { id: "silver", label: "Silver — clean & standardize", y: 1.45, reject: 0.18 },
      { id: "gold", label: "Gold — transform & marts", y: 2.05, reject: 0.06 },
    ],
    intake: 3,
    mode: "layers",
  },
  "brain-mvp": {
    id: "spine",
    label: "Signals → allocation",
    /** Predictions become allocation decisions — spine of classification → decision → serve */
    stages: [
      { id: "signals", label: "Signals / classification", y: 1.2, reject: 0 },
      { id: "decision", label: "Allocation decisioning", y: 1.55, reject: 0.12 },
      { id: "serve", label: "Recommendation serving", y: 1.9, reject: 0 },
    ],
    intake: 5,
    mode: "spine",
  },
  "automated-intelligence-pipeline": {
    id: "harvest",
    label: "Discover → report",
    /** Fragmented web inputs harvested, filtered, classified into reportable output */
    stages: [
      { id: "discover", label: "Discover", y: 1.1, reject: 0 },
      { id: "extract", label: "Extract", y: 1.35, reject: 0.1 },
      { id: "process", label: "Process / dedupe", y: 1.6, reject: 0.22 },
      { id: "classify", label: "Classify", y: 1.85, reject: 0.08 },
      { id: "report", label: "Report", y: 2.15, reject: 0 },
    ],
    intake: 6,
    mode: "sieve",
  },
  "olap-workload-architecture": {
    id: "split",
    label: "Serving ∥ Analytics",
    /** One mixed stream separates into workload-specific paths */
    stages: [
      { id: "mixed", label: "Mixed access", y: 1.4, reject: 0 },
      { id: "fork", label: "Workload split", y: 1.55, reject: 0 },
      { id: "serving", label: "Serving — point lookups", y: 1.7, reject: 0, branch: "left" },
      { id: "analytics", label: "Analytics — bulk / aggregation", y: 1.7, reject: 0, branch: "right" },
    ],
    intake: 2,
    mode: "split",
  },
};

export function getPipeline(slug) {
  return PROJECT_PIPELINES[slug] || PROJECT_PIPELINES["project-amc-datalake-solution"];
}
