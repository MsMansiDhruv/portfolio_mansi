"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/design-system-v2";
import AiLabPromo from "@/components/portfolio/home/AiLabPromo";
import HomeExperienceRail from "@/components/portfolio/home/HomeExperienceRail";
import PlatformPipeline from "@/components/portfolio/home/PlatformPipeline";
import ProjectCaseStudyVisual from "@/components/portfolio/home/ProjectCaseStudyVisual";
import AskMansiFeature from "@/components/portfolio/identity/AskMansiFeature";
import ComplexityClarityMoment from "@/components/portfolio/identity/ComplexityClarityMoment";
import HomeRecommendationsTeaser from "@/components/portfolio/identity/HomeRecommendationsTeaser";
import HowIThinkSection from "@/components/portfolio/identity/HowIThinkSection";
import HumanMomentsStrip from "@/components/portfolio/identity/HumanMomentsStrip";
import MansiMark from "@/components/portfolio/identity/MansiMark";
import PersonWorkBridge from "@/components/portfolio/identity/PersonWorkBridge";
import PortraitPanel from "@/components/portfolio/identity/PortraitPanel";
import EditorialNote from "@/components/portfolio/identity/EditorialNote";
import { IDENTITY_HERO, MANSI_SIGNATURE } from "@/lib/data/identity";
import { FEATURED_PROJECT_SLUG } from "@/lib/data/project-meta";
import { HOME_CASE_STUDIES } from "@/lib/data/home-content";
import { Reveal, HoverLift } from "@/components/portfolio/motion";

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-800/80 dark:text-teal-400/90">
      {children}
    </p>
  );
}

function formatTechLabel(label, max = 4) {
  const parts = (label || "").split(" · ").filter(Boolean);
  if (parts.length <= max) return parts.join(" · ");
  return parts.slice(0, max).join(" · ");
}

function CaseStudyRow({ study }) {
  return (
    <HoverLift>
      <Link
        href={`/projects/${study.slug}`}
        className="group block border-b border-slate-200/90 py-6 transition dark:border-slate-800"
      >
        <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,12rem)] md:items-start">
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400">{study.category}</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{study.title}</h3>
            <p className="mt-2 break-words text-xs text-slate-500 dark:text-slate-400">{formatTechLabel(study.techLabel)}</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{study.outcome}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-800 transition group-hover:gap-2 dark:text-teal-400">
              Explore
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </div>
          {study.visual ? <ProjectCaseStudyVisual visual={study.visual} compact /> : null}
        </div>
      </Link>
    </HoverLift>
  );
}

export default function HomePage() {
  const [, ...rest] = HOME_CASE_STUDIES;

  return (
    <div className="pb-8">
      {/* HERO — person first */}
      <Reveal>
        <section className="relative min-w-0">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-12">
            <div className="min-w-0 pt-2">
              <div className="flex items-center gap-3">
                <MansiMark />
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">{MANSI_SIGNATURE.motif}</p>
              </div>
              <h1 className="mt-5 text-[clamp(2rem,6vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-slate-950 dark:text-white">
                {IDENTITY_HERO.name}
              </h1>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400">{IDENTITY_HERO.role}</p>
              <p className="mt-1 text-sm text-slate-500">{IDENTITY_HERO.domains}</p>

              <p className="mt-8 max-w-2xl text-[clamp(1.15rem,2.8vw,1.45rem)] font-medium leading-[1.45] text-slate-900 dark:text-slate-100">
                {IDENTITY_HERO.headline}
              </p>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {IDENTITY_HERO.humanLine}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href={`/projects/${FEATURED_PROJECT_SLUG}`} size="lg" className="rounded-full">
                  See my work
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/tools/ai-lab?mode=ask" variant="secondary" size="lg" className="rounded-full">
                  Ask Mansi
                </Button>
              </div>
            </div>

            <div className="min-w-0 space-y-5">
              <PortraitPanel />
              <ComplexityClarityMoment />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.06} className="mt-14 sm:mt-16 lg:mt-20 block">
        <PersonWorkBridge />
      </Reveal>

      <Reveal delay={0.08} className="mt-14 sm:mt-16 lg:mt-20 block">
        <HowIThinkSection />
      </Reveal>

      <Reveal delay={0.1} className="mt-14 sm:mt-16 lg:mt-20 block">
        <section>
          <SectionLabel>What I build</SectionLabel>
          <p className="mt-3 max-w-lg text-sm text-slate-600 dark:text-slate-400">
            Data platforms, pipelines, and architecture — the craft behind the person.
          </p>
          <PlatformPipeline />
        </section>
      </Reveal>

      <Reveal delay={0.1} className="mt-14 sm:mt-16 lg:mt-20 block">
        <section>
          <SectionLabel>Featured work</SectionLabel>
          <p className="mt-3 max-w-lg text-sm text-slate-600 dark:text-slate-400">
            More projects — the flagship case study is above.
          </p>
          <div className="mt-6">
            {rest.map((study) => (
              <CaseStudyRow key={study.slug} study={study} />
            ))}
          </div>
          <Link
            href="/projects"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-teal-800 dark:text-teal-400"
          >
            View all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </Reveal>

      <Reveal delay={0.11} className="mt-14 sm:mt-16 lg:mt-20 block">
        <HumanMomentsStrip />
      </Reveal>

      <Reveal delay={0.12} className="mt-14 sm:mt-16 lg:mt-20 block">
        <section>
          <SectionLabel>Experience</SectionLabel>
          <HomeExperienceRail />
        </section>
      </Reveal>

      <Reveal delay={0.13} className="mt-14 sm:mt-16 lg:mt-20 block">
        <AskMansiFeature />
      </Reveal>

      <Reveal delay={0.14} className="mt-14 sm:mt-16 lg:mt-20 block">
        <AiLabPromo />
      </Reveal>

      <Reveal delay={0.15} className="mt-14 sm:mt-16 lg:mt-20 block">
        <HomeRecommendationsTeaser />
      </Reveal>

      <Reveal delay={0.16} className="mt-14 sm:mt-16 lg:mt-20 block">
        <section className="max-w-2xl">
          <EditorialNote label="Beyond the stack">
            I like understanding how systems behave under real constraints — performance, cost, reliability, and the
            people who have to operate them.
          </EditorialNote>
          <Link href="/contact" className="mt-6 inline-flex text-sm font-medium text-teal-800 dark:text-teal-400">
            Get in touch →
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
