"use client";

import Image from "next/image";
import { useMemo } from "react";
import { segmentProgress, windowOpacity } from "./useScrollProgress";
import { STORY_JOURNEY } from "@/lib/data/story";
import { STORY_BRANCHES } from "@/lib/data/story-branches";
import { PLATFORM_ARCHITECTURE_FLOW } from "@/lib/data/home-content";
import { CHARACTER } from "@/lib/data/identity";

function ease(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function ScrollCinematicVisual({ progress }) {
  const roomOpacity = windowOpacity(progress, 0, 0.18, 0.08);
  const codeT = segmentProgress(progress, 0.08, 0.22);
  const roadT = segmentProgress(progress, 0.2, 0.58);
  const branchT = segmentProgress(progress, 0.52, 0.72);
  const pipeT = segmentProgress(progress, 0.64, 0.82);

  const characterX = 18 + ease(Math.min(1, progress * 1.4)) * 52;
  const characterY = 58 - ease(roadT) * 18;
  const characterScale = 0.72 + ease(roadT) * 0.28;
  const characterOpacity = 0.35 + ease(Math.min(1, progress * 2)) * 0.65;

  const roadPath = "M 40 520 Q 180 480 320 500 T 560 460 T 820 490 T 1100 470";
  const roadLen = 900;
  const roadOffset = roadLen * (1 - roadT);

  const codePath = "M 120 420 L 280 400 L 420 380 L 520 360";
  const codeLen = 450;
  const codeOffset = codeLen * (1 - codeT);

  const milestones = useMemo(() => STORY_JOURNEY, []);
  const nodes = PLATFORM_ARCHITECTURE_FLOW;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--story-midnight)]" aria-hidden>
      {/* Room */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: roomOpacity,
          background:
            "radial-gradient(ellipse 35% 25% at 22% 72%, rgba(94,184,196,0.14), transparent 55%), linear-gradient(180deg, #0a0e16 0%, #0b0f18 100%)",
        }}
      />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        {/* Career road */}
        <path
          d={roadPath}
          fill="none"
          stroke="var(--story-ivory)"
          strokeWidth="1.5"
          strokeOpacity={0.12 + roadT * 0.25}
          strokeDasharray={roadLen}
          strokeDashoffset={roadOffset}
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />

        {/* Code → architecture line */}
        <path
          d={codePath}
          fill="none"
          stroke="var(--story-cyan)"
          strokeWidth="2"
          strokeOpacity={codeT * 0.7}
          strokeDasharray={codeLen}
          strokeDashoffset={codeOffset}
        />

        {/* Milestones on road */}
        {milestones.map((m, i) => {
          const t = 0.12 + (i / Math.max(1, milestones.length - 1)) * 0.75;
          const x = 40 + t * 900;
          const y = 520 - Math.sin(t * Math.PI) * 40;
          const visible = roadT > t - 0.08;
          return (
            <g key={m.id} opacity={visible ? 0.35 + roadT * 0.5 : 0}>
              <circle cx={x} cy={y} r="4" fill="var(--story-cyan)" opacity="0.6" />
              <text x={x} y={y - 12} textAnchor="middle" fill="var(--story-grey)" fontSize="11" fontFamily="var(--font-mono)">
                {m.year}
              </text>
            </g>
          );
        })}

        {/* Branches */}
        {STORY_BRANCHES.map((b, i) => {
          const bx = 520 + i * 90;
          const by = 480;
          const ex = bx + Math.cos(b.angle) * 120;
          const ey = by + Math.sin(b.angle) * 80;
          const len = 140;
          const off = len * (1 - branchT);
          return (
            <path
              key={b.id}
              d={`M ${bx} ${by} L ${ex} ${ey}`}
              fill="none"
              stroke="var(--story-amber)"
              strokeWidth="1"
              strokeOpacity={0.15 + branchT * 0.35}
              strokeDasharray={len}
              strokeDashoffset={off}
            />
          );
        })}

        {/* Pipeline nodes */}
        {nodes.map((n, i) => {
          const x = 200 + i * 220;
          const y = 620;
          const vis = pipeT > i * 0.15;
          return (
            <g key={n.stage} opacity={vis ? 0.2 + pipeT * 0.5 : 0}>
              <circle cx={x} cy={y} r="5" fill="var(--story-cyan)" />
              {i < nodes.length - 1 ? (
                <line x1={x + 8} y1={y} x2={x + 212} y2={y} stroke="var(--story-cyan)" strokeWidth="0.75" opacity="0.4" />
              ) : null}
              <text x={x} y={y + 22} textAnchor="middle" fill="var(--story-grey)" fontSize="10" fontFamily="var(--font-mono)">
                {n.stage}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Character */}
      <div
        className="pointer-events-none absolute transition-all duration-300 ease-out"
        style={{
          left: `${characterX}%`,
          top: `${characterY}%`,
          transform: `translate(-50%, -50%) scale(${characterScale})`,
          opacity: characterOpacity,
          width: "min(28vw, 220px)",
          aspectRatio: "3/4",
          position: "absolute",
        }}
      >
        <Image
          src={CHARACTER.src}
          alt=""
          fill
          className="object-contain object-bottom drop-shadow-[0_0_40px_rgba(94,184,196,0.15)]"
          sizes="220px"
          priority
        />
      </div>

      <div className="cinema-vignette absolute inset-0" />
    </div>
  );
}
