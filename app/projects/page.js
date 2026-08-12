"use client";

import { useMemo, useState } from "react";
import StoryChapterShell from "@/components/world/StoryChapterShell";
import ProjectGalleryCard, { useSortedProjects } from "@/components/cinema/ProjectGalleryCard";
import { EXPERIMENT_PROJECT_SLUGS } from "@/lib/data/identity";
import { FEATURED_PROJECT_SLUG } from "@/lib/data/project-meta";
import { STORY_PAGE_META } from "@/lib/data/anime-story";

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const sorted = useSortedProjects();
  const meta = STORY_PAGE_META.work;

  const filtered = useMemo(() => {
    if (!query.trim()) return sorted;
    const q = query.trim().toLowerCase();
    return sorted.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [query, sorted]);

  const featured = filtered.find((p) => p.slug === FEATURED_PROJECT_SLUG);
  const rest = filtered.filter((p) => p.slug !== FEATURED_PROJECT_SLUG);
  const client = rest.filter((p) => !EXPERIMENT_PROJECT_SLUGS.includes(p.slug));
  const experiments = rest.filter((p) => EXPERIMENT_PROJECT_SLUGS.includes(p.slug));

  return (
    <StoryChapterShell chapter={meta.chapter} title={meta.title} subtitle={meta.subtitle}>
      <div className="mx-auto max-w-[1200px] px-5 pb-20 sm:px-10 lg:px-14">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter episodes…"
          aria-label="Filter projects"
          className="story-mono w-full max-w-md border border-white/[0.12] bg-transparent px-4 py-3 text-sm text-[var(--story-ivory)] placeholder:text-[var(--story-grey)] focus:border-[var(--mw-vermilion)] focus:outline-none"
        />

        {featured && !query ? (
          <div className="mt-12">
            <p className="story-mono mb-4 text-[var(--mw-vermilion)]">The problem → the build</p>
            <ProjectGalleryCard project={featured} index={0} />
          </div>
        ) : null}

        {!query && client.length > 0 ? (
          <div className="mt-16">
            <p className="story-mono mb-6 text-[var(--story-grey)]">Platform work</p>
            <div className="grid gap-6 sm:grid-cols-2">
              {client.map((p, i) => (
                <ProjectGalleryCard key={p.slug} project={p} index={i + 1} />
              ))}
            </div>
          </div>
        ) : null}

        {!query && experiments.length > 0 ? (
          <div className="mt-16">
            <p className="story-mono mb-6 text-[var(--story-amber)]">Built because I was curious</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {experiments.map((p, i) => (
                <ProjectGalleryCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        ) : null}

        {query ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {rest.map((p, i) => (
              <ProjectGalleryCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        ) : null}
      </div>
    </StoryChapterShell>
  );
}
