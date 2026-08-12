"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { THEME_PALETTE } from "@/lib/data/precision";

/** Quiet nexus mark — visible structure without a glowing orb. */
export default function Convergence({ theme, interactionRef }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const mats = useRef([]);
  const ring = useRef();

  const rails = useMemo(() => {
    const list = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI;
      const start = [
        Math.cos(a) * 1.9,
        1.18 + (i % 2) * 0.06,
        2.4 + Math.sin(a) * 0.25,
      ];
      const end = [0, 1.28, 0.2];
      const mid = [
        (start[0] + end[0]) * 0.5,
        (start[1] + end[1]) * 0.5,
        (start[2] + end[2]) * 0.5,
      ];
      const dir = new THREE.Vector3(
        end[0] - start[0],
        end[1] - start[1],
        end[2] - start[2]
      );
      const length = dir.length();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(1, 0, 0),
        dir.normalize()
      );
      list.push({ mid, length, quat, index: i });
    }
    return list;
  }, []);

  useFrame(() => {
    const e = interactionRef?.current?.energy ?? 0.25;
    const rv = interactionRef?.current?.reveal ?? 0;
    const opacity = 0.08 + e * 0.18 + rv * 0.35;
    mats.current.forEach((mat) => {
      if (mat) mat.opacity = opacity;
    });
    if (ring.current) {
      ring.current.material.opacity = 0.1 + rv * 0.45;
    }
  });

  return (
    <group position={[0, 0, 1.0]}>
      {rails.map((r) => (
        <mesh
          key={r.index}
          position={r.mid}
          quaternion={r.quat}
          ref={(node) => {
            if (node) mats.current[r.index] = node.material;
          }}
        >
          <boxGeometry args={[r.length, 0.016, 0.016]} />
          <meshBasicMaterial
            color={p.aluminium}
            transparent
            opacity={0.14}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} position={[0, 1.28, 0.2]}>
        <ringGeometry args={[0.11, 0.135, 32]} />
        <meshBasicMaterial
          color={p.amber}
          transparent
          opacity={0.12}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
