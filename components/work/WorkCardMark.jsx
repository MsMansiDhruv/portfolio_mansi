"use client";

import {
  Layers,
  Network,
  Waypoints,
  Split,
  Gauge,
  Cpu,
  Component,
  Store,
  Sprout,
} from "lucide-react";

const ICONS = {
  "project-amc-datalake-solution": Layers,
  "brain-mvp": Network,
  "automated-intelligence-pipeline": Waypoints,
  "olap-workload-architecture": Split,
  "gpu-bench": Gauge,
  "cuda-tiling": Cpu,
  "pc-accessories": Component,
  "acrylic-store": Store,
  "saffron-research": Sprout,
};

const MARKS = {
  "project-amc-datalake-solution": (
    <svg viewBox="0 0 160 88" aria-hidden>
      <rect x="18" y="54" width="124" height="18" rx="4" className="wd-mark-fill" />
      <rect x="30" y="32" width="100" height="16" rx="4" className="wd-mark-line" />
      <rect x="44" y="12" width="72" height="14" rx="4" className="wd-mark-accent" />
    </svg>
  ),
  "brain-mvp": (
    <svg viewBox="0 0 160 88" aria-hidden>
      <circle cx="36" cy="44" r="8" className="wd-mark-fill" />
      <circle cx="80" cy="28" r="10" className="wd-mark-accent" />
      <circle cx="80" cy="60" r="7" className="wd-mark-line" />
      <circle cx="124" cy="44" r="8" className="wd-mark-fill" />
      <path d="M44 44 H70 M90 28 H116 M90 60 H116 M80 38 V53" className="wd-mark-stroke" />
    </svg>
  ),
  "automated-intelligence-pipeline": (
    <svg viewBox="0 0 160 88" aria-hidden>
      <path d="M16 24 H52 L68 44 L52 64 H16" className="wd-mark-stroke" />
      <rect x="72" y="32" width="28" height="24" rx="4" className="wd-mark-accent" />
      <path d="M108 24 H144 L144 64 H108 L124 44 Z" className="wd-mark-fill" />
    </svg>
  ),
  "olap-workload-architecture": (
    <svg viewBox="0 0 160 88" aria-hidden>
      <rect x="18" y="18" width="54" height="52" rx="6" className="wd-mark-line" />
      <rect x="88" y="18" width="54" height="24" rx="5" className="wd-mark-accent" />
      <rect x="88" y="48" width="54" height="22" rx="5" className="wd-mark-fill" />
    </svg>
  ),
  "gpu-bench": (
    <svg viewBox="0 0 160 88" aria-hidden>
      <rect x="28" y="58" width="16" height="18" className="wd-mark-fill" />
      <rect x="52" y="40" width="16" height="36" className="wd-mark-line" />
      <rect x="76" y="22" width="16" height="54" className="wd-mark-accent" />
      <rect x="100" y="34" width="16" height="42" className="wd-mark-fill" />
      <rect x="124" y="46" width="16" height="30" className="wd-mark-line" />
    </svg>
  ),
  "cuda-tiling": (
    <svg viewBox="0 0 160 88" aria-hidden>
      <rect x="32" y="16" width="28" height="28" className="wd-mark-fill" />
      <rect x="66" y="16" width="28" height="28" className="wd-mark-line" />
      <rect x="100" y="16" width="28" height="28" className="wd-mark-accent" />
      <rect x="32" y="50" width="28" height="28" className="wd-mark-line" />
      <rect x="66" y="50" width="28" height="28" className="wd-mark-accent" />
      <rect x="100" y="50" width="28" height="28" className="wd-mark-fill" />
    </svg>
  ),
  "pc-accessories": (
    <svg viewBox="0 0 160 88" aria-hidden>
      <rect x="48" y="20" width="64" height="48" rx="6" className="wd-mark-line" />
      <circle cx="80" cy="44" r="10" className="wd-mark-accent" />
      <rect x="58" y="28" width="10" height="6" className="wd-mark-fill" />
    </svg>
  ),
  "acrylic-store": (
    <svg viewBox="0 0 160 88" aria-hidden>
      <path d="M36 64 L80 18 L124 64 Z" className="wd-mark-stroke" />
      <path d="M54 64 L80 32 L106 64 Z" className="wd-mark-accent" />
    </svg>
  ),
  "saffron-research": (
    <svg viewBox="0 0 160 88" aria-hidden>
      <path d="M80 72 V28" className="wd-mark-stroke" />
      <circle cx="80" cy="24" r="7" className="wd-mark-accent" />
      <circle cx="58" cy="40" r="6" className="wd-mark-fill" />
      <circle cx="102" cy="40" r="6" className="wd-mark-fill" />
    </svg>
  ),
};

export function WorkCardMark({ slug }) {
  const Icon = ICONS[slug] || Layers;
  return (
    <span className="wd-workgrid__visual" data-mark={slug}>
      <span className="wd-workgrid__mark">{MARKS[slug] || MARKS["project-amc-datalake-solution"]}</span>
      <span className="wd-workgrid__ico">
        <Icon size={18} strokeWidth={1.7} />
      </span>
    </span>
  );
}
