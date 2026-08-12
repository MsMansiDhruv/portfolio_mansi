"use client";

import { useMemo } from "react";
import { segmentProgress, windowOpacity } from "@/components/cinema/scroll/useScrollProgress";
import SilhouetteCharacter from "@/components/anime-cinema/SilhouetteCharacter";
import StoryMotif from "@/components/world/StoryMotif";
import { EXPERIENCE_PROJECTS, EXPERIENCE_PIPELINE } from "@/lib/data/mansi-experience";

function ease(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function pickPose(progress) {
  if (progress < 0.1) return { pose: "back", facing: "right", rim: "warm" };
  if (progress < 0.22) return { pose: "standing", facing: "right", rim: "cyan" };
  if (progress < 0.42) return { pose: "walking", facing: "right", rim: "gold" };
  if (progress < 0.58) return { pose: "standing", facing: "left", rim: "warm" };
  if (progress < 0.72) return { pose: "sitting", facing: "right", rim: "cyan" };
  if (progress < 0.9) return { pose: "walking", facing: "right", rim: "warm" };
  return { pose: "back", facing: "right", rim: "warm" };
}

export default function ExperienceVisual({ progress }) {
  const introT = segmentProgress(progress, 0, 0.16);
  const playT = segmentProgress(progress, 0.19, 0.24) * (1 - segmentProgress(progress, 0.26, 0.3));
  const storiesT = segmentProgress(progress, 0.23, 0.28) * (1 - segmentProgress(progress, 0.3, 0.34));
  const shuttleT = segmentProgress(progress, 0.27, 0.315) * (1 - segmentProgress(progress, 0.33, 0.37));
  const travelT = segmentProgress(progress, 0.305, 0.35) * (1 - segmentProgress(progress, 0.37, 0.41));
  const peopleT = segmentProgress(progress, 0.34, 0.39) * (1 - segmentProgress(progress, 0.41, 0.45));
  const leadT = segmentProgress(progress, 0.38, 0.43) * (1 - segmentProgress(progress, 0.45, 0.49));
  const engT = segmentProgress(progress, 0.56, 0.68) * (1 - segmentProgress(progress, 0.7, 0.76));
  const projT = segmentProgress(progress, 0.68, 0.82) * (1 - segmentProgress(progress, 0.86, 0.92));
  const finalT = segmentProgress(progress, 0.92, 1);

  const { pose, facing, rim } = pickPose(progress);
  const projects = useMemo(() => EXPERIENCE_PROJECTS, []);
  const pipeline = useMemo(() => EXPERIENCE_PIPELINE, []);

  const charX = 12 + ease(Math.min(1, progress * 1.05)) * 52;
  const charY = 76 - ease(engT) * 12 - ease(finalT) * 8;
  const charScale = 0.28 + ease(introT) * 0.22 + ease(peopleT) * 0.08;
  const charOpacity = progress < 0.08 ? 0 : 0.2 + ease(Math.min(1, (progress - 0.06) * 2)) * 0.8;

  const shuttlePath = "M 420 520 Q 580 380 720 320 T 980 280";

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <StoryMotif progress={progress} />

      {/* Translucent grade only — the 3D world beneath provides the environment */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% ${55 - finalT * 20}%, rgba(168,72,72,0.07), transparent 55%)`,
        }}
      />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        {/* Play — board + controller hint */}
        <g opacity={0.08 + playT * 0.4}>
          <rect x="140" y="520" width="160" height="8" rx="1" fill="var(--mx-cream)" />
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect key={`${r}-${c}`} x={160 + c * 28} y={460 + r * 28} width={24} height={24} fill="none" stroke="var(--mx-amber)" strokeWidth="0.4" opacity="0.5" />
            ))
          )}
          <rect x="980" y="500" width="80" height="48" rx="4" fill="none" stroke="var(--mx-teal)" strokeWidth="0.5" opacity="0.4" />
        </g>

        {/* Stories — cinematic frames */}
        <g opacity={0.06 + storiesT * 0.42}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={680 + i * 40} y={320 - i * 20} width={120} height={70} fill="var(--mx-smoke)" stroke="var(--mx-ivory)" strokeWidth="0.35" opacity={0.35 - i * 0.08} />
          ))}
        </g>

        {/* Badminton shuttle arc */}
        <g opacity={shuttleT > 0.1 ? 0.15 + shuttleT * 0.55 : 0}>
          <path
            d={shuttlePath}
            fill="none"
            stroke="var(--mx-vermilion)"
            strokeWidth="1.2"
            strokeDasharray="480"
            strokeDashoffset={480 * (1 - shuttleT)}
            opacity="0.6"
          />
          <circle cx={420 + shuttleT * 560} cy={520 - shuttleT * 240} r="4" fill="var(--mx-vermilion)" />
        </g>

        {/* Travel route */}
        <g opacity={0.08 + travelT * 0.38}>
          <path d="M 80 600 Q 300 520 520 540 T 920 500 T 1100 480" fill="none" stroke="var(--mx-cream)" strokeWidth="0.8" opacity="0.35" strokeDasharray="8 6" />
          <circle cx="200" cy="560" r="3" fill="var(--mx-amber)" opacity="0.5" />
          <circle cx="520" cy="538" r="3" fill="var(--mx-amber)" opacity="0.5" />
          <circle cx="900" cy="502" r="3" fill="var(--mx-amber)" opacity="0.5" />
        </g>

        {/* Community */}
        <g opacity={0.1 + peopleT * 0.5}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const cx = 600 + Math.cos(angle) * (90 + peopleT * 30);
            const cy = 420 + Math.sin(angle) * 24;
            return (
              <g key={i}>
                <ellipse cx={cx} cy={cy} rx="8" ry="14" fill="var(--mx-ivory)" opacity="0.1" />
                {i > 0 ? <line x1="600" y1="420" x2={cx} y2={cy} stroke="var(--mx-vermilion)" strokeWidth="0.35" opacity={peopleT * 0.35} /> : null}
              </g>
            );
          })}
        </g>

        {/* Leadership paths */}
        <g opacity={0.07 + leadT * 0.4}>
          <path d="M 480 680 Q 520 520 540 360" fill="none" stroke="var(--mx-vermilion)" strokeWidth="0.6" opacity="0.35" />
          <path d="M 540 360 L 620 340 M 540 360 L 460 340" fill="none" stroke="var(--mx-vermilion)" strokeWidth="0.4" opacity={leadT * 0.4} />
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx={560 + i * 24} cy={350 - i * 8} rx="6" ry="11" fill="var(--mx-ivory)" opacity={0.08 + leadT * 0.15} />
          ))}
        </g>

        {/* Engineering — pipeline flow */}
        <g opacity={0.08 + engT * 0.55}>
          {pipeline.map((n, i) => {
            const x = 120 + i * 210;
            const y = 640;
            const flow = engT > i * 0.12;
            return (
              <g key={n.stage} opacity={flow ? 1 : 0.3}>
                <rect x={x - 20} y={y - 20} width={40} height={40} fill="none" stroke="var(--mx-teal)" strokeWidth="0.6" />
                <text x={x} y={y + 36} textAnchor="middle" fill="var(--mx-muted)" fontSize="9" fontFamily="var(--font-mono)">
                  {n.stage}
                </text>
                {i < pipeline.length - 1 ? (
                  <line x1={x + 24} y1={y} x2={x + 186} y2={y} stroke="var(--mx-teal)" strokeWidth="0.8" opacity={0.3 + engT * 0.4} strokeDasharray="6 4" />
                ) : null}
              </g>
            );
          })}
        </g>

        {/* Project installations */}
        {projects.map((_, i) => {
          const x = 180 + i * 180;
          const h = 30 + projT * (40 + i * 15);
          const vis = projT > i * 0.12;
          return (
            <g key={i} opacity={vis ? 0.15 + projT * 0.45 : 0}>
              <rect x={x} y={580 - h} width={36} height={h} fill="var(--mx-smoke)" stroke="var(--mx-vermilion)" strokeWidth="0.5" />
            </g>
          );
        })}
      </svg>

      <div
        className="pointer-events-none absolute"
        style={{
          left: `${charX}%`,
          top: `${charY}%`,
          width: "min(18vw, 140px)",
          height: "min(32vw, 220px)",
          transform: `translate(-50%, -50%) scale(${charScale})`,
          opacity: charOpacity,
        }}
      >
        <SilhouetteCharacter pose={pose} facing={facing} rim={rim} />
      </div>

      <div className="mx-vignette" />
    </div>
  );
}
