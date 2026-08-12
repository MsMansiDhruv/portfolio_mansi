"use client";

import { motion, useReducedMotion } from "framer-motion";

const STAGES = [
  { label: "Data", desc: "Raw signals, events, and sources enter the system." },
  { label: "Process", desc: "Transform, validate, and govern along the way." },
  { label: "System", desc: "Architecture that teams can operate and extend." },
  { label: "Decision", desc: "Trade-offs made explicit—not buried in tickets." },
  { label: "Impact", desc: "Outcomes teams can measure and trust." },
];

export default function PipelineFlow() {
  const reduced = useReducedMotion();

  return (
    <section id="chapter-builder" className="relative px-5 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-12">
          <p className="kairo-mono text-[var(--kairo-cyan)]">Chapter 01</p>
          <h2 className="kairo-display mt-3 text-[clamp(2rem,5vw,3.25rem)] font-bold uppercase">The Builder</h2>
          <p className="kairo-editorial mt-4 max-w-xl text-xl italic text-[var(--kairo-muted)]">
            Engineering, visualized—not listed.
          </p>
        </header>

        <div className="relative">
          <svg className="absolute left-0 right-0 top-1/2 hidden h-px w-full -translate-y-1/2 lg:block" aria-hidden>
            <motion.line
              x1="5%"
              y1="0"
              x2="95%"
              y2="0"
              stroke="var(--kairo-cyan)"
              strokeWidth="1"
              strokeOpacity="0.25"
              initial={reduced ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
          </svg>

          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {STAGES.map((stage, i) => (
              <motion.li
                key={stage.label}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative border border-white/8 bg-white/[0.02] p-5 backdrop-blur-sm transition hover:border-[var(--kairo-cyan)]/40 hover:bg-[var(--kairo-cyan)]/[0.04]"
              >
                <span className="kairo-mono text-[var(--kairo-gold)]">{String(i + 1).padStart(2, "0")}</span>
                <p className="kairo-display mt-3 text-xl font-bold uppercase">{stage.label}</p>
                {i < STAGES.length - 1 ? (
                  <span className="kairo-mono absolute -bottom-3 left-1/2 hidden -translate-x-1/2 text-[var(--kairo-cyan)] lg:block" aria-hidden>
                    ↓
                  </span>
                ) : null}
                <p className="mt-3 text-sm leading-relaxed text-[var(--kairo-muted)] opacity-0 transition group-hover:opacity-100">
                  {stage.desc}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
