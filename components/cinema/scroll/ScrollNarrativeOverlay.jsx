"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { windowOpacity, segmentProgress } from "./useScrollProgress";
import { STORY_OPENING, STORY_JOURNEY, STORY_NOW, STORY_SYSTEMS, STORY_EPISODES_INTRO, STORY_VOICES_INTRO, STORY_WORKSHOP } from "@/lib/data/story";
import { STORY_BRANCHES, BRANCH_PROJECT_PREVIEW } from "@/lib/data/story-branches";
import { HOME_CASE_STUDIES } from "@/lib/data/home-content";
import { RECOMMENDATIONS, getRecommendationText } from "@/lib/data/recommendations";
import { PROFILE } from "@/lib/data/credentials-content";
import { getExperienceYearsText } from "@/lib/career/experience";

function Panel({ opacity, align = "left", children, className = "" }) {
  if (opacity <= 0.01) return null;

  return (
    <div
      className={`cinema-panel cinema-panel--${align} ${className}`}
      style={{ opacity }}
      aria-hidden={opacity < 0.2}
    >
      <div className="cinema-panel-inner">{children}</div>
    </div>
  );
}

function excerptText(text, maxLines = 3) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const lines = normalized.split("\n").filter((l) => l.trim());
  if (lines.length <= maxLines && normalized.length < 260) return normalized;
  return `${lines.slice(0, maxLines).join("\n").replace(/\s+$/, "")}...`;
}

function needsExpand(text) {
  return excerptText(text) !== text.replace(/\r\n/g, "\n").trim();
}

function publicLabel(item) {
  if (item.showIdentity) return item.name;
  const rel = (item.relationship || "Colleague").toUpperCase();
  if (rel.includes("CLIENT")) return "CLIENT";
  if (rel.includes("MANAGED")) return "MANAGED DIRECTLY";
  if (rel.includes("SENIOR")) return "SENIOR COLLEAGUE";
  if (rel.includes("TEAM")) return "TEAMMATE";
  return "COLLEAGUE";
}

function VoiceCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const text = getRecommendationText(item);
  const expandable = needsExpand(text);

  return (
    <blockquote className="border-l border-[var(--story-indigo)] pl-5">
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.p
            key="full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="story-editorial whitespace-pre-line text-base italic leading-relaxed text-[var(--story-cream)] sm:text-lg"
          >
            {text}
          </motion.p>
        ) : (
          <p className="story-editorial whitespace-pre-line text-base italic leading-relaxed text-[var(--story-cream)] sm:text-lg">
            {expandable ? excerptText(text) : text}
          </p>
        )}
      </AnimatePresence>
      <footer className="story-mono mt-4 text-[var(--story-grey)]">{publicLabel(item)}</footer>
      {expandable ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="story-mono mt-2 text-[var(--story-grey)] transition hover:text-[var(--story-ivory)]"
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Show more →"}
        </button>
      ) : null}
    </blockquote>
  );
}

export default function ScrollNarrativeOverlay({ progress }) {
  const openingOpacity = windowOpacity(progress, 0, 0.12, 0.05);
  const codeOpacity = windowOpacity(progress, 0.1, 0.2, 0.04);
  const journeyIndex = Math.min(
    STORY_JOURNEY.length - 1,
    Math.floor(segmentProgress(progress, 0.22, 0.56) * STORY_JOURNEY.length)
  );
  const journeyBeat = STORY_JOURNEY[journeyIndex];
  const journeyOpacity = windowOpacity(progress, 0.2, 0.58, 0.05);
  const nowOpacity = windowOpacity(progress, 0.52, 0.62, 0.04);
  const branchOpacity = windowOpacity(progress, 0.54, 0.7, 0.05);
  const systemsOpacity = windowOpacity(progress, 0.66, 0.78, 0.04);
  const episodesOpacity = windowOpacity(progress, 0.74, 0.84, 0.04);
  const voicesOpacity = windowOpacity(progress, 0.8, 0.9, 0.04);
  const workshopOpacity = windowOpacity(progress, 0.88, 1, 0.05);

  const episodes = HOME_CASE_STUDIES.filter((s) => s.kind !== "experiment").slice(0, 2);
  const voices = RECOMMENDATIONS.slice(0, 2);

  return (
    <div className="cinema-scroll-overlay">
      <Panel opacity={openingOpacity} align="left">
        <p className="story-mono text-[var(--story-grey)]">{STORY_OPENING.whisper}</p>
        <h1 className="story-display mt-6 text-[clamp(2rem,7vw,3.75rem)] font-medium tracking-tight text-[var(--story-ivory)]">
          {PROFILE.name}
        </h1>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {STORY_OPENING.roles.map((role) => (
            <span key={role} className="story-mono text-[var(--story-grey)]">
              {role}
            </span>
          ))}
        </div>
        <p className="story-editorial mt-8 max-w-lg text-[clamp(1.1rem,2.5vw,1.45rem)] italic leading-relaxed text-[var(--story-cream)]">
          {STORY_OPENING.line}
        </p>
        <p className="story-mono mt-8 text-[var(--story-grey)] opacity-70">Scroll to begin ↓</p>
      </Panel>

      <Panel opacity={codeOpacity} align="right">
        <p className="story-mono text-[var(--story-cyan)]">A line of code</p>
        <p className="story-editorial mt-4 text-2xl italic text-[var(--story-ivory)]">
          One line becomes structure.
        </p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--story-grey)]">
          In the dark, the screen is small. Then the line leaves the laptop — and becomes the road.
        </p>
      </Panel>

      <Panel opacity={journeyOpacity} align="left">
        <p className="story-mono text-[var(--story-grey)]">{journeyBeat?.focus}</p>
        <p className="story-display mt-4 text-5xl font-medium tabular-nums text-[var(--story-ivory)]">{journeyBeat?.year}</p>
        <p className="story-display mt-2 text-xl text-[var(--story-cream)]">{journeyBeat?.title}</p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--story-grey)]">{journeyBeat?.desc}</p>
        <p className="story-mono mt-6 text-[var(--story-grey)] opacity-60">{getExperienceYearsText()} on this road</p>
      </Panel>

      <Panel opacity={nowOpacity} align="left">
        <p className="story-mono text-[var(--story-amber)]">{STORY_NOW.arc}</p>
        <p className="story-display mt-4 text-5xl font-medium text-[var(--story-ivory)]">{STORY_NOW.year}</p>
        <h2 className="story-display mt-2 text-2xl text-[var(--story-cream)]">{STORY_NOW.title}</h2>
        <p className="story-editorial mt-5 max-w-md text-xl italic leading-relaxed text-[var(--story-grey)]">{STORY_NOW.desc}</p>
      </Panel>

      <Panel opacity={branchOpacity} align="right">
        <p className="story-mono text-[var(--story-grey)]">Paths branch</p>
        <p className="story-editorial mt-4 text-2xl italic text-[var(--story-ivory)]">People, places, builds.</p>
        <ul className="mt-8 space-y-5">
          {STORY_BRANCHES.map((branch) => (
            <li key={branch.id}>
              <Link
                href={branch.href}
                className="group block border-l border-white/[0.08] pl-4 transition hover:border-[var(--story-cyan)]"
              >
                <span className="story-mono text-[var(--story-cyan)]">{branch.label}</span>
                <p className="mt-1 text-sm text-[var(--story-grey)] transition group-hover:text-[var(--story-cream)]">
                  {branch.whisper}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        {BRANCH_PROJECT_PREVIEW ? (
          <p className="story-mono mt-8 text-[var(--story-grey)] opacity-60">
            Latest chapter: {BRANCH_PROJECT_PREVIEW.title}
          </p>
        ) : null}
      </Panel>

      <Panel opacity={systemsOpacity} align="left">
        <p className="story-mono text-[var(--story-grey)]">Scene 02</p>
        <h2 className="story-editorial mt-4 text-[clamp(1.5rem,3.5vw,2.25rem)] italic text-[var(--story-ivory)]">
          {STORY_SYSTEMS.title}
        </h2>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-[var(--story-grey)]">{STORY_SYSTEMS.line}</p>
      </Panel>

      <Panel opacity={episodesOpacity} align="left">
        <p className="story-mono text-[var(--story-grey)]">Scene 03</p>
        <h2 className="story-editorial mt-4 text-[clamp(1.5rem,3.5vw,2.25rem)] italic">{STORY_EPISODES_INTRO.title}</h2>
        <p className="mt-4 max-w-lg text-sm text-[var(--story-grey)]">{STORY_EPISODES_INTRO.line}</p>
        <div className="mt-10 space-y-8">
          {episodes.map((ep, i) => (
            <article key={ep.slug}>
              <p className="story-mono text-[var(--story-grey)]">Episode {String(i + 1).padStart(2, "0")}</p>
              <h3 className="story-display mt-2 text-xl font-medium">{ep.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--story-grey)]">{ep.problem}</p>
              <Link
                href={`/projects/${ep.slug}`}
                className="story-mono mt-4 inline-block text-[var(--story-grey)] transition hover:text-[var(--story-cyan)]"
              >
                Read the chapter →
              </Link>
            </article>
          ))}
        </div>
        <Link href="/projects" className="story-mono mt-8 inline-block text-[var(--story-grey)] hover:text-[var(--story-ivory)]">
          All episodes →
        </Link>
      </Panel>

      <Panel opacity={voicesOpacity} align="left" id="story-voices">
        <p className="story-mono text-[var(--story-grey)]">Scene 04</p>
        <h2 className="story-editorial mt-4 text-[clamp(1.5rem,3.5vw,2.25rem)] italic">{STORY_VOICES_INTRO.title}</h2>
        <p className="mt-4 max-w-lg text-sm text-[var(--story-grey)]">{STORY_VOICES_INTRO.line}</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {voices.map((item) => (
            <VoiceCard key={item.id} item={item} />
          ))}
        </div>
        <Link
          href="/credentials#recommendations"
          className="story-mono mt-10 inline-block text-[var(--story-grey)] hover:text-[var(--story-ivory)]"
        >
          All voices →
        </Link>
      </Panel>

      <Panel opacity={workshopOpacity} align="left">
        <p className="story-mono text-[var(--story-grey)]">Scene 05</p>
        <h2 className="story-editorial mt-4 text-[clamp(1.5rem,3.5vw,2.25rem)] italic">{STORY_WORKSHOP.title}</h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--story-grey)]">{STORY_WORKSHOP.line}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={STORY_WORKSHOP.href}
            className="story-mono border border-[var(--story-cyan)]/40 px-5 py-2.5 text-[var(--story-cyan)] transition hover:bg-[var(--story-cyan)]/10"
          >
            Enter the workshop →
          </Link>
          <Link
            href="/contact"
            className="story-mono border-b border-[var(--story-grey)] pb-0.5 text-[var(--story-grey)] hover:text-[var(--story-ivory)]"
          >
            Get in touch
          </Link>
        </div>
      </Panel>
    </div>
  );
}
