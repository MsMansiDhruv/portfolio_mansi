"use client";

import React from "react";
import Link from "next/link";
import {
  HeroSection,
  SignalSection,
  MismatchSection,
  BenchmarkSection,
  ArchitectureSection,
  TradeoffsSection,
  OpenQuestionsSection,
  ConclusionSection,
} from "@/components/projects/olap/OlapCaseStudySections";

export default function OlapWorkloadCaseStudy() {
  return (
    <article className="mx-auto min-w-0 w-full max-w-[72rem] animate-fadeIn px-0">
      <Link href="/projects" className="text-sm font-medium text-teal-800 dark:text-teal-400">
        ← Back to projects
      </Link>

      <HeroSection />
      <SignalSection />
      <MismatchSection />
      <BenchmarkSection />
      <ArchitectureSection />
      <TradeoffsSection />
      <OpenQuestionsSection />
      <ConclusionSection />
    </article>
  );
}
