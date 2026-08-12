"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TRADE_OFFS } from "@/lib/data/identity";

export default function TradeOffPanel() {
  const [active, setActive] = useState("reliability");
  const reduced = useReducedMotion();
  const current = TRADE_OFFS.find((t) => t.id === active) ?? TRADE_OFFS[0];

  return (
    <section id="act-think" className="relative overflow-hidden px-5 py-20 sm:px-10 lg:px-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_50%,rgba(77,124,255,0.12),transparent_60%)]" aria-hidden />
      <div className="relative mx-auto max-w-[1400px]">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--world-muted)]">How I think</p>
        <h2 className="world-display mt-4 max-w-2xl text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight">
          Every architecture is a choice between trade-offs.
        </h2>
        <p className="mt-4 max-w-lg text-sm text-[var(--world-muted)] sm:text-base">
          Pick a priority — the answer changes. That is the job.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          {TRADE_OFFS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={`world-display border px-5 py-3 text-sm font-bold uppercase tracking-wider transition ${
                active === t.id
                  ? "border-[var(--world-blue)] bg-[var(--world-blue)] text-white"
                  : "border-white/15 hover:border-white/35"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <motion.div
          key={current.id}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 max-w-2xl border-l-4 border-[var(--world-blue)] pl-6"
        >
          <p className="world-editorial text-2xl leading-snug sm:text-3xl">{current.insight}</p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--world-muted)]">{current.detail}</p>
        </motion.div>
      </div>
    </section>
  );
}
