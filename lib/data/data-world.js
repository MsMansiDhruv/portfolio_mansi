/** World of Data — OS config from real portfolio technologies only */

import { TOOLKIT } from "./toolkit";

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
  role: "DATA ENGINEER · BUILDER · EXPLORER",
  line: "EVERY SYSTEM HAS A STORY.",
};

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
  { id: "spark", label: "Spark", kind: "transform", orbit: "platform", angle: 2.1, tier: "node" },
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

export const STORY = {
  silence: { at: 0, label: "SILENCE" },
  emergence: { at: 2.2, label: "EMERGENCE" },
  connection: { at: 5.4, label: "CONNECTION" },
  explore: { at: 8.6, label: "EXPLORATION" },
};

/**
 * Shared spectrum — same world, different lighting.
 * Day = bright field; Night = deeper void. Geometry & motion stay the same.
 */
export const PARTICLE_SPECTRUM = [
  "#e85a9a",
  "#d45ac8",
  "#c45ad4",
  "#9a6ae8",
  "#7a6ae8",
  "#5a7ae8",
  "#5a9ae8",
  "#6ab0e8",
  "#e8a04a",
  "#e8786a",
];

export const THEME = {
  night: {
    id: "night",
    bg: "#101826",
    fog: "#141e2e",
    fogNear: 12,
    fogFar: 36,
    ink: "#f0f5fa",
    muted: "rgba(210, 226, 242, 0.88)",
    faint: "rgba(170, 196, 222, 0.62)",
    line: "rgba(120, 160, 200, 0.2)",
    surface: "#182436",
    globe: "#1a2838",
    globeEmissive: "#0c1828",
    steel: "#9ab4cc",
    data: "#5a9ae8",
    transform: "#c45ad4",
    infra: "#8a6ae8",
    ai: "#e85a9a",
    accent: "#e8a04a",
    ambient: 0.4,
    key: 1.05,
    rim: 0.55,
    exposure: 1.08,
  },
  day: {
    id: "day",
    bg: "#f2f3f6",
    fog: "#e8eaef",
    fogNear: 14,
    fogFar: 40,
    ink: "#0e1218",
    muted: "rgba(20, 28, 40, 0.74)",
    faint: "rgba(40, 52, 68, 0.52)",
    line: "rgba(40, 56, 80, 0.14)",
    surface: "#ffffff",
    globe: "#e4e7ec",
    globeEmissive: "#d8dce4",
    steel: "#6a7a98",
    data: "#5a9ae8",
    transform: "#c45ad4",
    infra: "#8a6ae8",
    ai: "#e85a9a",
    accent: "#e8a04a",
    ambient: 0.72,
    key: 0.9,
    rim: 0.38,
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
  if (kind === "accent" || kind === "bi") return t.accent;
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
