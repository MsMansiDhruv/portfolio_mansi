// app/tools/page.jsx
"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import GpuSparks from "../../components/GpuSparks";

/* Accent color matches your theme (CSS var so it stays in sync) */
const ACCENT = "var(--color-accent)";

/* Tools list */
const TOOLS = [
  {
    id: "bill",
    title: "Bill / Invoice Generator",
    description: "Create, preview and export professional invoices (PDF, email, WhatsApp).",
    href: "/tools/bill",
    letter: "B",
  },
  {
    id: "qr",
    title: "QR Code Generator",
    description: "Generate QR codes for URLs, payments and contacts.",
    href: "/tools/qr",
    letter: "Q",
  },
  {
    id: "json",
    title: "JSON Analyser",
    description: "Format, validate and copy pretty JSON instantly.",
    href: "/tools/json",
    letter: "J",
  },
];

/* Motion variants */
const pageContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const sectionFade = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.36 } } };
const cardEntrance = (i) => ({
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: "easeOut", delay: i * 0.04 } },
});

/* Tool card component — more compact, industry-standard layout */
function ToolCard({ t, i, reduced }) {
  const prefersReduced = reduced;
  const hoverMotion = prefersReduced
    ? {}
    : {
        whileHover: {
          y: -6,
          scale: 1.01,
          // highlight border + subtle glow — uses the accent fallback color below for safety
          boxShadow: "0 10px 30px rgba(46,196,182,0.12)",
        },
        whileTap: { scale: 0.997 },
      };

  // fallback accent rgba for box-shadows where CSS var can't be used directly
  const accentFallbackRgba = "rgba(46,196,182,1)";

  return (
    <motion.a
      href={t.href}
      key={t.id}
      className="group block rounded-xl border p-3 cursor-pointer transition-all duration-200 bg-white dark:bg-[#1e293b80]"
      style={{
        // base subtle border; will visually elevate on hover via framer-motion boxShadow above
        borderColor: "rgba(0,0,0,0.04)",
        // allow CSS var accent via inline style for elements that consume it
        // overall boxShadow handled by framer-motion for the accent glow
      }}
      initial="hidden"
      animate="show"
      variants={cardEntrance(i)}
      {...hoverMotion}
      onMouseEnter={(e) => {
        // set border color to accent on hover (also respects CSS var)
        e.currentTarget.style.borderColor = ACCENT;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.04)";
      }}
    >
      <div className="flex items-start gap-3">
        {/* compact circle letter/icon */}
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-base flex-shrink-0"
          style={{
            background: "rgba(46,196,182,0.09)",
            color: ACCENT,
            minWidth: 40,
          }}
          aria-hidden
        >
          {t.letter}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">{t.title}</h3>

            {/* Industry-standard small badge on the right */}
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: "rgba(46,196,182,0.10)",
                color: ACCENT,
                border: `1px solid rgba(46,196,182,0.12)`,
              }}
            >
              Open
            </span>
          </div>

          {/* description: slightly smaller, limited lines to keep cards uniform */}
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 min-h-[40px] line-clamp-3">
            {t.description}
          </p>

          {/* subtle footer row: chevron aligned to the right — smaller visual weight */}
          <div className="mt-3 flex items-center justify-end text-sm text-slate-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

/* Main page */
export default function ToolsPage() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.main
      className="w-full px-6 md:px-12 lg:px-20 xl:px-28 pt-4 pb-12"
      initial="hidden"
      animate="show"
      variants={pageContainer}
    >
      <GpuSparks />

      <motion.header className="mb-6" variants={sectionFade}>
        <h1 className="text-4xl font-bold" style={{ color: ACCENT }}>
          Toolkit
        </h1>
        <p className="mt-2 text-slate-700 dark:text-slate-300 max-w-2xl">
          Small utilities and helpers - for day to day activities.
        </p>
      </motion.header>

      <motion.div className="space-y-10" variants={pageContainer}>
        <motion.section className="mb-6" variants={sectionFade}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Available tools</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Open any tool to use it directly on the site.</p>
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-300">{TOOLS.length} tools</div>
          </div>

          {/* Responsive grid; cards take column width. */}
          <motion.div
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start"
            initial="hidden"
            animate="show"
            variants={pageContainer}
          >
            <AnimatePresence initial={false}>
              {TOOLS.map((t, idx) => (
                <ToolCard key={t.id} t={t} i={idx} reduced={prefersReduced} />
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.section>

        <div
          className="w-full my-10 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(46,196,182,0.06), rgba(46,196,182,0.18), rgba(46,196,182,0.06))",
          }}
        />

        {/* <motion.section className="mb-6" variants={sectionFade}>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Quick notes</h3>
          <div className="rounded-lg p-4 bg-white dark:bg-[#1e293b80] border border-slate-200 dark:border-white/10 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Tools are lightweight client apps. The invoice generator exports a PDF and can email/share when a backend endpoint is available.
            </p>
            <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 list-disc pl-5">
              <li>All tools respect the site accent and dark mode.</li>
              <li>Open each tool in its own page for isolated usage and smaller bundles.</li>
            </ul>
          </div>
        </motion.section> */}
      </motion.div>
    </motion.main>
  );
}
