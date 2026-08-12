"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { THEME_PALETTE } from "@/lib/data/precision";
import ExhibitPipeline from "./ExhibitPipeline";

/**
 * Quiet physical exhibit — activity rises with proximity / focus.
 * Enter = camera + particles, not a fade.
 */
export default function ProjectExhibit({
  exhibit,
  theme,
  active,
  focused,
  onSelect,
  cursorRef,
}) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const labelColor = theme === "day" ? "#12141a" : "#eef3f8";
  const root = useRef();
  const glow = useRef(0);

  useFrame((_, dt) => {
    if (!root.current) return;
    const target = focused ? 1 : active ? 0.55 : 0.12;
    glow.current = THREE.MathUtils.damp(glow.current, target, 3, Math.min(dt, 0.05));
    const s = focused ? 1.02 : active ? 1.01 : 1;
    root.current.scale.setScalar(
      THREE.MathUtils.damp(root.current.scale.x, s, 2.5, Math.min(dt, 0.05))
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
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "none";
      }}
    >
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.35, 0.56, 0.45]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.7} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.55]} />
        <meshStandardMaterial
          color={p.aluminium}
          metalness={0.88}
          roughness={0.22}
          emissive={p.amber}
          emissiveIntensity={glow.current * 0.15}
        />
      </mesh>

      {/* Quiet instrument frame — no busy media plate as hero */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[1.9, 1.35, 0.06]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.75} roughness={0.32} />
      </mesh>
      <mesh position={[0, 1.55, 0.04]}>
        <planeGeometry args={[1.7, 1.15]} />
        <meshStandardMaterial
          color={theme === "day" ? "#d8dee8" : "#1a2430"}
          metalness={0.2}
          roughness={0.55}
          emissive={p.amber}
          emissiveIntensity={glow.current * 0.08}
        />
      </mesh>

      <Text
        position={[0, 2.45, 0.08]}
        fontSize={0.065}
        color={p.amber}
        anchorX="center"
        letterSpacing={0.14}
      >
        {`PROJECT ${exhibit.number}`}
      </Text>
      <Text
        position={[0, 2.28, 0.08]}
        fontSize={0.085}
        color={labelColor}
        anchorX="center"
        maxWidth={2.2}
        textAlign="center"
      >
        {exhibit.title}
      </Text>

      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[2.2, 2.6, 1.2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <ExhibitPipeline
        exhibit={exhibit}
        theme={theme}
        active={focused || active}
        cursorRef={cursorRef}
      />
    </group>
  );
}
