"use client";

import React from "react";
import Image from "next/image";
import { OLAP_CASE_STUDY, OLAP_COST_EVIDENCE_IMAGE } from "@/lib/data/olap-case-study";
import { cn } from "@/lib/cn";
import { BENCHMARK_ENGINES, workloadNumeric } from "@/components/projects/olap/benchmark-utils";

const C = OLAP_CASE_STUDY;

const SPINE = [
  "Cost signal",
  "Mismatch",
  "Benchmark",
  "No universal winner",
  "Separation",
  "Trade-offs",
];

function Panel({ className, children }) {
  return (
    <div className={cn("min-w-0 border border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/40", className)}>
      {children}
    </div>
  );
}

function Node({ label, sub, accent, className }) {
  return (
    <div
      className={cn(
        "border px-3 py-2 text-center",
        accent
          ? "border-teal-700/50 bg-teal-50/95 dark:border-teal-500/55 dark:bg-teal-950/55"
          : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900",
        className
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-900 dark:text-white">{label}</p>
      {sub ? <p className="mt-0.5 text-[10px] font-medium uppercase text-slate-500">{sub}</p> : null}
    </div>
  );
}

export function ChapterStrip({ index, title }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-[10px] font-bold tabular-nums tracking-[0.2em] text-teal-800 dark:text-teal-400">{index}</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" aria-hidden />
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{title}</span>
    </div>
  );
}

export function InvestigationSpine({ className }) {
  return (
    <Panel className={cn("px-3 py-3 sm:px-4", className)}>
      <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">Investigation arc</p>
      <ol className="mt-2 flex min-w-0 flex-wrap items-center gap-x-1 gap-y-2 text-[10px] font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
        {SPINE.map((step, i) => (
          <li key={step} className="flex items-center gap-1">
            <span className="text-teal-800 dark:text-teal-400">{step}</span>
            {i < SPINE.length - 1 ? <span className="text-slate-400" aria-hidden>↓</span> : null}
          </li>
        ))}
      </ol>
    </Panel>
  );
}

/** Hero: flanking workloads → one engine → mismatch */
export function HeroOneEngineDiagram() {
  const { fork } = C.mismatch;
  return (
    <Panel className="flex min-h-[240px] flex-col p-4 sm:p-5">
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Application serving + analytics</p>
      <div className="relative mt-4 flex-1">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <path d="M 70 50 L 200 70" fill="none" stroke="currentColor" className="text-teal-700/50 dark:text-teal-400/40" strokeWidth="1" />
          <path d="M 330 50 L 200 70" fill="none" stroke="currentColor" className="text-slate-400" strokeWidth="1" />
          <path d="M 200 110 L 200 145" fill="none" stroke="currentColor" className="text-teal-700/60 dark:text-teal-400/50" strokeWidth="1" />
        </svg>
        <div className="relative grid h-full grid-cols-3 grid-rows-[1fr_auto_auto] items-start gap-2">
          <div className="col-start-1 row-start-1 pt-1 text-right">
            <p className="text-[9px] font-bold uppercase text-teal-900 dark:text-teal-300">{fork.left.title}</p>
            <ul className="mt-1 space-y-0.5 text-[11px] text-slate-800 dark:text-slate-200">
              {fork.left.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="col-start-2 row-start-2 flex justify-center">
            <div className="border-2 border-slate-800 bg-slate-900 px-5 py-4 text-center dark:border-slate-500">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">One engine</p>
              <p className="mt-1 text-sm font-bold uppercase text-white">{fork.hub}</p>
            </div>
          </div>
          <div className="col-start-3 row-start-1 pt-1 text-left">
            <p className="text-[9px] font-bold uppercase text-slate-600 dark:text-slate-400">{fork.right.title}</p>
            <ul className="mt-1 space-y-0.5 text-[11px] text-slate-800 dark:text-slate-200">
              {fork.right.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <p className="col-span-3 row-start-3 text-center text-[10px] font-bold uppercase tracking-[0.28em] text-teal-900 dark:text-teal-300">
            {fork.bottom}
          </p>
        </div>
      </div>
    </Panel>
  );
}

export function InvestigationSignal() {
  return (
    <Panel>
      <div className="grid min-w-0 lg:grid-cols-12">
        <div className="border-b border-slate-200 px-4 py-5 dark:border-slate-800 lg:col-span-3 lg:border-b-0 lg:border-r lg:py-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Cost signal</p>
          <p className="mt-2 text-[clamp(2.75rem,8vw,3.75rem)] font-semibold leading-none tracking-tighter text-slate-950 dark:text-white">
            {C.signal.metric}
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{C.signal.metricLabel}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-px flex-1 bg-slate-300 dark:bg-slate-600" />
            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-teal-800 dark:text-teal-400">High-frequency access</span>
            <span className="h-px flex-1 bg-slate-300 dark:bg-slate-600" />
          </div>
        </div>

        <div className="border-b border-slate-200 px-4 py-5 dark:border-slate-800 lg:col-span-5 lg:border-b-0 lg:py-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Evidence path</p>
          <div className="mt-3 flex flex-col items-center gap-0 sm:items-start">
            {C.signal.nodes.map((node, i) => (
              <React.Fragment key={node.id}>
                <Node label={node.label} sub={node.sub} accent={node.emphasis} className="w-full max-w-[11rem]" />
                {i < C.signal.nodes.length - 1 ? (
                  <span className="py-0.5 text-teal-700 dark:text-teal-400" aria-hidden>
                    ↓
                  </span>
                ) : null}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="px-4 py-5 lg:col-span-4 lg:border-l lg:py-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Cost context</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900 dark:text-white">{C.signal.serviceTotal}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{C.signal.costNote}</p>
          <div className="relative mt-3 aspect-[16/10] w-full overflow-hidden border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
            <Image src={OLAP_COST_EVIDENCE_IMAGE} alt={C.signal.costImageAlt} fill className="object-contain p-1" sizes="280px" />
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function WorkloadMismatch() {
  const { fork } = C.mismatch;
  return (
    <div className="min-w-0 space-y-5">
      <Panel className="p-4 sm:p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border-b border-slate-200 pb-4 dark:border-slate-700 md:border-b-0 md:border-r md:pb-0 md:pr-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-900 dark:text-teal-300">{fork.left.title}</p>
            <ul className="mt-3 space-y-2">
              {fork.left.items.map((x) => (
                <li key={x} className="flex gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                  <span className="text-teal-700 dark:text-teal-400">—</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">{fork.right.title}</p>
            <ul className="mt-3 space-y-2">
              {fork.right.items.map((x) => (
                <li key={x} className="flex gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                  <span className="text-slate-400">—</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center border-t border-slate-200 pt-5 dark:border-slate-700">
          <span className="text-slate-500" aria-hidden>
            ↓
          </span>
          <div className="mt-2 border-2 border-slate-800 bg-slate-900 px-8 py-2.5 dark:border-slate-500">
            <p className="text-xs font-bold uppercase tracking-wider text-white">{fork.hub}</p>
          </div>
          <span className="mt-2 text-slate-500" aria-hidden>
            ↓
          </span>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.3em] text-teal-900 dark:text-teal-300">{fork.bottom}</p>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-600 dark:text-slate-400">{C.mismatch.pre}</p>
          <h2 id="olap-mismatch" className="mt-2 text-[clamp(1.5rem,3.5vw,2.1rem)] font-semibold uppercase leading-[1.06] tracking-tight text-slate-950 dark:text-white">
            {C.mismatch.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 lg:border-l lg:border-slate-200 lg:pl-6 dark:lg:border-slate-800">
          {C.mismatch.summary}
        </p>
      </div>
    </div>
  );
}

function BenchmarkBar({ label, value, rowMax, isFastest }) {
  const n = workloadNumeric(value);
  const width = n != null && rowMax > 0 ? Math.max(3, Math.round((n / rowMax) * 100)) : 0;
  return (
    <div className="grid grid-cols-[4.75rem_1fr_4.25rem] items-center gap-2">
      <span className="text-[9px] font-semibold uppercase text-slate-600 dark:text-slate-400">{label}</span>
      <div className="h-1.5 bg-slate-200 dark:bg-slate-800">
        <div
          className={cn("h-full", isFastest ? "bg-teal-700 dark:bg-teal-500" : "bg-slate-400/75 dark:bg-slate-500/70")}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className={cn("text-right text-[11px] font-semibold tabular-nums", isFastest && "text-teal-900 dark:text-teal-300")}>
        {value}
      </span>
    </div>
  );
}

export function BenchmarkComparison() {
  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{C.benchmark.pre}</p>
          <h2 id="olap-bench" className="mt-1 text-lg font-semibold uppercase tracking-tight text-slate-950 dark:text-white">
            {C.benchmark.headline}
          </h2>
        </div>
        <ul className="flex flex-wrap gap-x-3 text-[10px] text-slate-500">
          {C.benchmark.config.map((cfg) => (
            <li key={cfg}>{cfg}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {C.benchmark.rows.map((row, i) => {
          const nums = BENCHMARK_ENGINES.map((e) => workloadNumeric(row[e.key])).filter((x) => x != null);
          const rowMax = nums.length ? Math.max(...nums) : 0;
          const fastest = rowMax ? Math.min(...nums) : null;
          return (
            <Panel key={`${row.workload}-${i}`} className="px-3 py-3 sm:px-4">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{row.workload}</p>
              <div className="mt-2 space-y-1">
                {BENCHMARK_ENGINES.map((e) => {
                  const n = workloadNumeric(row[e.key]);
                  return (
                    <BenchmarkBar
                      key={e.key}
                      label={e.label}
                      value={row[e.key]}
                      rowMax={rowMax}
                      isFastest={n != null && n === fastest && nums.length > 1}
                    />
                  );
                })}
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

export function WorkloadShapeConclusion() {
  const branches = C.decision.tradeoffs;

  return (
    <Panel className="overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <div className="border-b border-slate-200 px-5 py-6 dark:border-slate-800 lg:border-b-0 lg:border-r lg:py-8">
          <p className="text-xl font-semibold uppercase leading-tight tracking-tight text-slate-950 dark:text-white sm:text-2xl">
            {C.benchmark.verdict}
          </p>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{C.benchmark.closing}</p>
        </div>
        <div className="px-5 py-6 lg:py-8">
          <p className="text-center text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">Workload shape</p>
          <svg className="mx-auto mt-3 block w-full max-w-sm" viewBox="0 0 320 140" aria-hidden>
            <path d="M 160 8 L 160 36" fill="none" stroke="currentColor" className="text-slate-400" strokeWidth="1" />
            <path d="M 160 36 L 40 56" fill="none" stroke="currentColor" className="text-slate-400" strokeWidth="1" />
            <path d="M 160 36 L 120 56" fill="none" stroke="currentColor" className="text-slate-400" strokeWidth="1" />
            <path d="M 160 36 L 200 56" fill="none" stroke="currentColor" className="text-slate-400" strokeWidth="1" />
            <path d="M 160 36 L 280 56" fill="none" stroke="currentColor" className="text-slate-400" strokeWidth="1" />
          </svg>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {branches.map((b) => (
              <div key={b.engine} className="border border-slate-200 bg-white px-1.5 py-2 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-[8px] font-bold uppercase text-teal-800 dark:text-teal-400">{b.role}</p>
                <p className="mt-1 text-[10px] font-bold uppercase text-slate-900 dark:text-white">{b.engine}</p>
                <p className="mt-0.5 text-[9px] leading-snug text-slate-600 dark:text-slate-400">{b.points[0]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function BeforeAfterTransformation() {
  const { fork } = C.mismatch;
  return (
    <div className="grid min-w-0 gap-0 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
      <Panel className="p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">Before</p>
        <div className="mt-4 flex flex-col items-center text-center">
          <div className="w-full max-w-[12rem] border-2 border-slate-800 bg-slate-900 py-3 dark:border-slate-500">
            <p className="text-xs font-bold uppercase text-white">{fork.hub}</p>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
            {fork.left.title} + {fork.right.title.toLowerCase()}
          </p>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">Workload collision</p>
        </div>
      </Panel>
      <div className="flex items-center justify-center px-3 py-4 lg:py-0">
        <span className="text-2xl font-light text-teal-800 dark:text-teal-400" aria-hidden>
          →
        </span>
      </div>
      <Panel className="border-teal-800/30 p-5 dark:border-teal-500/35">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-teal-800 dark:text-teal-400">After · PoC direction</p>
        <div className="mt-4 flex flex-col items-center gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
          <Node label="Application" className="w-full max-w-[11rem]" />
          <span className="text-slate-400">↓</span>
          <p className="text-[9px] font-medium normal-case text-slate-500">Point reads</p>
          <Node label="DynamoDB" sub={C.architecture.servingLabel} accent className="w-full max-w-[11rem]" />
          <span className="my-1 text-slate-400">+</span>
          <p className="text-[9px] font-medium normal-case text-slate-500">Data pipeline</p>
          <Node label="S3 Tables" className="w-full max-w-[11rem]" />
          <span className="text-slate-400">↓</span>
          <Node label="Athena / Presto" sub={C.architecture.analyticsLabel} className="w-full max-w-[11rem]" />
          <span className="text-slate-400">↓</span>
          <Node label="BI / Analytics" className="w-full max-w-[11rem]" />
        </div>
        <p className="mt-4 text-center text-[9px] uppercase text-slate-500">Investigated · not production migration</p>
      </Panel>
    </div>
  );
}

export function ArchitectureDiagram() {
  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">{C.architecture.eyebrow}</p>
        <span className="border border-dashed border-slate-400 px-2 py-0.5 text-[8px] font-semibold uppercase text-slate-600 dark:border-slate-500">
          PoC
        </span>
      </div>
      <div className="relative px-2 py-6 sm:px-4 sm:py-8">
        <svg className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block" viewBox="0 0 800 280" preserveAspectRatio="none" aria-hidden>
          <path d="M 400 28 L 400 52" fill="none" stroke="#94a3b8" strokeWidth="1" />
          <path d="M 400 52 L 180 52 L 180 88" fill="none" stroke="#0f766e" strokeWidth="1" opacity="0.65" />
          <path d="M 400 52 L 620 52 L 620 88" fill="none" stroke="#94a3b8" strokeWidth="1" />
          <path d="M 620 118 L 620 148" fill="none" stroke="#94a3b8" strokeWidth="1" />
          <path d="M 620 178 L 620 208" fill="none" stroke="#94a3b8" strokeWidth="1" />
          <text x="248" y="48" fill="#0f766e" fontSize="10" fontWeight="700">
            Point reads
          </text>
          <text x="468" y="48" fill="#64748b" fontSize="10" fontWeight="700">
            Data pipeline
          </text>
        </svg>

        <div className="relative mx-auto max-w-3xl sm:max-w-none">
          <div className="flex justify-center">
            <Node label="Application" className="min-w-[10rem]" />
          </div>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 sm:gap-6">
            <div className="flex flex-col items-center sm:items-end sm:pr-4">
              <p className="mb-2 text-[9px] font-bold uppercase text-teal-800 sm:hidden dark:text-teal-400">Point reads</p>
              <div className="h-6 w-px bg-teal-700/60 sm:hidden" aria-hidden />
              <Node label="DynamoDB" sub={C.architecture.servingLabel} accent className="mt-2 w-full max-w-[14rem]" />
            </div>
            <div className="flex flex-col items-center sm:items-start sm:pl-4">
              <p className="mb-2 text-[9px] font-bold uppercase text-slate-500 sm:hidden">Data pipeline</p>
              <div className="h-6 w-px bg-slate-400 sm:hidden" aria-hidden />
              <Node label="S3 Tables" className="mt-2 w-full max-w-[14rem]" />
              <div className="mt-3 h-6 w-px bg-slate-400" aria-hidden />
              <Node label="Athena / Presto" sub={C.architecture.analyticsLabel} className="w-full max-w-[14rem]" />
              <div className="mt-3 h-6 w-px bg-slate-400" aria-hidden />
              <Node label="BI / Analytics" className="w-full max-w-[14rem]" />
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function EngineDecisionMatrix() {
  return (
    <div className="min-w-0 overflow-x-auto">
      <div className="min-w-[600px] border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-[5.5rem_5rem_1fr_1.15fr] gap-2 border-b border-slate-200 bg-slate-100/90 px-3 py-2.5 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:border-slate-800 dark:bg-slate-900/80">
          <span>Engine</span>
          <span>Best for</span>
          <span>Strength</span>
          <span>Trade-off</span>
        </div>
        {C.decision.tradeoffs.map((t) => (
          <div
            key={t.engine}
            className="grid grid-cols-[5.5rem_5rem_1fr_1.15fr] gap-2 border-b border-slate-100 px-3 py-3 last:border-b-0 dark:border-slate-800/80"
          >
            <p className="text-xs font-bold text-slate-950 dark:text-white">{t.engine}</p>
            <p className="bg-teal-50/90 px-1 py-1 text-[9px] font-bold uppercase leading-snug text-teal-900 dark:bg-teal-950/40 dark:text-teal-300">
              {t.role}
            </p>
            <ul className="text-xs text-slate-800 dark:text-slate-200">
              {t.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">{t.tradeoff}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OpenQuestions() {
  return (
    <Panel className="mt-4 px-4 py-4">
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Still open</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {C.decision.stillOpen.map((item) => (
          <li key={item} className="border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700 dark:border-slate-700 dark:text-slate-300">
            {item}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function FinalTakeaway() {
  return (
    <Panel className="px-5 py-8 sm:px-8 sm:py-10">
      <p className="text-sm font-semibold uppercase leading-snug tracking-tight text-slate-600 dark:text-slate-400 sm:text-base">
        {C.final.line1.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </p>
      <p className="mt-5 max-w-3xl text-[clamp(1.15rem,3vw,1.75rem)] font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white">
        {C.final.line2.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </p>
    </Panel>
  );
}
