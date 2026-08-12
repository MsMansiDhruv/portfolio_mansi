"use client";

import { useMemo } from "react";
import { THEME_PALETTE } from "@/lib/data/precision";

/** Cleaner lighting — fewer competing point lights = less flicker. */
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
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={55}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0002}
        color={theme === "day" ? "#f4f7fb" : "#e4ebf4"}
      />
      <directionalLight
        position={[-6, 4, -6]}
        intensity={p.rim * 0.85}
        color={theme === "day" ? "#d5dde8" : "#7a8a9c"}
      />
      <pointLight
        position={[0, 4.2, 14]}
        intensity={theme === "day" ? 0.35 : 0.45}
        distance={22}
        decay={2}
        color={theme === "day" ? "#eef2f8" : "#c0d0e0"}
      />
      <pointLight
        position={[0, 3.8, 4]}
        intensity={theme === "day" ? 0.28 : 0.35}
        distance={18}
        decay={2}
        color={p.amber}
      />
    </>
  );
}
