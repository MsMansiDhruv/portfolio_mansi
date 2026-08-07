"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/portfolio/motion";

const ACCENT = "var(--color-accent)";

function formatDate(ms) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/medium/mansi.p.dhruv");
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        if (mounted) setPosts(data.posts || []);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load posts");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const openArticle = useCallback((url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-w-0 space-y-10 sm:space-y-12">
      <Reveal>
        <header className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-800/80 dark:text-teal-400">Publication</p>
          <h1 className="mt-4 text-[clamp(1.75rem,5vw,2.25rem)] font-semibold tracking-tight text-slate-950 dark:text-white">Writing</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Engineering notes on data platforms, cloud, and delivery.</p>
        </header>
      </Reveal>

      {loading && <p className="text-sm text-slate-500">Loading articles…</p>}
      {error && <p className="text-sm text-rose-600">Failed to load Medium posts: {error}</p>}

      {!loading && !error && featured ? (
        <Reveal delay={0.05}>
          <article className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 sm:p-8" onClick={() => openArticle(featured.url)}>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Featured</p>
            <h2 className="mt-3 break-words text-xl font-semibold text-slate-950 group-hover:text-teal-800 dark:text-white dark:group-hover:text-teal-400 sm:text-2xl">
              {featured.title}
            </h2>
            <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{featured.subtitle}</p>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
              <span>{formatDate(featured.publishedAt)}</span>
              <span className="inline-flex items-center gap-1 font-medium text-teal-800 dark:text-teal-400">
                Read on Medium
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </article>
        </Reveal>
      ) : null}

      {!loading && !error && rest.length > 0 ? (
        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {rest.map((p, i) => (
            <Reveal key={p.id} delay={0.02 * i}>
              <li>
                <button
                  type="button"
                  onClick={() => openArticle(p.url)}
                  className="group w-full py-5 text-left"
                >
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-base font-semibold text-slate-950 group-hover:text-teal-800 dark:text-white dark:group-hover:text-teal-400">
                        {p.title}
                      </h3>
                      {p.subtitle ? <p className="mt-1 line-clamp-1 text-sm text-slate-600 dark:text-slate-400">{p.subtitle}</p> : null}
                    </div>
                    <span className="shrink-0 text-xs text-slate-500">{formatDate(p.publishedAt)}</span>
                  </div>
                </button>
              </li>
            </Reveal>
          ))}
        </ul>
      ) : null}

      {!loading && posts.length === 0 && !error ? (
        <p className="text-sm text-slate-500">No posts found on Medium.</p>
      ) : null}
      <div ref={sentinelRef} className="h-1" aria-hidden />
    </div>
  );
}
