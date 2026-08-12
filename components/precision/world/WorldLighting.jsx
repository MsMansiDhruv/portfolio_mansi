"use client";

import { useMemo } from "react";
import { THEME_PALETTE } from "@/lib/data/precision";

/** Lean lighting — no shadow maps. Data carries the visual energy. */
export default function WorldLighting({ theme }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;

  const keyPos = useMemo(
    () => (theme === "day" ? [5, 9, 10] : [3, 7, 8]),
    [theme]
  );

  return (
    <>
      <color attach="background" args={[p.background]} />
      <fog attach="fog" args={[p.fog, p.fogNear, p.fogFar]} />
      <ambientLight intensity={p.ambient} />
      <hemisphereLight
        intensity={theme === "day" ? 0.35 : 0.28}
        color={theme === "day" ? "#eef2f8" : "#9eb0c4"}
        groundColor={theme === "day" ? "#a8b0bc" : "#121820"}
      />
      <directionalLight
        position={keyPos}
        intensity={p.key}
        color={theme === "day" ? "#f4f7fb" : "#e4ebf4"}
      />
      <directionalLight
        position={[-6, 4, -6]}
        intensity={p.rim * 0.85}
        color={theme === "day" ? "#d5dde8" : "#7a8a9c"}
      />
      <pointLight
        position={[0, 3.6, 6]}
        intensity={theme === "day" ? 0.22 : 0.3}
        distance={20}
        decay={2}
        color={p.amber}
      />
    </>
  );
}
