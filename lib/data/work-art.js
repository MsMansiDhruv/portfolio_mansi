/** Public stills + homepage taste for featured systems — no client screenshots. */
export const WORK_ART = {
  "project-amc-datalake-solution": {
    art: "/work/lakehouse.png",
    artAlt: "Layered lakehouse: raw landing, cleaned zone, served marts",
    kicker: "Legacy modernization",
    metrics: [
      { value: "Multiple", label: "source systems", icon: "layers" },
      { value: "Modern", label: "Glue ETL", icon: "workflow" },
      { value: "Production", label: "in use", icon: "check" },
    ],
    taste: {
      title: "Legacy Modernization",
      stack: ["AWS Glue", "S3", "Redshift"],
      arc: "Legacy shell-script ETL → layered AWS data platform.",
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
      { value: "Production", label: "serving", icon: "check" },
    ],
    taste: {
      title: "ML Allocation Engine",
      stack: ["Databricks", "MLflow", "GraphQL"],
      arc: "Persona classification → production decisioning, not another funnel.",
      lenses: ["Architecture", "ML", "Production"],
    },
  },
  "automated-intelligence-pipeline": {
    art: "/work/pipeline.png",
    artAlt: "Scattered sources funnel into a governed archive",
    kicker: "Web data",
    metrics: [
      { value: "Automated", label: "extraction", icon: "bot" },
      { value: "DS model", label: "in the path", icon: "cpu" },
      { value: "Production", label: "pipeline", icon: "check" },
    ],
    taste: {
      title: "Web Intelligence Pipeline",
      stack: ["Python", "Lambda", "S3"],
      arc: "Scattered web sources → extract, classify, report on a schedule.",
      lenses: ["Pipelines", "Automation", "AWS"],
    },
  },
  "olap-workload-architecture": {
    art: "/work/split.png",
    artAlt: "Lookups split from analytics across two engines",
    kicker: "Analytics architecture",
    metrics: [
      { value: "Workload", label: "specific split", icon: "git" },
      { value: "Cost-aware", label: "architecture", icon: "coins" },
      { value: "Production", label: "migration", icon: "check" },
    ],
    taste: {
      title: "OLAP / Workload Architecture",
      stack: ["Redshift", "Aurora", "S3 Tables"],
      arc: "One warehouse for two jobs → serving split from analytics.",
      lenses: ["Architecture", "Benchmarks", "Cost"],
    },
  },
};

export function getWorkArt(slug) {
  return WORK_ART[slug] || null;
}
