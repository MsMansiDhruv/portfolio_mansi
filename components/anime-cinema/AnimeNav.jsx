"use client";

import Link from "next/link";
import { STORY_CHAPTERS, STORY_SITE_NAV } from "@/lib/data/anime-story";
import { SilhouetteEmblem } from "./SilhouetteCharacter";

function chapterIndex(progress) {
  const p = progress;
  if (p < 0.08) return 0;
  if (p < 0.12) return 1;
  if (p < 0.18) return 2;
  if (p < 0.26) return 3;
  if (p < 0.34) return 4;
  if (p < 0.42) return 5;
  if (p < 0.5) return 6;
  if (p < 0.58) return 7;
  if (p < 0.66) return 8;
  if (p < 0.76) return 9;
  if (p < 0.9) return 10;
  return 11;
}

export default function AnimeNav({ progress = 0 }) {
  const active = chapterIndex(progress);

  return (
    <>
      <header className="anime-nav">
        <Link href="/" className="flex items-center gap-3">
          <SilhouetteEmblem className="anime-emblem" />
          <p className="story-mono text-[var(--story-grey)]">Mansi</p>
        </Link>
        <nav className="story-site-nav hidden sm:flex">
          {STORY_SITE_NAV.map((item) => (
            <Link key={item.id} href={item.href} className="hover:text-[var(--story-ivory)]">
              {item.label}
            </Link>
          ))}
        </nav>
        <nav className="flex gap-4 text-xs sm:hidden">
          <Link href="/projects" className="text-[var(--story-grey)]">
            Work
          </Link>
          <Link href="/contact" className="text-[var(--story-grey)]">
            Next
          </Link>
        </nav>
      </header>

      <aside className="anime-chapter-rail" aria-label="Story chapters">
        {STORY_CHAPTERS.map((ch, i) => (
          <span key={ch.id} className={`anime-chapter-item ${i === active ? "is-active" : ""}`}>
            {ch.n} {ch.label}
          </span>
        ))}
      </aside>
    </>
  );
}
