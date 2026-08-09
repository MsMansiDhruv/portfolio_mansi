"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProjectNav } from "@/lib/data/project-nav";
import { cn } from "@/lib/cn";

/**
 * Footer navigation: optional engineering takeaway + prev/next through full project stack.
 */
export function ProjectCaseStudyNav({ slug, takeaway, className }) {
  const { prev, next } = getProjectNav(slug);

  return (
    <footer className={cn("mt-14 border-t border-slate-200 pt-12 pb-4 dark:border-slate-800", className)}>
      {takeaway ? (
        <>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Engineering takeaway
          </h2>
          <blockquote className="mt-4 max-w-2xl border-l-2 border-teal-700/40 pl-4 text-base leading-relaxed text-slate-700 dark:border-teal-500/50 dark:text-slate-300">
            {takeaway}
          </blockquote>
        </>
      ) : null}

      <nav
        className={cn(
          "flex flex-col gap-4 border-t border-slate-200/80 pt-8 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800",
          takeaway ? "mt-10" : "mt-0"
        )}
        aria-label="Project navigation"
      >
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="inline-flex min-h-[44px] max-w-full flex-col items-start gap-0.5 text-sm font-medium text-slate-700 transition hover:text-teal-800 dark:text-slate-300 dark:hover:text-teal-400 sm:max-w-[min(100%,20rem)]"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              Previous project
            </span>
            <span className="truncate text-teal-800 dark:text-teal-400">{prev.title}</span>
          </Link>
        ) : (
          <Link
            href="/projects"
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-teal-800 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
          >
            ← Back to Projects
          </Link>
        )}

        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="inline-flex min-h-[44px] max-w-full flex-col items-start gap-0.5 text-sm font-medium text-slate-700 transition hover:text-teal-800 dark:text-slate-300 dark:hover:text-teal-400 sm:max-w-[min(100%,20rem)] sm:items-end sm:text-right"
          >
            <span className="inline-flex items-center gap-1.5">
              Next project
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </span>
            <span className="truncate text-teal-800 dark:text-teal-400">{next.title}</span>
          </Link>
        ) : (
          <Link
            href="/projects"
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-teal-800 transition hover:text-teal-900 sm:justify-end dark:text-teal-400 dark:hover:text-teal-300"
          >
            ← Back to Projects
          </Link>
        )}
      </nav>
    </footer>
  );
}
