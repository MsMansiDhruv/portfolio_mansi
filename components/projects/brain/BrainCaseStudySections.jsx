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

      <div className="mx-auto mt-12 grid max-w-4xl gap-10 md:grid-cols-[0.75fr_1.25fr] md:gap-12">
        <motion.div {...motionProps(reduced, 0.06)}>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Before</p>
          <div className="mt-4">
            <VerticalMicroFlow steps={d.before} muted reduced={reduced} dominant={false} />
          </div>
        </motion.div>
        <motion.div className="border-l border-slate-200 pl-8 dark:border-slate-700 md:pl-10" {...motionProps(reduced, 0.1)}>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-800 dark:text-teal-400">After</p>
          <div className="mt-4">
            <VerticalMicroFlow steps={d.after} reduced={reduced} dominant />
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const play = inView && !reduced;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="md">
      <motion.div className="max-w-xl" {...motionProps(reduced)}>
        <NumEyebrow n="03" label="ML → production pipeline" />
        <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
          {m.headline.join(" ")}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 md:text-base">{m.body}</p>
      </motion.div>

      <div ref={ref} className="relative mt-10 overflow-x-auto">
        <div className="relative flex min-w-max border-t border-slate-300 dark:border-slate-600">
          {play && !reduced ? (
            <motion.div
              className="pointer-events-none absolute left-0 top-0 h-0.5 bg-teal-600/70 dark:bg-teal-400/70"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
            />
          ) : null}
          {m.pipeline.map((step, i) => (
            <motion.div
              key={step.stage}
              className="min-w-[6.75rem] border-r border-slate-200 px-3 py-4 last:border-r-0 dark:border-slate-700 md:min-w-[8.5rem] md:px-4"
              initial={{ opacity: 0.45 }}
              animate={play ? { opacity: 1 } : { opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-800 dark:text-slate-200">{step.stage}</p>
              {step.tech.length ? (
                <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-teal-900/85 dark:text-teal-400/90">
                  {step.tech.join(" · ")}
                </p>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
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
          <ArchitectureDiagramViewer
            src={BRAIN_ARCH_PRODUCTION_IMAGE}
            alt={a.detailImageAlt}
            modalTitle="Production architecture"
            className="w-full"
            previewAspect="aspect-[4/3]"
            previewClassName="min-h-[280px] max-h-[min(78vh,760px)] sm:min-h-[340px] md:min-h-[400px] lg:min-h-[460px] xl:min-h-[520px]"
          />
          <p className="mt-2 text-center text-[10px] uppercase tracking-wide text-slate-500">Reference diagram · click to enlarge</p>
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const play = inView && !reduced;

  return (
    <Section className="border-t border-slate-200 dark:border-slate-800" pad="lg">
      <motion.p className="text-center text-[10px] font-bold uppercase tracking-[0.32em] text-slate-500" {...motionProps(reduced)}>
        06 · System loop
      </motion.p>

      <div ref={ref} className="relative mx-auto mt-10 max-w-3xl">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2">
          {s.flow.map((word, i) => (
            <React.Fragment key={word}>
              <motion.span
                className="text-[clamp(1.15rem,2.8vw,1.75rem)] font-semibold uppercase tracking-tight text-slate-950 dark:text-white"
                initial={{ opacity: 0.4 }}
                animate={play ? { opacity: 1 } : { opacity: 1 }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
              >
                {word}
              </motion.span>
              {i < s.flow.length - 1 ? (
                <span className="hidden text-teal-700/50 sm:inline dark:text-teal-400/50" aria-hidden>
                  →
                </span>
              ) : null}
              {i < s.flow.length - 1 ? (
                <span className="text-teal-700/50 sm:hidden dark:text-teal-400/50" aria-hidden>
                  ↓
                </span>
              ) : null}
            </React.Fragment>
          ))}
        </div>

        {play && !reduced ? (
          <motion.p
            className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-teal-800/80 dark:text-teal-400/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1] }}
            transition={{ duration: 2, delay: 0.8, repeat: Infinity, repeatDelay: 2.5 }}
          >
            Feedback ↺ Signals
          </motion.p>
        ) : (
          <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-teal-800/80 dark:text-teal-400/80">
            Feedback ↺ Signals
          </p>
        )}

        <p className="mx-auto mt-10 max-w-lg text-center text-base leading-relaxed text-slate-600 dark:text-slate-400">{s.line}</p>
      </div>
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
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-400 md:text-base">
          {c.pre}
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
  return <ProjectCaseStudyNav slug={BRAIN_CASE_STUDY_SLUG} takeaway={C.takeaway} />;
}
