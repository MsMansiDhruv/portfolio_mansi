"use client";

import { Text } from "@react-three/drei";
import * as THREE from "three";
import { THEME_PALETTE } from "@/lib/data/precision";

/**
 * Spatial About Environment — Human Editorial Presence.
 * Mansi's philosophy: Curious, Systematic, Analytical, Creative.
 * Woven with her interests (Anime pacing, PC/Mobile gaming strategy, Travel, Community).
 */
export default function AboutWorld({ theme, activeView }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const isDay = theme === "day";
  const labelColor = isDay ? "#0c121a" : "#f0f4f9";

  return (
    <group position={[-3.2, 1.4, 4.0]}>
      {/* Background Translucent Instrument Plate */}
      <mesh position={[0, 0, -0.05]} receiveShadow>
        <planeGeometry args={[3.2, 2.2]} />
        <meshStandardMaterial
          color={isDay ? "#e4e8f0" : "#101824"}
          metalness={0.2}
          roughness={0.5}
          transparent
          opacity={isDay ? 0.85 : 0.92}
        />
      </mesh>

      {/* Header */}
      <Text
        position={[-1.35, 0.85, 0]}
        fontSize={0.062}
        color={p.amber}
        anchorX="left"
        letterSpacing={0.22}
      >
        MANSI · SYSTEM THINKER
      </Text>

      <Text
        position={[-1.35, 0.65, 0]}
        fontSize={0.092}
        color={labelColor}
        anchorX="left"
        letterSpacing={0.12}
      >
        DATA ENGINEER & BUILDER
      </Text>

      {/* Editorial Body */}
      <Text
        position={[-1.35, 0.2, 0]}
        fontSize={0.056}
        color={isDay ? "#2e3e50" : "#a8bacf"}
        anchorX="left"
        maxWidth={2.7}
        lineHeight={1.45}
      >
        I design resilient data lakes, automated ETL pipelines, and real-time streaming engines.
        For me, data is not static storage — it is a living system of signals, state transformations,
        and analytical velocity.
      </Text>

      {/* Philosophy Vectors */}
      <Text
        position={[-1.35, -0.38, 0]}
        fontSize={0.052}
        color={p.amber}
        anchorX="left"
        letterSpacing={0.16}
      >
        CURIOUS · SYSTEMATIC · CREATIVE · ANALYTICAL · BUILDER
      </Text>

      <Text
        position={[-1.35, -0.65, 0]}
        fontSize={0.048}
        color={isDay ? "#4a5a6c" : "#8aa0b8"}
        anchorX="left"
        maxWidth={2.7}
        lineHeight={1.4}
      >
        Influenced by strategic game loops, cinematic chapter pacing, community network nodes,
        and continuous hands-on experimentation.
      </Text>
    </group>
  );
}
