"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Reveal } from "@/components/portfolio/motion";

/**
 * Shared chrome for /tools/* utility pages — matches portfolio editorial shell.
 */
export default function ToolLayout({
  title,
  description,
  breadcrumbMap = {},
  children,
  wide = false,
  showBreadcrumbs = true,
}) {
  const labelMap = { tools: "Toolkit", ...breadcrumbMap };

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="max-w-2xl">
          <Link
            href="/tools"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-800/90 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All tools
          </Link>

          {showBreadcrumbs ? (
            <Breadcrumbs labelMap={labelMap} />
          ) : null}

          {title ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-800/80 dark:text-teal-400">
                Toolkit
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                {title}
              </h1>
            </>
          ) : null}

          {description ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{description}</p>
          ) : null}
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div
          className={
            wide
              ? "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6"
              : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
          }
        >
          {children}
        </div>
      </Reveal>
    </div>
  );
}
