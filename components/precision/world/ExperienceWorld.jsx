"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { THEME_PALETTE } from "@/lib/data/precision";
import { CAREER_TIMELINE } from "@/lib/data/career";

/**
 * Spatial Experience Environment — Evolving Career Systems.
 * Milestone nodes float along an architectural axis representing scale & growth.
 */
export default function ExperienceWorld({ theme, activeView }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const isDay = theme === "day";
  const labelColor = isDay ? "#0c121a" : "#eef4fb";
  const [hoverIndex, setHoverIndex] = useState(null);

  const experiences = CAREER_TIMELINE || [];


  return (
    <group position={[0, 0, 0]}>
      {/* Central Architectural Guideway for Career Growth */}
      <mesh position={[0, 1.25, -13.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 8, 16]} />
        <meshStandardMaterial color={p.aluminium} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Experience Milestone Nodes */}
      {experiences.map((exp, idx) => {
        const xPos = (idx - (experiences.length - 1) / 2) * 2.6;
        const isHovered = hoverIndex === idx;

        return (
          <group
            key={exp.title || idx}
            position={[xPos, 1.25, -13.5]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoverIndex(idx);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoverIndex(null);
            }}
          >
            {/* Milestone Diamond Mesh */}
            <mesh castShadow rotation={[0, Math.PI / 4, 0]}>
              <boxGeometry args={[0.38, 0.38, 0.38]} />
              <meshStandardMaterial
                color={isHovered ? p.amber : p.metalDark}
                metalness={0.85}
                roughness={0.25}
                emissive={p.amber}
                emissiveIntensity={isHovered ? 0.5 : 0.1}
              />
            </mesh>

            {/* Title & Year */}
            <Text
              position={[0, 0.45, 0]}
              fontSize={0.072}
              color={isHovered ? p.amber : labelColor}
              anchorX="center"
              letterSpacing={0.12}
            >
              {exp.title}
            </Text>
            <Text
              position={[0, 0.28, 0]}
              fontSize={0.055}
              color={p.amber}
              anchorX="center"
              letterSpacing={0.16}
            >
              {exp.year || exp.period || exp.company}
            </Text>

            {/* Impact Details Callout */}
            {isHovered && (
              <Text
                position={[0, -0.42, 0]}
                fontSize={0.054}
                color={isDay ? "#2e3e50" : "#a2b4c8"}
                anchorX="center"
                maxWidth={2.2}
                textAlign="center"
              >
                {exp.desc || exp.focus || exp.impact || exp.summary}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}
