"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PRECISION_ASSETS, THEME_PALETTE } from "@/lib/data/precision";

/**
 * Clean exhibit — one readable screen on a pedestal.
 * No metaphor clutter, no flickering gizmos.
 */
export default function ProjectExhibit({
  exhibit,
  theme,
  active,
  focused,
  onSelect,
}) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const labelColor = theme === "day" ? "#12141a" : "#eef3f8";
  const root = useRef();

  const plateUrl =
    exhibit.metaphor === "strata"
      ? PRECISION_ASSETS.exhibition
      : exhibit.metaphor === "harvest"
        ? PRECISION_ASSETS.building
        : theme === "day"
          ? PRECISION_ASSETS.dayClarity
          : PRECISION_ASSETS.visual;

  const plate = useTexture(plateUrl);
  plate.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (!root.current) return;
    const target = focused ? 1.02 : active ? 1.01 : 1;
    root.current.scale.setScalar(
      THREE.MathUtils.damp(root.current.scale.x, target, 2.8, Math.min(dt, 0.05))
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
        document.body.style.cursor = "auto";
      }}
    >
      {/* Pedestal */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.7, 0.55]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.75} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[1.75, 0.06, 0.7]} />
        <meshStandardMaterial color={p.aluminium} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Screen frame */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[2.35, 1.55, 0.08]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.7, 0.05]}>
        <planeGeometry args={[2.15, 1.35]} />
        <meshStandardMaterial
          map={plate}
          roughness={0.45}
          metalness={0.05}
          emissiveMap={plate}
          emissive="#ffffff"
          emissiveIntensity={focused ? 0.28 : active ? 0.18 : 0.1}
        />
      </mesh>

      {/* Soft status edge — only when near/focused */}
      {(active || focused) && (
        <mesh position={[0, 0.95, 0.36]}>
          <boxGeometry args={[0.55, 0.03, 0.03]} />
          <meshStandardMaterial
            color={p.amber}
            emissive={p.amber}
            emissiveIntensity={0.45}
            roughness={0.4}
          />
        </mesh>
      )}

      <Text
        position={[0, 2.65, 0.1]}
        fontSize={0.07}
        color={p.amber}
        anchorX="center"
        letterSpacing={0.16}
      >
        {`PROJECT ${exhibit.number}`}
      </Text>
      <Text
        position={[0, 2.48, 0.1]}
        fontSize={0.095}
        color={labelColor}
        anchorX="center"
        maxWidth={2.4}
        textAlign="center"
      >
        {exhibit.title}
      </Text>

      {/* Invisible hit volume */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[2.6, 2.8, 1.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
