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
  PLATFORM_ARCHITECTURE_FLOW,
} from "@/lib/data/home-content";
import { FEATURED_PROJECT_SLUG } from "@/lib/data/project-meta";
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

function PlatformArchitectureFlow({ stages }) {
  return (
    <div className="mt-8 border-t border-slate-200/80 pt-6 dark:border-slate-800/80">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
        Featured stack
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">How data moves from source to decision.</p>
      <ol className="mt-4 flex min-w-0 flex-col gap-3 md:flex-row md:flex-wrap md:items-start md:gap-x-2 md:gap-y-3">
        {stages.map((item, index) => (
          <li key={item.stage} className="contents">
            {index > 0 ? (
              <>
                <span
                  className="hidden shrink-0 self-center px-1 text-sm text-slate-300 dark:text-slate-600 md:inline"
                  aria-hidden
                >
                  →
                </span>
                <span className="text-center text-xs text-slate-300 dark:text-slate-600 md:hidden" aria-hidden>
                  ↓
                </span>
              </>
            ) : null}
            <div className="min-w-0 flex-1 md:flex-none md:max-w-[11rem]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {item.stage}
              </p>
              <p className="mt-1 break-words text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                {item.tech.join(" · ")}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function FeaturedCaseStudyRow({ study }) {
  return (
    <HoverLift>
      <Link
        href={`/projects/${study.slug}`}
        className="group block border-b border-slate-200/90 py-6 transition dark:border-slate-800 md:py-8"
      >
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
  const [primary, ...rest] = HOME_CASE_STUDIES;

  return (
    <div className="pb-8">
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-[#faf9f6] via-white to-teal-50/30 px-5 py-7 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-teal-950/20 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" aria-hidden />
          <SectionLabel>Data engineering · Cloud · AI</SectionLabel>
          <h1 className="mt-4 max-w-3xl text-[clamp(1.75rem,6.5vw,3.25rem)] font-semibold leading-[1.1] tracking-tight text-slate-950 dark:text-white">
            I build reliable data platforms that turn complex systems into something teams can actually operate.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
            Lead Data Engineer and Solution Architect working across data platforms, cloud architecture, distributed systems, and applied AI.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">
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

      <Reveal delay={0.12} revealOn="mount" className="mt-8 sm:mt-9 lg:mt-10">
        <section>
          <SectionLabel>Featured work</SectionLabel>
          <p className="mt-3 max-w-lg text-sm text-slate-600 dark:text-slate-400">
            A few projects that represent how I approach platform engineering.
          </p>
          <div className="mt-6">
            {primary ? <FeaturedCaseStudyRow study={primary} /> : null}
            {rest.map((study) => (
              <CaseStudyRow key={study.slug} study={study} />
            ))}
          </div>
          <PlatformArchitectureFlow stages={PLATFORM_ARCHITECTURE_FLOW} />
          <Link href="/projects" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-teal-800 dark:text-teal-400">
            View all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </Reveal>

      <Reveal delay={0.08} className="mt-14 sm:mt-16 lg:mt-20">
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

      <Reveal delay={0.1} className="mt-14 sm:mt-16 lg:mt-20">
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

      <Reveal delay={0.12} className="mt-14 sm:mt-16 lg:mt-20">
        <section>
          <SectionLabel>Experience</SectionLabel>
          <ol className="mt-6 grid gap-6 border-t border-slate-200 pt-6 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
            {EXPERIENCE_SNAPSHOT.map((item) => (
              <li key={item.year} className="min-w-0">
                <p className="text-xs font-medium text-teal-800 dark:text-teal-400">{item.year}</p>
                <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{item.title}</p>
                {item.focus ? (
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{item.focus}</p>
                ) : null}
              </li>
            ))}
          </ol>
          <Link href="/credentials" className="mt-6 inline-block text-sm font-medium text-teal-800 dark:text-teal-400">
            View experience & credentials →
          </Link>
        </section>
      </Reveal>

      <Reveal delay={0.14} className="mt-14 sm:mt-16 lg:mt-20">
        <section className="max-w-2xl border-l-2 border-slate-300 pl-6 dark:border-slate-700">
          <SectionLabel>Beyond the stack</SectionLabel>
          <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{BEYOND_STACK}</p>
        </section>
      </Reveal>
    </div>
  );
}
