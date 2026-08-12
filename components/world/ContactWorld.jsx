"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CONTACT_VOICE } from "@/lib/data/identity";

export default function ContactWorld() {
  const reduced = useReducedMotion();

  return (
    <section id="act-contact" className="relative border-t border-white/10 px-5 py-24 sm:px-10 lg:px-14">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-[1400px] text-center lg:text-left"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--world-muted)]">Let&apos;s build</p>
        <h2 className="world-display mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[0.95]">
          Have something
          <br />
          <span className="world-editorial text-[var(--world-coral)]">worth building?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-[var(--world-muted)] lg:mx-0 sm:text-base">
          {CONTACT_VOICE.description} {CONTACT_VOICE.followUp}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
          <Link
            href="/contact"
            className="world-display inline-flex border border-[var(--world-coral)] bg-[var(--world-coral)] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[var(--world-ink)] transition hover:bg-transparent hover:text-[var(--world-coral)]"
          >
            Start a conversation
          </Link>
          <Link
            href="/tools/ai-lab?mode=ask"
            className="world-display inline-flex border border-white/20 px-8 py-4 text-sm font-semibold uppercase tracking-wider transition hover:border-[var(--world-cyan)] hover:text-[var(--world-cyan)]"
          >
            Ask Mansi first
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
