"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";
import {
  PRECISION_ASSETS,
  PROJECT_01,
  THEME_PALETTE,
  remap,
  smoothstep,
} from "@/lib/data/precision";

/**
 * First Work installation — physically beyond the output pathway.
 * Architecture + annotations, not a project card.
 */
export default function WorkInstallation({ theme, progressRef }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const group = useRef();
  const glow = useRef();
  const plate = useTexture(PRECISION_ASSETS.transformation);
  plate.colorSpace = THREE.SRGBColorSpace;

  useFrame(() => {
    const g = progressRef.current || 0;
    const local = remap(g, 0.82, 1);
    const active = smoothstep(0.15, 0.55, local);
    if (glow.current) {
      glow.current.material.emissiveIntensity = active * 0.7;
    }
    if (group.current) {
      group.current.visible = g > 0.55;
      const labels = group.current.getObjectByName("work-labels");
      if (labels) labels.visible = local > 0.18;
    }
  });

  const labelColor = theme === "day" ? "#1a1c1f" : "#e8e4dc";

  return (
    <group ref={group} position={[0.8, 0, -18]} visible={false}>
      {/* Structural columns */}
      <mesh position={[-1.35, 1.6, 0]} castShadow>
        <boxGeometry args={[0.12, 3.2, 0.12]} />
        <meshStandardMaterial color={p.metal} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[1.35, 1.6, 0]} castShadow>
        <boxGeometry args={[0.12, 3.2, 0.12]} />
        <meshStandardMaterial color={p.metal} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 3.15, 0]}>
        <boxGeometry args={[2.9, 0.1, 0.1]} />
        <meshStandardMaterial color={p.aluminium} metalness={0.92} roughness={0.2} />
      </mesh>

      {/* Layered smoked glass panes */}
      <mesh position={[0, 1.7, -0.08]}>
        <planeGeometry args={[2.4, 2.6]} />
        <meshPhysicalMaterial
          color={p.glass}
          metalness={0.1}
          roughness={0.15}
          transparent
          opacity={0.35}
          transmission={theme === "day" ? 0.25 : 0.08}
        />
      </mesh>

      {/* Asset as inner projection surface — not a hero card */}
      <mesh position={[0, 1.7, -0.02]}>
        <planeGeometry args={[1.9, 2.1]} />
        <meshStandardMaterial
          map={plate}
          metalness={0.08}
          roughness={0.55}
          transparent
          opacity={0.72}
        />
      </mesh>

      {/* Status rail */}
      <mesh ref={glow} position={[0, 0.35, 0.15]}>
        <boxGeometry args={[1.2, 0.03, 0.03]} />
        <meshStandardMaterial
          color={p.amber}
          emissive={p.amber}
          emissiveIntensity={0}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[0, 0.12, 0.2]} receiveShadow>
        <boxGeometry args={[3.2, 0.2, 1.4]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.82} roughness={0.32} />
      </mesh>

      {/* Incoming pathway from Convergence */}
      <mesh position={[0, 0.92, 4]} castShadow>
        <boxGeometry args={[0.14, 0.05, 8]} />
        <meshStandardMaterial
          color={p.aluminium}
          metalness={0.93}
          roughness={0.2}
          emissive={p.amber}
          emissiveIntensity={0.12}
        />
      </mesh>

      <group name="work-labels" position={[2.0, 2.5, 0.4]} visible={false}>
        <Text
          fontSize={0.075}
          color={p.amber}
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.14}
          maxWidth={1.8}
        >
          {PROJECT_01.code}
        </Text>
        <Text
          position={[0, -0.16, 0]}
          fontSize={0.13}
          color={labelColor}
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.04}
          maxWidth={1.9}
        >
          {PROJECT_01.name}
        </Text>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.065}
          color={labelColor}
          fillOpacity={0.52}
          anchorX="left"
          anchorY="top"
          maxWidth={1.85}
          lineHeight={1.4}
        >
          {`PROBLEM\n${PROJECT_01.problem}\n\nSYSTEM\n${PROJECT_01.system}\n\nDECISIONS\n${PROJECT_01.decisions}\n\nRESULT\n${PROJECT_01.result}`}
        </Text>
      </group>
    </group>
  );
}
