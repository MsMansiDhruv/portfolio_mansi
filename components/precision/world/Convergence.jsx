"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { THEME_PALETTE } from "@/lib/data/precision";

function Rail({ start, end, energyRef, index, color, accent }) {
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
    const e = energyRef.current || 0.25;
    const mat = ref.current.material;
    mat.opacity = 0.18 + e * 0.35;
    mat.color.set(e > 0.55 && index % 3 === 1 ? accent : color);
  });

  return (
    <mesh ref={ref} position={mid.toArray()} quaternion={quat}>
      <boxGeometry args={[length, 0.025, 0.025]} />
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.28}
        transparent
        opacity={0.28}
      />
    </mesh>
  );
}

/** Quiet convergence geometry — data particles carry the story */
export default function Convergence({ theme, interactionRef }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const energyRef = useRef(0.25);
  const core = useRef();

  const rails = useMemo(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const a = ((i / 7) * Math.PI * 2) - Math.PI;
      list.push({
        start: [Math.cos(a) * 2.4, 1.15 + (i % 3) * 0.12, 3.2 + Math.sin(a) * 0.4],
        end: [0, 1.35, 0.2],
      });
    }
    return list;
  }, []);

  useFrame((_, dt) => {
    const e = interactionRef?.current?.energy ?? 0.25;
    energyRef.current = THREE.MathUtils.damp(energyRef.current, e, 2, Math.min(dt, 0.05));
    if (core.current) {
      core.current.material.emissiveIntensity = 0.08 + energyRef.current * 0.35;
    }
  });

  return (
    <group position={[0, 0, 1.5]}>
      {rails.map((r, i) => (
        <Rail
          key={i}
          index={i}
          start={r.start}
          end={r.end}
          energyRef={energyRef}
          color={p.metal}
          accent={p.amber}
        />
      ))}
      <mesh ref={core} position={[0, 1.35, 0.15]}>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial
          color={p.aluminium}
          metalness={0.95}
          roughness={0.18}
          emissive={p.amber}
          emissiveIntensity={0.12}
        />
      </mesh>
    </group>
  );
}
