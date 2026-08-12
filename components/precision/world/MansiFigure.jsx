"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { smoothstep, lerp } from "@/lib/data/precision";

/**
 * Human thread — always rear / side, never a portrait.
 * No face regeneration. Scale reference inside the architecture.
 * Environment plates carry the authored likeness; this figure carries presence + scale.
 */
export default function MansiFigure({ progressRef, theme }) {
  const group = useRef();
  const suit = theme === "day" ? "#cfc6b8" : "#1a1c20";
  const hair = theme === "day" ? "#2a2420" : "#0d0e10";
  const pants = theme === "day" ? "#2c3036" : "#121418";

  useFrame(() => {
    if (!group.current) return;
    const g = progressRef.current || 0;

    const approach = smoothstep(0.12, 0.4, g);
    const atCore = smoothstep(0.38, 0.58, g);
    const beyond = smoothstep(0.68, 0.9, g);

    const x = lerp(1.55, 1.25, approach) + lerp(0, -0.4, atCore) + lerp(0, 1.0, beyond);
    const z =
      lerp(15.2, 7.8, approach) +
      lerp(0, -2.8, atCore) +
      lerp(0, -11.5, beyond);

    const scale = 0.92 + approach * 0.18 + atCore * 0.08;

    group.current.position.set(x, 0, z);
    group.current.scale.setScalar(scale);
    group.current.rotation.y = -0.55 + beyond * 0.7;
    group.current.visible = g < 0.98;
  });

  return (
    <group ref={group} position={[1.55, 0, 15.2]}>
      {/* Legs */}
      <mesh position={[-0.08, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.55, 4, 8]} />
        <meshStandardMaterial color={pants} metalness={0.05} roughness={0.85} />
      </mesh>
      <mesh position={[0.08, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.55, 4, 8]} />
        <meshStandardMaterial color={pants} metalness={0.05} roughness={0.85} />
      </mesh>
      {/* Torso / blazer — rear view */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.55, 6, 12]} />
        <meshStandardMaterial color={suit} metalness={0.08} roughness={0.78} />
      </mesh>
      {/* Shoulders */}
      <mesh position={[0, 1.28, 0]} castShadow>
        <boxGeometry args={[0.52, 0.12, 0.22]} />
        <meshStandardMaterial color={suit} metalness={0.08} roughness={0.78} />
      </mesh>
      {/* Head — featureless, from behind */}
      <mesh position={[0, 1.62, -0.02]} castShadow>
        <sphereGeometry args={[0.115, 16, 16]} />
        <meshStandardMaterial color="#3a302c" metalness={0.05} roughness={0.9} />
      </mesh>
      {/* Hair volume */}
      <mesh position={[0, 1.58, -0.06]} castShadow>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={hair} metalness={0.02} roughness={0.95} />
      </mesh>
      <mesh position={[0.02, 1.35, -0.1]} rotation={[0.4, 0, 0.1]} castShadow>
        <capsuleGeometry args={[0.05, 0.35, 4, 8]} />
        <meshStandardMaterial color={hair} metalness={0.02} roughness={0.95} />
      </mesh>
      {/* Contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.28, 24]} />
        <meshBasicMaterial color="#000" transparent opacity={0.25} depthWrite={false} />
      </mesh>
    </group>
  );
}
