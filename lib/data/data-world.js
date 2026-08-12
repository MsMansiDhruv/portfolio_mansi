/**
 * Data World narrative — copy derived from existing portfolio data only.
 */

import { PROFILE } from "./credentials-content";
import { ABOUT_ME, getAboutHeroLine } from "./career";
import { TECHNICAL_PROFILE } from "./credentials-content";
import { HOME_CASE_STUDIES, PLATFORM_ARCHITECTURE_FLOW, ENGINEERING_PRINCIPLES } from "./home-content";
import { HOW_I_THINK, MANSI_SIGNATURE } from "./identity";

export const WORLD_OPENING = {
  line1: "Data doesn't arrive organized.",
  line2: "I build the system that makes sense of it.",
};

export const WORLD_RAW = {
  words: ["Messy.", "Incomplete.", "Unpredictable."],
  close: "That's where the work begins.",
};

export const PIPELINE_STAGES = [
  { id: "raw", label: "Raw", stage: "Raw data" },
  { id: "ingest", label: "Ingest", stage: "Ingestion" },
  { id: "transform", label: "Transform", stage: "Transformation" },
  { id: "validate", label: "Validate", stage: "Validation" },
  { id: "store", label: "Store", stage: "Storage" },
  { id: "analyze", label: "Analyze", stage: "Analytics" },
];

/** Map documented platform flow to pipeline labels */
export const PIPELINE_FLOW = PLATFORM_ARCHITECTURE_FLOW.map((s) => s.stage);

export const WORLD_ENGINEERING = {
  break: "Systems break.",
  insight1: "Good engineering isn't about never breaking.",
  insight2: "It's about knowing why.",
  principle: ENGINEERING_PRINCIPLES[0]?.phrase ?? HOW_I_THINK[0],
};

export const WORLD_PROJECTS = HOME_CASE_STUDIES.filter((p) => p.kind !== "experiment").slice(0, 4);

export const WORLD_STACK = {
  line1: "Tools aren't the story.",
  line2: "What I build with them is.",
  groups: Object.entries(TECHNICAL_PROFILE).map(([category, tools]) => ({ category, tools })),
};

export const WORLD_GROWTH = {
  arc: ["Learn", "Build", "Break", "Debug", "Understand", "Build better"],
};

export const WORLD_SIGNATURE = {
  line1: "I like understanding how things work.",
  line2: "And then making them work better.",
  motif: MANSI_SIGNATURE.motif,
};

export const WORLD_ABOUT = {
  title: "A little about me",
  intro: getAboutHeroLine(),
  paragraphs: ABOUT_ME,
  name: PROFILE.name,
  headline: PROFILE.headline,
  domains: PROFILE.domains,
};

export const WORLD_CONTACT = {
  title: "Have a data problem?",
  subtitle: "Let's build something that makes sense of it.",
  email: "mansi.p.dhruv@gmail.com",
  linkedIn: PROFILE.linkedInUrl,
  github: "https://github.com/MsMansiDhruv",
  resume: "/resume.pdf",
};

/** Scroll progress windows (0–1) for each narrative beat */
export const WORLD_SECTIONS = [
  { id: "enter", label: "Enter", start: 0, end: 0.1 },
  { id: "raw", label: "Raw", start: 0.08, end: 0.22 },
  { id: "pipeline", label: "Pipeline", start: 0.2, end: 0.4 },
  { id: "systems", label: "Systems", start: 0.38, end: 0.52 },
  { id: "work", label: "Work", start: 0.5, end: 0.68 },
  { id: "stack", label: "Stack", start: 0.66, end: 0.78 },
  { id: "growth", label: "Growth", start: 0.76, end: 0.86 },
  { id: "signature", label: "Identity", start: 0.84, end: 0.92 },
  { id: "about", label: "About", start: 0.9, end: 0.97 },
  { id: "contact", label: "Contact", start: 0.95, end: 1 },
];

export const PROGRESS_RAIL = [
  { n: "01", label: "Raw" },
  { n: "02", label: "Pipeline" },
  { n: "03", label: "Systems" },
  { n: "04", label: "Work" },
  { n: "05", label: "Growth" },
  { n: "06", label: "Contact" },
];
