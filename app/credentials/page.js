// app/credentials/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import Testimonials from "../../components/Testimonials";
import AwardsList from "../../components/AwardsList";
import GpuSparks from "../../components/GpuSparks";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const ACCENT = "var(--color-accent)";

const DEFAULT_CERTS = [
  { id: "sql-data", title: "SQL for Data Analysis and Data Science", org: "Udemy", year: 2024, link: "https://www.udemy.com/certificate/UC-a6a6cbcf-d2b6-4b93-925e-0bcf1e777205/" },
  { id: "aws-clf", title: "AWS Certified Cloud Practitioner (CLF)", org: "AWS", year: 2023, link: "https://cp.certmetrics.com/amazon/en/public/verify/credential/" },
  { id: "etl", title: "Building Your First ETL Pipeline Using Azure Databricks", org: "Pluralsight", year: 2022 },
  { id: "spark-bigdata", title: "Big Data Analytics using Spark", org: "edX", year: 2021 },
  { id: "ml-python", title: "Machine Learning using Python", org: "Udemy", year: 2020, link: "https://www.udemy.com/certificate/UC-98742817-dfc1-415d-be88-c70c692ff871/" },
  { id: "docker-ess", title: "Docker Essentials", org: "Udemy", year: 2019, link: "https://www.udemy.com/certificate/UC-XNDH2JI1/" },
  { id: "big-data", title: "Big Data Training", org: "Udemy", year: 2018, link: "https://www.udemy.com/certificate/UC-X0AU2IFK/" },
];

/* storage keys used across the app */
const AWARDS_KEY = "mansi_awards_v1";
const TESTS_KEY = "mansi_full_testimonials_v1";

/* initial awards shown on the page (kept as the single source of truth for page fallback) */
const INITIAL_AWARDS = [
  {
    id: "value-able-2024",
    title: "Value-able Award",
    org: "SG Analytics",
    year: "Jul 2024",
    summary:
      "Played pivotal role in establishing the foundation for a client. This instilled confidence in client leading them to bring new business.",
    sourceUrl: "https://ca.linkedin.com/in/mansidhruv/details/honors-awards/",
  },
  {
    id: "gem-2023",
    title: "GEM Award",
    org: "SG Analytics",
    year: "Mar 2023",
    summary:
      "Received GEM Award for delivering exceptional business value while going extra mile for customer satisfaction.",
    sourceUrl: "https://ca.linkedin.com/in/mansidhruv/details/honors-awards/",
  },
  {
    id: "merit-2019",
    title: "Merit Based Scholarship",
    org: "AESICS",
    year: "Sep 2019",
    summary:
      "Received a full-year Merit-Based Scholarship in recognition of outstanding academic performance for 2019–2020.",
    sourceUrl: "https://ca.linkedin.com/in/mansidhruv/details/honors-awards/",
  },
  {
    id: "innovative-project-2018",
    title: 'Special mention - "Innovative Project"',
    org: "ACM-W Third National Level Hackathon",
    year: "Oct 2018",
    summary:
      'Awarded Special mention for “Innovative Project” in ACM-W Third National Level Hackathon.',
    sourceUrl: "https://ca.linkedin.com/in/mansidhruv/details/honors-awards/",
  },
  {
    id: "ghci-2018",
    title: "Student Scholarship - Grace Hopper Celebrations India",
    org: "Grace Hopper Celebrations India",
    year: "Oct 2018",
    summary:
      "Awarded Student Scholarship from Grace Hopper Celebrations India (GHCI – 18).",
    sourceUrl: "https://ca.linkedin.com/in/mansidhruv/details/honors-awards/",
  },
];

// Sidebar data
const timeline = [
  {
    id: 't1',
    year: '2025',
    title: 'Lead Data Engineer',
    desc: 'Led a cross-functional data team, owning architecture decisions and mentoring four engineers across delivery and design.'
  },
  {
    id: 't2',
    year: '2023',
    title: 'Senior Data Engineer',
    desc: 'Drove end-to-end data initiatives, collaborating with product and analytics while guiding junior engineers.'
  },
  {
    id: 't3',
    year: '2021',
    title: 'Data Engineer',
    desc: 'Transitioned into data engineering, building scalable pipelines using Databricks, PySpark, and cloud data platforms.'
  },
  {
    id: 't4',
    year: '2019',
    title: 'Software Engineer',
    desc: 'Developed web and backend systems with a focus on high-reliability payment gateway integrations.'
  },
  {
    id: 't5',
    year: '2018',
    title: 'Intern',
    desc: 'Built iOS and web applications for Bemrr and Gujarat Police, gaining hands-on experience in production systems.'
  }
];

const skills = {
  "System Design": 3,
  Python: 8,
  SQL: 8,
  Spark: 7,
  Terraform: 6,
  AWS: 7,
  Docker: 5,
  PySpark: 6
};

/* safe JSON parse */
function safeParse(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}

/* ---------- CountNumber (animated) ---------- */
function CountNumber({ value = 0, duration = 700, className = "" }) {
  const [display, setDisplay] = React.useState(0);
  const prefersReduced = useReducedMotion();

  React.useEffect(() => {
    if (prefersReduced || typeof value !== "number") {
      setDisplay(value);
      return;
    }
    let start = null;
    let raf = null;

    function step(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(1, elapsed / duration);
      const current = Math.round(progress * value);
      setDisplay(current);
      if (progress < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, prefersReduced]);

  return <span className={className}>{display}</span>;
}

/* ---------- Timeline item (inline-friendly) ---------- */
function TimelineRow({ ev }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-sm font-semibold border"
             style={{ borderColor: 'rgba(46,196,182,0.08)' }}>
          {ev.year}
        </div>
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-900 dark:text-white">{ev.title}</div>
        <div className="text-xs text-slate-500 dark:text-slate-300 mt-1">{ev.desc}</div>
      </div>
    </div>
  );
}

/* ----------------------------- Animated SkillsRadar ----------------------------- */
function SkillsRadar({ data = {}, size = 320, levels = 4 }) {
  const keys = Object.keys(data);
  const values = keys.map((k) => Number(data[k] || 0));
  const max = Math.max(...values, 1);

  const PAD = 52;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) - PAD;
  const angleStep = (Math.PI * 2) / Math.max(keys.length, 1);

  const polygonPoints = values
    .map((v, i) => {
      const ratio = v / max;
      const angle = -Math.PI / 2 + i * angleStep;
      const x = cx + Math.cos(angle) * r * ratio;
      const y = cy + Math.sin(angle) * r * ratio;
      return `${x},${y}`;
    })
    .join(" ");

  const levelPolygons = Array.from({ length: levels }, (_, li) => {
    const levelR = r * ((li + 1) / levels);
    const pts = keys
      .map((_, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        const x = cx + Math.cos(angle) * levelR;
        const y = cy + Math.sin(angle) * levelR;
        return `${x},${y}`;
      })
      .join(" ");
    return pts;
  });

  const LABEL_OFFSET = 18 + Math.min(18, Math.max(0, r * 0.04));
  const prefersReduced = useReducedMotion();

  const polygonPairs = polygonPoints ? polygonPoints.split(" ").map((pt) => {
    const [x, y] = pt.split(",").map(Number);
    return { x, y };
  }) : [];
  let perimeter = 0;
  if (polygonPairs.length > 1) {
    for (let i = 0; i < polygonPairs.length; i++) {
      const a = polygonPairs[i];
      const b = polygonPairs[(i + 1) % polygonPairs.length];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      perimeter += Math.hypot(dx, dy);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-lg p-4 bg-white dark:bg-slate-800/60 shadow-sm border"
      style={{ borderColor: 'rgba(46,196,182,0.06)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Skills radar</h3>
          <div className="text-xs text-slate-500 dark:text-slate-300 mt-1">My core technical strengths (relative).</div>
        </div>
      </div>

      <div className="flex justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: 'visible' }}
          role="img"
          aria-label="Skills radar chart"
        >
          <defs>
            <linearGradient id="radarAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--site-accent, #2EC4B6)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--site-accent, #2EC4B6)" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {levelPolygons.map((pts, i) => (
            <polygon key={i} points={pts} fill="none" stroke="var(--radar-grid, rgba(15,23,42,0.06))" strokeWidth={1} />
          ))}

          {keys.map((k, i) => {
            const angle = -Math.PI / 2 + i * angleStep;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            return <line key={k} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--radar-grid, rgba(15,23,42,0.06))" strokeWidth={1} />;
          })}

          {keys.length > 0 && (
            <>
              <motion.polygon
                points={polygonPoints}
                fill="none"
                stroke="var(--site-accent, #2EC4B6)"
                strokeWidth={2}
                initial={prefersReduced ? {} : { strokeDashoffset: perimeter, strokeDasharray: perimeter, opacity: 0.95 }}
                animate={prefersReduced ? {} : { strokeDashoffset: 0, opacity: 1 }}
                transition={prefersReduced ? {} : { duration: 0.9, ease: "easeOut" }}
              />

              <motion.polygon
                points={polygonPoints}
                fill="url(#radarAccent)"
                initial={prefersReduced ? { opacity: 0.14 } : { opacity: 0 }}
                animate={{ opacity: 0.14 }}
                transition={{ duration: 0.8, delay: prefersReduced ? 0 : 0.65, ease: "easeOut" }}
              />
            </>
          )}

          {keys.map((k, i) => {
            const angle = -Math.PI / 2 + i * angleStep;
            const lx = cx + Math.cos(angle) * (r + LABEL_OFFSET);
            const ly = cy + Math.sin(angle) * (r + LABEL_OFFSET);
            const cos = Math.cos(angle);
            const anchor = cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle';
            return (
              <text
                key={k}
                x={lx}
                y={ly}
                fontSize={12}
                fill="var(--radar-label, #475569)"
                textAnchor={anchor}
                alignmentBaseline="middle"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}
              >
                {k}
              </text>
            );
          })}

          <text x={cx} y={cy + 3} fontSize={10} fill="var(--radar-muted, #94a3b8)" textAnchor="middle" alignmentBaseline="middle">
            max {max}
          </text>
        </svg>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   Motion variants used around the page (subtle & accessible)
   ------------------------------------------------------------------ */
const pageContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const sectionFade = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.36 } } };
const certCard = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.36 } }, hover: { y: -6, boxShadow: "0 12px 30px rgba(14,22,34,0.08)" } };
const timelineVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };

/* ----------------------------- Main Page ----------------------------- */
export default function CredentialsPage() {
  const [awardCount, setAwardCount] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const prefersReduced = useReducedMotion();

  // read initial counts and keep them updated (merge & dedupe awards + testimonials)
  useEffect(() => {
    function normalizeArray(arr) {
      if (!Array.isArray(arr)) return [];
      return arr.filter(Boolean).map((it) => (typeof it === "object" ? it : { id: String(it), title: String(it) }));
    }

    function readCounts() {
      try {
        const aRaw = localStorage.getItem(AWARDS_KEY);
        const tRaw = localStorage.getItem(TESTS_KEY);

        const aParsed = safeParse(aRaw);
        const tParsed = safeParse(tRaw);

        const storedAwards = normalizeArray(aParsed);
        const storedTests = normalizeArray(tParsed);

        // Merge storedAwards with INITIAL_AWARDS; stored entries override defaults when id matches.
        const merged = [...(storedAwards || []), ...(INITIAL_AWARDS || [])];

        // Deduplicate by id (prefer earlier entries in merged array, i.e., storedAwards override INITIAL_AWARDS)
        const byId = new Map();
        for (const item of merged) {
          const key = item && item.id ? String(item.id) : JSON.stringify(item);
          if (!byId.has(key)) {
            byId.set(key, item);
          }
        }
        const uniqueAwards = Array.from(byId.values());

        // For testimonials, use storedTests length (you can add default testimonials merge here if desired)
        const uniqueTests = storedTests;

        setAwardCount(uniqueAwards.length);
        setTestCount(Array.isArray(uniqueTests) ? uniqueTests.length : 0);
      } catch (e) {
        // fallback
        setAwardCount((INITIAL_AWARDS || []).length);
        setTestCount(0);
      }
    }

    readCounts();

    function onStorage(e) {
      if (!e.key) return;
      if (e.key === AWARDS_KEY || e.key === TESTS_KEY) readCounts();
    }
    window.addEventListener("storage", onStorage);

    // short poll for same-tab updates that may not trigger storage event
    const id = setInterval(readCounts, 1500);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(id);
    };
  }, []);

  return (
    <motion.main
      className="w-full px-6 md:px-12 lg:px-20 xl:px-28 pt-4 pb-10"
      initial="hidden"
      animate="show"
      variants={pageContainer}
    >
      <GpuSparks />

      <motion.header className="mb-8" variants={sectionFade}>
        <h1 className="text-4xl font-bold" style={{ color: ACCENT }}>
          Credentials
        </h1>
        <p className="mt-2 text-slate-700 dark:text-slate-300 max-w-2xl">
          Certifications, Awards, and Recommendations.
        </p>
      </motion.header>

      <motion.div className="space-y-10" variants={pageContainer}>
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10">
          <div>
            <motion.section className="mb-6" variants={sectionFade}>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Certifications</h2>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    My journey of verified credentials & professional badges.
                  </p>

                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {DEFAULT_CERTS.length} total
                  </span>
                </div>
              </div>

              <motion.div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3" initial="hidden" animate="show" variants={pageContainer}>
                <AnimatePresence initial={false}>
                  {DEFAULT_CERTS.map((c, idx) => (
                    <motion.article
                      key={c.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/20 shadow-sm"
                      style={{ border: "1px solid rgba(46,196,182,0.35)" }}
                      variants={certCard}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0, y: 6 }}
                      whileHover="hover"
                      transition={{ duration: 0.32, delay: idx * 0.02 }}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-avatar-bg text-avatar-text text-sm">
                          {(() => {
                            const src = c.org || c.title || "";
                            const parts = src.split(" ").filter(Boolean);
                            if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
                            return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
                          })()}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-3">
                          <div className="min-w-0">
                            <div className="text-xs text-slate-500 dark:text-slate-300 truncate">{c.org}</div>
                            <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white truncate">{c.title}</h3>
                            {c.description && <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{c.description}</div>}
                          </div>

                          <div className="ml-auto flex flex-col items-end gap-2 min-w-fit">
                            <div className="text-xs font-medium px-2 py-0.5 rounded-md" style={{ background: "rgba(46,196,182,0.15)", color: ACCENT }}>
                              {c.year || "—"}
                            </div>
                            <div>
                              {c.url ? (
                                <a href={c.url} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: ACCENT }}>
                                  View
                                </a>
                              ) : (
                                <span className="text-xs text-slate-400"><a href={c.link}>Link</a></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.section>

            <div className="w-full my-10 h-[2px]" style={{ background: "linear-gradient(90deg, rgba(46,196,182,0.1), rgba(46,196,182,0.4), rgba(46,196,182,0.1))" }} />

            <motion.section className="mb-6" variants={sectionFade}>
              <AwardsList initialAwards={INITIAL_AWARDS} />
            </motion.section>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block flex flex-col">
            <div className="mb-6">
              <SkillsRadar data={skills} />
            </div>

            <motion.div
              className="p-6 gap-6 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 shadow-sm"
              variants={sectionFade}
              initial="hidden"
              animate="show"
              style={{ perspective: 900 }}
            >
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Summary</h4>

              <motion.div
                className="mt-4 grid grid-cols-3 gap-3 text-center"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              >
                {(() => {
                  const statVariant = {
                    hidden: { opacity: 0, y: 8, scale: 0.995 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.36, ease: "easeOut" } },
                    hover: { y: -6, boxShadow: "0 12px 30px rgba(14,22,34,0.06)", transition: { duration: 0.18 } },
                  };

                  return (
                    <>
                      <motion.div className="flex flex-col items-center justify-center rounded-md p-3 bg-white/0" variants={statVariant} initial="hidden" animate="show" whileHover={prefersReduced ? {} : "hover"} style={{ cursor: "default" }}>
                        <div className="w-10 h-10 rounded-md flex items-center justify-center mb-2" style={{ background: "linear-gradient(180deg, rgba(46,196,182,0.08), rgba(46,196,182,0.03))" }} aria-hidden>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 2l2.9 5.9L21 9l-4.5 3.9L17.8 20 12 16.8 6.2 20l1.3-7.1L3 9l6.1-1.1L12 2z" fill={ACCENT} />
                          </svg>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-300">Certifications</div>
                        <div className="mt-1 text-xl font-semibold" aria-live="polite">
                          <CountNumber value={DEFAULT_CERTS.length} />
                        </div>
                      </motion.div>

                      <motion.div className="flex flex-col items-center justify-center rounded-md p-3 bg-white/0" variants={statVariant} initial="hidden" animate="show" whileHover={prefersReduced ? {} : "hover"} style={{ cursor: "default" }}>
                        <div className="w-10 h-10 rounded-md flex items-center justify-center mb-2" style={{ background: "linear-gradient(180deg, rgba(250,204,21,0.12), rgba(250,204,21,0.03))" }} aria-hidden>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M7 3h10v2H7z" fill="gold" />
                            <path d="M8 5a4 4 0 01-4 4v1a3 3 0 003 3h1v3h6v-3h1a3 3 0 003-3v-1a4 4 0 01-4-4V3H8v2z" fill="gold" />
                          </svg>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-300">Awards & recognitions</div>
                        <div className="mt-1 text-xl font-semibold" aria-live="polite">
                          <CountNumber value={awardCount} />
                        </div>
                      </motion.div>

                      <motion.div className="flex flex-col items-center justify-center rounded-md p-3 bg-white/0" variants={statVariant} initial="hidden" animate="show" whileHover={prefersReduced ? {} : "hover"} style={{ cursor: "default" }}>
                        <div className="w-10 h-10 rounded-md flex items-center justify-center mb-2" style={{ background: "linear-gradient(180deg, rgba(96,165,250,0.08), rgba(96,165,250,0.03))" }} aria-hidden>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill={ACCENT} />
                          </svg>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-300">Testimonials</div>
                        <div className="mt-1 text-xl font-semibold" aria-live="polite">
                          <CountNumber value={testCount} />
                        </div>
                      </motion.div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>

            <motion.div className="mt-6" initial="hidden" animate="show" variants={timelineVariants}>
              <motion.div
                className="rounded-lg p-4 bg-white dark:bg-slate-800/60 shadow-sm border relative overflow-visible"
                style={{ borderColor: 'rgba(46,196,182,0.06)' }}
              >
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Leadership timeline</h3>
                </div>

                <div className="relative pl-6">
                  <motion.div
                    aria-hidden
                    initial={prefersReduced ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0.5 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: 8,
                      bottom: 8,
                      width: 2,
                      transformOrigin: "top",
                      borderRadius: 2,
                      background: "linear-gradient(180deg, rgba(46,196,182,0.06), rgba(46,196,182,0.18))",
                    }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />

                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {timeline.map((ev, i) => {
                        const itemVariant = {
                          hidden: { opacity: 0, x: -8 },
                          show: { opacity: 1, x: 0, transition: { duration: 0.32, delay: i * 0.06 } },
                          exit: { opacity: 0, x: -6, transition: { duration: 0.18 } },
                        };

                        const dotVariant = {
                          hidden: { scale: 0.3, opacity: 0 },
                          show: {
                            scale: [0.3, 1.06, 0.95, 1],
                            opacity: [0, 0.9, 0.85, 1],
                            transition: { duration: 1.1, delay: i * 0.06, times: [0, 0.5, 0.85, 1] },
                          },
                        };

                        return (
                          <motion.div key={ev.id} variants={itemVariant} initial="hidden" animate="show" exit="exit" whileHover={prefersReduced ? {} : { scale: 1.01 }}>
                            <div className="flex items-start gap-4">
                              <div className="w-6 flex-shrink-0 relative">
                                <motion.span
                                  className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                                  style={{ background: ACCENT, boxShadow: "0 6px 14px rgba(46,196,182,0.14)" }}
                                  variants={dotVariant}
                                  aria-hidden
                                />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{ev.title}</div>
                                  <div className="text-xs font-medium px-2 py-0.5 rounded-md" style={{ background: "rgba(46,196,182,0.12)", color: ACCENT }}>{ev.year}</div>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-300 mt-1">{ev.desc}</div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </aside>

          {/* Testimonials — spans both columns so marquee gets full width */}
          <section className="lg:col-span-2">
            <div className="w-full my-10 h-[2px]" style={{ background: "linear-gradient(90deg, rgba(46,196,182,0.1), rgba(46,196,182,0.4), rgba(46,196,182,0.1))" }} />

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36 }}>
              <Testimonials speed={36} />
            </motion.div>
          </section>
        </div>
      </motion.div>
    </motion.main>
  );
}
