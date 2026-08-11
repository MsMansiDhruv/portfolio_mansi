"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EXPERIENCE_SNAPSHOT } from "@/lib/data/career";

export default function HomeExperienceRail() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const reduced = useReducedMotion();

  return (
    <div ref={ref}>
      <ol className="relative mt-6 space-y-0">
        <div
          className="pointer-events-none absolute bottom-4 left-[0.4rem] top-2 w-px bg-gradient-to-b from-teal-700/50 via-slate-300 to-slate-200 dark:from-teal-500/50 dark:via-slate-600 dark:to-slate-700"
          aria-hidden
        />
        {EXPERIENCE_SNAPSHOT.map((item, index) => {
          const isCurrent = index === 0;
          const delay = reduced ? 0 : index * 0.1;

          return (
            <motion.li
              key={item.year}
              className="relative flex min-w-0 gap-4 pb-6 last:pb-0"
              initial={reduced ? false : { opacity: 0, x: -8 }}
              animate={isInView || reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
              transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative z-10 flex w-3 shrink-0 justify-center pt-1.5">
                <span
                  className={`rounded-full ${
                    isCurrent
                      ? "h-3 w-3 bg-teal-700 ring-4 ring-teal-700/15 dark:bg-teal-500 dark:ring-teal-500/20"
                      : "h-2 w-2 bg-slate-300 dark:bg-slate-600"
                  }`}
                  aria-hidden
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <p
                    className={`text-xs font-semibold tabular-nums ${
                      isCurrent ? "text-teal-800 dark:text-teal-400" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {item.year}
                  </p>
                  {isCurrent ? (
                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-teal-800/80 dark:text-teal-400/90">
                      Current
                    </span>
                  ) : null}
                </div>
                <p
                  className={`mt-0.5 text-sm leading-snug ${
                    isCurrent ? "font-semibold text-slate-950 dark:text-white" : "font-medium text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {item.title}
                </p>
                {item.focus ? (
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{item.focus}</p>
                ) : null}
              </div>
            </motion.li>
          );
        })}
      </ol>
      <Link href="/credentials" className="mt-6 inline-block text-sm font-medium text-teal-800 dark:text-teal-400">
        View experience & credentials →
      </Link>
    </div>
  );
}
