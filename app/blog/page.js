"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import StoryChapterShell from "@/components/world/StoryChapterShell";
import { STORY_PAGE_META } from "@/lib/data/anime-story";

function formatDate(ms) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const meta = STORY_PAGE_META.writing;

  return (
    <StoryChapterShell chapter={meta.chapter} title={meta.title} subtitle={meta.subtitle}>
      <div className="mx-auto max-w-[1200px] px-5 pb-20 sm:px-10 lg:px-14">
          {loading && <p className="story-mono mt-10 text-[var(--story-grey)]">Loading case files…</p>}
          {error && <p className="mt-10 text-sm text-[var(--story-red)]">Failed to load Medium posts: {error}</p>}

          {!loading && !error && featured ? (
            <article
              className="group mt-12 cursor-pointer border border-white/[0.08] transition hover:border-white/[0.15]"
              onClick={() => openArticle(featured.url)}
            >
              <div className="border-b border-white/[0.06] px-6 py-4">
                <p className="story-mono text-[var(--story-grey)]">Latest case file</p>
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="story-display text-2xl font-medium group-hover:text-[var(--story-cyan)] sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[var(--story-grey)]">{featured.subtitle}</p>
                <span className="story-mono mt-6 inline-flex items-center gap-1 text-[var(--story-cyan)]">
                  Read on Medium
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
              <p className="story-mono border-t border-white/[0.06] px-6 py-3 text-[var(--story-grey)]">
                {formatDate(featured.publishedAt)}
              </p>
            </article>
          ) : null}

          {!loading && rest.length > 0 ? (
            <ul className="mt-12 divide-y divide-white/[0.06]">
              {rest.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => openArticle(p.url)} className="group w-full py-6 text-left">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="story-display text-lg font-medium group-hover:text-[var(--story-cyan)]">{p.title}</h3>
                      <span className="story-mono shrink-0 text-[var(--story-grey)]">{formatDate(p.publishedAt)}</span>
                    </div>
                    {p.subtitle ? <p className="mt-2 line-clamp-1 text-sm text-[var(--story-grey)]">{p.subtitle}</p> : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {!loading && posts.length === 0 && !error ? (
            <p className="story-mono mt-10 text-[var(--story-grey)]">No field notes found.</p>
          ) : null}
        </div>
    </StoryChapterShell>
  );
}
