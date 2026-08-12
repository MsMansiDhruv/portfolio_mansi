/**
 * Universe nodes — domains of Mansi's world.
 * Positions use spherical coords (theta: 0–2π, phi: 0–π).
 */

import { AI_AGENTS } from "./home-content";

export const UNIVERSE_OPENING = {
  name: "Mansi Dhruv",
  tagline: "Build · Explore · Connect",
  whisper: "A world connected to one person.",
};

export const UNIVERSE_NODES = [
  {
    id: "person",
    label: "Person",
    hint: "Who I am",
    href: "/credentials",
    theta: 0.4,
    phi: 1.1,
    kind: "core",
  },
  {
    id: "work",
    label: "Work",
    hint: "Things I've built",
    href: "/projects",
    theta: 1.2,
    phi: 0.85,
    kind: "build",
  },
  {
    id: "ai-lab",
    label: "AI Lab",
    hint: "Experimental intelligence",
    href: "/tools/ai-lab",
    theta: 2.1,
    phi: 1.0,
    kind: "lab",
  },
  {
    id: "brain",
    label: "Brain",
    hint: "How ideas connect",
    href: "/tools/ai-lab",
    theta: 2.8,
    phi: 0.7,
    kind: "lab",
    vignette: "Questions, systems, and the space between them.",
  },
  {
    id: "journey",
    label: "Journey",
    hint: "How I grew",
    href: "/credentials",
    theta: 3.5,
    phi: 1.3,
    kind: "path",
  },
  {
    id: "people",
    label: "People",
    hint: "Community & collaboration",
    href: "/credentials#recommendations",
    theta: 4.2,
    phi: 0.95,
    kind: "social",
  },
  {
    id: "play",
    label: "Play",
    hint: "Games & experiments",
    href: "/tools",
    theta: 5.0,
    phi: 1.15,
    kind: "play",
  },
  {
    id: "stories",
    label: "Stories",
    hint: "Anime & narrative",
    vignette: "Stories are one of the ways I learn — character, discipline, imagination.",
    theta: 5.6,
    phi: 0.75,
    kind: "life",
  },
  {
    id: "travel",
    label: "Travel",
    hint: "Exploration",
    vignette: "New places change how you see familiar systems.",
    theta: 0.9,
    phi: 1.45,
    kind: "life",
  },
  {
    id: "board",
    label: "Strategy",
    hint: "Board games",
    vignette: "Decisions, people, uncertainty — thinking ahead together.",
    theta: 1.8,
    phi: 1.5,
    kind: "life",
  },
  {
    id: "sport",
    label: "Badminton",
    hint: "Movement & focus",
    vignette: "Court lines, rhythm, and reading the next move.",
    theta: 3.0,
    phi: 1.55,
    kind: "life",
  },
  {
    id: "notes",
    label: "Notes",
    hint: "Field notes",
    href: "/blog",
    theta: 4.8,
    phi: 1.4,
    kind: "learn",
  },
  {
    id: "next",
    label: "Next",
    hint: "What comes after",
    href: "/contact",
    theta: 6.0,
    phi: 1.05,
    kind: "core",
  },
];

export const UNIVERSE_AI_MODES = AI_AGENTS.map((a) => ({
  id: a.id,
  label: a.label,
  purpose: a.purpose,
}));

export const UNIVERSE_FINAL = {
  line1: "This is not everything I am.",
  line2: "It's only what I've built so far.",
  cta: "Let's build what comes next.",
};

/** Secondary flat navigation */
export const UNIVERSE_FLAT_NAV = [
  { id: "home", label: "Home", href: "/" },
  { id: "work", label: "Work", href: "/projects" },
  { id: "lab", label: "AI Lab", href: "/tools/ai-lab" },
  { id: "about", label: "About", href: "/credentials" },
  { id: "creds", label: "Credentials", href: "/credentials" },
  { id: "contact", label: "Contact", href: "/contact" },
];
