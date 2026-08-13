"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { getPointMap } from "./pointMap";
import { THEME, semanticColor } from "@/lib/data/data-world";
import {
  STORY_ANIME,
  STORY_GAMING,
  STORY_BOARD,
  STORY_TRAVEL,
  STORY_PEOPLE,
  STORY_PERSONAL,
  STORY_IDENTITY,
} from "@/lib/data/anime-story";
import { UNIVERSE_NODES } from "@/lib/data/universe-nodes";

const badmintonNode = UNIVERSE_NODES.find((n) => n.id === "sport");

/** Personal constellation — insight strings from documented sources */
const INTERESTS = [
  { id: "anime", label: "ANIME", insight: STORY_ANIME.line },
  { id: "gaming", label: "GAMING", insight: STORY_GAMING.line1 },
  { id: "board", label: "BOARD GAMES", insight: STORY_BOARD.line },
  { id: "badminton", label: "BADMINTON", insight: badmintonNode?.vignette || "Movement and focus." },
  { id: "travel", label: "TRAVEL", insight: STORY_TRAVEL.lines[0] },
  { id: "community", label: "COMMUNITY", insight: STORY_PEOPLE.line2 },
  { id: "ai", label: "AI", insight: "Curious engineering — tools that stay in their lane." },
  {
    id: "learning",
    label: "LEARNING",
    insight: STORY_IDENTITY.fragments.find((f) => f.id === "learn")?.detail || STORY_PERSONAL.line1,
  },
];

function interestPos(i, total) {
  const a = (i / total) * Math.PI * 2 - Math.PI / 2;
  const r = 0.95;
  return [Math.cos(a) * r, Math.sin(a) * r * 0.5, Math.sin(a * 0.8) * 0.15];
}

function InterestNode({ item, pos, themeId, hot, fadeRef, onHover }) {
  const ref = useRef();
  const point = useRef();
  const t = THEME[themeId] || THEME.night;
  const color = semanticColor("accent", themeId);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const d = Math.min(dt, 0.05);
    const fade = fadeRef.current;
    const s = (hot ? 1.2 : 1) * fade;
    ref.current.scale.setScalar(
      THREE.MathUtils.damp(ref.current.scale.x || 0.001, Math.max(0.001, s), 5, d)
    );
    if (point.current?.material) {
      point.current.material.opacity = fade * (hot ? 0.9 : 0.5);
      point.current.material.size = hot ? 0.11 : 0.08;
      point.current.material.color.set(hot ? t.accent : color);
    }
  });

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
    return g;
  }, []);

  return (
    <group
      ref={ref}
      position={pos}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover?.(item);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover?.(null);
      }}
    >
      <points ref={point} geometry={geom} frustumCulled={false}>
        <pointsMaterial
          map={getPointMap()}
          size={0.08}
          sizeAttenuation
          color={color}
          transparent
          opacity={0.5}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <mesh visible={false}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
      <Text
        position={[0, 0.14, 0]}
        fontSize={0.046}
        color={hot ? t.ink : t.steel}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.002}
        outlineColor={t.bg}
      >
        {item.label}
      </Text>
      {hot && (
        <Text
          position={[0, -0.12, 0]}
          fontSize={0.032}
          color={t.muted}
          anchorX="center"
          anchorY="top"
          maxWidth={1.3}
          outlineWidth={0.0015}
          outlineColor={t.bg}
        >
          {item.insight}
        </Text>
      )}
    </group>
  );
}

/**
 * About layer — personal constellation radiating from a calm center field.
 */
export default function AboutField({ themeId, active, onHover }) {
  const root = useRef();
  const centerRef = useRef();
  const linesRef = useRef();
  const fade = useRef(0);
  const [hoverItem, setHoverItem] = useState(null);
  const t = THEME[themeId] || THEME.night;

  const positions = useMemo(
    () => INTERESTS.map((_, i) => interestPos(i, INTERESTS.length)),
    []
  );

  const centerGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(24 * 3);
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const r = 0.08 + (i % 5) * 0.025;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = Math.sin(a) * r * 0.6;
      arr[i * 3 + 2] = Math.sin(a * 2) * 0.04;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(INTERESTS.length * 6), 3)
    );
    return g;
  }, []);

  useEffect(() => {
    if (!active) fade.current = 0;
  }, [active]);

  useFrame((state, dt) => {
    if (!root.current) return;
    const d = Math.min(dt, 0.05);
    fade.current = THREE.MathUtils.damp(fade.current, active ? 1 : 0, active ? 2.8 : 5, d);
    root.current.visible = fade.current > 0.02;

    const arr = lineGeom.attributes.position.array;
    positions.forEach((p, i) => {
      const o = i * 6;
      arr[o] = 0;
      arr[o + 1] = 0;
      arr[o + 2] = 0;
      arr[o + 3] = p[0];
      arr[o + 4] = p[1];
      arr[o + 5] = p[2];
    });
    lineGeom.attributes.position.needsUpdate = true;

    if (linesRef.current?.material) {
      linesRef.current.material.opacity = fade.current * 0.18;
      linesRef.current.material.color.set(t.steel);
    }
    if (centerRef.current?.material) {
      const breath = 0.5 + Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
      centerRef.current.material.opacity = fade.current * breath * 0.35;
      centerRef.current.material.color.set(semanticColor("infra", themeId));
    }
  });

  return (
    <group ref={root} visible={false}>
      <points ref={centerRef} geometry={centerGeom} frustumCulled={false}>
        <pointsMaterial
          map={getPointMap()}
          size={0.04}
          sizeAttenuation
          color={t.steel}
          transparent
          opacity={0.3}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeom}>
        <lineBasicMaterial color={t.steel} transparent opacity={0.1} depthWrite={false} />
      </lineSegments>
      {INTERESTS.map((item, i) => (
        <InterestNode
          key={item.id}
          item={item}
          pos={positions[i]}
          themeId={themeId}
          hot={hoverItem?.id === item.id}
          fadeRef={fade}
          onHover={(it) => {
            setHoverItem(it);
            onHover?.(it);
          }}
        />
      ))}
    </group>
  );
}
