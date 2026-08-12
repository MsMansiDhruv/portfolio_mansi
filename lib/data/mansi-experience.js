/**
 * Mansi Experience — technical interactive systems portfolio.
 * Content from documented sources only. No fabricated metrics.
 */

import { PROFILE } from "./credentials-content";
import { HOME_CASE_STUDIES, PLATFORM_ARCHITECTURE_FLOW } from "./home-content";
import { STORY_FINAL } from "./anime-story";

export const EXPERIENCE_OPENING = {
  name: PROFILE.name.toUpperCase(),
  role: PROFILE.headline.toUpperCase(),
  line: "I DESIGN AND BUILD DATA SYSTEMS THAT RUN IN PRODUCTION.",
  cta: "SCROLL · ENTER THE SYSTEM",
};

export const EXPERIENCE_COPY = {
  systems: {
    headline: "SYSTEMS MAP",
    sub: "Hover a node · click to travel · one continuous architecture",
  },
  pipeline: {
    headline: "DATA IN MOTION",
    sub: "Ingest → validate → transform → store → serve",
  },
  streams: {
    headline: "RECORDS ENTER. VALIDATION FILTERS. SIGNAL SURVIVES.",
    sub: "What you are watching is how a production pipeline behaves",
  },
  city: {
    headline: "ARCHITECTURE ASSEMBLES",
    sub: "Scattered compute becomes a queryable platform",
  },
  projects: {
    headline: "SELECTED BUILDS",
    sub: "Real systems · real constraints · real trade-offs",
  },
  lab: {
    headline: "AI ENGINEERING LAB",
    sub: "Ask Mansi · Pipeline review · Architecture · Interview · Cloud cost",
  },
  beyond: {
    headline: "BEYOND THE TERMINAL",
    sub: "Strategy games · travel · community · leadership",
  },
  final: {
    name: PROFILE.name.toUpperCase(),
    line1: "LEAD DATA ENGINEER",
    line2: "SOLUTION ARCHITECT",
    line3: "AVAILABLE FOR TEAMS THAT BUILD SERIOUS SYSTEMS.",
  },
};

/** Interactive system nodes — mapped to engine hit targets */
export const EXPERIENCE_TERRITORIES = [
  { id: "ingest", label: "INGEST", sub: ["Sources", "Streaming", "Batch"], scrollTo: 0.32 },
  { id: "transform", label: "TRANSFORM", sub: ["ETL", "Validation", "Quality"], scrollTo: 0.42 },
  { id: "store", label: "STORE", sub: ["Lake", "Warehouse", "Catalog"], scrollTo: 0.52 },
  { id: "serve", label: "SERVE", sub: ["APIs", "Analytics", "Consumers"], scrollTo: 0.58 },
  { id: "observe", label: "OBSERVE", sub: ["Monitoring", "Reliability", "Cost"], scrollTo: 0.62 },
  { id: "lab", label: "LAB", sub: ["AI modes", "Architecture", "Interview"], scrollTo: 0.8 },
];

/** No soft story plates — pure systems WebGL */
export const CINEMATIC_BACKDROPS = [];

export const EXPERIENCE_PHASES = {
  entry: [0, 0.12],
  systems: [0.12, 0.28],
  pipeline: [0.28, 0.55],
  gallery: [0.55, 0.75],
  lab: [0.75, 0.86],
  beyond: [0.86, 0.92],
  reveal: [0.92, 1],
};

export const EXPERIENCE_WINDOWS = {
  void: { start: 0, end: 0.04 },
  hero: { start: 0.03, end: 0.11 },
  systems: { start: 0.13, end: 0.26 },
  pipeline: { start: 0.28, end: 0.34 },
  streams: { start: 0.34, end: 0.48 },
  city: { start: 0.48, end: 0.56 },
  projects: { start: 0.58, end: 0.74 },
  lab: { start: 0.76, end: 0.85 },
  beyond: { start: 0.86, end: 0.915 },
  final: { start: 0.925, end: 1 },
};

export const EXPERIENCE_NAV = [
  { id: "mansi", label: "Mansi", href: "/" },
  { id: "systems", label: "Systems", href: "/#systems" },
  { id: "work", label: "Work", href: "/projects" },
  { id: "lab", label: "AI Lab", href: "/tools/ai-lab" },
  { id: "journey", label: "Experience", href: "/credentials" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export const EXPERIENCE_PROJECTS = HOME_CASE_STUDIES.filter((p) => p.kind !== "experiment").slice(0, 5);
export const EXPERIENCE_PIPELINE = PLATFORM_ARCHITECTURE_FLOW;
export const EXPERIENCE_CONTACT = STORY_FINAL;

export const EXPERIENCE_SCROLL_VH = 780;
