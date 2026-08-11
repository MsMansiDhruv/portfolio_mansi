"use client";

import React, { useEffect, useState } from "react";
import { Reveal } from "@/components/portfolio/motion";

const STORAGE_KEY = "mansi_awards_v1";

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

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

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

function EditorialAward({ award }) {
  return (
    <article className="min-w-0 border-b border-l-2 border-slate-200/90 border-l-teal-800/15 py-5 pl-4 dark:border-slate-800/90 dark:border-l-teal-500/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{award.title}</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {award.org}
            {award.year ? ` · ${award.year}` : ""}
          </p>
          {award.summary ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{award.summary}</p>
          ) : null}
        </div>
        {award.sourceUrl ? (
          <a
            href={award.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-medium text-teal-800 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
          >
            Source →
          </a>
        ) : null}
      </div>
    </article>
  );
}

function LegacyAwardCard({ a }) {
  const initials = (() => {
    const src = a.org || a.title || "";
    const p = src.split(" ").filter(Boolean);
    if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
    return (p[0][0] + (p[1]?.[0] || "")).toUpperCase();
  })();

  return (
    <article className="rounded-lg">
      <div
        className="flex items-start gap-4 rounded-lg border border-teal-600/20 bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm dark:from-slate-800/30 dark:to-slate-800/20"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-avatar-bg text-sm font-semibold text-avatar-text">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">{a.title}</div>
          <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{a.org}</div>
          {a.summary ? (
            <div className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{a.summary}</div>
          ) : null}
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-teal-800 dark:text-teal-400">{a.year || "—"}</span>
            {a.sourceUrl ? (
              <a href={a.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-teal-800 underline dark:text-teal-400">
                Source →
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AwardsList({ initialAwards = null, showHeader = true, variant = "legacy" }) {
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = safeParse(raw);
    const normInitial = Array.isArray(initialAwards) ? sanitizeAwards(initialAwards) : null;

    if (Array.isArray(parsed) && parsed.length > 0) {
      setAwards(sanitizeAwards(parsed));
    } else if (Array.isArray(normInitial) && normInitial.length > 0) {
      setAwards(normInitial);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normInitial));
      } catch {
        /* ignore */
      }
    } else {
      const fb = sanitizeAwards(FALLBACK_AWARDS);
      setAwards(fb);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fb));
      } catch {
        /* ignore */
      }
    }
  }, [initialAwards]);

  if (variant === "editorial") {
    return (
      <div className="grid min-w-0 gap-x-10 md:grid-cols-2">
        {awards.map((award, index) => (
          <Reveal key={award.id} delay={index * 0.05} viewportAmount={0.12}>
            <EditorialAward award={award} />
          </Reveal>
        ))}
      </div>
    );
  }

  return (
    <>
      {showHeader ? (
        <div className="mb-4">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Awards & Recognition</h3>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              A curated selection of achievements, scholarships & recognitions.
            </p>
            <span className="text-sm text-slate-600 dark:text-slate-400">{awards.length} total</span>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {awards.map((a) => (
          <LegacyAwardCard key={a.id} a={a} />
        ))}
      </div>
    </>
  );
}
