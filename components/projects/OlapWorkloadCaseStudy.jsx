"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/portfolio/motion";
import { OLAP_CASE_STUDY, OLAP_COST_EVIDENCE_IMAGE } from "@/lib/data/olap-case-study";
import { cn } from "@/lib/cn";

const C = OLAP_CASE_STUDY;

function FlowNode({ label, sub, emphasis, className }) {
  return (
    <div
      className={cn(
        "min-w-[7.5rem] rounded-lg border px-3 py-2.5 text-center shadow-sm",
        emphasis
          ? "border-teal-700/35 bg-teal-50/80 dark:border-teal-500/40 dark:bg-teal-950/50"
          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
        className
      )}
    >
      <p className={cn("text-xs font-bold uppercase tracking-wide", emphasis ? "text-teal-900 dark:text-teal-100" : "text-slate-900 dark:text-white")}>
        {label}
      </p>
      {sub ? <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{sub}</p> : null}
    </div>
  );
}

function Connector({ reduced }) {
  return (
    <div className="flex flex-col items-center py-1" aria-hidden>
      <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
      {!reduced ? (
        <motion.div
          className="h-1.5 w-1.5 rounded-full bg-teal-600 dark:bg-teal-400"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      ) : (
        <div className="h-1.5 w-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
      )}
      <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
    </div>
  );
}

function SignalInvestigationPanel() {
  const reduced = useReducedMotion();
  const [showCost, setShowCost] = useState(false);

  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50/90 to-white p-5 shadow-sm dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-950 sm:p-8">
      <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-6">
        <div className="text-center lg:col-span-3 lg:text-left">
          <p className="text-[clamp(3.5rem,12vw,5.5rem)] font-semibold leading-none tracking-tighter text-slate-950 dark:text-white">
            {C.signal.metric}
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{C.signal.metricLabel}</p>
          <button
            type="button"
            onClick={() => setShowCost((v) => !v)}
            className="mt-4 text-left text-[11px] font-medium text-teal-800 underline-offset-2 hover:underline dark:text-teal-400"
          >
            {showCost ? "Hide" : "View"} cost annotation ({C.signal.serviceTotal})
          </button>
          {showCost ? (
            <div className="relative mt-2 aspect-[16/7] max-w-[220px] overflow-hidden rounded border border-slate-200 bg-white dark:border-slate-700">
              <Image src={OLAP_COST_EVIDENCE_IMAGE} alt={C.signal.costImageAlt} fill className="object-contain p-1" sizes="220px" />
            </div>
          ) : (
            <p className="mt-2 max-w-[14rem] text-[11px] leading-snug text-slate-500">{C.signal.costNote}</p>
          )}
        </div>

        <div className="flex min-w-0 flex-col items-center lg:col-span-9 lg:flex-row lg:flex-wrap lg:justify-center lg:gap-2">
          {C.signal.nodes.map((node, i) => (
            <React.Fragment key={node.id}>
              <FlowNode label={node.label} sub={node.sub} emphasis={node.emphasis} />
              {i < C.signal.nodes.length - 1 ? (
                <>
                  <div className="flex flex-col items-center lg:hidden">
                    <Connector reduced={!!reduced} />
                  </div>
                  <span className="hidden shrink-0 px-0.5 text-lg text-teal-700/80 lg:inline dark:text-teal-400/90" aria-hidden>
                    →
                  </span>
                </>
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </div>
      <p className="mt-6 border-t border-slate-200/80 pt-4 text-center text-xs text-slate-500 dark:border-slate-800 lg:text-left">
        Repeated point lookups against an analytical warehouse — the investigation signal.
      </p>
    </div>
  );
}

function MismatchForkDiagram() {
  const { fork } = C.mismatch;
  return (
    <div className="mt-10 min-w-0 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/80 sm:p-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <FlowNode label={fork.hub} className="min-w-[10rem]" />
        <div className="relative mt-2 flex h-10 w-full max-w-md items-end justify-center" aria-hidden>
          <div className="absolute left-[15%] right-[15%] top-0 h-px bg-slate-300 dark:bg-slate-600" />
          <div className="absolute left-[15%] top-0 h-4 w-px bg-slate-300 dark:bg-slate-600" />
          <div className="absolute right-[15%] top-0 h-4 w-px bg-slate-300 dark:bg-slate-600" />
        </div>
        <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-teal-700/25 bg-teal-50/40 p-4 dark:border-teal-500/30 dark:bg-teal-950/25">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-900 dark:text-teal-300">{fork.left.title}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-800 dark:text-slate-200">
              {fork.left.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/50">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">{fork.right.title}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-800 dark:text-slate-200">
              {fork.right.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center">
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" aria-hidden />
          <p className="mt-2 rounded-full border border-slate-300 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-700 dark:border-slate-600 dark:text-slate-300">
            {fork.bottom}
          </p>
        </div>
      </div>
    </div>
  );
}

function BenchmarkDashboard() {
  return (
    <div className="mt-8 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="grid grid-cols-[minmax(6.5rem,1fr)_repeat(3,minmax(4.5rem,1fr))] border-b border-slate-200 bg-slate-100/90 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400">
        <div className="px-4 py-3.5">Workload</div>
        <div className="px-4 py-3.5">Redshift</div>
        <div className="px-4 py-3.5">Aurora</div>
        <div className="px-4 py-3.5">S3 Tables</div>
      </div>
      <div className="min-w-0 overflow-x-auto">
        <div className="min-w-[520px]">
          {C.benchmark.rows.map((row, i) => (
            <div
              key={`${row.workload}-${i}`}
              className={cn(
                "grid grid-cols-[minmax(6.5rem,1fr)_repeat(3,minmax(4.5rem,1fr))] border-b border-slate-100 transition-colors hover:bg-teal-50/30 dark:border-slate-800/80 dark:hover:bg-teal-950/15",
                row.workload === "Aggregation" && "bg-slate-50/70 dark:bg-slate-900/40"
              )}
            >
              <div className="px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white">{row.workload}</div>
              <div className="px-4 py-3.5 text-lg font-semibold tabular-nums text-slate-800 dark:text-slate-100">{row.redshift}</div>
              <div className="px-4 py-3.5 text-lg font-semibold tabular-nums text-slate-800 dark:text-slate-100">{row.aurora}</div>
              <div className="px-4 py-3.5 text-lg font-semibold tabular-nums text-slate-800 dark:text-slate-100">{row.s3}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArchitectureCenterpiece() {
  const reduced = useReducedMotion();
  const node = (children, className) =>
    cn(
      "rounded-xl border px-5 py-4 text-center shadow-sm transition hover:shadow-md",
      className
    );

  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/50 to-white p-6 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-950 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <div className={node("border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900")}>
          <p className="text-sm font-bold uppercase tracking-wide">Application</p>
        </div>
        <p className="py-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">point reads</p>
        {!reduced ? (
          <motion.div className="mx-auto h-8 w-px bg-teal-600/60 dark:bg-teal-400/60" animate={{ scaleY: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
        ) : (
          <div className="mx-auto h-8 w-px bg-teal-600/60" />
        )}
        <div className={node("border-teal-700/30 bg-teal-50/70 dark:border-teal-500/35 dark:bg-teal-950/40")}>
          <p className="text-base font-bold text-slate-900 dark:text-white">DynamoDB</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400">{C.architecture.servingLabel}</p>
        </div>
        <p className="py-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">data pipeline</p>
        <div className={node("border-slate-300 bg-slate-100/90 dark:border-slate-600 dark:bg-slate-900/80")}>
          <p className="text-base font-bold">S3 Tables</p>
          <p className="text-[10px] uppercase tracking-wide text-slate-600 dark:text-slate-400">Analytical data</p>
        </div>
        <div className="mx-auto my-2 h-6 w-px bg-slate-300 dark:bg-slate-600" />
        <div className={node("border-slate-300 bg-slate-100/90 dark:border-slate-600 dark:bg-slate-900/80")}>
          <p className="text-base font-bold">Athena / Presto</p>
          <p className="text-[10px] uppercase tracking-wide text-slate-600 dark:text-slate-400">{C.architecture.analyticsLabel}</p>
        </div>
        <div className="mx-auto my-2 h-6 w-px bg-slate-300 dark:bg-slate-600" />
        <div className={node("border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900")}>
          <p className="text-sm font-bold uppercase tracking-wide">BI / Analytics</p>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-slate-500">Investigated direction · not confirmed production migration</p>
    </div>
  );
}

export default function OlapWorkloadCaseStudy() {
  return (
    <article className="min-w-0 w-full max-w-6xl animate-fadeIn xl:max-w-7xl">
      <Link href="/projects" className="text-sm font-medium text-teal-800 dark:text-teal-400">
        ← Back to projects
      </Link>

      {/* Title + 1 SIGNAL */}
      <Reveal delay={0.02}>
        <header className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800/90 dark:text-teal-400/90">{C.eyebrow}</p>
          <h1 className="mt-3 text-[clamp(1.85rem,4.8vw,2.75rem)] font-semibold leading-[1.08] tracking-tight text-slate-950 dark:text-white">
            {C.titleLine1}
            <br />
            {C.titleLine2}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">{C.subtitle}</p>
          <SignalInvestigationPanel />
        </header>
      </Reveal>

      {/* 2 MISMATCH */}
      <Reveal delay={0.04}>
        <section className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800 lg:mt-20 lg:pt-16" aria-labelledby="olap-mismatch">
          <p id="olap-mismatch" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-400">
            {C.mismatch.pre}
          </p>
          <h2 className="mt-4 text-[clamp(1.75rem,4.5vw,2.75rem)] font-semibold uppercase leading-[1.08] tracking-tight text-slate-950 dark:text-white">
            {C.mismatch.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <MismatchForkDiagram />
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-slate-600 dark:text-slate-400 lg:text-left">
            {C.mismatch.summary}
          </p>
        </section>
      </Reveal>

      {/* 3 BENCHMARK */}
      <Reveal delay={0.06}>
        <section className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800 lg:mt-20" aria-labelledby="olap-bench">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">{C.benchmark.pre}</p>
          <h2 id="olap-bench" className="mt-2 text-[clamp(1.5rem,3.8vw,2.25rem)] font-semibold uppercase tracking-tight text-slate-950 dark:text-white">
            {C.benchmark.headline}
          </h2>
          <BenchmarkDashboard />
          <ul className="mt-4 flex flex-wrap gap-x-6 text-xs font-medium text-slate-500">
            {C.benchmark.config.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="mt-12 text-center text-[clamp(1.75rem,4vw,2.5rem)] font-semibold uppercase tracking-[0.05em] text-slate-950 dark:text-white">
            {C.benchmark.verdict}
          </p>
          <p className="mt-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">{C.benchmark.closing}</p>
        </section>
      </Reveal>

      {/* 4 ARCHITECTURE */}
      <Reveal delay={0.08}>
        <section className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800 lg:mt-20 lg:pt-16" aria-labelledby="olap-arch">
          <p id="olap-arch" className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            {C.architecture.eyebrow}
          </p>
          <h2 className="mt-4 text-[clamp(1.5rem,3.8vw,2.35rem)] font-semibold uppercase leading-[1.1] tracking-tight text-slate-950 dark:text-white">
            {C.architecture.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <ArchitectureCenterpiece />
        </section>
      </Reveal>

      {/* 5 DECISION + still open inline */}
      <Reveal delay={0.1}>
        <section className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800 lg:mt-20" aria-labelledby="olap-decision">
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {C.decision.tradeoffs.map((t) => (
              <div
                key={t.engine}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/90"
              >
                <p className="text-lg font-bold text-slate-950 dark:text-white">{t.engine}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-teal-800 dark:text-teal-400">{t.role}</p>
                <ul className="mt-3 space-y-1 text-sm text-slate-800 dark:text-slate-200">
                  {t.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Trade-off: </span>
                  {t.tradeoff}
                </p>
              </div>
            ))}
          </div>
          <h2 id="olap-decision" className="mt-14 text-center text-[clamp(1.35rem,3.5vw,2rem)] font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white">
            {C.decision.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-8 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500">Still open</p>
          <p className="mt-2 text-center text-xs text-slate-600 dark:text-slate-400">{C.decision.stillOpen.join(" · ")}</p>
        </section>
      </Reveal>

      {/* FINAL */}
      <Reveal delay={0.12}>
        <footer className="mt-20 border-t border-slate-200 py-20 text-center dark:border-slate-800 lg:mt-24 lg:py-28">
          <p className="text-[clamp(1.25rem,3.5vw,1.85rem)] font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white">
            {C.final.line1.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </p>
          <p className="mx-auto mt-10 max-w-3xl text-[clamp(1.35rem,4vw,2.25rem)] font-semibold uppercase leading-snug tracking-tight text-teal-800 dark:text-teal-300">
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
