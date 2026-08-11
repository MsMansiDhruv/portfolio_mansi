"use client";

import { TECHNICAL_PROFILE } from "@/lib/data/credentials-content";
import { Reveal } from "@/components/portfolio/motion";

export default function TechnicalProfileGrid() {
  return (
    <div className="mt-4 space-y-5">
      {Object.entries(TECHNICAL_PROFILE).map(([group, items], index) => (
        <Reveal key={group} delay={index * 0.03} viewportAmount={0.08}>
          <div className="min-w-0">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              {group}
            </h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {items.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md border border-slate-200/90 bg-slate-50/80 px-2 py-0.5 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
