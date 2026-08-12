"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, GitBranch, MessageCircle } from "lucide-react";

const TOOLS = [
  { href: "/tools/ai-lab?mode=architecture", label: "Architecture Expert", icon: GitBranch },
  { href: "/tools/ai-lab?mode=ask", label: "Ask Mansi", icon: MessageCircle },
  { href: "/tools/ai-lab?mode=pipeline", label: "Pipeline Reviewer", icon: Sparkles },
];

export default function LabTeaser() {
  const reduced = useReducedMotion();

  return (
    <section className="relative border-y border-white/10 px-5 py-16 sm:px-10 lg:px-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(124,107,255,0.15),transparent_60%)]" aria-hidden />
      <div className="relative mx-auto max-w-[1400px]">
        <p className="kairo-mono text-[var(--kairo-violet)]">Side quest · AI Lab</p>
        <h2 className="kairo-display mt-3 text-3xl font-bold uppercase">Personal laboratory</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {TOOLS.map((t, i) => (
            <motion.div key={t.href} initial={reduced ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link href={t.href} className="flex items-center gap-3 border border-[var(--kairo-violet)]/30 p-4 transition hover:border-[var(--kairo-violet)] hover:bg-[var(--kairo-violet)]/10">
                <t.icon className="h-5 w-5 text-[var(--kairo-violet)]" />
                <span className="kairo-mono text-sm">{t.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
        <Link href="/tools/ai-lab" className="kairo-mono mt-6 inline-block text-[var(--kairo-violet)]">
          Enter the lab →
        </Link>
      </div>
    </section>
  );
}
