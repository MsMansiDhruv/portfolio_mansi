"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, MessageCircle, GitBranch, ArrowRight } from "lucide-react";

const INSTRUMENTS = [
  { href: "/tools/ai-lab?mode=architecture", label: "Architecture Expert", icon: GitBranch },
  { href: "/tools/ai-lab?mode=ask", label: "Ask Mansi", icon: MessageCircle },
  { href: "/tools/ai-lab?mode=pipeline", label: "Pipeline Reviewer", icon: Sparkles },
];

export default function AiLabWorld() {
  const reduced = useReducedMotion();

  return (
    <section id="act-lab" className="relative overflow-hidden px-5 py-24 sm:px-10 lg:px-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(157,123,255,0.18),transparent_55%)]" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[120%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--world-violet)]/40 to-transparent" aria-hidden />

      <div className="relative mx-auto max-w-[1400px]">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--world-violet)]">AI Lab</p>
        <h2 className="world-display mt-4 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.05]">
          A laboratory for
          <br />
          <span className="world-editorial text-[var(--world-violet)]">curious engineering.</span>
        </h2>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-[var(--world-muted)] sm:text-base">
          Interactive tools I built to explain architecture, review pipelines, and answer questions the way I would in a
          working session — not a chatbot brochure.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {INSTRUMENTS.map((tool, i) => (
            <motion.div
              key={tool.href}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={tool.href}
                className="group flex h-full flex-col border border-[var(--world-violet)]/25 bg-[var(--world-violet)]/5 p-6 transition hover:border-[var(--world-violet)] hover:bg-[var(--world-violet)]/10"
              >
                <tool.icon className="h-6 w-6 text-[var(--world-violet)]" />
                <p className="world-display mt-4 text-lg font-bold">{tool.label}</p>
                <span className="mt-auto pt-6 text-xs uppercase tracking-wider text-[var(--world-violet)] opacity-0 transition group-hover:opacity-100">
                  Open instrument →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <Link
          href="/tools/ai-lab"
          className="world-display mt-10 inline-flex items-center gap-2 border border-[var(--world-violet)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--world-violet)] transition hover:bg-[var(--world-violet)] hover:text-[var(--world-ink)]"
        >
          Enter the lab
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
