"use client";

import CredentialsBlock from "@/components/portfolio/credentials/CredentialsBlock";
import TechnicalProfileGrid from "@/components/portfolio/credentials/TechnicalProfileGrid";

export default function SkillsCredentialsSection() {
  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          Technical profile
        </p>
        <TechnicalProfileGrid />
      </div>
      <div className="min-w-0 border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 dark:border-slate-800">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          Certifications
        </p>
        <CredentialsBlock />
      </div>
    </div>
  );
}
