"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  BRAIN_CASE_STUDY,
  BRAIN_CASE_STUDY_SLUG,
  BRAIN_ARCH_PRODUCTION_IMAGE,
} from "@/lib/data/brain-case-study";
import { ArchitectureDiagramViewer } from "@/components/projects/ArchitectureDiagramViewer";
import { ProjectCaseStudyNav } from "@/components/projects/ProjectCaseStudyNav";
import { cn } from "@/lib/cn";

const C = BRAIN_CASE_STUDY;
const EASE = [0.22, 1, 0.36, 1];

function Section({ children, className, id, tone = "default" }) {
  const pad =
    tone === "hero"
      ? "pt-6 pb-10 md:pt-8 md:pb-12"
      : tone === "spacious"
        ? "py-14 md:py-20"
        : tone === "tight"
          ? "py-8 md:py-10"
          : "py-10 md:py-14";
  return (
    <section id={id} className={cn("min-w-0", pad, className)}>
      {children}
    </section>
  );
}

function NumEyebrow({ n, label }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-teal-800/90 dark:text-teal-400/90">
      {n} · {label}
    </p>
  );
}

function fadeUp(reduced, delay = 0) {
  if (reduced) return {};
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.55, ease: EASE, delay },
  };
}

function DecisionSpine({ nodes, active }) {
  return (
    <div className="relative mx-auto flex max-w-[220px] flex-col items-center">
      {nodes.map((label, i) => (
        <React.Fragment key={label}>
          <motion.div
            className="w-full text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 + i * 0.11, ease: EASE }}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-800 dark:text-slate-100">{label}</span>
          </motion.div>
          {i < nodes.length - 1 ? (
            <motion.div
              className="my-2 h-8 w-px origin-top bg-teal-700/35 dark:bg-teal-500/40"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={active ? { scaleY: 1, opacity: 1 } : { scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.11, ease: EASE }}
            />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

export function HeroSection() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const play = inView && !reduced;

  return (
    <Section tone="hero">
      <div ref={ref} className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-teal-800 dark:text-teal-400">{C.eyebrow}</p>
          <h1 className="mt-5 text-[clamp(2rem,4.8vw,3rem)] font-semibold leading-[1.05] tracking-tight text-slate-950 dark:text-white">
            {C.titleLine1}
            <br />
            {C.titleLine2}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400">{C.subtitle}</p>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{C.engagementLabel}</p>
        </div>
        <div className="relative lg:pl-6">
          <div className="pointer-events-none absolute -left-4 top-1/2 hidden h-px w-8 -translate-y-1/2 bg-gradient-to-r from-transparent to-teal-700/30 lg:block dark:to-teal-500/30" />
          <DecisionSpine nodes={C.heroFlow} active={play} />
        </div>
      </div>
    </Section>
  );
}

export function ProductGapSection() {
  const reduced = useReducedMotion();
  const { productGap: g } = C;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" tone="default">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div {...fadeUp(reduced)}>
          <NumEyebrow n="01" label="The product gap" />
          <h2 className="mt-4 text-[clamp(1.75rem,3.6vw,2.75rem)] font-semibold leading-[1.08] tracking-tight text-slate-950 dark:text-white">
            {g.statement.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </motion.div>

        <motion.div className="lg:pt-8" {...fadeUp(reduced, 0.08)}>
          <div className="relative border-l border-slate-200 pl-6 dark:border-slate-700">
            {g.ladder.map((step, i) => (
              <div key={step} className="relative pb-6 last:pb-0">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-800 dark:text-slate-200">{step}</p>
                {i === 2 ? (
                  <p className="mt-2 text-xs leading-relaxed text-teal-900/90 dark:text-teal-300/90">
                    Gap — available stack vs. adoption
                  </p>
                ) : null}
                {i < g.ladder.length - 1 ? (
                  <span className="absolute -left-6 top-6 h-6 w-px bg-slate-300 dark:bg-slate-600" aria-hidden />
                ) : null}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.ul
        className="mt-10 grid max-w-3xl gap-x-8 gap-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:grid-cols-2"
        {...fadeUp(reduced, 0.12)}
      >
        {g.causes.map((c) => (
          <li key={c} className="flex gap-2">
            <span className="text-teal-700 dark:text-teal-400">·</span>
            <span>{c}</span>
          </li>
        ))}
      </motion.ul>
    </Section>
  );
}

function AnimatedFlow({ steps, className, reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className={cn("flex min-w-max items-center gap-2 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:gap-3", className)}>
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <motion.span
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-900 dark:text-white"
            initial={{ opacity: 0.35 }}
            animate={play ? { opacity: 1 } : { opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.12, ease: EASE }}
          >
            {step}
          </motion.span>
          {i < steps.length - 1 ? (
            <motion.span
              className="text-slate-400"
              initial={{ opacity: 0 }}
              animate={play ? { opacity: 1 } : { opacity: 1 }}
              transition={{ duration: 0.35, delay: i * 0.12 + 0.06, ease: EASE }}
              aria-hidden
            >
              →
            </motion.span>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

export function DecisioningSection() {
  const reduced = useReducedMotion();
  const { decisioning: d } = C;

  return (
    <Section className="border-t border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20" tone="spacious">
      <motion.div className="mx-auto max-w-3xl text-center" {...fadeUp(reduced)}>
        <NumEyebrow n="02" label="The decisioning problem" />
        <h2 className="mt-5 text-[clamp(1.85rem,4vw,3rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
          {d.statement.map((line, i) => (
            <span key={line} className={cn("block", i === 1 && "text-teal-900 dark:text-teal-300")}>
              {line}
            </span>
          ))}
        </h2>
      </motion.div>
      <motion.div className="mt-12 flex justify-center md:mt-14" {...fadeUp(reduced, 0.1)}>
        <AnimatedFlow steps={d.flow} reduced={reduced} className="max-w-full px-2" />
      </motion.div>
      <motion.p className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed text-slate-600 dark:text-slate-400" {...fadeUp(reduced, 0.14)}>
        {C.mlApproach}
      </motion.p>
    </Section>
  );
}

export function ModelToProductionSection() {
  const reduced = useReducedMotion();
  const m = C.modelToProduction;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800">
      <motion.div className="max-w-2xl" {...fadeUp(reduced)}>
        <NumEyebrow n="03" label="From model to production" />
        <h2 className="mt-4 text-[clamp(1.75rem,3.5vw,2.65rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
          {m.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-400">{m.body}</p>
      </motion.div>

      <motion.div className="mt-12 overflow-x-auto" {...fadeUp(reduced, 0.1)}>
        <div className="flex min-w-max border-t border-slate-200 dark:border-slate-700">
          {m.pipeline.map((step, i) => (
            <div
              key={step.stage}
              className={cn(
                "min-w-[7.5rem] flex-1 border-r border-slate-200 px-4 py-5 last:border-r-0 dark:border-slate-700 md:min-w-[9rem] md:px-5",
                i === 0 && "pl-0"
              )}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{step.stage}</p>
              {step.tech.length ? (
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-teal-900/80 dark:text-teal-400/90">
                  {step.tech.join(" · ")}
                </p>
              ) : (
                <p className="mt-2 text-[11px] text-slate-400">—</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

export function ProductionArchitectureSection() {
  const reduced = useReducedMotion();
  const a = C.productionArch;
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" tone="default">
      <motion.div {...fadeUp(reduced)}>
        <NumEyebrow n="04" label="Production architecture" />
        <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
          {a.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
      </motion.div>

      <motion.div className="mt-10 space-y-6 md:mt-12" {...fadeUp(reduced, 0.08)}>
        {a.layers.map((layer, li) => (
          <div
            key={layer.label}
            className={cn(
              "border-l-2 py-1 pl-5",
              li === 0 && "border-slate-400 dark:border-slate-500",
              li === 1 && "border-teal-700/50 dark:border-teal-500/50",
              li === 2 && "border-slate-300 dark:border-slate-600"
            )}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{layer.label}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-slate-800 dark:text-slate-200">
              {layer.items.map((item, i) => (
                <React.Fragment key={item}>
                  <span>{item}</span>
                  {i < layer.items.length - 1 ? <span className="text-slate-400">↓</span> : null}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      <div className="mt-10">
        <button
          type="button"
          onClick={() => setDetailOpen((o) => !o)}
          className="flex min-h-[44px] w-full items-center justify-between gap-2 border-t border-slate-200 pt-6 text-left text-sm font-semibold uppercase tracking-wide text-teal-900 dark:border-slate-800 dark:text-teal-300"
          aria-expanded={detailOpen}
        >
          View detailed architecture
          <ChevronDown className={cn("h-4 w-4 shrink-0 transition", detailOpen && "rotate-180")} />
        </button>
        {detailOpen ? (
          <div className="mt-4">
            <ArchitectureDiagramViewer
              src={BRAIN_ARCH_PRODUCTION_IMAGE}
              alt={a.detailImageAlt}
              modalTitle="Production architecture"
              previewClassName="min-h-[200px] max-h-[420px]"
            />
          </div>
        ) : null}
      </div>
    </Section>
  );
}

export function EngineeringDecisionsSection() {
  const reduced = useReducedMotion();

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" tone="tight">
      <motion.div className="max-w-2xl" {...fadeUp(reduced)}>
        <NumEyebrow n="05" label="Engineering decisions" />
        <h2 className="mt-4 text-[clamp(1.65rem,3.2vw,2.35rem)] font-semibold tracking-tight text-slate-950 dark:text-white">
          Separating prediction from decisioning.
        </h2>
      </motion.div>
      <motion.div className="mt-10 grid gap-8 sm:grid-cols-2 lg:gap-10" {...fadeUp(reduced, 0.08)}>
        {C.decisions.map((d) => (
          <div key={d.title} className="border-t-2 border-slate-200 pt-4 dark:border-slate-700">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-900 dark:text-teal-400">{d.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{d.body}</p>
          </div>
        ))}
      </motion.div>
    </Section>
  );
}

export function SystemViewSection() {
  const reduced = useReducedMotion();
  const s = C.systemView;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" tone="spacious">
      <motion.div className="mx-auto max-w-4xl text-center" {...fadeUp(reduced)}>
        <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-slate-500">06 · The system view</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {s.flow.map((word, i) => (
            <React.Fragment key={word}>
              <span className="text-[clamp(1.25rem,3vw,2rem)] font-semibold uppercase tracking-tight text-slate-950 dark:text-white">
                {word}
              </span>
              {i < s.flow.length - 1 ? <span className="text-teal-700/60 dark:text-teal-400/60">→</span> : null}
            </React.Fragment>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">{s.line}</p>
      </motion.div>
    </Section>
  );
}

export function ConclusionSection() {
  const reduced = useReducedMotion();
  const c = C.conclusion;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" tone="spacious">
      <motion.div className="mx-auto max-w-3xl text-center" {...fadeUp(reduced)}>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">{c.eyebrow}</p>
        <h2 className="mt-6 text-[clamp(1.65rem,3.8vw,2.75rem)] font-semibold leading-[1.12] tracking-tight text-slate-950 dark:text-white">
          {c.line1.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-6 text-xl font-medium text-teal-900 dark:text-teal-300">{c.line2}</p>
        <p className="mx-auto mt-8 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-400">{c.supporting}</p>
      </motion.div>
    </Section>
  );
}

export function CaseStudyFooter() {
  return <ProjectCaseStudyNav slug={BRAIN_CASE_STUDY_SLUG} takeaway={C.takeaway} />;
}
