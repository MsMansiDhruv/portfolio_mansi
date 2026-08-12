"use client";

import Link from "next/link";
import StoryFilm from "@/components/story/StoryFilm";
import EpisodePreview from "@/components/story/EpisodePreview";
import VoicesScene from "@/components/story/VoicesScene";
import WorkshopScene from "@/components/story/WorkshopScene";
import AnimeNav from "./AnimeNav";
import SilhouetteCharacter from "./SilhouetteCharacter";
import {
  STORY_PROLOGUE,
  WORLD_OPENING,
  STORY_CURIOSITY,
  STORY_GROWTH,
  STORY_IDENTITY,
  STORY_FINAL,
  STORY_PERSONAL,
  STORY_PEOPLE,
  STORY_TRAVEL,
} from "@/lib/data/anime-story";
import "@/styles/anime-cinema.css";

export default function AnimeFallback() {
  return (
    <div className="anime-cinema-root story-page">
      <AnimeNav progress={1} />
      <StoryFilm mood="cool">
        <section className="relative flex min-h-[70vh] flex-col justify-end px-5 pb-16 pt-28 sm:px-10 lg:px-14">
          <div className="absolute right-8 top-32 h-48 w-28 opacity-40">
            <SilhouetteCharacter pose="back" facing="right" rim="warm" />
          </div>
          <p className="anime-statement anime-statement--whisper">{STORY_PROLOGUE.line1}</p>
          <p className="anime-statement mt-6 text-[var(--mw-vermilion)]">{STORY_PROLOGUE.line2}</p>
          <h1 className="anime-statement mt-10">{WORLD_OPENING.name}</h1>
          <p className="story-mono mt-4 text-[var(--story-grey)]">{WORLD_OPENING.roles}</p>
        </section>

        <section className="px-5 py-16 sm:px-10 lg:px-14">
          <p className="story-mono text-[var(--story-grey)]">Chapter 01</p>
          <p className="anime-statement mt-4">{STORY_CURIOSITY.line1}</p>
          <p className="anime-handnote mt-4">{STORY_CURIOSITY.line2}</p>
        </section>

        <EpisodePreview limit={3} />

        <section className="px-5 py-16 sm:px-10 lg:px-14">
          <p className="anime-statement">{STORY_GROWTH.line1}</p>
          <p className="anime-statement mt-4 text-[var(--story-amber)]">{STORY_GROWTH.line2}</p>
        </section>

        <section className="px-5 py-16 sm:px-10 lg:px-14">
          <p className="story-mono text-[var(--story-amber)]">{STORY_PERSONAL.line1}</p>
          <p className="mt-4 text-[var(--story-grey)]">{STORY_PERSONAL.line2}</p>
        </section>

        <section className="px-5 py-16 sm:px-10 lg:px-14">
          <p className="anime-statement text-2xl">{STORY_PEOPLE.line1}</p>
          <p className="mt-4 italic text-[var(--story-cyan)]">{STORY_PEOPLE.line2}</p>
        </section>

        <section className="px-5 py-16 sm:px-10 lg:px-14">
          {STORY_TRAVEL.lines.map((l) => (
            <p key={l} className="anime-statement mt-4 text-2xl first:mt-0">
              {l}
            </p>
          ))}
        </section>

        <section id="about" className="px-5 py-16 sm:px-10 lg:px-14">
          <p className="story-mono text-[var(--story-cyan)]">{STORY_IDENTITY.name}</p>
          <ul className="mt-6 space-y-3">
            {STORY_IDENTITY.fragments.map((f) => (
              <li key={f.id}>
                <p className="story-display text-lg">{f.label}</p>
                <p className="mt-1 text-sm text-[var(--story-grey)]">{f.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <VoicesScene limit={2} />
        <WorkshopScene />

        <section id="contact" className="px-5 py-24 text-center sm:px-10 lg:px-14">
          <p className="story-editorial text-2xl italic text-[var(--story-cyan)]">{STORY_FINAL.cta}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <a href={`mailto:${STORY_FINAL.email}`} className="story-mono text-[var(--story-cyan)]">
              Email
            </a>
            <Link href="/contact" className="story-mono text-[var(--story-grey)]">
              Next →
            </Link>
          </div>
        </section>
      </StoryFilm>
    </div>
  );
}
