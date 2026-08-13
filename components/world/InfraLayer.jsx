"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { THEME, semanticColor } from "@/lib/data/data-world";

function Frame({ position, args, color }) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.7}
        roughness={0.4}
        transparent
        opacity={0.02}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Distant engineering-diagram architecture.
 * Almost invisible until a related technology wakes it.
 */
export default function InfraLayer({ themeId, stateRef }) {
  const root = useRef();
  const groups = useRef({
    cloud: null,
    platform: null,
    storage: null,
    analytics: null,
    ai: null,
  });
  const opacities = useRef({
    cloud: 0.02,
    platform: 0.02,
    storage: 0.02,
    analytics: 0.02,
    ai: 0.02,
  });
  const t = THEME[themeId] || THEME.night;

  useFrame((_, dt) => {
    if (!root.current) return;
    const d = Math.min(dt, 0.05);
    const wake = stateRef?.current?.infraWake || null;
    const reveal = stateRef?.current?.reveal ?? 1;
    const story = stateRef?.current?.story || "explore";
    const baseVisible = story === "silence" ? 0 : 0.018 * reveal;

    Object.keys(opacities.current).forEach((key) => {
      const target = wake === key ? 0.22 * reveal : baseVisible;
      opacities.current[key] = THREE.MathUtils.damp(
        opacities.current[key],
        target,
        3.5,
        d
      );
      const g = groups.current[key];
      if (!g) return;
      g.traverse((obj) => {
        if (obj.material && obj.material.opacity !== undefined) {
          obj.material.opacity = opacities.current[key];
        }
      });
    });

    root.current.rotation.y = (stateRef?.current?.globeRotY || 0) * 0.15;
  });

  const steel = t.steel;
  const data = semanticColor("data", themeId);
  const transform = semanticColor("transform", themeId);
  const ai = semanticColor("ai", themeId);

  return (
    <group ref={root} position={[0, -0.4, -1.2]} scale={1.15}>
      {/* CLOUD — vertical frames / towers behind globe */}
      <group
        ref={(r) => {
          groups.current.cloud = r;
        }}
        position={[-3.8, 0.2, -2.5]}
      >
        <Frame position={[-0.4, 0.6, 0]} args={[0.04, 2.2, 0.04]} color={steel} />
        <Frame position={[0.2, 0.9, 0.1]} args={[0.04, 2.8, 0.04]} color={steel} />
        <Frame position={[0.8, 0.4, -0.2]} args={[0.04, 1.8, 0.04]} color={steel} />
        <Frame position={[0.2, 1.6, 0]} args={[1.4, 0.03, 0.03]} color={steel} />
        <Frame position={[0.2, 0.8, 0]} args={[1.4, 0.03, 0.03]} color={steel} />
        <Frame position={[0.5, 0.2, 0.3]} args={[0.5, 0.35, 0.5]} color={steel} />
      </group>

      {/* PLATFORM — processing chambers */}
      <group
        ref={(r) => {
          groups.current.platform = r;
        }}
        position={[3.6, 0.1, -2.2]}
      >
        <Frame position={[0, 0.5, 0]} args={[1.2, 0.08, 0.8]} color={transform} />
        <Frame position={[0, 0.9, 0]} args={[1.0, 0.08, 0.65]} color={transform} />
        <Frame position={[0, 1.3, 0]} args={[0.8, 0.08, 0.5]} color={transform} />
        <Frame position={[-0.7, 0.9, 0]} args={[0.04, 1.4, 0.04]} color={steel} />
        <Frame position={[0.7, 0.9, 0]} args={[0.04, 1.4, 0.04]} color={steel} />
        <Frame position={[0, 1.6, 0.4]} args={[0.35, 0.5, 0.35]} color={transform} />
      </group>

      {/* STORAGE — stacked planes */}
      <group
        ref={(r) => {
          groups.current.storage = r;
        }}
        position={[0.2, -1.1, -3.2]}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Frame
            key={i}
            position={[i * 0.08, i * 0.18, -i * 0.05]}
            args={[1.6 - i * 0.12, 0.05, 0.9 - i * 0.08]}
            color={data}
          />
        ))}
      </group>

      {/* ANALYTICS — grid + bridges */}
      <group
        ref={(r) => {
          groups.current.analytics = r;
        }}
        position={[2.2, -0.6, -3.6]}
      >
        <Frame position={[0, 0.3, 0]} args={[1.8, 0.03, 1.2]} color={steel} />
        <Frame position={[-0.6, 0.7, 0]} args={[0.03, 0.8, 0.03]} color={steel} />
        <Frame position={[0.6, 0.7, 0]} args={[0.03, 0.8, 0.03]} color={steel} />
        <Frame position={[0, 1.1, 0]} args={[1.4, 0.03, 0.03]} color={data} />
        <Frame position={[0, 0.5, 0.5]} args={[0.9, 0.03, 0.03]} color={data} />
      </group>

      {/* AI — lattice */}
      <group
        ref={(r) => {
          groups.current.ai = r;
        }}
        position={[-2.4, 0.8, -3.4]}
      >
        {[-0.4, 0, 0.4].map((x) =>
          [-0.4, 0, 0.4].map((y) => (
            <Frame
              key={`${x}-${y}`}
              position={[x, y + 0.6, 0]}
              args={[0.06, 0.06, 0.06]}
              color={ai}
            />
          ))
        )}
        <Frame position={[0, 0.6, 0]} args={[0.9, 0.02, 0.02]} color={ai} />
        <Frame position={[0, 0.6, 0]} args={[0.02, 0.9, 0.02]} color={ai} />
        <Frame position={[0, 0.6, 0]} args={[0.02, 0.02, 0.7]} color={ai} />
      </group>
    </group>
  );
}
