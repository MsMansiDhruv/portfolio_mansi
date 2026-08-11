"use client";

import { AWARDS } from "@/lib/data/career";
import { Reveal } from "@/components/portfolio/motion";

export default function RecognitionGrid() {
  return (
    <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {AWARDS.map((award, index) => (
        <Reveal key={award.id} delay={index * 0.03} viewportAmount={0.08}>
          <article className="min-w-0 border-l border-slate-200 py-1 pl-3 dark:border-slate-800">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{award.title}</h3>
              <span className="shrink-0 text-[10px] text-slate-400">{award.year}</span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{award.org}</p>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {award.summary}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
