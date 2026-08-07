"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MainContainer,
  ResponsiveGrid,
  PageSection,
  HeroSection,
} from "@/components/MainContainer";
import { Container, Stack, Card, CardTitle, Button } from "@/components/design-system-v2";

/**
 * EXAMPLE: Modern layout using the redesigned components
 * This shows the new responsive grid and layout patterns
 */

export default function ExamplePage() {
  return (
    <>
      {/* HERO SECTION */}
      <HeroSection
        title="Welcome to the Redesigned Site"
        subtitle="Modern. Fast. Smooth."
        description="This site now features improved navigation, better responsive design, smooth page transitions, and a powerful command palette for quick navigation."
      >
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" href="/projects">
            View Projects
          </Button>
          <Button variant="outline" href="/blog">
            Read Blog
          </Button>
        </div>
      </HeroSection>

      {/* FEATURES SECTION */}
      <MainContainer>
        <PageSection
          title="What's New"
          description="Here are the key improvements in this redesign"
        >
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
            <FeatureCard
              title="Modern Header"
              description="Clean, premium navigation with better visual hierarchy and responsive mobile menu"
              icon="✨"
            />
            <FeatureCard
              title="Smooth Transitions"
              description="Elegant page transitions with Framer Motion animations for a polished feel"
              icon="🎬"
            />
            <FeatureCard
              title="Command Palette"
              description="Press Cmd+K to quickly search and navigate to any page (keyboard shortcuts supported)"
              icon="⌨️"
            />
            <FeatureCard
              title="Responsive Design"
              description="Optimized for all screen sizes with fluid typography and adaptive layouts"
              icon="📱"
            />
            <FeatureCard
              title="Smooth Scrolling"
              description="Better scroll behavior with scroll-to-top button and smooth animations"
              icon="🎯"
            />
            <FeatureCard
              title="Dark Mode"
              description="Full dark mode support across all pages and components with system preference detection"
              icon="🌙"
            />
          </ResponsiveGrid>
        </PageSection>
      </MainContainer>

      {/* HOW TO USE SECTION */}
      <MainContainer className="bg-slate-50 dark:bg-slate-900 my-4 rounded-lg">
        <PageSection title="Quick Tips">
          <Stack direction="vertical" gap="lg">
            <TipCard
              title="Open Command Palette"
              description='Press "Cmd+K" (or "Ctrl+K" on Windows) to open the command palette and quickly search for any page'
            />
            <TipCard
              title="Smooth Scrolling"
              description="Notice the smooth scroll behavior across pages - scroll up to see the scroll-to-top button"
            />
            <TipCard
              title="Page Transitions"
              description="Navigate to different pages to see the smooth fade and slide transitions"
            />
            <TipCard
              title="Responsive Navigation"
              description="Resize your window to see the responsive mobile menu - it adapts seamlessly on smaller screens"
            />
            <TipCard
              title="Dark Mode"
              description="Toggle dark mode in the header - all components adapt their colors automatically"
            />
          </Stack>
        </PageSection>
      </MainContainer>

      {/* USING LAYOUT COMPONENTS */}
      <MainContainer>
        <PageSection
          title="Layout Components"
          description="Here's how to use the new layout components in your pages"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Import
              </h3>
              <CodeExample code={`import {
  MainContainer,
  ResponsiveGrid,
  PageSection,
  HeroSection,
} from "@/components/MainContainer"`} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Use HeroSection
              </h3>
              <CodeExample code={`<HeroSection
  title="Page Title"
  subtitle="Subtitle"
  description="Description"
>
  <Button>Call to Action</Button>
</HeroSection>`} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Use ResponsiveGrid
              </h3>
              <CodeExample code={`<ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</ResponsiveGrid>`} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Use PageSection
              </h3>
              <CodeExample code={`<PageSection
  title="Section Title"
  description="Section description"
>
  {/* Your content here */}
</PageSection>`} />
            </div>
          </div>
        </PageSection>
      </MainContainer>
    </>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="text-3xl mb-3">{icon}</div>
      <CardTitle>{title}</CardTitle>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
        {description}
      </p>
    </Card>
  );
}

function TipCard({ title, description }) {
  return (
    <Card className="p-4 border-l-4 border-blue-600 dark:border-blue-400">
      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
        {title}
      </h4>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
        {description}
      </p>
    </Card>
  );
}

function CodeExample({ code }) {
  return (
    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs font-mono">
      <code>{code}</code>
    </pre>
  );
}
