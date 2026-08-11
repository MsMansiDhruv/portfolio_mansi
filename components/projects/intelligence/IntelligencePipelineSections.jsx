"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  INTELLIGENCE_CASE_STUDY,
  INTELLIGENCE_PIPELINE_SLUG,
  INTELLIGENCE_ARCH_IMAGE,
} from "@/lib/data/intelligence-pipeline-case-study";
import { ArchitectureDiagramViewer } from "@/components/projects/ArchitectureDiagramViewer";
import { ProjectCaseStudyNav } from "@/components/projects/ProjectCaseStudyNav";
import { cn } from "@/lib/cn";

const C = INTELLIGENCE_CASE_STUDY;
const EASE = [0.22, 1, 0.36, 1];

function Section({ children, className, id, pad = "md" }) {
  const padding =
    pad === "hero"
      ? "pt-6 pb-9 md:pt-8 md:pb-11"
      : pad === "lg"
        ? "py-12 md:py-16"
        : pad === "sm"
          ? "py-8 md:py-10"
          : "py-10 md:py-12";
  return (
    <section id={id} className={cn("min-w-0", padding, className)}>
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

function motionProps(reduced, delay = 0) {
  if (reduced) return {};
  return {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.5, ease: EASE, delay },
  };
}

/** Hero / lightweight flow rail with traveling pulse */
function FlowRail({ steps, className, reduced, emphasizeLast }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="flex flex-col items-stretch gap-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start sm:gap-x-1 sm:gap-y-3">
        {steps.map((step, i) => (
          <React.Fragment key={`${step}-${i}`}>
            <motion.span
              className={cn(
                "text-[10px] font-bold uppercase tracking-[0.18em] sm:text-[11px]",
                emphasizeLast && i === steps.length - 1
                  ? "text-teal-900 dark:text-teal-300"
                  : "text-slate-700 dark:text-slate-200"
              )}
              initial={{ opacity: 0.4, y: 4 }}
              animate={play ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.09, ease: EASE }}
            >
              {step}
            </motion.span>
            {i < steps.length - 1 ? (
              <span className="hidden items-center sm:flex" aria-hidden>
                <motion.span
                  className="mx-1 text-slate-300 dark:text-slate-600"
                  initial={{ opacity: 0 }}
                  animate={play ? { opacity: 1 } : { opacity: 1 }}
                  transition={{ delay: i * 0.09 + 0.04 }}
                >
                  →
                </motion.span>
              </span>
            ) : null}
            {i < steps.length - 1 ? (
              <motion.span
                className="my-1 text-center text-slate-300 sm:hidden"
                initial={{ opacity: 0 }}
                animate={play ? { opacity: 1 } : { opacity: 1 }}
                transition={{ delay: i * 0.09 + 0.04 }}
                aria-hidden
              >
                ↓
              </motion.span>
            ) : null}
          </React.Fragment>
        ))}
      </div>
      {play && !reduced ? (
        <motion.div
          className="pointer-events-none absolute left-0 top-1/2 hidden h-0.5 w-6 -translate-y-1/2 rounded-full bg-teal-600/80 sm:block dark:bg-teal-400/80"
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: ["0%", "88%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.2, ease: "easeInOut", delay: 0.35, repeat: Infinity, repeatDelay: 2.5 }}
          aria-hidden
        />
      ) : null}
    </div>
  );
}

/** Main pipeline — engineering vs data science lanes */
function PipelineArchitectureTrack({ pipeline, reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.22 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className="relative mt-10 min-w-0 w-full">
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-[10px] font-bold uppercase tracking-[0.2em]">
        <span className="text-teal-800 dark:text-teal-400">Engineering pipeline</span>
        <span className="text-slate-400">·</span>
        <span className="text-slate-500">Data Science · inference only</span>
      </div>

      <div className="relative flex min-w-0 flex-col md:flex-row md:items-stretch">
        {play && !reduced ? (
          <motion.div
            className="pointer-events-none absolute left-0 top-[1.125rem] hidden h-0.5 bg-gradient-to-r from-teal-600/80 via-teal-600/40 to-slate-400/50 md:block dark:from-teal-400/80 dark:via-teal-400/40 dark:to-slate-500/50"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
            aria-hidden
          />
        ) : null}

        {pipeline.map((step, i) => (
          <motion.div
            key={step.stage}
            className={cn(
              "relative flex-1 border-b border-slate-200 px-0 py-4 last:border-b-0 md:border-b-0 md:border-r md:px-3 md:py-5 md:last:border-r-0",
              step.lane === "datascience" ? "bg-slate-50/80 dark:bg-slate-900/40" : ""
            )}
            initial={{ opacity: 0.45, y: 6 }}
            animate={play ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.09, duration: 0.45 }}
          >
            <div className="flex items-start gap-3 md:block">
              <motion.span
                className={cn(
                  "mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full md:mt-0 md:mb-3",
                  step.lane === "datascience" ? "bg-slate-400 dark:bg-slate-500" : "bg-teal-700 dark:bg-teal-400"
                )}
                animate={
                  play && step.lane === "datascience" && !reduced
                    ? { scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }
                    : play && !reduced
                      ? { opacity: [0.5, 1, 0.5] }
                      : {}
                }
                transition={
                  step.lane === "datascience"
                    ? { duration: 1.6, delay: 0.9 + i * 0.1, repeat: Infinity, repeatDelay: 3 }
                    : { duration: 1.4, delay: 0.3 + i * 0.12, repeat: Infinity, repeatDelay: 2.8 }
                }
                aria-hidden
              />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900 dark:text-white">{step.stage}</p>
                <p
                  className={cn(
                    "mt-1 text-[10px] font-medium uppercase tracking-wide",
                    step.lane === "datascience" ? "text-slate-500 dark:text-slate-400" : "text-teal-900/80 dark:text-teal-400/80"
                  )}
                >
                  {step.detail}
                </p>
              </div>
            </div>
            {i < pipeline.length - 1 ? (
              <span className="my-2 block pl-1 text-xs text-slate-300 md:hidden" aria-hidden>
                ↓
              </span>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Scattered sources → friction */
function FragmentationDiagram({ fragments, friction, reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className="relative mt-10 min-w-0">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          {fragments.map((label, i) => (
            <motion.div
              key={label}
              className="border border-slate-200 px-3 py-2.5 dark:border-slate-700"
              initial={{ opacity: 0.35, y: 6, x: i % 2 === 0 ? -4 : 4 }}
              animate={play ? { opacity: 1, y: 0, x: 0 } : { opacity: 1, y: 0, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.45, ease: EASE }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-300">{label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="hidden flex-col items-center gap-1 md:flex"
          initial={{ opacity: 0 }}
          animate={play ? { opacity: 1 } : { opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          aria-hidden
        >
          <span className="text-slate-300 dark:text-slate-600">↓</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Converge</span>
        </motion.div>

        <motion.div
          className="border-l-2 border-teal-700/40 pl-5 dark:border-teal-500/40 md:pl-6"
          initial={{ opacity: 0.4 }}
          animate={play ? { opacity: 1 } : { opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.45 }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 md:hidden">Then</p>
          <ul className="mt-2 space-y-3 md:mt-0">
            {friction.map((item, i) => (
              <motion.li
                key={item}
                className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800 dark:text-slate-200"
                initial={{ opacity: 0.35, x: -4 }}
                animate={play ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.07, duration: 0.35 }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

/** Vertical transformation steps */
function TransformColumn({ steps, reduced, accentFromIndex = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className="mx-auto mt-10 max-w-xs min-w-0">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <motion.p
            className={cn(
              "text-center text-[11px] font-bold uppercase tracking-[0.16em]",
              i >= accentFromIndex ? "text-teal-900 dark:text-teal-300" : "text-slate-800 dark:text-slate-200"
            )}
            initial={{ opacity: 0.35, y: 8 }}
            animate={play ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: EASE }}
          >
            {step}
          </motion.p>
          {i < steps.length - 1 ? (
            <motion.div
              className="my-2 flex justify-center overflow-hidden"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={play ? { opacity: 1, scaleY: 1 } : { opacity: 1, scaleY: 1 }}
              transition={{ delay: i * 0.1 + 0.05, duration: 0.3 }}
              style={{ originY: 0 }}
              aria-hidden
            >
              <span className="text-teal-700/45 dark:text-teal-500/45">↓</span>
            </motion.div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

/** Engineering → DS boundary for model integration */
function ModelIntegrationFlow({ flow, reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className="relative mt-10 min-w-0">
      <div className="grid gap-0 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
        <div className="border-t border-teal-800/25 pt-6 md:border-t-0 md:border-r md:pr-8 md:pt-0 dark:border-teal-500/25">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-teal-800 dark:text-teal-400">Engineering</p>
          <div className="mt-4 space-y-2">
            {[flow[0]].map((label) => (
              <p key={label} className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900 dark:text-white">
                {label}
              </p>
            ))}
          </div>
        </div>

        <motion.div
          className="relative flex flex-col items-center justify-center py-6 md:px-6 md:py-0"
          initial={{ opacity: 0.4 }}
          animate={play ? { opacity: 1 } : { opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="hidden h-full w-px bg-slate-200 md:block dark:bg-slate-700" aria-hidden />
          <motion.div
            className="my-4 w-full border-y border-dashed border-slate-300 py-4 text-center md:my-0 md:w-auto md:border-x md:border-y-0 md:px-5 md:py-6 dark:border-slate-600"
            animate={play && !reduced ? { borderColor: ["rgba(148,163,184,0.5)", "rgba(20,184,166,0.35)", "rgba(148,163,184,0.5)"] } : {}}
            transition={play ? { duration: 2.4, delay: 0.6, repeat: Infinity, repeatDelay: 2.5 } : {}}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{flow[1]}</p>
            <p className="mt-1 text-[9px] uppercase tracking-wide text-slate-400">DS-owned</p>
          </motion.div>
        </motion.div>

        <div className="border-t border-slate-200 pt-6 md:border-t-0 md:border-l md:pl-8 md:pt-0 dark:border-slate-700">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Downstream</p>
          <div className="mt-4 space-y-3">
            {flow.slice(2).map((label, i) => (
              <motion.p
                key={label}
                className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-800 dark:text-slate-200"
                initial={{ opacity: 0.35 }}
                animate={play ? { opacity: 1 } : { opacity: 1 }}
                transition={{ delay: 0.35 + i * 0.08 }}
              >
                {label}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AwsServiceStrip({ services, reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.28 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className="mt-10 min-w-0 overflow-x-auto">
      <div className="flex min-w-min flex-col gap-0 border-t border-slate-300 dark:border-slate-600 md:min-w-0 md:flex-row">
        {services.map((svc, i) => (
          <motion.div
            key={svc.label}
            className="flex-1 border-b border-slate-200 px-0 py-4 last:border-b-0 md:border-b-0 md:border-r md:px-4 md:py-5 md:last:border-r-0"
            initial={{ opacity: 0.4 }}
            animate={play ? { opacity: 1 } : { opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900 dark:text-white">{svc.label}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{svc.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OperationsDiagram({ scheduleFlow, opsLayer, reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.28 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className="relative mt-10 min-w-0 space-y-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Execution loop</p>
        <div className="relative mt-4 flex flex-col gap-0 md:flex-row md:items-center md:gap-0">
          {play && !reduced ? (
            <motion.div
              className="pointer-events-none absolute left-0 top-1/2 hidden h-px w-full bg-slate-200 md:block dark:bg-slate-700"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
              style={{ originX: 0 }}
              aria-hidden
            />
          ) : null}
          {scheduleFlow.map((step, i) => (
            <React.Fragment key={step}>
              <motion.span
                className="relative z-[1] bg-white px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900 dark:bg-slate-950 dark:text-white md:bg-transparent"
                initial={{ opacity: 0.35, y: 4 }}
                animate={play ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.35 }}
              >
                {step}
              </motion.span>
              {i < scheduleFlow.length - 1 ? (
                <>
                  <span className="my-1 text-slate-300 md:hidden" aria-hidden>
                    ↓
                  </span>
                  <span className="mx-2 hidden text-slate-300 md:inline" aria-hidden>
                    →
                  </span>
                </>
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="border-t border-dashed border-slate-200 pt-8 dark:border-slate-700">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-800 dark:text-teal-400">Operational layer</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {opsLayer.map((item, i) => (
            <motion.span
              key={item}
              className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400"
              initial={{ opacity: 0.35 }}
              animate={play ? { opacity: 1 } : { opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.06, duration: 0.35 }}
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <Section pad="hero">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-end lg:gap-14">
        <motion.div {...motionProps(reduced)}>
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-teal-800 dark:text-teal-400">{C.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(2rem,4.6vw,3rem)] font-semibold leading-[1.05] tracking-tight text-slate-950 dark:text-white">
            {C.title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400">{C.subtitle}</p>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{C.engagementLabel}</p>
        </motion.div>

        <motion.div
          className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 dark:border-slate-800"
          {...motionProps(reduced, 0.06)}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{C.heroThesis}</p>
          <div className="mt-6">
            <FlowRail steps={C.heroFlow} reduced={reduced} emphasizeLast className="sm:justify-start" />
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export function ProblemSection() {
  const reduced = useReducedMotion();
  const p = C.problem;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="lg">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 lg:items-start">
        <motion.div {...motionProps(reduced)}>
          <NumEyebrow n="01" label="The problem" />
          <h2 className="mt-3 text-[clamp(1.85rem,3.8vw,2.85rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
            {p.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">{p.body}</p>
        </motion.div>

        <motion.div {...motionProps(reduced, 0.08)}>
          <FragmentationDiagram fragments={p.fragments} friction={p.friction} reduced={reduced} />
        </motion.div>
      </div>
    </Section>
  );
}

export function EngineeringChallengeSection() {
  const reduced = useReducedMotion();
  const e = C.engineeringChallenge;

  return (
    <Section className="border-t border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20" pad="md">
      <motion.div className="mx-auto max-w-3xl text-center" {...motionProps(reduced)}>
        <NumEyebrow n="02" label="The engineering challenge" />
        <h2 className="mt-4 text-[clamp(1.85rem,4vw,3rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
          {e.headline[0]}
          <span className="mt-2 block text-teal-900 dark:text-teal-300">{e.headline[1]}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">{e.body}</p>
      </motion.div>
    </Section>
  );
}

export function PipelineArchitectureSection() {
  const reduced = useReducedMotion();

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="lg">
      <motion.div className="max-w-2xl" {...motionProps(reduced)}>
        <NumEyebrow n="03" label="Pipeline architecture" />
        <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
          From discovery to reporting — one continuous flow.
        </h2>
      </motion.div>

      <PipelineArchitectureTrack pipeline={C.pipeline} reduced={reduced} />
    </Section>
  );
}

export function SourceDiscoverySection() {
  const reduced = useReducedMotion();
  const s = C.sourceDiscovery;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="md">
      <motion.div className="max-w-xl" {...motionProps(reduced)}>
        <NumEyebrow n="04" label="Source discovery" />
        <h2 className="mt-3 text-[clamp(1.65rem,3.2vw,2.35rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
          {s.headline}
        </h2>
      </motion.div>

      <div className="mt-10 grid gap-0 divide-y divide-slate-200 dark:divide-slate-800 md:grid-cols-3 md:divide-x md:divide-y-0">
        {s.approaches.map((item, i) => (
          <motion.div
            key={item.title}
            className="px-0 py-7 md:px-6 md:py-8 first:md:pl-0"
            initial={{ opacity: 0.4, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: reduced ? 0 : i * 0.08, ease: EASE }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-800 dark:text-teal-400">{item.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export function ExtractionSection() {
  const reduced = useReducedMotion();
  const e = C.extraction;

  return (
    <Section className="border-t border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/15" pad="md">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)] lg:items-start lg:gap-14">
        <motion.div {...motionProps(reduced)}>
          <NumEyebrow n="05" label="Extraction & processing" />
          <h2 className="mt-3 text-[clamp(1.65rem,3.2vw,2.35rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
            {e.headline}
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">{e.body}</p>
        </motion.div>

        <motion.div {...motionProps(reduced, 0.08)}>
          <TransformColumn steps={e.flow} reduced={reduced} accentFromIndex={2} />
        </motion.div>
      </div>
    </Section>
  );
}

export function ModelIntegrationSection() {
  const reduced = useReducedMotion();
  const m = C.modelIntegration;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="lg">
      <motion.div className="mx-auto max-w-2xl text-center" {...motionProps(reduced)}>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">{m.eyebrow}</p>
        <h2 className="mt-4 text-[clamp(1.85rem,4vw,3rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
          {m.headline[0]}
          <span className="mt-2 block text-teal-900 dark:text-teal-300">{m.headline[1]}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">{m.body}</p>
      </motion.div>

      <ModelIntegrationFlow flow={m.flow} reduced={reduced} />
    </Section>
  );
}

export function AwsInfrastructureSection() {
  const reduced = useReducedMotion();
  const a = C.aws;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="md">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:items-start lg:gap-12">
        <div>
          <motion.div {...motionProps(reduced)}>
            <NumEyebrow n="06" label="Production infrastructure" />
            <h2 className="mt-3 text-[clamp(1.65rem,3.2vw,2.35rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
              {a.headline}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">{a.body}</p>
          </motion.div>

          <AwsServiceStrip services={a.services} reduced={reduced} />
        </div>

        <motion.div className="min-w-0 lg:sticky lg:top-[calc(4rem+env(safe-area-inset-top,0px))]" {...motionProps(reduced, 0.08)}>
          <ArchitectureDiagramViewer
            src={INTELLIGENCE_ARCH_IMAGE}
            alt="Reference architecture diagram for the intelligence pipeline"
            modalTitle="Pipeline architecture reference"
            className="w-full"
            previewAspect="aspect-[4/3]"
            previewClassName="min-h-[220px] max-h-[min(70vh,560px)] sm:min-h-[280px]"
          />
          <p className="mt-2 text-center text-[10px] uppercase tracking-wide text-slate-500">Reference diagram · optional · click to enlarge</p>
        </motion.div>
      </div>
    </Section>
  );
}

export function OperationsSection() {
  const reduced = useReducedMotion();
  const o = C.operations;

  return (
    <Section className="border-t border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/15" pad="md">
      <motion.div className="max-w-xl" {...motionProps(reduced)}>
        <NumEyebrow n="07" label="Automation & operations" />
        <h2 className="mt-3 text-[clamp(1.65rem,3.2vw,2.35rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
          {o.headline}
        </h2>
      </motion.div>

      <OperationsDiagram scheduleFlow={o.scheduleFlow} opsLayer={o.opsLayer} reduced={reduced} />
    </Section>
  );
}

export function OutputSection() {
  const reduced = useReducedMotion();
  const o = C.output;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="lg">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-center lg:gap-14">
        <motion.div {...motionProps(reduced)}>
          <NumEyebrow n="08" label="Output & value" />
          <h2 className="mt-3 text-[clamp(1.85rem,3.6vw,2.75rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
            {o.headline[0]}
            <span className="mt-1 block text-teal-900 dark:text-teal-300">{o.headline[1]}</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">{o.body}</p>
        </motion.div>

        <motion.div {...motionProps(reduced, 0.08)}>
          <TransformColumn steps={o.funnel} reduced={reduced} accentFromIndex={3} />
        </motion.div>
      </div>
    </Section>
  );
}

/** Compact scope row — lives once at the end, not repeated in narrative */
function ScopeStrip({ items, reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className="mx-auto mt-8 grid max-w-2xl gap-6 sm:grid-cols-3 sm:gap-0">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className={cn(
            "px-0 text-center sm:px-4",
            i > 0 && "sm:border-l sm:border-slate-200 dark:sm:border-slate-700"
          )}
          initial={{ opacity: 0.4, y: 8 }}
          animate={play ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4, ease: EASE }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-800 dark:text-teal-400">{item.label}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{item.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function ConclusionSection() {
  const reduced = useReducedMotion();
  const c = C.conclusion;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="lg">
      <motion.div className="mx-auto max-w-3xl text-center" {...motionProps(reduced)}>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">{c.eyebrow}</p>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.1em] text-slate-600 dark:text-slate-400 md:text-base">
          {c.line1}
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(1.75rem,4vw,2.85rem)] font-semibold leading-[1.1] tracking-tight text-slate-950 dark:text-white">
          {c.headline}
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">{c.supporting}</p>
      </motion.div>

      <p className="mx-auto mt-14 max-w-lg text-center text-[10px] font-bold uppercase tracking-[0.22em] text-teal-800/90 dark:text-teal-400/90">
        My contribution
      </p>
      <ScopeStrip items={C.contributions} reduced={reduced} />
    </Section>
  );
}

export function CaseStudyFooter() {
  return <ProjectCaseStudyNav slug={INTELLIGENCE_PIPELINE_SLUG} />;
}
