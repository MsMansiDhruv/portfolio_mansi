/**
 * Work exhibition — cinematic engineering installations.
 * Metaphors and copy derived only from documented project data.
 */

import { getProjectMeta } from "./project-meta";
import { AMC_CASE_STUDY } from "./amc-case-study";
import { BRAIN_CASE_STUDY } from "./brain-case-study";
import { INTELLIGENCE_CASE_STUDY, INTELLIGENCE_ARCH_IMAGE } from "./intelligence-pipeline-case-study";
import { OLAP_CASE_STUDY } from "./olap-case-study";
import { EXPERIMENT_PROJECT_SLUGS } from "./identity";
import { PROJECTS } from "./projects";

/** Exhibition order — primary instruments first */
export const EXHIBITION_ORDER = [
  "project-amc-datalake-solution",
  "brain-mvp",
  "automated-intelligence-pipeline",
  "olap-workload-architecture",
];

const GLYPHS = {
  strata: "layers",
  spine: "fork",
  harvest: "sieve",
  split: "split",
  proof: "gauge",
  craft: "mark",
};

function metaInstall(slug, metaphor, tagline, notes = []) {
  const m = getProjectMeta(slug);
  if (!m) return null;
  return {
    slug,
    index: 0,
    title: m.title,
    cardTitle: m.cardTitle || m.title,
    category: m.category,
    problem: m.problem,
    purpose: m.purpose || m.summary,
    tagline,
    metaphor,
    glyph: GLYPHS[metaphor] || "mark",
    tech: m.tech || [],
    architectureLayers: m.architectureLayers || null,
    architectureNotes: m.architectureNotes || [],
    decisions: m.decisions || [],
    tradeoffs: m.tradeoffs || null,
    outcomes: m.outcomes || [],
    learnings: m.whatIWouldChangeToday || [],
    engineeringNotes: notes,
    role: m.role,
    timeline: m.timeline,
    evidence: null,
    caseStudy: m.caseStudy || null,
  };
}

/** Notes only if supported by documented case study / meta */
function amcNotes() {
  return [
    "Boundaries between lake, warehouse, and BI matter more than moving ETL onto AWS alone.",
    "Bronze → Silver → Gold creates clearer reuse than ad-hoc transforms.",
    "Self-service tooling is product work alongside core pipelines.",
  ];
}

function brainNotes() {
  const c = BRAIN_CASE_STUDY;
  const take = c?.takeaway || c?.learning || null;
  const notes = [];
  if (typeof take === "string") notes.push(take);
  notes.push("A model creates predictions. A production system turns them into decisions.");
  return notes;
}

function intelNotes() {
  return [
    "Fragmented inputs need visible failure on schedule — not silent drift.",
    "Engineering owns the production path; DS owns the classifier.",
  ];
}

function olapNotes() {
  return [
    "Match the engine to the access pattern — not every workload belongs in the warehouse.",
    "Reframe 'replace the platform' into 'separate the workloads' when evidence shows mismatch.",
  ];
}

export const WORK_OPENING = {
  title: "WORK",
  lines: ["THINGS I BUILT.", "THINGS I LEARNED.", "SYSTEMS I UNDERSTOOD."],
  finale: {
    line1: "BUILDING SYSTEMS.",
    line2: "UNDERSTANDING WHY.",
  },
};

function enrichFromCase(install) {
  if (!install) return null;
  if (install.slug === "project-amc-datalake-solution") {
    return {
      ...install,
      evidence: {
        type: "image",
        src: "/projects/amc/architecture.png",
        caption: AMC_CASE_STUDY.architecture?.diagramCaption,
      },
      flow: AMC_CASE_STUDY.architecture?.flow || [],
      stackRationale: AMC_CASE_STUDY.stackRationale || [],
      caseDecisions: AMC_CASE_STUDY.decisions || [],
      transformation: AMC_CASE_STUDY.transformation || null,
      subtitle: AMC_CASE_STUDY.subtitle,
    };
  }
  if (install.slug === "brain-mvp") {
    return {
      ...install,
      evidence: null,
      flow: (BRAIN_CASE_STUDY.heroFlow || []).map((title, i) => ({
        n: String(i + 1).padStart(2, "0"),
        title,
        body: "",
      })),
      stackRationale: [],
      caseDecisions: [],
      subtitle: BRAIN_CASE_STUDY.subtitle || install.purpose,
      architectureLayers: install.architectureLayers || [
        "Signals / classification",
        "Allocation decisioning",
        "Recommendation serving",
      ],
    };
  }
  if (install.slug === "automated-intelligence-pipeline") {
    return {
      ...install,
      evidence: {
        type: "image",
        src: INTELLIGENCE_ARCH_IMAGE,
        caption: INTELLIGENCE_CASE_STUDY.heroThesis,
      },
      flow: (INTELLIGENCE_CASE_STUDY.pipeline || []).map((s, i) => ({
        n: String(i + 1).padStart(2, "0"),
        title: s.stage,
        body: s.detail,
      })),
      stackRationale: [],
      caseDecisions: [],
      subtitle: INTELLIGENCE_CASE_STUDY.subtitle || install.purpose,
      architectureLayers: install.architectureLayers || [
        "Discover",
        "Extract",
        "Process / dedupe",
        "Classify",
        "Report",
      ],
    };
  }
  if (install.slug === "olap-workload-architecture") {
    return {
      ...install,
      evidence: null,
      flow: [
        { n: "01", title: "Serving", body: "High-frequency application point lookups" },
        { n: "02", title: "Analytics", body: "Bulk and aggregation workloads" },
      ],
      stackRationale: [],
      caseDecisions: [],
      subtitle: OLAP_CASE_STUDY.subtitle || install.purpose,
      architectureLayers: install.architectureLayers || [
        "Serving — high-frequency lookups",
        "Analytics — bulk / aggregation",
      ],
      benchmarks: OLAP_CASE_STUDY.benchmarkTable || OLAP_CASE_STUDY.benchmarks || null,
    };
  }
  return install;
}

const PRIMARY = [
  enrichFromCase(
    metaInstall(
      "project-amc-datalake-solution",
      "strata",
      "A layered refinery — raw feed clarified into curated serving.",
      amcNotes()
    )
  ),
  enrichFromCase(
    metaInstall(
      "brain-mvp",
      "spine",
      "Signal to verdict — predictions become allocation decisions.",
      brainNotes()
    )
  ),
  enrichFromCase(
    metaInstall(
      "automated-intelligence-pipeline",
      "harvest",
      "A noise sieve — scattered sources become actionable reports.",
      intelNotes()
    )
  ),
  enrichFromCase(
    metaInstall(
      "olap-workload-architecture",
      "split",
      "A workload fork — one stressed warehouse becomes two specialized systems.",
      olapNotes()
    )
  ),
].filter(Boolean);

PRIMARY.forEach((p, i) => {
  p.index = i + 1;
  p.number = String(i + 1).padStart(2, "0");
});

/** Secondary instruments — thinner exhibition cards, still not a grid of clones */
export const WORK_SECONDARY = PROJECTS.filter(
  (p) => !EXHIBITION_ORDER.includes(p.slug) && !EXPERIMENT_PROJECT_SLUGS.includes(p.slug)
).map((p, i) => {
  const m = getProjectMeta(p.slug);
  return {
    slug: p.slug,
    number: String(PRIMARY.length + i + 1).padStart(2, "0"),
    title: m?.cardTitle || m?.title || p.title,
    problem: m?.problem || p.desc,
    metaphor: "craft",
    glyph: "mark",
    category: m?.category || "Project",
  };
});

export const WORK_EXPERIMENTS = PROJECTS.filter((p) => EXPERIMENT_PROJECT_SLUGS.includes(p.slug)).map(
  (p, i) => {
    const m = getProjectMeta(p.slug);
    return {
      slug: p.slug,
      number: `X${i + 1}`,
      title: m?.cardTitle || m?.title || p.title,
      problem: m?.problem || p.desc,
      metaphor: p.slug === "gpu-bench" ? "proof" : "craft",
      glyph: p.slug === "gpu-bench" ? "gauge" : "mark",
      category: "Experiment",
    };
  }
);

export const WORK_INSTALLATIONS = PRIMARY;

export function getInstallation(slug) {
  return WORK_INSTALLATIONS.find((p) => p.slug === slug) || null;
}

export function getInstallationNav(slug) {
  const i = WORK_INSTALLATIONS.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? WORK_INSTALLATIONS[i - 1] : null,
    next: i < WORK_INSTALLATIONS.length - 1 ? WORK_INSTALLATIONS[i + 1] : null,
  };
}
