/**
 * Voice, pathways, and experiential copy — derived from documented work.
 * Personality lives in how the site behaves, not trait labels or hobby lists.
 */

import { PROFILE } from "./credentials-content";
import { CURRENT_ROLE } from "./career";
import { EXPERIMENT_PROJECT_SLUGS } from "./exhibition-order";

export { EXPERIMENT_PROJECT_SLUGS };

export const MANSI_SIGNATURE = {
  motif: "Complexity → operability",
  line: "Build it so someone can operate it.",
};

export const CHARACTER = {
  src: "/character/mansi.png",
  alt: "Mansi Dhruv — illustrated protagonist",
};

export const PORTRAIT = {
  src: "/portrait.jpg",
  alt: "Mansi Dhruv",
};

export const IDENTITY_HERO = {
  name: PROFILE.name,
  role: `${CURRENT_ROLE} · Solution Architect`,
  headline:
    "I build reliable data platforms that turn complex systems into something teams can actually operate.",
  humanLine:
    "Most of my work starts as a migration or cost problem and turns into an architecture problem. I like the second part.",
};

/** Engineering opinions — shown as quotes only; no trait labels in the UI */
export const HOW_I_THINK = [
  "I'd rather ship a boring reliable pipeline than a clever fragile one.",
  "Every architecture decision has a cost somewhere—you choose where you pay it.",
  "Observability isn't a dashboard. It's knowing when to worry.",
  "When one store is doing OLTP and OLAP, the problem usually isn't the database—it's the workload mix.",
  "Good systems should be explainable to the person operating them—not just the person who designed them.",
];

/** Visitor pathways — leadership through information architecture */
export const EXPLORE_PATHWAYS = [
  {
    prompt: "See the engineering",
    href: "/projects",
    hint: "Case studies with architecture, trade-offs, and what changed.",
  },
  {
    prompt: "Understand the decisions",
    href: "/#how-i-think",
    hint: "Opinions I actually design around.",
  },
  {
    prompt: "Stress-test the thinking",
    href: "/#world-ai",
    hint: "Modes built to help with architecture, pipelines, SQL, interviews, and cost.",
  },
  {
    prompt: "Follow the arc",
    href: "/credentials",
    hint: "Career progression, credentials, and what collaborators say.",
  },
];

export const ASK_MANSI = {
  title: "Ask Mansi",
  lead: "Talk to the portfolio—not a generic chatbot.",
  description:
    "I built this because explaining architecture to yourself at 2 AM only gets you so far. Ask about my work, decisions, and how I think about production systems.",
  cta: "Start a conversation",
  examples: [
    "Why did you choose this architecture?",
    "What did you learn from the OLAP migration?",
    "How do you think about platform reliability?",
  ],
};

export const AI_LAB_VOICE =
  "Tools I wished existed when I was untangling someone else's pipeline at midnight—each mode stays in its lane so the answer stays useful.";

export const CONTACT_VOICE = {
  title: "Get in touch",
  description: "For roles, collaboration, or a technical conversation.",
  followUp: "I usually reply within a few business days.",
};

/** Discovered on interaction — never announced as a section */
export const MARK_WHISPERS = [
  "curiosity noted.",
  "keep looking—there's more.",
  "the ai lab is worth a visit.",
  "messy problems are the fun ones.",
];

export const PROJECT_CHAPTER_PREFIX = ["Problem", "Strategy", "Build", "Result"];

/** Homepage world — editorial hero copy derived from documented voice */
export const WORLD_HERO = {
  name: PROFILE.name,
  role: `${CURRENT_ROLE} · Solution Architect`,
  statement: ["Engineer by profession.", "Builder by obsession."],
  support:
    "Most of my work starts as a migration or cost problem and turns into an architecture problem. I like the second part.",
};

/** Explore layers — scroll targets on the homepage narrative */
export const EXPLORE_LAYERS = [
  {
    id: "engineer",
    label: "Engineer",
    href: "#act-work",
    whisper: "Production platforms, architecture decisions, and what changed after go-live.",
  },
  {
    id: "builder",
    label: "Builder",
    href: "#act-experiments",
    whisper: "Experiments I ran because the question was interesting—not because someone filed a ticket.",
  },
  {
    id: "explorer",
    label: "Explorer",
    href: "#act-lab",
    whisper: "Interactive tools I wished existed when I was untangling someone else's pipeline at midnight.",
  },
  {
    id: "human",
    label: "Human",
    href: "#act-human",
    whisper: "What collaborators notice when the work gets hard.",
  },
];

/** Board-game style trade-offs — insights from documented principles */
export const TRADE_OFFS = [
  {
    id: "reliability",
    label: "Reliability",
    insight: HOW_I_THINK[0],
    detail: "Design for failure, not just the happy path.",
  },
  {
    id: "cost",
    label: "Cost",
    insight: HOW_I_THINK[1],
    detail: "Treat cloud cost as an architecture concern—not a surprise invoice.",
  },
  {
    id: "speed",
    label: "Speed",
    insight: "Make repeat work boring so people focus on decisions.",
    detail: "Prefer clear ownership and fewer moving parts when delivery pressure is real.",
  },
];
