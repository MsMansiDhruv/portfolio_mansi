"use client";

import { THEME_PALETTE } from "@/lib/data/precision";

/**
 * Quiet architecture — large negative space, controlled materials.
 * Data provides motion. Environment provides scale.
 */
export default function Architecture({ theme }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const day = theme === "day";

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]} receiveShadow>
        <planeGeometry args={[16, 36]} />
        <meshStandardMaterial color={p.floor} metalness={0.45} roughness={0.5} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.4, 2]}>
        <planeGeometry args={[16, 36]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.4} roughness={0.65} />
      </mesh>

      <mesh position={[-7.2, 2.7, 2]} receiveShadow>
        <boxGeometry args={[0.28, 5.4, 36]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.55} roughness={0.5} />
      </mesh>
      <mesh position={[7.2, 2.7, 2]} receiveShadow>
        <boxGeometry args={[0.28, 5.4, 36]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.55} roughness={0.5} />
      </mesh>

      {[12, 6, 0, -6].map((z) => (
        <mesh key={z} position={[0, 5.28, z]}>
          <boxGeometry args={[4.8, 0.03, 0.45]} />
          <meshStandardMaterial
            color="#eef3f8"
            emissive={day ? "#f2f5f9" : "#a8bacf"}
            emissiveIntensity={day ? 0.38 : 0.24}
            roughness={0.55}
          />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 2]}>
        <planeGeometry args={[1.2, 28]} />
        <meshStandardMaterial
          color={p.metalDark}
          metalness={0.6}
          roughness={0.4}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}
