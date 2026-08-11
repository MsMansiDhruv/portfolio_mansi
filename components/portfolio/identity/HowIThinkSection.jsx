"use client";

import { Reveal } from "@/components/portfolio/motion";
import { HOW_I_THINK } from "@/lib/data/identity";
import MansiMark from "./MansiMark";

export default function HowIThinkSection() {
  const [lead, ...rest] = HOW_I_THINK;

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-800/80 dark:text-teal-400/90">
            How I think
          </p>
          <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-400">
            Opinions I actually design around—not values pasted from a job description.
          </p>
        </div>
        <MansiMark size="sm" className="opacity-60" />
      </div>

      {lead ? (
        <Reveal className="mt-8 block">
          <blockquote className="max-w-3xl border-l-2 border-amber-600/35 pl-5 dark:border-amber-500/30">
            <p className="font-serif text-[clamp(1.35rem,3.5vw,1.85rem)] italic leading-snug text-slate-800 dark:text-slate-100">
              &ldquo;{lead.quote}&rdquo;
            </p>
            <footer className="mt-3 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
              {lead.note}
            </footer>
          </blockquote>
        </Reveal>
      ) : null}

      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {rest.map((item, index) => (
          <Reveal key={item.quote} delay={0.04 + index * 0.04} viewportAmount={0.12}>
            <li className="min-w-0">
              <p className="font-serif text-base italic leading-relaxed text-slate-700 dark:text-slate-300">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">{item.note}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
