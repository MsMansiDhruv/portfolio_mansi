"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, HoverLift } from "@/components/portfolio/motion";

const TOOLS = [
  {
    id: "ai-lab",
    title: "AI Engineering Lab",
    description: "Portfolio-aware assistants for architecture, SQL, interviews, and platform questions.",
    href: "/tools/ai-lab",
  },
  {
    id: "bill",
    title: "Bill / invoice generator",
    description: "Create, preview, and export invoices (PDF and share flows).",
    href: "/tools/bill",
  },
  {
    id: "qr",
    title: "QR code generator",
    description: "URLs, UPI payments, and contacts — generated locally in your browser.",
    href: "/tools/qr",
  },
  {
    id: "json",
    title: "JSON analyser",
    description: "Format, validate, tree-view, and infer schema from JSON.",
    href: "/tools/json",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-w-0 space-y-10 sm:space-y-12">
      <Reveal>
        <header className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-800/80 dark:text-teal-400">
            Utilities
          </p>
          <h1 className="mt-4 text-[clamp(1.75rem,5vw,2.25rem)] font-semibold tracking-tight text-slate-950 dark:text-white">
            Toolkit
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Lightweight browser tools for day-to-day work. Same shell as the rest of the site — no separate theme.
          </p>
        </header>
      </Reveal>

      <ul className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        {TOOLS.map((t, i) => (
          <Reveal key={t.id} delay={0.04 * i}>
            <HoverLift>
              <Link
                href={t.href}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition dark:border-slate-800 dark:bg-slate-950"
              >
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{t.title}</h2>
                <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">{t.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-teal-800 dark:text-teal-400">
                  Open
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </HoverLift>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
