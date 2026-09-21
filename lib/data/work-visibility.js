/**
 * Public work vs draft (unpublished) work.
 * Draft stays in the site for local review and is omitted from production.
 */

import { EXHIBITION_ORDER, EXPERIMENT_PROJECT_SLUGS } from "./exhibition-order";
import { PROJECTS } from "./projects";

export const PUBLIC_WORK_SLUGS = EXHIBITION_ORDER;

export const DRAFT_WORK_SLUGS = [
  ...EXPERIMENT_PROJECT_SLUGS,
  ...PROJECTS.map((project) => project.slug).filter(
    (slug) => !EXHIBITION_ORDER.includes(slug) && !EXPERIMENT_PROJECT_SLUGS.includes(slug)
  ),
];

export function isDraftWorkSlug(slug) {
  return DRAFT_WORK_SLUGS.includes(slug);
}

export function isPublicWorkSlug(slug) {
  return PUBLIC_WORK_SLUGS.includes(slug);
}

/** Local `next dev` only. Production builds never show unpublished work. */
export function showDraftWork() {
  if (process.env.NEXT_PUBLIC_SHOW_DRAFT_WORK === "1") return true;
  return process.env.NODE_ENV !== "production";
}
