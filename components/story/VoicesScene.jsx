"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RECOMMENDATIONS, getRecommendationText } from "@/lib/data/recommendations";
import { STORY_VOICES_INTRO } from "@/lib/data/story";

function publicLabel(item) {
  if (item.showIdentity) return item.name;
  const rel = (item.relationship || "Colleague").toUpperCase();
  if (rel.includes("CLIENT")) return "CLIENT";
  if (rel.includes("MANAGED")) return "MANAGED DIRECTLY";
  if (rel.includes("SENIOR")) return "SENIOR COLLEAGUE";
  if (rel.includes("TEAM")) return "TEAMMATE";
  return "COLLEAGUE";
}

function excerptText(text, maxLines = 3) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const lines = normalized.split("\n").filter((l) => l.trim());
  if (lines.length <= maxLines && normalized.length < 260) return normalized;
  return `${lines.slice(0, maxLines).join("\n").replace(/\s+$/, "")}...`;
}

function needsExpand(text) {
  return excerptText(text) !== text.replace(/\r\n/g, "\n").trim();
}

function Voice({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const text = getRecommendationText(item);
  const expandable = needsExpand(text);

  return (
    <motion.blockquote
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.8 }}
      className="border-l border-[var(--story-indigo)] pl-6"
    >
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.p
            key="full"
            id={`voice-${item.id}`}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="story-editorial whitespace-pre-line text-lg italic leading-relaxed text-[var(--story-cream)] sm:text-xl"
          >
            {text}
          </motion.p>
        ) : (
          <motion.p
            key="excerpt"
            id={`voice-${item.id}`}
            className="story-editorial whitespace-pre-line text-lg italic leading-relaxed text-[var(--story-cream)] sm:text-xl"
          >
            {expandable ? excerptText(text) : text}
          </motion.p>
        )}
      </AnimatePresence>
      <footer className="story-mono mt-5 text-[var(--story-grey)]">{publicLabel(item)}</footer>
      {expandable ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="story-mono mt-3 text-[var(--story-grey)] transition hover:text-[var(--story-ivory)]"
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Show more →"}
        </button>
      ) : null}
    </motion.blockquote>
  );
}

export default function VoicesScene({ limit }) {
  const items = limit ? RECOMMENDATIONS.slice(0, limit) : RECOMMENDATIONS;

  return (
    <section className="border-t border-white/[0.06] px-5 py-24 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-12 max-w-xl">
          <p className="story-mono text-[var(--story-grey)]">Scene 04</p>
          <h2 className="story-editorial mt-4 text-[clamp(1.5rem,3.5vw,2.25rem)] italic">{STORY_VOICES_INTRO.title}</h2>
          <p className="mt-4 text-sm text-[var(--story-grey)]">{STORY_VOICES_INTRO.line}</p>
        </header>

        <div className="grid gap-12 lg:grid-cols-2">
          {items.map((item, i) => (
            <Voice key={item.id} item={item} index={i} />
          ))}
        </div>

        {limit ? (
          <Link href="/credentials#recommendations" className="story-mono mt-12 inline-block text-[var(--story-grey)] hover:text-[var(--story-ivory)]">
            All voices →
          </Link>
        ) : null}
      </div>
    </section>
  );
}
