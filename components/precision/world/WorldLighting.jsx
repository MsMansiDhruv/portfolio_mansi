"use client";

import { useMemo } from "react";
import { THEME_PALETTE } from "@/lib/data/precision";

export default function WorldLighting({ theme }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;

  const keyPos = useMemo(
    () => (theme === "day" ? [4, 8, 8] : [2.5, 6.5, 6]),
    [theme]
  );

  return (
    <>
      <color attach="background" args={[p.background]} />
      <fog attach="fog" args={[p.fog, p.fogNear, p.fogFar]} />
      <ambientLight intensity={p.ambient} />
      <directionalLight
        position={keyPos}
        intensity={p.key}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={60}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        color={theme === "day" ? "#fff6e8" : "#e8edf4"}
      />
      <directionalLight
        position={[-5, 3, -8]}
        intensity={p.rim}
        color={theme === "day" ? "#e8e0d2" : "#8a96a6"}
      />
      <pointLight position={[0, 4.6, 12]} intensity={theme === "day" ? 0.35 : 0.55} distance={18} color={theme === "day" ? "#fff2dc" : "#c5ced8"} />
      <pointLight position={[0, 4.6, 0]} intensity={theme === "day" ? 0.3 : 0.45} distance={16} color={theme === "day" ? "#fff2dc" : "#c5ced8"} />
      <pointLight position={[0, 2.2, 0.5]} intensity={0.22} distance={10} color={p.amber} />
    </>
  );
}
