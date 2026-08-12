"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { THEME_PALETTE } from "@/lib/data/precision";
import ExhibitPipeline from "./ExhibitPipeline";

/**
 * Architectural project installation.
 * Hover wakes data + ENTER label. Click enters — camera travels through particles.
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
  const labelColor = theme === "day" ? "#12141a" : "#eef3f8";
  const root = useRef();
  const glow = useRef(0);
  const expand = useRef(0);
  const [localHover, setLocalHover] = useState(false);
  const isHot = hovered || localHover;

  useFrame((_, dt) => {
    if (!root.current) return;
    const d = Math.min(dt, 0.05);
    const target = focused ? 1 : isHot ? 0.85 : 0.1;
    glow.current = THREE.MathUtils.damp(glow.current, target, 3.2, d);
    expand.current = THREE.MathUtils.damp(expand.current, focused ? 1 : 0, 1.4, d);

    const s = 1 + expand.current * 0.08 + (isHot && !focused ? 0.02 : 0);
    root.current.scale.setScalar(
      THREE.MathUtils.damp(root.current.scale.x, s, 2.8, d)
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
      {/* Pedestal — quiet when inside */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow visible={!focused}>
        <boxGeometry args={[1.2, 0.56, 0.42]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.72} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0.58, 0]} visible={!focused}>
        <boxGeometry args={[1.35, 0.045, 0.5]} />
        <meshStandardMaterial
          color={p.aluminium}
          metalness={0.9}
          roughness={0.2}
          emissive={p.amber}
          emissiveIntensity={glow.current * 0.22}
        />
      </mesh>

      {/* Instrument frame — quiet surface, not a poster */}
      <mesh position={[0, 1.5, 0]} castShadow visible={!focused}>
        <boxGeometry args={[1.65, 1.15, 0.07]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.78} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.5, 0.045]} visible={!focused}>
        <planeGeometry args={[1.45, 0.95]} />
        <meshStandardMaterial
          color={theme === "day" ? "#d8dee8" : "#1a2430"}
          metalness={0.18}
          roughness={0.55}
          emissive={p.amber}
          emissiveIntensity={glow.current * 0.12}
        />
      </mesh>

      {/* Hover label only — PROJECT / name / ENTER */}
      {isHot && !focused && (
        <group position={[0, 2.35, 0.1]}>
          <Text
            fontSize={0.055}
            color={p.amber}
            anchorX="center"
            letterSpacing={0.16}
          >
            {`PROJECT ${exhibit.number}`}
          </Text>
          <Text
            position={[0, -0.14, 0]}
            fontSize={0.078}
            color={labelColor}
            anchorX="center"
            maxWidth={2.1}
            textAlign="center"
          >
            {exhibit.title}
          </Text>
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.055}
            color={p.amber}
            anchorX="center"
            letterSpacing={0.18}
          >
            ENTER →
          </Text>
        </group>
      )}

      {/* Hit volume */}
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[2.0, 2.5, 1.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <ExhibitPipeline
        exhibit={exhibit}
        theme={theme}
        intensity={focused ? 1 : isHot ? 0.55 : 0.08}
        active={focused || isHot}
        cursorRef={cursorRef}
      />
    </group>
  );
}
