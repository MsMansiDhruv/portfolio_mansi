"use client";

import React from "react";
import Link from "next/link";
import { ArchitectureFlow, DecisionList, TradeoffPanel } from "@/components/portfolio/storytelling";
import { SupportingProjectCard } from "@/components/portfolio/featured-work";
import { getRelatedProjects } from "@/lib/data/project-meta";

function Section({ title, children }) {
  if (!children) return null;
  return (
    <section className="border-t border-slate-200 pt-10 dark:border-slate-800">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function ProjectDetails({ project }) {
  const p = project;
  const related = getRelatedProjects(p.slug);

  return (
    <div className="min-w-0 w-full max-w-4xl animate-fadeIn">
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
          <li>
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white">
              Home
            </Link>
          </li>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <li>
            <Link href="/projects" className="hover:text-slate-900 dark:hover:text-white">
              Projects
            </Link>
          </li>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <li className="font-medium text-slate-900 dark:text-white">{p.title}</li>
        </ol>
      </nav>

      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-teal-700 dark:text-teal-400">{p.category}</p>
        <h1 className="mt-3 break-words text-[clamp(1.65rem,5vw,2.25rem)] font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">{p.title}</h1>
        {p.purpose ? <p className="mt-2 text-base text-slate-600 dark:text-slate-400">{p.purpose}</p> : null}
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {[p.role, p.timeline].filter(Boolean).join(" · ")}
        </p>
        {p.summary ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">{p.summary}</p> : null}
      </header>

      <Section title="The problem">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">{p.problem || p.content?.trim() || p.desc}</p>
      </Section>

      <Section title="Architecture">
        <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:items-start">
          <ArchitectureFlow layers={p.architectureLayers} />
          {p.architectureNotes?.length ? (
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {p.architectureNotes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="text-teal-600 dark:text-teal-400">·</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Section>

      <Section title="Key decisions">
        <DecisionList decisions={p.decisions} />
        {!p.decisions?.length ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">Decision notes for this project are not documented yet.</p>
        ) : null}
      </Section>

      <Section title="My contribution">
        {p.responsibilities?.length ? (
          <ul className="max-w-2xl list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {p.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-400">Contribution details are not documented yet.</p>
        )}
      </Section>

      <Section title="Engineering trade-offs">
        <TradeoffPanel tradeoffs={p.tradeoffs} />
      </Section>

      <Section title="Implementation">
        {p.architectureNotes?.length ? (
          <ul className="max-w-2xl list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {p.architectureNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-400">Implementation notes can be added as the project record grows.</p>
        )}
      </Section>

      {p.outcomes?.length ? (
        <Section title="Outcome">
          <ul className="max-w-2xl list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {p.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title="What I learned / would change today">
        {p.whatIWouldChangeToday?.length ? (
          <ul className="max-w-2xl list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {p.whatIWouldChangeToday.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-400">Retrospective notes for this project can be added here.</p>
        )}
      </Section>

      {p.documentedMetrics?.notes?.length ? (
        <Section title="Documented metrics (project record)">
          <ul className="max-w-2xl list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {p.documentedMetrics.notes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title="Technologies">
        {p.tech?.length ? (
          <ul className="flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <li key={t} className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-700 dark:border-slate-800 dark:text-slate-300">
                {t}
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      {related.length ? (
        <Section title="Related projects">
          <div className="grid gap-4 sm:grid-cols-2">
            {related.slice(0, 3).map((rel) => (
              <SupportingProjectCard key={rel.slug} project={rel} />
            ))}
          </div>
        </Section>
      ) : null}

      <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
        <Link href="/projects" className="text-sm font-medium text-teal-700 hover:underline dark:text-teal-400">
          ← All projects
        </Link>
      </div>
    </div>
  );
}
