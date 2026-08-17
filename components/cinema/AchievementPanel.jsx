"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AWARDS, CERTIFICATIONS, groupCertificationsByCategory } from "@/lib/data/career";

export default function AchievementPanel() {
  const reduced = useReducedMotion();
  const primary = CERTIFICATIONS.filter((c) => c.tier === "primary");
  const groups = [...groupCertificationsByCategory().entries()]
    .map(([title, certs]) => ({
      title,
      certs: certs.filter((c) => c.tier !== "primary"),
    }))
    .filter((g) => g.certs.length > 0);

  return (
    <div className="space-y-12">
      <div id="achievements">
        <p className="kairo-mono mb-6 text-[var(--kairo-gold)]">Unlocked achievements</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {AWARDS.map((a, i) => (
            <motion.div
              key={a.id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-[var(--kairo-gold)]/30 bg-[var(--kairo-gold)]/5 p-5"
            >
              <p className="kairo-mono text-[10px] text-[var(--kairo-gold)]">{a.year}</p>
              <p className="kairo-display mt-2 font-bold">{a.title}</p>
              <p className="mt-1 text-xs text-[var(--kairo-muted)]">{a.org}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--kairo-paper)]/80">{a.summary}</p>
              {a.sourceUrl ? (
                <a
                  href={a.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kairo-mono mt-4 inline-block text-[10px] text-[var(--kairo-muted)] hover:text-[var(--kairo-cyan)]"
                >
                  View on LinkedIn →
                </a>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>

      <div id="certifications">
        <p className="kairo-mono mb-6 text-[var(--kairo-cyan)]">Artifacts & certifications</p>
        <div className="mb-6 flex flex-wrap gap-3">
          {primary.map((c) => (
            <div
              key={c.id}
              className="border-2 border-[var(--kairo-cyan)] bg-[var(--kairo-cyan)]/10 px-4 py-3"
            >
              {c.link ? (
                <a
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kairo-display text-sm font-bold hover:underline"
                >
                  {c.title}
                </a>
              ) : (
                <p className="kairo-display text-sm font-bold">{c.title}</p>
              )}
              <p className="kairo-mono mt-1 text-[10px] text-[var(--kairo-muted)]">
                {c.org} · {c.issued}
                {c.verified ? " · Verified" : ""}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="kairo-mono text-[10px] text-[var(--kairo-muted)]">{group.title}</p>
              <ul className="mt-3 space-y-2">
                {group.certs.map((c) => (
                  <li key={c.id} className="border border-white/10 px-3 py-2">
                    {c.link ? (
                      <a
                        href={c.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                      >
                        {c.title}
                      </a>
                    ) : (
                      <p className="text-sm">{c.title}</p>
                    )}
                    <p className="kairo-mono mt-0.5 text-[10px] text-[var(--kairo-muted)]">
                      {c.org} · {c.issued}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
