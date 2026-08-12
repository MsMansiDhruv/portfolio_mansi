"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { STORY_WORKSHOP } from "@/lib/data/story";

export default function WorkshopScene() {
  const reduced = useReducedMotion();

  return (
    <section className="relative px-5 py-24 sm:px-10 lg:px-14">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(94,184,196,0.05),transparent_60%)]" aria-hidden />
      <motion.div
        className="relative mx-auto max-w-[1200px] border border-white/[0.06] p-8 sm:p-12"
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <p className="story-mono text-[var(--story-grey)]">Scene 05</p>
        <h2 className="story-editorial mt-4 text-[clamp(1.5rem,3.5vw,2.25rem)] italic">{STORY_WORKSHOP.title}</h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--story-grey)]">{STORY_WORKSHOP.line}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={STORY_WORKSHOP.href}
            className="story-mono border border-[var(--story-cyan)]/40 px-5 py-2.5 text-[var(--story-cyan)] transition hover:bg-[var(--story-cyan)]/10"
          >
            Enter the workshop →
          </Link>
          <Link href="/contact" className="story-mono border-b border-[var(--story-grey)] pb-0.5 text-[var(--story-grey)] hover:text-[var(--story-ivory)]">
            Get in touch
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
