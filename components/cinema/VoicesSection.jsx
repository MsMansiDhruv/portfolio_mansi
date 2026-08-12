"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RECOMMENDATIONS, getRecommendationText } from "@/lib/data/recommendations";

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
  if (lines.length <= maxLines && normalized.length < 280) return normalized;
  const preview = lines.slice(0, maxLines).join("\n");
  return `${preview.replace(/\s+$/, "")}...`;
}

function needsExpand(text) {
  return excerptText(text) !== text.replace(/\r\n/g, "\n").trim();
}

function QuoteCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const text = getRecommendationText(item);
  const showExpand = needsExpand(text);

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="relative border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm"
    >
      <span className="kairo-editorial absolute -left-1 -top-6 text-7xl text-[var(--kairo-crimson)]/25" aria-hidden>
        &ldquo;
      </span>
      <AnimatePresence initial={false} mode="wait">
        {expanded ? (
          <motion.blockquote
            key="full"
            id={`voice-${item.id}`}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            className="kairo-editorial whitespace-pre-line text-lg italic leading-relaxed text-[var(--kairo-paper)] sm:text-xl"
          >
            {text}
          </motion.blockquote>
        ) : (
          <motion.blockquote
            key="excerpt"
            id={`voice-${item.id}`}
            className="kairo-editorial whitespace-pre-line text-lg italic leading-relaxed text-[var(--kairo-paper)]/90 sm:text-xl"
          >
            {showExpand ? excerptText(text) : text}
          </motion.blockquote>
        )}
      </AnimatePresence>
      <footer className="kairo-mono mt-6 text-[var(--kairo-gold)]">{publicLabel(item)}</footer>
      {showExpand ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="kairo-mono mt-3 text-[var(--kairo-muted)] transition hover:text-[var(--kairo-cyan)]"
          aria-expanded={expanded}
          aria-controls={`voice-${item.id}`}
        >
          {expanded ? "Show less" : "Show more →"}
        </button>
      ) : null}
    </motion.article>
  );
}

export default function VoicesSection({ limit, showHeader = true }) {
  const items = limit ? RECOMMENDATIONS.slice(0, limit) : RECOMMENDATIONS;

  return (
    <section id="chapter-voices" className="relative px-5 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-[1400px]">
        {showHeader ? (
          <header className="mb-12">
            <p className="kairo-mono text-[var(--kairo-gold)]">Chapter 05</p>
            <h2 className="kairo-display mt-3 text-[clamp(2rem,5vw,3.25rem)] font-bold uppercase">People Remember Her</h2>
          </header>
        ) : (
          <header className="mb-12">
            <p className="kairo-mono text-[var(--kairo-gold)]">Voices</p>
            <h2 className="kairo-display mt-3 text-2xl font-bold uppercase">Recommendations</h2>
          </header>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {items.map((item, i) => (
            <QuoteCard key={item.id} item={item} index={i} />
          ))}
        </div>

        <Link href="/credentials#recommendations" className="kairo-mono mt-10 inline-block text-[var(--kairo-cyan)]">
          All voices →
        </Link>
      </div>
    </section>
  );
}
