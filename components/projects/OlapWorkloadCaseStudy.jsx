"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/portfolio/motion";
import { OLAP_CASE_STUDY, OLAP_COST_EVIDENCE_IMAGE } from "@/lib/data/olap-case-study";
import { cn } from "@/lib/cn";

const C = OLAP_CASE_STUDY;

const GRID = "grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-6";

function ChapterEyebrow({ id, className, children }) {
  return (
    <p
      id={id}
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800/90 dark:text-teal-400/90",
        className
      )}
    >
      {children}
    </p>
  );
}

function HeroContextPanel() {
  return (
    <aside className="h-full rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/40 lg:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Architecture PoC</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Workload</dt>
          <dd className="mt-0.5 font-medium tabular-nums text-slate-900 dark:text-white">OLTP ↔ OLAP</dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Focus</dt>
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {["Cost", "Performance", "Workload separation"].map((f) => (
              <span
                key={f}
                className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400"
              >
                {f}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <div className="mt-6 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-4 text-center text-[11px] dark:border-slate-700 dark:bg-slate-950/80">
        <p className="font-semibold uppercase tracking-wide text-slate-800 dark:text-slate-200">Application</p>
        <ArrowDown className="mx-auto my-2 h-3.5 w-3.5 text-teal-700 dark:text-teal-400" aria-hidden />
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-teal-700/20 bg-teal-50/60 py-2 dark:border-teal-500/25 dark:bg-teal-950/30">
            Serving
          </div>
          <div className="rounded-md border border-slate-200 py-2 dark:border-slate-700">Analytics</div>
        </div>
      </div>
    </aside>
  );
}

const ACCESS_STEPS = [
  "User login",
  "Application",
  "API / backend",
  "Point lookup",
  "Redshift Serverless",
];

function AccessPatternFlow() {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Access pattern</p>
      <div className="mt-3 flex min-w-0 flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-stretch xl:flex-nowrap">
        {ACCESS_STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:py-3">
              {step}
            </div>
            {i < ACCESS_STEPS.length - 1 ? (
              <>
                <ArrowRight className="hidden h-4 w-4 shrink-0 text-teal-700/70 lg:block dark:text-teal-400/80" aria-hidden />
                <ArrowDown className="mx-auto h-4 w-4 shrink-0 text-teal-700/70 lg:hidden dark:text-teal-400/80" aria-hidden />
              </>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function WorkloadMismatch() {
  return (
    <div className="mt-6 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-start">
      <div className="rounded-xl border border-teal-700/20 bg-teal-50/50 p-4 dark:border-teal-500/25 dark:bg-teal-950/20">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-800 dark:text-teal-400">
          Application serving
        </p>
        <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
          {C.signal.serving.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
      <p className="hidden self-center px-1 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:block">vs</p>
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/50">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Analytical</p>
        <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
          {C.signal.analytical.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ArchitectureDiagramWide() {
  const node =
    "rounded-xl border border-slate-200 bg-white px-4 py-3 text-center transition hover:border-teal-600/35 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-500/40";
  const nodeAccent =
    "rounded-xl border border-teal-700/30 bg-teal-50/70 px-4 py-3 text-center transition hover:border-teal-600/45 hover:shadow-sm dark:border-teal-500/35 dark:bg-teal-950/40 dark:hover:border-teal-400/50";

  return (
    <div
      className="mt-8 w-full min-w-0 space-y-2"
      role="img"
      aria-label="Investigated PoC architecture separating DynamoDB serving from S3 Tables and Athena analytics"
    >
      <div className="mx-auto max-w-md lg:max-w-none lg:grid lg:grid-cols-12 lg:items-center lg:gap-2">
        <div className={cn(node, "lg:col-span-4 lg:col-start-5")}>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">Application</span>
        </div>
      </div>
      <p className="text-center text-[11px] font-medium uppercase tracking-wide text-slate-500">point reads</p>
      <ArrowDown className="mx-auto h-4 w-4 text-teal-700 dark:text-teal-400" aria-hidden />
      <div className="mx-auto max-w-md lg:max-w-none lg:grid lg:grid-cols-12">
        <div className={cn(nodeAccent, "lg:col-span-4 lg:col-start-5")}>
          <span className="block text-sm font-semibold">DynamoDB</span>
          <span className="text-[10px] uppercase tracking-wide text-slate-500">Serving</span>
        </div>
      </div>
      <ArrowDown className="mx-auto h-4 w-4 text-teal-700 dark:text-teal-400" aria-hidden />
      <div className="mx-auto max-w-xs rounded-lg border border-dashed border-slate-300 px-3 py-2 text-center text-xs text-slate-600 dark:border-slate-600 dark:text-slate-400">
        Data pipeline
      </div>
      <div className="grid min-w-0 grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr] lg:mx-auto lg:max-w-4xl lg:grid-cols-12 lg:gap-4">
        <div className={cn(node, "lg:col-span-5")}>
          <span className="block text-sm font-semibold">S3 Tables</span>
          <span className="text-[10px] uppercase text-slate-500">Analytics</span>
        </div>
        <ArrowRight className="mx-auto hidden h-5 w-5 text-slate-400 sm:block" aria-hidden />
        <div className={cn(node, "lg:col-span-5 lg:col-start-8")}>
          <span className="block text-sm font-semibold">Athena / Presto</span>
        </div>
      </div>
      <ArrowDown className="mx-auto h-4 w-4 text-teal-700 dark:text-teal-400" aria-hidden />
      <div className={cn(node, "mx-auto max-w-md lg:max-w-none lg:grid lg:grid-cols-12")}>
        <div className="text-sm font-semibold lg:col-span-4 lg:col-start-5">BI / Analytics</div>
      </div>
    </div>
  );
}

function BenchmarkTable({ rows, className, compact }) {
  return (
    <div className={cn("min-w-0 overflow-x-auto", className)}>
      <table className={cn("w-full min-w-[520px] text-left", compact ? "text-sm" : "text-sm lg:text-base")}>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/90 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-900/80">
            <th className="px-4 py-3.5 font-semibold lg:px-5">Workload</th>
            <th className="px-4 py-3.5 font-semibold lg:px-5">Redshift</th>
            <th className="px-4 py-3.5 font-semibold lg:px-5">Aurora PostgreSQL</th>
            <th className="px-4 py-3.5 font-semibold lg:px-5">S3 Tables</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row, i) => (
            <tr
              key={`${row.workload}-${i}`}
              className={cn(
                "tabular-nums text-slate-700 transition-colors hover:bg-slate-50/80 dark:text-slate-300 dark:hover:bg-slate-900/40",
                row.workload === "Aggregation" && "bg-teal-50/40 font-medium dark:bg-teal-950/20"
              )}
            >
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-white lg:px-5">{row.workload}</td>
              <td className="px-4 py-3 lg:px-5">{row.redshift}</td>
              <td className="px-4 py-3 lg:px-5">{row.aurora}</td>
              <td className="px-4 py-3 lg:px-5">{row.s3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OlapWorkloadCaseStudy() {
  const [benchOpen, setBenchOpen] = useState(false);
  const [costOpen, setCostOpen] = useState(false);

  return (
    <article className="min-w-0 w-full max-w-6xl animate-fadeIn xl:max-w-7xl">
      <Reveal>
        <Link href="/projects" className="text-sm font-medium text-teal-800 dark:text-teal-400">
          ← Back to projects
        </Link>
      </Reveal>

      {/* 01 Hero — 7 / 5 */}
      <Reveal delay={0.03}>
        <header className={cn("mt-6", GRID)}>
          <div className="min-w-0 lg:col-span-7">
            <ChapterEyebrow>{C.hero.eyebrow}</ChapterEyebrow>
            <h1 className="mt-3 text-[clamp(1.65rem,4.5vw,2.5rem)] font-semibold leading-[1.12] tracking-tight text-slate-950 dark:text-white">
              {C.hero.title}
            </h1>
            <p className="mt-3 max-w-xl text-base text-slate-600 dark:text-slate-400">{C.hero.description}</p>
            <p className="mt-2 text-xs text-slate-500">{C.hero.pocNote}</p>
            <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
              {C.hero.meta.map((m) => (
                <li key={m} className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  {m}
                </li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {C.hero.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-slate-200/90 px-2 py-0.5 text-[11px] text-slate-600 dark:border-slate-700 dark:text-slate-400"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 lg:col-span-5 lg:pt-6">
            <HeroContextPanel />
          </div>
        </header>
      </Reveal>

      {/* 02 Signal — 4 / 8 + full-width cost */}
      <Reveal delay={0.05}>
        <section className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800" aria-labelledby="ch-signal">
          <ChapterEyebrow id="ch-signal" className="lg:col-span-12">
            {C.signal.eyebrow}
          </ChapterEyebrow>
          <div className={cn("mt-8", GRID)}>
            <div className="min-w-0 lg:col-span-4">
              <p className="text-[clamp(3rem,10vw,4.5rem)] font-semibold leading-none tracking-tight text-slate-950 dark:text-white">
                {C.signal.metric}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{C.signal.metricLabel}</p>
              <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{C.signal.intro}</p>
              <p className="mt-6 text-sm font-semibold leading-snug text-slate-900 dark:text-white">{C.signal.mismatch}</p>
            </div>
            <div className="min-w-0 lg:col-span-8">
              <AccessPatternFlow />
              <WorkloadMismatch />
            </div>
          </div>

          <div className={cn("mt-10 rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-900/25 sm:p-6", GRID)}>
            <div className="min-w-0 lg:col-span-5">
              <p className="text-sm text-slate-600 dark:text-slate-400">{C.signal.costCaption}</p>
              <p className="mt-3 text-xs text-slate-500">
                Service total:{" "}
                <span className="text-lg font-semibold tabular-nums text-slate-900 dark:text-white">
                  {C.signal.serviceTotal}
                </span>
              </p>
              <button
                type="button"
                onClick={() => setCostOpen((o) => !o)}
                className="mt-3 flex items-center gap-1 text-xs font-medium text-teal-800 dark:text-teal-400"
                aria-expanded={costOpen}
              >
                {costOpen ? "Hide" : "View"} daily breakdown
                <ChevronDown className={cn("h-3.5 w-3.5 transition", costOpen && "rotate-180")} />
              </button>
              {costOpen ? (
                <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs tabular-nums text-slate-600 dark:text-slate-400">
                  {C.signal.daily.map((d) => (
                    <li key={d.date}>
                      {d.date}: {d.amount}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-7 dark:border-slate-700 dark:bg-slate-950">
              <div className="relative aspect-[16/7] min-h-[120px] w-full">
                <Image
                  src={OLAP_COST_EVIDENCE_IMAGE}
                  alt={C.signal.costImageAlt}
                  fill
                  className="object-contain object-left p-2"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 03 Investigation — full width */}
      <Reveal delay={0.06}>
        <section className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800" aria-labelledby="ch-inv">
          <div className={GRID}>
            <div className="lg:col-span-8">
              <ChapterEyebrow id="ch-inv">{C.investigation.eyebrow}</ChapterEyebrow>
              <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white sm:text-2xl">
                {C.investigation.headline}
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{C.investigation.support}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Operational</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {C.investigation.operational.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-teal-700/15 bg-teal-50/30 p-4 dark:border-teal-500/20 dark:bg-teal-950/15">
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400">
                  Analytical
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {C.investigation.analytical.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
            <ul className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 lg:col-span-12">
              {C.investigation.options.map((opt) => (
                <li
                  key={opt.name}
                  className="flex min-w-0 flex-col rounded-xl border border-slate-200/80 bg-white px-3 py-3 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-slate-700"
                >
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{opt.name}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-500">{opt.role}</p>
                  <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-800 dark:text-slate-200">Strength · </span>
                    {opt.strength}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-800 dark:text-slate-200">Concern · </span>
                    {opt.concern}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>

      {/* 04 Evidence — full width benchmark */}
      <Reveal delay={0.07}>
        <section className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800" aria-labelledby="ch-evidence">
          <ChapterEyebrow id="ch-evidence">{C.evidence.eyebrow}</ChapterEyebrow>
          <div className={cn("mt-4", GRID)}>
            <div className="lg:col-span-8">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{C.evidence.headline}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{C.evidence.intro}</p>
            </div>
          </div>

          <div className="mt-6 md:hidden">
            <button
              type="button"
              onClick={() => setBenchOpen((o) => !o)}
              className="flex min-h-[44px] w-full items-center justify-between rounded-lg border border-slate-200 px-4 text-sm font-medium dark:border-slate-700"
              aria-expanded={benchOpen}
            >
              View full benchmark
              <ChevronDown className={cn("h-4 w-4 transition", benchOpen && "rotate-180")} />
            </button>
            {benchOpen ? (
              <BenchmarkTable rows={C.evidence.rows} className="mt-3 rounded-xl border border-slate-200 dark:border-slate-800" compact />
            ) : null}
          </div>
          <BenchmarkTable
            rows={C.evidence.rows}
            className="mt-6 hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800 md:block"
          />

          <div className={cn("mt-6 items-end", GRID)}>
            <ul className="flex flex-wrap gap-x-4 text-xs text-slate-500 lg:col-span-12">
              {C.evidence.config.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div className="rounded-xl border border-teal-700/20 bg-teal-50/30 p-5 dark:border-teal-500/25 dark:bg-teal-950/15 lg:col-span-12 lg:p-6">
              <p className="text-base font-semibold text-slate-950 dark:text-white">{C.evidence.insightTitle}</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                {C.evidence.insightRows.map((r) => (
                  <li key={r.pattern} className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-medium">{r.pattern}</span>
                    <ArrowRight className="mx-2 inline h-3.5 w-3.5 text-teal-700 dark:text-teal-400" aria-hidden />
                    {r.direction}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-medium text-slate-800 dark:text-slate-200">{C.evidence.insightClosing}</p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 05 Architecture — full width */}
      <Reveal delay={0.08}>
        <section className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800" aria-labelledby="ch-arch">
          <ChapterEyebrow id="ch-arch">{C.architecture.eyebrow}</ChapterEyebrow>
          <h2 className="mt-4 max-w-3xl text-xl font-semibold leading-snug text-slate-950 dark:text-white sm:text-2xl">
            {C.architecture.headline}
          </h2>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">{C.architecture.pocLabel}</p>
          <ArchitectureDiagramWide />
          <div className={cn("mt-8", GRID)}>
            <p className="text-sm text-slate-700 dark:text-slate-300 lg:col-span-5">{C.architecture.line1}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 lg:col-span-7">{C.architecture.line2}</p>
          </div>
        </section>
      </Reveal>

      {/* 06 Trade-off */}
      <Reveal delay={0.09}>
        <section className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800" aria-labelledby="ch-trade">
          <ChapterEyebrow id="ch-trade">{C.tradeoff.eyebrow}</ChapterEyebrow>
          <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white lg:max-w-xl">{C.tradeoff.headline}</h2>
          <ul className="mt-8 grid min-w-0 grid-cols-1 gap-6 md:grid-cols-3">
            {C.tradeoff.columns.map((col) => (
              <li
                key={col.title}
                className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{col.title}</p>
                <p className="mt-1 font-semibold text-teal-900 dark:text-teal-300">{col.engine}</p>
                <ul className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {col.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-medium">Trade-off: </span>
                  {col.tradeoff}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* 07 What changed */}
      <Reveal delay={0.1}>
        <section className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800" aria-labelledby="ch-changed">
          <ChapterEyebrow id="ch-changed">{C.changed.eyebrow}</ChapterEyebrow>
          <div className={cn("mt-6", GRID)}>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-900/40 lg:col-span-5">
              <p className="text-sm font-semibold text-slate-950 dark:text-white">{C.changed.before.title}</p>
              <p className="mt-2 text-xl font-medium text-slate-800 dark:text-slate-200">{C.changed.before.platform}</p>
              <ul className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {C.changed.before.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-teal-700/20 bg-teal-50/40 p-5 dark:border-teal-500/25 dark:bg-teal-950/20 lg:col-span-7">
              <p className="text-sm font-semibold text-slate-950 dark:text-white">{C.changed.after.title}</p>
              <p className="mt-2 text-sm text-slate-800 dark:text-slate-200">{C.changed.after.serving}</p>
              <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{C.changed.after.analytics}</p>
            </div>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 lg:col-span-12 lg:max-w-3xl">
              {C.changed.direction.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-12">
              {C.changed.validated.map((v) => (
                <li key={v.title} className="border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-800 dark:text-teal-400">{v.title}</p>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">{v.body}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-200/80 pt-6 dark:border-slate-800 lg:col-span-12">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{C.changed.openHeading}</p>
              <ul className="mt-3 grid gap-1 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2 lg:grid-cols-3">
                {C.changed.openBullets.map((b) => (
                  <li key={b}>· {b}</li>
                ))}
              </ul>
              <p className="mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{C.changed.openClosing}</p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Final takeaway — centered editorial */}
      <Reveal delay={0.11}>
        <footer className="mx-auto mt-24 max-w-3xl pb-8 pt-4 text-center">
          <ChapterEyebrow>{C.takeaway.eyebrow}</ChapterEyebrow>
          <p className="mt-6 text-[clamp(1.25rem,4vw,1.65rem)] font-semibold leading-snug text-slate-950 dark:text-white">
            {C.takeaway.line1}
          </p>
          <p className="mt-4 text-[clamp(1.35rem,4.5vw,2rem)] font-semibold leading-snug text-teal-800 dark:text-teal-300">
            {C.takeaway.line2}
          </p>
          <nav className="mt-14 flex flex-col gap-3 border-t border-slate-200 pt-8 text-left text-sm dark:border-slate-800 sm:flex-row sm:justify-between sm:text-center">
            <Link href="/projects" className="font-medium text-teal-800 dark:text-teal-400 sm:text-left">
              ← Back to Projects
            </Link>
            {C.nextProject ? (
              <Link href={`/projects/${C.nextProject.slug}`} className="font-medium text-slate-700 dark:text-slate-300 sm:text-right">
                Related: {C.nextProject.title} →
              </Link>
            ) : null}
          </nav>
        </footer>
      </Reveal>
    </article>
  );
}
