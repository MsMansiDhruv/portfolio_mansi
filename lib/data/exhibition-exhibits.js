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
    position: [-3.4, 0, -6.5],
    roomLook: [-3.4, 1.5, -6.5],
    roomCam: [-3.2, 1.55, -3.8],
    appearAt: 0.7,
  },
  {
    slug: "brain-mvp",
    position: [3.3, 0, -10.5],
    roomLook: [3.3, 1.5, -10.5],
    roomCam: [3.1, 1.55, -7.8],
    appearAt: 0.78,
  },
  {
    slug: "automated-intelligence-pipeline",
    position: [-3.2, 0, -14.5],
    roomLook: [-3.2, 1.5, -14.5],
    roomCam: [-3.0, 1.55, -11.8],
    appearAt: 0.86,
  },
  {
    slug: "olap-workload-architecture",
    position: [3.1, 0, -18.5],
    roomLook: [3.1, 1.5, -18.5],
    roomCam: [2.9, 1.55, -15.8],
    appearAt: 0.93,
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
