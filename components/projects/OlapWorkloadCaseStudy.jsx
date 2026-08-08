"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/portfolio/motion";
import { OLAP_CASE_STUDY, OLAP_COST_EVIDENCE_IMAGE } from "@/lib/data/olap-case-study";
import { cn } from "@/lib/cn";

const C = OLAP_CASE_STUDY;

const ENGINES = [
  { key: "redshift", label: "Redshift" },
  { key: "aurora", label: "Aurora" },
  { key: "s3", label: "S3 Tables" },
];

function parseMs(value) {
  const m = String(value).match(/^([\d,]+)\s*ms$/i);
  if (!m) return null;
  return Number(m[1].replace(/,/g, ""));
}

function parseMinSec(value) {
  const min = String(value).match(/^([\d.]+)\s*min$/i);
  if (min) return Number(min[1]) * 60_000;
  const sec = String(value).match(/^([\d.]+)\s*sec$/i);
  if (sec) return Number(sec[1]) * 1000;
  return null;
}

function workloadNumeric(value) {
  return parseMs(value) ?? parseMinSec(value);
}

function ChapterStrip({ index, title }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="text-[10px] font-bold tabular-nums tracking-[0.2em] text-teal-800 dark:text-teal-400">{index}</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" aria-hidden />
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{title}</span>
    </div>
  );
}

function Panel({ className, children }) {
  return (
    <div
      className={cn(
        "min-w-0 border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/35",
        className
      )}
    >
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
          ? "border-teal-700/45 bg-teal-50/90 dark:border-teal-500/50 dark:bg-teal-950/50"
          : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900",
        className
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-900 dark:text-white">{label}</p>
      {sub ? <p className="mt-0.5 text-[10px] font-medium uppercase text-slate-500">{sub}</p> : null}
    </div>
  );
}

/** Hero: serving + analytics converging on one engine → mismatch */
function HeroProblemDiagram() {
  const { fork } = C.mismatch;
  return (
    <Panel className="p-5 sm:p-6 lg:p-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Core tension</p>
      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-4">
        <div className="min-w-0 border-l-2 border-teal-700 pl-4 dark:border-teal-500">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-900 dark:text-teal-300">{fork.left.title}</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-800 dark:text-slate-200">
            {fork.left.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center gap-2 lg:px-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 lg:hidden">↓</span>
          <div className="w-full max-w-[11rem] border-2 border-slate-800 bg-slate-900 px-4 py-3 text-center dark:border-slate-500">
            <p className="text-xs font-bold uppercase tracking-wider text-white">{fork.hub}</p>
            <p className="mt-1 text-[9px] font-medium uppercase text-slate-400">One engine</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400">{fork.bottom}</span>
        </div>

        <div className="min-w-0 border-l-2 border-slate-400 pl-4 dark:border-slate-500 lg:border-l-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">{fork.right.title}</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-800 dark:text-slate-200">
            {fork.right.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <svg className="mx-auto mt-4 hidden h-8 w-full max-w-md lg:block" viewBox="0 0 400 32" aria-hidden>
        <path d="M 40 4 L 200 16 L 360 4" fill="none" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <path d="M 200 16 L 200 28" fill="none" className="stroke-teal-600/70 dark:stroke-teal-400/60" strokeWidth="1" />
      </svg>
    </Panel>
  );
}

function InvestigationSignal() {
  return (
    <Panel>
      <div className="grid min-w-0 lg:grid-cols-12">
        <div className="border-b border-slate-200 px-5 py-6 dark:border-slate-800 lg:col-span-4 lg:border-b-0 lg:border-r lg:py-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Investigation signal</p>
          <p className="mt-3 text-[clamp(3rem,10vw,4.5rem)] font-semibold leading-none tracking-tighter text-slate-950 dark:text-white">
            {C.signal.metric}
          </p>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{C.signal.metricLabel}</p>
          <div className="mt-5 flex items-center gap-2">
            <span className="h-px flex-1 bg-slate-300 dark:bg-slate-600" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-teal-800 dark:text-teal-400">High-frequency access</span>
            <span className="h-px flex-1 bg-slate-300 dark:bg-slate-600" />
          </div>
        </div>

        <div className="min-w-0 border-b border-slate-200 px-5 py-6 dark:border-slate-800 lg:col-span-5 lg:border-b-0 lg:py-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Access path</p>
          <div className="mt-4 overflow-x-auto pb-1">
            <div className="flex min-w-max items-center gap-1.5 sm:gap-2">
              {C.signal.nodes.map((node, i) => (
                <React.Fragment key={node.id}>
                  <Node label={node.label} sub={node.sub} accent={node.emphasis} className="w-[6.75rem] shrink-0 sm:w-[7rem]" />
                  {i < C.signal.nodes.length - 1 ? (
                    <span className="shrink-0 text-teal-700 dark:text-teal-400" aria-hidden>
                      →
                    </span>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 px-5 py-6 lg:col-span-3 lg:border-l lg:py-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Cost context</p>
          <p className="mt-2 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{C.signal.serviceTotal}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{C.signal.costNote}</p>
          <div className="relative mt-4 aspect-[16/10] w-full overflow-hidden border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
            <Image src={OLAP_COST_EVIDENCE_IMAGE} alt={C.signal.costImageAlt} fill className="object-contain p-1" sizes="(max-width:1024px) 100vw, 240px" />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function WorkloadMismatch() {
  const { fork } = C.mismatch;
  return (
    <div className="min-w-0">
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-0">
        <div className="lg:col-span-2 lg:border-r lg:border-slate-200 lg:pr-8 dark:lg:border-slate-800">
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-600 dark:text-slate-400">{C.mismatch.pre}</p>
          <h2 className="mt-3 text-[clamp(1.65rem,4vw,2.35rem)] font-semibold uppercase leading-[1.05] tracking-tight text-slate-950 dark:text-white">
            {C.mismatch.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{C.mismatch.summary}</p>
        </div>

        <Panel className="lg:col-span-3 lg:ml-8 lg:p-6">
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <div className="bg-teal-50/50 p-4 dark:bg-teal-950/20">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-900 dark:text-teal-300">{fork.left.title}</p>
              <ul className="mt-3 space-y-2 border-t border-teal-800/10 pt-3 dark:border-teal-500/20">
                {fork.left.items.map((x) => (
                  <li key={x} className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-100/80 p-4 dark:bg-slate-900/60">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">{fork.right.title}</p>
              <ul className="mt-3 space-y-2 border-t border-slate-300/80 pt-3 dark:border-slate-700">
                {fork.right.items.map((x) => (
                  <li key={x} className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center">
            <div className="h-6 w-px bg-slate-400 dark:bg-slate-600" aria-hidden />
            <div className="mt-2 border border-slate-800 bg-slate-900 px-6 py-2 dark:border-slate-500">
              <p className="text-xs font-bold uppercase tracking-wider text-white">{fork.hub}</p>
            </div>
            <div className="mt-2 h-6 w-px bg-teal-600/70 dark:bg-teal-400/60" aria-hidden />
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.28em] text-teal-900 dark:text-teal-300">{fork.bottom}</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function BenchmarkBar({ label, value, rowMax, isFastest }) {
  const n = workloadNumeric(value);
  const width = n != null && rowMax > 0 ? Math.max(4, Math.round((n / rowMax) * 100)) : 0;
  return (
    <div className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-2 py-1.5 sm:grid-cols-[6.5rem_1fr_auto]">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">{label}</span>
      <div className="h-2 bg-slate-100 dark:bg-slate-800">
        <div
          className={cn("h-full transition-all", isFastest ? "bg-teal-700 dark:bg-teal-500" : "bg-slate-400/70 dark:bg-slate-500/70")}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className={cn("min-w-[4.5rem] text-right text-xs font-semibold tabular-nums", isFastest && "text-teal-900 dark:text-teal-300")}>
        {value}
      </span>
    </div>
  );
}

function BenchmarkComparison() {
  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{C.benchmark.pre}</p>
          <h2 className="mt-1 text-xl font-semibold uppercase tracking-tight text-slate-950 dark:text-white sm:text-2xl">
            {C.benchmark.headline}
          </h2>
        </div>
        <ul className="flex flex-wrap gap-x-4 text-[11px] text-slate-500">
          {C.benchmark.config.map((cfg) => (
            <li key={cfg}>{cfg}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        {C.benchmark.rows.map((row, i) => {
          const nums = ENGINES.map((e) => workloadNumeric(row[e.key])).filter((x) => x != null);
          const rowMax = nums.length ? Math.max(...nums) : 0;
          const fastest = rowMax ? Math.min(...nums) : null;
          return (
            <Panel key={`${row.workload}-${i}`} className="px-4 py-4 sm:px-5">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{row.workload}</p>
              <div className="mt-3 space-y-0.5">
                {ENGINES.map((e) => {
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

function WorkloadShapeConclusion() {
  const branches = C.decision.tradeoffs.map((t) => ({
    label: t.role,
    engine: t.engine,
    hint: t.points[0],
  }));

  return (
    <Panel className="px-5 py-8 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="text-2xl font-semibold uppercase leading-tight tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {C.benchmark.verdict}
          </p>
          <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">{C.benchmark.closing}</p>
        </div>
        <div className="min-w-0">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Workload shape</p>
          <div className="mx-auto mt-4 flex max-w-md flex-col items-center">
            <div className="h-8 w-px bg-slate-400 dark:bg-slate-600" aria-hidden />
            <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4">
              {branches.map((b) => (
                <div key={b.engine} className="border border-slate-200 bg-white px-2 py-3 text-center dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">{b.label}</p>
                  <p className="mt-2 text-[11px] font-bold uppercase text-teal-900 dark:text-teal-300">{b.engine}</p>
                  <p className="mt-1 text-[10px] text-slate-600 dark:text-slate-400">{b.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function BeforeAfterTransformation() {
  const { fork } = C.mismatch;
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-2 lg:gap-6">
      <Panel className="p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Before</p>
        <div className="mt-4 flex flex-col items-center text-center">
          <div className="border border-slate-800 bg-slate-900 px-8 py-3 dark:border-slate-500">
            <p className="text-sm font-bold uppercase text-white">{fork.hub}</p>
          </div>
          <p className="mt-3 max-w-[14rem] text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {fork.left.title} + {fork.right.title.toLowerCase()}
          </p>
          <div className="mt-4 h-8 w-px bg-slate-400" aria-hidden />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">{fork.bottom}</p>
        </div>
      </Panel>

      <Panel className="border-teal-800/25 p-5 dark:border-teal-500/30 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-800 dark:text-teal-400">After · PoC direction</p>
        <div className="mt-4 space-y-2 text-center text-[11px] font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
          <p>Application</p>
          <p className="text-[10px] font-medium normal-case text-slate-500">Point reads → DynamoDB</p>
          <p className="text-slate-400">+</p>
          <p className="text-[10px] font-medium normal-case text-slate-500">Data pipeline → S3 Tables</p>
          <p className="text-slate-400">↓</p>
          <p>Athena / Presto</p>
          <p className="text-slate-400">↓</p>
          <p>BI / Analytics</p>
        </div>
        <p className="mt-4 text-center text-[10px] uppercase tracking-wide text-slate-500">Investigated · not production migration</p>
      </Panel>
    </div>
  );
}

function ArchitectureDiagramWide() {
  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{C.architecture.eyebrow}</p>
        <span className="border border-dashed border-slate-400 px-2 py-0.5 text-[9px] font-semibold uppercase text-slate-600 dark:border-slate-500 dark:text-slate-400">
          PoC
        </span>
      </div>

      <div className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto flex max-w-lg flex-col items-center md:max-w-none">
          <Node label="Application" className="w-full max-w-[14rem]" />

          <div className="mt-6 grid w-full gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col items-center border-r-0 md:items-end md:border-r md:border-slate-200 md:pr-10 dark:md:border-slate-800">
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-teal-800 dark:text-teal-400">Point reads</p>
              <div className="flex flex-col items-center">
                <div className="h-6 w-px bg-teal-700/60 dark:bg-teal-400/50" aria-hidden />
                <Node label="DynamoDB" sub={C.architecture.servingLabel} accent className="mt-2 w-full max-w-[13rem]" />
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Data pipeline</p>
              <div className="flex w-full max-w-[13rem] flex-col items-center md:items-start">
                <div className="h-6 w-px bg-slate-400 dark:bg-slate-600" aria-hidden />
                <Node label="S3 Tables" className="mt-2 w-full" />
                <div className="mt-3 h-6 w-px bg-slate-400 dark:bg-slate-600" aria-hidden />
                <Node label="Athena / Presto" sub={C.architecture.analyticsLabel} className="mt-2 w-full" />
                <div className="mt-3 h-6 w-px bg-slate-400 dark:bg-slate-600" aria-hidden />
                <Node label="BI / Analytics" className="mt-2 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function EngineDecisionMatrix() {
  return (
    <div className="min-w-0 overflow-x-auto">
      <div className="min-w-[640px] border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-[6.5rem_5.5rem_1fr_1.2fr] gap-3 border-b border-slate-200 bg-slate-100/90 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:border-slate-800 dark:bg-slate-900/80">
          <span>Engine</span>
          <span>Best for</span>
          <span>Strength</span>
          <span>Trade-off</span>
        </div>
        {C.decision.tradeoffs.map((t) => (
          <div
            key={t.engine}
            className="grid grid-cols-[6.5rem_5.5rem_1fr_1.2fr] gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 dark:border-slate-800/80"
          >
            <p className="text-sm font-bold text-slate-950 dark:text-white">{t.engine}</p>
            <p className="text-[10px] font-bold uppercase leading-snug text-teal-800 dark:text-teal-400">{t.role}</p>
            <ul className="text-sm text-slate-800 dark:text-slate-200">
              {t.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{t.tradeoff}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpenQuestions() {
  return (
    <Panel className="mt-6 px-5 py-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Still open</p>
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
        {C.decision.stillOpen.map((item) => (
          <li key={item} className="border border-slate-200 px-2.5 py-1 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300">
            {item}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function FinalTakeaway() {
  return (
    <Panel className="border-slate-300/80 px-6 py-10 text-center dark:border-slate-700 sm:px-10 sm:py-12">
      <p className="text-base font-semibold uppercase leading-snug tracking-tight text-slate-600 dark:text-slate-400 sm:text-lg">
        {C.final.line1.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </p>
      <p className="mx-auto mt-6 max-w-3xl text-[clamp(1.25rem,3.5vw,2rem)] font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white">
        {C.final.line2.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </p>
    </Panel>
  );
}

export default function OlapWorkloadCaseStudy() {
  return (
    <article className="min-w-0 w-full max-w-6xl animate-fadeIn xl:max-w-7xl">
      <Link href="/projects" className="text-sm font-medium text-teal-800 dark:text-teal-400">
        ← Back to projects
      </Link>

      {/* Hero */}
      <Reveal delay={0.02} className="min-w-0">
        <header className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800/90 dark:text-teal-400/90">{C.eyebrow}</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
            <div className="min-w-0">
              <h1 className="text-[clamp(1.85rem,4.5vw,2.65rem)] font-semibold leading-[1.08] tracking-tight text-slate-950 dark:text-white">
                {C.titleLine1}
                <br />
                {C.titleLine2}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">{C.subtitle}</p>
            </div>
            <HeroProblemDiagram />
          </div>
        </header>
      </Reveal>

      {/* 01 Signal */}
      <Reveal delay={0.03} className="min-w-0">
        <section className="mt-12" aria-label="Investigation signal">
          <ChapterStrip index="01" title="The signal" />
          <InvestigationSignal />
        </section>
      </Reveal>

      {/* 02 Mismatch */}
      <Reveal delay={0.04} className="min-w-0">
        <section className="mt-14" aria-labelledby="olap-mismatch">
          <ChapterStrip index="02" title="The mismatch" />
          <WorkloadMismatch />
        </section>
      </Reveal>

      {/* 03 Benchmark */}
      <Reveal delay={0.05} className="min-w-0">
        <section className="mt-14" aria-labelledby="olap-bench">
          <ChapterStrip index="03" title="The evidence" />
          <BenchmarkComparison />
        </section>
      </Reveal>

      {/* 04 Decision from benchmark */}
      <Reveal delay={0.06} className="min-w-0">
        <section className="mt-14">
          <ChapterStrip index="04" title="The decision" />
          <WorkloadShapeConclusion />
        </section>
      </Reveal>

      {/* 05 Architecture */}
      <Reveal delay={0.07} className="min-w-0">
        <section className="mt-14" aria-labelledby="olap-arch">
          <ChapterStrip index="05" title="The architecture" />
          <h2 id="olap-arch" className="text-lg font-semibold uppercase tracking-tight text-slate-950 dark:text-white sm:text-xl">
            {C.architecture.headline.join(" ")}
          </h2>
          <div className="mt-6 space-y-6">
            <BeforeAfterTransformation />
            <ArchitectureDiagramWide />
          </div>
        </section>
      </Reveal>

      {/* 06 Trade-offs */}
      <Reveal delay={0.08} className="min-w-0">
        <section className="mt-14" aria-labelledby="olap-decision">
          <ChapterStrip index="06" title="Trade-offs" />
          <EngineDecisionMatrix />
          <OpenQuestions />
          <h2 id="olap-decision" className="mt-10 max-w-xl text-lg font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white sm:text-xl">
            {C.decision.headline.join(" ")}
          </h2>
        </section>
      </Reveal>

      {/* 07 Takeaway */}
      <Reveal delay={0.09} className="min-w-0">
        <section className="mt-14 pb-8">
          <ChapterStrip index="07" title="Takeaway" />
          <FinalTakeaway />
        </section>
      </Reveal>
    </article>
  );
}
