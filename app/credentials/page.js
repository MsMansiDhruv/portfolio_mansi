"use client";

import Link from "next/link";
import StoryChapterShell from "@/components/world/StoryChapterShell";
import CareerTimelineCinematic from "@/components/cinema/CareerTimelineCinematic";
import SkillConstellation from "@/components/cinema/SkillConstellation";
import AchievementPanel from "@/components/cinema/AchievementPanel";
import VoicesScene from "@/components/story/VoicesScene";
import LifeBeyond from "@/components/story/LifeBeyond";
import { ABOUT_ME, getAboutHeroLine } from "@/lib/data/career";
import { CAREER_EVOLUTION } from "@/lib/data/credentials-content";
import { STORY_PAGE_META } from "@/lib/data/anime-story";

export default function CredentialsPage() {
  const heroLine = getAboutHeroLine();
  const meta = STORY_PAGE_META.journey;

  return (
    <StoryChapterShell chapter={meta.chapter} title={meta.title} subtitle={meta.subtitle}>
      <div className="mx-auto max-w-[1200px] px-5 sm:px-10 lg:px-14">
        <p className="story-editorial max-w-2xl text-xl italic leading-relaxed text-[var(--story-cream)]">{heroLine}</p>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--story-grey)]">{ABOUT_ME[0]}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--story-grey)]">{ABOUT_ME[1]}</p>

        <div className="mt-12 flex flex-wrap gap-3">
          {CAREER_EVOLUTION.map((e) => (
            <span key={e.label} className="story-mono border border-white/[0.08] px-3 py-2 text-[var(--story-grey)]">
              {e.era} · {e.label}
            </span>
          ))}
        </div>
      </div>

      <CareerTimelineCinematic showHeader={false} />
      <LifeBeyond />

      <div className="px-5 py-16 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-[1200px]">
          <p className="story-mono text-[var(--story-grey)]">Skills accumulated along the way</p>
          <div className="mt-8">
            <SkillConstellation />
          </div>
        </div>
      </div>

      <div className="border-y border-white/[0.06] px-5 py-16 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-[1200px]">
          <AchievementPanel />
        </div>
      </div>

      <div id="recommendations">
        <VoicesScene />
      </div>

      <div className="px-5 py-16 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-[1200px]">
          <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="story-mono text-[var(--story-grey)] hover:text-[var(--story-ivory)]">
            Complete résumé (PDF) →
          </Link>
        </div>
      </div>
    </StoryChapterShell>
  );
}
