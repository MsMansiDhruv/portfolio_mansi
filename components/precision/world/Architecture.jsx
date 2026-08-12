"use client";

import { THEME_PALETTE } from "@/lib/data/precision";

function Beam({ position, args, color, metalness = 0.85, roughness = 0.35 }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

/**
 * Persistent atrium — always present for the full camera journey.
 */
export default function Architecture({ theme }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const length = 52;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
        <planeGeometry args={[14, length]} />
        <meshStandardMaterial color={p.floor} metalness={0.62} roughness={0.38} />
      </mesh>

      {/* Floor center path line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, -2]}>
        <planeGeometry args={[0.04, length * 0.85]} />
        <meshStandardMaterial
          color={p.aluminium}
          metalness={0.9}
          roughness={0.25}
          emissive={p.amber}
          emissiveIntensity={0.08}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.2, -2]}>
        <planeGeometry args={[14, length]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.7} roughness={0.48} />
      </mesh>

      <mesh position={[-6.4, 2.6, -2]} receiveShadow>
        <boxGeometry args={[0.18, 5.2, length]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.78} roughness={0.38} />
      </mesh>
      <mesh position={[6.4, 2.6, -2]} receiveShadow>
        <boxGeometry args={[0.18, 5.2, length]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.78} roughness={0.38} />
      </mesh>

      {Array.from({ length: 18 }).map((_, i) => {
        const z = 22 - i * 2.6;
        return (
          <group key={`rib-${i}`}>
            <Beam position={[-5.9, 2.6, z]} args={[0.14, 5.1, 0.14]} color={p.metal} />
            <Beam position={[5.9, 2.6, z]} args={[0.14, 5.1, 0.14]} color={p.metal} />
            <Beam
              position={[0, 5.05, z]}
              args={[12, 0.12, 0.12]}
              color={p.aluminium}
              metalness={0.92}
              roughness={0.22}
            />
            <Beam position={[-5.9, 0.06, z]} args={[0.7, 0.08, 0.7]} color={p.metal} />
            <Beam position={[5.9, 0.06, z]} args={[0.7, 0.08, 0.7]} color={p.metal} />
            {/* Side conduit runs */}
            <Beam
              position={[-5.55, 3.4, z]}
              args={[0.08, 0.08, 2.2]}
              color={p.aluminium}
              metalness={0.95}
              roughness={0.2}
            />
            <Beam
              position={[5.55, 3.4, z]}
              args={[0.08, 0.08, 2.2]}
              color={p.aluminium}
              metalness={0.95}
              roughness={0.2}
            />
          </group>
        );
      })}

      {[-1, 1].map((side) => (
        <mesh key={`glass-${side}`} position={[side * 2.35, 0.9, -2]} castShadow>
          <boxGeometry args={[0.05, 1.15, length * 0.7]} />
          <meshPhysicalMaterial
            color={p.glass}
            metalness={0.15}
            roughness={0.12}
            transmission={theme === "day" ? 0.4 : 0.18}
            thickness={0.35}
            transparent
            opacity={theme === "day" ? 0.5 : 0.38}
          />
        </mesh>
      ))}

      <Beam position={[0, 0.1, 12]} args={[4.4, 0.1, 18]} color={p.metal} metalness={0.82} roughness={0.28} />
      <Beam position={[0, 0.1, -8]} args={[3.8, 0.1, 14]} color={p.metal} metalness={0.82} roughness={0.28} />

      {/* Overhead light strips */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`light-${i}`} position={[0, 5.05, 18 - i * 4]}>
          <boxGeometry args={[3.5, 0.04, 0.12]} />
          <meshStandardMaterial
            color="#dfe4ea"
            emissive={theme === "day" ? "#fff4e0" : "#aeb8c4"}
            emissiveIntensity={theme === "day" ? 0.55 : 0.35}
            roughness={0.4}
          />
        </mesh>
      ))}

      <Beam position={[0, 2.6, -24]} args={[8, 5.2, 0.2]} color={p.metalDark} />
      <mesh position={[0, 1.6, -23.85]}>
        <boxGeometry args={[3.2, 2.8, 0.08]} />
        <meshStandardMaterial color={p.background} metalness={0.15} roughness={0.85} />
      </mesh>
    </group>
  );
}
