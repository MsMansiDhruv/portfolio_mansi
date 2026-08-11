"use client";

import Link from "next/link";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { ASK_MANSI } from "@/lib/data/identity";
import { Reveal } from "@/components/portfolio/motion";
import MansiMark from "./MansiMark";

export default function AskMansiFeature() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-slate-950 px-5 py-8 text-white dark:bg-slate-950 sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" aria-hidden />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
              <MessageSquareText className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <MansiMark className="text-teal-400/70" size="sm" />
          </div>
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-teal-400/90">{ASK_MANSI.subtitle}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">{ASK_MANSI.title}</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">{ASK_MANSI.description}</p>
          <Link
            href="/tools/ai-lab?mode=ask"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-500"
          >
            {ASK_MANSI.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delay={0.06}>
          <ul className="space-y-2 border-l border-slate-800 pl-4">
            {ASK_MANSI.examples.map((example) => (
              <li key={example}>
                <Link
                  href={`/tools/ai-lab?mode=ask&q=${encodeURIComponent(example)}`}
                  className="block py-1.5 text-sm text-slate-400 transition hover:text-teal-300"
                >
                  &ldquo;{example}&rdquo;
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Architecture, SQL, pipeline review, interviews, and cost questions live in their own modes—I&apos;ll point
            you there.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
