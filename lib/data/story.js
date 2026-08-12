/**
 * Narrative copy — derived from existing identity/career data only.
 */

import { IDENTITY_HERO, MANSI_SIGNATURE, PORTRAIT, CHARACTER } from "./identity";
import { ABOUT_ME, CAREER_TIMELINE, CURRENT_ROLE } from "./career";

export { PORTRAIT, CHARACTER };

export const STORY_OPENING = {
  roles: ["Data Engineer", "Architect", "Builder"],
  line: IDENTITY_HERO.headline,
  whisper: MANSI_SIGNATURE.line,
};

/** Chronological journey beats — factual fields from CAREER_TIMELINE */
const PHASE_BY_YEAR = {
  "2018": "curiosity",
  "2019": "learning",
  "2021": "building",
  "2023": "building",
  "2025": "leading",
};

export const STORY_JOURNEY = [...CAREER_TIMELINE].reverse().map((stage) => ({
  ...stage,
  phase: PHASE_BY_YEAR[stage.year] ?? "present",
}));

export const STORY_NOW = {
  year: "Now",
  title: CURRENT_ROLE,
  desc: ABOUT_ME[0],
  phase: "present",
  arc: "Today.",
};

export const STORY_SYSTEMS = {
  title: "When code became architecture",
  line: "Pipelines, platforms, decisions — the work moved from writing code to shaping systems teams live inside.",
};

export const STORY_EPISODES_INTRO = {
  title: "Chapters from the work",
  line: "Each build is a problem, a decision, and what changed after.",
};

export const STORY_VOICES_INTRO = {
  title: "People who were there",
  line: "Voices from the journey — not a ratings page.",
};

export const STORY_WORKSHOP = {
  title: "The workshop",
  line: "Experiments, tools, and things built because the question would not leave.",
  href: "/tools/ai-lab",
};
