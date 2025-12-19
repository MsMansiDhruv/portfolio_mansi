// components/AwardsList.jsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const STORAGE_KEY = "mansi_awards_v1";
const ACCENT = "var(--color-accent)";

/* FALLBACK_AWARDS (keeps the original list you provided) */
const FALLBACK_AWARDS = [
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

/* ---------- helpers ---------- */
function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * sanitizeAwards - normalizes and deduplicates awards by title (case-insensitive)
 * returns array of { id, title, org, year, summary, sourceUrl }
 */
function sanitizeAwards(arr) {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  const out = [];

  for (const a of arr) {
    if (!a || typeof a !== "object") continue;
    const title = (a.title || "").trim();
    if (!title) continue;
    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({
      id: a.id || title.slice(0, 40).replace(/\s+/g, "-").toLowerCase(),
      title,
      org: (a.org || "").trim(),
      year: (a.year || "").trim(),
      summary: (a.summary || "").trim(),
      sourceUrl: a.sourceUrl || a.link || "",
    });
  }

  return out;
}

/* ---- Award card component (compact + animated) ---- */
function Card({ a, reduced }) {
  const initials = (() => {
    const src = a.org || a.title || "";
    const p = src.split(" ").filter(Boolean);
    if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
    return (p[0][0] + (p[1]?.[0] || "")).toUpperCase();
  })();

  const hoverProps = reduced
    ? {}
    : {
        whileHover: { y: -6, scale: 1.01 },
        whileTap: { scale: 0.995 },
      };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="rounded-lg"
      {...hoverProps}
      style={{
        transformOrigin: "center",
        willChange: reduced ? "auto" : "transform",
        transform: "translateZ(0)",
        WebkitFontSmoothing: "antialiased",
        backfaceVisibility: "hidden",
      }}
    >
      <div
        className="
          flex items-start gap-4 p-4 rounded-lg
          bg-gradient-to-b from-slate-50 to-white
          dark:from-slate-800/30 dark:to-slate-800/20
          shadow-sm
        "
        style={{
          border: "1px solid rgba(46,196,182,0.35)",
          overflow: "visible",
        }}
      >
        <div className="flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-avatar-bg text-avatar-text text-sm"
            style={{ WebkitFontSmoothing: "antialiased" }}
          >
            {initials}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {a.title}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {a.org}
              </div>

              {a.summary && (
                <div className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                  {a.summary}
                </div>
              )}
            </div>

            <div className="ml-auto flex flex-col items-end gap-2 min-w-fit">
              <div
                className="text-xs font-medium px-2 py-0.5 rounded-md"
                style={{
                  background: "rgba(46,196,182,0.15)",
                  color: ACCENT,
                }}
              >
                {a.year || "—"}
              </div>

              {a.sourceUrl && (
                <a
                  href={a.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs underline"
                  style={{ color: ACCENT }}
                >
                  Source →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ---- Main component ---- */
export default function AwardsList({ initialAwards = null }) {
  const [awards, setAwards] = useState([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // read from localStorage
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = safeParse(raw);

    // normalize initialAwards (if any)
    const normInitial = Array.isArray(initialAwards) ? sanitizeAwards(initialAwards) : null;

    // Decide source:
    // 1) If stored array present -> use it
    // 2) Else if initialAwards provided -> use it and seed localStorage
    // 3) Else fallback -> use FALLBACK_AWARDS and seed localStorage
    if (Array.isArray(parsed) && parsed.length > 0) {
      const s = sanitizeAwards(parsed);
      setAwards(s);
      console.debug("[AwardsList] using localStorage, items:", s.length);
    } else if (Array.isArray(normInitial) && normInitial.length > 0) {
      setAwards(normInitial);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normInitial));
        console.debug("[AwardsList] seeded localStorage from initialAwards, items:", normInitial.length);
      } catch (e) {
        console.warn("[AwardsList] failed to seed localStorage from initialAwards", e);
      }
    } else {
      const fb = sanitizeAwards(FALLBACK_AWARDS);
      setAwards(fb);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fb));
        console.debug("[AwardsList] seeded localStorage from FALLBACK_AWARDS, items:", fb.length);
      } catch (e) {
        console.warn("[AwardsList] failed to seed localStorage from fallback", e);
      }
    }
  }, [initialAwards]);

  return (
    <>
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Awards & Recognition
        </h3>

        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            A curated selection of achievements, scholarships & recognitions.
          </p>

          <span className="text-sm text-slate-600 dark:text-slate-400">
            {awards.length} total
          </span>
        </div>
      </div>

      <motion.div
        layout
        initial="hidden"
        animate="show"
        className="grid gap-4 grid-cols-1 md:grid-cols-2"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } },
        }}
      >
        <AnimatePresence initial={false}>
          {awards.map((a) => (
            <Card key={a.id} a={a} reduced={prefersReducedMotion} />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
