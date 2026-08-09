import { PROJECTS } from "@/lib/data/projects";
import { getProjectMeta, resolveProjectSlug } from "@/lib/data/project-meta";

/** Newest-first — matches the default /projects index sort. */
export const PROJECT_NAV_SLUGS = [...PROJECTS].sort((a, b) => b.date.localeCompare(a.date)).map((p) => p.slug);

function titleForSlug(slug) {
  const meta = getProjectMeta(slug);
  if (meta?.cardTitle) return meta.cardTitle;
  if (meta?.title) return meta.title;
  const row = PROJECTS.find((p) => p.slug === slug);
  return row?.title ?? slug;
}

/** Previous / next neighbors in the portfolio stack. */
export function getProjectNav(rawSlug) {
  const slug = resolveProjectSlug(rawSlug);
  const index = PROJECT_NAV_SLUGS.indexOf(slug);
  if (index === -1) {
    return { prev: null, next: null, index: -1, total: PROJECT_NAV_SLUGS.length };
  }

  const prevSlug = index > 0 ? PROJECT_NAV_SLUGS[index - 1] : null;
  const nextSlug = index < PROJECT_NAV_SLUGS.length - 1 ? PROJECT_NAV_SLUGS[index + 1] : null;

  return {
    index,
    total: PROJECT_NAV_SLUGS.length,
    prev: prevSlug ? { slug: prevSlug, title: titleForSlug(prevSlug) } : null,
    next: nextSlug ? { slug: nextSlug, title: titleForSlug(nextSlug) } : null,
  };
}
