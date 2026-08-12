"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CAREER_TIMELINE } from "@/lib/data/career";
import { getExperienceYearsLabel } from "@/lib/career/experience";

export default function CareerJourney() {
  const reduced = useReducedMotion();
  const years = getExperienceYearsLabel();

  return (
    <section id="act-journey" className="relative overflow-hidden px-5 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--world-muted)]">The journey</p>
        <h2 className="world-display mt-4 text-[clamp(2rem,5vw,3rem)] font-bold">
          {years}+ years of building — and still exploring.
        </h2>

        <div className="mt-12 overflow-x-auto pb-4">
          <div className="flex min-w-max gap-0">
            {CAREER_TIMELINE.map((stage, i) => (
              <motion.div
                key={stage.year}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative w-56 shrink-0 border-t-2 border-[var(--world-cyan)]/40 pr-8 pt-6"
              >
                <p className="world-display text-3xl font-extrabold text-[var(--world-cyan)]">{stage.year}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider">{stage.title}</p>
                <p className="mt-1 text-sm text-[var(--world-muted)]">{stage.focus}</p>
                {stage.desc ? <p className="mt-3 text-xs leading-relaxed opacity-70">{stage.desc}</p> : null}
              </motion.div>
            ))}
          </div>
        </div>

        <Link
          href="/credentials"
          className="world-display mt-8 inline-block text-sm font-semibold uppercase tracking-wider text-[var(--world-cyan)]"
        >
          Full credentials →
        </Link>
      </div>
    </section>
  );
}
