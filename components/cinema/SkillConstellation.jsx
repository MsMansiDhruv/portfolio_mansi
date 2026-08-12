"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TECHNICAL_PROFILE } from "@/lib/data/credentials-content";

const TONE = ["var(--kairo-cyan)", "var(--kairo-gold)", "var(--kairo-violet)", "var(--kairo-crimson)"];

export default function SkillConstellation() {
  const reduced = useReducedMotion();
  const groups = Object.entries(TECHNICAL_PROFILE);
  const [active, setActive] = useState(groups[0]?.[0] ?? "");

  const skills = TECHNICAL_PROFILE[active] ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="flex flex-wrap gap-2">
        {groups.map(([name], i) => (
          <button
            key={name}
            type="button"
            onClick={() => setActive(name)}
            className={`kairo-mono border px-3 py-2 transition ${
              active === name
                ? "border-[var(--kairo-cyan)] bg-[var(--kairo-cyan)]/10 text-[var(--kairo-cyan)]"
                : "border-white/10 text-[var(--kairo-muted)] hover:border-white/25"
            }`}
            style={active === name ? { borderColor: TONE[i % TONE.length] } : undefined}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="relative min-h-[200px] border border-white/10 p-6">
        <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden>
          <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="var(--kairo-cyan)" strokeWidth="1" />
        </svg>
        <p className="kairo-mono text-[var(--kairo-gold)]">{active}</p>
        <ul className="mt-6 space-y-3">
          {skills.map((skill, i) => (
            <motion.li
              key={skill}
              initial={reduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--kairo-cyan)]" />
              <span className="kairo-display text-lg">{skill}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
