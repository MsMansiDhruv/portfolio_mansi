"use client";

import { HUMAN_MOMENTS } from "@/lib/data/identity";
import { Reveal } from "@/components/portfolio/motion";

export default function HumanMomentsStrip() {
  return (
    <div className="grid gap-6 border-y border-slate-200/90 py-8 dark:border-slate-800 sm:grid-cols-3 sm:gap-8">
      {HUMAN_MOMENTS.map((item, index) => (
        <Reveal key={item.label} delay={index * 0.05} viewportAmount={0.15}>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-800/70 dark:text-amber-500/80">
              {item.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
