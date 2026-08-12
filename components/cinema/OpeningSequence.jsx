"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { PORTRAIT } from "@/lib/data/identity";
import { FEATURED_PROJECT_SLUG } from "@/lib/data/project-meta";

const ROLES = ["Data Engineer", "Architect", "Builder", "Problem Solver"];

const HINTS = [
  { id: "game", symbol: "▣", x: "12%", y: "62%", label: "strategy" },
  { id: "travel", symbol: "◎", x: "88%", y: "35%", label: "routes" },
  { id: "board", symbol: "⬡", x: "82%", y: "72%", label: "choices" },
  { id: "notes", symbol: "✦", x: "15%", y: "28%", label: "stories" },
];

export default function OpeningSequence() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const [photoFailed, setPhotoFailed] = useState(false);

  function onMove(e) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  const stagger = reduced ? 0 : 0.12;

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-16 pt-24 sm:px-10 lg:px-14 lg:pb-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(61,30,80,0.25),transparent_60%)]" aria-hidden />
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden>
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--kairo-cyan)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 80 400 Q 200 350 320 380 T 560 360 T 800 390"
          fill="none"
          stroke="url(#flowGrad)"
          strokeWidth="1"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, delay: 0.8, ease: "easeOut" }}
        />
        <motion.circle cx="320" cy="380" r="4" fill="var(--kairo-cyan)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.circle cx="560" cy="360" r="3" fill="var(--kairo-gold)" animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} />
      </svg>

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="order-2 lg:order-1">
          <motion.p
            className="kairo-mono text-[var(--kairo-crimson)]"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Protagonist · Lead Data Engineer
          </motion.p>

          <motion.h1
            className="kairo-display mt-4 text-[clamp(2.75rem,11vw,6.5rem)] font-extrabold leading-[0.88] tracking-tight"
            initial={reduced ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            MANSI
            <br />
            <span className="text-[var(--kairo-cyan)]">DHRUV</span>
          </motion.h1>

          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
            {ROLES.map((role, i) => (
              <motion.span
                key={role}
                className="kairo-mono text-[var(--kairo-muted)]"
                initial={reduced ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * stagger }}
              >
                {role}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="kairo-editorial mt-10 max-w-lg text-[clamp(1.25rem,2.8vw,1.75rem)] italic leading-snug text-[var(--kairo-paper)]"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            I like turning complicated systems into things people can actually use.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45 }}
          >
            <Link
              href={`/projects/${FEATURED_PROJECT_SLUG}`}
              className="kairo-mono inline-flex border border-[var(--kairo-cyan)] bg-[var(--kairo-cyan)] px-6 py-3 text-[var(--kairo-ink)] transition hover:bg-transparent hover:text-[var(--kairo-cyan)]"
            >
              Enter the work →
            </Link>
            <Link
              href="/tools/ai-lab?mode=ask"
              className="kairo-mono inline-flex border border-white/15 px-6 py-3 transition hover:border-[var(--kairo-violet)] hover:text-[var(--kairo-violet)]"
            >
              Ask Mansi
            </Link>
          </motion.div>
        </div>

        <motion.div
          style={reduced ? undefined : { x: sx, y: sy }}
          className="relative order-1 mx-auto aspect-[3/4] w-full max-w-sm lg:order-2 lg:max-w-none lg:justify-self-end"
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--kairo-crimson)]/20 via-transparent to-[var(--kairo-cyan)]/15 blur-2xl" aria-hidden />
          <div className="relative h-full min-h-[360px] overflow-hidden border border-white/10 lg:min-h-[520px]">
            {!photoFailed ? (
              <Image
                src={PORTRAIT.src}
                alt={PORTRAIT.alt}
                fill
                priority
                className="object-cover object-[center_10%] contrast-[1.08] saturate-[0.85]"
                sizes="(max-width: 1024px) 400px, 520px"
                onError={() => setPhotoFailed(true)}
              />
            ) : (
              <div className="flex h-full items-end bg-gradient-to-t from-[var(--kairo-charcoal)] to-[var(--kairo-navy)] p-8">
                <p className="kairo-editorial text-3xl italic text-white/30">Portrait</p>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--kairo-ink)] via-transparent to-[var(--kairo-ink)]/30" />
            <div className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-40 bg-[var(--kairo-indigo)]" />
          </div>

          {!reduced
            ? HINTS.map((h) => (
                <motion.span
                  key={h.id}
                  className="kairo-mono absolute hidden text-[10px] text-[var(--kairo-gold)]/70 lg:block"
                  style={{ left: h.x, top: h.y }}
                  animate={{ opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 5, repeat: Infinity, delay: Math.random() * 2 }}
                >
                  {h.symbol} {h.label}
                </motion.span>
              ))
            : null}
        </motion.div>
      </div>
    </section>
  );
}
