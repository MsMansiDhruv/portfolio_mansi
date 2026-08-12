"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { smoothstep, lerp } from "@/lib/data/precision";

/**
 * Mansi digital character — cohesive stylized 3D avatar.
 * Soft Ghibli-adjacent face + blazer silhouette. Animated. Not a photo plane.
 */
export default function MansiFigure({ progressRef, theme }) {
  const root = useRef();
  const hips = useRef();
  const chest = useRef();
  const head = useRef();
  const lArm = useRef();
  const rArm = useRef();
  const lLeg = useRef();
  const rLeg = useRef();
  const prevZ = useRef(16.4);

  const pal = useMemo(() => {
    const day = theme === "day";
    return {
      skin: "#d7a682",
      blush: "#e59b8c",
      hair: "#5a3428",
      hairDark: "#3a2118",
      coat: day ? "#667284" : "#7a8798",
      coatDark: day ? "#4d5766" : "#5c6878",
      shirt: "#edf1f6",
      pants: day ? "#3d4654" : "#343c4a",
      shoe: "#171b22",
      eye: "#241812",
      gold: "#d09a2e",
    };
  }, [theme]);

  useFrame((_, delta) => {
    if (!root.current) return;
    const dt = Math.min(delta, 0.05);
    const g = progressRef.current || 0;
    const t = performance.now() * 0.001;

    const a = smoothstep(0.04, 0.3, g);
    const m = smoothstep(0.3, 0.55, g);
    const d = smoothstep(0.55, 0.88, g);

    const x = lerp(1.4, 1.55, a) + lerp(0, 0.2, m) + lerp(0, -0.12, d);
    const z = lerp(16.4, 12.2, a) + lerp(0, -5.0, m) + lerp(0, -6.4, d);
    const moving = Math.abs(z - prevZ.current) > 0.0004 || (g > 0.03 && g < 0.92);
    prevZ.current = z;

    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, x, 1.8, dt);
    root.current.position.z = THREE.MathUtils.damp(root.current.position.z, z, 1.8, dt);
    // Face viewer
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, 0.28, 2.2, dt);

    const pace = moving ? t * 6.5 : t * 1.15;
    const amp = moving ? 1 : 0.12;

    if (hips.current) hips.current.position.y = 0.72 + Math.sin(t * 1.5) * 0.008;
    if (chest.current) chest.current.rotation.y = Math.sin(t * 1.1) * 0.03 * amp;
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.8) * 0.08;
      head.current.rotation.x = -0.05 + Math.sin(t * 1.3) * 0.03;
    }

    // Shoulders hang; swing in X only (never flip upright)
    if (lArm.current) lArm.current.rotation.x = 0.15 + Math.sin(pace) * 0.32 * amp;
    if (rArm.current) rArm.current.rotation.x = 0.15 + Math.sin(pace + Math.PI) * 0.32 * amp;
    if (lLeg.current) lLeg.current.rotation.x = Math.sin(pace + Math.PI) * 0.3 * amp;
    if (rLeg.current) rLeg.current.rotation.x = Math.sin(pace) * 0.3 * amp;
  });

  return (
    <group ref={root} position={[1.4, 0, 16.4]} scale={1.35}>
      <pointLight position={[0.55, 2.0, 1.1]} intensity={theme === "day" ? 0.4 : 1.0} distance={5} decay={2} color="#ffe7c4" />
      <pointLight position={[-0.5, 1.5, 0.4]} intensity={0.35} distance={3.5} decay={2} color="#9bb8d4" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.3, 24]} />
        <meshBasicMaterial color="#000" transparent opacity={theme === "day" ? 0.1 : 0.26} />
      </mesh>

      {/* LEFT LEG */}
      <group ref={lLeg} position={[-0.09, 0.48, 0]}>
        <mesh position={[0, -0.24, 0]} castShadow>
          <capsuleGeometry args={[0.055, 0.36, 5, 10]} />
          <meshStandardMaterial color={pal.pants} roughness={0.78} />
        </mesh>
        <mesh position={[0, -0.46, 0.04]} castShadow>
          <boxGeometry args={[0.12, 0.05, 0.2]} />
          <meshStandardMaterial color={pal.shoe} roughness={0.5} />
        </mesh>
      </group>

      {/* RIGHT LEG */}
      <group ref={rLeg} position={[0.09, 0.48, 0]}>
        <mesh position={[0, -0.24, 0]} castShadow>
          <capsuleGeometry args={[0.055, 0.36, 5, 10]} />
          <meshStandardMaterial color={pal.pants} roughness={0.78} />
        </mesh>
        <mesh position={[0, -0.46, 0.04]} castShadow>
          <boxGeometry args={[0.12, 0.05, 0.2]} />
          <meshStandardMaterial color={pal.shoe} roughness={0.5} />
        </mesh>
      </group>

      {/* HIPS + TORSO — slim blazer block, not a bulbous capsule chest */}
      <group ref={hips} position={[0, 0.72, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.11, 0.08, 4, 10]} />
          <meshStandardMaterial color={pal.pants} roughness={0.78} />
        </mesh>

        <group ref={chest} position={[0, 0.36, 0]}>
          {/* Flat tailored torso */}
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.42, 0.16]} />
            <meshStandardMaterial color={pal.coat} roughness={0.62} metalness={0.05} />
          </mesh>
          {/* Soft shoulder pads — narrow */}
          <mesh position={[-0.15, 0.16, 0]} castShadow>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color={pal.coat} roughness={0.62} />
          </mesh>
          <mesh position={[0.15, 0.16, 0]} castShadow>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color={pal.coat} roughness={0.62} />
          </mesh>
          {/* Shirt placket */}
          <mesh position={[0, 0.06, 0.085]}>
            <boxGeometry args={[0.05, 0.28, 0.02]} />
            <meshStandardMaterial color={pal.shirt} roughness={0.85} />
          </mesh>
          {/* Collar */}
          <mesh position={[-0.04, 0.2, 0.07]} rotation={[0.25, 0.5, 0]}>
            <boxGeometry args={[0.07, 0.04, 0.03]} />
            <meshStandardMaterial color={pal.coatDark} roughness={0.6} />
          </mesh>
          <mesh position={[0.04, 0.2, 0.07]} rotation={[0.25, -0.5, 0]}>
            <boxGeometry args={[0.07, 0.04, 0.03]} />
            <meshStandardMaterial color={pal.coatDark} roughness={0.6} />
          </mesh>
          <mesh position={[0.1, 0.05, 0.09]}>
            <sphereGeometry args={[0.014, 10, 10]} />
            <meshStandardMaterial color={pal.gold} emissive={pal.gold} emissiveIntensity={0.3} />
          </mesh>

          {/* LEFT ARM */}
          <group ref={lArm} position={[-0.2, 0.14, 0]}>
            <mesh position={[0, -0.2, 0]} rotation={[0, 0, 0.1]} castShadow>
              <capsuleGeometry args={[0.035, 0.28, 4, 10]} />
              <meshStandardMaterial color={pal.coat} roughness={0.62} />
            </mesh>
            <mesh position={[0.01, -0.38, 0]} castShadow>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color={pal.skin} roughness={0.48} />
            </mesh>
          </group>

          {/* RIGHT ARM */}
          <group ref={rArm} position={[0.2, 0.14, 0]}>
            <mesh position={[0, -0.2, 0]} rotation={[0, 0, -0.1]} castShadow>
              <capsuleGeometry args={[0.035, 0.28, 4, 10]} />
              <meshStandardMaterial color={pal.coat} roughness={0.62} />
            </mesh>
            <mesh position={[-0.01, -0.38, 0]} castShadow>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color={pal.skin} roughness={0.48} />
            </mesh>
          </group>

          {/* HEAD */}
          <group ref={head} position={[0, 0.46, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.14, 28, 28]} />
              <meshStandardMaterial color={pal.skin} roughness={0.42} />
            </mesh>

            <mesh position={[-0.042, 0.02, 0.118]}>
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshStandardMaterial color={pal.eye} roughness={0.28} />
            </mesh>
            <mesh position={[0.042, 0.02, 0.118]}>
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshStandardMaterial color={pal.eye} roughness={0.28} />
            </mesh>
            <mesh position={[-0.036, 0.026, 0.134]}>
              <sphereGeometry args={[0.006, 8, 8]} />
              <meshStandardMaterial color="#fff6ec" emissive="#fff6ec" emissiveIntensity={0.25} />
            </mesh>
            <mesh position={[0.048, 0.026, 0.134]}>
              <sphereGeometry args={[0.006, 8, 8]} />
              <meshStandardMaterial color="#fff6ec" emissive="#fff6ec" emissiveIntensity={0.25} />
            </mesh>
            <mesh position={[-0.07, -0.012, 0.095]}>
              <sphereGeometry args={[0.022, 10, 10]} />
              <meshStandardMaterial color={pal.blush} transparent opacity={0.35} />
            </mesh>
            <mesh position={[0.07, -0.012, 0.095]}>
              <sphereGeometry args={[0.022, 10, 10]} />
              <meshStandardMaterial color={pal.blush} transparent opacity={0.35} />
            </mesh>
            <mesh position={[0, -0.008, 0.138]}>
              <sphereGeometry args={[0.011, 8, 8]} />
              <meshStandardMaterial color={pal.skin} roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.05, 0.122]} rotation={[0.2, 0, 0]} scale={[1, 0.35, 0.5]}>
              <torusGeometry args={[0.028, 0.005, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#b56b5c" roughness={0.6} />
            </mesh>

            <mesh position={[0, 0.085, -0.03]} castShadow>
              <sphereGeometry args={[0.155, 20, 20]} />
              <meshStandardMaterial color={pal.hair} roughness={0.82} />
            </mesh>
            <mesh position={[0, 0.11, -0.02]} scale={[1.06, 0.65, 1]} castShadow>
              <sphereGeometry args={[0.135, 16, 16]} />
              <meshStandardMaterial color={pal.hairDark} roughness={0.85} />
            </mesh>
            <mesh position={[-0.1, -0.02, 0.02]} rotation={[0.15, 0, 0.35]} castShadow>
              <capsuleGeometry args={[0.045, 0.22, 4, 8]} />
              <meshStandardMaterial color={pal.hair} roughness={0.85} />
            </mesh>
            <mesh position={[0.1, -0.02, 0.02]} rotation={[0.15, 0, -0.35]} castShadow>
              <capsuleGeometry args={[0.045, 0.22, 4, 8]} />
              <meshStandardMaterial color={pal.hair} roughness={0.85} />
            </mesh>
            <mesh position={[0, -0.1, -0.09]} castShadow>
              <capsuleGeometry args={[0.07, 0.26, 4, 8]} />
              <meshStandardMaterial color={pal.hairDark} roughness={0.88} />
            </mesh>
            <mesh position={[-0.035, 0.085, 0.1]} rotation={[0.65, 0.12, 0]}>
              <capsuleGeometry args={[0.028, 0.035, 4, 8]} />
              <meshStandardMaterial color={pal.hair} roughness={0.8} />
            </mesh>
            <mesh position={[0.04, 0.08, 0.1]} rotation={[0.65, -0.1, 0]}>
              <capsuleGeometry args={[0.026, 0.03, 4, 8]} />
              <meshStandardMaterial color={pal.hair} roughness={0.8} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
