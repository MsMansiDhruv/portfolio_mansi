"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { OLAP_CASE_STUDY, OLAP_COST_EVIDENCE_IMAGE } from "@/lib/data/olap-case-study";
import { cn } from "@/lib/cn";
import { BENCHMARK_ENGINES, workloadNumeric } from "@/components/projects/olap/benchmark-utils";

const C = OLAP_CASE_STUDY;
const EASE = [0.22, 1, 0.36, 1];

function Section({ children, className, id }) {
  return (
    <section id={id} className={cn("min-w-0 py-16 md:py-24", className)}>
      {children}
    </section>
  );
}

function Eyebrow({ children }) {
  return <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-teal-800/90 dark:text-teal-400/90">{children}</p>;
}

function fadeUp(reduced, delay = 0) {
  if (reduced) return {};
  return {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.55, ease: EASE, delay },
  };
}

/** 1. Hero */
export function HeroSection() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const { fork } = C.mismatch;
  const play = inView && !reduced;

  return (
    <header ref={ref} className="min-w-0 pt-8 md:pt-10">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <Eyebrow>{C.eyebrow}</Eyebrow>
          <h1 className="mt-4 text-[clamp(2rem,4.5vw,2.85rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white">
            {C.titleLine1}
            <br />
            {C.titleLine2}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600 dark:text-slate-400">{C.subtitle}</p>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <svg viewBox="0 0 320 280" className="w-full max-w-[320px] lg:ml-auto lg:max-w-[340px]" aria-hidden>
            <motion.text
              x="160"
              y="28"
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="currentColor"
              className="text-slate-800 dark:text-slate-200"
              initial={{ opacity: 0 }}
              animate={play ? { opacity: 1 } : { opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              APPLICATION
            </motion.text>
            <motion.path
              d="M 160 36 L 160 58"
              fill="none"
              stroke="currentColor"
              className="text-slate-400"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={play ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.15, ease: EASE }}
            />
            <motion.text
              x="160"
              y="78"
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="currentColor"
              className="text-slate-950 dark:text-white"
              initial={{ opacity: 0 }}
              animate={play ? { opacity: 1 } : { opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25, ease: EASE }}
            >
              REDSHIFT
            </motion.text>
            <motion.path
              d="M 160 88 L 160 108 L 70 108 L 70 130"
              fill="none"
              stroke="#0f766e"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={play ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
            />
            <motion.path
              d="M 160 88 L 160 108 L 250 108 L 250 130"
              fill="none"
              stroke="currentColor"
              className="text-slate-400"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={play ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
            />
            <motion.g initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : { opacity: 1 }} transition={{ delay: 0.75, duration: 0.45 }}>
              <text x="70" y="148" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0f766e">
                SERVING
              </text>
              <text x="250" y="148" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">
                ANALYTICS
              </text>
            </motion.g>
          </svg>

          <div className="mt-2 grid grid-cols-2 gap-6 text-[11px] leading-snug text-slate-700 dark:text-slate-300">
            <motion.ul
              className="space-y-0.5 lg:text-right"
              initial={{ opacity: 0 }}
              animate={play ? { opacity: 1 } : { opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.45 }}
            >
              {fork.left.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </motion.ul>
            <motion.ul
              className="space-y-0.5"
              initial={{ opacity: 0 }}
              animate={play ? { opacity: 1 } : { opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.45 }}
            >
              {fork.right.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </motion.ul>
          </div>
          <motion.p
            className="mt-5 text-center text-[11px] font-bold uppercase tracking-[0.32em] text-teal-900 dark:text-teal-300 lg:text-right"
            initial={{ opacity: 0, y: 8 }}
            animate={play ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.5, ease: EASE }}
          >
            {fork.bottom}
          </motion.p>
        </div>
      </div>
    </header>
  );
}

function Metric60K() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(reduced ? 60 : 0);

  useEffect(() => {
    if (reduced || !inView) return;
    const target = 60;
    const start = performance.now();
    const dur = 650;
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      setDisplay(Math.round(target * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced]);

  return (
    <p ref={ref} className="text-[clamp(4rem,14vw,7.5rem)] font-semibold leading-none tracking-tighter text-slate-950 dark:text-white">
      {display}K
    </p>
  );
}

/** 2. Signal */
export function SignalSection() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Section aria-label="What triggered the investigation?">
      <div ref={ref}>
        <Metric60K />
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">{C.signal.metricLabel}</p>

        <div className="mt-12 overflow-x-auto pb-2">
          <div className="flex min-w-max items-center gap-2 md:min-w-0 md:flex-wrap md:gap-3">
            {C.signal.nodes.map((node, i) => (
              <React.Fragment key={node.id}>
                <motion.span
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-wide",
                    node.emphasis ? "text-teal-900 dark:text-teal-300" : "text-slate-900 dark:text-white"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView && !reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.1, ease: EASE }}
                >
                  {node.sub ? `${node.label} ${node.sub}` : node.label}
                </motion.span>
                {i < C.signal.nodes.length - 1 ? (
                  <span className="text-slate-400" aria-hidden>
                    →
                  </span>
                ) : null}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-12 max-w-md border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{C.signal.serviceTotal}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{C.signal.costNote}</p>
          <div className="relative mt-4 aspect-[16/9] w-full max-w-[200px] opacity-90">
            <Image src={OLAP_COST_EVIDENCE_IMAGE} alt={C.signal.costImageAlt} fill className="object-contain object-left" sizes="200px" />
          </div>
        </div>
      </div>
    </Section>
  );
}

/** 3. Mismatch */
export function MismatchSection() {
  const { fork } = C.mismatch;
  const reduced = useReducedMotion();

  return (
    <Section aria-labelledby="olap-mismatch">
      <motion.div {...fadeUp(reduced)}>
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-600 dark:text-slate-400">{C.mismatch.pre}</p>
        <h2 id="olap-mismatch" className="mt-4 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-semibold uppercase leading-[1.05] tracking-tight text-slate-950 dark:text-white">
          {C.mismatch.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">{C.mismatch.summary}</p>
      </motion.div>

      <motion.div className="mx-auto mt-14 max-w-md text-center" {...fadeUp(reduced, 0.12)}>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">One engine</p>
        <p className="mt-4 text-2xl font-semibold uppercase tracking-tight text-slate-950 dark:text-white">{fork.hub}</p>
        <div className="mt-8 grid grid-cols-2 gap-8 text-left text-sm">
          <div>
            <p className="text-[10px] font-bold uppercase text-teal-800 dark:text-teal-400">Serving</p>
            <ul className="mt-2 space-y-1 text-slate-800 dark:text-slate-200">
              {fork.left.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500">Analytics</p>
            <ul className="mt-2 space-y-1 text-slate-800 dark:text-slate-200">
              {fork.right.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

function fastestKey(row) {
  const nums = BENCHMARK_ENGINES.map((e) => ({ key: e.key, n: workloadNumeric(row[e.key]) })).filter((x) => x.n != null);
  if (nums.length < 2) return null;
  const min = Math.min(...nums.map((x) => x.n));
  return nums.find((x) => x.n === min)?.key;
}

/** 4. Benchmark + insight checkpoint */
export function BenchmarkSection() {
  const reduced = useReducedMotion();

  return (
    <Section aria-labelledby="olap-bench">
      <motion.div {...fadeUp(reduced)}>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{C.benchmark.pre}</p>
        <h2 id="olap-bench" className="mt-2 text-[clamp(1.35rem,3vw,2rem)] font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white">
          {C.benchmark.headline}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-x-6 text-[11px] text-slate-500">
          {C.benchmark.config.map((cfg) => (
            <li key={cfg}>{cfg}</li>
          ))}
        </ul>
      </motion.div>

      <motion.div className="mt-10 w-full overflow-x-auto" {...fadeUp(reduced, 0.08)}>
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-slate-900 dark:border-slate-100">
              <th className="pb-3 pr-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Workload</th>
              {BENCHMARK_ENGINES.map((e) => (
                <th key={e.key} className="pb-3 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {e.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {C.benchmark.rows.map((row, i) => {
              const fast = fastestKey(row);
              return (
                <tr key={`${row.workload}-${i}`} className="border-b border-slate-200 dark:border-slate-800">
                  <td className="py-3.5 pr-4 text-sm font-semibold text-slate-900 dark:text-white">{row.workload}</td>
                  {BENCHMARK_ENGINES.map((e) => (
                    <td
                      key={e.key}
                      className={cn(
                        "py-3.5 px-3 text-sm tabular-nums",
                        fast === e.key ? "font-semibold text-teal-900 dark:text-teal-300" : "text-slate-700 dark:text-slate-300"
                      )}
                    >
                      {row[e.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      <motion.div className="mx-auto mt-16 max-w-2xl text-center" {...fadeUp(reduced, 0.15)}>
        <p className="text-2xl font-semibold uppercase tracking-tight text-slate-950 dark:text-white md:text-3xl">{C.benchmark.verdict}</p>
        <p className="mt-4 text-sm font-medium uppercase tracking-[0.1em] text-slate-600 dark:text-slate-400">{C.benchmark.closing}</p>
      </motion.div>
    </Section>
  );
}

/** 5. Architecture centerpiece — before/after animated */
export function ArchitectureSection() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const play = inView && !reduced;
  const { fork } = C.mismatch;

  return (
    <Section aria-labelledby="olap-arch" className="py-20 md:py-28">
      <motion.div {...fadeUp(reduced)}>
        <Eyebrow>{C.architecture.eyebrow}</Eyebrow>
        <h2 id="olap-arch" className="mt-3 max-w-3xl text-[clamp(1.35rem,3.2vw,2rem)] font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white">
          {C.architecture.headline.join(" ")}
        </h2>
      </motion.div>

      <div ref={ref} className="relative mx-auto mt-14 w-full max-w-3xl">
        <svg viewBox="0 0 600 320" className="mx-auto hidden w-full md:block" aria-label="Before and after architecture">
          {/* BEFORE */}
          <motion.g initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : { opacity: 1 }} transition={{ duration: 0.5 }}>
            <text x="300" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">
              BEFORE
            </text>
            <text x="300" y="52" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor" className="text-slate-800">
              APPLICATION
            </text>
            <line x1="300" y1="58" x2="300" y2="78" stroke="#94a3b8" strokeWidth="1" />
            <motion.rect
              x="250"
              y="82"
              width="100"
              height="28"
              fill="none"
              stroke="currentColor"
              className="text-slate-800"
              strokeWidth="1.5"
              initial={{ opacity: 0 }}
              animate={play ? { opacity: 1 } : { opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            />
            <text x="300" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor" className="text-slate-900">
              REDSHIFT
            </text>
          </motion.g>

          {/* AFTER split */}
          <motion.path
            d="M 300 130 L 300 155 L 150 155 L 150 185"
            fill="none"
            stroke="#0f766e"
            strokeWidth="1.25"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={play ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.55, ease: EASE }}
          />
          <motion.path
            d="M 300 130 L 300 155 L 450 155 L 450 185"
            fill="none"
            stroke="#64748b"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={play ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.55, ease: EASE }}
          />
          <motion.g initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : { opacity: 1 }} transition={{ delay: 0.95, duration: 0.45 }}>
            <text x="300" y="148" textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">
              AFTER
            </text>
            <text x="150" y="178" textAnchor="middle" fontSize="8" fontWeight="600" fill="#0f766e">
              SERVING PATH
            </text>
            <text x="150" y="200" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f766e">
              DYNAMODB
            </text>
            <text x="450" y="178" textAnchor="middle" fontSize="8" fontWeight="600" fill="#64748b">
              ANALYTICS PATH
            </text>
            <text x="450" y="200" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
              S3 TABLES
            </text>
            <line x1="450" y1="208" x2="450" y2="228" stroke="#94a3b8" strokeWidth="1" />
            <text x="450" y="246" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">
              ATHENA / PRESTO
            </text>
            <line x1="450" y1="252" x2="450" y2="272" stroke="#94a3b8" strokeWidth="1" />
            <text x="450" y="288" textAnchor="middle" fontSize="9" fontWeight="700" fill="#475569">
              BI / ANALYTICS
            </text>
          </motion.g>
        </svg>

        <div className="md:hidden">
          <p className="text-center text-[10px] font-bold uppercase text-slate-500">Before → After</p>
          <p className="mt-4 text-center text-sm font-bold uppercase">{fork.hub}</p>
          <p className="mt-6 text-center text-[10px] uppercase text-teal-800">Serving path → DynamoDB</p>
          <p className="mt-2 text-center text-[10px] uppercase text-slate-600">Analytics → S3 Tables → Athena / Presto → BI</p>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-4 text-center text-sm md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
        <div className="md:text-right">
          <p className="text-[10px] font-bold uppercase text-slate-500">Before</p>
          <p className="mt-1 font-semibold uppercase">{fork.hub}</p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {fork.left.title} + {fork.right.title.toLowerCase()}
          </p>
        </div>
        <span className="text-2xl text-teal-800 dark:text-teal-400" aria-hidden>
          →
        </span>
        <div className="md:text-left">
          <p className="text-[10px] font-bold uppercase text-teal-800 dark:text-teal-400">After</p>
          <p className="mt-1 font-semibold uppercase">Workload-specific architecture</p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Serving → DynamoDB · Analytics → S3 Tables → Athena / Presto</p>
        </div>
      </div>
      <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">PoC — not production migration</p>
    </Section>
  );
}

/** 6. Trade-offs */
export function TradeoffsSection() {
  const reduced = useReducedMotion();
  const cols = C.decision.tradeoffs;

  return (
    <Section aria-labelledby="olap-tradeoffs">
      <motion.div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-8" {...fadeUp(reduced)}>
        {cols.map((t) => (
          <div key={t.engine} className="border-t border-slate-300 pt-5 dark:border-slate-700">
            <p className="text-lg font-bold text-slate-950 dark:text-white">{t.engine}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-teal-800 dark:text-teal-400">{t.role}</p>
            <ul className="mt-4 space-y-1 text-sm text-slate-800 dark:text-slate-200">
              {t.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Trade-off: </span>
              {t.tradeoff}
            </p>
          </div>
        ))}
      </motion.div>
      <p className="mt-12 text-center text-sm font-semibold uppercase tracking-tight text-slate-950 dark:text-white">
        {C.decision.headline.join(" ")}
      </p>
    </Section>
  );
}

/** 7. Open questions — compact note */
export function OpenQuestionsSection() {
  return (
    <div className="border-t border-slate-200 py-8 dark:border-slate-800">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Still open</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{C.decision.stillOpen.join(" · ")}</p>
    </div>
  );
}

/** 8. Conclusion — center aligned */
export function ConclusionSection() {
  const reduced = useReducedMotion();

  return (
    <Section className="py-24 text-center md:py-32">
      <motion.p
        className="mx-auto max-w-2xl text-sm font-semibold uppercase leading-relaxed tracking-tight text-slate-500 dark:text-slate-400 sm:text-base"
        {...fadeUp(reduced)}
      >
        {C.final.line1.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </motion.p>
      <motion.p
        className="mx-auto mt-8 max-w-3xl text-[clamp(1.5rem,4vw,2.5rem)] font-semibold uppercase leading-snug tracking-tight text-slate-950 dark:text-white"
        {...fadeUp(reduced, 0.1)}
      >
        {C.final.line2.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </motion.p>
      <motion.p className="mx-auto mt-8 max-w-lg text-sm text-slate-600 dark:text-slate-400" {...fadeUp(reduced, 0.18)}>
        {C.benchmark.closing}
      </motion.p>
    </Section>
  );
}
