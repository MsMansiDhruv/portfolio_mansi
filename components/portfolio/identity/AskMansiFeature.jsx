"use client";

import Link from "next/link";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { ASK_MANSI } from "@/lib/data/identity";
import { Reveal } from "@/components/portfolio/motion";

export default function AskMansiFeature() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-slate-950 px-5 py-8 text-white sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" aria-hidden />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center">
        <Reveal>
          <MessageSquareText className="h-6 w-6 text-amber-300/90" strokeWidth={1.75} aria-hidden />
          <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-tight">
            {ASK_MANSI.title}
          </h2>
          <p className="mt-2 text-base text-slate-300">{ASK_MANSI.lead}</p>
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
          <ul className="space-y-1 border-l border-slate-800 pl-4">
            {ASK_MANSI.examples.map((example) => (
              <li key={example}>
                <Link
                  href={`/tools/ai-lab?mode=ask&q=${encodeURIComponent(example)}`}
                  className="block py-2 text-sm text-slate-400 transition hover:text-teal-300"
                >
                  {example}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
