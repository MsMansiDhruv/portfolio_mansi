"use client";

import { cn } from "@/lib/cn";

function LayerStack({ nodes, compact }) {
  return (
    <div className={cn("flex flex-col", compact ? "gap-1" : "gap-1.5")}>
      {nodes.map((label, index) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-full rounded border border-slate-200/90 bg-white/90 px-2 py-1.5 text-center dark:border-slate-700 dark:bg-slate-900/70">
            <span className="line-clamp-2 text-[10px] font-medium leading-tight text-slate-700 dark:text-slate-300">
              {label}
            </span>
          </div>
          {index < nodes.length - 1 ? (
            <span className="my-0.5 text-[10px] text-slate-300 dark:text-slate-600" aria-hidden>
              ↓
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function FlowRail({ nodes }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1">
      {nodes.map((label, index) => (
        <span key={label} className="contents">
          {index > 0 ? (
            <span className="text-[10px] text-slate-300 dark:text-slate-600" aria-hidden>
              →
            </span>
          ) : null}
          <span className="rounded border border-slate-200/90 bg-white/90 px-2 py-1 text-[10px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            {label}
          </span>
        </span>
      ))}
    </div>
  );
}

function SplitCompare({ left, right, leftLabel, rightLabel }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded border border-slate-200/90 bg-slate-50/80 p-2 dark:border-slate-700 dark:bg-slate-900/50">
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{leftLabel}</p>
        <p className="mt-1 text-[10px] leading-snug text-slate-600 dark:text-slate-400">{left}</p>
      </div>
      <div className="rounded border border-teal-700/15 bg-teal-50/40 p-2 dark:border-teal-500/20 dark:bg-teal-950/20">
        <p className="text-[9px] font-bold uppercase tracking-wider text-teal-800/70 dark:text-teal-400/80">
          {rightLabel}
        </p>
        <p className="mt-1 text-[10px] leading-snug text-slate-700 dark:text-slate-300">{right}</p>
      </div>
    </div>
  );
}

export default function ProjectCaseStudyVisual({ visual, className, compact = false }) {
  if (!visual) return null;

  return (
    <div
      className={cn(
        "min-w-0 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/30",
        compact ? "p-2.5" : "p-3",
        className
      )}
      aria-hidden
    >
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
        {visual.label}
      </p>
      <div className="mt-2">
        {visual.type === "layers" ? <LayerStack nodes={visual.nodes} compact={compact} /> : null}
        {visual.type === "flow" ? <FlowRail nodes={visual.nodes} /> : null}
        {visual.type === "split" ? (
          <SplitCompare
            left={visual.left}
            right={visual.right}
            leftLabel={visual.leftLabel}
            rightLabel={visual.rightLabel}
          />
        ) : null}
      </div>
    </div>
  );
}
