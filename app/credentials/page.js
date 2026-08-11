"use client";

import Link from "next/link";
import { Reveal } from "@/components/portfolio/motion";
import RecognitionGrid from "@/components/portfolio/credentials/RecognitionGrid";
import SkillsCredentialsSection from "@/components/portfolio/credentials/SkillsCredentialsSection";
import VisualCareerTimeline from "@/components/portfolio/credentials/VisualCareerTimeline";
import RecommendationsSection from "@/components/portfolio/RecommendationsSection";
import { ABOUT_ME, getAboutHeroLine } from "@/lib/data/career";
import { PROFILE } from "@/lib/data/credentials-content";

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-800/80 dark:text-teal-400/90">
      {children}
    </p>
  );
}

function SectionRule() {
  return <div className="mt-3 border-t border-slate-200 dark:border-slate-800" aria-hidden />;
}

export default function CredentialsPage() {
  const heroLine = getAboutHeroLine();

  return (
    <main className="min-w-0 w-full overflow-x-hidden pb-14 pt-2">
      <Reveal revealOn="mount">
        <header className="border-b border-slate-200 pb-10 dark:border-slate-800">
          <SectionLabel>Profile</SectionLabel>

          <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-14">
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                {PROFILE.name}
              </h1>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400">{PROFILE.headline}</p>
              <p className="mt-1 text-sm text-slate-500">{PROFILE.domains}</p>

              <p className="mt-8 max-w-2xl text-[1.15rem] font-medium leading-[1.6] text-slate-900 dark:text-slate-100 sm:text-[1.25rem]">
                {heroLine}
              </p>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{ABOUT_ME[0]}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-500">{ABOUT_ME[1]}</p>
            </div>

            <div className="min-w-0 border-t border-slate-200/80 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-1 dark:border-slate-800">
              <VisualCareerTimeline />
            </div>
          </div>
        </header>
      </Reveal>

      <Reveal delay={0.05} className="mt-12 block">
        <section>
          <SectionLabel>Recognition</SectionLabel>
          <SectionRule />
          <RecognitionGrid />
        </section>
      </Reveal>

      <Reveal delay={0.06} className="mt-12 block">
        <section>
          <SectionLabel>Skills &amp; credentials</SectionLabel>
          <SectionRule />
          <SkillsCredentialsSection />
        </section>
      </Reveal>

      <Reveal delay={0.07} className="mt-12 block">
        <section id="recommendations">
          <SectionLabel>Recommendations</SectionLabel>
          <SectionRule />
          <RecommendationsSection />
        </section>
      </Reveal>

      <Reveal delay={0.08} className="mt-12 block border-t border-slate-200 pt-8 dark:border-slate-800">
        <section className="max-w-lg">
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">Want the complete career history?</h2>
          <Link
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-medium text-teal-800 transition hover:text-teal-900 dark:text-teal-400"
          >
            View resume →
          </Link>
        </section>
      </Reveal>
    </main>
  );
}
