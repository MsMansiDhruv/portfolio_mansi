"use client";

import { THEME_PALETTE } from "@/lib/data/precision";

/**
 * Quiet architecture — ~50% less decoration.
 * Scale and shadow; data provides the motion.
 */
export default function Architecture({ theme }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const day = theme === "day";

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
        <planeGeometry args={[18, 56]} />
        <meshStandardMaterial color={p.floor} metalness={0.45} roughness={0.5} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.6, -2]}>
        <planeGeometry args={[18, 56]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.4} roughness={0.65} />
      </mesh>

      <mesh position={[-7.6, 2.8, -2]} receiveShadow>
        <boxGeometry args={[0.35, 5.6, 56]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.55} roughness={0.5} />
      </mesh>
      <mesh position={[7.6, 2.8, -2]} receiveShadow>
        <boxGeometry args={[0.35, 5.6, 56]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.55} roughness={0.5} />
      </mesh>

      {/* Sparse ceiling washes only */}
      {[16, 8, 0, -8, -16].map((z) => (
        <mesh key={z} position={[0, 5.45, z]}>
          <boxGeometry args={[5.5, 0.035, 0.55]} />
          <meshStandardMaterial
            color="#eef3f8"
            emissive={day ? "#f2f5f9" : "#a8bacf"}
            emissiveIntensity={day ? 0.4 : 0.28}
            roughness={0.55}
          />
        </mesh>
      ))}

      {/* Soft path plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2]}>
        <planeGeometry args={[1.4, 40]} />
        <meshStandardMaterial
          color={p.metalDark}
          metalness={0.6}
          roughness={0.4}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}
