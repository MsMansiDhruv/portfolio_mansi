"use client";

import { Award } from "lucide-react";
import { AWARDS } from "@/lib/data/career";
import { Reveal } from "@/components/portfolio/motion";

export default function RecognitionGrid() {
  return (
    <div className="relative mt-6 min-w-0">
      <div
        className="pointer-events-none absolute bottom-3 left-[0.55rem] top-3 hidden w-px bg-slate-200 sm:block dark:bg-slate-700"
        aria-hidden
      />
      <ol className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {AWARDS.map((award, index) => (
          <Reveal key={award.id} delay={index * 0.04} viewportAmount={0.08}>
            <li className="relative flex min-w-0 gap-3 sm:block sm:pl-0">
              <span className="relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-teal-800/70 dark:border-slate-700 dark:bg-slate-950 dark:text-teal-400/80 sm:absolute sm:-left-0 sm:top-1 sm:mt-0">
                <Award className="h-2.5 w-2.5" strokeWidth={2} aria-hidden />
              </span>
              <article className="min-w-0 flex-1 sm:pl-7">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{award.title}</h3>
                  <span className="text-[10px] tabular-nums text-slate-400">{award.year}</span>
                </div>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                  {award.org}
                </p>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {award.summary}
                </p>
              </article>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
