"use client";

import { motion, useReducedMotion } from "framer-motion";
import SystemsEnvironment from "./environments/SystemsEnvironment";
import { STORY_SYSTEMS } from "@/lib/data/story";

export default function SystemsScene() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-10 lg:px-14">
      <SystemsEnvironment />
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="story-mono text-[var(--story-grey)]">Scene 02</p>
          <h2 className="story-editorial mt-4 text-[clamp(1.5rem,3.5vw,2.25rem)] italic text-[var(--story-ivory)]">
            {STORY_SYSTEMS.title}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[var(--story-grey)]">{STORY_SYSTEMS.line}</p>

          <svg className="mt-14 w-full max-w-2xl opacity-40" viewBox="0 0 600 80" aria-hidden>
            <line x1="0" y1="40" x2="600" y2="40" stroke="var(--story-cyan)" strokeWidth="1" />
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <circle cx={80 + i * 170} cy="40" r="3" fill="var(--story-ivory)" opacity="0.5" />
                <text
                  x={80 + i * 170}
                  y="68"
                  textAnchor="middle"
                  fill="var(--story-grey)"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                >
                  {["Data", "Process", "System", "Impact"][i]}
                </text>
              </g>
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
