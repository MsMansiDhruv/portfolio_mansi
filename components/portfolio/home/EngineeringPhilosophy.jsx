"use client";

import { Cog, DollarSign, Eye, Minimize2, Shield } from "lucide-react";
import { Reveal } from "@/components/portfolio/motion";
import { ENGINEERING_PRINCIPLES } from "@/lib/data/home-content";

const ICONS = {
  Reliability: Shield,
  Simplicity: Minimize2,
  "Cost awareness": DollarSign,
  Automation: Cog,
  Observability: Eye,
};

export default function EngineeringPhilosophy() {
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {ENGINEERING_PRINCIPLES.map((item, index) => {
        const Icon = ICONS[item.title] || Shield;
        return (
          <Reveal key={item.title} delay={index * 0.04} viewportAmount={0.15}>
            <li className="group min-w-0">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200/90 bg-slate-50/80 text-teal-800/80 transition group-hover:border-teal-700/20 group-hover:bg-teal-50/50 dark:border-slate-800 dark:bg-slate-900/50 dark:text-teal-400/90 dark:group-hover:border-teal-500/25 dark:group-hover:bg-teal-950/30">
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.phrase}</p>
                </div>
              </div>
            </li>
          </Reveal>
        );
      })}
    </ul>
  );
}
