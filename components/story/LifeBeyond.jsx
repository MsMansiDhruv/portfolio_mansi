"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BEYOND_STACK } from "@/lib/data/home-content";

/** Quiet visual beats — environments only, no hobby list */
const MOMENTS = [{ id: "desk" }, { id: "window" }, { id: "table" }, { id: "network" }, { id: "workshop" }];

function MomentVisual({ id }) {
  if (id === "window")
    return (
      <svg viewBox="0 0 120 80" className="h-16 w-24 opacity-30" aria-hidden>
        <rect x="10" y="10" width="100" height="60" fill="none" stroke="var(--story-ivory)" strokeWidth="0.75" />
        <line x1="60" y1="10" x2="60" y2="70" stroke="var(--story-ivory)" strokeWidth="0.5" />
        <line x1="10" y1="40" x2="110" y2="40" stroke="var(--story-ivory)" strokeWidth="0.5" />
      </svg>
    );
  if (id === "table")
    return (
      <svg viewBox="0 0 120 80" className="h-16 w-24 opacity-30" aria-hidden>
        <ellipse cx="60" cy="50" rx="40" ry="12" fill="none" stroke="var(--story-ivory)" strokeWidth="0.75" />
        <circle cx="45" cy="42" r="4" fill="var(--story-amber)" opacity="0.4" />
        <circle cx="75" cy="44" r="4" fill="var(--story-amber)" opacity="0.3" />
      </svg>
    );
  if (id === "network")
    return (
      <svg viewBox="0 0 120 80" className="h-16 w-24 opacity-30" aria-hidden>
        <circle cx="30" cy="40" r="3" fill="var(--story-cyan)" />
        <circle cx="60" cy="25" r="3" fill="var(--story-cyan)" />
        <circle cx="90" cy="45" r="3" fill="var(--story-cyan)" />
        <line x1="30" y1="40" x2="60" y2="25" stroke="var(--story-cyan)" strokeWidth="0.5" />
        <line x1="60" y1="25" x2="90" y2="45" stroke="var(--story-cyan)" strokeWidth="0.5" />
      </svg>
    );
  if (id === "workshop")
    return (
      <svg viewBox="0 0 120 80" className="h-16 w-24 opacity-30" aria-hidden>
        <rect x="25" y="30" width="70" height="40" fill="none" stroke="var(--story-cyan)" strokeWidth="0.75" />
        <line x1="35" y1="45" x2="85" y2="45" stroke="var(--story-cyan)" strokeWidth="0.5" opacity="0.5" />
      </svg>
    );
  return (
    <svg viewBox="0 0 120 80" className="h-16 w-24 opacity-30" aria-hidden>
      <rect x="30" y="35" width="60" height="35" fill="none" stroke="var(--story-ivory)" strokeWidth="0.75" />
      <rect x="40" y="25" width="40" height="25" fill="var(--story-cyan)" opacity="0.08" />
    </svg>
  );
}

export default function LifeBeyond() {
  const reduced = useReducedMotion();

  return (
    <section className="border-t border-white/[0.06] px-5 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-[1200px]">
        <header className="max-w-xl">
          <p className="story-mono text-[var(--story-grey)]">Beyond the job title</p>
          <p className="story-editorial mt-4 text-xl italic leading-relaxed text-[var(--story-cream)]">{BEYOND_STACK}</p>
        </header>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {MOMENTS.map((m, i) => (
            <motion.div
              key={m.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.8 }}
              className="flex flex-col items-start gap-4 border-t border-white/[0.06] pt-6"
            >
              <MomentVisual id={m.id} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
