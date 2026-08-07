import { FEATURED_PROJECT_SLUG, SUPPORTING_PROJECT_SLUGS, getProjectMeta } from "./project-meta";

export const HOME_FEATURED = (() => {
  const amc = getProjectMeta(FEATURED_PROJECT_SLUG);
  const supporting = SUPPORTING_PROJECT_SLUGS.map((s) => getProjectMeta(s)).filter(Boolean);
  return [amc, ...supporting].filter(Boolean);
})();

export const HOME_CASE_STUDIES = HOME_FEATURED.map((p) => ({
  slug: p.slug,
  title: p.title,
  category: p.category,
  techLabel: (p.tech || []).join(" · "),
  outcome:
    p.slug === "project-amc-datalake-solution"
      ? "Unified legacy sources into a governed cloud analytics foundation teams could extend."
      : p.slug === "gpu-bench"
        ? "Repeatable CUDA benchmarks to justify GPU spend with evidence, not hype."
        : "Validated lakehouse patterns before committing to the full enterprise build.",
}));

export const ENGINEERING_PRINCIPLES = [
  { title: "Reliability", phrase: "Design for failure, not just the happy path." },
  { title: "Simplicity", phrase: "Prefer clear ownership and fewer moving parts." },
  { title: "Cost awareness", phrase: "Treat cloud cost as an architecture concern." },
  { title: "Automation", phrase: "Make repeat work boring so people focus on decisions." },
  { title: "Observability", phrase: "If we can't explain what the system is doing, we can't operate it well." },
];

export const AI_AGENTS = [
  { id: "architecture", label: "Architecture Expert" },
  { id: "pipeline", label: "Pipeline Reviewer" },
  { id: "sql", label: "SQL Optimizer" },
  { id: "interview", label: "Interview Coach" },
  { id: "ask", label: "Ask Mansi" },
  { id: "cloud", label: "Cloud Cost Advisor" },
];

export const BEYOND_STACK =
  "I like understanding how systems behave under real constraints — performance, cost, reliability, and the people who have to operate them.";
