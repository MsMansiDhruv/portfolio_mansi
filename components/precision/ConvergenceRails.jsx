"use client";

import { useMemo } from "react";
import { remap, smoothstep } from "@/lib/data/precision";

/**
 * SVG engineered rails overlaid on the Convergence installation.
 * Cursor proximity awakens nearest rails; scroll drives alignment states.
 */
export default function ConvergenceRails({
  progress,
  stateId,
  cursor,
  visible,
}) {
  const rails = useMemo(
    () => [
      { id: "r0", d: "M 4 28 C 28 30, 42 44, 50 50", weight: 1 },
      { id: "r1", d: "M 2 40 C 30 42, 42 48, 50 50", weight: 1.1 },
      { id: "r2", d: "M 6 52 C 32 52, 44 51, 50 50", weight: 1 },
      { id: "r3", d: "M 3 64 C 28 60, 42 54, 50 50", weight: 0.95 },
      { id: "r4", d: "M 8 76 C 30 68, 44 56, 50 50", weight: 1 },
      { id: "r5", d: "M 96 30 C 72 34, 58 46, 50 50", weight: 1 },
      { id: "r6", d: "M 98 44 C 74 46, 58 49, 50 50", weight: 1.05 },
      { id: "r7", d: "M 94 58 C 72 56, 58 52, 50 50", weight: 1 },
      { id: "r8", d: "M 97 70 C 74 64, 58 54, 50 50", weight: 0.95 },
    ],
    []
  );

  const convergeT = smoothstep(0.36, 0.62, progress);
  const clarifyT = smoothstep(0.62, 0.8, progress);
  const outputT = smoothstep(0.8, 1, progress);
  const signalOn = stateId === "clarified" || stateId === "output";

  const cx = cursor?.nx ?? 0.5;
  const cy = cursor?.ny ?? 0.5;

  return (
    <div
      className="mp-rails"
      style={{
        opacity: visible * 0.95,
        transform: `scale(${1 + convergeT * 0.02})`,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <circle className="mp-mechanism-ring" cx="50" cy="50" r="7.5" />
        <circle
          className="mp-mechanism-ring"
          cx="50"
          cy="50"
          r={5.2 - convergeT * 0.6}
          opacity={0.5}
        />

        {rails.map((rail, i) => {
          const side = i < 5 ? "left" : "right";
          const railX = side === "left" ? 0.22 : 0.78;
          const railY = 0.28 + (i % 5) * 0.1;
          const dist = Math.hypot(cx - railX, cy - railY);
          const near = dist < 0.18 && stateId !== "clarified" && stateId !== "output";

          const pull = convergeT * (side === "left" ? 1.8 : -1.8);
          const quiet = clarifyT > 0.4 && i !== 2 && i !== 6;

          let className = "mp-rail";
          if (near || stateId === "observe") className += " is-near";
          if (stateId === "converging" || stateId === "observe") className += " is-active";
          if (quiet) className += " is-quiet";

          return (
            <path
              key={rail.id}
              className={className}
              d={rail.d}
              style={{
                strokeWidth: rail.weight,
                transform: `translate(${pull}px, ${convergeT * (i % 2 === 0 ? -0.4 : 0.4)}px)`,
                opacity: quiet ? 0.12 + (1 - clarifyT) * 0.3 : 0.35 + convergeT * 0.35,
              }}
            />
          );
        })}

        <path
          className="mp-rail mp-rail--out"
          d="M 50 50 L 92 50"
          style={{
            opacity: 0.15 + outputT * 0.75 + clarifyT * 0.25,
            strokeDasharray: 60,
            strokeDashoffset: 48 * (1 - outputT),
          }}
        />

        <circle
          className={`mp-signal${signalOn ? " is-on" : ""}`}
          cx="50"
          cy="50"
          r={1.1 + clarifyT * 0.35}
        />
      </svg>
    </div>
  );
}

export function actIIVisibility(globalProgress) {
  return remap(globalProgress, 0.34, 0.42) * (1 - remap(globalProgress, 0.86, 0.96));
}
