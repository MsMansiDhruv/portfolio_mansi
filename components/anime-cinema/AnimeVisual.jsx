"use client";

import { useMemo } from "react";
import { segmentProgress, windowOpacity } from "@/components/cinema/scroll/useScrollProgress";
import SilhouetteCharacter from "./SilhouetteCharacter";
import StoryMotif from "@/components/world/StoryMotif";
import { STORY_CLIENT_WORK } from "@/lib/data/anime-story";

function ease(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function pickPose(progress) {
  if (progress < 0.1) return { pose: "back", facing: "right", rim: "warm" };
  if (progress < 0.18) return { pose: "sitting", facing: "right", rim: "gold" };
  if (progress < 0.64) return { pose: "walking", facing: "right", rim: "cyan" };
  if (progress < 0.7) return { pose: "standing", facing: "left", rim: "warm" };
  if (progress < 0.92) return { pose: "walking", facing: "right", rim: "gold" };
  return { pose: "back", facing: "right", rim: "warm" };
}

export default function AnimeVisual({ progress }) {
  const prologueT = segmentProgress(progress, 0, 0.1);
  const curiosityT = segmentProgress(progress, 0.1, 0.18);
  const builderT = segmentProgress(progress, 0.16, 0.3);
  const failT = windowOpacity(progress, 0.28, 0.38, 0.02);
  const animeT = segmentProgress(progress, 0.42, 0.5);
  const gameT = segmentProgress(progress, 0.48, 0.54);
  const boardT = segmentProgress(progress, 0.52, 0.58);
  const peopleT = segmentProgress(progress, 0.56, 0.64);
  const travelT = segmentProgress(progress, 0.62, 0.7);
  const personalT = segmentProgress(progress, 0.68, 0.76);
  const growthT = segmentProgress(progress, 0.74, 0.84);
  const finalT = segmentProgress(progress, 0.9, 1);

  const { pose, facing, rim } = pickPose(progress);
  const memories = useMemo(() => STORY_CLIENT_WORK.slice(0, 4), []);

  const charX = 10 + ease(Math.min(1, progress * 1.1)) * 58;
  const charY = 78 - ease(builderT) * 14 - ease(finalT) * 10;
  const charScale = 0.3 + ease(prologueT) * 0.2 + ease(builderT) * 0.25 + (progress > 0.56 ? ease(peopleT) * 0.05 : 0);
  const charOpacity = 0.15 + ease(Math.min(1, progress * 2.2)) * 0.85;

  const cityLights = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        x: 5 + ((i * 97) % 90),
        y: 50 + ((i * 53) % 30),
        o: 0.15 + (i % 4) * 0.12,
      })),
    []
  );

  return (
    <div className="mansi-world absolute inset-0 overflow-hidden" aria-hidden>
      <StoryMotif progress={progress} />

      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 45% at 50% ${100 - finalT * 40}%, rgba(196,92,92,0.07), transparent 55%),
            radial-gradient(ellipse 60% 40% at 70% 20%, rgba(201,169,98,${0.04 + finalT * 0.1}), transparent 50%),
            linear-gradient(180deg, #060810 0%, var(--mw-midnight) 45%, #0a1018 100%)`,
        }}
      />

      {/* City edge — opening */}
      <div style={{ opacity: 0.1 + prologueT * 0.5 }} className="absolute inset-0">
        {cityLights.map((l, i) => (
          <span
            key={i}
            className="absolute rounded-sm bg-[var(--mw-ivory)]"
            style={{ left: `${l.x}%`, top: `${l.y}%`, width: 2, height: 5 + (i % 3), opacity: l.o }}
          />
        ))}
      </div>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        {/* Workshop / curiosity */}
        <g opacity={0.06 + curiosityT * 0.35}>
          <rect x="160" y="530" width="140" height="6" rx="1" fill="var(--mw-cream)" />
          <rect x="190" y="505" width="90" height="55" fill="none" stroke="var(--mw-cream)" strokeWidth="0.5" />
          <line x1="360" y1="540" x2="400" y2="510" stroke="var(--mw-amber)" strokeWidth="0.5" opacity="0.5" />
        </g>

        {/* Projects grow from sketches */}
        {memories.map((_, i) => {
          const x = 200 + i * 190;
          const h = 24 + builderT * (50 + i * 12);
          const vis = builderT > i * 0.1;
          return (
            <g key={i} opacity={vis ? 0.2 + builderT * 0.5 : 0}>
              <rect x={x} y={610 - h} width={32} height={h} fill="var(--mw-smoke)" stroke="var(--mw-teal)" strokeWidth="0.5" />
            </g>
          );
        })}

        {/* Failure */}
        <g opacity={failT > 0.2 ? failT : 0} className={failT > 0.55 ? "anime-glitch" : ""}>
          <rect x="460" y="570" width="90" height="45" fill="none" stroke="var(--mw-vermilion)" strokeWidth="1" />
          <line x1="480" y1="592" x2="530" y2="592" stroke="var(--mw-vermilion)" strokeWidth="2" opacity="0.45" />
        </g>

        {/* Anime screen */}
        <g opacity={0.08 + animeT * 0.42}>
          <rect x="740" y="370" width="170" height="95" fill="var(--mw-smoke)" stroke="var(--mw-ivory)" strokeWidth="0.4" opacity="0.45" />
          <rect x="755" y="385" width="140" height="65" fill="var(--mw-vermilion)" opacity="0.08" />
        </g>

        {/* Board */}
        <g opacity={0.06 + boardT * 0.32}>
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect key={`${r}-${c}`} x={390 + c * 26} y={470 + r * 26} width={22} height={22} fill="none" stroke="var(--mw-amber)" strokeWidth="0.35" opacity="0.45" />
            ))
          )}
        </g>

        {/* Community — motif connects figures */}
        <g opacity={0.1 + peopleT * 0.5}>
          <ellipse cx="600" cy="440" rx="150" ry="38" fill="var(--mw-blue)" opacity="0.35" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI + peopleT * 0.4;
            const cx = 600 + Math.cos(angle) * 110;
            const cy = 430 + Math.sin(angle) * 28;
            return (
              <g key={i}>
                <ellipse cx={cx} cy={cy} rx="9" ry="16" fill="var(--mw-ivory)" opacity="0.12" />
                {i > 0 ? (
                  <line x1={600} y1={440} x2={cx} y2={cy} stroke="var(--mw-vermilion)" strokeWidth="0.4" opacity={peopleT * 0.4} />
                ) : null}
              </g>
            );
          })}
        </g>

        {/* Travel */}
        <g opacity={0.08 + travelT * 0.38}>
          <rect x="60" y="350" width="220" height="110" fill="var(--mw-smoke)" stroke="var(--mw-cream)" strokeWidth="0.4" opacity="0.35" />
          <path d="M 80 410 L 260 395" stroke="var(--mw-vermilion)" strokeWidth="0.6" opacity="0.25" transform={`translate(${travelT * 35}, 0)`} />
          <path d="M 0 690 L 1200 665 L 1200 800 L 0 800 Z" fill="var(--mw-blue)" opacity="0.22" />
        </g>

        {/* Personal gallery orbs */}
        {personalT > 0.15
          ? [0, 1, 2, 3].map((i) => (
              <circle key={i} cx={280 + i * 110} cy={530 - personalT * 35} r={6 + i * 2} fill="none" stroke="var(--mw-amber)" strokeWidth="0.5" opacity={0.2 + personalT * 0.35} />
            ))
          : null}

        {/* Growth corridor + leadership path others follow */}
        <g opacity={0.07 + growthT * 0.35}>
          <path d="M 520 780 L 520 180" stroke="var(--mw-cream)" strokeWidth="0.5" opacity="0.18" strokeDasharray="6 10" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={520 + i * 8} cy={760 - i * 110 - growthT * 40} r="2" fill="var(--mw-vermilion)" opacity={0.2 + growthT * 0.35} />
          ))}
        </g>
      </svg>

      {/* Gaming glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "16%",
          bottom: "26%",
          width: "22%",
          height: "9%",
          opacity: gameT * 0.32,
          background: "radial-gradient(ellipse, rgba(94,184,196,0.18), transparent 70%)",
          filter: "blur(12px)",
        }}
      />

      {/* Sunrise finale */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: finalT * 0.7,
          background: "linear-gradient(180deg, rgba(201,169,98,0.18) 0%, transparent 42%)",
        }}
      />

      {/* Silhouette protagonist */}
      <div
        className="pointer-events-none absolute transition-all duration-300 ease-out"
        style={{
          left: `${charX}%`,
          top: `${charY}%`,
          width: "min(20vw, 150px)",
          height: "min(34vw, 240px)",
          transform: `translate(-50%, -50%) scale(${charScale})`,
          opacity: charOpacity,
        }}
      >
        <SilhouetteCharacter pose={pose} facing={facing} rim={rim} />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 78% 68% at 50% 48%, transparent 22%, rgba(6,8,16,${0.6 + finalT * 0.2}) 100%)`,
        }}
      />
    </div>
  );
}
