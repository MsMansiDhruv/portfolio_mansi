"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RECOMMENDATIONS, getRecommendationText } from "@/lib/data/recommendations";
import { Reveal } from "@/components/portfolio/motion";

function publicLabel(item) {
  if (item.showIdentity) {
    return item.name;
  }
  return item.relationship || "Colleague";
}

function RecommendationCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const text = getRecommendationText(item);

  const quoteClass =
    "mt-1 whitespace-pre-line text-sm italic leading-[1.7] text-slate-700 dark:text-slate-300";
  const excerptClass =
    "mt-1 line-clamp-2 text-sm italic leading-[1.7] text-slate-600 dark:text-slate-400";

  return (
    <Reveal delay={index * 0.04} viewportAmount={0.1}>
      <article className="min-w-0 py-1">
        <span
          className="block font-serif text-4xl leading-none text-slate-300/80 dark:text-slate-600/60"
          aria-hidden
        >
          &ldquo;
        </span>

        <AnimatePresence initial={false} mode="wait">
          {expanded ? (
            <motion.blockquote
              key="full"
              id={`rec-${item.id}`}
              initial={reduced ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduced ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={quoteClass}
            >
              {text}
            </motion.blockquote>
          ) : (
            <motion.blockquote key="excerpt" id={`rec-${item.id}`} className={excerptClass}>
              {text}
            </motion.blockquote>
          )}
        </AnimatePresence>

        <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
          {publicLabel(item)}
        </p>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          aria-expanded={expanded}
          aria-controls={`rec-${item.id}`}
        >
          {expanded ? "Show less" : "Show more →"}
        </button>
      </article>
    </Reveal>
  );
}

export default function RecommendationsSection({ recommendations = RECOMMENDATIONS }) {
  if (!recommendations.length) return null;

  return (
    <div className="min-w-0">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {recommendations.length} recommendation{recommendations.length === 1 ? "" : "s"}
      </p>
      <div className="mt-8 grid min-w-0 gap-x-12 gap-y-12 lg:grid-cols-2">
        {recommendations.map((item, index) => (
          <RecommendationCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
