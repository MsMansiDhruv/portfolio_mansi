"use client";

import { Reveal } from "@/components/portfolio/motion";
import { HOW_I_THINK } from "@/lib/data/identity";

export default function HowIThinkSection() {
  const [lead, ...rest] = HOW_I_THINK;

  return (
    <section id="how-i-think">
      <Reveal>
        <blockquote className="max-w-4xl">
          <p className="font-serif text-[clamp(1.5rem,4vw,2.35rem)] italic leading-[1.2] text-slate-900 dark:text-slate-50">
            &ldquo;{lead}&rdquo;
          </p>
        </blockquote>
      </Reveal>

      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:gap-x-12 lg:gap-y-10">
        {rest.map((quote, index) => (
          <Reveal key={quote} delay={0.04 + index * 0.04} viewportAmount={0.12}>
            <li className="min-w-0 border-t border-slate-200/80 pt-5 dark:border-slate-800">
              <p className="font-serif text-base italic leading-relaxed text-slate-600 dark:text-slate-400 sm:text-[1.05rem]">
                &ldquo;{quote}&rdquo;
              </p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
