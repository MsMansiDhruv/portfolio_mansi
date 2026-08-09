"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ChevronDown } from "lucide-react";
import { Reveal, HoverLift } from "@/components/portfolio/motion";
import { ArchitectureDiagramViewer } from "@/components/projects/ArchitectureDiagramViewer";
import { AMC_ARCHITECTURE_IMAGE, AMC_CASE_STUDY, AMC_CASE_STUDY_SLUG } from "@/lib/data/amc-case-study";
import { ProjectCaseStudyNav } from "@/components/projects/ProjectCaseStudyNav";
import { cn } from "@/lib/cn";

const C = AMC_CASE_STUDY;

function SectionTitle({ id, children }) {
  return (
    <h2
      id={id}
      className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
    >
      {children}
    </h2>
  );
}

function Eyebrow({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800/90 dark:text-teal-400/90">
      {children}
    </p>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </dt>
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

      {/* Hero */}
      <Reveal delay={0.03}>
        <header className="mt-6">
          <div className="max-w-3xl">
            <Eyebrow>{C.eyebrow}</Eyebrow>
            <h1 className="mt-4 text-[clamp(1.75rem,5.5vw,2.75rem)] font-semibold leading-[1.12] tracking-tight text-slate-950 dark:text-white">
              {C.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
              {C.subtitle}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-slate-200/90 py-5 sm:grid-cols-4 dark:border-slate-800">
              <MetaRow label="Client" value={C.client} />
              <MetaRow label="Focus" value={C.focus} />
              <MetaRow label="Cloud" value={C.cloud} />
              <MetaRow label="Stack" value={C.stackLine} />
            </dl>
          </div>

          <div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch sm:gap-3">
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/50 sm:py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {C.heroTransform.legacy.label}
              </p>
              <ul className="mt-3 space-y-1.5">
                {C.heroTransform.legacy.items.map((item) => (
                  <li key={item} className="text-sm text-slate-700 dark:text-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center text-teal-700 dark:text-teal-400" aria-hidden>
              <ArrowDown className="h-5 w-5 sm:hidden" />
              <ArrowRight className="hidden h-5 w-5 sm:block" />
            </div>
            <div className="rounded-2xl border border-teal-700/20 bg-gradient-to-br from-white to-teal-50/50 px-4 py-4 dark:border-teal-500/25 dark:from-slate-950 dark:to-teal-950/20 sm:py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-800 dark:text-teal-400">
                {C.heroTransform.modern.label}
              </p>
              <ul className="mt-3 space-y-1.5">
                {C.heroTransform.modern.items.map((item) => (
                  <li key={item} className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>
      </Reveal>

      {/* At a glance */}
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
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-medium leading-snug text-slate-900 dark:text-slate-100">
                  {item.value}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* Transformation */}
      <Reveal delay={0.06}>
        <section
          className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800"
          aria-labelledby="amc-transform"
        >
          <SectionTitle id="amc-transform">{C.transformation.heading}</SectionTitle>
          <div className="mt-8 grid min-w-0 gap-4 lg:grid-cols-2 lg:gap-6">
            <HoverLift className="h-full">
              <div className="h-full rounded-2xl border border-slate-200/90 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-900/40">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Before
                </p>
                <ul className="mt-4 space-y-2.5">
                  {C.transformation.before.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" aria-hidden />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </HoverLift>
            <HoverLift className="h-full">
              <div className="h-full rounded-2xl border border-teal-700/20 bg-gradient-to-br from-white to-teal-50/40 p-5 dark:border-teal-500/25 dark:from-slate-950 dark:to-teal-950/20">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-800 dark:text-teal-400">
                  After
                </p>
                <ul className="mt-4 space-y-2.5">
                  {C.transformation.after.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-slate-800 dark:text-slate-200">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal-600 dark:bg-teal-400" aria-hidden />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </HoverLift>
          </div>
        </section>
      </Reveal>

      {/* Problem */}
      <Reveal delay={0.07}>
        <section
          className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800"
          aria-labelledby="amc-problem"
        >
          <SectionTitle id="amc-problem">The problem</SectionTitle>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {C.problems.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-slate-200/80 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950/80"
              >
                <p className="font-semibold text-slate-950 dark:text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* Architecture */}
      <Reveal delay={0.08}>
        <section
          className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800"
          aria-labelledby="amc-architecture"
        >
          <SectionTitle id="amc-architecture">{C.architecture.heading}</SectionTitle>

          <div className="mt-6 min-w-0 overflow-x-auto pb-1">
            <ol className="flex min-w-max gap-1 sm:min-w-0 sm:flex-wrap sm:gap-2">
              {C.architecture.pipeline.map((step, i) => (
                <li key={step} className="flex items-center gap-1 sm:gap-2">
                  <span className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:text-xs">
                    {step}
                  </span>
                  {i < C.architecture.pipeline.length - 1 ? (
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-teal-700/70 dark:text-teal-400/80" aria-hidden />
                  ) : null}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 min-w-0 lg:mt-10">
            <ArchitectureDiagramViewer
              src={AMC_ARCHITECTURE_IMAGE}
              alt={C.architecture.imageAlt}
              caption={C.architecture.diagramCaption}
              className="[&_button]:ring-1 [&_button]:ring-slate-200/80 [&_button]:dark:ring-slate-700"
            />
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {C.architecture.legend.map((item) => (
              <li key={item.tier} className="rounded-xl border border-slate-200/80 px-3 py-2.5 dark:border-slate-800">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-800 dark:text-teal-400">
                  {item.tier}
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{item.note}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              How it works
            </p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {C.architecture.flow.map((step) => (
                <li
                  key={step.n}
                  className="rounded-xl border border-slate-200/80 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                    {step.n} — {step.title}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Reveal>

      {/* Engineering decisions */}
      <Reveal delay={0.09}>
        <section
          className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800"
          aria-labelledby="amc-decisions"
        >
          <SectionTitle id="amc-decisions">Engineering decisions</SectionTitle>
          <ul className="mt-6 grid gap-4 lg:grid-cols-2">
            {C.decisions.map((d) => (
              <HoverLift key={d.n}>
                <li className="h-full rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80">
                  <p className="text-xs font-semibold text-teal-800 dark:text-teal-400">
                    {d.n} — {d.title}
                  </p>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div>
                      <dt className="font-medium text-slate-800 dark:text-slate-200">Problem</dt>
                      <dd className="mt-0.5 text-slate-600 dark:text-slate-400">{d.problem}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-800 dark:text-slate-200">Decision</dt>
                      <dd className="mt-0.5 text-slate-600 dark:text-slate-400">{d.decision}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-800 dark:text-slate-200">Reasoning</dt>
                      <dd className="mt-0.5 text-slate-600 dark:text-slate-400">{d.reasoning}</dd>
                    </div>
                  </dl>
                </li>
              </HoverLift>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* Technology */}
      <Reveal delay={0.1}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="amc-tech">
          <SectionTitle id="amc-tech">Technology stack</SectionTitle>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {C.techGroups.map((group) => (
              <div key={group.group} className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {group.group}
                </p>
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

      <Reveal delay={0.105}>
        <section className="mt-12" aria-labelledby="amc-why-stack">
          <SectionTitle id="amc-why-stack">Why this stack?</SectionTitle>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {C.stackRationale.map((item) => (
              <li
                key={item.name}
                className="rounded-xl border border-slate-200/80 px-4 py-3 dark:border-slate-800"
              >
                <p className="text-sm font-semibold text-teal-800 dark:text-teal-400">{item.name}</p>
                <p className="mt-1 text-sm leading-snug text-slate-600 dark:text-slate-400">{item.why}</p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* Operations */}
      <Reveal delay={0.11}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="amc-ops">
          <SectionTitle id="amc-ops">Data quality & operations</SectionTitle>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {C.operations.map((item) => (
              <li key={item.title} className="rounded-2xl border border-slate-200/80 px-4 py-4 dark:border-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-400">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* Outcome */}
      <Reveal delay={0.12}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="amc-outcomes">
          <SectionTitle id="amc-outcomes">Outcome</SectionTitle>
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

      {/* Contribution */}
      <Reveal delay={0.13}>
        <section className="mt-14 border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="amc-contrib">
          <div className="rounded-2xl border border-teal-700/20 bg-gradient-to-br from-white via-white to-teal-50/50 p-6 sm:p-8 dark:border-teal-500/25 dark:from-slate-950 dark:via-slate-950 dark:to-teal-950/25">
            <h2
              id="amc-contrib"
              className="text-base font-semibold tracking-tight text-slate-950 dark:text-white sm:text-lg"
            >
              Areas of engineering contribution
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {C.contributionsIntro}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {C.contributions.map((item) => (
                <li key={item} className="flex min-w-0 items-start gap-2.5 text-sm text-slate-800 dark:text-slate-200">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600 dark:bg-teal-400" aria-hidden />
                  <span className="min-w-0 break-words">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setNotesOpen((o) => !o)}
            className="mt-6 flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-900"
            aria-expanded={notesOpen}
          >
            Source systems (reference)
            <ChevronDown className={cn("h-4 w-4 shrink-0 transition", notesOpen && "rotate-180")} />
          </button>
          {notesOpen ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{C.technicalNotes.sources.join(" · ")}</p>
          ) : null}
        </section>
      </Reveal>

      {/* Takeaway + nav */}
      <Reveal delay={0.14}>
        <ProjectCaseStudyNav slug={AMC_CASE_STUDY_SLUG} takeaway={C.takeaway} />
      </Reveal>
    </article>
  );
}
