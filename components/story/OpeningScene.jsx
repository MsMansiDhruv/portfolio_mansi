"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import StoryCharacter from "./StoryCharacter";
import DeskEnvironment from "./environments/DeskEnvironment";
import { STORY_OPENING } from "@/lib/data/story";
import { PROFILE } from "@/lib/data/credentials-content";

export default function OpeningScene() {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden px-5 pb-20 pt-28 sm:px-10 lg:px-14">
      <DeskEnvironment />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_30%,rgba(94,184,196,0.06),transparent_60%)]" aria-hidden />

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-end">
        <div className="order-2 lg:order-1">
          <motion.p
            className="story-mono text-[var(--story-grey)]"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            onAnimationComplete={() => setRevealed(true)}
          >
            {revealed ? STORY_OPENING.whisper : ""}
          </motion.p>

          <motion.h1
            className="story-display mt-8 text-[clamp(2rem,7vw,3.5rem)] font-medium tracking-tight text-[var(--story-ivory)]"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {PROFILE.name}
          </motion.h1>

          <motion.div
            className="mt-6 flex flex-wrap gap-x-5 gap-y-2"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
          >
            {STORY_OPENING.roles.map((role) => (
              <span key={role} className="story-mono text-[var(--story-grey)]">
                {role}
              </span>
            ))}
          </motion.div>

          <motion.p
            className="story-editorial mt-10 max-w-lg text-[clamp(1.15rem,2.5vw,1.5rem)] italic leading-relaxed text-[var(--story-cream)]"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.6 }}
          >
            {STORY_OPENING.line}
          </motion.p>

          <motion.div
            className="mt-12"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <Link
              href="#story-journey"
              className="story-mono inline-block border-b border-[var(--story-grey)] pb-1 text-[var(--story-grey)] transition hover:border-[var(--story-cyan)] hover:text-[var(--story-cyan)]"
            >
              Begin the story ↓
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="relative order-1 mx-auto aspect-[3/4] w-full max-w-[280px] lg:order-2 lg:max-w-[320px]"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <StoryCharacter stage="curiosity" variant="silhouette" className="h-full min-h-[360px]" priority />
        </motion.div>
      </div>
    </section>
  );
}
