"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/design-system-v2";
import { EXPERIENCE_SNAPSHOT } from "@/lib/data/career";
import {
  AI_AGENTS,
  BEYOND_STACK,
  ENGINEERING_PRINCIPLES,
  HOME_CASE_STUDIES,
} from "@/lib/data/home-content";
import { FEATURED_PROJECT_SLUG, getProjectMeta } from "@/lib/data/project-meta";
import { Reveal, HoverLift } from "@/components/portfolio/motion";

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-800/80 dark:text-teal-400/90">{children}</p>
  );
}

function formatTechLabel(label, max = 4) {
  const parts = (label || "").split(" · ").filter(Boolean);
  if (parts.length <= max) return parts.join(" · ");
  return parts.slice(0, max).join(" · ");
}

function FeaturedStackMeta({ tech = [] }) {
  if (!tech.length) return null;
  return (
    <div className="md:max-w-[11rem] md:shrink-0 lg:max-w-[12.5rem]">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
        Featured stack
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5 md:flex-col md:items-end md:gap-1">
        {tech.slice(0, 8).map((item) => (
          <li
            key={item}
            className="rounded-md border border-slate-200/70 bg-slate-50/60 px-2 py-0.5 text-[11px] leading-snug text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/40 dark:text-slate-400"
          >
            {item.replace(/^AWS\s+/i, "")}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeaturedCaseStudyRow({ study, stackTech }) {
  return (
    <HoverLift>
      <Link
        href={`/projects/${study.slug}`}
        className="group block border-b border-slate-200/90 py-6 transition dark:border-slate-800 md:py-8"
      >
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-8 lg:gap-10">
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400">{study.category}</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-3xl">
              {study.title}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{study.outcome}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-800 transition group-hover:gap-2 dark:text-teal-400">
              Explore project
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </div>
          <FeaturedStackMeta tech={stackTech} />
        </div>
      </Link>
    </HoverLift>
  );
}

function CaseStudyRow({ study }) {
  return (
    <HoverLift>
      <Link
        href={`/projects/${study.slug}`}
        className="group block border-b border-slate-200/90 py-6 transition dark:border-slate-800"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">{study.category}</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {study.title}
            </h3>
            <p className="mt-2 break-words text-xs text-slate-500 dark:text-slate-400">{formatTechLabel(study.techLabel)}</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{study.outcome}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-teal-800 transition group-hover:gap-2 dark:text-teal-400">
            Explore
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </HoverLift>
  );
}

export default function HomePage() {
  const heroProject = getProjectMeta(FEATURED_PROJECT_SLUG);
  const [primary, ...rest] = HOME_CASE_STUDIES;

  return (
    <div className="space-y-14 pb-8 sm:space-y-20 lg:space-y-24">
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-[#faf9f6] via-white to-teal-50/30 px-5 py-8 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-teal-950/20 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" aria-hidden />
          <SectionLabel>Data engineering · Cloud · AI</SectionLabel>
          <h1 className="mt-4 max-w-3xl text-[clamp(1.75rem,6.5vw,3.25rem)] font-semibold leading-[1.1] tracking-tight text-slate-950 dark:text-white">
            I build reliable data platforms that turn complex systems into something teams can actually operate.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
            Lead Data Engineer and Solution Architect working across data platforms, cloud architecture, distributed systems, and applied AI.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Button href={`/projects/${FEATURED_PROJECT_SLUG}`} size="lg" className="rounded-full">
              Explore featured work
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/tools/ai-lab" variant="secondary" size="lg" className="rounded-full">
              Explore AI Lab
            </Button>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.05}>
        <section>
          <SectionLabel>Featured work</SectionLabel>
          <p className="mt-3 max-w-lg text-sm text-slate-600 dark:text-slate-400">
            A few projects that represent how I approach platform engineering.
          </p>
          <div className="mt-6">
            {primary ? (
              <FeaturedCaseStudyRow study={primary} stackTech={heroProject?.tech || []} />
            ) : null}
            {rest.map((study) => (
              <CaseStudyRow key={study.slug} study={study} />
            ))}
          </div>
          <Link href="/projects" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-teal-800 dark:text-teal-400">
            View all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </Reveal>

      <Reveal delay={0.08}>
        <section>
          <SectionLabel>How I think about engineering</SectionLabel>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {ENGINEERING_PRINCIPLES.map((item) => (
              <li key={item.title} className="border-l-2 border-teal-600/40 pl-4 dark:border-teal-500/50">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.phrase}</p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-[#faf9f6] to-teal-50/50 px-5 py-7 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-teal-950/25 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-md">
              <SectionLabel>Product</SectionLabel>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                AI Engineering Lab
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                A hands-on exploration of how AI can reason about real engineering problems.
              </p>
            </div>
            <Link
              href="/tools/ai-lab"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-800 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Explore AI Lab
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {AI_AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="rounded-lg border border-slate-200/90 bg-white/90 px-3 py-2.5 text-center text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
              >
                {agent.label}
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.12}>
        <section>
          <SectionLabel>Experience</SectionLabel>
          <ol className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
            {EXPERIENCE_SNAPSHOT.map((item) => (
              <li key={item.year}>
                <p className="text-xs font-medium text-teal-800 dark:text-teal-400">{item.year}</p>
                <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{item.title}</p>
              </li>
            ))}
          </ol>
          <Link href="/credentials" className="mt-6 inline-block text-sm font-medium text-teal-800 dark:text-teal-400">
            View experience & credentials →
          </Link>
        </section>
      </Reveal>

      <Reveal delay={0.14}>
        <section className="max-w-2xl border-l-2 border-slate-300 pl-6 dark:border-slate-700">
          <SectionLabel>Beyond the stack</SectionLabel>
          <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{BEYOND_STACK}</p>
        </section>
      </Reveal>
    </div>
  );
}
