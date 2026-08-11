"use client";

import React from "react";
import {
  HeroSection,
  ProblemSection,
  EngineeringChallengeSection,
  PipelineArchitectureSection,
  SourceDiscoverySection,
  ExtractionSection,
  ModelIntegrationSection,
  AwsInfrastructureSection,
  OperationsSection,
  OutputSection,
  ConclusionSection,
  CaseStudyFooter,
} from "@/components/projects/intelligence/IntelligencePipelineSections";

export default function IntelligencePipelineCaseStudy() {
  return (
    <article className="mx-auto min-w-0 w-full max-w-[72rem] animate-fadeIn px-0">
      <HeroSection />
      <ProblemSection />
      <EngineeringChallengeSection />
      <PipelineArchitectureSection />
      <SourceDiscoverySection />
      <ExtractionSection />
      <ModelIntegrationSection />
      <AwsInfrastructureSection />
      <OperationsSection />
      <OutputSection />
      <ConclusionSection />
      <CaseStudyFooter />
    </article>
  );
}
