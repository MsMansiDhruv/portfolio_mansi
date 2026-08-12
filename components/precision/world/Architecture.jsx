"use client";

import { THEME_PALETTE } from "@/lib/data/precision";

/**
 * Minimal spatial frame — scale without a cinematic room.
 * Floor + quiet horizon only. Data carries the architecture.
 */
export default function Architecture({ theme }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const day = theme === "day";

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[22, 40]} />
        <meshStandardMaterial
          color={p.floor}
          metalness={0.55}
          roughness={0.62}
          transparent
          opacity={day ? 0.55 : 0.7}
        />
      </mesh>

      {/* Soft horizon band — depth cue, not a wall */}
      <mesh position={[0, 0.02, -18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 6]} />
        <meshBasicMaterial
          color={day ? "#b8c2ce" : "#151c28"}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Center guide rail — system axis */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[0.06, 32]} />
        <meshBasicMaterial
          color={p.aluminium}
          transparent
          opacity={day ? 0.28 : 0.18}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
