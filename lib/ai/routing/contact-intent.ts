import type { AiLabModeId } from "../mode-agents";
import type { SiteLink } from "../reasoning/reasoning-types";
import { CONTACT_PATH, SOCIAL_LINKS } from "@/lib/data/social-links";

const CONTACT_PATTERNS = [
  /\bwould love to contact\b/i,
  /\bwant to contact\b/i,
  /\bhow (can|do) i (contact|reach|email|connect with)\b/i,
  /\b(get in touch|reach out|send a message|drop a line)\b/i,
  /\b(contact (you|mansi|her)|email (you|mansi|her))\b/i,
  /\bconnect(ing)?\s+(with\s+)?(you|mansi|her)\b/i,
  /\bconnect(ing)?\s+for\s+(collaboration|work|a project|hiring)\b/i,
  /\b(work together|let'?s collaborate|collaboration opportunity)\b/i,
  /\b(hire you|hiring you|job opportunity|open to (work|roles|opportunities))\b/i,
  /\b(speaking engagement|speak at|guest (talk|lecture))\b/i,
  /\binterested in (working|collaborating|connecting)\b/i,
  /\bcan we (talk|chat|connect|meet)\b/i,
  /\b(your linkedin|your github|linkedin profile|github profile)\b/i,
  /\b(social media|find you online|where can i find you)\b/i,
];

const TECHNICAL_CONNECT_PATTERN =
  /\bconnect(ion|ing)?\b[\s\S]{0,40}\b(kafka|spark|s3|redis|database|table|component|pipeline|service|api|jdbc|pool|warehouse|bi)\b/i;

export function isContactIntent(question: string): boolean {
  const text = String(question || "").trim();
  if (!text) return false;
  if (TECHNICAL_CONNECT_PATTERN.test(text)) return false;
  if (/\b(team collaboration on engineering)\b/i.test(text) && !/\b(contact|reach|touch|hire|collaborat)\b/i.test(text)) {
    return false;
  }
  return CONTACT_PATTERNS.some((pattern) => pattern.test(text));
}

export function buildContactSiteLinks(): SiteLink[] {
  return [
    {
      title: "Contact form",
      href: CONTACT_PATH,
      label: "Get in touch →",
      reason: "Send a message about work, speaking, hiring, or collaboration.",
      primary: true,
    },
    {
      title: "LinkedIn",
      href: SOCIAL_LINKS.linkedin,
      label: "Connect on LinkedIn →",
      reason: "Professional background, recommendations, and career context.",
      external: true,
    },
    {
      title: "GitHub",
      href: SOCIAL_LINKS.github,
      label: "View GitHub →",
      reason: "Code, projects, and engineering work in the open.",
      external: true,
    },
    {
      title: "Email",
      href: `mailto:${SOCIAL_LINKS.email}`,
      label: "Email directly →",
      reason: SOCIAL_LINKS.email,
      external: true,
    },
    {
      title: "Projects",
      href: "/projects",
      label: "Explore projects →",
      reason: "Case studies and architecture work before you reach out.",
    },
  ];
}

export function buildContactResponse(mode: AiLabModeId) {
  const siteLinks = buildContactSiteLinks();

  const summary =
    mode === "ask"
      ? "I'd love to connect. The best way to reach me is through the contact page on this site, or on LinkedIn and GitHub if you prefer — whether it's about collaboration, hiring, speaking, or a technical conversation."
      : "For collaboration, hiring, or speaking, use the contact page, LinkedIn, or GitHub — those are the best ways to start a conversation.";

  return {
    title: "Get in touch",
    summary,
    sections: [],
    siteLinks,
    followUps: [
      { label: "Explore the project portfolio", targetAction: "navigate", targetSubject: "/projects" },
    ],
  };
}
