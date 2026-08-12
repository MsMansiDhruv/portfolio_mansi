"use client";

import { useState } from "react";
import Link from "next/link";
import { windowOpacity, segmentProgress } from "@/components/cinema/scroll/useScrollProgress";
import {
  STORY_PROLOGUE,
  STORY_CURIOSITY,
  STORY_BUILDER,
  STORY_FAILURE,
  STORY_ANIME,
  STORY_GAMING,
  STORY_BOARD,
  STORY_PEOPLE,
  STORY_TRAVEL,
  STORY_PERSONAL,
  STORY_GROWTH,
  STORY_LEADERSHIP,
  STORY_IDENTITY,
  STORY_FINAL,
  STORY_CLIENT_WORK,
  STORY_PERSONAL_WORK,
  STORY_WINDOWS,
  STORY_SKILLS,
  WORLD_OPENING,
} from "@/lib/data/anime-story";
import { RECOMMENDATIONS } from "@/lib/data/recommendations";
import VoiceCard from "./VoiceCard";

function Panel({ progress, win, align = "left", children, id }) {
  const opacity = windowOpacity(progress, win.start, win.end, 0.04);
  if (opacity <= 0.01) return null;

  return (
    <div id={id} className={`cinema-panel cinema-panel--${align}`} style={{ opacity }} aria-hidden={opacity < 0.2}>
      <div className="cinema-panel-inner">{children}</div>
    </div>
  );
}

export default function AnimeOverlay({ progress }) {
  const [activeFragment, setActiveFragment] = useState(null);
  const projectIndex = Math.min(
    STORY_CLIENT_WORK.length - 1,
    Math.floor(segmentProgress(progress, 0.14, 0.28) * STORY_CLIENT_WORK.length)
  );
  const project = STORY_CLIENT_WORK[projectIndex];
  const voices = RECOMMENDATIONS.slice(0, 2);

  return (
    <div className="cinema-scroll-overlay">
      <Panel progress={progress} win={STORY_WINDOWS.prologue} align="center">
        <p className="anime-statement anime-statement--whisper text-[var(--mw-ivory,var(--story-ivory))]">
          {STORY_PROLOGUE.line1}
        </p>
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.nameReveal} align="center">
        <p className="anime-statement text-[var(--mw-vermilion,var(--story-red))]">{STORY_PROLOGUE.line2}</p>
        <h1 className="anime-statement mt-12 font-medium tracking-wide">{WORLD_OPENING.name}</h1>
        <p className="story-mono mt-5 text-[var(--story-grey)]">{WORLD_OPENING.roles}</p>
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.curiosity} align="left">
        <p className="story-mono text-[var(--mw-vermilion,var(--story-red))]">Curious</p>
        <p className="anime-statement mt-6">{STORY_CURIOSITY.line1}</p>
        <p className="anime-handnote mt-8 text-3xl">{STORY_CURIOSITY.line2}</p>
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.builder} align="left">
        <p className="story-mono text-[var(--story-grey)]">Chapter 02 · The builder</p>
        <p className="anime-statement mt-6">{STORY_BUILDER.line1}</p>
        <p className="anime-statement--whisper mt-4 text-[var(--story-cream)]">{STORY_BUILDER.line2}</p>
        {project ? (
          <article className="anime-episode-block">
            <p className="story-mono text-[var(--story-cyan)]">The problem</p>
            <h3 className="story-display mt-2 text-xl">{project.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--story-grey)]">{project.problem}</p>
            {project.visual?.nodes ? (
              <p className="story-mono mt-4 text-[10px] text-[var(--story-grey)]">
                {project.visual.nodes.join(" → ")}
              </p>
            ) : null}
            <Link href={`/projects/${project.slug}`} className="story-mono mt-4 inline-block text-[var(--story-grey)] hover:text-[var(--story-cyan)]">
              Enter the build →
            </Link>
          </article>
        ) : null}
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.failure} align="center">
        <p className="story-mono text-[var(--story-grey)]">Fail · Learn</p>
        <p className="anime-statement mt-6">{STORY_FAILURE.line1}</p>
        <p className="anime-statement--whisper mt-8 text-[var(--story-amber)]">{STORY_FAILURE.line2}</p>
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.learn} align="right">
        <p className="anime-handnote max-w-sm">Learn → understand → improve. The thread keeps moving.</p>
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.anime} align="right">
        <p className="story-mono text-[var(--story-grey)]">Worlds · Stories</p>
        <p className="anime-statement--whisper mt-6">{STORY_ANIME.line}</p>
        {STORY_ANIME.sub ? <p className="mt-4 max-w-sm text-sm text-[var(--story-grey)]">{STORY_ANIME.sub}</p> : null}
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.gaming} align="left">
        <p className="story-mono text-[var(--story-grey)]">Worlds · Play</p>
        <p className="anime-statement mt-6">{STORY_GAMING.line1}</p>
        <p className="anime-statement--whisper mt-4">{STORY_GAMING.line2}</p>
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.board} align="right">
        <p className="story-mono text-[var(--story-grey)]">Worlds · Strategy</p>
        <p className="anime-handnote mt-6 max-w-sm">{STORY_BOARD.line}</p>
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.people} align="center">
        <p className="story-mono text-[var(--story-grey)]">Chapter 05 · People</p>
        <p className="anime-statement mt-6">{STORY_PEOPLE.line1}</p>
        <p className="anime-statement--whisper mt-4 text-[var(--story-cyan)]">{STORY_PEOPLE.line2}</p>
        <div className="mt-10 grid gap-8 text-left lg:grid-cols-2">
          {voices.map((item) => (
            <VoiceCard key={item.id} item={item} />
          ))}
        </div>
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.travel} align="left">
        <p className="story-mono text-[var(--story-grey)]">Chapter 06 · The world outside</p>
        {STORY_TRAVEL.lines.map((line) => (
          <p key={line} className="anime-statement mt-6 first:mt-4 text-2xl sm:text-3xl">
            {line}
          </p>
        ))}
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.personal} align="right">
        <p className="story-mono text-[var(--story-amber)]">Chapter 07 · Personal worlds</p>
        <p className="anime-statement mt-6">{STORY_PERSONAL.line1}</p>
        <p className="anime-statement--whisper mt-4">{STORY_PERSONAL.line2}</p>
        <ul className="mt-8 space-y-3 text-right text-sm text-[var(--story-grey)]">
          {STORY_PERSONAL_WORK.slice(0, 4).map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} className="hover:text-[var(--story-cyan)]">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.growth} align="center">
        <p className="story-mono text-[var(--story-grey)]">Become</p>
        <p className="anime-statement mt-6">{STORY_GROWTH.line1}</p>
        <p className="anime-statement mt-6 text-[var(--story-amber)]">{STORY_GROWTH.line2}</p>
        <p className="anime-handnote mt-8 max-w-lg">{STORY_LEADERSHIP.line}</p>
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.identity} align="left" id="about">
        <p className="story-mono text-[var(--story-cyan)]">Chapter 09 · {STORY_IDENTITY.name}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {STORY_IDENTITY.fragments.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFragment(activeFragment === f.id ? null : f.id)}
              className="anime-identity-chip text-left"
            >
              <p className="story-display text-lg">{f.label}</p>
              {activeFragment === f.id ? (
                <p className="mt-2 text-sm leading-relaxed text-[var(--story-grey)]">{f.detail}</p>
              ) : null}
            </button>
          ))}
        </div>
        <p className="story-mono mt-8 text-[var(--story-grey)] opacity-60">{STORY_SKILLS.line}</p>
      </Panel>

      <Panel progress={progress} win={STORY_WINDOWS.final} align="center" id="contact">
        {STORY_FINAL.lines.map((line) => (
          <p key={line} className="anime-statement mt-8 first:mt-0 text-2xl sm:text-3xl">
            {line}
          </p>
        ))}
        <p className="story-editorial mt-12 text-2xl italic text-[var(--story-cyan)]">{STORY_FINAL.cta}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
          <a href={`mailto:${STORY_FINAL.email}`} className="story-mono text-[var(--story-cyan)] hover:underline">
            Email
          </a>
          <a href={STORY_FINAL.linkedIn} target="_blank" rel="noopener noreferrer" className="story-mono text-[var(--story-grey)] hover:text-[var(--story-ivory)]">
            LinkedIn
          </a>
          <a href={STORY_FINAL.github} target="_blank" rel="noopener noreferrer" className="story-mono text-[var(--story-grey)] hover:text-[var(--story-ivory)]">
            GitHub
          </a>
          <a href={STORY_FINAL.resume} className="story-mono text-[var(--story-grey)] hover:text-[var(--story-ivory)]">
            Resume
          </a>
          <Link href="/contact" className="story-mono text-[var(--story-grey)] hover:text-[var(--story-ivory)]">
            Contact →
          </Link>
        </div>
      </Panel>
    </div>
  );
}
