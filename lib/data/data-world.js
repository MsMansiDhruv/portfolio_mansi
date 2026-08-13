/** World of Data — single engine config from real portfolio technologies only */

import { TOOLKIT } from "./toolkit";
import { EXHIBITION_ORDER } from "./work-exhibition";
import { getProjectMeta } from "./project-meta";

const STACK_BLOB = [
  JSON.stringify(TOOLKIT),
  "lambda",
  "ec2",
  "mlflow",
  "iceberg",
  "azure",
  "glue",
].join(" ").toLowerCase();

function inStack(id, label) {
  return (
    STACK_BLOB.includes(id) ||
    STACK_BLOB.includes(String(label).toLowerCase())
  );
}

export const WORLD_HERO = {
  name: "MANSI",
  role: "DATA ENGINEER",
  roleLine: "BUILDER / EXPLORER",
  line: "I build reliable data platforms that turn complex systems into something teams can actually operate.",
};

/** Continuous machine navigation — same world, different system states */
export const WORLD_NAV = [
  { id: "world", label: "WORLD" },
  { id: "work", label: "WORK" },
  { id: "ai", label: "AI LAB" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "about", label: "ABOUT" },
  { id: "contact", label: "CONTACT" },
];

/** Domain orbits — infrastructure skeleton */
export const ORBITS = [
  { id: "cloud", label: "CLOUD", radius: 2.15, tilt: 0.18, speed: 0.018, colorKey: "infra" },
  { id: "platform", label: "DATA PLATFORM", radius: 2.55, tilt: -0.28, speed: -0.012, colorKey: "transform" },
  { id: "analytics", label: "ANALYTICS", radius: 2.95, tilt: 0.42, speed: 0.009, colorKey: "data" },
  { id: "ai", label: "AI", radius: 3.35, tilt: -0.12, speed: 0.007, colorKey: "ai" },
];

/**
 * Nodes on orbits. tier: core | node
 * Only technologies present in portfolio content.
 */
export const TECH_NODES = [
  { id: "aws", label: "AWS", kind: "infra", orbit: "cloud", angle: 0.2, tier: "core" },
  { id: "s3", label: "S3", kind: "data", orbit: "cloud", angle: 1.4, tier: "node" },
  { id: "lambda", label: "Lambda", kind: "transform", orbit: "cloud", angle: 2.6, tier: "node" },
  { id: "ec2", label: "EC2", kind: "infra", orbit: "cloud", angle: 4.0, tier: "node" },
  { id: "azure", label: "Azure", kind: "infra", orbit: "cloud", angle: 5.2, tier: "node" },
  { id: "databricks", label: "Databricks", kind: "transform", orbit: "platform", angle: 0.6, tier: "core" },
  { id: "spark", label: "PySpark", kind: "transform", orbit: "platform", angle: 2.1, tier: "node" },
  { id: "python", label: "Python", kind: "transform", orbit: "platform", angle: 3.5, tier: "node" },
  { id: "sql", label: "SQL", kind: "data", orbit: "platform", angle: 4.8, tier: "node" },
  { id: "iceberg", label: "Iceberg", kind: "data", orbit: "platform", angle: 5.9, tier: "node" },
  { id: "redshift", label: "Redshift", kind: "data", orbit: "analytics", angle: 0.9, tier: "core" },
  { id: "powerbi", label: "Power BI", kind: "data", orbit: "analytics", angle: 3.2, tier: "node" },
  { id: "terraform", label: "Terraform", kind: "infra", orbit: "analytics", angle: 4.9, tier: "node" },
  { id: "mlflow", label: "MLflow", kind: "ai", orbit: "ai", angle: 1.1, tier: "node" },
  { id: "docker", label: "Docker", kind: "infra", orbit: "ai", angle: 2.8, tier: "node" },
  { id: "ailab", label: "AI Lab", kind: "ai", orbit: "ai", angle: 4.6, tier: "core" },
].filter((n) => {
  if (n.id === "powerbi") return STACK_BLOB.includes("power bi") || STACK_BLOB.includes("powerbi");
  if (n.id === "ailab") return STACK_BLOB.includes("applied ai") || STACK_BLOB.includes("ai lab");
  return inStack(n.id, n.label);
});

export const TECH_LINKS = [
  ["aws", "s3"],
  ["aws", "lambda"],
  ["aws", "ec2"],
  ["aws", "redshift"],
  ["s3", "databricks"],
  ["databricks", "spark"],
  ["spark", "python"],
  ["spark", "sql"],
  ["databricks", "iceberg"],
  ["databricks", "mlflow"],
  ["redshift", "powerbi"],
  ["terraform", "aws"],
  ["docker", "ec2"],
  ["lambda", "python"],
  ["mlflow", "ailab"],
  ["azure", "databricks"],
].filter(([a, b]) => {
  const ids = new Set(TECH_NODES.map((n) => n.id));
  return ids.has(a) && ids.has(b);
});

export const INFRA_WAKE = {
  aws: "cloud",
  s3: "cloud",
  lambda: "cloud",
  ec2: "cloud",
  azure: "cloud",
  terraform: "cloud",
  docker: "cloud",
  databricks: "platform",
  spark: "platform",
  python: "platform",
  sql: "platform",
  iceberg: "platform",
  redshift: "storage",
  powerbi: "analytics",
  mlflow: "ai",
  ailab: "ai",
};

/**
 * Opening story — enter a machine already running.
 * silence → stream → nodes → orbit → identity → explore
 */
export const STORY = {
  silence: { at: 0, label: "SYSTEM / IDLE" },
  emergence: { at: 2.0, label: "FLOW / ACTIVE" },
  connection: { at: 4.2, label: "NODES / ONLINE" },
  reveal: { at: 6.4, label: "ORBIT / REVEAL" },
  identity: { at: 8.4, label: "IDENTITY" },
  explore: { at: 10.2, label: "EXPLORE" },
};

/**
 * Semantic particle palette — not decorative rainbow.
 * BLUE data · TEAL transform · VIOLET-BLUE AI · AMBER signal · STEEL architecture
 */
export const PARTICLE_SPECTRUM = [
  "#6a9fd4",
  "#5a92c8",
  "#4a9eb0",
  "#3db8a8",
  "#6b8fc8",
  "#6b7fd7",
  "#8a9bb0",
  "#9ab0c4",
  "#c9a15a",
  "#7a8fa8",
];

/** Work clusters — four primary exhibits, visual metaphors for architecture stories */
export const WORK_METAPHOR = {
  "project-amc-datalake-solution": {
    id: "modernization",
    code: "01",
    story: "CHAOS → MODERNIZATION → CLARITY",
    topology: "tangle",
  },
  "brain-mvp": {
    id: "allocation",
    code: "02",
    story: "INPUT → DECISION → ALLOCATION",
    topology: "hub",
  },
  "automated-intelligence-pipeline": {
    id: "intelligence",
    code: "03",
    story: "MANY SOURCES → INTELLIGENCE",
    topology: "fan",
  },
  "olap-workload-architecture": {
    id: "olap",
    code: "04",
    story: "ONE SYSTEM → SEPARATION → SPECIALIZED",
    topology: "split",
  },
};

export function getWorkClusters() {
  return EXHIBITION_ORDER.map((slug, i) => {
    const meta = getProjectMeta(slug);
    const metaphor = WORK_METAPHOR[slug] || {
      id: slug,
      code: String(i + 1).padStart(2, "0"),
      story: "",
      topology: "hub",
    };
    return {
      slug,
      index: i,
      code: metaphor.code,
      metaphorId: metaphor.id,
      topology: metaphor.topology,
      story: metaphor.story,
      title: meta?.title || slug,
      cardTitle: meta?.cardTitle || meta?.title || slug,
      problem: meta?.problem || "",
      purpose: meta?.purpose || meta?.summary || "",
      tech: meta?.tech || [],
      decisions: meta?.decisions || [],
      outcomes: meta?.outcomes || [],
      // Cluster home on sphere → unfolds outward in WORK
      homeAngle: (i / 4) * Math.PI * 2 + 0.4,
      homeRadius: 1.85,
      unfold: [
        [(-1.8 + (i % 2) * 3.6) * 0.55, 0.55 - Math.floor(i / 2) * 1.35, 0.4],
        [(-1.8 + (i % 2) * 3.6), 0.35 - Math.floor(i / 2) * 1.55, 0.15],
      ][0],
    };
  });
}

/** Layer cameras — same world, different system states */
export const LAYER_CAM = {
  world: {
    position: [0.35, 0.12, 11.0],
    lookAt: [2.55, 0.3, 0],
    fov: 34,
  },
  work: {
    position: [0.15, 0.35, 9.0],
    lookAt: [2.15, 0.05, 0],
    fov: 36,
  },
  pipeline: {
    position: [2.45, 0.35, 5.4],
    lookAt: [2.45, 0.15, 0],
    fov: 38,
  },
  ai: {
    position: [0.5, 0.4, 8.6],
    lookAt: [2.3, 0.2, 0],
    fov: 36,
  },
  experience: {
    position: [0.3, 0.2, 9.4],
    lookAt: [2.4, 0.05, 0],
    fov: 35,
  },
  about: {
    position: [0.6, 0.25, 9.8],
    lookAt: [2.3, 0.15, 0],
    fov: 34,
  },
  contact: {
    position: [0.4, 0.2, 9.2],
    lookAt: [2.4, 0.1, 0],
    fov: 34,
  },
};

export const THEME = {
  night: {
    id: "night",
    bg: "#0a1018",
    fog: "#0e1622",
    fogNear: 14,
    fogFar: 38,
    ink: "#f2f6fa",
    muted: "rgba(210, 222, 236, 0.9)",
    faint: "rgba(168, 188, 212, 0.62)",
    line: "rgba(120, 150, 180, 0.2)",
    surface: "#121a28",
    globe: "#121c2a",
    globeEmissive: "#080e16",
    steel: "#9eb2c8",
    data: "#5a9ae8",
    transform: "#3db8a8",
    infra: "#8a9bb0",
    ai: "#6b7fd7",
    accent: "#d4a05a",
    ambient: 0.36,
    key: 0.98,
    rim: 0.5,
    exposure: 1.06,
  },
  day: {
    // Cool architectural light — not warm beige
    id: "day",
    bg: "#f4f6f8",
    fog: "#e8ecf0",
    fogNear: 16,
    fogFar: 42,
    ink: "#14181e",
    muted: "rgba(28, 34, 44, 0.78)",
    faint: "rgba(60, 72, 88, 0.55)",
    line: "rgba(50, 64, 84, 0.16)",
    surface: "#ffffff",
    globe: "#e2e6ec",
    globeEmissive: "#d8dde4",
    steel: "#5a6a80",
    data: "#2f74c8",
    transform: "#1f9a8c",
    infra: "#5c6e86",
    ai: "#4f62b8",
    accent: "#b8862e",
    ambient: 0.78,
    key: 0.88,
    rim: 0.28,
    exposure: 1.04,
  },
};

/** @deprecated use PARTICLE_SPECTRUM */
export const DAY_PARTICLE_COLORS = PARTICLE_SPECTRUM;

export function semanticColor(kind, themeId) {
  const t = THEME[themeId] || THEME.night;
  if (kind === "data") return t.data;
  if (kind === "transform") return t.transform;
  if (kind === "infra" || kind === "cloud") return t.infra;
  if (kind === "ai") return t.ai;
  if (kind === "accent" || kind === "bi" || kind === "signal") return t.accent;
  return t.steel;
}

export function kindColor(kind, theme) {
  return semanticColor(kind, theme);
}

export function latLonToVec(lat, lon, r = 1) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

export function orbitPosition(orbitId, angle, yBias = 0) {
  const orbit = ORBITS.find((o) => o.id === orbitId) || ORBITS[0];
  const c = Math.cos(orbit.tilt);
  const s = Math.sin(orbit.tilt);
  const x = Math.cos(angle) * orbit.radius;
  const z = Math.sin(angle) * orbit.radius;
  const y = z * s + yBias;
  const zz = z * c;
  return [x, y, zz];
}
