"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { HOME_CASE_STUDIES } from "@/lib/data/home-content";
import { EXPERIMENT_PROJECT_SLUGS } from "@/lib/data/identity";

const COVERS = {
  "project-amc-datalake-solution": "/projects/amc/architecture.png",
  "automated-intelligence-pipeline": "/projects/intelligence/architecture.jpg",
};

const ACCENTS = ["var(--kairo-cyan)", "var(--kairo-gold)", "var(--kairo-violet)", "var(--kairo-crimson)"];

export default function ProjectEpisodes() {
  const reduced = useReducedMotion();
  const episodes = HOME_CASE_STUDIES.slice(0, 5);

  return (
    <section id="chapter-work" className="relative bg-[var(--kairo-midnight)]/50 px-5 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-12">
          <p className="kairo-mono text-[var(--kairo-cyan)]">Chapter 03</p>
          <h2 className="kairo-display mt-3 text-[clamp(2rem,5vw,3.25rem)] font-bold uppercase">The Things I Build</h2>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {episodes.map((ep, i) => {
            const isExperiment = EXPERIMENT_PROJECT_SLUGS.includes(ep.slug);
            const cover = COVERS[ep.slug];
            const accent = ACCENTS[i % ACCENTS.length];

            return (
              <motion.div
                key={ep.slug}
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={`/projects/${ep.slug}`} className="group relative block overflow-hidden border border-white/10 bg-[var(--kairo-charcoal)]/40">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {cover ? (
                      <Image
                        src={cover}
                        alt=""
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `radial-gradient(circle at 30% 40%, ${accent}33, transparent 60%), linear-gradient(135deg, #0a0f1c, #1c2436)`,
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--kairo-ink)] via-[var(--kairo-ink)]/40 to-transparent" />
                    <span className="kairo-mono absolute left-4 top-4 text-[var(--kairo-gold)]">
                      EP {String(i + 1).padStart(2, "0")}
                    </span>
                    {isExperiment ? (
                      <span className="kairo-mono absolute right-4 top-4 border border-[var(--kairo-violet)]/50 px-2 py-0.5 text-[var(--kairo-violet)]">
                        Experiment
                      </span>
                    ) : null}
                  </div>
                  <div className="p-5">
                    <h3 className="kairo-display text-lg font-bold leading-tight group-hover:text-[var(--kairo-cyan)]">
                      {ep.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--kairo-muted)]">{ep.problem}</p>
                    <p className="kairo-mono mt-4 text-[10px] text-[var(--kairo-cyan)] opacity-0 transition group-hover:opacity-100">
                      Watch episode →
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <Link href="/projects" className="kairo-mono mt-10 inline-block border border-white/15 px-6 py-3 hover:border-[var(--kairo-cyan)] hover:text-[var(--kairo-cyan)]">
          All episodes →
        </Link>
      </div>
    </section>
  );
}
