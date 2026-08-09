"use client";

import React from "react";
import {
  HeroSection,
  SignalSection,
  MismatchSection,
  BenchmarkSection,
  ArchitectureSection,
  TradeoffsSection,
  OpenQuestionsSection,
  ClosingSection,
  CaseStudyFooter,
} from "@/components/projects/olap/OlapCaseStudySections";

export default function OlapWorkloadCaseStudy() {
  return (
    <article className="mx-auto min-w-0 w-full max-w-[72rem] animate-fadeIn px-0">
      <HeroSection />
      <SignalSection />
      <MismatchSection />
      <BenchmarkSection />
      <ArchitectureSection />
      <TradeoffsSection />
      <OpenQuestionsSection />
      <ClosingSection />
      <CaseStudyFooter />
    </article>
  );
}
