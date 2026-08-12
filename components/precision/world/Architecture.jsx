"use client";

import * as THREE from "three";
import { THEME_PALETTE } from "@/lib/data/precision";

/**
 * Cinematic atrium — softer structure, light washes, less cage-grid.
 */
export default function Architecture({ theme }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const length = 52;
  const day = theme === "day";

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
        <planeGeometry args={[16, length]} />
        <meshStandardMaterial color={p.floor} metalness={0.55} roughness={0.42} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -2]}>
        <planeGeometry args={[1.8, length * 0.75]} />
        <meshStandardMaterial
          color={p.metalDark}
          metalness={0.7}
          roughness={0.35}
          transparent
          opacity={0.55}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.4, -2]}>
        <planeGeometry args={[16, length]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.55} roughness={0.55} />
      </mesh>

      <mesh position={[-7.2, 2.7, -2]} receiveShadow>
        <boxGeometry args={[0.4, 5.4, length]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.7} roughness={0.42} />
      </mesh>
      <mesh position={[7.2, 2.7, -2]} receiveShadow>
        <boxGeometry args={[0.4, 5.4, length]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.7} roughness={0.42} />
      </mesh>

      {Array.from({ length: 8 }).map((_, i) => {
        const z = 20 - i * 5.2;
        return (
          <group key={`frame-${i}`}>
            <mesh position={[-6.8, 2.7, z]}>
              <boxGeometry args={[0.2, 5.2, 0.2]} />
              <meshStandardMaterial color={p.metal} metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh position={[6.8, 2.7, z]}>
              <boxGeometry args={[0.2, 5.2, 0.2]} />
              <meshStandardMaterial color={p.metal} metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh position={[0, 5.25, z]}>
              <boxGeometry args={[14, 0.1, 0.1]} />
              <meshStandardMaterial color={p.aluminium} metalness={0.9} roughness={0.22} />
            </mesh>
            <mesh position={[0, 5.2, z]}>
              <boxGeometry args={[6.5, 0.04, 0.8]} />
              <meshStandardMaterial
                color="#eef3f8"
                emissive={day ? "#f4f7fb" : "#c5d2e4"}
                emissiveIntensity={day ? 0.55 : 0.38}
                roughness={0.5}
              />
            </mesh>
          </group>
        );
      })}

      {[-8, 2, 12].map((z) => (
        <mesh key={`shaft-${z}`} position={[0, 3.2, z]} rotation={[0.15, 0, 0]}>
          <planeGeometry args={[3.2, 4.5]} />
          <meshBasicMaterial
            color={day ? "#ffffff" : "#d8e4f2"}
            transparent
            opacity={day ? 0.04 : 0.055}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      <mesh position={[-5.2, 2.7, -12]}>
        <boxGeometry args={[0.35, 5.2, 0.35]} />
        <meshStandardMaterial color={p.metal} metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh position={[5.2, 2.7, -12]}>
        <boxGeometry args={[0.35, 5.2, 0.35]} />
        <meshStandardMaterial color={p.metal} metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh position={[0, 5.2, -12]}>
        <boxGeometry args={[10.5, 0.12, 0.12]} />
        <meshStandardMaterial color={p.aluminium} metalness={0.92} roughness={0.2} />
      </mesh>
    </group>
  );
}
