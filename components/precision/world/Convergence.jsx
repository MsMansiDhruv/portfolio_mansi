"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { THEME_PALETTE, remap, smoothstep } from "@/lib/data/precision";

function Rail({ start, end, progressRef, index, color, accent }) {
  const ref = useRef();
  const mid = useMemo(() => {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    return a.clone().lerp(b, 0.5);
  }, [start, end]);

  const dir = useMemo(() => {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    return b.clone().sub(a);
  }, [start, end]);

  const length = dir.length();
  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir.clone().normalize());
    return q;
  }, [dir]);

  useFrame(() => {
    if (!ref.current) return;
    const local = remap(progressRef.current || 0, 0.34, 0.62);
    const converge = smoothstep(0.35, 0.7, local);
    const clarified = smoothstep(0.7, 0.95, local);
    const mat = ref.current.material;
    mat.opacity = clarified > 0.5 && index % 3 !== 1 ? 0.15 : 0.35 + converge * 0.4;
    mat.color.set(converge > 0.75 ? accent : color);
  });

  return (
    <mesh ref={ref} position={mid.toArray()} quaternion={quat}>
      <boxGeometry args={[length, 0.03, 0.03]} />
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.28}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

/** Quiet convergence instrument — geometry only, data particles carry the story */
export default function Convergence({ theme, progressRef }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const signal = useRef();
  const outRail = useRef();

  const rails = useMemo(() => {
    const list = [];
    for (let i = 0; i < 5; i++) {
      const y = 0.95 + i * 0.22;
      const zSpread = (i - 2) * 0.28;
      list.push({
        start: [-4.2, y, 0.8 + zSpread],
        end: [-0.35, 1.4, -0.1],
      });
      list.push({
        start: [4.2, y, 0.8 + zSpread],
        end: [0.35, 1.4, -0.1],
      });
    }
    return list;
  }, []);

  useFrame(() => {
    const local = remap(progressRef.current || 0, 0.34, 0.62);
    const clarified = smoothstep(0.65, 0.95, local);
    const output = smoothstep(0.85, 1, local);
    if (signal.current) {
      signal.current.material.emissiveIntensity = clarified * 1.6;
      signal.current.visible = clarified > 0.08;
    }
    if (outRail.current) {
      outRail.current.material.emissiveIntensity = clarified * 0.2 + output * 0.25;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 1.05, 0.55, 40]} />
        <meshStandardMaterial color={p.metalDark} metalness={0.82} roughness={0.35} />
      </mesh>

      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.7, 1.7, 0.38]} />
        <meshStandardMaterial color={p.metal} metalness={0.88} roughness={0.28} />
      </mesh>

      <mesh ref={signal} position={[0, 1.4, 0.28]} visible={false}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={p.amber} emissive={p.amber} emissiveIntensity={0} roughness={0.4} />
      </mesh>

      {rails.map((rail, i) => (
        <Rail
          key={`r-${i}`}
          index={i}
          start={rail.start}
          end={rail.end}
          progressRef={progressRef}
          color={p.aluminium}
          accent={p.amber}
        />
      ))}

      <mesh ref={outRail} position={[0, 0.95, -4.5]} castShadow>
        <boxGeometry args={[0.12, 0.04, 8]} />
        <meshStandardMaterial
          color={p.aluminium}
          metalness={0.92}
          roughness={0.22}
          emissive={p.amber}
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  );
}
