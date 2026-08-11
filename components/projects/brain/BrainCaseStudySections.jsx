"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  BRAIN_CASE_STUDY,
  BRAIN_CASE_STUDY_SLUG,
} from "@/lib/data/brain-case-study";
import { ProjectCaseStudyNav } from "@/components/projects/ProjectCaseStudyNav";
import { cn } from "@/lib/cn";

const C = BRAIN_CASE_STUDY;
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

/** Connected nodes with lines + traveling signal (decisioning / flows) */
function ConnectedFlowDiagram({ steps, reduced, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.22 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className={cn("relative min-w-0 w-full", className)}>
      <div className="flex flex-col gap-0 md:hidden">
        {steps.map((label, i) => (
          <React.Fragment key={label}>
            <motion.div
              className="flex items-center gap-3 border-l-2 border-teal-700/35 py-2 pl-4 dark:border-teal-500/40"
              initial={{ opacity: 0.4, x: -6 }}
              animate={play ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900 dark:text-white">{label}</span>
            </motion.div>
            {i < steps.length - 1 && play && !reduced ? (
              <motion.div
                className="ml-[7px] h-4 w-px bg-teal-600/50 dark:bg-teal-400/50"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.35, delay: i * 0.08 + 0.05 }}
                style={{ originY: 0 }}
              />
            ) : null}
          </React.Fragment>
        ))}
      </div>

      <div className="hidden min-w-0 md:flex md:items-center md:gap-0">
        {steps.map((label, i) => (
          <React.Fragment key={label}>
            <motion.div
              className="relative z-[1] shrink-0 px-1 text-center"
              initial={{ opacity: 0.35 }}
              animate={play ? { opacity: 1 } : { opacity: 1 }}
              transition={{ duration: 0.4, delay: i * 0.09, ease: EASE }}
            >
              <p className="max-w-[6.5rem] text-[10px] font-bold uppercase leading-snug tracking-[0.12em] text-slate-900 dark:text-white lg:max-w-[7.5rem] lg:text-[11px]">
                {label}
              </p>
              <motion.span
                className="mx-auto mt-2 block h-1.5 w-1.5 rounded-full bg-teal-700 dark:bg-teal-400"
                animate={play ? { opacity: [0.45, 1, 0.45] } : {}}
                transition={play ? { duration: 1.4, delay: 0.3 + i * 0.12, repeat: Infinity, repeatDelay: 2.2 } : {}}
              />
            </motion.div>
            {i < steps.length - 1 ? (
              <div className="relative mx-0.5 h-px min-w-[1.25rem] flex-1 bg-slate-300 dark:bg-slate-600">
                {play && !reduced ? (
                  <motion.span
                    className="absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-teal-600 dark:bg-teal-400"
                    initial={{ left: "0%", opacity: 0 }}
                    animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.05, delay: 0.35 + i * 0.18, repeat: Infinity, repeatDelay: 2.8 }}
                  />
                ) : null}
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/** ML production pipeline — stages primary, tech secondary */
function ProductionPipelineTrack({ pipeline, reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.28 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className="relative mt-10 min-w-0 w-full overflow-x-auto">
      <div className="relative flex min-w-min flex-col border-t border-slate-300 dark:border-slate-600 md:min-w-0 md:flex-row md:items-stretch">
        {play && !reduced ? (
          <motion.div
            className="pointer-events-none absolute left-0 top-0 hidden h-0.5 bg-teal-600/75 md:block dark:bg-teal-400/75"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.15 }}
          />
        ) : null}
        {pipeline.map((step, i) => (
          <motion.div
            key={step.stage}
            className={cn(
              "relative min-w-[8.5rem] flex-1 border-b border-slate-200 px-3 py-4 last:border-b-0 md:border-b-0 md:border-r md:px-4 md:py-5 md:last:border-r-0",
              play && "md:pt-6"
            )}
            initial={{ opacity: 0.45 }}
            animate={play ? { opacity: 1 } : { opacity: 1 }}
            transition={{ delay: 0.12 + i * 0.08, duration: 0.4 }}
          >
            {i > 0 ? (
              <span className="absolute -top-[5px] left-3 hidden h-2 w-2 rounded-full border border-slate-300 bg-white md:block dark:border-slate-600 dark:bg-slate-950" aria-hidden />
            ) : null}
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900 dark:text-white">{step.stage}</p>
            {step.tech.length ? (
              <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {step.tech.join(" · ")}
              </p>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Closed-loop system diagram */
function SystemLoopDiagram({ steps, reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className="relative mx-auto mt-10 w-full max-w-3xl min-w-0">
      <div className="hidden sm:block">
        <svg viewBox="0 0 520 88" className="mb-2 w-full" aria-hidden>
          <motion.path
            d="M 40 36 H 480"
            fill="none"
            stroke="currentColor"
            className="text-slate-300 dark:text-slate-600"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={play ? { pathLength: 1 } : { pathLength: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
          />
          <motion.path
            d="M 480 44 Q 260 82 40 44"
            fill="none"
            stroke="currentColor"
            className="text-teal-700/50 dark:text-teal-400/50"
            strokeWidth="1"
            strokeDasharray="5 4"
            initial={{ pathLength: 0, opacity: 0.5 }}
            animate={play ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.3, delay: 0.45, ease: EASE }}
          />
        </svg>
        <div className="grid grid-cols-5 gap-1 text-center">
          {steps.map((word, i) => (
            <motion.span
              key={word}
              className="text-[clamp(0.65rem,1.5vw,0.8rem)] font-bold uppercase tracking-[0.06em] text-slate-950 dark:text-white lg:text-xs"
              initial={{ opacity: 0.35 }}
              animate={play ? { opacity: 1 } : { opacity: 1 }}
              transition={{ delay: 0.12 + i * 0.09, duration: 0.4 }}
            >
              {word}
            </motion.span>
          ))}
        </div>
        <p className="mt-6 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-800/80 dark:text-teal-400/80">
          Feedback returns to signals
        </p>
      </div>

      <div className="sm:hidden">
        <ConnectedFlowDiagram steps={steps} reduced={reduced} />
        <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-800/80 dark:text-teal-400/80">
          Feedback ↺ Signals
        </p>
      </div>
    </div>
  );
}

/** Horizontal flow with traveling pulse */
function FlowRail({ steps, className, reduced, emphasizeLast }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="flex flex-col items-stretch gap-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-1 sm:gap-y-3">
        {steps.map((step, i) => (
          <React.Fragment key={`${step}-${i}`}>
            <motion.span
              className={cn(
                "text-center text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[11px]",
                emphasizeLast && i === steps.length - 1
                  ? "text-teal-900 dark:text-teal-300"
                  : i === 0
                    ? "text-slate-800 dark:text-slate-100"
                    : "text-slate-700 dark:text-slate-200"
              )}
              initial={{ opacity: 0.4 }}
              animate={play ? { opacity: 1 } : { opacity: 1 }}
              transition={{ duration: 0.35, delay: i * 0.08, ease: EASE }}
            >
              {step}
            </motion.span>
            {i < steps.length - 1 ? (
              <span className="hidden items-center sm:flex" aria-hidden>
                <motion.span
                  className="mx-1 text-slate-300 dark:text-slate-600"
                  initial={{ opacity: 0 }}
                  animate={play ? { opacity: 1 } : { opacity: 1 }}
                  transition={{ delay: i * 0.08 + 0.04 }}
                >
                  →
                </motion.span>
              </span>
            ) : null}
            {i < steps.length - 1 ? (
              <span className="my-1 text-center text-slate-300 sm:hidden" aria-hidden>
                ↓
              </span>
            ) : null}
          </React.Fragment>
        ))}
      </div>
      {play && !reduced ? (
        <motion.div
          className="pointer-events-none absolute left-0 top-1/2 hidden h-0.5 w-8 -translate-y-1/2 rounded-full bg-teal-600/80 sm:block dark:bg-teal-400/80"
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: ["0%", "85%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.4, ease: "easeInOut", delay: 0.3 }}
          aria-hidden
        />
      ) : null}
    </div>
  );
}

export function HeroSection() {
  const reduced = useReducedMotion();
  const ref = useRef(null);

  return (
    <Section pad="hero">
      <div ref={ref} className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-12">
        <motion.div {...motionProps(reduced)}>
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-teal-800 dark:text-teal-400">{C.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(2rem,4.8vw,3.05rem)] font-semibold leading-[1.04] tracking-tight text-slate-950 dark:text-white">
            {C.titleLine1}
            <br />
            {C.titleLine2}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400">{C.subtitle}</p>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{C.engagementLabel}</p>
        </motion.div>

        <motion.div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 dark:border-slate-800" {...motionProps(reduced, 0.06)}>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{C.heroThesis}</p>
          <div className="mt-6">
            <FlowRail steps={C.heroFlow} reduced={reduced} emphasizeLast className="sm:justify-start" />
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export function ProductGapSection() {
  const reduced = useReducedMotion();
  const g = C.productGap;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="md">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-12 lg:items-start">
        <motion.div {...motionProps(reduced)}>
          <NumEyebrow n="01" label="Business & product problem" />
          <h2 className="mt-3 text-[clamp(1.85rem,3.8vw,2.85rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
            {g.statement.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </motion.div>

        <motion.div className="lg:pt-6" {...motionProps(reduced, 0.08)}>
          <div className="relative pl-5">
            <div className="absolute bottom-8 left-0 top-8 w-px bg-slate-200 dark:bg-slate-700" aria-hidden />
            {g.ladder.map((step, i) => (
              <div key={step} className="relative pb-8 last:pb-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-800 dark:text-slate-200">{step}</p>
                {i === 1 ? (
                  <div className="mt-4 mb-2 border-y border-dashed border-teal-700/35 py-3 dark:border-teal-500/35">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-900 dark:text-teal-300">Adoption gap</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-200/80 pt-6 dark:border-slate-800" {...motionProps(reduced, 0.1)}>
        {g.annotations.map((note) => (
          <span key={note} className="text-[11px] leading-snug text-slate-500 dark:text-slate-400">
            · {note}
          </span>
        ))}
      </motion.div>
    </Section>
  );
}

function VerticalMicroFlow({ steps, muted, reduced, dominant }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className={cn("space-y-0", dominant ? "text-left" : "text-left opacity-70")}>
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <motion.p
            className={cn(
              "text-[11px] font-bold uppercase tracking-[0.16em]",
              dominant ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400",
              dominant && i >= 2 && "text-teal-900/90 dark:text-teal-300/90"
            )}
            initial={{ opacity: 0.35, x: dominant ? -6 : 0 }}
            animate={play ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * (dominant ? 0.1 : 0.05), ease: EASE }}
          >
            {step}
          </motion.p>
          {i < steps.length - 1 ? (
            <motion.span
              className={cn("my-1 block text-xs", muted ? "text-slate-300" : "text-teal-700/50 dark:text-teal-500/50")}
              initial={{ opacity: 0 }}
              animate={play ? { opacity: 1 } : { opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.05 }}
              aria-hidden
            >
              ↓
            </motion.span>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

export function DecisioningSection() {
  const reduced = useReducedMotion();
  const d = C.decisioning;

  return (
    <Section className="border-t border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/25" pad="lg">
      <motion.div className="mx-auto max-w-3xl text-center" {...motionProps(reduced)}>
        <NumEyebrow n="02" label="Decisioning problem" />
        <h2 className="mt-4 text-[clamp(1.9rem,4.2vw,3.1rem)] font-semibold leading-[1.05] tracking-tight text-slate-950 dark:text-white">
          {d.statement[0]}
          <span className="mt-2 block text-teal-900 dark:text-teal-300">{d.statement[1]}</span>
        </h2>
      </motion.div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:gap-12 md:items-start">
        <motion.div {...motionProps(reduced, 0.06)}>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Before</p>
          <div className="mt-4">
            <VerticalMicroFlow steps={d.before} muted reduced={reduced} dominant={false} />
          </div>
        </motion.div>
        <motion.div className="min-w-0 border-l border-slate-200 pl-6 dark:border-slate-700 md:pl-10" {...motionProps(reduced, 0.1)}>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-800 dark:text-teal-400">After · Decisioning flow</p>
          <div className="mt-5">
            <ConnectedFlowDiagram steps={d.after} reduced={reduced} />
          </div>
        </motion.div>
      </div>

      <motion.p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-slate-600 dark:text-slate-400" {...motionProps(reduced, 0.14)}>
        {C.mlApproach}
      </motion.p>
    </Section>
  );
}

export function ModelToProductionSection() {
  const reduced = useReducedMotion();
  const m = C.modelToProduction;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="md">
      <motion.div className="max-w-xl" {...motionProps(reduced)}>
        <NumEyebrow n="03" label="ML → production pipeline" />
        <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
          {m.headline.join(" ")}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">{m.body}</p>
      </motion.div>

      <ProductionPipelineTrack pipeline={m.pipeline} reduced={reduced} />
    </Section>
  );
}

export function MyContributionSection() {
  const reduced = useReducedMotion();

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="sm">
      <motion.div {...motionProps(reduced)}>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-teal-800/90 dark:text-teal-400/90">My contribution</p>
        <ul className="mt-4 max-w-2xl space-y-2.5 border-l border-slate-200 pl-5 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:text-slate-300">
          {C.contributions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </motion.div>
    </Section>
  );
}

function RequestPathStrip({ steps, reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className="mt-8 overflow-x-auto border-t border-teal-800/20 pt-5 dark:border-teal-500/25">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-800 dark:text-teal-400">Request path</p>
      <div className="mt-3 flex min-w-max items-center gap-1.5">
        {steps.map((s, i) => (
          <React.Fragment key={`${s}-${i}`}>
            <motion.span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wide",
                i === 0 || i === steps.length - 1 ? "text-slate-900 dark:text-white" : "text-teal-900/90 dark:text-teal-300/90"
              )}
              animate={play ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={play ? { duration: 2.5, delay: i * 0.22, repeat: Infinity, repeatDelay: 1.2 } : {}}
            >
              {s}
            </motion.span>
            {i < steps.length - 1 ? <span className="text-slate-400">→</span> : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function BrainProductionArchSchematic({ reduced }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const play = inView && !reduced;

  return (
    <div ref={ref} className="min-w-0 rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/90 sm:p-5">
      <svg viewBox="0 0 420 300" className="w-full" role="img" aria-label="Conceptual production architecture: client apps through API and allocation layers to ML infrastructure">
        <motion.text x="210" y="22" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b" initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : { opacity: 1 }}>
          PRODUCTION ARCHITECTURE · CONCEPTUAL
        </motion.text>
        <motion.rect x="155" y="36" width="110" height="26" fill="none" stroke="#334155" strokeWidth="1" initial={{ opacity: 0.4 }} animate={play ? { opacity: 1 } : { opacity: 1 }} transition={{ delay: 0.1 }} />
        <text x="210" y="53" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f172a">CLIENT APPS</text>
        <motion.path d="M 210 62 L 210 78" stroke="#94a3b8" strokeWidth="1" initial={{ pathLength: 0 }} animate={play ? { pathLength: 1 } : { pathLength: 1 }} transition={{ delay: 0.2, duration: 0.35 }} />
        <text x="210" y="92" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f172a">GRAPHQL API</text>
        <motion.path d="M 210 98 L 210 114" stroke="#94a3b8" strokeWidth="1" initial={{ pathLength: 0 }} animate={play ? { pathLength: 1 } : { pathLength: 1 }} transition={{ delay: 0.28, duration: 0.35 }} />
        <motion.rect x="130" y="118" width="160" height="52" fill="none" stroke="#0f766e" strokeWidth="1.25" initial={{ opacity: 0.4 }} animate={play ? { opacity: 1 } : { opacity: 1 }} transition={{ delay: 0.35 }} />
        <text x="210" y="136" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0f766e">ALLOCATION / DECISIONING</text>
        <text x="210" y="152" textAnchor="middle" fontSize="8" fill="#475569">Prediction · Logic · Processing</text>
        <motion.path d="M 210 170 L 210 186" stroke="#94a3b8" strokeWidth="1" initial={{ pathLength: 0 }} animate={play ? { pathLength: 1 } : { pathLength: 1 }} transition={{ delay: 0.45, duration: 0.35 }} />
        <motion.rect x="95" y="192" width="230" height="44" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" initial={{ opacity: 0.4 }} animate={play ? { opacity: 1 } : { opacity: 1 }} transition={{ delay: 0.52 }} />
        <text x="210" y="210" textAnchor="middle" fontSize="8" fontWeight="700" fill="#64748b">ML + DATA INFRASTRUCTURE</text>
        <text x="210" y="226" textAnchor="middle" fontSize="8" fill="#475569">S3 · Databricks · MLflow · ECR · EC2</text>
      </svg>
    </div>
  );
}

export function ProductionArchitectureSection() {
  const reduced = useReducedMotion();
  const a = C.productionArch;
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="lg">
      <motion.div className="max-w-2xl" {...motionProps(reduced)}>
        <NumEyebrow n="04" label="Production architecture" />
        <h2 className="mt-3 text-[clamp(1.85rem,3.6vw,2.75rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
          {a.headline.join(" ")}
        </h2>
      </motion.div>

      <motion.div
        className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,1.1fr)] lg:items-start lg:gap-10 xl:gap-12"
        {...motionProps(reduced, 0.06)}
      >
        <div className="min-w-0 space-y-7">
          {a.layers.map((layer) => (
            <div
              key={layer.label}
              className={cn(
                "border-l-2 pl-5",
                layer.primary ? "border-teal-700/60 dark:border-teal-500/60" : "border-slate-300 dark:border-slate-600"
              )}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{layer.label}</p>
              {layer.stack ? (
                <div className="mt-3 space-y-1">
                  {layer.items.map((item) => (
                    <p key={item} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {layer.items.map((item, i) => (
                    <React.Fragment key={item}>
                      <span className={layer.primary && i > 0 ? "text-teal-900 dark:text-teal-300" : undefined}>{item}</span>
                      {i < layer.items.length - 1 ? <span className="font-normal text-slate-400">↓</span> : null}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          ))}
          <RequestPathStrip steps={a.requestPath} reduced={reduced} />
        </div>

        <div className="min-w-0 lg:sticky lg:top-[calc(4rem+env(safe-area-inset-top,0px))] lg:self-start">
          <BrainProductionArchSchematic reduced={reduced} />
          <p className="mt-2 text-center text-[10px] uppercase tracking-wide text-slate-500">Conceptual diagram · anonymized</p>
        </div>
      </motion.div>

      <div className="mt-8 lg:hidden">
        <button
          type="button"
          onClick={() => setDetailOpen((o) => !o)}
          className="flex min-h-[44px] w-full items-center justify-between border-t border-slate-200 pt-5 text-left text-xs font-semibold uppercase tracking-wide text-teal-900 dark:border-slate-800 dark:text-teal-300"
          aria-expanded={detailOpen}
        >
          Layer summary
          <ChevronDown className={cn("h-4 w-4 transition", detailOpen && "rotate-180")} />
        </button>
        {detailOpen ? (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            UX → GraphQL → allocation API → prediction → logic → recommendations, backed by S3, Databricks, MLflow, ECR, and EC2.
          </p>
        ) : null}
      </div>
    </Section>
  );
}

export function EngineeringDecisionsSection() {
  const reduced = useReducedMotion();

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="md">
      <motion.div {...motionProps(reduced)}>
        <NumEyebrow n="05" label="Engineering decisions" />
        <h2 className="mt-3 max-w-xl text-[clamp(1.55rem,3vw,2.2rem)] font-semibold tracking-tight text-slate-950 dark:text-white">
          Separating prediction from decisioning.
        </h2>
      </motion.div>

      <div className="mt-10 space-y-0 divide-y divide-slate-200 dark:divide-slate-800">
        {C.decisions.map((d, i) => (
          <motion.div
            key={d.num}
            className="grid gap-3 py-7 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8 md:py-8"
            {...motionProps(reduced, i * 0.05)}
          >
            <p className="text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-none tabular-nums text-slate-200 dark:text-slate-800">
              {d.num}
            </p>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-900 dark:text-teal-400">{d.title}</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-700 dark:text-slate-300 md:text-base">{d.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export function SystemViewSection() {
  const reduced = useReducedMotion();
  const s = C.systemView;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="lg">
      <motion.p className="text-center text-[10px] font-bold uppercase tracking-[0.32em] text-slate-500" {...motionProps(reduced)}>
        06 · System loop
      </motion.p>

      <SystemLoopDiagram steps={s.flow} reduced={reduced} />

      <motion.p className="mx-auto mt-10 max-w-lg text-center text-base leading-relaxed text-slate-600 dark:text-slate-400" {...motionProps(reduced, 0.08)}>
        {s.line}
      </motion.p>
    </Section>
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
    </Section>
  );
}

export function CaseStudyFooter() {
  return <ProjectCaseStudyNav slug={BRAIN_CASE_STUDY_SLUG} />;
}
