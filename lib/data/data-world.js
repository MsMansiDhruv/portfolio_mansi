/** World of Data — config from real portfolio content only */

import { FEATURED_PROJECT_SLUG, getProjectMeta } from "./project-meta";
import { IDENTITY_HERO } from "./identity";
import { TOOLKIT } from "./toolkit";

export const WORLD_NAV = [
  { id: "work", label: "WORK" },
  { id: "ai-lab", label: "AI LAB", href: "/tools/ai-lab" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "about", label: "ABOUT" },
  { id: "contact", label: "CONTACT" },
];

export const WORLD_HERO = {
  name: "MANSI",
  role: "DATA ENGINEER · BUILDER · EXPLORER",
  line: IDENTITY_HERO.headline,
};

/**
 * Technology constellation — only tools present in toolkit / project meta.
 * Kind drives visual role in the world.
 */
export const TECH_NODES = [
  { id: "aws", label: "AWS", kind: "cloud", lat: 18, lon: -40 },
  { id: "s3", label: "S3", kind: "storage", lat: 8, lon: -18 },
  { id: "redshift", label: "Redshift", kind: "storage", lat: -12, lon: -55 },
  { id: "lambda", label: "Lambda", kind: "compute", lat: 32, lon: 10 },
  { id: "ec2", label: "EC2", kind: "compute", lat: -28, lon: 25 },
  { id: "databricks", label: "Databricks", kind: "process", lat: 12, lon: 55 },
  { id: "spark", label: "Spark", kind: "process", lat: -8, lon: 78 },
  { id: "python", label: "Python", kind: "language", lat: 40, lon: 120 },
  { id: "sql", label: "SQL", kind: "language", lat: -35, lon: -120 },
  { id: "terraform", label: "Terraform", kind: "infra", lat: 22, lon: -140 },
  { id: "docker", label: "Docker", kind: "infra", lat: -20, lon: 150 },
  { id: "mlflow", label: "MLflow", kind: "ai", lat: 5, lon: 95 },
  { id: "powerbi", label: "Power BI", kind: "bi", lat: -42, lon: -30 },
].filter((n) => {
  const blob = JSON.stringify(TOOLKIT).toLowerCase();
  const aliases = {
    aws: true,
    s3: true,
    redshift: true,
    lambda: true,
    ec2: true,
    databricks: true,
    spark: true,
    python: true,
    sql: true,
    terraform: true,
    docker: true,
    mlflow: true,
    powerbi: blob.includes("power bi") || blob.includes("powerbi"),
  };
  return aliases[n.id] !== false;
});

/** Relationships that wake on hover — inferred from real stack adjacency */
export const TECH_LINKS = [
  ["aws", "s3"],
  ["aws", "redshift"],
  ["aws", "lambda"],
  ["aws", "ec2"],
  ["s3", "databricks"],
  ["databricks", "spark"],
  ["spark", "python"],
  ["spark", "sql"],
  ["databricks", "mlflow"],
  ["redshift", "powerbi"],
  ["terraform", "aws"],
  ["docker", "ec2"],
  ["lambda", "python"],
];

const PROJECT_SLUGS = [
  FEATURED_PROJECT_SLUG,
  "brain-mvp",
  "automated-intelligence-pipeline",
  "olap-workload-architecture",
];

export const WORLD_PROJECTS = PROJECT_SLUGS.map((slug, i) => {
  const meta = getProjectMeta(slug);
  if (!meta) return null;
  const angle = (i / PROJECT_SLUGS.length) * Math.PI * 2 - Math.PI * 0.35;
  return {
    index: String(i + 1).padStart(2, "0"),
    slug: meta.slug,
    title: meta.cardTitle || meta.title,
    category: meta.category,
    problem: meta.problem,
    role: meta.role,
    summary: meta.summary || meta.purpose,
    architecture: meta.architectureLayers || [],
    decisions: (meta.decisions || []).slice(0, 3),
    tech: meta.tech || [],
    outcomes: meta.outcomes || [],
    learning: Array.isArray(meta.whatIWouldChangeToday)
      ? meta.whatIWouldChangeToday[0] || null
      : meta.whatIWouldChangeToday || null,
    // Outer orbit positions
    angle,
    radius: 4.2,
    y: Math.sin(i * 1.7) * 0.45,
  };
}).filter(Boolean);

export const THEME = {
  night: {
    id: "night",
    bg: "#080b10",
    fog: "#0a0e14",
    fogNear: 6,
    fogFar: 28,
    ink: "#e8eef4",
    muted: "rgba(190, 205, 220, 0.58)",
    faint: "rgba(150, 168, 188, 0.35)",
    line: "rgba(170, 190, 210, 0.12)",
    surface: "rgba(12, 16, 22, 0.82)",
    globe: "#1a2430",
    wire: "#6a849c",
    data: "#5a8aaa",
    process: "#3d9a9a",
    accent: "#d4a84b",
    ai: "#8a7ab0",
    ambient: 0.35,
    key: 0.9,
  },
  day: {
    id: "day",
    bg: "#efe9df",
    fog: "#e4ddd2",
    fogNear: 8,
    fogFar: 32,
    ink: "#121820",
    muted: "rgba(30, 40, 52, 0.58)",
    faint: "rgba(40, 52, 66, 0.36)",
    line: "rgba(20, 28, 38, 0.12)",
    surface: "rgba(250, 246, 238, 0.88)",
    globe: "#c8c2b6",
    wire: "#3a4a5c",
    data: "#2a6a82",
    process: "#2a7a72",
    accent: "#b8862a",
    ai: "#5a4a78",
    ambient: 0.75,
    key: 1.05,
  },
};

export function latLonToVec(lat, lon, r = 1) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

export function kindColor(kind, theme) {
  const t = THEME[theme] || THEME.night;
  if (kind === "cloud" || kind === "infra") return t.wire;
  if (kind === "storage") return t.data;
  if (kind === "process" || kind === "compute") return t.process;
  if (kind === "ai") return t.ai;
  if (kind === "bi") return t.accent;
  return t.data;
}
