"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EXPLORE_PATHWAYS } from "@/lib/data/identity";
import { Reveal } from "@/components/portfolio/motion";

export default function ExplorePathways() {
  return (
    <nav aria-label="Explore the portfolio" className="relative min-w-0">
      <ul className="grid gap-0 sm:grid-cols-2">
        {EXPLORE_PATHWAYS.map((path, index) => (
          <Reveal key={path.href} delay={index * 0.05} viewportAmount={0.12}>
            <li className="group border-t border-slate-200/90 dark:border-slate-800">
              <Link
                href={path.href}
                className="flex min-h-[5.5rem] flex-col justify-center py-5 pr-4 transition hover:bg-slate-50/80 dark:hover:bg-slate-900/30 sm:min-h-[6rem] sm:py-6"
              >
                <span className="flex items-baseline gap-3">
                  <span className="text-[10px] tabular-nums text-slate-300 dark:text-slate-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg font-semibold tracking-tight text-slate-950 transition group-hover:text-teal-800 dark:text-white dark:group-hover:text-teal-400 sm:text-xl">
                    {path.prompt}
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-700 dark:text-slate-600 dark:group-hover:text-teal-400" />
                </span>
                <span className="mt-1.5 pl-7 text-sm text-slate-500 opacity-0 transition group-hover:opacity-100 dark:text-slate-400">
                  {path.hint}
                </span>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>
    </nav>
  );
}
