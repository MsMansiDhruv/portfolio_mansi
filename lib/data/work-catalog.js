/**
 * Catalog cards for /projects — titles and problems only.
 * Full case-study modules stay in work-exhibition.js for detail pages.
 */

import { getProjectMeta } from "./project-meta";
import { PROJECTS } from "./projects";
import {
  EXHIBITION_ORDER,
  EXPERIMENT_PROJECT_SLUGS,
  WORK_OPENING,
} from "./exhibition-order";

export { EXHIBITION_ORDER, WORK_OPENING };

const EXPERIMENT_CATEGORY = {
  "gpu-bench": "GPU / HPC",
  "cuda-tiling": "GPU / HPC",
  "pc-accessories": "Business",
  "acrylic-store": "Business",
  "saffron-research": "Research",
};

function cardFromMeta(slug, index) {
  const meta = getProjectMeta(slug);
  if (!meta?.title) return null;
  return {
    slug,
    number: String(index + 1).padStart(2, "0"),
    title: meta.cardTitle || meta.title,
    cardTitle: meta.cardTitle || meta.title,
    category: meta.category,
    problem: meta.problem || meta.summary || "",
    tech: meta.tech || [],
  };
}

export const WORK_INSTALLATIONS = EXHIBITION_ORDER.map((slug, index) =>
  cardFromMeta(slug, index)
).filter(Boolean);

export const WORK_EXPERIMENTS = EXPERIMENT_PROJECT_SLUGS.map((slug, index) => {
  const card = cardFromMeta(slug, WORK_INSTALLATIONS.length + index);
  if (!card) return null;
  return {
    ...card,
    category: card.category || EXPERIMENT_CATEGORY[slug] || "Experiment",
    kind: "experiment",
  };
}).filter(Boolean);

export const WORK_SECONDARY = PROJECTS.filter(
  (project) =>
    !EXHIBITION_ORDER.includes(project.slug) &&
    !EXPERIMENT_PROJECT_SLUGS.includes(project.slug)
).map((project, index) => {
  const card = cardFromMeta(project.slug, WORK_INSTALLATIONS.length + index);
  return (
    card || {
      slug: project.slug,
      number: String(WORK_INSTALLATIONS.length + index + 1).padStart(2, "0"),
      title: project.title,
      cardTitle: project.title,
      category: project.category || "Project",
      problem: project.desc || "",
      tech: project.tech || [],
    }
  );
});
