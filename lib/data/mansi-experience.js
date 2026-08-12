/**
 * Mansi Experience v2 — scroll narrative + chapter windows.
 * Copy aligned to creative brief. Factual content from documented sources.
 */

import { PROFILE } from "./credentials-content";
import { HOME_CASE_STUDIES, PLATFORM_ARCHITECTURE_FLOW } from "./home-content";
import { STORY_FINAL } from "./anime-story";

export const EXPERIENCE_OPENING = {
  name: PROFILE.name.toUpperCase(),
  world: "BUILDING THINGS I WANT TO UNDERSTAND.",
  tagline: "BUILD · EXPLORE · LEARN · REPEAT.",
};

export const EXPERIENCE_COPY = {
  play: {
    headline: "I LIKE THINGS THAT MAKE ME THINK.",
    sub: "Games · Board games · Challenges · Systems",
  },
  stories: {
    headline: "I LIKE STORIES WHERE PEOPLE BECOME SOMETHING.",
    sub: "Storytelling · growth · imagination · transformation",
  },
  community: {
    headline: "THE BEST THINGS I'VE BUILT WERE NEVER BUILT ALONE.",
    sub: "Collaboration · community · shared paths",
  },
  engineering: {
    headline: "Beneath the surface — systems with weight.",
    sub: "Pipelines · platforms · architecture · data in motion",
  },
  streams: {
    headline: "Records enter. Validation filters. The stream converges.",
    sub: "What you're watching is how a pipeline actually behaves",
  },
  city: {
    headline: "Chaos, assembled.",
    sub: "Scattered matter becomes a city of computation",
  },
  projects: {
    headline: "Installations, not cards.",
    sub: "Each build is a story told through structure",
  },
  lab: {
    headline: "Enter the laboratory.",
    sub: "Experimental intelligence · six instruments · each with a role",
  },
  final: {
    name: PROFILE.name.toUpperCase(),
    line1: "STILL CURIOUS.",
    line2: "STILL BUILDING.",
  },
};

/** Scroll windows 0–1 — synced to the camera journey in createCinematicWorld */
export const EXPERIENCE_WINDOWS = {
  void: { start: 0, end: 0.04 },
  hero: { start: 0.03, end: 0.08 },
  worldLine: { start: 0.075, end: 0.13 },
  globe: { start: 0.15, end: 0.2 },
  play: { start: 0.19, end: 0.24 },
  stories: { start: 0.23, end: 0.28 },
  badminton: { start: 0.27, end: 0.315 },
  travel: { start: 0.305, end: 0.35 },
  community: { start: 0.34, end: 0.39 },
  leadership: { start: 0.38, end: 0.43 },
  engineering: { start: 0.42, end: 0.48 },
  streams: { start: 0.47, end: 0.56 },
  city: { start: 0.57, end: 0.66 },
  projects: { start: 0.68, end: 0.82 },
  lab: { start: 0.81, end: 0.87 },
  about: { start: 0.855, end: 0.915 },
  final: { start: 0.92, end: 1 },
};

export const EXPERIENCE_NAV = [
  { id: "mansi", label: "Mansi", href: "/" },
  { id: "work", label: "Work", href: "/projects" },
  { id: "world", label: "World", href: "/#world" },
  { id: "lab", label: "Lab", href: "/tools/ai-lab" },
  { id: "journey", label: "Journey", href: "/credentials" },
  { id: "about", label: "About", href: "/#about" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export const EXPERIENCE_PROJECTS = HOME_CASE_STUDIES.filter((p) => p.kind !== "experiment").slice(0, 5);
export const EXPERIENCE_PIPELINE = PLATFORM_ARCHITECTURE_FLOW;
export const EXPERIENCE_CONTACT = STORY_FINAL;

/** Total scroll height in viewport units */
export const EXPERIENCE_SCROLL_VH = 920;
