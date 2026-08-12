"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MANSI_SIGNATURE } from "@/lib/data/identity";
import MansiMark from "./MansiMark";

const MESSY = [
  { x: "8%", y: "18%" },
  { x: "72%", y: "12%" },
  { x: "22%", y: "55%" },
  { x: "65%", y: "48%" },
  { x: "45%", y: "78%" },
  { x: "85%", y: "70%" },
];

const ORDERED = ["Ingest", "Transform", "Serve", "Operate"];

export default function ComplexityClarityMoment() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className="relative min-h-[11rem] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-950 px-4 py-5 text-white dark:border-slate-800 sm:min-h-[12rem] sm:px-6 sm:py-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-serif text-xl leading-snug text-white/95 sm:text-2xl">{MANSI_SIGNATURE.motif}</p>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-400">{MANSI_SIGNATURE.line}</p>
        </div>
        <MansiMark className="text-teal-400/80" interactive />
      </div>

      <div className="relative mt-6 h-24 sm:h-28">
        {MESSY.map((node, i) => (
          <motion.span
            key={i}
            className="absolute h-2 w-2 rounded-full bg-slate-500"
            style={{ left: node.x, top: node.y }}
            initial={false}
            animate={
              isInView || reduced
                ? reduced
                  ? { opacity: 0, scale: 0 }
                  : { opacity: [1, 1, 0], scale: [1, 1, 0], x: [0, 0, (i - 2.5) * 8] }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 1.1, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          />
        ))}

        <motion.div
          className="absolute inset-x-0 bottom-2 flex items-center justify-between gap-1"
          initial={reduced ? false : { opacity: 0 }}
          animate={isInView || reduced ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: reduced ? 0 : 0.75 }}
        >
          {ORDERED.map((label, i) => (
            <span key={label} className="contents">
              {i > 0 ? (
                <motion.span
                  className="hidden text-teal-500/60 sm:inline"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={isInView || reduced ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: reduced ? 0 : 0.85 + i * 0.08 }}
                  aria-hidden
                >
                  →
                </motion.span>
              ) : null}
              <motion.span
                className="flex-1 rounded border border-teal-500/30 bg-teal-500/10 px-1.5 py-1 text-center text-[9px] font-semibold uppercase tracking-wider text-teal-200/90 sm:text-[10px]"
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={isInView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ delay: reduced ? 0 : 0.8 + i * 0.1, duration: 0.35 }}
              >
                {label}
              </motion.span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
