"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { HOME_CASE_STUDIES } from "@/lib/data/home-content";
import { STORY_EPISODES_INTRO } from "@/lib/data/story";

const COVERS = {
  "project-amc-datalake-solution": "/projects/amc/architecture.png",
  "automated-intelligence-pipeline": "/projects/intelligence/architecture.jpg",
};

export default function EpisodePreview({ limit = 3 }) {
  const reduced = useReducedMotion();
  const episodes = HOME_CASE_STUDIES.filter((s) => s.kind !== "experiment").slice(0, limit);

  return (
    <section className="border-t border-white/[0.06] px-5 py-24 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-14 max-w-xl">
          <p className="story-mono text-[var(--story-grey)]">Scene 03</p>
          <h2 className="story-editorial mt-4 text-[clamp(1.5rem,3.5vw,2.25rem)] italic">{STORY_EPISODES_INTRO.title}</h2>
          <p className="mt-4 text-sm text-[var(--story-grey)]">{STORY_EPISODES_INTRO.line}</p>
        </header>

        <div className="space-y-16">
          {episodes.map((ep, i) => {
            const cover = COVERS[ep.slug];
            return (
              <motion.article
                key={ep.slug}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-8 lg:grid-cols-2 lg:items-center"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--story-charcoal)]">
                  {cover ? (
                    <Image src={cover} alt="" fill className="object-cover opacity-80" sizes="(max-width: 1024px) 100vw, 50vw" />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--story-midnight)]/80 to-transparent" />
                </div>
                <div>
                  <p className="story-mono text-[var(--story-grey)]">Episode {String(i + 1).padStart(2, "0")}</p>
                  <h3 className="story-display mt-3 text-2xl font-medium">{ep.title}</h3>
                  <p className="story-mono mt-2 text-[var(--story-cyan)] opacity-70">The problem</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--story-grey)]">{ep.problem}</p>
                  <Link
                    href={`/projects/${ep.slug}`}
                    className="story-mono mt-6 inline-block border-b border-[var(--story-grey)] pb-0.5 text-[var(--story-grey)] transition hover:border-[var(--story-cyan)] hover:text-[var(--story-cyan)]"
                  >
                    Read the chapter →
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        <Link
          href="/projects"
          className="story-mono mt-14 inline-block text-[var(--story-grey)] transition hover:text-[var(--story-ivory)]"
        >
          All episodes →
        </Link>
      </div>
    </section>
  );
}
