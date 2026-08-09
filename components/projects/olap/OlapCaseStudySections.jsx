"use client";

import React from "react";
import Image from "next/image";
import { OLAP_CASE_STUDY, OLAP_COST_EVIDENCE_IMAGE } from "@/lib/data/olap-case-study";
import { cn } from "@/lib/cn";
import { BENCHMARK_ENGINES, workloadNumeric } from "@/components/projects/olap/benchmark-utils";

const C = OLAP_CASE_STUDY;

const stroke = { neutral: "stroke-slate-400 dark:stroke-slate-500", teal: "stroke-teal-700 dark:stroke-teal-500" };

function ArrowDown({ teal, className }) {
  return (
    <span className={cn("text-lg leading-none", teal ? "text-teal-700 dark:text-teal-400" : "text-slate-400", className)} aria-hidden>
      ↓
    </span>
  );
}

/** Split hero: narrative left, vertical “problem at a glance” right */
export function ProblemHero() {
  const { fork } = C.mismatch;
  return (
    <header className="min-w-0">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800/90 dark:text-teal-400/90">{C.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(1.9rem,4.5vw,2.85rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
            {C.titleLine1}
            <br />
            {C.titleLine2}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400">{C.subtitle}</p>
          <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">{C.eyebrow}</p>
        </div>

        <div className="flex flex-col items-center text-center lg:items-end lg:pr-4 lg:text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-900 dark:text-teal-300">{fork.left.title}</p>
          <ul className="mt-2 space-y-0.5 text-sm text-slate-800 dark:text-slate-200">
            {fork.left.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <ArrowDown teal className="my-3" />
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">One engine</p>
          <p className="mt-1 text-2xl font-semibold uppercase tracking-tight text-slate-950 dark:text-white">{fork.hub}</p>
          <ArrowDown className="my-3" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">{fork.right.title}</p>
          <ul className="mt-2 space-y-0.5 text-sm text-slate-800 dark:text-slate-200">
            {fork.right.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.32em] text-teal-900 dark:text-teal-300">{fork.bottom}</p>
        </div>
      </div>
    </header>
  );
}

/** 60K evidence + trail + secondary cost */
export function SignalSection() {
  return (
    <section className="min-w-0 pt-16 md:pt-20" aria-label="Investigation signal">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="text-[clamp(3.5rem,12vw,6.5rem)] font-semibold leading-none tracking-tighter text-slate-950 dark:text-white">
            {C.signal.metric}
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">{C.signal.metricLabel}</p>
        </div>

        <div className="flex flex-col items-start lg:col-span-4 lg:pl-4">
          {C.signal.nodes.map((node, i) => (
            <React.Fragment key={node.id}>
              <p
                className={cn(
                  "text-[13px] font-bold uppercase tracking-wide",
                  node.emphasis ? "text-teal-900 dark:text-teal-300" : "text-slate-900 dark:text-white"
                )}
              >
                {node.sub ? `${node.label} · ${node.sub}` : node.label}
              </p>
              {i < C.signal.nodes.length - 1 ? <ArrowDown teal={node.id === "lookup"} className="my-1.5 text-base" /> : null}
            </React.Fragment>
          ))}
        </div>

        <div className="lg:col-span-3 lg:border-l lg:border-slate-200 lg:pl-6 dark:lg:border-slate-800">
          <p className="text-lg font-semibold tabular-nums text-slate-800 dark:text-slate-200">{C.signal.serviceTotal}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{C.signal.costNote}</p>
          <div className="relative mt-4 aspect-[16/10] w-full max-w-[220px]">
            <Image src={OLAP_COST_EVIDENCE_IMAGE} alt={C.signal.costImageAlt} fill className="object-contain object-left opacity-95" sizes="220px" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Converging workloads on one engine */
export function WorkloadMismatch() {
  const { fork } = C.mismatch;
  return (
    <section className="min-w-0 pt-16 md:pt-20" aria-labelledby="olap-mismatch">
      <div className="relative mx-auto max-w-3xl">
        <svg className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block" viewBox="0 0 600 280" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <path d="M 100 200 L 300 120" fill="none" className={stroke.teal} strokeWidth="1" />
          <path d="M 500 200 L 300 120" fill="none" className={stroke.neutral} strokeWidth="1" />
          <path d="M 300 120 L 300 200" fill="none" className={stroke.neutral} strokeWidth="1" />
        </svg>

        <div className="relative grid gap-10 sm:grid-cols-[1fr_auto_1fr] sm:items-end sm:gap-6">
          <div className="sm:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-900 dark:text-teal-300">Application serving</p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-800 dark:text-slate-200">
              {fork.left.items.map((x) => (
                <li key={x}>· {x}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center py-4 sm:py-0">
            <p className="text-3xl font-semibold uppercase tracking-tight text-slate-950 dark:text-white">{fork.hub}</p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">One engine</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">Analytics</p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-800 dark:text-slate-200">
              {fork.right.items.map((x) => (
                <li key={x}>· {x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-3xl">
        <p className="text-sm text-slate-600 dark:text-slate-400">{C.mismatch.pre}</p>
        <h2 id="olap-mismatch" className="mt-2 text-[clamp(1.35rem,3.2vw,2rem)] font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white">
          {C.mismatch.headline.join(" ")}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{C.mismatch.summary}</p>
      </div>
    </section>
  );
}

function BenchmarkBars({ row }) {
  const nums = BENCHMARK_ENGINES.map((e) => workloadNumeric(row[e.key])).filter((x) => x != null);
  const rowMax = nums.length ? Math.max(...nums) : 0;
  const fastest = rowMax ? Math.min(...nums) : null;

  return (
    <div className="mt-3 space-y-2.5">
      {BENCHMARK_ENGINES.map((e) => {
        const n = workloadNumeric(row[e.key]);
        const width = n != null && rowMax > 0 ? Math.max(2, (n / rowMax) * 100) : 0;
        const isFast = n != null && n === fastest && nums.length > 1;
        return (
          <div key={e.key} className="grid grid-cols-[5rem_1fr_auto] items-center gap-3">
            <span className="text-[10px] font-bold uppercase text-slate-500">{e.label}</span>
            <div className="h-1.5 bg-slate-200 dark:bg-slate-800">
              <div className={cn("h-full", isFast ? "bg-teal-700 dark:bg-teal-500" : "bg-slate-400/70")} style={{ width: `${width}%` }} />
            </div>
            <span className={cn("text-xs font-semibold tabular-nums", isFast && "text-teal-900 dark:text-teal-300")}>{row[e.key]}</span>
          </div>
        );
      })}
    </div>
  );
}

export function BenchmarkViz() {
  return (
    <section className="min-w-0 pt-16 md:pt-20" aria-labelledby="olap-bench">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{C.benchmark.pre}</p>
          <h2 id="olap-bench" className="mt-1 text-lg font-semibold uppercase text-slate-950 dark:text-white">
            {C.benchmark.headline}
          </h2>
        </div>
        <ul className="text-[11px] text-slate-500">
          {C.benchmark.config.map((cfg) => (
            <li key={cfg}>{cfg}</li>
          ))}
        </ul>
      </div>

      <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-2">
        {C.benchmark.rows.map((row, i) => (
          <div key={`${row.workload}-${i}`}>
            <p className="text-base font-bold uppercase text-slate-950 dark:text-white">{row.workload}</p>
            <BenchmarkBars row={row} />
          </div>
        ))}
      </div>

      <div className="mt-14 max-w-2xl border-l-2 border-teal-700 pl-5 dark:border-teal-500">
        <p className="text-xl font-semibold uppercase tracking-tight text-slate-950 dark:text-white sm:text-2xl">{C.benchmark.verdict}</p>
        <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">{C.benchmark.closing}</p>
      </div>
    </section>
  );
}

/** Branching architecture — visual centerpiece */
export function ArchitectureDiagram() {
  return (
    <section className="min-w-0 pt-16 md:pt-24" aria-labelledby="olap-arch">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{C.architecture.eyebrow}</p>
      <h2 id="olap-arch" className="mt-2 max-w-xl text-lg font-semibold uppercase leading-snug text-slate-950 dark:text-white">
        {C.architecture.headline.join(" ")}
      </h2>
      <p className="mt-1 text-[11px] text-slate-500">PoC direction · not production migration</p>

      <div className="relative mt-12 w-full">
        <svg className="mx-auto hidden w-full max-w-4xl md:block" viewBox="0 0 720 300" role="img" aria-label="Workload separation architecture">
          <path d="M 360 24 L 360 56" fill="none" className={stroke.neutral} strokeWidth="1" />
          <path d="M 360 56 L 360 72" fill="none" className={stroke.neutral} strokeWidth="1" />
          <path d="M 360 72 L 180 72 L 180 120" fill="none" className={stroke.teal} strokeWidth="1.25" />
          <path d="M 360 72 L 540 72 L 540 120" fill="none" className={stroke.neutral} strokeWidth="1" />
          <path d="M 540 148 L 540 176" fill="none" className={stroke.neutral} strokeWidth="1" />
          <path d="M 540 204 L 540 232" fill="none" className={stroke.neutral} strokeWidth="1" />
          <text x="360" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" className="text-slate-900 dark:text-white">
            APPLICATION
          </text>
          <text x="120" y="68" fontSize="9" fontWeight="600" fill="#0f766e">
            SERVING PATH
          </text>
          <text x="180" y="112" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f766e">
            DYNAMODB
          </text>
          <text x="460" y="68" fontSize="9" fontWeight="600" fill="#64748b">
            ANALYTICS PATH
          </text>
          <text x="540" y="112" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor" className="text-slate-800">
            S3 TABLES
          </text>
          <text x="540" y="168" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">
            ATHENA / PRESTO
          </text>
          <text x="540" y="224" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor" className="text-slate-800">
            BI / ANALYTICS
          </text>
        </svg>

        <div className="md:hidden">
          <p className="text-center text-sm font-bold uppercase">Application</p>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase text-teal-800">{C.architecture.servingLabel}</p>
              <p className="mt-2 text-sm font-bold uppercase">DynamoDB</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500">{C.architecture.analyticsLabel}</p>
              <p className="mt-2 text-sm font-bold uppercase">S3 Tables</p>
              <p className="mt-3 text-sm font-bold uppercase">Athena / Presto</p>
              <p className="mt-3 text-sm font-bold uppercase">BI / Analytics</p>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-lg text-center text-sm text-slate-600 dark:text-slate-400 md:mt-6">{C.architecture.servingLabel} · {C.architecture.analyticsLabel}</p>
      </div>
    </section>
  );
}

export function BeforeAfter() {
  const { fork } = C.mismatch;
  return (
    <section className="min-w-0 pt-16 md:pt-20">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-10">
        <div className="md:text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Before</p>
          <p className="mt-3 text-[10px] font-bold uppercase text-slate-500">One engine</p>
          <p className="mt-2 text-3xl font-semibold uppercase text-slate-950 dark:text-white">{fork.hub}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {fork.left.title} + {fork.right.title.toLowerCase()}
          </p>
        </div>
        <p className="text-center text-4xl font-light text-teal-800 dark:text-teal-400" aria-hidden>
          →
        </p>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-800 dark:text-teal-400">After</p>
          <p className="mt-3 text-sm font-bold uppercase text-slate-900 dark:text-white">Workload-specific architecture</p>
          <p className="mt-4 text-sm text-slate-800 dark:text-slate-200">
            <span className="font-semibold text-teal-900 dark:text-teal-300">Serving</span> → DynamoDB
          </p>
          <p className="mt-2 text-sm text-slate-800 dark:text-slate-200">
            <span className="font-semibold">Analytics</span> → S3 Tables → Athena / Presto
          </p>
          <p className="mt-4 text-[10px] uppercase text-slate-500">PoC · not production migration</p>
        </div>
      </div>
    </section>
  );
}

export function EngineMatrix() {
  return (
    <section className="min-w-0 pt-16 md:pt-20" aria-labelledby="olap-decision">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-12">
        {C.decision.tradeoffs.map((t) => (
          <div key={t.engine}>
            <p className="text-lg font-bold text-slate-950 dark:text-white">{t.engine}</p>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-[9px] font-bold uppercase text-slate-500">Best for</dt>
                <dd className="mt-0.5 font-semibold uppercase text-teal-900 dark:text-teal-300">{t.role}</dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase text-slate-500">Strength</dt>
                <dd className="mt-0.5 text-slate-800 dark:text-slate-200">{t.points.join(" · ")}</dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase text-slate-500">Trade-off</dt>
                <dd className="mt-0.5 text-slate-600 dark:text-slate-400">{t.tradeoff}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
      <p id="olap-decision" className="mt-12 text-base font-semibold uppercase leading-snug text-slate-950 dark:text-white">
        {C.decision.headline.join(" ")}
      </p>
      <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Still open · </span>
        {C.decision.stillOpen.join(" · ")}
      </p>
    </section>
  );
}

export function FinalInsight() {
  return (
    <section className="min-w-0 pt-16 pb-4 md:pt-20 md:pb-8">
      <p className="max-w-2xl text-sm font-semibold uppercase leading-relaxed text-slate-500 dark:text-slate-400">
        {C.final.line1.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </p>
      <p className="mt-5 max-w-3xl text-[clamp(1.4rem,3.8vw,2.35rem)] font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white">
        {C.final.line2.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </p>
      <p className="mt-6 max-w-xl text-sm text-slate-600 dark:text-slate-400">{C.benchmark.closing}</p>
    </section>
  );
}
