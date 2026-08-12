"use client";

import Link from "next/link";
import StoryMotif from "./StoryMotif";
import SilhouetteCharacter from "@/components/anime-cinema/SilhouetteCharacter";
import "@/styles/mansi-world.css";

export default function StoryChapterShell({
  chapter,
  title,
  subtitle,
  children,
  showSilhouette = true,
}) {
  return (
    <div className="mansi-world mansi-world-page">
      <div className="mansi-world-atmosphere" aria-hidden />
      <div className="mansi-world-grain" aria-hidden />
      <StoryMotif variant="ambient" />

      <header className="mansi-chapter-hero mx-auto max-w-[1200px]">
        <Link href="/" className="story-mono mb-6 inline-block text-[10px] text-[var(--u-vermilion)]">
          ← Return to universe
        </Link>
        {showSilhouette ? (
          <div className="absolute right-6 top-24 hidden h-32 w-20 opacity-30 md:block lg:right-12 lg:top-28 lg:h-40 lg:w-24">
            <SilhouetteCharacter pose="back" facing="right" rim="warm" />
          </div>
        ) : null}
        {chapter ? <p className="mansi-chapter-kicker">{chapter}</p> : null}
        {title ? <h1 className="mansi-chapter-title">{title}</h1> : null}
        {subtitle ? <p className="mansi-chapter-sub">{subtitle}</p> : null}
      </header>

      <div className="mansi-world-content">{children}</div>
    </div>
  );
}
