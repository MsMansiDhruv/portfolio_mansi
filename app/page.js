"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import ArchSceneWrapper from "../components/ArchSceneWrapper";
import SystemOverview from "../components/SystemOverview";
import GpuSparks from "../components/GpuSparks";
import TerminalIntro from "../components/TerminalIntro";
import ActivityStats from "../components/ActivityStats";

/* PROFESSIONAL TIMELINE COMPONENT (markers open modal) */
function ProfessionalTimeline({ items = [] }) {
  const [openIdx, setOpenIdx] = useState(null);
  const lastFocusedRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && openIdx !== null) setOpenIdx(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx]);

  useEffect(() => {
    if (openIdx !== null && modalRef.current) {
      modalRef.current.focus();
    } else if (openIdx === null && lastFocusedRef.current) {
      lastFocusedRef.current.focus();
    }
  }, [openIdx]);

  if (!items || items.length === 0) return null;

  // Manual left positions (adjust percentages to align with your cards)
  const positions = ["1%", "26.2%", "51.5%", "77%"];

  return (
    <div className="mt-1">
      {/* <h3 style={{ margin: 0, marginBottom: 10, color: "var(--text-color)", fontSize: "1.05rem", fontWeight: 700 }}>
        My Professional Journey
      </h3> */}

      <div className="relative w-full pt-10 pb-4">
        {/* dotted rail (desktop) */}
        <div
          className="hidden md:block absolute left-0 right-0 top-6 h-[4px] rounded-full overflow-hidden"
          aria-hidden="true"
          style={{ background: "var(--color-bg-timeline-rail)" }}
        >
          <div
            style={{
              height: "100%",
              width: "200%",
              background: "repeating-radial-gradient(circle at 0 50%, rgba(46,196,182,0.85) 0 1px, transparent 1px 12px)",
              backgroundSize: "24px 4px",
              animation: "dotScroll var(--dot-speed, 5s) linear infinite",
              opacity: 0.95,
            }}
          />
        </div>

        {/* bullets (manual positions) */}
        <div className="hidden md:block absolute left-0 right-0 top-6">
          <div className="relative w-full h-0">
            {items.map((it, i) => {
              const left = positions[i] ?? `${(i / (items.length - 1)) * 100}%`;
              return (
                <div
                  key={it.year}
                  className="group absolute"
                  style={{ left, transform: "translate(-50%, -50%)" }}
                >
                  <button
                    ref={(el) => {
                      if (el && i === openIdx) lastFocusedRef.current = el;
                    }}
                    onClick={(e) => {
                      lastFocusedRef.current = e.currentTarget;
                      setOpenIdx(i);
                    }}
                    aria-haspopup="dialog"
                    aria-expanded={openIdx === i}
                    aria-label={`${it.year} — ${it.title}`}
                    className="timeline-bullet"
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      boxShadow: "0 0 10px rgba(46,196,182,0.35)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      display: "inline-block",
                      transition: "transform 180ms ease, box-shadow 180ms ease",
                    }}
                  />
                  <span
                    className="sine-aura"
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: 36,
                      height: 36,
                      transform: "translate(-50%,-50%)",
                      borderRadius: "50%",
                      pointerEvents: "none",
                      opacity: 0,
                      transition: "opacity 160ms ease",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* timeline cards */}
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-6">
          {items.map((it) => (
            <div key={it.year} className="flex flex-col md:w-1/4 text-left">
              <span className="text-xs text-slate-500 dark:text-slate-400">{it.year}</span>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mt-1">{it.title}</div>
              <p className="text-xs mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">{it.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {openIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${items[openIdx].year} details`}
          tabIndex={-1}
          ref={modalRef}
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{ background: "rgba(2,6,23,0.45)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenIdx(null);
          }}
        >
          <div
            className="max-w-xl w-full rounded-xl p-6"
            style={{
              background: "rgba(17,24,39,0.92)",
              border: "1px solid var(--card-border)",
              boxShadow: "0 12px 40px rgba(2,6,23,0.5)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{items[openIdx].year}</div>
                <h4 style={{ marginTop: 6, marginBottom: 6, color: "var(--text-color)" }}>{items[openIdx].title}</h4>
                <div style={{ color: "var(--muted-color)", fontSize: 14, lineHeight: 1.6 }}>
                  {items[openIdx].summary}
                </div>
              </div>

              <div style={{ marginLeft: "auto" }}>
                <button
                  onClick={() => setOpenIdx(null)}
                  aria-label="Close"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--muted-color)",
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {items[openIdx].details && (
              <div className="mt-4">
                <ul className="ml-4 list-disc text-sm" style={{ color: "var(--muted-color)" }}>
                  {items[openIdx].details.map((d, idx) => (
                    <li key={idx} style={{ marginBottom: 6 }}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <a
                href="/projects"
                className="px-3 py-2 rounded bg-primary text-black font-semibold text-sm"
              >
                View projects
              </a>
              <button
                onClick={() => setOpenIdx(null)}
                className="px-3 py-2 rounded border font-medium text-sm"
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes dotScroll {
          0% { background-position: 0 0; }
          100% { background-position: 24px 0; }
        }

        .sine-aura {
          background: radial-gradient(circle at 30% 30%, rgba(46,196,182,0.12), rgba(46,196,182,0.06) 40%, transparent 60%);
          transform: scale(0.95);
          animation: aura-pulse 1.6s ease-in-out infinite;
        }

        @keyframes aura-pulse {
          0% { transform: scale(0.92); opacity: 0.0; }
          40% { transform: scale(1.05); opacity: 0.55; }
          80% { transform: scale(0.98); opacity: 0.28; }
          100% { transform: scale(0.92); opacity: 0.0; }
        }

        .group:hover .sine-aura { opacity: 1; }
        .timeline-bullet:hover { transform: scale(1.22); box-shadow: 0 0 18px rgba(46,196,182,0.55); }

        @media (prefers-reduced-motion: reduce) {
          .sine-aura, [style*="animation: aura-pulse"], [style*="animation: dotScroll"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ------------------ PAGE: Home ------------------ */
export default function Home() {
  const [isDay, setIsDay] = useState(false);

  function detectExternalDay() {
    try {
      const de = document.documentElement;
      const dt = de.dataset.theme || de.getAttribute("data-theme");
      if (dt && ["day", "light"].includes(dt.toLowerCase())) return true;

      const body = document.body;
      const dayClasses = ["day", "light", "theme-day", "theme-light", "is-day"];
      return dayClasses.some((c) => body.classList.contains(c) || de.classList.contains(c));
    } catch {
      return false;
    }
  }

  useEffect(() => {
    setIsDay(detectExternalDay());
    const target = document.documentElement;

    const mo = new MutationObserver(() => setIsDay(detectExternalDay()));
    mo.observe(target, { attributes: true, attributeFilter: ["class", "data-theme"] });
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => mo.disconnect();
  }, []);

  // ----- data passed to SystemOverview (unchanged) -----
  const capabilities = [
    {
      title: "Scale & Reliability",
      desc: "Design and delivery of datamarts, partitioning, query-friendly schemas, SLA-driven alerts and capacity planning. Systems engineered to scale with predictable costs.",
    },
    {
      title: "Automation & Operability",
      desc: "Infrastructure-as-code (Terraform), repeatable CI/CD, runbooks and automated rollback strategies to reduce manual toil and shorten incident recovery.",
    },
    {
      title: "Data Governance & Quality",
      desc: "Proven data lineage, authoritative sinks, observability and automated data quality checks integrated into pipelines.",
    },
    {
      title: "Production ML & Model Delivery",
      desc: "Reproducible training pipelines, model versioning and monitoring hooks so models are audited, validated and safely deployed.",
    },
    {
      title: "Cost-Conscious Architecture",
      desc: "Cloud-native patterns and cost-aware design (storage/compute rightsizing, spot usage, effective partitioning) to keep run costs predictable.",
    },
  ];

  const highlights = [
    {
      id: "tata-amc",
      title: "Customer 360 — Tata AMC",
      summary: "End-to-end datamart: ingestion, modeling and SLA-driven reporting.",
      details: [
        "Scope: Designed customer360 datamart and event-driven ingestion pipelines on Databricks.",
        "Implementation: OLAP-friendly modeling, Delta/Parquet storage with partitioning and automated daily pipelines.",
        "Impact: Improved cross-product reporting performance; established monitoring & SLA alerts for data freshness.",
      ],
    },
    {
      id: "nbcu",
      title: "NBCU / Peacock — Data platform support",
      summary: "Repeatable CI/CD and deployment automation for analytics pipelines.",
      details: [
        "Scope: Automated deployment pipeline templates, artifact versioning and rollback mechanisms.",
        "Implementation: GitOps-style pipelines, release gates and runbooks for safe production rollout.",
        "Impact: Reduced deployment failures and shortened recovery time during incidents.",
      ],
    },
    {
      id: "production-ml",
      title: "Production ML Pipelines",
      summary: "Model versioning, reproducibility and monitoring for production models.",
      details: [
        "Scope: Training pipelines with reproducible environments and dataset versioning.",
        "Implementation: Scheduled training flows, model registry integration and drift detectors.",
        "Impact: Lowered model-regression risk and faster path from validation to production.",
      ],
    },
    {
      id: "nvidia-oss",
      title: "NVIDIA-aligned open-source & tooling",
      summary: "Contributions and experiments focused on GPU-accelerated data patterns.",
      details: [
        "Scope: Experiments and lightweight tool prototypes for GPU-accelerated processing.",
        "Implementation: Reproducible microbenchmarks and packaging prototypes for sharing.",
        "Impact: Demonstrates compute-efficient approaches for GPU-friendly pipelines (early-stage work).",
      ],
    },
  ];

  const outcomes = [
    { label: "99.95%", desc: "Pipeline reliability (targeted systems)" },
    { label: "30%+", desc: "Query speedups via schema + partitioning" },
    { label: "SLA-driven", desc: "Automated freshness & alerting across pipelines" },
    { label: "Repeatable", desc: "IaC patterns, CI/CD templates and runbooks" },
  ];

  // theme CSS vars
  const rootVars = {
    "--text-color": isDay ? "#0f172a" : "#e6eefb",
    "--muted-color": isDay ? "#4b5563" : "#9aa7bf",
    "--accent": "#2EC4B6",
    "--accent-soft": "#D6FBF6",
    "--card-bg": isDay ? "rgba(255,255,255,0.95)" : "rgba(17,24,39,0.8)",
    "--card-border": isDay ? "rgba(46,196,182,0.14)" : "rgba(46,196,182,0.14)",
  };

  return (
    <section style={rootVars}>
      <div className="relative">
        <GpuSparks />

        {/* FULL-WIDTH GUTTERED WRAPPER (aligns with header/footer) */}
        <div className="w-full px-4 md:px-6 lg:px-8">
          {/* RESPONSIVE GRID: single column on mobile, left content + fixed sidebar on md+ */}
          <div className="w-full grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            {/* MAIN COLUMN (LEFT) */}
            <div>
              <div className="relative w-full flex flex-col gap-8 text-left">
                {/* TerminalIntro (unchanged) */}
                <TerminalIntro text="Mansi Dhruv" />

                {/* Headline + CTA (CTA stacks under headline for small screens) */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                  <div className="md:flex-1">
                    <h1
                      className="font-extrabold"
                      style={{
                        color: "var(--text-color)",
                        fontSize: "2rem",
                        lineHeight: 1.04,
                        letterSpacing: 0.4,
                        margin: 0,
                      }}
                    >
                      Solutions Architect - Cloud-native systems & production data platforms
                    </h1>

                    <div
                      style={{
                        marginTop: 14,
                        display: "block",
                        background: isDay
                          ? "linear-gradient(90deg, rgba(46,196,182,0.02), transparent)"
                          : "linear-gradient(90deg, rgba(46,196,182,0.01), transparent)",
                        padding: "12px 14px",
                        borderRadius: 8,
                        boxSizing: "border-box",
                        maxWidth: "100%",
                      }}
                    >
                      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 6,
                            height: 80,
                            borderRadius: 6,
                            background: "linear-gradient(180deg,var(--accent), var(--accent-soft))",
                            boxShadow: "0 3px 8px rgba(46,196,182,0.08)",
                          }}
                        />
                        <p
                          style={{
                            margin: 0,
                            color: "var(--muted-color)",
                            fontSize: "1rem",
                            lineHeight: 1.7,
                            textAlign: "left",
                          }}
                        >
                          <i>
                            Hello! <br />
                            I design modern data platforms with a focus on clean architecture, automated workflows, and reliability at scale. I enjoy turning complex requirements into straightforward, maintainable systems.
                          </i>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA: stays to the right on md+ */}
                  <div className="flex-shrink-0 mt-4 md:mt-0">
                    <div className="flex flex-wrap gap-3">
                      <Link href="/projects" className="px-4 py-2 rounded bg-primary text-black font-semibold text-sm">
                        Explore Projects
                      </Link>
                      <Link
                        href="/tools"
                        className={`px-4 py-2 rounded border font-medium text-sm ${isDay ? "border-slate-300 text-slate-800 bg-white/30" : "border-slate-700 text-slate-200 bg-slate-900/10"
                          }`}
                      >
                        Toolkit
                      </Link>
                    </div>
                  </div>
                </div>

                {/* My Story (left aligned) */}
                <div>
                  <h3 style={{ margin: 0, marginBottom: 8, color: "var(--text-color)", fontSize: "1.05rem", fontWeight: 700 }}>
                    My Professional Journey
                  </h3>
                  <div style={{ marginTop: 10, color: "var(--muted-color)", fontSize: "1.02rem", lineHeight: 1.75 }}>
                    <p style={{ marginTop: 0 }}>
                      I build reliable, production-ready data systems by pairing clear architecture with practical, hands-on engineering. The focus is always on creating designs that are easy to operate, automate, and scale over time.
                    </p>
                    <p style={{ marginTop: 14 }}>
                      I lean toward solutions that balance simplicity, observability, and cost-awareness. Whether it’s shaping a datamart, defining ingestion patterns, or building infrastructure-as-code workflows, the goal remains the same-deliver systems that behave predictably and create measurable impact.
                    </p>
                  </div>
                </div>

                {/* Timeline (component) */}
                <ProfessionalTimeline
                  items={[
                    {
                      year: "2019",
                      title: "Backend Engineer - Foundations",
                      summary:
                        "Started building backend services, APIs and core system components - gaining strong fundamentals in distributed systems and design.",
                      details: [
                        "Focused on backend architecture, API design and distributed systems.",
                        "Built microservices and API integrations used by product teams.",
                      ],
                    },
                    {
                      year: "2021",
                      title: "Data Engineer - The Shift",
                      summary:
                        "Transitioned into data engineering: built ingestion pipelines, ETL/ELT flows and cloud-native data workflows.",
                      details: [
                        "Designed ingestion and transformation pipelines (Delta/Parquet).",
                        "Implemented partitioning and query-friendly schemas for reporting.",
                      ],
                    },
                    {
                      year: "2023",
                      title: "Senior Data Engineer - Production",
                      summary:
                        "Led production-grade data workflows and ML pipelines. Improved observability and CI/CD patterns across platforms.",
                      details: [
                        "Introduced CI/CD and runbooks for reliable rollouts.",
                        "Worked on model delivery and reproducibility initiatives.",
                      ],
                    },
                    {
                      year: "2025",
                      title: "Lead Data Engineer - Architecture",
                      summary:
                        "Driving architecture, design scalable low cost secure solutions, data engineering, mlops pipelines and GPU-acceleration work",
                      details: [
                        "Driving architecture and mentoring engineers.",
                        "Focused on delivering reliable data platforms at scale.",
                      ],
                    },
                  ]}
                />

                {/* small footer note / summary under timeline */}
                {/* <div className="mt-4 text-xs text-slate-600 dark:text-slate-400">
                  I also help teams with architecture reviews and targeted solution consulting - offering clear, practical guidance on scalability, reliability, and cost-efficient data design.
                </div> */}

                {/* small visual separator */}
                <div style={{ height: 1, background: isDay ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.02)", marginTop: 12 }} />

              </div>
            </div>

            {/* RIGHT: aside / SystemOverview */}
            <aside
              className={`
                backdrop-blur-sm p-5 rounded-xl shadow-sm opacity-0 animate-fadeUp
                border
                ${isDay ? "bg-white/80 border-slate-200" : "bg-slate-800/70 border-slate-700"}
              `}
              style={{ animationDelay: "700ms", position: "relative" }}
            >
              <div className="absolute inset-0 rounded-xl bg-primary/10 blur-xl opacity-20 pointer-events-none"></div>
              <SystemOverview isDay={isDay} capabilities={capabilities} highlights={highlights} outcomes={outcomes} />
              <ActivityStats isDay={isDay} />

            </aside>
          </div>
        </div>

        {/* BOTTOM 3D SECTION */}
        <div className="mt-20 h-96 bg-transparent">
          <ArchSceneWrapper />
        </div>
      </div>
    </section>
  );
}
