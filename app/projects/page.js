// app/projects/page.jsx
"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import GpuSparks from "../../components/GpuSparks";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "var(--color-accent)";
const PAGE_SIZE = 6;

/* ============================================================
   IMPORTANT: Paste your full PROJECTS array here (unchanged).
   Replace the placeholder below with your original `const PROJECTS = [...]`
   so none of your cards are lost. Do NOT remove/rename it.
   ============================================================ */

/* PASTE YOUR FULL PROJECTS ARRAY HERE (exactly as in your original file) */
/* Example small fallback (will be overridden when you paste your full array):
const PROJECTS = [
  { slug: "tata-amc-datamart", title: "Tata AMC — Customer360 Datamart", desc: "Designing a cost-efficient cloud-native datamart", date: "2024-08", category: "Data Engineering", tech: ["S3","Iceberg","PySpark"], tags: ["data","iceberg","aws"], pinned: true },
  { slug: "gpu-bench", title: "GPU Benchmark Pod", desc: "CUDA experiments and performance tuning", date: "2023-11", category: "GPU / HPC", tech: ["CUDA","Profiling"], tags: ["gpu","cuda","perf"], pinned: false },
];
*/
let PROJECTS = [];
try {
  // If you pasted your array above, it will assign to PROJECTS.
  // If you didn't paste yet, this keeps things safe and uses the fallback.
  if (!PROJECTS || PROJECTS.length === 0) {
    // fallback sample to avoid runtime errors — remove if you paste your real array.
    PROJECTS = [
      {
        slug: "project-amc-datalake-solution",
        title: "AMC - Datalake Solution",
        desc: "Designing a cost-efficient cloud-native datamart",
        date: "2025-03",
        category: "Data Engineering",
        tech: ["S3", "Iceberg", "PySpark", "AWS", "Pyspark", "Terraform", "S3 Tables", "Redshift"],
        tags: ["data", "iceberg", "aws", "data engineering"],
        pinned: true
      },
      {
        slug: "gpu-bench",
        title: "GPU Benchmark Pod",
        desc: "CUDA experiments and performance tuning",
        date: "2023-11",
        category: "GPU / HPC",
        tech: ["CUDA", "Profiling"],
        tags: ["gpu", "cuda", "perf"],
        pinned: false
      },
      {
        slug: "pc-accessories",
        title: "Custom PC Accessories",
        desc: "Side business — GPU backplates & acrylic plates",
        date: "2022-06",
        category: "Business",
        tech: ["Design", "Laser-cut"],
        tags: ["shop", "design"],
        pinned: false
      },
      {
        slug: "small-data-lake",
        title: "Small Data Lake (PoC)",
        desc: "Lightweight data lake using Iceberg and Spark",
        date: "2024-03",
        category: "Data Engineering",
        tech: ["Iceberg", "Spark"],
        tags: ["data", "lake", "iceberg"],
        pinned: false
      },
      {
        slug: "cuda-tiling",
        title: "CUDA Tiling Experiments",
        desc: "Shared memory tiling microbenchmarks",
        date: "2022-12",
        category: "GPU / HPC",
        tech: ["CUDA"],
        tags: ["gpu", "cuda", "benchmark"],
        pinned: false
      },
      {
        slug: "acrylic-store",
        title: "Acrylic Mods — Shop",
        desc: "MVP for custom acrylic GPU backplates",
        date: "2021-11",
        category: "Business",
        tech: ["Design"],
        tags: ["shop", "acrylic"],
        pinned: false
      },
      {
        slug: "saffron-research",
        title: "Saffron Harvesting Research",
        desc: "Feasibility research and pilot plots",
        date: "2020-05",
        category: "Research",
        tech: ["Agro"],
        tags: ["agro", "pilot"],
        pinned: false
      },
      {
        slug: "saffron-research-2",
        title: "Saffron Harvesting Research",
        desc: "Feasibility research and pilot plots",
        date: "2020-05",
        category: "Research",
        tech: ["Agro"],
        tags: ["agro", "pilot"],
        pinned: false
      },
      // add more entries as needed...
    ];
  }
} catch (e) {
  // noop
}

/* ----------------------
   Framer Motion variants
   ---------------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, when: "beforeChildren" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
  hover: { y: -6, boxShadow: "0 8px 30px rgba(14,22,34,0.12)", transition: { type: "spring", stiffness: 350, damping: 28 } },
};

const pinnedAccentVariants = {
  idle: { scaleY: 1, opacity: 1 },
  pulse: {
    scaleY: [1, 1.06, 1],
    opacity: [1, 0.9, 1],
    transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
  },
};

function uniqueTags(list) {
  const s = new Set();
  list.forEach((p) => (p.tags || []).forEach((t) => s.add(t)));
  return Array.from(s).sort();
}

export default function ProjectsPage() {
  // UI state
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]); // multi-select
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  // Derived data
  const tags = useMemo(() => uniqueTags(PROJECTS), [PROJECTS]);
  const pinned = useMemo(() => PROJECTS.filter((p) => p.pinned), [PROJECTS]);
  const unpinned = useMemo(() => PROJECTS.filter((p) => !p.pinned), [PROJECTS]);

  function toggleTag(tag) {
    setPage(1);
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  // filter + search + sort
  const filtered = useMemo(() => {
    let list = [...unpinned];

    if (query?.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => {
        const inText =
          (p.title || "").toLowerCase().includes(q) ||
          (p.desc || "").toLowerCase().includes(q);
        const inTags = (p.tags || []).some((t) => t.toLowerCase().includes(q));
        return inText || inTags;
      });
    }

    if (selectedTags.length) {
      if (selectedTags.includes("__pinned__")) {
        const all = [...PROJECTS];
        list = all.filter((p) => p.pinned);
      } else {
        list = list.filter((p) => (selectedTags || []).every((t) => (p.tags || []).includes(t)));
      }
    }

    list.sort((a, b) => {
      if (sortOrder === "newest") return b.date.localeCompare(a.date);
      return a.date.localeCompare(b.date);
    });

    return list;
  }, [query, selectedTags, sortOrder, unpinned]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function clearFilters() {
    setQuery("");
    setSelectedTags([]);
    setSortOrder("newest");
    setPage(1);
  }

  function initialsFromTitle(title = "") {
    if (!title) return "P";
    const parts = title.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1][0] || "")).toUpperCase();
  }

  return (
    <main className="w-full px-6 md:px-12 lg:px-20 xl:px-28 pt-4 pb-10">
      <GpuSparks />
      <header className="mt-0 mb-4">
        <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: ACCENT }}>
          Projects
        </h2>
        <p className="mt-2 text-slate-700 dark:text-slate-300 max-w-2xl">
          Search, filter, and browse selected projects. Pinned projects always appear at the top.
        </p>
      </header>

      {/* Controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search projects (title, description, tags)…"
            className="w-full md:w-96 px-3 py-2 rounded-md border bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-200 border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 transition-shadow"
            aria-label="Search projects"
            style={{ boxShadow: "none", outlineColor: "rgba(46,196,182,0.15)" }}
          />

          <select
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
            className="text-sm px-3 py-2 rounded-md border bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 transition"
            aria-label="Sort projects"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="text-sm px-3 py-2 rounded-md border bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 transition"
            aria-label="Items per page"
          >
            <option value={6}>6 / page</option>
            <option value={9}>9 / page</option>
            <option value={12}>12 / page</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => clearFilters()}
            className="text-sm px-3 py-2 rounded-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-transform hover:-translate-y-0.5"
          >
            Clear
          </button>

          <div className="text-xs text-slate-600 dark:text-slate-400">
            {filtered.length} results{selectedTags.length ? ` · ${selectedTags.length} tag(s)` : ""}
          </div>
        </div>
      </div>

      {/* Tag chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map((t) => {
          const active = selectedTags.includes(t);
          return (
            <motion.button
              key={t}
              layout
              onClick={() => toggleTag(t)}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0.9 }}
              animate={{ opacity: active ? 1 : 0.95, scale: active ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={`text-xs px-3 py-1.5 rounded-full border inline-flex items-center gap-2 shadow-sm ${active ? "text-white" : "text-slate-700 dark:text-slate-200"}`}
              style={{
                background: active ? ACCENT : "transparent",
                borderColor: active ? ACCENT : "rgba(15,23,36,0.06)",
              }}
            >
              {t}
            </motion.button>
          );
        })}

        {/* quick pinned filter */}
        <motion.button
          layout
          onClick={() => {
            if (selectedTags.includes("__pinned__")) setSelectedTags((prev) => prev.filter((x) => x !== "__pinned__"));
            else setSelectedTags((prev) => [...prev, "__pinned__"]);
            setPage(1);
          }}
          whileTap={{ scale: 0.96 }}
          className={`text-xs px-3 py-1.5 rounded-full border inline-flex items-center gap-2 ${selectedTags.includes("__pinned__") ? "text-white" : "text-slate-700 dark:text-slate-200"}`}
          style={{
            background: selectedTags.includes("__pinned__") ? ACCENT : "transparent",
            borderColor: selectedTags.includes("__pinned__") ? ACCENT : "rgba(15,23,36,0.06)",
          }}
        >
          Pinned
        </motion.button>
      </div>

      {/* Pinned projects section */}
      {pinned.length > 0 && !selectedTags.includes("__pinned__") && (
        <section className="mb-8">
          <h4 className="text-sm font-semibold mb-3 text-slate-800 dark:text-white">Pinned</h4>

          <motion.div
            className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            {pinned.map((p) => (
              <motion.article
                key={p.slug}
                className="relative overflow-visible rounded-lg p-4 flex flex-col bg-white dark:bg-slate-800/50 border shadow-sm"
                style={{ borderColor: "rgba(46,196,182,0.12)" }}
                variants={cardVariants}
                whileHover="hover"
                initial="hidden"
                animate="show"
              >
                {/* left accent bar behind content */}
                <motion.div
                  aria-hidden
                  variants={pinnedAccentVariants}
                  animate="pulse"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 10,
                    bottom: 10,
                    width: 8,
                    borderRadius: 8,
                    background: `linear-gradient(180deg, rgba(46,196,182,0.14), rgba(46,196,182,0.06))`,
                    zIndex: 0,
                    pointerEvents: "none",
                    transformOrigin: "center",
                  }}
                />

                {/* content container sits above accent */}
                <div style={{ position: "relative", zIndex: 1, paddingLeft: 8 }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold flex items-center gap-3">
                        <span style={{ color: ACCENT }}>{p.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(46,196,182,0.08)", color: ACCENT }}>Pinned</span>
                      </h3>

                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 truncate">{p.desc}</p>

                      <div className="mt-3 text-xs flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(46,196,182,0.06)", color: ACCENT }}>{p.date}</span>
                        <span className="text-slate-500 dark:text-slate-400">· {p.category}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col gap-2 items-end">
                      <Link href={`/projects/${p.slug}`} className="text-sm font-medium" style={{ color: ACCENT }}>View →</Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>
      )}

      {/* Results grid */}
      <section aria-labelledby="projects-grid" className="mb-10">
        <h4 id="projects-grid" className="sr-only">Projects Grid</h4>

        <motion.div
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <AnimatePresence initial={false}>
            {pageItems.map((p) => {
              if (selectedTags.includes("__pinned__") && !p.pinned) return null;

              return (
                <motion.article
                  key={p.slug}
                  layout
                  className="group relative rounded-xl p-6 bg-white dark:bg-slate-800/40 border shadow-sm"
                  style={{ borderColor: "rgba(46,196,182,0.12)" }}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: 8, scale: 0.995, transition: { duration: 0.22 } }}
                  whileHover={{ y: -6, scale: 1.01 }}
                >
                  <h3 className="text-lg font-semibold mb-2" style={{ color: ACCENT }}>{p.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{p.desc}</p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(46,196,182,0.06)", color: ACCENT, border: "1px solid rgba(46,196,182,0.12)" }}>{p.date}</span>
                      <div className="flex gap-2 ml-2 flex-wrap">
                        {(p.tags || []).slice(0, 4).map((t) => (
                          <motion.button
                            key={t}
                            layout
                            onClick={() => toggleTag(t)}
                            whileTap={{ scale: 0.96 }}
                            className="text-xs px-2 py-1 rounded-md border text-slate-700 dark:text-slate-200"
                            style={{ borderColor: "rgba(15,23,36,0.06)" }}
                          >
                            {t}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Link href={`/projects/${p.slug}`} className="text-sm font-medium" style={{ color: ACCENT }}>View →</Link>
                    </div>
                  </div>

                  <Link href={`/projects/${p.slug}`} className="absolute inset-0 rounded-xl focus:outline-none focus:ring-4" aria-hidden tabIndex={-1} />
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Pagination controls */}
      <nav className="flex items-center justify-between gap-4">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing <strong>{(safePage - 1) * pageSize + 1}</strong>–<strong>{Math.min(safePage * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> projects
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="px-3 py-1 rounded-md border text-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            style={{ borderColor: "rgba(15,23,36,0.06)" }}
            aria-label="Previous page"
          >
            Prev
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              const active = n === safePage;
              return (
                <motion.button
                  key={n}
                  onClick={() => setPage(n)}
                  layout
                  whileTap={{ scale: 0.96 }}
                  className={`px-3 py-1 rounded-md text-sm ${active ? "font-semibold" : ""}`}
                  style={{
                    border: "1px solid transparent",
                    background: active ? ACCENT : "transparent",
                    color: active ? "white" : "var(--text-color, #0f1724)",
                    transition: "background 180ms ease, color 180ms ease",
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  {n}
                </motion.button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="px-3 py-1 rounded-md border text-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            style={{ borderColor: "rgba(15,23,36,0.06)" }}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </nav>
    </main>
  );
}
