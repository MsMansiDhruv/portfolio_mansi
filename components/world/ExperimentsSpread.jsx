"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { HOME_CASE_STUDIES } from "@/lib/data/home-content";

export default function ExperimentsSpread() {
  const reduced = useReducedMotion();
  const experiments = HOME_CASE_STUDIES.filter((s) => s.kind === "experiment");

  if (!experiments.length) return null;

  return (
    <section id="act-experiments" className="world-act-paper relative px-5 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--world-muted)]">Things I built because I was curious</p>
            <h2 className="world-display mt-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight">
              Not every build had a ticket.
            </h2>
          </div>
          <Link
            href="/projects"
            className="world-display inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--world-violet)]"
          >
            All experiments
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 space-y-16">
          {experiments.map((study, i) => (
            <motion.div
              key={study.slug}
              initial={reduced ? false : { opacity: 0, x: i % 2 ? 24 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid gap-8 border-t border-[var(--world-ink)]/10 pt-12 lg:grid-cols-[1fr_2fr]"
            >
              <div>
                <p className="world-display text-6xl font-extrabold text-[var(--world-lime)]/80">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wider opacity-50">{study.techLabel}</p>
              </div>
              <div>
                <h3 className="world-display text-2xl font-bold sm:text-3xl">{study.title}</h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed opacity-75">{study.problem}</p>
                <Link
                  href={`/projects/${study.slug}`}
                  className="world-display mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--world-ink)] underline decoration-[var(--world-lime)] decoration-2 underline-offset-4"
                >
                  Read the build
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
