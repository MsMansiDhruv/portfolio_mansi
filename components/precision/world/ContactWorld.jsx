"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { THEME_PALETTE } from "@/lib/data/precision";

const CONTACT_CHANNELS = [
  { id: "email", label: "EMAIL", val: "mansidhruv98@gmail.com", href: "mailto:mansidhruv98@gmail.com", pos: [-1.8, 1.25, -23.0] },
  { id: "linkedin", label: "LINKEDIN", val: "linkedin.com/in/mansidhruv", href: "https://linkedin.com/in/mansidhruv", pos: [-0.6, 1.25, -23.0] },
  { id: "github", label: "GITHUB", val: "github.com/MsMansiDhruv", href: "https://github.com/MsMansiDhruv", pos: [0.6, 1.25, -23.0] },
  { id: "resume", label: "RESUME", val: "Download CV", href: "/Mansi_Dhruv_Resume.pdf", pos: [1.8, 1.25, -23.0] },
];

/**
 * Spatial Contact Environment — Streams Converge into Clean Output Signal.
 * Quiet atmosphere, minimal interactive contact nodes.
 */
export default function ContactWorld({ theme, activeView }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const isDay = theme === "day";
  const labelColor = isDay ? "#0c121a" : "#f0f4f9";
  const [hoverId, setHoverId] = useState(null);

  return (
    <group position={[0, 0, 0]}>
      {/* Title */}
      <group position={[0, 2.3, -23.0]}>
        <Text
          fontSize={0.065}
          color={p.amber}
          anchorX="center"
          letterSpacing={0.22}
        >
          05 · INITIATE CONVERGENCE
        </Text>
        <Text
          position={[0, -0.2, 0]}
          fontSize={0.11}
          color={labelColor}
          anchorX="center"
          letterSpacing={0.14}
        >
          CONNECT WITH MANSI
        </Text>
      </group>

      {/* Converging Guideway Line */}
      <mesh position={[0, 0.4, -23.0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 6, 16]} />
        <meshBasicMaterial color={p.amber} transparent opacity={0.6} />
      </mesh>

      {/* Interactive Contact Nodes */}
      {CONTACT_CHANNELS.map((ch) => {
        const isHovered = hoverId === ch.id;

        return (
          <group
            key={ch.id}
            position={ch.pos}
            onClick={(e) => {
              e.stopPropagation();
              window.open(ch.href, "_blank", "noopener,noreferrer");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoverId(ch.id);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoverId(null);
            }}
          >
            {/* Contact Instrument Node */}
            <mesh castShadow>
              <boxGeometry args={[0.9, 0.42, 0.06]} />
              <meshStandardMaterial
                color={isHovered ? p.amber : p.metalDark}
                metalness={0.8}
                roughness={0.25}
                emissive={p.amber}
                emissiveIntensity={isHovered ? 0.4 : 0.06}
              />
            </mesh>

            <Text
              position={[0, 0.05, 0.04]}
              fontSize={0.068}
              color={isHovered ? (isDay ? "#0c121a" : "#ffffff") : labelColor}
              anchorX="center"
              letterSpacing={0.18}
            >
              {ch.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
