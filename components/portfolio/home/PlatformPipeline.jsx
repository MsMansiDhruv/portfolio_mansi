"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { PLATFORM_ARCHITECTURE_FLOW } from "@/lib/data/home-content";

function PipelineStage({ stage, tech, index, isInView, reduced }) {
  const delay = reduced ? 0 : 0.2 + index * 0.12;

  return (
    <motion.li
      className="relative flex min-w-[8.5rem] shrink-0 snap-center flex-col sm:min-w-0 sm:flex-1"
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={isInView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rounded-lg border border-slate-200/90 bg-white px-3 py-2.5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/60">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-800/80 dark:text-teal-400/90">
          {stage}
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{tech.join(" · ")}</p>
      </div>
    </motion.li>
  );
}

export default function PlatformPipeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="mt-8 border-t border-slate-200/80 pt-6 dark:border-slate-800/80">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
        Featured stack
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">How data moves from source to decision.</p>

      <div className="relative mt-5 min-w-0">
        <div className="pointer-events-none absolute left-6 right-6 top-[1.65rem] hidden h-px sm:block" aria-hidden>
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700" />
          <motion.div
            className="absolute inset-0 origin-left bg-gradient-to-r from-slate-300 via-teal-600/50 to-teal-700/70 dark:from-slate-600 dark:via-teal-500/40 dark:to-teal-500/70"
            initial={reduced ? false : { scaleX: 0 }}
            animate={isInView || reduced ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <ol className="flex snap-x snap-mandatory items-start gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-between sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          {PLATFORM_ARCHITECTURE_FLOW.map((item, index) => (
            <span key={item.stage} className="contents">
              {index > 0 ? (
                <span
                  className="hidden shrink-0 self-center px-0.5 pt-5 text-sm text-slate-300 dark:text-slate-600 sm:inline"
                  aria-hidden
                >
                  →
                </span>
              ) : null}
              <PipelineStage
                stage={item.stage}
                tech={item.tech}
                index={index}
                isInView={isInView || reduced}
                reduced={reduced}
              />
            </span>
          ))}
        </ol>

        <div className="mt-3 hidden items-center justify-between px-1 text-[10px] uppercase tracking-[0.14em] text-slate-400 sm:flex dark:text-slate-500">
          <span>Sources</span>
          <span className="text-teal-800/70 dark:text-teal-400/80">→ Decision</span>
        </div>
      </div>
    </div>
  );
}
