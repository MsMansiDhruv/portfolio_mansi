/**
 * Narrative branch paths — derived from documented portfolio data only.
 * Each branch is a quiet fork off the career road, not a hobby list.
 */

import { HOME_CASE_STUDIES } from "./home-content";
import { STORY_WORKSHOP } from "./story";
import { BEYOND_STACK } from "./home-content";

export const STORY_BRANCHES = [
  {
    id: "projects",
    label: "Projects",
    whisper: "Problems worth solving — architecture, trade-offs, what changed.",
    href: "/projects",
    angle: -0.55,
    offset: 0.62,
  },
  {
    id: "travel",
    label: "Routes",
    whisper: "Conferences, new cities, the view from somewhere else.",
    href: "/credentials",
    angle: -0.25,
    offset: 0.68,
  },
  {
    id: "community",
    label: "Community",
    whisper: "People who were there when the work got hard.",
    href: "#story-voices",
    angle: 0.2,
    offset: 0.72,
  },
  {
    id: "builds",
    label: "Curiosity",
    whisper: "Things built because the question would not leave.",
    href: STORY_WORKSHOP.href,
    angle: 0.55,
    offset: 0.66,
  },
];

/** First client case study for branch preview — no invented metrics */
export const BRANCH_PROJECT_PREVIEW = HOME_CASE_STUDIES.find((s) => s.kind !== "experiment");

export const STORY_BEYOND_LINE = BEYOND_STACK;
