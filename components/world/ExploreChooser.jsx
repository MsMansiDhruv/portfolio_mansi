"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EXPLORE_LAYERS } from "@/lib/data/identity";

export default function ExploreChooser() {
  const [active, setActive] = useState(EXPLORE_LAYERS[0].id);
  const reduced = useReducedMotion();
  const current = EXPLORE_LAYERS.find((l) => l.id === active) ?? EXPLORE_LAYERS[0];

  function go(href) {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  return (
    <section className="relative border-y border-white/10 px-5 py-14 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--world-muted)]">Choose your entry point</p>
        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          {EXPLORE_LAYERS.map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => {
                setActive(layer.id);
                go(layer.href);
              }}
              className={`world-display border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition sm:text-sm ${
                active === layer.id
                  ? "border-[var(--world-cyan)] bg-[var(--world-cyan)] text-[var(--world-ink)]"
                  : "border-white/15 text-[var(--world-paper)] hover:border-white/40"
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
        <motion.p
          key={current.id}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="world-editorial mt-6 max-w-xl text-xl text-[var(--world-paper)] sm:text-2xl"
        >
          {current.whisper}
        </motion.p>
      </div>
    </section>
  );
}
