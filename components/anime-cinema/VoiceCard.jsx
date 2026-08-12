"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getRecommendationText } from "@/lib/data/recommendations";

function excerptText(text, maxLines = 3) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const lines = normalized.split("\n").filter((l) => l.trim());
  if (lines.length <= maxLines && normalized.length < 260) return normalized;
  return `${lines.slice(0, maxLines).join("\n").replace(/\s+$/, "")}...`;
}

function needsExpand(text) {
  return excerptText(text) !== text.replace(/\r\n/g, "\n").trim();
}

function publicLabel(item) {
  if (item.showIdentity) return item.name;
  const rel = (item.relationship || "Colleague").toUpperCase();
  if (rel.includes("CLIENT")) return "CLIENT";
  if (rel.includes("MANAGED")) return "MANAGER";
  if (rel.includes("SENIOR")) return "SENIOR COLLEAGUE";
  if (rel.includes("TEAM")) return "TEAMMATE";
  return "COLLEAGUE";
}

export default function VoiceCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const text = getRecommendationText(item);
  const expandable = needsExpand(text);

  return (
    <blockquote className="border-l border-[var(--story-indigo)] pl-5">
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.p
            key="full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="story-editorial whitespace-pre-line text-base italic leading-relaxed text-[var(--story-cream)] sm:text-lg"
          >
            {text}
          </motion.p>
        ) : (
          <p className="story-editorial whitespace-pre-line text-base italic leading-relaxed text-[var(--story-cream)] sm:text-lg">
            {expandable ? excerptText(text) : text}
          </p>
        )}
      </AnimatePresence>
      <footer className="story-mono mt-4 text-[var(--story-grey)]">{publicLabel(item)}</footer>
      {expandable ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="story-mono mt-2 text-[var(--story-grey)] transition hover:text-[var(--story-ivory)]"
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Show more →"}
        </button>
      ) : null}
    </blockquote>
  );
}
