/**
 * Mansi World — unified narrative + identity data.
 * Person-first. Factual content from documented sources only.
 */

import { PROFILE, TECHNICAL_PROFILE } from "./credentials-content";
import { ABOUT_ME, AWARDS, CERTIFICATIONS, CAREER_TIMELINE } from "./career";
import { IDENTITY_HERO } from "./identity";
import { HOME_CASE_STUDIES } from "./home-content";
import { getExperienceYearsText } from "../career/experience";

/** Recurring motif: curiosity → connection → growth */
export const WORLD_MOTIF = {
  name: "Thread",
  tagline: "A line that starts small and learns where to go.",
};

export const WORLD_OPENING = {
  whisper: "Somewhere between curiosity and chaos...",
  reveal: "...I started building things.",
  name: PROFILE.name.toUpperCase(),
  roles: "Builder · Explorer · Engineer",
};

export const WORLD_EMOTIONAL_ARC = [
  { id: "curious", label: "Curious" },
  { id: "explore", label: "Explore" },
  { id: "try", label: "Try" },
  { id: "fail", label: "Fail" },
  { id: "learn", label: "Learn" },
  { id: "build", label: "Build" },
  { id: "connect", label: "Connect" },
  { id: "lead", label: "Lead" },
  { id: "create", label: "Create" },
  { id: "go", label: "Keep going" },
];

export const STORY_PROLOGUE = {
  line1: WORLD_OPENING.whisper,
  line2: WORLD_OPENING.reveal,
};

export const STORY_CURIOSITY = {
  line1: "It usually starts with a question.",
  line2: "What if?",
};

export const STORY_BUILDER = {
  line1: "Some problems need more than an answer.",
  line2: "They need something built.",
};

export const STORY_FAILURE = {
  line1: "Not everything works the first time.",
  line2: "That's never been the interesting part.",
};

export const STORY_ANIME = {
  line: "Stories are one of the ways I learn.",
  sub: "Character, discipline, imagination — told through worlds that make you feel something.",
};

export const STORY_GAMING = {
  line1: "Play isn't the opposite of seriousness.",
  line2: "Sometimes it's how we learn to think differently.",
};

export const STORY_BOARD = {
  line: "Every move is a decision — with people, uncertainty, and strategy in the room.",
};

export const STORY_PEOPLE = {
  line1: "She doesn't just build things.",
  line2: "She builds connections.",
};

export const STORY_TRAVEL = {
  lines: [
    "There is always another place to see.",
    "Another person to meet.",
    "Another way of looking at the world.",
  ],
};

export const STORY_PERSONAL = {
  line1: "Things I built because I wanted to know if I could.",
  line2: "Curiosity without a client brief.",
};

export const STORY_GROWTH = {
  line1: "I'm still becoming.",
  line2: "That's the point.",
};

export const STORY_LEADERSHIP = {
  line: "At first she followed paths. Then she chose them. Then she built them.",
};

export const STORY_IDENTITY = {
  name: PROFILE.name,
  fragments: [
    { id: "build", label: "I build.", detail: ABOUT_ME[0] },
    { id: "learn", label: "I learn.", detail: "Platforms, patterns, and the gap between how something should work and how it actually behaves." },
    { id: "explore", label: "I explore.", detail: "New places, new problems, new ways of seeing the same system." },
    { id: "play", label: "I play.", detail: "Games, board games, experiments — curiosity with rules and room to improvise." },
    { id: "connect", label: "I connect.", detail: "Communities, collaborators, conversations that turn into better systems." },
    { id: "go", label: "I keep going.", detail: IDENTITY_HERO.humanLine },
  ],
};

export const STORY_FINAL = {
  lines: ["There's more to build.", "Maybe we build the next thing together."],
  cta: "What's next?",
  email: "mansi.p.dhruv@gmail.com",
  linkedIn: PROFILE.linkedInUrl,
  github: "https://github.com/MsMansiDhruv",
  resume: "/resume.pdf",
};

export const STORY_CLIENT_WORK = HOME_CASE_STUDIES.filter((p) => p.kind !== "experiment");
export const STORY_PERSONAL_WORK = HOME_CASE_STUDIES.filter((p) => p.kind === "experiment");
export const STORY_CAREER = [...CAREER_TIMELINE].reverse();

export const STORY_ARCHIVE = {
  awards: AWARDS.slice(0, 4),
  certs: CERTIFICATIONS.filter((c) => c.tier === "primary").slice(0, 3),
};

export const STORY_SKILLS = {
  line: "Tools are material. What you build with them is the story.",
  groups: Object.entries(TECHNICAL_PROFILE).map(([category, tools]) => ({ category, tools })),
};

export const STORY_EXPERIENCE = getExperienceYearsText();

export const STORY_SITE_NAV = [
  { id: "prologue", label: "Prologue", href: "/" },
  { id: "work", label: "Work", href: "/projects" },
  { id: "people", label: "People", href: "/credentials#recommendations" },
  { id: "play", label: "Play", href: "/tools" },
  { id: "journey", label: "Journey", href: "/credentials" },
  { id: "about", label: "About", href: "/#about" },
  { id: "next", label: "Next", href: "/contact" },
];

export const STORY_CHAPTERS = [
  { id: "prologue", n: "00", label: "PROLOGUE" },
  { id: "curious", n: "01", label: "CURIOUS" },
  { id: "explore", n: "02", label: "EXPLORE" },
  { id: "try", n: "03", label: "TRY" },
  { id: "fail", n: "04", label: "FAIL" },
  { id: "learn", n: "05", label: "LEARN" },
  { id: "build", n: "06", label: "BUILD" },
  { id: "connect", n: "07", label: "CONNECT" },
  { id: "worlds", n: "08", label: "WORLDS" },
  { id: "create", n: "09", label: "CREATE" },
  { id: "become", n: "10", label: "BECOME" },
  { id: "next", n: "11", label: "NEXT" },
];

export const STORY_WINDOWS = {
  prologue: { start: 0, end: 0.08 },
  nameReveal: { start: 0.06, end: 0.12 },
  curiosity: { start: 0.1, end: 0.18 },
  builder: { start: 0.16, end: 0.3 },
  failure: { start: 0.28, end: 0.38 },
  learn: { start: 0.36, end: 0.44 },
  anime: { start: 0.42, end: 0.5 },
  gaming: { start: 0.48, end: 0.54 },
  board: { start: 0.52, end: 0.58 },
  people: { start: 0.56, end: 0.64 },
  travel: { start: 0.62, end: 0.7 },
  personal: { start: 0.68, end: 0.76 },
  growth: { start: 0.74, end: 0.84 },
  identity: { start: 0.82, end: 0.92 },
  final: { start: 0.9, end: 1 },
};

export const STORY_PAGE_META = {
  work: { chapter: "Work", title: "What I build", subtitle: "Problems, decisions, and what changed after." },
  journey: { chapter: "Journey", title: "How I grew", subtitle: "Experience earned — not listed." },
  play: { chapter: "Play", title: "The lab", subtitle: "Experiments, tools, and curious builds." },
  writing: { chapter: "Notes", title: "Field notes", subtitle: "Observations from the work." },
  next: { chapter: "Next", title: "Continue the story", subtitle: "Quiet confidence. No hard sell." },
};
