"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function PageHeader({ eyebrow, title, description, className }) {
  return (
    <header className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      ) : null}
      <h1 className="mt-3 text-[clamp(1.75rem,5vw,2.25rem)] font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">{title}</h1>
      {description ? <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">{description}</p> : null}
    </header>
  );
}

export function SectionHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xl">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-2xl">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function TextLink({ href, children, external, className }) {
  const classes = cn(
    "inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300",
    className
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

export function ProjectPreviewCard({ project, className }) {
  const techLine = (project.tech || []).slice(0, 5).join(" · ");
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-5 transition duration-200",
        "hover:border-slate-300 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-slate-700",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{project.category}</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{project.title}</h3>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
      </div>
      {techLine ? (
        <p className="mt-3 text-xs text-slate-500 transition group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-300">{techLine}</p>
      ) : null}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{project.desc}</p>
      <span className="mt-4 text-sm font-medium text-teal-700 dark:text-teal-400">Explore →</span>
    </Link>
  );
}

export function ExperienceRail({ items }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={`${item.year}-${item.title}`} className="relative border-l border-slate-200 pl-4 dark:border-slate-800">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-teal-700 dark:text-teal-400">{item.year}</p>
          <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">{item.title}</p>
        </li>
      ))}
    </ol>
  );
}

export function PillGrid({ items }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((label) => (
        <li
          key={label}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          {label}
        </li>
      ))}
    </ul>
  );
}

export function ToolkitGrid({ toolkit }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(toolkit).map(([category, tools]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{category}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {tools.map((tool) => (
              <li key={tool} className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
                {tool}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
