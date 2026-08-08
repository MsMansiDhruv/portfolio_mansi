"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/portfolio/motion";
import { OLAP_CASE_STUDY, OLAP_COST_EVIDENCE_IMAGE } from "@/lib/data/olap-case-study";
import { cn } from "@/lib/cn";
import { BENCHMARK_ENGINES, workloadNumeric } from "@/components/projects/olap/benchmark-utils";
import {
  InvestigationSpine,
  HeroOneEngineDiagram,
  InvestigationSignal,
  WorkloadMismatch,
  BenchmarkComparison,
  WorkloadShapeConclusion,
  BeforeAfterTransformation,
  ArchitectureDiagram,
  EngineDecisionMatrix,
  OpenQuestions,
  FinalTakeaway,
  ChapterStrip,
} from "@/components/projects/olap/OlapCaseStudySections";

const C = OLAP_CASE_STUDY;

export default function OlapWorkloadCaseStudy() {
  return (
    <article className="min-w-0 w-full max-w-6xl animate-fadeIn xl:max-w-7xl">
      <Link href="/projects" className="text-sm font-medium text-teal-800 dark:text-teal-400">
        ← Back to projects
      </Link>

      <Reveal delay={0.02} className="min-w-0">
        <header className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800/90 dark:text-teal-400/90">{C.eyebrow}</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-8">
            <div className="min-w-0 flex flex-col justify-center">
              <h1 className="text-[clamp(1.85rem,4.5vw,2.65rem)] font-semibold leading-[1.08] tracking-tight text-slate-950 dark:text-white">
                {C.titleLine1}
                <br />
                {C.titleLine2}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">{C.subtitle}</p>
            </div>
            <HeroOneEngineDiagram />
          </div>
          <InvestigationSpine className="mt-8" />
        </header>
      </Reveal>

      <Reveal delay={0.03} className="min-w-0">
        <section className="mt-10" aria-label="Investigation signal">
          <ChapterStrip index="01" title="The signal" />
          <InvestigationSignal />
        </section>
      </Reveal>

      <Reveal delay={0.04} className="min-w-0">
        <section className="mt-10" aria-labelledby="olap-mismatch">
          <ChapterStrip index="02" title="The mismatch" />
          <WorkloadMismatch />
        </section>
      </Reveal>

      <Reveal delay={0.05} className="min-w-0">
        <section className="mt-10" aria-labelledby="olap-bench">
          <ChapterStrip index="03" title="The evidence" />
          <BenchmarkComparison />
        </section>
      </Reveal>

      <Reveal delay={0.06} className="min-w-0">
        <section className="mt-10">
          <ChapterStrip index="04" title="The decision" />
          <WorkloadShapeConclusion />
        </section>
      </Reveal>

      <Reveal delay={0.07} className="min-w-0">
        <section className="mt-10" aria-labelledby="olap-arch">
          <ChapterStrip index="05" title="The architecture" />
          <p id="olap-arch" className="max-w-2xl text-base font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white">
            {C.architecture.headline.join(" ")}
          </p>
          <div className="mt-5 space-y-5">
            <BeforeAfterTransformation />
            <ArchitectureDiagram />
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.08} className="min-w-0">
        <section className="mt-10" aria-labelledby="olap-decision">
          <ChapterStrip index="06" title="Trade-offs" />
          <EngineDecisionMatrix />
          <OpenQuestions />
          <p id="olap-decision" className="mt-8 max-w-xl text-base font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white">
            {C.decision.headline.join(" ")}
          </p>
        </section>
      </Reveal>

      <Reveal delay={0.09} className="min-w-0">
        <section className="mt-10 pb-6">
          <ChapterStrip index="07" title="Takeaway" />
          <FinalTakeaway />
        </section>
      </Reveal>
    </article>
  );
}
