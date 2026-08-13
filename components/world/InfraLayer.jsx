"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { THEME, semanticColor } from "@/lib/data/data-world";

/** Build a LINE field diagram — architecture as measurement, not boxes */
function fieldGeom(segments) {
  const positions = new Float32Array(segments.length * 6);
  segments.forEach(([a, b], i) => {
    const o = i * 6;
    positions[o] = a[0];
    positions[o + 1] = a[1];
    positions[o + 2] = a[2];
    positions[o + 3] = b[0];
    positions[o + 4] = b[1];
    positions[o + 5] = b[2];
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return g;
}

function Field({ segments, color, matRef }) {
  const geom = useMemo(() => fieldGeom(segments), [segments]);
  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial
        ref={matRef}
        color={color}
        transparent
        opacity={0.02}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/**
 * Layer 4 — FIELD / intelligence scaffolding.
 * Dormant line architecture wakes with related technology.
 */
export default function InfraLayer({ themeId, stateRef, layer = "world" }) {
  const root = useRef();
  const mats = useRef({
    cloud: null,
    platform: null,
    storage: null,
    analytics: null,
    ai: null,
  });
  const opacities = useRef({
    cloud: 0.02,
    platform: 0.02,
    storage: 0.02,
    analytics: 0.02,
    ai: 0.02,
  });
  const t = THEME[themeId] || THEME.night;

  const fields = useMemo(() => {
    const steel = t.steel;
    const data = semanticColor("data", themeId);
    const transform = semanticColor("transform", themeId);
    const ai = semanticColor("ai", themeId);

    return {
      cloud: {
        color: steel,
        position: [-3.6, 0.2, -2.4],
        segments: [
          [[-0.5, 0, 0], [-0.5, 1.8, 0]],
          [[0.1, 0, 0.1], [0.1, 2.2, 0.1]],
          [[0.7, 0, -0.15], [0.7, 1.4, -0.15]],
          [[-0.5, 1.6, 0], [0.7, 1.6, 0]],
          [[-0.5, 0.9, 0], [0.7, 0.9, 0]],
          [[-0.5, 0.3, 0], [0.3, 0.3, 0.4]],
        ],
      },
      platform: {
        color: transform,
        position: [3.4, 0.1, -2.1],
        segments: [
          [[-0.6, 0.4, 0], [0.6, 0.4, 0]],
          [[-0.5, 0.8, 0], [0.5, 0.8, 0]],
          [[-0.4, 1.2, 0], [0.4, 1.2, 0]],
          [[-0.6, 0.4, 0], [-0.6, 1.4, 0]],
          [[0.6, 0.4, 0], [0.6, 1.4, 0]],
          [[0, 1.2, 0], [0, 1.6, 0.35]],
        ],
      },
      storage: {
        color: data,
        position: [0.2, -1.0, -3.0],
        segments: [0, 1, 2, 3, 4].flatMap((i) => {
          const y = i * 0.2;
          const w = 0.75 - i * 0.08;
          const d = 0.4 - i * 0.04;
          return [
            [[-w, y, -d], [w, y, -d]],
            [[w, y, -d], [w, y, d]],
            [[w, y, d], [-w, y, d]],
            [[-w, y, d], [-w, y, -d]],
          ];
        }),
      },
      analytics: {
        color: data,
        position: [2.0, -0.5, -3.4],
        segments: [
          [[-0.8, 0.2, 0], [0.8, 0.2, 0]],
          [[-0.8, 0.2, 0.5], [0.8, 0.2, 0.5]],
          [[-0.5, 0.2, 0], [-0.5, 1.0, 0]],
          [[0.5, 0.2, 0], [0.5, 1.0, 0]],
          [[-0.5, 1.0, 0], [0.5, 1.0, 0]],
          [[-0.3, 0.5, 0], [0.3, 0.5, 0.45]],
        ],
      },
      ai: {
        color: ai,
        position: [-2.2, 0.7, -3.2],
        segments: [
          [[-0.4, 0.2, 0], [0.4, 0.2, 0]],
          [[-0.4, 1.0, 0], [0.4, 1.0, 0]],
          [[-0.4, 0.2, 0], [-0.4, 1.0, 0]],
          [[0.4, 0.2, 0], [0.4, 1.0, 0]],
          [[0, 0.2, 0], [0, 1.0, 0]],
          [[-0.4, 0.6, 0], [0.4, 0.6, 0]],
          [[0, 0.6, -0.3], [0, 0.6, 0.3]],
        ],
      },
    };
  }, [themeId, t.steel]);

  useFrame((_, dt) => {
    if (!root.current) return;
    const d = Math.min(dt, 0.05);
    const wake = stateRef?.current?.infraWake || null;
    const reveal = stateRef?.current?.reveal ?? 1;
    const story = stateRef?.current?.story || "explore";
    const inWork = layer === "work";
    const baseVisible =
      story === "silence" || inWork ? 0 : 0.04 * reveal;

    Object.keys(opacities.current).forEach((key) => {
      const target = wake === key ? 0.35 * reveal : baseVisible;
      opacities.current[key] = THREE.MathUtils.damp(
        opacities.current[key],
        target,
        3.5,
        d
      );
      const mat = mats.current[key];
      if (mat) mat.opacity = opacities.current[key];
    });

    root.current.rotation.y = (stateRef?.current?.globeRotY || 0) * 0.12;
  });

  return (
    <group ref={root} position={[0, -0.35, -1.1]} scale={1.12}>
      {Object.entries(fields).map(([key, field]) => (
        <group key={key} position={field.position}>
          <Field
            segments={field.segments}
            color={field.color}
            matRef={(m) => {
              mats.current[key] = m;
            }}
          />
        </group>
      ))}
    </group>
  );
}
