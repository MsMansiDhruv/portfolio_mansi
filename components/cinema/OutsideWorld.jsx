"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const WORLDS = [
  {
    id: "stories",
    title: "Stories",
    glyph: "◈",
    hint: "Cinematic framing—the same instinct I bring to system design.",
    tone: "crimson",
  },
  {
    id: "games",
    title: "Games",
    glyph: "▣",
    hint: "Strategy, progression, and learning systems under pressure.",
    tone: "cyan",
  },
  {
    id: "travel",
    title: "Travel",
    glyph: "◎",
    hint: "New places, new constraints—the same curiosity as exploring architectures.",
    tone: "gold",
  },
  {
    id: "board",
    title: "Strategy",
    glyph: "⬡",
    hint: "Trade-offs, choices, and reading the board before you move.",
    tone: "violet",
  },
  {
    id: "community",
    title: "Community",
    glyph: "◉",
    hint: "People, collaboration, and the networks that make work matter.",
    tone: "cyan",
  },
  {
    id: "workshop",
    title: "Workshop",
    glyph: "✦",
    hint: "Personal builds—where curiosity runs ahead of the roadmap.",
    tone: "gold",
    href: "/projects",
  },
];

const TONE_COLOR = {
  crimson: "var(--kairo-crimson)",
  cyan: "var(--kairo-cyan)",
  gold: "var(--kairo-gold)",
  violet: "var(--kairo-violet)",
};

export default function OutsideWorld() {
  const reduced = useReducedMotion();

  return (
    <section id="chapter-outside" className="relative px-5 py-24 sm:px-10 lg:px-14">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 20% 50%, rgba(184,50,60,0.1), transparent 50%), radial-gradient(ellipse 45% 35% at 80% 60%, rgba(212,160,67,0.08), transparent 45%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1400px]">
        <header className="mb-14">
          <p className="kairo-mono text-[var(--kairo-crimson)]">Chapter 04</p>
          <h2 className="kairo-display mt-3 text-[clamp(2rem,5vw,3.25rem)] font-bold uppercase">Outside the System</h2>
          <p className="kairo-editorial mt-4 max-w-lg text-xl italic text-[var(--kairo-muted)]">
            A life outside the job description—woven in, never listed.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORLDS.map((w, i) => {
            const color = TONE_COLOR[w.tone];
            const inner = (
              <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative h-full min-h-[160px] border border-white/8 p-6 transition hover:border-white/20"
                style={{ background: `linear-gradient(135deg, ${color}08, transparent 60%)` }}
              >
                <span className="text-3xl opacity-60" style={{ color }} aria-hidden>
                  {w.glyph}
                </span>
                <p className="kairo-display mt-4 text-lg font-bold uppercase">{w.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--kairo-muted)] opacity-80 transition group-hover:opacity-100">
                  {w.hint}
                </p>
              </motion.div>
            );

            return w.href ? (
              <Link key={w.id} href={w.href} className="block h-full">
                {inner}
              </Link>
            ) : (
              <div key={w.id}>{inner}</div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/tools/ai-lab"
            className="kairo-mono border border-[var(--kairo-violet)] px-6 py-3 text-[var(--kairo-violet)] hover:bg-[var(--kairo-violet)] hover:text-[var(--kairo-ink)]"
          >
            Enter the lab →
          </Link>
          <Link href="/contact" className="kairo-mono border border-white/15 px-6 py-3 hover:border-[var(--kairo-gold)] hover:text-[var(--kairo-gold)]">
            Start a conversation
          </Link>
        </div>
      </div>
    </section>
  );
}
