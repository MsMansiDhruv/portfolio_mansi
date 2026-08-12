"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HoverLift } from "@/components/portfolio/motion";
import ProjectCaseStudyVisual from "@/components/portfolio/home/ProjectCaseStudyVisual";

export default function ProjectExploreRow({ study, index, variant = "client" }) {
  const isExperiment = variant === "experiment";

  return (
    <HoverLift>
      <Link
        href={`/projects/${study.slug}`}
        className="group block border-b border-slate-200/90 py-6 transition dark:border-slate-800 md:py-7"
      >
        <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,11rem)] md:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[10px] tabular-nums text-slate-300 dark:text-slate-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              {isExperiment ? (
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-violet-700/70 dark:text-violet-400/80">
                  Built because I wanted to
                </span>
              ) : null}
            </div>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
              {study.title}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{study.outcome}</p>
            {study.editorialNote ? (
              <p className="mt-3 max-w-lg text-sm italic text-slate-500 opacity-0 transition group-hover:opacity-100 dark:text-slate-400">
                {study.editorialNote}
              </p>
            ) : null}
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-800 dark:text-teal-400">
              Open case study
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </div>
          {study.visual ? (
            <ProjectCaseStudyVisual
              visual={study.visual}
              compact
              className={isExperiment ? "border-violet-200/50 dark:border-violet-900/30" : undefined}
            />
          ) : null}
        </div>
      </Link>
    </HoverLift>
  );
}
