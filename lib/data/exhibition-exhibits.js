/** Exhibition exhibits — spatial installations inside the atrium */

import { WORK_INSTALLATIONS } from "./work-exhibition";
import { getProjectMeta } from "./project-meta";

/**
 * Distributed architectural objects — discoverable from home view.
 * Not a card grid. Not posters. Physical installations.
 */
export const EXHIBIT_LAYOUT = [
  {
    slug: "project-amc-datalake-solution",
    position: [-4.1, 0, 5.2],
    roomLook: [-4.1, 1.55, 4.4],
    roomCam: [-4.0, 1.72, 8.4],
  },
  {
    slug: "brain-mvp",
    position: [4.0, 0, 2.8],
    roomLook: [4.0, 1.55, 2.0],
    roomCam: [3.9, 1.72, 6.0],
  },
  {
    slug: "automated-intelligence-pipeline",
    position: [-3.7, 0, -0.8],
    roomLook: [-3.7, 1.55, -1.6],
    roomCam: [-3.6, 1.72, 2.4],
  },
  {
    slug: "olap-workload-architecture",
    position: [3.5, 0, -3.6],
    roomLook: [3.5, 1.55, -4.4],
    roomCam: [3.4, 1.72, -0.4],
  },
];

function decisionsSummary(meta, install) {
  const fromCase = install?.caseDecisions?.length
    ? install.caseDecisions.slice(0, 2).map((d) => d.decision || d.title || d).filter(Boolean)
    : [];
  const fromMeta = (meta?.decisions || []).slice(0, 2).map((d) => d.decision).filter(Boolean);
  const list = [...fromCase, ...fromMeta].slice(0, 3);
  if (list.length) return list.join(" · ");
  if (install?.engineeringNotes?.length) return install.engineeringNotes[0];
  return "Architecture and boundaries chosen for operability over convenience.";
}

function outcomeSummary(meta) {
  const outs = meta?.outcomes || [];
  if (!outs.length) return "Documented delivery outcomes are recorded in the case study.";
  return outs
    .slice(0, 2)
    .map((s) => (s.endsWith(".") ? s : `${s}.`))
    .join(" ");
}

export function buildExhibitionExhibits() {
  return EXHIBIT_LAYOUT.map((layout, i) => {
    const install = WORK_INSTALLATIONS.find((w) => w.slug === layout.slug);
    const meta = getProjectMeta(layout.slug);
    if (!install || !meta) return null;

    return {
      id: `exhibit-${String(i + 1).padStart(2, "0")}`,
      number: String(i + 1).padStart(2, "0"),
      slug: layout.slug,
      metaphor: install.metaphor,
      tagline: install.tagline,
      title: meta.cardTitle || meta.title,
      category: meta.category,
      problem: meta.problem,
      system: meta.summary || meta.purpose,
      decisions: decisionsSummary(meta, install),
      technology: (meta.tech || []).slice(0, 6).join(" · "),
      outcome: outcomeSummary(meta),
      layers: meta.architectureLayers || install.architectureLayers || null,
      flow: install.flow || null,
      position: layout.position,
      roomCam: layout.roomCam,
      roomLook: layout.roomLook,
      evidence: install.evidence || null,
    };
  }).filter(Boolean);
}

export const EXHIBITION_EXHIBITS = buildExhibitionExhibits();
