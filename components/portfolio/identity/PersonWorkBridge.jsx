"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FEATURED_PROJECT_SLUG, getProjectMeta } from "@/lib/data/project-meta";
import { Reveal } from "@/components/portfolio/motion";
import EditorialNote from "@/components/portfolio/identity/EditorialNote";
import PortraitPanel from "@/components/portfolio/identity/PortraitPanel";
import ProjectCaseStudyVisual from "@/components/portfolio/home/ProjectCaseStudyVisual";
import { HOME_CASE_STUDIES } from "@/lib/data/home-content";

export default function PersonWorkBridge() {
  const flagship = getProjectMeta(FEATURED_PROJECT_SLUG);
  const study = HOME_CASE_STUDIES.find((s) => s.slug === FEATURED_PROJECT_SLUG);

  if (!flagship || !study) return null;

  return (
    <section className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
      <Reveal viewportAmount={0.2}>
        <PortraitPanel size="compact" />
      </Reveal>

      <Reveal delay={0.05} className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">This person builds</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          {flagship.title}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{study.outcome}</p>

        {study.editorialNote ? (
          <EditorialNote label={study.editorialLabel} className="mt-5 max-w-lg">
            {study.editorialNote}
          </EditorialNote>
        ) : null}

        <div className="mt-6 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,11rem)] sm:items-start">
          {study.visual ? <ProjectCaseStudyVisual visual={study.visual} /> : null}
          <Link
            href={`/projects/${flagship.slug}`}
            className="inline-flex items-center gap-1 self-start text-sm font-medium text-teal-800 dark:text-teal-400"
          >
            Read the case study
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
