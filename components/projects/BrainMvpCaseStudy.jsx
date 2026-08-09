"use client";

import React from "react";
import {
  HeroSection,
  ProductGapSection,
  DecisioningSection,
  ModelToProductionSection,
  ProductionArchitectureSection,
  EngineeringDecisionsSection,
  SystemViewSection,
  ConclusionSection,
  CaseStudyFooter,
} from "@/components/projects/brain/BrainCaseStudySections";

export default function BrainMvpCaseStudy() {
  return (
    <article className="mx-auto min-w-0 w-full max-w-[72rem] animate-fadeIn px-0">
      <HeroSection />
      <ProductGapSection />
      <DecisioningSection />
      <ModelToProductionSection />
      <ProductionArchitectureSection />
      <EngineeringDecisionsSection />
      <SystemViewSection />
      <ConclusionSection />
      <CaseStudyFooter />
    </article>
  );
}
