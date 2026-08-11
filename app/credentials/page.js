"use client";

import Link from "next/link";
import AwardsList from "@/components/AwardsList";
import TestimonialsGrid from "@/components/portfolio/TestimonialsGrid";
import { Reveal } from "@/components/portfolio/motion";
import { PageHeader } from "@/components/portfolio/primitives";
import {
  ABOUT_ME,
  AWARDS,
  CAREER_TIMELINE,
  CERTIFICATIONS,
  getAboutHeroLine,
  getAboutMetadataLine,
  getAtAGlance,
} from "@/lib/data/career";

function SectionLabel({ children, className = "" }) {
  return (
    <p
      className={`text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-800/80 dark:text-teal-400/90 ${className}`}
    >
      {children}
    </p>
  );
}

function SectionBlock({ label, intro, children, className = "", contentClassName = "" }) {
  return (
    <section className={className}>
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-3 border-t border-slate-200 dark:border-slate-800" aria-hidden />
      {intro ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{intro}</p> : null}
      <div className={`${intro ? "mt-5" : "mt-4"} ${contentClassName}`}>{children}</div>
    </section>
  );
}

function ExperienceRow({ item, isLast, index }) {
  return (
    <Reveal as="li" delay={index * 0.05} viewportAmount={0.2} className="list-none">
      <div className="relative grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-5 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-x-8">
        <div className="relative pt-1">
          <span
            className="absolute -right-2 top-2 hidden h-1.5 w-1.5 rounded-full bg-teal-700/70 sm:block dark:bg-teal-500/70"
            aria-hidden
          />
          <p className="text-xs tabular-nums font-medium text-teal-800/90 dark:text-teal-400/90">{item.year}</p>
        </div>
        <div className={`min-w-0 ${isLast ? "pb-0" : "border-b border-slate-200/90 pb-6 dark:border-slate-800/90"}`}>
          <p className="text-base font-semibold tracking-tight text-slate-950 dark:text-white sm:text-[1.05rem]">
            {item.title}
          </p>
          {item.focus ? (
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.focus}</p>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}

function CertificationRow({ cert, index }) {
  const meta = [cert.org, cert.year, cert.verified ? "Verified" : null].filter(Boolean).join(" · ");

  return (
    <Reveal as="li" delay={index * 0.04} viewportAmount={0.15} className="list-none">
      <div className="border-b border-slate-200/90 py-3.5 last:border-b-0 dark:border-slate-800/90">
        {cert.link ? (
          <a
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-slate-950 underline-offset-2 hover:underline dark:text-white"
          >
            {cert.title}
          </a>
        ) : (
          <p className="text-sm font-semibold text-slate-950 dark:text-white">{cert.title}</p>
        )}
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{meta}</p>
      </div>
    </Reveal>
  );
}

function AtAGlancePanel({ data }) {
  const rows = [
    { label: "Experience", value: data.experience },
    { label: "Role", value: data.role },
    { label: "Cloud", value: data.cloud },
    { label: "Languages & compute", value: data.languages },
    { label: "Domains", value: data.domains },
  ];

  return (
    <aside className="min-w-0 border-t border-slate-200 pt-8 dark:border-slate-800 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-1">
      <SectionLabel>At a glance</SectionLabel>
      <dl className="mt-4 space-y-4">
        {rows.map((row, index) => (
          <Reveal key={row.label} delay={0.08 + index * 0.05} viewportAmount={0.2}>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                {row.label}
              </dt>
              <dd className="mt-1 text-sm leading-snug text-slate-700 dark:text-slate-300">{row.value}</dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </aside>
  );
}

export default function CredentialsPage() {
  const heroLine = getAboutHeroLine();
  const metadataLine = getAboutMetadataLine();
  const atAGlance = getAtAGlance();

  return (
    <main className="min-w-0 w-full overflow-x-hidden pb-12 pt-2">
      <Reveal revealOn="mount">
        <header>
          <PageHeader
            eyebrow="Profile"
            title="About & experience"
            description="Who I am, how my work has evolved, and the credentials behind it."
          />

          <div className="mt-10 max-w-3xl border-b border-slate-200 pb-10 dark:border-slate-800">
            <p className="text-[1.2rem] font-medium leading-[1.55] text-slate-900 dark:text-slate-100 sm:text-[1.3rem]">
              {heroLine}
            </p>
            <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              {metadataLine}
            </p>
          </div>
        </header>
      </Reveal>

      <Reveal delay={0.06} className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-16 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <SectionLabel>About me</SectionLabel>
          <div className="mt-3 border-t border-slate-200 dark:border-slate-800" aria-hidden />
          <div className="mt-5 max-w-2xl space-y-4 border-l-2 border-teal-700/20 pl-5 dark:border-teal-500/25">
            {ABOUT_ME.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 32)} delay={0.1 + index * 0.06}>
                <p
                  className={
                    index === 0
                      ? "text-[0.9375rem] leading-relaxed text-slate-800 dark:text-slate-200"
                      : "text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                  }
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <AtAGlancePanel data={atAGlance} />
      </Reveal>

      <Reveal delay={0.05} className="mt-16 block">
        <SectionBlock label="Experience">
          <ol className="relative max-w-3xl space-y-6 pl-1 before:absolute before:bottom-2 before:left-[1.6rem] before:top-2 before:w-px before:bg-slate-200 before:content-[''] sm:before:left-[2.2rem] dark:before:bg-slate-800">
            {CAREER_TIMELINE.map((item, index) => (
              <ExperienceRow
                key={item.id}
                item={item}
                index={index}
                isLast={index === CAREER_TIMELINE.length - 1}
              />
            ))}
          </ol>
        </SectionBlock>
      </Reveal>

      <Reveal delay={0.06} className="mt-16 block">
        <SectionBlock
          label="Recognition"
          intro="Awards, scholarships, and recognitions from professional and academic work."
          contentClassName="rounded-sm border border-slate-200/70 bg-[#faf9f6]/60 px-5 py-1 dark:border-slate-800/80 dark:bg-slate-900/20 sm:px-6"
        >
          <AwardsList initialAwards={AWARDS} showHeader={false} variant="editorial" />
        </SectionBlock>
      </Reveal>

      <Reveal delay={0.07} className="mt-16 block">
        <SectionBlock label="Certifications">
          <ol className="max-w-2xl">
            {CERTIFICATIONS.map((cert, index) => (
              <CertificationRow key={cert.id} cert={cert} index={index} />
            ))}
          </ol>
        </SectionBlock>
      </Reveal>

      <Reveal delay={0.08} className="mt-16 block">
        <SectionBlock label="What people say">
          <TestimonialsGrid />
        </SectionBlock>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 block border-t border-slate-200 pt-8 dark:border-slate-800">
        <section>
          <SectionLabel>Resume</SectionLabel>
          <p className="mt-4 max-w-lg text-sm text-slate-600 dark:text-slate-400">Full PDF résumé with detailed experience.</p>
          <Link
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-800 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
          >
            View full resume →
          </Link>
        </section>
      </Reveal>
    </main>
  );
}
