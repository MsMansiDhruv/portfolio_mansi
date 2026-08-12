"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { THEME_PALETTE } from "@/lib/data/precision";
import ExhibitPipeline from "./ExhibitPipeline";

/**
 * Architectural Project Installation in the spatial exhibition hall.
 * Floating precision pedestal with metal/glass materials.
 * Approaching the exhibit wakes its data particles and displays the spatial ENTER callout.
 */
export default function ProjectExhibit({
  exhibit,
  theme,
  hovered,
  focused,
  onSelect,
  onHover,
  cursorRef,
}) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const isDay = theme === "day";
  const labelColor = isDay ? "#0c121a" : "#f0f4f9";
  const root = useRef();
  const glow = useRef(0);
  const expand = useRef(0);
  const [localHover, setLocalHover] = useState(false);
  const isHot = hovered || localHover;

  useFrame((_, dt) => {
    if (!root.current) return;
    const d = Math.min(dt, 0.05);
    const target = focused ? 1 : isHot ? 0.88 : 0.08;
    glow.current = THREE.MathUtils.damp(glow.current, target, 3.5, d);
    expand.current = THREE.MathUtils.damp(expand.current, focused ? 1 : 0, 1.8, d);

    const s = 1 + expand.current * 0.06 + (isHot && !focused ? 0.03 : 0);
    root.current.scale.setScalar(
      THREE.MathUtils.damp(root.current.scale.x, s, 3.2, d)
    );
  });

  return (
    <group
      ref={root}
      position={exhibit.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(exhibit);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setLocalHover(true);
        onHover?.(exhibit.slug);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setLocalHover(false);
        onHover?.(null);
      }}
    >
      {/* Precision Metallic Base Structure */}
      <mesh position={[0, 0.22, 0]} visible={!focused}>
        <boxGeometry args={[1.4, 0.44, 0.48]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.78} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.46, 0]} visible={!focused}>
        <boxGeometry args={[1.52, 0.04, 0.58]} />
        <meshStandardMaterial
          color={p.aluminium}
          metalness={0.92}
          roughness={0.18}
          emissive={p.amber}
          emissiveIntensity={glow.current * 0.28}
        />
      </mesh>

      {/* Spatial Frame Instrument Plate */}
      <mesh position={[0, 1.5, 0]} visible={!focused}>
        <boxGeometry args={[1.75, 1.25, 0.06]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.82} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.5, 0.04]} visible={!focused}>
        <planeGeometry args={[1.58, 1.08]} />
        <meshStandardMaterial
          color={isDay ? "#cfd6e2" : "#141c26"}
          metalness={0.25}
          roughness={0.48}
          emissive={p.amber}
          emissiveIntensity={glow.current * 0.16}
        />
      </mesh>

      {/* Floating Spatial Label — Calls out PROJECT / Title / ENTER */}
      {isHot && !focused && (
        <group position={[0, 2.45, 0.1]}>
          <Text
            fontSize={0.062}
            color={p.amber}
            anchorX="center"
            letterSpacing={0.18}
          >
            {`PROJECT ${exhibit.number}`}
          </Text>
          <Text
            position={[0, -0.15, 0]}
            fontSize={0.084}
            color={labelColor}
            anchorX="center"
            maxWidth={2.2}
            textAlign="center"
          >
            {exhibit.title}
          </Text>
          <Text
            position={[0, -0.32, 0]}
            fontSize={0.058}
            color={p.amber}
            anchorX="center"
            letterSpacing={0.2}
          >
            ENTER STREAM →
          </Text>
        </group>
      )}

      {/* Hit Volume for smooth hovering & clicking */}
      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[2.2, 2.6, 1.6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {(focused || isHot) && (
        <ExhibitPipeline
          exhibit={exhibit}
          theme={theme}
          intensity={focused ? 1 : 0.65}
          active
          cursorRef={cursorRef}
        />
      )}
    </group>
  );
}

