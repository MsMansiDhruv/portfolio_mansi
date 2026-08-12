/** Instrument — living data interface config. Content sourced from portfolio data. */

import { FEATURED_PROJECT_SLUG, getProjectMeta } from "./project-meta";
import { IDENTITY_HERO } from "./identity";

export const INSTRUMENT_NAV = [
  { id: "work", label: "WORK" },
  { id: "ai-lab", label: "AI LAB", href: "/tools/ai-lab" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "about", label: "ABOUT" },
  { id: "contact", label: "CONTACT" },
];

export const INSTRUMENT_HERO = {
  name: "MANSI",
  role: "DATA ENGINEER",
  statement: IDENTITY_HERO.headline,
};

/** Featured engineering work — real case studies only */
const FEATURED_SLUGS = [
  FEATURED_PROJECT_SLUG,
  "brain-mvp",
  "automated-intelligence-pipeline",
  "olap-workload-architecture",
];

export const INSTRUMENT_PROJECTS = FEATURED_SLUGS.map((slug, i) => {
  const meta = getProjectMeta(slug);
  if (!meta) return null;
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
    node: [
      (i % 2 === 0 ? -1 : 1) * (1.55 + (i % 2) * 0.25),
      0.15,
      -0.2 - i * 1.65,
    ],
  };
}).filter(Boolean);

export const THEME = {
  night: {
    id: "night",
    bg: "#0a0e14",
    fog: "#0c1118",
    fogNear: 8,
    fogFar: 36,
    ink: "#e8eef6",
    muted: "rgba(200, 214, 230, 0.62)",
    faint: "rgba(160, 178, 198, 0.38)",
    line: "rgba(180, 198, 220, 0.14)",
    surface: "rgba(14, 20, 28, 0.78)",
    steel: "#8aa0b8",
    data: "#6a8aaa",
    accent: "#d4a84b",
    ambient: 0.42,
    key: 0.95,
  },
  day: {
    id: "day",
    bg: "#efe9df",
    fog: "#e6dfd3",
    fogNear: 10,
    fogFar: 40,
    ink: "#121820",
    muted: "rgba(30, 40, 52, 0.62)",
    faint: "rgba(40, 52, 66, 0.38)",
    line: "rgba(20, 28, 38, 0.12)",
    surface: "rgba(250, 246, 238, 0.86)",
    steel: "#3a4a5c",
    data: "#2a5a6e",
    accent: "#b8862a",
    ambient: 0.78,
    key: 1.05,
  },
};

export function damp(a, b, lambda, dt) {
  return a + (b - a) * (1 - Math.exp(-lambda * dt));
}
