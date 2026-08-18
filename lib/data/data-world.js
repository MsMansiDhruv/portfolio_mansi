/** World of Data — single engine config from real portfolio technologies only */

import { TOOLKIT } from "./toolkit";
import { EXHIBITION_ORDER } from "./exhibition-order";
import { getProjectMeta } from "./project-meta";
import { WORLD_NAV } from "./world-nav";

export { WORLD_NAV };

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
};

export const NAV_PORTAL_MAP = {
  world: null,
  work: "work",
  ai: "ai",
  experience: "experience",
  about: "about",
  contact: "contact",
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
  { id: "work", label: "WORK", kind: "transform", orbit: "platform", angle: 0.42, tier: "core", portal: true },
  { id: "ai", label: "AI LAB", kind: "ai", orbit: "ai", angle: 4.58, tier: "core", portal: true },
  { id: "experience", label: "EXPERIENCE", kind: "data", orbit: "analytics", angle: 2.65, tier: "core", portal: true },
  { id: "about", label: "ABOUT", kind: "infra", orbit: "cloud", angle: 3.72, tier: "core", portal: true },
  { id: "contact", label: "CONTACT", kind: "signal", orbit: "analytics", angle: 5.48, tier: "core", portal: true },
  { id: "aws", label: "AWS", kind: "infra", orbit: "cloud", angle: 0.18, tier: "node", interactive: false },
  { id: "s3", label: "S3", kind: "data", orbit: "cloud", angle: 1.26, tier: "node", interactive: false },
  { id: "databricks", label: "DATABRICKS", kind: "transform", orbit: "platform", angle: 1.62, tier: "node", interactive: false },
  { id: "spark", label: "SPARK", kind: "transform", orbit: "platform", angle: 2.46, tier: "node", interactive: false },
  { id: "terraform", label: "TERRAFORM", kind: "infra", orbit: "analytics", angle: 4.2, tier: "node", interactive: false },
  { id: "mlflow", label: "MLFLOW", kind: "ai", orbit: "ai", angle: 1.08, tier: "node", interactive: false },
];

export const TECH_LINKS = [
  ["work", "aws"],
  ["work", "databricks"],
  ["work", "spark"],
  ["work", "experience"],
  ["experience", "terraform"],
  ["experience", "about"],
  ["about", "contact"],
  ["ai", "mlflow"],
  ["ai", "work"],
  ["contact", "s3"],
  ["s3", "aws"],
  ["databricks", "ai"],
];

/**
 * Technology node roles — real portfolio context only.
 * Portal annotations appear near the node, then retreat.
 */
export const TECH_META = {
  work: {
    role: "WORK",
    portalLabel: "WORK",
    blurb: "Project signatures gather here before the camera eventually enters their architectures.",
    detail: "9 PROJECTS · CLIENT SYSTEMS · EXPERIMENTS · SIDE BUILDS",
    targetLayer: "work",
    actionLabel: "Enter",
  },
  ai: {
    role: "AI LAB",
    portalLabel: "AI LAB",
    blurb: "Semantic reasoning, architecture thinking, and applied intelligence live in this field.",
    detail: "SEMANTIC FIELD · SQL · CLOUD · REASONING",
    targetLayer: "ai",
    actionLabel: "Enter",
  },
  experience: {
    role: "EXPERIENCE",
    portalLabel: "EXPERIENCE",
    blurb: "Career growth is treated as system evolution rather than a static timeline.",
    detail: "GROWTH OF COMPLEXITY · THROUGHPUT · RESPONSIBILITY",
    targetLayer: "experience",
    actionLabel: "Enter",
  },
  about: {
    role: "ABOUT",
    portalLabel: "ABOUT",
    blurb: "The technical field eventually resolves into the person shaping it.",
    detail: "HUMAN INTELLIGENCE INSIDE THE SYSTEM",
    targetLayer: "about",
    actionLabel: "Enter",
  },
  contact: {
    role: "CONTACT",
    portalLabel: "CONTACT",
    blurb: "The routes quiet down and converge into one final signal.",
    detail: "FINAL SIGNAL · LET'S BUILD SOMETHING",
    targetLayer: "contact",
    actionLabel: "Enter",
  },
  aws: {
    role: "INFRA",
    portalLabel: "AWS",
    blurb: "Cloud substrate signal.",
  },
  s3: {
    role: "STORAGE",
    portalLabel: "S3",
    blurb: "Storage signal.",
  },
  databricks: {
    role: "PROCESSING",
    portalLabel: "DATABRICKS",
    blurb: "Processing signal.",
  },
  spark: {
    role: "TRANSFORM",
    portalLabel: "SPARK",
    blurb: "Transform signal.",
  },
  terraform: {
    role: "INFRA",
    portalLabel: "TERRAFORM",
    blurb: "Provisioning signal.",
  },
  mlflow: {
    role: "AI",
    portalLabel: "MLFLOW",
    blurb: "Model lifecycle signal.",
  },
};

export const INFRA_WAKE = {
  work: "platform",
  ai: "ai",
  experience: "analytics",
  about: "cloud",
  contact: "analytics",
  aws: "cloud",
  s3: "cloud",
  terraform: "analytics",
  databricks: "platform",
  spark: "platform",
  mlflow: "ai",
};

/**
 * Opening story — enter a machine already running.
 * silence → stream → nodes → orbit → identity → explore
 */
export const STORY = {
  silence: { at: 0, label: "SYSTEM / IDLE" },
  emergence: { at: 0.25, label: "FLOW / ACTIVE" },
  connection: { at: 0.65, label: "NODES / ONLINE" },
  reveal: { at: 1.1, label: "ORBIT / REVEAL" },
  identity: { at: 1.7, label: "IDENTITY" },
  explore: { at: 2.4, label: "EXPLORE" },
};

/**
 * Near-monochrome field — colour wakes on interaction.
 * Steel / cool grey dominate; muted blue rare; amber only for signal.
 */
export const PARTICLE_SPECTRUM = [
  "#9aaec0",
  "#8a9bb0",
  "#7a8fa4",
  "#a8b8c8",
  "#6e8296",
  "#9eb2c8",
  "#5a9ae8",
  "#d4a05a",
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
export const HOME_CAM = {
  position: [0, 0.06, 8.95],
  lookAt: [0, 0.04, 0],
  fov: 31,
};

export const LAYER_CAM = {
  world: HOME_CAM,
  work: {
    position: [0.05, 0.15, 10.1],
    lookAt: [0.12, 0.05, 0],
    fov: 36,
  },
  pipeline: {
    position: [0.12, 0.12, 7.25],
    lookAt: [0.12, 0.06, -0.18],
    fov: 36,
  },
  ai: {
    position: [0.18, 0.25, 8.75],
    lookAt: [0.24, 0.1, 0],
    fov: 34,
  },
  experience: {
    position: [0.14, 0.15, 9.3],
    lookAt: [0.22, 0.05, 0],
    fov: 34,
  },
  about: {
    position: [0.16, 0.2, 9.45],
    lookAt: [0.22, 0.1, 0],
    fov: 32,
  },
  contact: {
    position: [0.14, 0.15, 9.1],
    lookAt: [0.22, 0.08, 0],
    fov: 32,
  },
};

export function approachNode(nodePos, distance = 2.8) {
  const x = nodePos[0] || 0;
  const y = nodePos[1] || 0;
  const z = nodePos[2] || 0;
  const len = Math.hypot(x, y, z) || 1;
  const dx = x / len;
  return {
    position: [x * 0.45 + dx * 0.2, y * 0.45 + 0.35, z * 0.45 + distance],
    lookAt: [x * 0.92, y * 0.92, z * 0.92],
    fov: 34,
  };
}

export const THEME = {
  night: {
    id: "night",
    bg: "#111113",
    fog: "#111113",
    fogNear: 14,
    fogFar: 38,
    ink: "#f6f4f2",
    muted: "rgba(211, 207, 220, 0.86)",
    faint: "rgba(157, 144, 255, 0.62)",
    line: "rgba(236, 233, 244, 0.16)",
    surface: "#1a1a1f",
    globe: "#1a1a1f",
    globeEmissive: "#0a0a0a",
    steel: "#f6f4f2",
    data: "#9d90ff",
    transform: "#78b9ee",
    infra: "#c09be5",
    ai: "#dc8fc7",
    accent: "#dc8fc7",
    ambient: 0.36,
    key: 0.98,
    rim: 0.5,
    exposure: 1.06,
  },
  day: {
    // Warm mineral daylight — quiet, tactile, and high contrast.
    id: "day",
    bg: "#fbfaf8",
    fog: "#fbfaf8",
    fogNear: 22,
    fogFar: 48,
    ink: "#18171b",
    muted: "rgba(61, 57, 70, 0.82)",
    faint: "rgba(109, 99, 169, 0.66)",
    line: "rgba(70, 64, 82, 0.18)",
    surface: "#f0eef2",
    globe: "#cfc2b2",
    globeEmissive: "#c4b5a2",
    steel: "#5a6a7c",
    data: "#6d63a9",
    transform: "#4d9bda",
    infra: "#8f79bd",
    ai: "#bd629d",
    accent: "#bd629d",
    ambient: 0.78,
    key: 0.95,
    rim: 0.28,
    exposure: 1.02,
  },
};

/** @deprecated use PARTICLE_SPECTRUM */
export const DAY_PARTICLE_COLORS = PARTICLE_SPECTRUM;

export function semanticColor(kind, themeId, wake = 1) {
  const t = THEME[themeId] || THEME.night;
  // Idle systems read as steel; hue only when woken
  if (wake < 0.2) return t.steel;
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

