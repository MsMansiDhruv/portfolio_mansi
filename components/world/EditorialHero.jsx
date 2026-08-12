"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PORTRAIT, WORLD_HERO } from "@/lib/data/identity";
import { FEATURED_PROJECT_SLUG } from "@/lib/data/project-meta";

const ANNOTATIONS = [
  { label: "Lead Data Engineer", x: "8%", y: "22%", tone: "cyan" },
  { label: "Architecture", x: "72%", y: "18%", tone: "blue" },
  { label: "Builder", x: "68%", y: "78%", tone: "coral" },
];

export default function EditorialHero() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const [photoFailed, setPhotoFailed] = useState(false);

  function onMove(e) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative min-h-[92vh] overflow-hidden px-5 pb-16 pt-10 sm:px-10 lg:px-14 lg:pb-20 lg:pt-14"
    >
      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-6">
        <div className="min-w-0 pb-4 lg:pb-16">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[var(--world-muted)]">{WORLD_HERO.role}</p>
          <h1 className="world-display mt-4 text-[clamp(3rem,11vw,6.5rem)] font-extrabold leading-[0.92] tracking-tight">
            {WORLD_HERO.name.split(" ")[0]}
            <br />
            <span className="text-[var(--world-cyan)]">{WORLD_HERO.name.split(" ")[1]}</span>
          </h1>

          <div className="mt-8 space-y-1">
            <p className="world-display text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-tight">
              {WORLD_HERO.statement[0]}
            </p>
            <p className="world-editorial text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight text-[var(--world-coral)]">
              {WORLD_HERO.statement[1]}
            </p>
          </div>

          <p className="mt-8 max-w-md text-sm leading-relaxed text-[var(--world-muted)] sm:text-base">{WORLD_HERO.support}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/projects/${FEATURED_PROJECT_SLUG}`}
              className="inline-flex items-center gap-2 rounded-none border border-[var(--world-cyan)] bg-[var(--world-cyan)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--world-ink)] transition hover:bg-transparent hover:text-[var(--world-cyan)]"
            >
              Enter the work
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tools/ai-lab?mode=ask"
              className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-sm font-medium uppercase tracking-wider text-[var(--world-paper)] transition hover:border-[var(--world-violet)] hover:text-[var(--world-violet)]"
            >
              Ask Mansi
            </Link>
          </div>
        </div>

        <div className="relative min-h-[420px] lg:min-h-[580px]">
          <motion.div
            style={reduced ? undefined : { x: sx, y: sy }}
            className="relative mx-auto h-full w-full max-w-md lg:max-w-none lg:translate-x-8"
          >
            <div className="absolute -right-4 top-8 h-[85%] w-[70%] bg-gradient-to-br from-[var(--world-coral)]/20 to-transparent blur-3xl" aria-hidden />
            <div className="relative aspect-[3/4] w-full max-w-[22rem] overflow-hidden lg:absolute lg:right-0 lg:top-0 lg:max-w-none lg:w-[88%]">
              {!photoFailed ? (
                <Image
                  src={PORTRAIT.src}
                  alt={PORTRAIT.alt}
                  fill
                  priority
                  className="object-cover object-[center_12%] grayscale-[15%] contrast-[1.05]"
                  sizes="(max-width: 1024px) 360px, 520px"
                  onError={() => setPhotoFailed(true)}
                />
              ) : (
                <div className="flex h-full items-end bg-gradient-to-t from-[#1a1a22] to-[#2a2a35] p-8">
                  <p className="world-editorial text-3xl text-white/40">Portrait</p>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--world-ink)] via-transparent to-transparent opacity-80" />
              <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30 bg-[var(--world-cyan)]" />
            </div>

            {!reduced
              ? ANNOTATIONS.map((a) => (
                  <motion.span
                    key={a.label}
                    className="world-display absolute hidden text-[10px] font-semibold uppercase tracking-[0.2em] lg:inline"
                    style={{
                      left: a.x,
                      top: a.y,
                      color:
                        a.tone === "cyan"
                          ? "var(--world-cyan)"
                          : a.tone === "coral"
                            ? "var(--world-coral)"
                            : "var(--world-blue)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 5, repeat: Infinity, delay: Math.random() * 2 }}
                  >
                    {a.label}
                  </motion.span>
                ))
              : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
