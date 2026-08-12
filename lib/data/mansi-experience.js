/**
 * THE LIVING SYSTEM — Quiet Instrument + Clarification
 * Content from documented sources only. No fabricated metrics.
 */

import { PROFILE } from "./credentials-content";
import { HOME_CASE_STUDIES } from "./home-content";
import { STORY_FINAL } from "./anime-story";

export const EXPERIENCE_OPENING = {
  name: "MANSI",
  enter: "ENTER",
};

/** Screenplay beats — sparse cinematic copy */
export const EXPERIENCE_COPY = {
  flow: {
    mark: "02",
    word: "FLOW.",
    line: "Information with weight, direction, and friction.",
  },
  structure: {
    mark: "03",
    word: "STRUCTURE.",
    line: "Channels become architecture.",
  },
  clarification: {
    mark: "04",
    word: "CLARIFY.",
    hold: "CLARITY IS AN ENGINEERING DECISION.",
  },
  exhibition: {
    mark: "05",
    word: "EXHIBITION.",
    line: "Instruments she built.",
  },
  mind: {
    mark: "06",
    word: "THINK.",
    line: "The reasoning layer.",
  },
  person: {
    mark: "07",
    word: PROFILE.name.toUpperCase(),
    line1: "LEAD DATA ENGINEER",
    line2: "SOLUTION ARCHITECT",
    line3: "You've seen the system. Now meet the person who built it.",
  },
};

/** Chapter windows — single spine shared by overlay + engine */
export const EXPERIENCE_WINDOWS = {
  void: { start: 0, end: 0.02 },
  unknown: { start: 0.02, end: 0.1 },
  flow: { start: 0.1, end: 0.26 },
  structure: { start: 0.26, end: 0.4 },
  clarification: { start: 0.4, end: 0.52 },
  exhibition: { start: 0.52, end: 0.74 },
  mind: { start: 0.74, end: 0.88 },
  person: { start: 0.88, end: 1 },
};

/** Map progress → chapter id for data-chapter attribute */
export function chapterFromProgress(progress) {
  const entries = Object.entries(EXPERIENCE_WINDOWS).filter(([k]) => k !== "void");
  for (const [key, win] of entries) {
    if (progress >= win.start && progress < win.end) return key;
  }
  return "person";
}

/** AI Lab = reasoning chambers */
export const EXPERIENCE_CHAMBERS = [
  {
    id: "ask",
    label: "ASK MANSI",
    href: "/tools/ai-lab?mode=ask",
    hint: "Career, decisions, production lessons",
  },
  {
    id: "pipeline",
    label: "REVIEW PIPELINE",
    href: "/tools/ai-lab?mode=pipeline",
    hint: "Production readiness and operational risk",
  },
  {
    id: "architecture",
    label: "ARCHITECTURE EXPERT",
    href: "/tools/ai-lab?mode=architecture",
    hint: "Trade-offs, scale, reliability, cost",
  },
  {
    id: "interview",
    label: "INTERVIEW",
    href: "/tools/ai-lab?mode=interview",
    hint: "Senior data engineering practice",
  },
  {
    id: "cloud",
    label: "CLOUD COST",
    href: "/tools/ai-lab?mode=cloud",
    hint: "Cost drivers and practical paths",
  },
];

/**
 * Project installations — visual metaphors from real engineering problems.
 * Reveal steps progressive; no invented metrics.
 */
function installationFromCase(p, metaphor, steps) {
  return {
    slug: p.slug,
    title: p.title,
    metaphor,
    problem: p.problem,
    outcome: p.outcome,
    techLabel: p.techLabel,
    href: `/projects/${p.slug}`,
    steps,
  };
}

const cases = HOME_CASE_STUDIES.filter((p) => p.kind !== "experiment");
const bySlug = (slug, i) => cases.find((p) => p.slug === slug) || cases[i];

function stepsFor(p, rows) {
  return rows.map(([key, text]) =>
    key === "TECHNOLOGY" ? { key, text: p.techLabel || text } : { key, text }
  );
}

export const EXPERIENCE_INSTALLATIONS = [
  (() => {
    const p = bySlug("project-amc-datalake-solution", 0);
    return installationFromCase(
      p,
      "strata",
      stepsFor(p, [
        ["PROBLEM", "Legacy shell ETL and siloed sources limited self-service analytics."],
        ["APPROACH", "Modernize into layered lakehouse-minded architecture."],
        ["ARCHITECTURE", "Bronze → Silver → Gold strata with governed transforms."],
        ["TECHNOLOGY", "Documented stack"],
        ["LEARNING", "Clarity of layers beats clever one-off scripts."],
        ["RESULT", p.outcome || "Centralized data, modern ETL, stronger BI and self-service reporting."],
      ])
    );
  })(),
  (() => {
    const p = bySlug("brain-mvp", 1);
    return installationFromCase(
      p,
      "spine",
      stepsFor(p, [
        ["PROBLEM", "Need a decisioning layer — signals to allocation — not another funnel."],
        ["APPROACH", "Productionize classification → allocation → recommendations."],
        ["ARCHITECTURE", "Signal threads converge into a single allocation spine."],
        ["TECHNOLOGY", "Documented stack"],
        ["LEARNING", "Decision architecture is product architecture."],
        ["RESULT", p.outcome || "Production ML allocation to user-facing recommendations."],
      ])
    );
  })(),
  (() => {
    const p = bySlug("automated-intelligence-pipeline", 2);
    return installationFromCase(
      p,
      "harvest",
      stepsFor(p, [
        ["PROBLEM", "Scattered web sources; manual extract and dedupe does not scale."],
        ["APPROACH", "Automate discover → extract → classify → report."],
        ["ARCHITECTURE", "Harvest arcs through a filter gate; survivors form the report."],
        ["TECHNOLOGY", "Documented stack"],
        ["LEARNING", "Integrate DS models without claiming model ownership."],
        ["RESULT", p.outcome || "Automated web intelligence with governed reporting."],
      ])
    );
  })(),
  (() => {
    const p = bySlug("olap-workload-architecture", 3);
    return installationFromCase(
      p,
      "split",
      stepsFor(p, [
        ["PROBLEM", "One warehouse forced to serve competing high-frequency and analytical workloads."],
        ["APPROACH", "Separate serving from analytics after cost and benchmark evidence."],
        ["ARCHITECTURE", "One stressed volume splits into two specialized systems."],
        ["TECHNOLOGY", "Documented stack"],
        ["LEARNING", "Reframe the problem before replacing the platform."],
        ["RESULT", p.outcome || "Production migration separating serving and analytics."],
      ])
    );
  })(),
].filter(Boolean);

export const EXPERIENCE_NAV = [
  { id: "mansi", label: "Mansi", href: "/" },
  { id: "work", label: "Work", href: "/projects" },
  { id: "lab", label: "AI Lab", href: "/tools/ai-lab" },
  { id: "journey", label: "Experience", href: "/credentials" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export const EXPERIENCE_CONTACT = STORY_FINAL;
export const EXPERIENCE_SCROLL_VH = 900;

/** @deprecated — kept empty so old imports don't break */
export const EXPERIENCE_TERRITORIES = [];
export const CINEMATIC_BACKDROPS = [];
export const EXPERIENCE_PIPELINE = [];
export const EXPERIENCE_PROJECTS = EXPERIENCE_INSTALLATIONS;
