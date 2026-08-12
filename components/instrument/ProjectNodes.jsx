"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { THEME } from "@/lib/data/instrument";

function Node({
  project,
  themeId,
  hovered,
  active,
  dimmed,
  onHover,
  onSelect,
}) {
  const root = useRef();
  const glow = useRef(0);
  const t = THEME[themeId] || THEME.night;
  const day = themeId === "day";

  useFrame((_, dt) => {
    if (!root.current) return;
    const target = active ? 0.2 : hovered ? 0.75 : 0.12;
    glow.current = THREE.MathUtils.damp(glow.current, target, 4, Math.min(dt, 0.05));
    const desire = dimmed ? 0 : active ? 0.7 : 1 + glow.current * 0.06;
    root.current.scale.setScalar(
      THREE.MathUtils.damp(root.current.scale.x, desire, 4, Math.min(dt, 0.05))
    );
    root.current.visible = root.current.scale.x > 0.05;
  });

  if (active) {
    return (
      <group ref={root} position={project.node}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.03, 0.7, 0.03]} />
          <meshBasicMaterial color={t.accent} transparent opacity={0.5} />
        </mesh>
      </group>
    );
  }

  return (
    <group
      ref={root}
      position={project.node}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover?.(project);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover?.(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(project);
      }}
    >
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.04]} />
        <meshStandardMaterial
          color={day ? "#2a3340" : "#151c26"}
          metalness={0.7}
          roughness={0.35}
          emissive={t.accent}
          emissiveIntensity={glow.current * 0.08}
        />
      </mesh>
      <mesh position={[0, 0.55, 0.03]}>
        <planeGeometry args={[0.72, 0.72]} />
        <meshStandardMaterial
          color={day ? "#d8d2c6" : "#0e141c"}
          metalness={0.2}
          roughness={0.55}
          emissive={t.accent}
          emissiveIntensity={glow.current * 0.04}
        />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.55, 0.08, 0.28]} />
        <meshStandardMaterial color={day ? "#3a4554" : "#1a222e"} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Invisible hit volume */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.3, 1.4, 0.8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {hovered && !active && (
        <Text
          position={[0, 1.25, 0]}
          fontSize={0.07}
          color={t.accent}
          anchorX="center"
          letterSpacing={0.16}
        >
          {`PROJECT ${project.index}`}
        </Text>
      )}
    </group>
  );
}

/** Work field — project nodes as system markers, not museum pedestals. */
export default function ProjectNodes({
  projects,
  themeId,
  hoverSlug,
  activeSlug,
  onHover,
  onSelect,
  visible,
}) {
  const group = useRef();
  useFrame((_, dt) => {
    if (!group.current) return;
    const target = visible ? 1 : 0;
    group.current.visible = visible || group.current.scale.x > 0.05;
    const s = THREE.MathUtils.damp(group.current.scale.x, target, 3, Math.min(dt, 0.05));
    group.current.scale.setScalar(s);
  });

  const list = useMemo(() => projects || [], [projects]);

  return (
    <group ref={group} scale={0.001}>
      {list.map((p) => (
        <Node
          key={p.slug}
          project={p}
          themeId={themeId}
          hovered={hoverSlug === p.slug}
          active={activeSlug === p.slug}
          dimmed={!!activeSlug && activeSlug !== p.slug}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
