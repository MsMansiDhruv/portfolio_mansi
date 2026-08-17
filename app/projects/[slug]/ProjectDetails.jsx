"use client";

import React from "react";
import Link from "next/link";
import { ArchitectureFlow, DecisionList, TradeoffPanel } from "@/components/portfolio/storytelling";
import EditorialNote from "@/components/portfolio/identity/EditorialNote";
import { SupportingProjectCard } from "@/components/portfolio/featured-work";
import AmcCaseStudy from "@/components/projects/AmcCaseStudy";
import OlapWorkloadCaseStudy from "@/components/projects/OlapWorkloadCaseStudy";
import BrainMvpCaseStudy from "@/components/projects/BrainMvpCaseStudy";
import IntelligencePipelineCaseStudy from "@/components/projects/IntelligencePipelineCaseStudy";
import { ProjectCaseStudyNav } from "@/components/projects/ProjectCaseStudyNav";
import WorldPageNav from "@/components/world/WorldPageNav";
import InstallationRoom from "@/components/work/InstallationRoom";
import { getInstallation } from "@/lib/data/work-exhibition";
import { getRelatedProjects } from "@/lib/data/project-meta";
import { useWorldTheme } from "@/lib/use-world-theme";
import { cn } from "@/lib/cn";
import "@/styles/mansi-world-of-data.css";
import "@/styles/mansi-work.css";

function Section({ title, children, className }) {
  if (!children) return null;
  return (
    <section className={cn("border-t border-slate-200 pt-10 dark:border-slate-800", className)}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ArchitecturePanel({ layers, notes, className }) {
  if (!layers?.length) return null;
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/40",
        className
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-800/90 dark:text-teal-400">Architecture</p>
      <div className="mt-4">
        <ArchitectureFlow layers={layers} />
      </div>
      {notes?.length ? (
        <ul className="mt-5 space-y-2 border-t border-slate-200/80 pt-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-400">
          {notes.map((note) => (
            <li key={note} className="flex gap-2">
              <span className="shrink-0 text-teal-600 dark:text-teal-400">·</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function ProjectDetails({ project }) {
  const p = project;
  const [theme] = useWorldTheme();
  const exhibition = getInstallation(p.slug);
  if (exhibition) {
    return <InstallationRoom slug={p.slug} />;
  }
  if (p.slug === "project-amc-datalake-solution" || p.caseStudy === "amc") {
    return <AmcCaseStudy />;
  }
  if (p.slug === "olap-workload-architecture" || p.caseStudy === "olap") {
    return <OlapWorkloadCaseStudy />;
  }
  if (p.slug === "brain-mvp" || p.caseStudy === "brain") {
    return <BrainMvpCaseStudy />;
  }
  if (p.slug === "automated-intelligence-pipeline" || p.caseStudy === "intelligence") {
    return <IntelligencePipelineCaseStudy />;
  }
  const related = getRelatedProjects(p.slug);
  const hasArchitecture = Boolean(p.architectureLayers?.length);

  return (
    <div className="wd-root wd-page wk-root min-h-screen is-ready" data-theme={theme}>
      <WorldPageNav active="work" />
      <div className="wd-page-main mx-auto min-w-0 w-full max-w-6xl animate-fadeIn px-5 pb-20 xl:max-w-7xl">
      <div
        className={cn(
          "min-w-0",
          hasArchitecture && "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start lg:gap-10 xl:gap-12"
        )}
      >
        <div className="min-w-0">
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
            <h1 className="mt-3 break-words text-[clamp(1.65rem,5vw,2.25rem)] font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {p.title}
            </h1>
            {p.purpose ? <p className="mt-2 text-base text-slate-600 dark:text-slate-400">{p.purpose}</p> : null}
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{[p.role, p.timeline].filter(Boolean).join(" · ")}</p>
            {p.summary ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">{p.summary}</p> : null}
          </header>

          {hasArchitecture ? (
            <ArchitecturePanel layers={p.architectureLayers} notes={p.architectureNotes} className="mt-8 lg:hidden" />
          ) : null}

          <Section title="The problem">
            <p className="max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">{p.problem || p.content?.trim() || p.desc}</p>
          </Section>

          <Section title="Key decisions">
            {p.decisions?.[0]?.why ? (
              <EditorialNote label="Mansi's call" className="mb-6 max-w-2xl">
                {p.decisions[0].why}
              </EditorialNote>
            ) : null}
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
            {p.implementationNotes?.length ? (
              <ul className="max-w-2xl list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
                {p.implementationNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : p.architectureNotes?.length && !hasArchitecture ? (
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

          <ProjectCaseStudyNav slug={p.slug} className="mt-12" />
        </div>

        {hasArchitecture ? (
          <aside className="hidden min-w-0 lg:block">
            <div className="sticky top-[calc(4rem+env(safe-area-inset-top,0px))] pt-2">
              <ArchitecturePanel layers={p.architectureLayers} notes={p.architectureNotes} />
            </div>
          </aside>
        ) : null}
      </div>
      </div>
    </div>
  );
}
