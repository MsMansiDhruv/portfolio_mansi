"use client";

import React from "react";
import Image from "next/image";
import { OLAP_CASE_STUDY, OLAP_COST_EVIDENCE_IMAGE } from "@/lib/data/olap-case-study";
import { cn } from "@/lib/cn";
import { BENCHMARK_ENGINES, workloadNumeric } from "@/components/projects/olap/benchmark-utils";

const C = OLAP_CASE_STUDY;

const STROKE = "stroke-slate-400 dark:stroke-slate-500";
const STROKE_TEAL = "stroke-teal-700/80 dark:stroke-teal-400/70";

function VLine({ className, teal }) {
  return <div className={cn("w-px bg-slate-300 dark:bg-slate-600", teal && "bg-teal-600/70 dark:bg-teal-400/60", className)} aria-hidden />;
}

/** Full-width hero: title block + poster-style problem diagram */
export function ProblemHero() {
  const { fork } = C.mismatch;
  return (
    <header className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800/90 dark:text-teal-400/90">{C.eyebrow}</p>
      <h1 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
        {C.titleLine1}
        <br />
        {C.titleLine2}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">{C.subtitle}</p>

      <div className="relative mt-12 min-h-[min(52vh,420px)] w-full">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <path d="M 120 120 L 450 160" fill="none" className={STROKE_TEAL} strokeWidth="1" />
          <path d="M 780 120 L 450 160" fill="none" className={STROKE} strokeWidth="1" />
          <path d="M 450 200 L 450 260" fill="none" className={STROKE_TEAL} strokeWidth="1" />
          <rect x="370" y="160" width="160" height="44" fill="none" className={STROKE} strokeWidth="1.5" />
        </svg>

        <div className="relative grid h-full grid-cols-1 grid-rows-[auto_1fr_auto] gap-4 md:grid-cols-3 md:grid-rows-1 md:items-center">
          <div className="md:pr-8 md:text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-900 dark:text-teal-300">Serving</p>
            <p className="mt-1 text-[10px] font-semibold uppercase text-slate-500">{fork.left.title}</p>
            <ul className="mt-4 space-y-2 text-sm font-medium text-slate-800 dark:text-slate-200 md:ml-auto md:max-w-[12rem]">
              {fork.left.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center py-6 md:py-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">One engine</p>
            <p className="mt-2 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold uppercase tracking-tight text-slate-950 dark:text-white">
              {fork.hub}
            </p>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.35em] text-teal-900 dark:text-teal-300">{fork.bottom}</p>
          </div>

          <div className="md:pl-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Analytics</p>
            <p className="mt-1 text-[10px] font-semibold uppercase text-slate-500">{fork.right.title}</p>
            <ul className="mt-4 space-y-2 text-sm font-medium text-slate-800 dark:text-slate-200 md:max-w-[12rem]">
              {fork.right.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export function SignalSection() {
  return (
    <section className="min-w-0" aria-label="Investigation signal">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <p className="text-[clamp(4rem,14vw,7rem)] font-semibold leading-none tracking-tighter text-slate-950 dark:text-white">
            {C.signal.metric}
          </p>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">{C.signal.metricLabel}</p>
          <div className="mt-8 max-w-xs">
            <p className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">{C.signal.serviceTotal}</p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Cost context</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{C.signal.costNote}</p>
            <div className="relative mt-4 aspect-[16/10] w-full max-w-[280px]">
              <Image src={OLAP_COST_EVIDENCE_IMAGE} alt={C.signal.costImageAlt} fill className="object-contain object-left" sizes="280px" />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-start pl-0 lg:pl-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Investigation trail</p>
          <div className="mt-6 flex flex-col items-start">
            {C.signal.nodes.map((node, i) => (
              <React.Fragment key={node.id}>
                <p
                  className={cn(
                    "text-sm font-bold uppercase tracking-wide",
                    node.emphasis ? "text-teal-900 dark:text-teal-300" : "text-slate-900 dark:text-white"
                  )}
                >
                  {node.sub ? `${node.label} ${node.sub}` : node.label}
                </p>
                {i < C.signal.nodes.length - 1 ? <VLine className="my-2 h-5" teal={i === C.signal.nodes.length - 2} /> : null}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkloadMismatch() {
  const { fork } = C.mismatch;
  return (
    <section className="min-w-0" aria-labelledby="olap-mismatch">
      <div className="relative mx-auto w-full max-w-4xl py-4">
        <svg className="mx-auto block w-full max-w-2xl" viewBox="0 0 480 320" aria-hidden>
          <circle cx="240" cy="48" r="6" className="fill-slate-900 dark:fill-white" />
          <text x="240" y="32" textAnchor="middle" className="fill-slate-900 text-[11px] font-bold dark:fill-white" fontSize="11">
            {fork.hub.toUpperCase()}
          </text>
          <path d="M 240 54 L 240 72" fill="none" className={STROKE} strokeWidth="1" />
          <path d="M 240 72 L 80 72 L 80 100" fill="none" className={STROKE_TEAL} strokeWidth="1" />
          <path d="M 240 72 L 400 72 L 400 100" fill="none" className={STROKE} strokeWidth="1" />
          <circle cx="80" cy="108" r="5" className="fill-teal-700 dark:fill-teal-400" />
          <circle cx="400" cy="108" r="5" className="fill-slate-400" />
          <path d="M 80 113 L 80 140" fill="none" className={STROKE_TEAL} strokeWidth="1" />
          <path d="M 400 113 L 400 140" fill="none" className={STROKE} strokeWidth="1" />
        </svg>

        <div className="mt-2 grid grid-cols-2 gap-8 text-center sm:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-900 dark:text-teal-300">Serving</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-800 dark:text-slate-200">
              {fork.left.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Analytics</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-800 dark:text-slate-200">
              {fork.right.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 space-y-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">One engine</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Two very different access patterns</p>
          <p className="text-lg font-bold uppercase tracking-[0.2em] text-teal-900 dark:text-teal-300">{fork.bottom}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{C.mismatch.pre}</p>
          <h2 id="olap-mismatch" className="mt-2 text-xl font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white sm:text-2xl">
            {C.mismatch.headline.join(" ")}
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{C.mismatch.summary}</p>
      </div>
    </section>
  );
}

function BenchmarkBars({ row }) {
  const nums = BENCHMARK_ENGINES.map((e) => workloadNumeric(row[e.key])).filter((x) => x != null);
  const rowMax = nums.length ? Math.max(...nums) : 0;
  const fastest = rowMax ? Math.min(...nums) : null;

  return (
    <div className="space-y-3">
      {BENCHMARK_ENGINES.map((e) => {
        const n = workloadNumeric(row[e.key]);
        const width = n != null && rowMax > 0 ? Math.max(2, (n / rowMax) * 100) : 0;
        const isFast = n != null && n === fastest && nums.length > 1;
        return (
          <div key={e.key}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">{e.label}</span>
              <span className={cn("text-sm font-semibold tabular-nums", isFast && "text-teal-900 dark:text-teal-300")}>{row[e.key]}</span>
            </div>
            <div className="mt-1.5 h-2 w-full bg-slate-200/80 dark:bg-slate-800">
              <div
                className={cn("h-full", isFast ? "bg-teal-700 dark:bg-teal-500" : "bg-slate-500/60 dark:bg-slate-500/50")}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BenchmarkViz() {
  return (
    <section className="min-w-0" aria-labelledby="olap-bench">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{C.benchmark.pre}</p>
      <h2 id="olap-bench" className="mt-1 text-xl font-semibold uppercase tracking-tight text-slate-950 dark:text-white">
        {C.benchmark.headline}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-x-6 text-[11px] text-slate-500">
        {C.benchmark.config.map((cfg) => (
          <li key={cfg}>{cfg}</li>
        ))}
      </ul>

      <div className="mt-10 space-y-12">
        {C.benchmark.rows.map((row, i) => (
          <div key={`${row.workload}-${i}`}>
            <p className="text-lg font-bold uppercase tracking-tight text-slate-950 dark:text-white">{row.workload}</p>
            <div className="mt-4 max-w-2xl">
              <BenchmarkBars row={row} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DecisionMap() {
  const paths = [
    { shape: C.decision.tradeoffs[0].points[0], engine: C.decision.tradeoffs[0].engine },
    { shape: C.decision.tradeoffs[1].points.join(" / "), engine: C.decision.tradeoffs[1].engine },
    { shape: C.decision.tradeoffs[2].points[0], engine: `${C.decision.tradeoffs[2].engine} / ${C.decision.tradeoffs[3].engine}` },
  ];

  return (
    <section className="min-w-0 border-t border-slate-200 pt-12 dark:border-slate-800">
      <p className="text-center text-2xl font-semibold uppercase tracking-tight text-slate-950 dark:text-white sm:text-3xl">
        {C.benchmark.verdict}
      </p>
      <p className="mt-3 text-center text-sm font-medium uppercase tracking-[0.12em] text-slate-600 dark:text-slate-400">
        {C.benchmark.closing}
      </p>

      <div className="mx-auto mt-12 flex max-w-md flex-col items-center gap-0">
        {paths.map((p, i) => (
          <React.Fragment key={p.shape}>
            <p className="text-center text-[11px] font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">{p.shape}</p>
            <VLine className="my-2 h-4" teal />
            <p className="text-center text-sm font-bold uppercase text-teal-900 dark:text-teal-300">{p.engine}</p>
            {i < paths.length - 1 ? <VLine className="my-4 h-6" /> : null}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

export function ArchitectureDiagram() {
  return (
    <section className="min-w-0 py-4" aria-labelledby="olap-arch">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{C.architecture.eyebrow}</p>
      <h2 id="olap-arch" className="mt-2 max-w-2xl text-lg font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white sm:text-xl">
        {C.architecture.headline.join(" ")}
      </h2>
      <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-500">PoC direction · not production migration</p>

      <div className="relative mt-10 w-full">
        <svg className="hidden w-full md:block" viewBox="0 0 900 340" aria-hidden>
          <path d="M 450 20 L 450 50" fill="none" className={STROKE} strokeWidth="1" />
          <path d="M 450 50 L 220 50 L 220 100" fill="none" className={STROKE_TEAL} strokeWidth="1.25" />
          <path d="M 450 50 L 680 50 L 680 100" fill="none" className={STROKE} strokeWidth="1" />
          <path d="M 680 130 L 680 160" fill="none" className={STROKE} strokeWidth="1" />
          <path d="M 680 190 L 680 220" fill="none" className={STROKE} strokeWidth="1" />
          <path d="M 680 250 L 680 280" fill="none" className={STROKE} strokeWidth="1" />
          <text x="280" y="44" fill="#0f766e" fontSize="10" fontWeight="600">
            Point reads
          </text>
          <text x="520" y="44" fill="#64748b" fontSize="10" fontWeight="600">
            Data pipeline
          </text>
        </svg>

        <div className="flex flex-col items-center md:min-h-[300px]">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">Application</p>
          <VLine className="my-3 h-6" />

          <div className="grid w-full gap-12 md:grid-cols-2 md:gap-24">
            <div className="flex flex-col items-center md:items-end">
              <p className="mb-2 text-[10px] font-bold uppercase text-teal-800 dark:text-teal-400">{C.architecture.servingLabel}</p>
              <p className="text-sm font-bold uppercase text-slate-900 dark:text-white">DynamoDB</p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <p className="mb-2 text-[10px] font-bold uppercase text-slate-500">Data pipeline</p>
              <p className="text-sm font-bold uppercase text-slate-900 dark:text-white">S3 Tables</p>
              <VLine className="my-3 h-5" />
              <p className="text-sm font-bold uppercase text-slate-900 dark:text-white">Athena / Presto</p>
              <p className="mt-1 text-[10px] uppercase text-slate-500">{C.architecture.analyticsLabel}</p>
              <VLine className="my-3 h-5" />
              <p className="text-sm font-bold uppercase text-slate-900 dark:text-white">BI / Analytics</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BeforeAfter() {
  const { fork } = C.mismatch;
  return (
    <section className="min-w-0">
      <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
        <div className="text-center md:text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Before</p>
          <p className="mt-4 text-2xl font-semibold uppercase tracking-tight text-slate-950 dark:text-white">{fork.hub}</p>
          <p className="mt-2 text-xs uppercase text-slate-600 dark:text-slate-400">
            {fork.left.title} + {fork.right.title.toLowerCase()}
          </p>
          <VLine className="mx-auto my-4 h-8 md:ml-auto md:mr-0" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">Workload collision</p>
        </div>

        <p className="hidden text-3xl font-light text-teal-800 md:block dark:text-teal-400" aria-hidden>
          →
        </p>

        <div className="text-center md:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-teal-800 dark:text-teal-400">After · PoC</p>
          <div className="mt-4 inline-flex flex-col items-center gap-0 text-left md:items-start">
            <p className="text-sm font-bold uppercase">Application</p>
            <div className="flex gap-8 pl-2">
              <div>
                <VLine className="h-4" teal />
                <p className="text-[10px] uppercase text-slate-500">Point reads</p>
                <p className="text-sm font-bold uppercase text-teal-900 dark:text-teal-300">DynamoDB</p>
              </div>
              <div>
                <VLine className="h-4" />
                <p className="text-[10px] uppercase text-slate-500">Data pipeline</p>
                <p className="text-sm font-bold uppercase">S3 Tables</p>
                <VLine className="my-2 h-4" />
                <p className="text-sm font-bold uppercase">Athena / Presto</p>
                <VLine className="my-2 h-4" />
                <p className="text-sm font-bold uppercase">Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EngineMatrix() {
  return (
    <section className="min-w-0" aria-labelledby="olap-decision">
      <div className="space-y-0 divide-y divide-slate-200 dark:divide-slate-800">
        {C.decision.tradeoffs.map((t) => (
          <div key={t.engine} className="grid gap-4 py-6 sm:grid-cols-[7rem_6rem_1fr_minmax(0,1.1fr)] sm:gap-6">
            <p className="text-base font-bold text-slate-950 dark:text-white">{t.engine}</p>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-500">Best for</p>
              <p className="mt-1 text-[11px] font-bold uppercase text-teal-900 dark:text-teal-300">{t.role}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-500">Strength</p>
              <ul className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                {t.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-500">Trade-off</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.tradeoff}</p>
            </div>
          </div>
        ))}
      </div>
      <p id="olap-decision" className="mt-8 text-base font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white">
        {C.decision.headline.join(" ")}
      </p>
      <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Still open</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{C.decision.stillOpen.join(" · ")}</p>
    </section>
  );
}

const RECAP = ["One engine", "Workload mismatch", "Benchmark", "Workload-specific architecture"];

export function FinalInsight() {
  return (
    <section className="min-w-0 border-t border-slate-200 pt-12 dark:border-slate-800">
      <p className="max-w-3xl text-base font-semibold uppercase leading-snug tracking-tight text-slate-600 dark:text-slate-400 sm:text-lg">
        {C.final.line1.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </p>
      <p className="mt-6 max-w-3xl text-[clamp(1.35rem,3.5vw,2.25rem)] font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white">
        {C.final.line2.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {RECAP.map((step, i) => (
          <React.Fragment key={step}>
            <span>{step}</span>
            {i < RECAP.length - 1 ? <span className="text-teal-700 dark:text-teal-400">↓</span> : null}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

export function StoryDivider() {
  return <div className="my-14 h-px w-full bg-slate-200 dark:bg-slate-800" aria-hidden />;
}
