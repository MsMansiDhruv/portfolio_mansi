"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BEYOND_STACK } from "@/lib/data/home-content";

export default function OpeningSpread() {
  const reduced = useReducedMotion();

  return (
    <section className="relative px-5 py-16 sm:px-10 lg:px-14">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)] lg:items-start"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--world-muted)] [writing-mode:vertical-rl] rotate-180 hidden lg:block">
          Act 01 · Me
        </p>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--world-muted)] lg:hidden">Act 01 · Me</p>
          <p className="world-editorial mt-4 text-[clamp(1.5rem,3.5vw,2.75rem)] leading-snug text-[var(--world-paper)]">
            {BEYOND_STACK}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
