"use client";

import { cn } from "@/lib/cn";

/** Vertical layer diagram — labels must come from project data */
export function ArchitectureFlow({ layers, className, compact = false }) {
  if (!layers?.length) {
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-900/40",
          className
        )}
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Architecture overview</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Layer diagram will be added when project architecture is documented.</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-stretch", compact ? "gap-1" : "gap-2", className)}>
      {layers.map((label, index) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className={cn(
              "w-full rounded-lg border border-slate-200 bg-white text-center dark:border-slate-800 dark:bg-slate-950",
              compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
            )}
          >
            <span className="font-medium text-slate-800 dark:text-slate-200">{label}</span>
          </div>
          {index < layers.length - 1 ? (
            <span className="my-0.5 text-slate-400 dark:text-slate-600" aria-hidden>
              ↓
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function DecisionList({ decisions }) {
  if (!decisions?.length) return null;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {decisions.map((item) => (
        <li
          key={item.decision}
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/80"
        >
          <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.decision}</p>
          <dl className="mt-3 space-y-2 text-xs leading-relaxed">
            <div>
              <dt className="font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Why</dt>
              <dd className="mt-0.5 text-slate-700 dark:text-slate-300">{item.why}</dd>
            </div>
            <div>
              <dt className="font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Trade-off</dt>
              <dd className="mt-0.5 text-slate-700 dark:text-slate-300">{item.tradeoff}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

export function TradeoffPanel({ tradeoffs }) {
  if (!tradeoffs) {
    return (
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Trade-off notes for this project are not documented yet.
      </p>
    );
  }
  const rows = [
    { label: "Optimized for", items: tradeoffs.optimizedFor },
    { label: "Sacrificed", items: tradeoffs.sacrificed },
    { label: "Risks", items: tradeoffs.risks },
    { label: "Constraints", items: tradeoffs.constraints },
  ].filter((row) => row.items?.length);

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="rounded-xl border border-slate-200/90 p-4 dark:border-slate-800">
          <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{row.label}</dt>
          <dd className="mt-2">
            <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              {row.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-teal-600 dark:text-teal-400">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
