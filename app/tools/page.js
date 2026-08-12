"use client";

import Link from "next/link";
import { ArrowRight, FileText, QrCode, Braces } from "lucide-react";
import StoryChapterShell from "@/components/world/StoryChapterShell";
import { STORY_PAGE_META } from "@/lib/data/anime-story";

const TOOLS = [
  {
    id: "bill",
    title: "Bill / invoice generator",
    description: "Create, preview, and export invoices (PDF and share flows).",
    href: "/tools/bill",
    icon: FileText,
  },
  {
    id: "qr",
    title: "QR code generator",
    description: "URLs, UPI payments, and contacts — generated locally in your browser.",
    href: "/tools/qr",
    icon: QrCode,
  },
  {
    id: "json",
    title: "JSON analyser",
    description: "Format, validate, tree-view, and infer schema from JSON.",
    href: "/tools/json",
    icon: Braces,
  },
];

export default function ToolsPage() {
  const meta = STORY_PAGE_META.play;

  return (
    <StoryChapterShell chapter={meta.chapter} title={meta.title} subtitle={meta.subtitle}>
      <div className="mx-auto max-w-[1200px] px-5 pb-20 sm:px-10 lg:px-14">
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <li key={t.id}>
                <Link
                  href={t.href}
                  className="group flex h-full flex-col border border-white/[0.08] p-6 transition hover:border-white/[0.15]"
                >
                  <t.icon className="h-5 w-5 text-[var(--story-grey)]" strokeWidth={1.25} />
                  <h2 className="story-display mt-5 text-lg font-medium group-hover:text-[var(--story-cyan)]">{t.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-[var(--story-grey)]">{t.description}</p>
                  <span className="story-mono mt-6 inline-flex items-center gap-1 text-[var(--story-grey)] group-hover:text-[var(--story-cyan)]">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/tools/ai-lab" className="story-mono mt-12 inline-block text-[var(--story-grey)] hover:text-[var(--story-ivory)]">
            AI Lab →
          </Link>
        </div>
    </StoryChapterShell>
  );
}
