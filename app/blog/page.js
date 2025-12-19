// app/blog/page.jsx
"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import GpuSparks from "../../components/GpuSparks";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "var(--color-accent)"; // your accent

function formatDate(ms) {
  if (!ms) return "";
  const d = new Date(ms);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/* --- Framer motion variants --- */
const gridVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: 6, scale: 0.995, transition: { duration: 0.18 } },
  hover: { y: -6, boxShadow: "0 10px 30px rgba(14,22,34,0.08)", transition: { type: "spring", stiffness: 320, damping: 28 } },
};

const imgVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.06, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // infinite scroll state
  const [pageSize] = useState(6); // page size for chunk rendering
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const sentinelRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/medium/mansi.p.dhruv");
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setPosts(data.posts || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load posts");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          setVisibleCount((v) => Math.min(posts.length, v + pageSize));
        }
      });
    }, { rootMargin: "200px" });
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [posts.length, pageSize]);

  // open medium article in new tab
  const openArticle = useCallback((url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  // small array for skeletons while loading
  const skeletons = Array.from({ length: pageSize });

  return (
    <main className="w-full px-6 md:px-12 lg:px-20 xl:px-28 pt-5 pb-10">
      <GpuSparks />
      <header className="mt-0 mb-4">
        <h1 className="text-4xl font-bold" style={{ color: ACCENT }}>Writing</h1>
        <p className="mt-2 text-slate-700 dark:text-slate-300 max-w-2xl">
          My latest Medium posts on data engineering, cloud computing, and many more...
        </p>
      </header>

      {loading && (
        <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {skeletons.map((_, i) => (
              <motion.article
                key={`skeleton-${i}`}
                className="group rounded-xl overflow-hidden border bg-white dark:bg-slate-800/40 dark:border-white/6"
                style={{ borderColor: "rgba(46,196,182,0.08)" }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <div className="w-full h-44 md:h-48 lg:h-44 bg-skeleton-bg animate-pulse" />
                <div className="p-5">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3 animate-pulse" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2 animate-pulse" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mt-2 animate-pulse" />
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </section>
      )}

      {error && (
        <div className="rounded-lg p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200">
          Failed to load Medium posts: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <motion.section
            className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            variants={gridVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence initial={false}>
              {posts.slice(0, visibleCount).map((p) => (
                <motion.article
                  key={p.id}
                  className="group rounded-xl overflow-hidden border transition-shadow duration-200 bg-white dark:bg-slate-800/40 dark:border-white/6"
                  style={{ borderColor: "rgba(46,196,182,0.08)" }}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  whileHover="hover"
                  layout
                >
                  {/* clickable thumbnail */}
                  <motion.div
                    role="button"
                    onClick={() => openArticle(p.url)}
                    className="cursor-pointer w-full h-44 md:h-48 lg:h-44 overflow-hidden flex items-center justify-center bg-skeleton-bg"
                    whileHover={{}}
                  >
                    {p.previewImage ? (
                      <motion.img
                        src={p.previewImage}
                        alt={p.title || "post image"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        variants={imgVariants}
                        initial="idle"
                        whileHover="hover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="opacity-60">
                          <path d="M3 3v18h18" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M21 3L3 21" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </motion.div>

                  <div className="p-5">
                    <h3
                      onClick={() => openArticle(p.url)}
                      className="text-lg font-semibold mb-2 cursor-pointer hover:underline"
                      style={{ color: ACCENT }}
                    >
                      {p.title || "Untitled"}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-3">
                      {p.subtitle || ""}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div>{formatDate(p.publishedAt)}</div>
                      <div>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-[0.78rem] font-medium"
                          style={{ color: ACCENT }}
                          onClick={(e) => { /* allow both clicking link and card */ }}
                        >
                          Read on Medium →
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.section>

          {/* sentinel for infinite scroll */}
          <div ref={sentinelRef} className="mt-8 h-6" />

          {/* empty state */}
          {posts.length === 0 && (
            <div className="py-16 text-center text-slate-600 dark:text-slate-400">No posts found on Medium.</div>
          )}

          {/* "load more" hint */}
          {visibleCount < posts.length && (
            <div className="mt-6 text-center text-slate-500 dark:text-slate-400 text-sm">Scroll to load more…</div>
          )}
        </>
      )}
    </main>
  );
}
