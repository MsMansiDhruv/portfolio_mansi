/** Exhibition exhibits — derived only from documented project / work-exhibition data */

import { WORK_INSTALLATIONS } from "./work-exhibition";
import { getProjectMeta } from "./project-meta";

/**
 * Instruments live OUTSIDE in the atrium approach — not buried in a deep hall.
 * Homepage reads as occupied courtyard, not empty museum corridor.
 */
export const EXHIBIT_LAYOUT = [
  {
    slug: "project-amc-datalake-solution",
    position: [-3.8, 0, 14.5],
    roomLook: [-3.8, 1.55, 14.5],
    roomCam: [-3.5, 1.55, 16.35],
    appearAt: 0.08,
  },
  {
    slug: "brain-mvp",
    position: [3.7, 0, 9.5],
    roomLook: [3.7, 1.55, 9.5],
    roomCam: [3.4, 1.55, 11.35],
    appearAt: 0.28,
  },
  {
    slug: "automated-intelligence-pipeline",
    position: [-3.6, 0, 3.8],
    roomLook: [-3.6, 1.55, 3.8],
    roomCam: [-3.3, 1.55, 5.65],
    appearAt: 0.45,
  },
  {
    slug: "olap-workload-architecture",
    position: [3.5, 0, -2.2],
    roomLook: [3.5, 1.55, -2.2],
    roomCam: [3.2, 1.55, -0.35],
    appearAt: 0.62,
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
      appearAt: layout.appearAt,
      evidence: install.evidence || null,
    };
  }).filter(Boolean);
}

export const EXHIBITION_EXHIBITS = buildExhibitionExhibits();
