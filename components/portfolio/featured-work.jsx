"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { ArchitectureFlow } from "./storytelling";

export function FeaturedProjectSpotlight({ project, className }) {
  if (!project) return null;
  const techLine = (project.tech || []).slice(0, 6).join(" · ");
  const hook = project.problem || project.summary || project.desc;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/90",
        className
      )}
    >
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-0">
        <div className="border-b border-slate-200 p-6 sm:p-8 lg:border-b-0 lg:border-r dark:border-slate-800">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-teal-700 dark:text-teal-400">
            {project.category}
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {project.title}
          </h3>
          {techLine ? <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{techLine}</p> : null}
          <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{hook}</p>
          <Link
            href={`/projects/${project.slug}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-900 dark:text-teal-400"
          >
            Full architecture & decisions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="bg-slate-50/80 p-6 sm:p-8 dark:bg-slate-900/50">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">System layers</p>
          <div className="mt-4">
            <ArchitectureFlow layers={project.architectureLayers} compact />
          </div>
        </div>
      </div>
    </article>
  );
}

export function SupportingProjectCard({ project }) {
  const techLine = (project.tech || []).slice(0, 4).join(" · ");
  const line = project.summary || project.desc;
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col rounded-xl border border-slate-200/90 bg-white p-4 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-slate-700"
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{project.category}</p>
      <h4 className="mt-2 text-base font-semibold text-slate-950 dark:text-white">{project.title}</h4>
      {techLine ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{techLine}</p> : null}
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-400">{line}</p>
      <span className="mt-3 text-xs font-medium text-teal-700 dark:text-teal-400">Explore →</span>
    </Link>
  );
}
