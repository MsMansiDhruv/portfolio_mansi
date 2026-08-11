"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { CAREER_TIMELINE } from "@/lib/data/career";

/** Oldest → newest (left → right) */
const JOURNEY = [...CAREER_TIMELINE].reverse();
const CURRENT_ID = CAREER_TIMELINE[0]?.id;
const TOTAL = JOURNEY.length;

function emphasis(index) {
  if (TOTAL <= 1) return 1;
  return index / (TOTAL - 1);
}

function Milestone({ item, index, isInView, reduced }) {
  const isCurrent = item.id === CURRENT_ID;
  const t = emphasis(index);
  const nodeDelay = reduced ? 0 : 0.28 + index * 0.11;
  const titleDelay = reduced ? 0 : nodeDelay + 0.06;

  const dotClass = isCurrent
    ? "bg-teal-700 shadow-[0_0_0_4px_rgba(15,118,110,0.12)] dark:bg-teal-500 dark:shadow-[0_0_0_4px_rgba(20,184,166,0.15)]"
    : t > 0.65
      ? "bg-slate-500 dark:bg-slate-400"
      : t > 0.3
        ? "bg-slate-400 dark:bg-slate-500"
        : "bg-slate-300 dark:bg-slate-600";

  const dotSize = isCurrent ? "h-3.5 w-3.5" : t > 0.65 ? "h-2.5 w-2.5" : "h-2 w-2";

  return (
    <motion.li
      className="relative flex min-w-[7.25rem] max-w-[9.5rem] shrink-0 snap-center flex-col items-center px-1 sm:min-w-[7.75rem] lg:min-w-0 lg:max-w-none lg:flex-1 lg:px-2"
      initial={reduced ? false : { opacity: 0 }}
      animate={isInView || reduced ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3, delay: nodeDelay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.p
        className={`mb-2.5 text-[10px] font-semibold tabular-nums uppercase tracking-[0.14em] ${
          isCurrent ? "text-teal-800 dark:text-teal-400" : "text-slate-400 dark:text-slate-500"
        }`}
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={isInView || reduced ? { opacity: isCurrent ? 1 : 0.55 + t * 0.35, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.28, delay: nodeDelay, ease: [0.22, 1, 0.36, 1] }}
      >
        {item.year}
      </motion.p>

      <div className="relative flex h-4 w-full items-center justify-center">
        {isCurrent ? (
          <motion.span
            className="pointer-events-none absolute h-10 w-10 rounded-full bg-teal-700/8 dark:bg-teal-500/10"
            initial={reduced ? false : { scale: 0.6, opacity: 0 }}
            animate={
              isInView || reduced
                ? reduced
                  ? { scale: 1, opacity: 1 }
                  : { scale: [0.6, 1.08, 1], opacity: [0, 0.85, 1] }
                : { scale: 0.6, opacity: 0 }
            }
            transition={
              reduced
                ? { duration: 0 }
                : { delay: nodeDelay + 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
            aria-hidden
          />
        ) : null}
        <motion.span
          className={`relative z-10 shrink-0 rounded-full ${dotSize} ${dotClass}`}
          initial={reduced ? false : { scale: 0, opacity: 0 }}
          animate={isInView || reduced ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.28, delay: nodeDelay, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        />
      </div>

      <motion.div
        className="mt-3 flex min-h-[3.25rem] flex-col items-center text-center"
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={isInView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.32, delay: titleDelay, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className={`max-w-[8.5rem] text-xs leading-snug sm:max-w-[9rem] ${
            isCurrent
              ? "text-sm font-semibold text-slate-950 dark:text-white"
              : t > 0.65
                ? "font-medium text-slate-800 dark:text-slate-200"
                : "font-medium text-slate-600 dark:text-slate-400"
          }`}
        >
          {item.title}
        </p>
        {item.focus ? (
          <p
            className={`mt-1.5 hidden max-w-[9rem] text-[10px] leading-snug sm:block ${
              isCurrent ? "text-slate-500 dark:text-slate-400" : "text-slate-400/90 dark:text-slate-500"
            }`}
          >
            {item.focus}
          </p>
        ) : null}
        {isCurrent ? (
          <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.22em] text-teal-800 dark:text-teal-400">
            Current
          </span>
        ) : null}
      </motion.div>
    </motion.li>
  );
}

export default function VisualCareerTimeline({ className = "" }) {
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const scrollRef = useRef(null);
  const isInView = useInView(rootRef, { once: true, amount: 0.35 });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    el.scrollLeft = el.scrollWidth - el.clientWidth;
  }, []);

  return (
    <div ref={rootRef} className={`min-w-0 ${className}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
        How I got here
      </p>

      <div
        ref={scrollRef}
        className="relative mt-5 min-w-0 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative min-w-[36rem] px-1 sm:min-w-[40rem] lg:min-w-0 lg:px-0">
          <div
            className="pointer-events-none absolute left-[7%] right-[7%] top-[2.05rem] hidden h-px lg:block"
            aria-hidden
          >
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700" />
            <motion.div
              className="absolute inset-0 origin-left bg-gradient-to-r from-slate-300 via-slate-400 to-teal-700/70 dark:from-slate-600 dark:via-slate-500 dark:to-teal-500/80"
              initial={reduced ? false : { scaleX: 0 }}
              animate={isInView || reduced ? { scaleX: 1 } : { scaleX: 0 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }
              }
            />
          </div>

          <div
            className="pointer-events-none absolute left-4 right-12 top-[2.05rem] h-px lg:hidden"
            aria-hidden
          >
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700" />
            <motion.div
              className="absolute inset-0 origin-left bg-gradient-to-r from-slate-300 via-slate-400 to-teal-700/70 dark:from-slate-600 dark:via-slate-500 dark:to-teal-500/80"
              initial={reduced ? false : { scaleX: 0 }}
              animate={isInView || reduced ? { scaleX: 1 } : { scaleX: 0 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }
              }
            />
          </div>

          <ol className="relative flex snap-x snap-mandatory gap-2 lg:justify-between lg:gap-0">
            {JOURNEY.map((item, index) => (
              <Milestone
                key={item.id}
                item={item}
                index={index}
                isInView={isInView || reduced}
                reduced={reduced}
              />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
