"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PLATFORM_ARCHITECTURE_FLOW } from "@/lib/data/home-content";

const STAGES = [
  { label: "Sources", tech: "Legacy · Web · Events" },
  ...PLATFORM_ARCHITECTURE_FLOW.map((s) => ({ label: s.stage, tech: s.tech.slice(0, 3).join(" · ") })),
  { label: "Decision", tech: "BI · ML · Ops" },
];

export default function HeroSystemFlow() {
  const reduced = useReducedMotion();

  return (
    <div
      className="relative min-w-0 rounded-2xl border border-slate-200/70 bg-white/60 p-4 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-950/40 sm:p-5"
      aria-hidden
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
        Platform flow
      </p>
      <ol className="relative mt-4 space-y-0">
        {STAGES.map((stage, index) => {
          const isLast = index === STAGES.length - 1;
          const emphasis = index / (STAGES.length - 1);

          return (
            <li key={stage.label} className="relative flex gap-3 pb-3 last:pb-0">
              {!isLast ? (
                <motion.span
                  className="absolute bottom-0 left-[0.45rem] top-6 w-px origin-top bg-gradient-to-b from-slate-200 to-teal-600/40 dark:from-slate-700 dark:to-teal-500/50"
                  initial={reduced ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.35, delay: 0.15 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden
                />
              ) : null}
              <motion.span
                className={`relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                  isLast
                    ? "bg-teal-700 ring-2 ring-teal-700/20 dark:bg-teal-500 dark:ring-teal-500/25"
                    : emphasis > 0.5
                      ? "bg-slate-400 dark:bg-slate-500"
                      : "bg-slate-300 dark:bg-slate-600"
                }`}
                initial={reduced ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.1 + index * 0.08 }}
              />
              <div className="min-w-0 flex-1">
                <motion.p
                  className={`text-xs font-semibold ${
                    isLast ? "text-teal-800 dark:text-teal-400" : "text-slate-700 dark:text-slate-300"
                  }`}
                  initial={reduced ? false : { opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.12 + index * 0.08 }}
                >
                  {stage.label}
                </motion.p>
                <motion.p
                  className="mt-0.5 text-[10px] leading-snug text-slate-400 dark:text-slate-500"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.18 + index * 0.08 }}
                >
                  {stage.tech}
                </motion.p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
