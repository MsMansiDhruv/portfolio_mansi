"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CAREER_TIMELINE, CURRENT_ROLE } from "@/lib/data/career";
import { getExperienceYearsLabel } from "@/lib/career/experience";

export default function CareerTimelineCinematic({ showHeader = true }) {
  const reduced = useReducedMotion();
  const ordered = [...CAREER_TIMELINE].reverse();
  const years = getExperienceYearsLabel();

  return (
    <section id="chapter-journey" className="relative overflow-hidden px-5 py-20 sm:px-10 lg:px-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: "linear-gradient(90deg, rgba(212,160,67,0.08) 0%, transparent 30%, transparent 70%, rgba(40,217,240,0.06) 100%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1400px]">
        {showHeader ? (
          <header className="mb-12">
            <p className="kairo-mono text-[var(--kairo-gold)]">Chapter 02</p>
            <h2 className="kairo-display mt-3 text-[clamp(2rem,5vw,3.25rem)] font-bold uppercase">The Journey</h2>
            <p className="mt-4 kairo-mono text-[var(--kairo-muted)]">{years} years · still climbing</p>
          </header>
        ) : (
          <header className="mb-12">
            <p className="kairo-mono text-[var(--kairo-gold)]">Character progression</p>
            <h2 className="kairo-display mt-3 text-2xl font-bold uppercase">The evolution</h2>
            <p className="mt-4 kairo-mono text-[var(--kairo-muted)]">{years} years</p>
          </header>
        )}

        <div className="overflow-x-auto pb-6">
          <div className="relative flex min-w-max gap-0">
            <div className="absolute left-0 right-0 top-[3.25rem] h-px bg-gradient-to-r from-[var(--kairo-gold)] via-[var(--kairo-cyan)] to-[var(--kairo-violet)] opacity-40" aria-hidden />
            {ordered.map((stage, i) => (
              <motion.div
                key={stage.id}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="relative w-52 shrink-0 px-4 pt-0"
              >
                <div className="mx-auto flex h-3 w-3 items-center justify-center rounded-full border-2 border-[var(--kairo-gold)] bg-[var(--kairo-ink)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--kairo-gold)]" />
                </div>
                <p className="kairo-display mt-6 text-2xl font-extrabold text-[var(--kairo-gold)]">{stage.year}</p>
                <p className="kairo-mono mt-2 text-[var(--kairo-paper)]">{stage.title}</p>
                <p className="mt-3 text-xs leading-relaxed text-[var(--kairo-muted)]">{stage.desc}</p>
                <p className="kairo-mono mt-3 text-[10px] text-[var(--kairo-cyan)]/80">{stage.focus}</p>
              </motion.div>
            ))}
            <div className="relative w-40 shrink-0 px-4">
              <div className="mx-auto flex h-3 w-3 items-center justify-center rounded-full border-2 border-[var(--kairo-violet)] bg-[var(--kairo-violet)]/30">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--kairo-violet)]" />
              </div>
              <p className="kairo-display mt-6 text-2xl font-extrabold text-[var(--kairo-violet)]">NOW</p>
              <p className="kairo-mono mt-2">{CURRENT_ROLE}</p>
            </div>
          </div>
        </div>

        <Link href="/credentials" className="kairo-mono mt-6 inline-block text-[var(--kairo-gold)] hover:text-[var(--kairo-cyan)]">
          Full character progression →
        </Link>
      </div>
    </section>
  );
}
