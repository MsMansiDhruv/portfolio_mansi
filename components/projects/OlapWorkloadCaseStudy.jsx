"use client";

import React from "react";
import Link from "next/link";
import { Reveal } from "@/components/portfolio/motion";
import {
  ProblemHero,
  SignalSection,
  WorkloadMismatch,
  BenchmarkViz,
  ArchitectureDiagram,
  BeforeAfter,
  EngineMatrix,
  FinalInsight,
} from "@/components/projects/olap/OlapCaseStudySections";

export default function OlapWorkloadCaseStudy() {
  return (
    <article className="min-w-0 w-full max-w-6xl animate-fadeIn xl:max-w-7xl">
      <Link href="/projects" className="text-sm font-medium text-teal-800 dark:text-teal-400">
        ← Back to projects
      </Link>

      <Reveal delay={0.02} className="min-w-0">
        <ProblemHero />
      </Reveal>

      <Reveal delay={0.03} className="min-w-0">
        <SignalSection />
      </Reveal>

      <Reveal delay={0.04} className="min-w-0">
        <WorkloadMismatch />
      </Reveal>

      <Reveal delay={0.05} className="min-w-0">
        <BenchmarkViz />
      </Reveal>

      <Reveal delay={0.06} className="min-w-0">
        <ArchitectureDiagram />
      </Reveal>

      <Reveal delay={0.07} className="min-w-0">
        <BeforeAfter />
      </Reveal>

      <Reveal delay={0.08} className="min-w-0">
        <EngineMatrix />
      </Reveal>

      <Reveal delay={0.09} className="min-w-0">
        <FinalInsight />
      </Reveal>
    </article>
  );
}
