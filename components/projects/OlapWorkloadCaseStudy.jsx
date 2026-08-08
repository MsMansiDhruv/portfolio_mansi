"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Reveal, HoverLift } from "@/components/portfolio/motion";
import { OLAP_CASE_STUDY, OLAP_COST_EVIDENCE_IMAGE } from "@/lib/data/olap-case-study";

const C = OLAP_CASE_STUDY;
function SectionLabel({ id, children }) {
  return (
    <h2 id={id} className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
      {children}
    </h2>
  );
}

function FlowStrip({ steps }) {
  return (
    <ol className="mt-6 flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-1">
      {steps.map((step, i) => (
        <li key={step} className="flex min-w-0 items-center gap-1 sm:gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {step}
          </span>
          {i < steps.length - 1 ? (
            <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 text-teal-700/80 sm:block dark:text-teal-400/90" aria-hidden />
          ) : null}
          {i < steps.length - 1 ? (
            <ArrowDown className="h-3.5 w-3.5 shrink-0 text-teal-700/80 sm:hidden dark:text-teal-400/90" aria-hidden />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function TargetArchitectureDiagram() {
  return (
    <div className="mx-auto mt-8 max-w-md min-w-0 text-center text-xs font-medium text-slate-700 dark:text-slate-300">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        Application
      </div>
      <div className="mx-auto flex justify-center py-1 text-teal-700 dark:text-teal-400" aria-hidden>
        <ArrowDown className="h-4 w-4" />
      </div>
      <div className="rounded-xl border border-teal-700/30 bg-teal-50/80 px-4 py-3 dark:border-teal-500/35 dark:bg-teal-950/40">
        <span className="block font-semibold text-slate-900 dark:text-white">DynamoDB</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Serving layer</span>
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
        Operational point reads
      </p>
      <div className="mx-auto flex justify-center py-2 text-teal-700 dark:text-teal-400" aria-hidden>
        <ArrowDown className="h-4 w-4" />
      </div>
      <div className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-slate-600 dark:border-slate-600 dark:text-slate-400">
        Data pipeline
      </div>
      <div className="mx-auto flex justify-center gap-4 py-2 sm:gap-8" aria-hidden>
        <ArrowDown className="h-4 w-4 rotate-[-30deg] text-teal-700/70 dark:text-teal-400/80" />
        <ArrowDown className="h-4 w-4 rotate-[30deg] text-teal-700/70 dark:text-teal-400/80" />
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-900/60">
          <span className="block font-semibold">S3 Tables</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Analytical storage</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-900/60">
          <span className="block font-semibold">Athena / Presto</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Analytics</span>
        </div>
      </div>
      <div className="mx-auto flex justify-center py-2 text-teal-700 dark:text-teal-400" aria-hidden>
        <ArrowDown className="h-4 w-4" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        BI / Analytics
      </div>
    </div>
  );
}

export default function OlapWorkloadCaseStudy() {
  return (
    <article className="min-w-0 w-full max-w-6xl animate-fadeIn xl:max-w-7xl">
      <Reveal>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm font-medium text-teal-800 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
        >
          ← Back to projects
        </Link>
      </Reveal>

      {/* Hero */}
      <Reveal delay={0.03}>
        <header className="mt-6 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800/90 dark:text-teal-400/90">
            {C.eyebrow}
          </p>
          <h1 className="mt-4 text-[clamp(1.65rem,5vw,2.5rem)] font-semibold leading-[1.12] tracking-tight text-slate-950 dark:text-white">
            {C.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">{C.shortDescription}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">{C.subtitle}</p>
          <p className="mt-4 inline-block rounded-full border border-slate-300/80 bg-slate-100/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
            {C.pocNote}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {C.metaTags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
              >
                {tag}
              </li>
            ))}
          </ul>
          <ul className="mt-6 flex flex-wrap gap-2">
            {C.tech.map((t) => (
              <li
                key={t}
                className="rounded-lg border border-teal-700/20 bg-teal-50/50 px-2.5 py-1 text-xs font-medium text-teal-900 dark:border-teal-500/25 dark:bg-teal-950/30 dark:text-teal-100"
              >
                {t}
              </li>
            ))}
          </ul>
        </header>
      </Reveal>

      {/* Trigger */}
      <Reveal delay={0.05}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="olap-trigger">
          <SectionLabel id="olap-trigger">The trigger</SectionLabel>
          <p className="mt-6 text-[clamp(1.125rem,3.5vw,1.5rem)] font-semibold leading-snug text-slate-950 dark:text-white">
            {C.trigger.headline}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{C.trigger.body}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {C.trigger.consequence}
          </p>
          <FlowStrip steps={C.trigger.flow} />
        </section>
      </Reveal>

      {/* Cost evidence */}
      <Reveal delay={0.06}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="olap-cost">
          <SectionLabel id="olap-cost">{C.costEvidence.heading}</SectionLabel>
          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
              <div className="relative aspect-[16/7] w-full min-h-[140px] bg-slate-50 dark:bg-slate-900">
                <Image
                  src={OLAP_COST_EVIDENCE_IMAGE}
                  alt={C.costEvidence.imageAlt}
                  fill
                  className="object-contain object-left p-2 dark:brightness-[0.98]"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-slate-600 dark:text-slate-400">{C.costEvidence.caption}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Service total (period shown)</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-950 dark:text-white">
                {C.costEvidence.serviceTotal}
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[280px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
                      <th className="pb-2 pr-4 font-medium">Date</th>
                      <th className="pb-2 font-medium">Redshift</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums text-slate-700 dark:text-slate-300">
                    {C.costEvidence.daily.map((row) => (
                      <tr key={row.date} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-1.5 pr-4">{row.date}</td>
                        <td className="py-1.5">{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Architecture question */}
      <Reveal delay={0.07}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="olap-question">
          <SectionLabel id="olap-question">{C.architectureQuestion.preface}</SectionLabel>
          <p className="mt-6 text-[clamp(1.125rem,3.2vw,1.45rem)] font-semibold leading-snug text-teal-900 dark:text-teal-300">
            {C.architectureQuestion.headline}
          </p>
          <div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/40">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Operational</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {C.architectureQuestion.operational.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-teal-600 dark:text-teal-400">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-teal-700/20 bg-gradient-to-br from-white to-teal-50/40 p-5 dark:border-teal-500/25 dark:from-slate-950 dark:to-teal-950/20">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-800 dark:text-teal-400">Analytical</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-800 dark:text-slate-200">
                {C.architectureQuestion.analytical.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-teal-600 dark:text-teal-400">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{C.architectureQuestion.closing}</p>
        </section>
      </Reveal>

      {/* Options */}
      <Reveal delay={0.08}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="olap-options">
          <SectionLabel id="olap-options">Options investigated</SectionLabel>
          <ul className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
            {C.options.map((opt) => (
              <HoverLift key={opt.name}>
                <li className="h-full rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80">
                  <p className="font-semibold text-slate-950 dark:text-white">{opt.name}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{opt.role}</p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div>
                      <dt className="font-medium text-teal-800 dark:text-teal-400">Strength</dt>
                      <dd className="text-slate-600 dark:text-slate-400">{opt.strength}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-800 dark:text-slate-200">Trade-off</dt>
                      <dd className="text-slate-600 dark:text-slate-400">{opt.problem}</dd>
                    </div>
                  </dl>
                </li>
              </HoverLift>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* Benchmark */}
      <Reveal delay={0.09}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="olap-bench">
          <SectionLabel id="olap-bench">{C.benchmark.heading}</SectionLabel>
          <p className="mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{C.benchmark.intro}</p>
          <div className="mt-6 min-w-0 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-900/80">
                  <th className="px-4 py-3 font-semibold">Workload</th>
                  <th className="px-4 py-3 font-semibold">Redshift</th>
                  <th className="px-4 py-3 font-semibold">Aurora PostgreSQL</th>
                  <th className="px-4 py-3 font-semibold">S3 Tables</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {C.benchmark.rows.map((row, i) => (
                  <tr key={`${row.workload}-${i}`} className="tabular-nums text-slate-700 dark:text-slate-300">
                    <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">{row.workload}</td>
                    <td className="px-4 py-2.5">{row.redshift}</td>
                    <td className="px-4 py-2.5">{row.aurora}</td>
                    <td className="px-4 py-2.5">{row.s3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            {C.benchmark.config.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-medium text-slate-800 dark:text-slate-200">{C.benchmark.takeaway}</p>
        </section>
      </Reveal>

      {/* Decision / target architecture */}
      <Reveal delay={0.1}>
        <section
          className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800"
          aria-labelledby="olap-decision"
        >
          <SectionLabel id="olap-decision">{C.targetArchitecture.heading}</SectionLabel>
          <p className="mt-6 text-[clamp(1.125rem,3.2vw,1.45rem)] font-semibold leading-snug text-slate-950 dark:text-white">
            {C.targetArchitecture.headline}
          </p>
          <TargetArchitectureDiagram />
        </section>
      </Reveal>

      {/* Why Dynamo / S3 */}
      <Reveal delay={0.11}>
        <div className="mt-14 grid min-w-0 gap-8 border-t border-slate-200 pt-12 dark:border-slate-800 lg:grid-cols-2">
          <section aria-labelledby="olap-dynamo">
            <SectionLabel id="olap-dynamo">{C.whyDynamo.heading}</SectionLabel>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{C.whyDynamo.intro}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-800 dark:text-slate-200">
              {C.whyDynamo.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-teal-600 dark:text-teal-400">·</span>
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{C.whyDynamo.tradeoff}</p>
          </section>
          <section aria-labelledby="olap-s3">
            <SectionLabel id="olap-s3">{C.whyS3.heading}</SectionLabel>
            <ul className="mt-4 space-y-2 text-sm text-slate-800 dark:text-slate-200">
              {C.whyS3.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-teal-600 dark:text-teal-400">·</span>
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{C.whyS3.limitation}</p>
          </section>
        </div>
      </Reveal>

      {/* Insight callout */}
      <Reveal delay={0.12}>
        <blockquote className="mt-14 rounded-2xl border border-teal-700/25 bg-gradient-to-br from-teal-50/80 to-white px-6 py-8 text-center dark:border-teal-500/30 dark:from-teal-950/40 dark:to-slate-950 sm:px-10">
          <p className="text-lg font-semibold leading-snug text-teal-900 dark:text-teal-200 sm:text-xl">
            “{C.insight.quote}”
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 dark:text-slate-400">{C.insight.follow}</p>
        </blockquote>
      </Reveal>

      {/* Proved */}
      <Reveal delay={0.13}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="olap-proved">
          <SectionLabel id="olap-proved">What the PoC proved</SectionLabel>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {C.proved.map((card) => (
              <li
                key={card.title}
                className="rounded-2xl border border-slate-200/90 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950/80"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-teal-800 dark:text-teal-400">{card.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{card.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* Open items */}
      <Reveal delay={0.14}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="olap-open">
          <SectionLabel id="olap-open">{C.openItems.heading}</SectionLabel>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {C.openItems.bullets.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="text-slate-400">—</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{C.openItems.closing}</p>
        </section>
      </Reveal>

      {/* Outcome */}
      <Reveal delay={0.15}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="olap-outcome">
          <SectionLabel id="olap-outcome">Outcome / direction</SectionLabel>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">{C.outcome.context}</p>
          <div className="mt-5 max-w-2xl space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {C.outcome.paragraphs.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Final takeaway */}
      <Reveal delay={0.16}>
        <footer className="mt-20 border-t border-slate-200 pt-16 pb-6 dark:border-slate-800">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-[clamp(1.25rem,4vw,1.75rem)] font-semibold leading-snug text-slate-950 dark:text-white">
              {C.takeaway.line1}
            </p>
            <p className="mt-3 text-[clamp(1.25rem,4vw,1.75rem)] font-semibold leading-snug text-teal-800 dark:text-teal-300">
              {C.takeaway.line2}
            </p>
          </div>
          <nav
            className="mt-12 flex flex-col gap-4 border-t border-slate-200/80 pt-8 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"
            aria-label="Case study navigation"
          >
            <Link
              href="/projects"
              className="inline-flex min-h-[44px] items-center text-sm font-medium text-teal-800 dark:text-teal-400"
            >
              ← Back to Projects
            </Link>
            {C.nextProject ? (
              <Link
                href={`/projects/${C.nextProject.slug}`}
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Related case study
                <ArrowRight className="h-4 w-4" aria-hidden />
                <span className="text-teal-800 dark:text-teal-400">{C.nextProject.title}</span>
              </Link>
            ) : null}
          </nav>
        </footer>
      </Reveal>
    </article>
  );
}
