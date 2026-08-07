"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Reveal, HoverLift } from "@/components/portfolio/motion";
import { ArchitectureDiagramViewer } from "@/components/projects/ArchitectureDiagramViewer";
import { AMC_ARCHITECTURE_IMAGE, AMC_CASE_STUDY } from "@/lib/data/amc-case-study";
import { cn } from "@/lib/cn";

const C = AMC_CASE_STUDY;

function Eyebrow({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800/90 dark:text-teal-400/90">{children}</p>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">{value}</dd>
    </div>
  );
}

export default function AmcCaseStudy() {
  const [notesOpen, setNotesOpen] = useState(false);

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

      <Reveal delay={0.03}>
        <header className="mt-6 max-w-3xl">
          <Eyebrow>{C.eyebrow}</Eyebrow>
          <h1 className="mt-4 text-[clamp(1.75rem,5.5vw,2.75rem)] font-semibold leading-[1.12] tracking-tight text-slate-950 dark:text-white">
            {C.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">{C.subtitle}</p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-slate-200/90 py-5 sm:grid-cols-4 dark:border-slate-800">
            <MetaRow label="Client" value={C.client} />
            <MetaRow label="Focus" value={C.focus} />
            <MetaRow label="Cloud" value={C.cloud} />
            <MetaRow label="Stack" value={C.stackLine} />
          </dl>
        </header>
      </Reveal>

      <Reveal delay={0.05}>
        <section className="mt-10" aria-labelledby="amc-snapshot">
          <h2 id="amc-snapshot" className="sr-only">
            At a glance
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {C.snapshot.map((item) => (
              <li
                key={item.label}
                className="rounded-2xl border border-slate-200/90 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950/80"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className="mt-2 text-sm font-medium leading-snug text-slate-900 dark:text-slate-100">{item.value}</p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={0.06}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="amc-problem">
          <h2 id="amc-problem" className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            The problem
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {C.problems.map((item) => (
              <li
                key={item.n}
                className="flex gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/40"
              >
                <span className="text-sm font-semibold tabular-nums text-teal-700 dark:text-teal-400">{item.n}</span>
                <div className="min-w-0">
                  <p className="font-medium text-slate-950 dark:text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={0.07}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="amc-architecture">
          <h2 id="amc-architecture" className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {C.architecture.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{C.architecture.intro}</p>

          <div className="mt-8 min-w-0">
            <ArchitectureDiagramViewer
              src={AMC_ARCHITECTURE_IMAGE}
              alt={C.architecture.imageAlt}
              caption="Bronze / Silver / Gold platform layers — click to enlarge"
            />
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {C.architecture.legend.map((item) => (
              <li key={item.tier} className="rounded-xl border border-slate-200/80 px-3 py-2.5 dark:border-slate-800">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-800 dark:text-teal-400">{item.tier}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{item.note}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">How it works</p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {C.architecture.flow.map((step) => (
                <li key={step.n} className="rounded-xl bg-white px-3 py-3 dark:bg-slate-950/60">
                  <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">{step.n}</span>
                  <p className="mt-1 text-sm font-medium text-slate-950 dark:text-white">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.08}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="amc-decisions">
          <h2 id="amc-decisions" className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Engineering decisions
          </h2>
          <ul className="mt-6 grid gap-4 lg:grid-cols-2">
            {C.decisions.map((d) => (
              <HoverLift key={d.n}>
                <li className="h-full rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80">
                  <p className="text-xs font-semibold text-teal-800 dark:text-teal-400">Decision {d.n}</p>
                  <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white">{d.decision}</p>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-800 dark:text-slate-200">Why: </span>
                    {d.why}
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-800 dark:text-slate-200">Direction: </span>
                    {d.direction}
                  </p>
                </li>
              </HoverLift>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={0.09}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="amc-tech">
          <h2 id="amc-tech" className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Technology stack
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {C.techGroups.map((group) => (
              <div key={group.group}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{group.group}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {group.items.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 transition hover:border-teal-600/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="amc-ops">
          <h2 id="amc-ops" className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Data quality & operations
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {C.operations.map((item) => (
              <li key={item.title} className="rounded-2xl border border-slate-200/80 px-4 py-4 dark:border-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-400">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={0.11}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="amc-outcomes">
          <h2 id="amc-outcomes" className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            What changed
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {C.outcomes.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-teal-700/15 bg-gradient-to-br from-white to-teal-50/40 px-5 py-5 dark:border-teal-500/20 dark:from-slate-950 dark:to-teal-950/20"
              >
                <p className="text-base font-semibold text-slate-950 dark:text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={0.12}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="amc-contrib">
          <h2 id="amc-contrib" className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Areas of engineering contribution
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{C.contributionsIntro}</p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {C.contributions.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600 dark:bg-teal-400" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={0.13}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="amc-timeline">
          <h2 id="amc-timeline" className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Delivery timeline
          </h2>
          <ol className="mt-6 flex flex-col gap-0 border-l border-slate-200 pl-4 dark:border-slate-800 md:hidden">
            {C.timeline.map((step) => (
              <li key={step.range} className="relative pb-6 last:pb-0">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-teal-600 dark:bg-teal-400" aria-hidden />
                <p className="text-xs font-semibold text-teal-800 dark:text-teal-400">{step.range}</p>
                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{step.label}</p>
              </li>
            ))}
          </ol>
          <ol className="mt-6 hidden min-w-0 gap-3 md:grid md:grid-cols-5">
            {C.timeline.map((step, i) => (
              <li key={step.range} className="relative min-w-0 rounded-xl border border-slate-200/80 px-3 py-3 dark:border-slate-800">
                {i < C.timeline.length - 1 ? (
                  <span className="absolute -right-2 top-1/2 hidden h-px w-4 bg-slate-200 lg:block dark:bg-slate-700" aria-hidden />
                ) : null}
                <p className="text-xs font-semibold text-teal-800 dark:text-teal-400">{step.range}</p>
                <p className="mt-1 text-sm font-medium leading-snug text-slate-900 dark:text-white">{step.label}</p>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      <Reveal delay={0.14}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setNotesOpen((o) => !o)}
            className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-900"
            aria-expanded={notesOpen}
          >
            Technical notes
            <ChevronDown className={cn("h-4 w-4 shrink-0 transition", notesOpen && "rotate-180")} />
          </button>
          {notesOpen ? (
            <div className="mt-4 rounded-2xl border border-slate-200/80 px-4 py-4 dark:border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Source systems</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{C.technicalNotes.sources.join(" · ")}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Program objectives (summary)</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
                {C.technicalNotes.objectives.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </Reveal>

      <Reveal delay={0.15}>
        <footer className="mt-14 border-t border-slate-200 pt-10 dark:border-slate-800">
          <p className="max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-300">{C.takeaway}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/projects" className="text-sm font-medium text-teal-700 hover:underline dark:text-teal-400">
              ← Back to projects
            </Link>
            {C.nextProject ? (
              <Link
                href={`/projects/${C.nextProject.slug}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-teal-800 dark:text-slate-300 dark:hover:text-teal-400"
              >
                Next project: {C.nextProject.title}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </footer>
      </Reveal>
    </article>
  );
}
