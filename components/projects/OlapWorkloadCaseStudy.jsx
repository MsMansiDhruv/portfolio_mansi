"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/portfolio/motion";
import { OLAP_CASE_STUDY, OLAP_COST_EVIDENCE_IMAGE } from "@/lib/data/olap-case-study";
import { cn } from "@/lib/cn";

const C = OLAP_CASE_STUDY;

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

function cellEmphasis(row, value) {
  const n = workloadNumeric(value);
  if (n == null) return "";
  const vals = [row.redshift, row.aurora, row.s3].map(workloadNumeric).filter((x) => x != null);
  if (vals.length < 2) return "";
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  if (max === min) return "";
  if (n === min) return "text-teal-800 dark:text-teal-300";
  if (n === max) return "text-slate-400 dark:text-slate-500";
  return "";
}

function FlowNode({ label, sub, emphasis, className, compact }) {
  return (
    <div
      className={cn(
        "relative rounded-md border px-3 py-2.5 text-center",
        compact ? "min-w-[5.5rem] shrink-0" : "min-w-0 w-full max-w-[9rem] sm:max-w-none",
        emphasis
          ? "border-teal-700/40 bg-teal-50/90 dark:border-teal-500/45 dark:bg-teal-950/55"
          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
        className
      )}
    >
      <p
        className={cn(
          "text-[11px] font-bold uppercase tracking-wide",
          emphasis ? "text-teal-900 dark:text-teal-100" : "text-slate-900 dark:text-white"
        )}
      >
        {label}
      </p>
      {sub ? (
        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{sub}</p>
      ) : null}
    </div>
  );
}

function HorizontalFlow() {
  return (
    <div className="min-w-0 w-full">
      <div className="overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
        <div className="flex min-w-max items-center gap-2 px-0.5 sm:gap-3 xl:min-w-0 xl:flex-wrap xl:justify-center">
          {C.signal.nodes.map((node, i) => (
            <React.Fragment key={node.id}>
              <FlowNode label={node.label} sub={node.sub} emphasis={node.emphasis} compact />
              {i < C.signal.nodes.length - 1 ? (
                <span className="shrink-0 text-sm font-medium text-teal-700/90 dark:text-teal-400/90" aria-hidden>
                  →
                </span>
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function SignalMoment() {
  return (
    <div className="mt-10 min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="grid grid-cols-1 xl:grid-cols-12">
        <div className="flex flex-col justify-center border-b border-slate-200 px-6 py-8 dark:border-slate-800 xl:col-span-3 xl:border-b-0 xl:border-r xl:py-10">
          <p className="text-[clamp(3.75rem,11vw,6rem)] font-semibold leading-none tracking-tighter text-slate-950 dark:text-white">
            {C.signal.metric}
          </p>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">{C.signal.metricLabel}</p>
        </div>

        <div className="min-w-0 border-b border-slate-200 px-6 py-6 dark:border-slate-800 xl:col-span-6 xl:border-b-0 xl:py-8">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Request path</p>
          <HorizontalFlow />
        </div>

        <div className="min-w-0 border-t border-slate-200 px-6 py-6 dark:border-slate-800 xl:col-span-3 xl:border-l xl:border-t-0 xl:py-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Cost signal</p>
          <p className="mt-2 text-lg font-semibold tabular-nums text-slate-900 dark:text-white">{C.signal.serviceTotal}</p>
          <p className="mt-1 text-[11px] leading-snug text-slate-500">{C.signal.costNote}</p>
          <div className="relative mt-4 aspect-[16/9] w-full max-w-[240px] overflow-hidden rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
            <Image src={OLAP_COST_EVIDENCE_IMAGE} alt={C.signal.costImageAlt} fill className="object-contain p-1.5" sizes="240px" />
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkloadMap() {
  const { fork } = C.mismatch;

  return (
    <div className="mt-12 min-w-0">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 sm:gap-12">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">One engine</p>
          <div className="mt-3 inline-block rounded-md border-2 border-slate-800 bg-slate-900 px-8 py-4 dark:border-slate-500 dark:bg-slate-800">
            <p className="text-lg font-bold uppercase tracking-wide text-white">{fork.hub}</p>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8">
          <div className="min-w-0 border-l-2 border-teal-700 pl-5 dark:border-teal-500">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-900 dark:text-teal-300">{fork.left.title}</p>
            <ul className="mt-4 space-y-2">
              {fork.left.items.map((x) => (
                <li key={x} className="text-base font-medium text-slate-900 dark:text-slate-100">
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 border-l-2 border-slate-400 pl-5 dark:border-slate-500">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">{fork.right.title}</p>
            <ul className="mt-4 space-y-2">
              {fork.right.items.map((x) => (
                <li key={x} className="text-base font-medium text-slate-900 dark:text-slate-100">
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-700 dark:text-slate-300">{fork.bottom}</p>
      </div>
    </div>
  );
}

function BenchmarkDashboard() {
  return (
    <div className="mt-10 w-full min-w-0 overflow-hidden rounded-xl border-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
      <div className="min-w-0 overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[minmax(7rem,1.15fr)_repeat(3,minmax(5rem,1fr))] border-b-2 border-slate-200 bg-slate-100 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <div className="px-5 py-4">Workload</div>
            <div className="border-l border-slate-200 px-5 py-4 dark:border-slate-700">Redshift</div>
            <div className="border-l border-slate-200 px-5 py-4 dark:border-slate-700">Aurora</div>
            <div className="border-l border-slate-200 px-5 py-4 dark:border-slate-700">S3 Tables</div>
          </div>
          {C.benchmark.rows.map((row, i) => (
            <div
              key={`${row.workload}-${i}`}
              className={cn(
                "grid grid-cols-[minmax(7rem,1.15fr)_repeat(3,minmax(5rem,1fr))] border-b border-slate-100 dark:border-slate-800/90",
                row.workload === "Aggregation" && "bg-slate-50/80 dark:bg-slate-900/50"
              )}
            >
              <div className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">{row.workload}</div>
              <div
                className={cn(
                  "border-l border-slate-100 px-5 py-4 text-xl font-semibold tabular-nums dark:border-slate-800/90",
                  cellEmphasis(row, row.redshift)
                )}
              >
                {row.redshift}
              </div>
              <div
                className={cn(
                  "border-l border-slate-100 px-5 py-4 text-xl font-semibold tabular-nums dark:border-slate-800/90",
                  cellEmphasis(row, row.aurora)
                )}
              >
                {row.aurora}
              </div>
              <div
                className={cn(
                  "border-l border-slate-100 px-5 py-4 text-xl font-semibold tabular-nums dark:border-slate-800/90",
                  cellEmphasis(row, row.s3)
                )}
              >
                {row.s3}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArchitectureDiagram() {
  const reduced = useReducedMotion();

  const layers = [
    { title: "Application", sub: null, tone: "default" },
    { edge: "point reads", tone: "edge" },
    { title: "DynamoDB", sub: C.architecture.servingLabel, tone: "serving" },
    { edge: "data pipeline", tone: "edge" },
    { title: "S3 Tables", sub: null, tone: "storage" },
    { edge: null, tone: "line" },
    { title: "Athena / Presto", sub: C.architecture.analyticsLabel, tone: "storage" },
    { edge: null, tone: "line" },
    { title: "BI / Analytics", sub: null, tone: "default" },
  ];

  return (
    <div className="mt-12 min-w-0 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{C.architecture.eyebrow}</p>
        <span className="rounded border border-dashed border-slate-400 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-500 dark:text-slate-400">
          PoC · not production migration
        </span>
      </div>

      <div className="grid min-h-0 grid-cols-1 items-stretch sm:min-h-[420px]">
        <div className="flex flex-col items-center justify-center px-6 py-10">
          {layers.map((layer, i) => {
            if (layer.tone === "edge") {
              return (
                <div key={`e-${i}`} className="flex flex-col items-center py-1">
                  {!reduced ? (
                    <motion.div
                      className="h-10 w-px bg-teal-600/70 dark:bg-teal-400/60"
                      animate={{ opacity: [0.45, 1, 0.45] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    />
                  ) : (
                    <div className="h-10 w-px bg-teal-600/70 dark:bg-teal-400/60" />
                  )}
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{layer.edge}</p>
                </div>
              );
            }
            if (layer.tone === "line") {
              return <div key={`l-${i}`} className="my-1 h-8 w-px bg-slate-300 dark:bg-slate-600" aria-hidden />;
            }
            const serving = layer.tone === "serving";
            const storage = layer.tone === "storage";
            return (
              <div
                key={layer.title}
                className={cn(
                  "w-full max-w-md rounded-md border px-6 py-4 text-center transition-shadow hover:shadow-md",
                  serving && "border-teal-700/35 bg-teal-50/80 dark:border-teal-500/40 dark:bg-teal-950/45",
                  storage && "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900",
                  layer.tone === "default" && "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                )}
              >
                <p className="text-base font-bold uppercase tracking-wide text-slate-950 dark:text-white">{layer.title}</p>
                {layer.sub ? (
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{layer.sub}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DecisionMatrix() {
  return (
    <div className="mt-10 min-w-0 overflow-x-auto">
      <div className="min-w-0 divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
        {C.decision.tradeoffs.map((t) => (
          <div
            key={t.engine}
            className="grid grid-cols-1 gap-3 bg-white px-5 py-4 dark:bg-slate-950/80 md:grid-cols-2 md:gap-x-6 lg:grid-cols-[7rem_6rem_1fr_minmax(0,1.2fr)] lg:items-start lg:gap-4"
          >
            <p className="text-base font-bold text-slate-950 dark:text-white">{t.engine}</p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-teal-800 dark:text-teal-400">{t.role}</p>
            <ul className="space-y-0.5 text-sm text-slate-800 dark:text-slate-200">
              {t.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Trade-off: </span>
              {t.tradeoff}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500">Still open</p>
      <p className="mt-1 text-center text-xs text-slate-600 dark:text-slate-400">{C.decision.stillOpen.join(" · ")}</p>
    </div>
  );
}

export default function OlapWorkloadCaseStudy() {
  return (
    <article className="min-w-0 w-full max-w-6xl animate-fadeIn xl:max-w-7xl">
      <Link href="/projects" className="text-sm font-medium text-teal-800 dark:text-teal-400">
        ← Back to projects
      </Link>

      {/* 01 — THE SIGNAL */}
      <Reveal delay={0.02} className="min-w-0">
        <header className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800/90 dark:text-teal-400/90">{C.eyebrow}</p>
          <div className="mt-4 grid gap-8 xl:grid-cols-12 xl:items-end xl:gap-10">
            <div className="min-w-0 xl:col-span-8">
              <h1 className="text-[clamp(1.85rem,4.8vw,2.85rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
                {C.titleLine1}
                <br />
                {C.titleLine2}
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">{C.subtitle}</p>
            </div>
            <div className="hidden min-w-0 text-right xl:col-span-4 xl:block">
              <p className="text-[clamp(3rem,6vw,4.5rem)] font-semibold leading-none tracking-tighter text-slate-950 dark:text-white">
                {C.signal.metric}
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">{C.signal.metricLabel}</p>
            </div>
          </div>
          <SignalMoment />
        </header>
      </Reveal>

      {/* 02 — THE MISMATCH */}
      <Reveal delay={0.04} className="min-w-0">
        <section className="mt-24 lg:mt-32" aria-labelledby="olap-mismatch">
          <p id="olap-mismatch" className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
            {C.mismatch.pre}
          </p>
          <h2 className="mt-5 max-w-4xl text-[clamp(2rem,5.5vw,3.5rem)] font-semibold uppercase leading-[1.02] tracking-tight text-slate-950 dark:text-white">
            {C.mismatch.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <WorkloadMap />
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{C.mismatch.summary}</p>
        </section>
      </Reveal>

      {/* 03 — THE BENCHMARK */}
      <Reveal delay={0.06} className="min-w-0">
        <section className="mt-24 lg:mt-32" aria-labelledby="olap-bench">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{C.benchmark.pre}</p>
          <h2 id="olap-bench" className="mt-3 text-[clamp(1.75rem,4.2vw,2.75rem)] font-semibold uppercase tracking-tight text-slate-950 dark:text-white">
            {C.benchmark.headline}
          </h2>
          <BenchmarkDashboard />
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-1 text-xs font-medium text-slate-500">
            {C.benchmark.config.map((cfg) => (
              <li key={cfg}>{cfg}</li>
            ))}
          </ul>
          <div className="mt-14 border-y border-slate-200 py-12 dark:border-slate-800">
            <p className="text-center text-[clamp(2rem,5vw,3.25rem)] font-semibold uppercase leading-none tracking-[0.04em] text-slate-950 dark:text-white">
              {C.benchmark.verdict}
            </p>
            <p className="mt-4 text-center text-base font-medium text-slate-700 dark:text-slate-300">{C.benchmark.closing}</p>
          </div>
        </section>
      </Reveal>

      {/* 04 — THE ARCHITECTURE */}
      <Reveal delay={0.08} className="min-w-0">
        <section className="mt-24 lg:mt-32" aria-labelledby="olap-arch">
          <h2 id="olap-arch" className="max-w-3xl text-[clamp(1.75rem,4.5vw,3rem)] font-semibold uppercase leading-[1.05] tracking-tight text-slate-950 dark:text-white">
            {C.architecture.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <ArchitectureDiagram />
        </section>
      </Reveal>

      {/* 05 — THE DECISION */}
      <Reveal delay={0.1} className="min-w-0">
        <section className="mt-24 lg:mt-32" aria-labelledby="olap-decision">
          <DecisionMatrix />
          <h2 id="olap-decision" className="mx-auto mt-16 max-w-3xl text-center text-[clamp(1.75rem,4.5vw,2.75rem)] font-semibold uppercase leading-[1.06] tracking-tight text-slate-950 dark:text-white">
            {C.decision.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </section>
      </Reveal>

      {/* FINAL */}
      <Reveal delay={0.12} className="min-w-0">
        <footer className="mt-28 py-16 text-center lg:mt-36 lg:py-24">
          <p className="text-[clamp(1.2rem,3.2vw,1.75rem)] font-semibold uppercase leading-snug tracking-tight text-slate-600 dark:text-slate-400">
            {C.final.line1.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </p>
          <p className="mx-auto mt-8 max-w-4xl text-[clamp(1.5rem,4.2vw,2.5rem)] font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white">
            {C.final.line2.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </p>
        </footer>
      </Reveal>
    </article>
  );
}
