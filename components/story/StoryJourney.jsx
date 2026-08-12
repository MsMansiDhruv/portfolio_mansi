"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import StoryCharacter from "./StoryCharacter";
import JourneyEnvironment from "./environments/JourneyEnvironment";
import { STORY_JOURNEY, STORY_NOW } from "@/lib/data/story";

function JourneyBeat({ beat, index, isLast, reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.45, once: false });
  const progress = (index + (inView ? 1 : 0)) / (STORY_JOURNEY.length + 1);

  return (
    <article
      ref={ref}
      className="relative grid min-h-[72vh] items-center gap-10 border-t border-white/[0.06] py-16 lg:grid-cols-[0.75fr_1.25fr]"
    >
      <JourneyEnvironment progress={inView ? progress : progress * 0.5} className="opacity-[0.08]" />

      <div className="relative mx-auto aspect-[3/4] w-full max-w-[240px] lg:mx-0">
        <StoryCharacter stage={beat.phase} variant={index === 0 ? "silhouette" : "portrait"} className="h-full min-h-[300px]" />
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 8 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="story-mono text-[var(--story-grey)]">{beat.focus}</p>
        <p className="story-display mt-4 text-4xl font-medium tabular-nums text-[var(--story-ivory)]">{beat.year}</p>
        <p className="story-display mt-2 text-xl text-[var(--story-cream)]">{beat.title}</p>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--story-grey)]">{beat.desc}</p>
      </motion.div>
    </article>
  );
}

export default function StoryJourney() {
  const reduced = useReducedMotion();
  const nowRef = useRef(null);
  const nowInView = useInView(nowRef, { amount: 0.4 });

  return (
    <section id="story-journey" className="relative px-5 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-[1200px]">
        <header className="py-16 text-center lg:text-left">
          <p className="story-mono text-[var(--story-grey)]">Scene 01</p>
          <h2 className="story-editorial mt-4 text-[clamp(1.75rem,4vw,2.75rem)] italic text-[var(--story-ivory)]">
            It started with curiosity.
          </h2>
        </header>

        {STORY_JOURNEY.map((beat, i) => (
          <JourneyBeat key={beat.id} beat={beat} index={i} isLast={false} reduced={reduced} />
        ))}

        <article
          ref={nowRef}
          className="relative grid min-h-[80vh] items-center gap-10 border-t border-white/[0.06] py-20 lg:grid-cols-[0.75fr_1.25fr]"
        >
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[260px] lg:mx-0">
            <StoryCharacter stage="present" className="h-full min-h-[340px]" />
            <div
              className="pointer-events-none absolute -inset-8 opacity-40 transition-opacity duration-[1.2s]"
              style={{
                background: nowInView
                  ? "radial-gradient(circle at 50% 40%, rgba(201,169,98,0.12), transparent 65%)"
                  : "transparent",
              }}
              aria-hidden
            />
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={nowInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="story-mono text-[var(--story-amber)]">{STORY_NOW.arc}</p>
            <p className="story-display mt-4 text-5xl font-medium text-[var(--story-ivory)]">{STORY_NOW.year}</p>
            <h3 className="story-display mt-2 text-2xl text-[var(--story-cream)]">{STORY_NOW.title}</h3>
            <p className="story-editorial mt-6 max-w-md text-xl italic leading-relaxed text-[var(--story-grey)]">
              {STORY_NOW.desc}
            </p>
          </motion.div>
        </article>
      </div>
    </section>
  );
}
