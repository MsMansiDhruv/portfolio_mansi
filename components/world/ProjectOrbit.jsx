"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { THEME } from "@/lib/data/data-world";

function ProjectNode({ project, themeId, hot, active, dimmed, onHover, onSelect }) {
  const ref = useRef();
  const t = THEME[themeId] || THEME.night;
  const pos = useMemo(() => {
    return [
      Math.cos(project.angle) * project.radius,
      project.y,
      Math.sin(project.angle) * project.radius,
    ];
  }, [project]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const desire = dimmed ? 0 : active ? 0.75 : hot ? 1.2 : 1;
    ref.current.scale.setScalar(
      THREE.MathUtils.damp(ref.current.scale.x, desire, 4, Math.min(dt, 0.05))
    );
    ref.current.visible = ref.current.scale.x > 0.05;
  });

  if (active) {
    return (
      <group ref={ref} position={pos}>
        <mesh>
          <ringGeometry args={[0.18, 0.22, 32]} />
          <meshBasicMaterial
            color={t.accent}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group
      ref={ref}
      position={pos}
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
      <mesh>
        <boxGeometry args={[0.28, 0.28, 0.04]} />
        <meshStandardMaterial
          color={themeId === "day" ? "#2a3340" : "#151c28"}
          metalness={0.7}
          roughness={0.3}
          emissive={t.accent}
          emissiveIntensity={hot ? 0.25 : 0.05}
        />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshStandardMaterial
          color={themeId === "day" ? "#d8d2c6" : "#0e141c"}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[0.55, 0.55, 0.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {hot && (
        <Text
          position={[0, 0.32, 0]}
          fontSize={0.06}
          color={t.accent}
          anchorX="center"
          letterSpacing={0.12}
        >
          {`PROJECT ${project.index}`}
        </Text>
      )}
    </group>
  );
}

/** Outer project orbit — systems, not cards. */
export default function ProjectOrbit({
  projects,
  themeId,
  hoverSlug,
  activeSlug,
  visible,
  onHover,
  onSelect,
}) {
  const root = useRef();

  useFrame((_, dt) => {
    if (!root.current) return;
    const s = THREE.MathUtils.damp(
      root.current.scale.x || 0.001,
      visible ? 1 : 0,
      2.4,
      Math.min(dt, 0.05)
    );
    root.current.scale.setScalar(s);
    root.current.visible = s > 0.04;
  });

  return (
    <group ref={root} scale={0.001}>
      {projects.map((p) => (
        <ProjectNode
          key={p.slug}
          project={p}
          themeId={themeId}
          hot={hoverSlug === p.slug}
          active={activeSlug === p.slug}
          dimmed={!!activeSlug && activeSlug !== p.slug}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
