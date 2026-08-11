/**
 * Personal identity content — derived from documented portfolio copy.
 * Do not invent employers, metrics, hobbies, or achievements here.
 */

import { PROFILE } from "./credentials-content";
import { ABOUT_ME, CURRENT_ROLE } from "./career";
import { BEYOND_STACK } from "./home-content";

/** Recurring theme across projects: operability, cost-aware architecture, incremental modernization */
export const MANSI_SIGNATURE = {
  motif: "Complexity → operability",
  line: "Build it so someone can operate it.",
  description:
    "The through-line in my work: take systems that are hard to reason about and make them explainable, incremental, and liveable for the team on call.",
};

export const PORTRAIT = {
  /** Drop a real editorial portrait at public/portrait.jpg — no placeholder image is faked as a person */
  src: "/portrait.jpg",
  alt: "Mansi Dhruv",
};

export const IDENTITY_HERO = {
  name: PROFILE.name,
  role: `${CURRENT_ROLE} · Solution Architect`,
  domains: PROFILE.domains,
  headline:
    "I build reliable data platforms that turn complex systems into something teams can actually operate.",
  humanLine:
    "I like platforms where architecture, incremental delivery, and operability meet—figuring out what actually matters under cost, failure modes, and who runs it at 2 AM.",
};

/** Engineering opinions grounded in documented principles and project work */
export const HOW_I_THINK = [
  {
    quote: "I'd rather ship a boring reliable pipeline than a clever fragile one.",
    note: "Reliability",
  },
  {
    quote: "Every architecture decision has a cost somewhere—you choose where you pay it.",
    note: "Cost · OLAP · cloud platforms",
  },
  {
    quote: "Observability isn't a dashboard. It's knowing when to worry.",
    note: "Operability",
  },
  {
    quote: "When one store is doing OLTP and OLAP, the problem usually isn't the database—it's the workload mix.",
    note: "From workload-specific architecture work",
  },
  {
    quote: "Good systems should be explainable to the person operating them—not just the person who designed them.",
    note: "Beyond the stack",
  },
];

/** Small human moments — no invented hobbies or personal facts */
export const HUMAN_MOMENTS = [
  {
    label: "Currently building",
    text: ABOUT_ME[0],
  },
  {
    label: "Curious about",
    text: BEYOND_STACK.replace(/^I like /, "").replace(/\.$/, ""),
  },
  {
    label: "An architecture call I keep coming back to",
    text: "Separate storage from analytical serving before reaching for a bigger warehouse.",
  },
];

export const ASK_MANSI = {
  title: "Ask Mansi",
  subtitle: "Talk to the portfolio.",
  description:
    "Questions about my experience, projects, architecture decisions, and how I think about production systems—answered in my professional voice from documented work.",
  cta: "Start a conversation",
  examples: [
    "Why did you choose this architecture?",
    "What did you learn from the OLAP migration?",
    "How do you think about platform reliability?",
  ],
};
