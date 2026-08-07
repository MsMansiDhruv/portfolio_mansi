"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "@/lib/data/projects";
import { FEATURED_PROJECT_SLUG, getProjectMeta } from "@/lib/data/project-meta";
import { HOME_CASE_STUDIES } from "@/lib/data/home-content";
import { Reveal, HoverLift } from "@/components/portfolio/motion";
import { ArchitectureFlow } from "@/components/portfolio/storytelling";

function formatTech(items, max = 4) {
  const list = items || [];
  if (list.length <= max) return list.join(" · ");
  return list.slice(0, max).join(" · ");
}

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const featured = getProjectMeta(FEATURED_PROJECT_SLUG);
  const caseMap = Object.fromEntries(HOME_CASE_STUDIES.map((c) => [c.slug, c]));

  const filtered = useMemo(() => {
    let list = [...PROJECTS].sort((a, b) => b.date.localeCompare(a.date));
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const others = filtered.filter((p) => p.slug !== FEATURED_PROJECT_SLUG);

  return (
    <div className="min-w-0 space-y-12 sm:space-y-16">
      <Reveal>
        <header className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-800/80 dark:text-teal-400">Case studies</p>
          <h1 className="mt-4 text-[clamp(1.75rem,5vw,2.25rem)] font-semibold tracking-tight text-slate-950 dark:text-white">Projects</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Platform work, experiments, and proofs—index is short; detail pages carry architecture and decisions.
          </p>
        </header>
      </Reveal>

      {featured && !query ? (
        <Reveal delay={0.05}>
          <HoverLift>
            <Link
              href={`/projects/${featured.slug}`}
              className="group grid min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:grid-cols-[1.2fr_0.8fr]"
            >
              <div className="min-w-0 border-b border-slate-200 p-6 dark:border-slate-800 sm:p-8 lg:border-b-0 lg:border-r">
                <p className="text-xs text-slate-500">{featured.category} · Featured</p>
                <h2 className="mt-2 break-words text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">{featured.title}</h2>
                <p className="mt-2 break-words text-xs text-slate-500">{formatTech(featured.tech)}</p>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{caseMap[featured.slug]?.outcome || featured.summary}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-teal-800 dark:text-teal-400">
                  Explore
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
              <div className="bg-slate-50 p-6 dark:bg-slate-900/50">
                <ArchitectureFlow layers={featured.architectureLayers} compact />
              </div>
            </Link>
          </HoverLift>
        </Reveal>
      ) : null}

      <div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter projects…"
          className="mb-8 w-full max-w-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base dark:border-slate-800 dark:bg-slate-950 sm:max-w-sm"
          aria-label="Filter projects"
        />
        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {others.map((p, i) => {
            const cs = caseMap[p.slug];
            return (
              <Reveal key={p.slug} delay={0.03 * i}>
                <li>
                  <Link href={`/projects/${p.slug}`} className="group flex min-w-0 flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">{p.category}</p>
                      <h3 className="break-words text-lg font-semibold text-slate-950 dark:text-white">{p.title}</h3>
                      <p className="mt-1 break-words text-xs text-slate-500">{formatTech(p.tech)}</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{cs?.outcome || p.desc}</p>
                    </div>
                    <span className="text-sm font-medium text-teal-800 dark:text-teal-400">Explore →</span>
                  </Link>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
