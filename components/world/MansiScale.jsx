"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { THEME } from "@/lib/data/data-world";
import { CHARACTER } from "@/lib/data/identity";

function punchWhite(texture) {
  const img = texture.image;
  if (!img?.width) return texture;
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, c.width, c.height);
  const d = data.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    // Key out near-white studio background
    if (r > 235 && g > 235 && b > 235) d[i + 3] = 0;
    else if (r > 210 && g > 210 && b > 210) d[i + 3] = Math.floor(d[i + 3] * 0.25);
  }
  ctx.putImageData(data, 0, 0);
  const out = new THREE.CanvasTexture(c);
  out.colorSpace = THREE.SRGBColorSpace;
  out.needsUpdate = true;
  return out;
}

/**
 * Tiny human figure at the scale of the data world.
 * Sphere is enormous; Mansi stands on a thin platform beside it.
 */
export default function MansiScale({ themeId, stateRef }) {
  const group = useRef();
  const mat = useRef();
  const t = THEME[themeId] || THEME.night;
  const raw = useTexture(CHARACTER.src);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const apply = () => setMap(punchWhite(raw));
    if (raw.image?.complete || raw.image?.width) apply();
    else raw.image?.addEventListener?.("load", apply);
    return () => raw.image?.removeEventListener?.("load", apply);
  }, [raw]);

  const readyMap = useMemo(() => map, [map]);

  useFrame((_, dt) => {
    if (!group.current) return;
    const d = Math.min(dt, 0.05);
    const reveal = stateRef?.current?.reveal ?? 1;
    const story = stateRef?.current?.story || "explore";
    const target =
      story === "silence" ? 0 : story === "emergence" ? 0.45 : 0.95 * reveal;
    const s = THREE.MathUtils.damp(
      group.current.scale.x || 0.001,
      Math.max(0.001, target),
      2,
      d
    );
    group.current.scale.setScalar(s);
    if (mat.current) {
      mat.current.opacity = THREE.MathUtils.damp(
        mat.current.opacity,
        readyMap ? Math.min(1, target) : 0,
        2,
        d
      );
    }
  });

  return (
    <group ref={group} position={[2.15, -1.65, 1.55]} scale={0.001}>
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0.12]}>
        <planeGeometry args={[0.5, 0.24]} />
        <meshPhysicalMaterial
          color={t.steel}
          metalness={0.8}
          roughness={0.35}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.09, 0]}>
        <boxGeometry args={[0.035, 0.14, 0.035]} />
        <meshPhysicalMaterial
          color={t.steel}
          metalness={0.85}
          roughness={0.28}
          transparent
          opacity={0.45}
        />
      </mesh>

      {readyMap && (
        <mesh position={[0, 0.3, 0.01]} renderOrder={2}>
          <planeGeometry args={[0.36, 0.62]} />
          <meshBasicMaterial
            ref={mat}
            map={readyMap}
            transparent
            opacity={0}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
            alphaTest={0.12}
          />
        </mesh>
      )}
    </group>
  );
}
