/**
 * Mansi Experience v2 — scroll narrative + chapter windows.
 * Copy aligned to creative brief. Factual content from documented sources.
 */

import { PROFILE } from "./credentials-content";
import { HOME_CASE_STUDIES, PLATFORM_ARCHITECTURE_FLOW } from "./home-content";
import { STORY_FINAL } from "./anime-story";

export const EXPERIENCE_OPENING = {
  mark: "MANSI",
  enter: "ENTER MY WORLD",
  question: "WHO IS MANSI?",
  name: PROFILE.name.toUpperCase(),
  world: "NAMED AFTER THE FIXED STAR. BUILDING BY IT.",
  tagline: "ध्रुव · DHRUVA · THE NORTH STAR",
};

/** Typography spine — the questions that carry the narrative */
export const EXPERIENCE_COPY = {
  curious: {
    headline: "HER NAME MEANS THE NORTH STAR.",
    sub: "Dhruva — the fixed point the sky turns around",
  },
  sky: {
    headline: "HER SKY.",
    sub: "Six constellations · hover a star-figure · click to travel",
  },
  personal: {
    headline: "WHAT DOES SHE LOVE?",
    sub: "The world beyond the work",
  },
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
    headline: "WHAT DOES SHE BUILD?",
    sub: "Starlight, collected and given structure",
  },
  streams: {
    headline: "Light falls. Validation filters. Signal survives.",
    sub: "A pipeline behaves like a telescope — collect, clean, structure",
  },
  city: {
    headline: "A catalog of the sky.",
    sub: "Every warehouse is a star catalog — ordered, queryable, alive",
  },
  projects: {
    headline: "WHAT I BUILD.",
    sub: "Standing stones · each one a system that runs in the world",
  },
  lab: {
    headline: "HOW DOES SHE THINK?",
    sub: "Six chambers · each with its own role · knowledge-grounded",
  },
  learned: "WHAT HAS SHE LEARNED?",
  final: {
    next: "WHAT COMES NEXT?",
    name: PROFILE.name.toUpperCase(),
    line1: "NAVIGATE BY",
    line2: "WHAT YOU LOVE.",
    roles: "DATA ENGINEER · BUILDER · EXPLORER",
  },
};

/**
 * Territories of the central world — mapped to the first constellation nodes
 * in createCinematicWorld. Hover illuminates, click travels the camera there.
 * scrollTo is a 0–1 fraction of the journey.
 */
export const EXPERIENCE_TERRITORIES = [
  { id: "build", label: "BUILD", sub: ["Engineering", "Projects", "Systems"], scrollTo: 0.48 },
  { id: "think", label: "THINK", sub: ["AI", "Learning", "Experiments"], scrollTo: 0.82 },
  { id: "play", label: "PLAY", sub: ["Anime", "Games", "Board games"], scrollTo: 0.33 },
  { id: "move", label: "MOVE", sub: ["Badminton", "Travel", "Discovery"], scrollTo: 0.39 },
  { id: "connect", label: "CONNECT", sub: ["Community", "Networking", "Leadership"], scrollTo: 0.43 },
  { id: "create", label: "CREATE", sub: ["Installations", "Case studies", "Craft"], scrollTo: 0.68 },
];

/**
 * Cinematic environment plates — canonical art direction, one per world.
 * The WebGL scene renders semi-transparently on top of these.
 * Drop an .mp4/.webm with the same id here to upgrade a plate to video.
 */
export const CINEMATIC_BACKDROPS = [
  // One night: the fixed star → her constellations → the observatory →
  // the gallery of stones → back to the same sky, now understood.
  { id: "night", src: "/cinematic/dhruva-night.webp", window: [0, 0.31], opacity: 0.95 },
  { id: "personal", src: "/cinematic/constellation-meadow.webp", window: [0.29, 0.465], opacity: 0.9 },
  { id: "engineering", src: "/cinematic/star-observatory.webp", window: [0.45, 0.665], opacity: 0.9 },
  { id: "gallery", src: "/cinematic/project-gallery.webp", window: [0.645, 0.9], opacity: 0.9 },
  { id: "reveal", src: "/cinematic/dhruva-night.webp", window: [0.895, 1], opacity: 0.95 },
];

/**
 * MASTER TIMELINE — the single narrative source of truth.
 * Phases: 0–15 entry · 15–30 Mansi world · 30–45 personal world ·
 * 45–65 engineering · 65–80 gallery · 80–90 AI lab · 90–100 final reveal.
 * Camera keys (createCinematicWorld), environment plates (CINEMATIC_BACKDROPS)
 * and typography (EXPERIENCE_WINDOWS) all derive from these phases.
 */
export const EXPERIENCE_PHASES = {
  entry: [0, 0.15],
  world: [0.15, 0.3],
  personal: [0.3, 0.45],
  engineering: [0.45, 0.65],
  gallery: [0.65, 0.8],
  lab: [0.8, 0.9],
  reveal: [0.9, 1],
};

/** Typography windows 0–1 — beats inside the master phases */
export const EXPERIENCE_WINDOWS = {
  void: { start: 0, end: 0.045 },
  hero: { start: 0.035, end: 0.095 },
  worldLine: { start: 0.09, end: 0.145 },
  globe: { start: 0.16, end: 0.27 },
  personal: { start: 0.3, end: 0.335 },
  play: { start: 0.325, end: 0.36 },
  stories: { start: 0.35, end: 0.385 },
  badminton: { start: 0.375, end: 0.405 },
  travel: { start: 0.395, end: 0.43 },
  community: { start: 0.42, end: 0.455 },
  leadership: { start: 0.445, end: 0.475 },
  engineering: { start: 0.475, end: 0.525 },
  streams: { start: 0.52, end: 0.6 },
  city: { start: 0.6, end: 0.655 },
  projects: { start: 0.665, end: 0.79 },
  lab: { start: 0.8, end: 0.86 },
  about: { start: 0.865, end: 0.915 },
  final: { start: 0.925, end: 1 },
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
