"use client";

import Link from "next/link";
import {
  Cloud,
  GitBranch,
  MessageSquareText,
  Mic,
  ServerCog,
  TerminalSquare,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "@/components/portfolio/motion";
import { AI_AGENTS } from "@/lib/data/home-content";

const LAB_MODES = AI_AGENTS.filter((a) => a.id !== "ask");

const ICONS = {
  ask: MessageSquareText,
  architecture: ServerCog,
  pipeline: GitBranch,
  sql: TerminalSquare,
  cloud: Cloud,
  interview: Mic,
};

export default function AiLabPromo() {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-[#faf9f6] to-teal-50/50 px-5 py-7 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-teal-950/25 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-800/80 dark:text-teal-400/90">
            Engineering workspace
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            AI Engineering Lab
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Specialized engineering modes — each with a distinct persona. Ask Mansi is the human entry point above.
          </p>
        </div>
        <Link
          href="/tools/ai-lab"
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-800 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
        >
          Open workspace
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LAB_MODES.map((agent, index) => {
          const Icon = ICONS[agent.id] || ServerCog;
          return (
            <Reveal key={agent.id} delay={index * 0.04} viewportAmount={0.1}>
              <Link
                href={`/tools/ai-lab?mode=${agent.id}`}
                className="group flex min-w-0 gap-3 rounded-xl border border-slate-200/90 bg-white/90 px-3.5 py-3 transition hover:border-teal-700/20 hover:shadow-sm dark:border-slate-700/80 dark:bg-slate-900/60 dark:hover:border-teal-500/25"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-teal-800/90 transition group-hover:bg-teal-50 dark:bg-slate-800 dark:text-teal-400 dark:group-hover:bg-teal-950/40">
                  <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-slate-900 dark:text-white">{agent.label}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                    {agent.purpose}
                  </span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
