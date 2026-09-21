/** Public stills + homepage taste for featured systems — no client screenshots. */
export const WORK_ART = {
  "project-amc-datalake-solution": {
    art: "/work/lakehouse.png",
    artAlt: "Layered lakehouse: raw landing, cleaned zone, served marts",
    kicker: "Legacy modernization",
    metrics: [],
    taste: {
      title: "Legacy Data Modernization",
      stack: ["AWS Glue", "S3", "Redshift"],
      arc: "Modernized shell-script ETL into a layered AWS data platform.",
      lenses: ["Architecture", "Migration", "Analytics"],
    },
  },
  "brain-mvp": {
    art: "/work/allocation.png",
    artAlt: "Signals into a model cube, then a clean allocation path",
    kicker: "ML & analytics",
    metrics: [
      { value: "~40%", label: "faster pipeline", icon: "timer" },
      { value: "~30%", label: "infra cost", icon: "coins" },
    ],
    taste: {
      title: "ML Allocation Engine",
      stack: ["Databricks", "MLflow", "GraphQL"],
      arc: "Built the pipeline that served production allocation—not another funnel.",
      lenses: ["Architecture", "ML", "Production"],
    },
  },
  "automated-intelligence-pipeline": {
    art: "/work/pipeline.png",
    artAlt: "Scattered sources funnel into a governed archive",
    kicker: "Web data",
    metrics: [],
    taste: {
      title: "Web Intelligence Pipeline",
      stack: ["Python", "Lambda", "S3"],
      arc: "Automated extract, classify, and report from scattered web sources.",
      lenses: ["Pipelines", "Automation", "AWS"],
    },
  },
  "olap-workload-architecture": {
    art: "/work/split.png",
    artAlt: "Lookups split from analytics across two engines",
    kicker: "Analytics architecture",
    metrics: [],
    taste: {
      title: "OLAP / Workload Architecture",
      stack: ["Redshift", "Aurora", "S3 Tables"],
      arc: "Split serving lookups from analytics so each workload has its own engine.",
      lenses: ["Architecture", "Benchmarks", "Cost"],
    },
  },
};

export function getWorkArt(slug) {
  return WORK_ART[slug] || null;
}
