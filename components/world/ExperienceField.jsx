"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { getPointMap } from "./pointMap";
import { CAREER_TIMELINE } from "@/lib/data/career";
import { THEME, semanticColor } from "@/lib/data/data-world";

/** Chronological arc — oldest left, newest right */
function timelineLayout() {
  const stages = [...CAREER_TIMELINE].reverse();
  const n = stages.length;
  return stages.map((stage, i) => {
    const t = n <= 1 ? 0.5 : i / (n - 1);
    const angle = -Math.PI * 0.22 + t * Math.PI * 0.44;
    const x = -1.15 + t * 2.3;
    const y = Math.sin(angle) * 0.35;
    const z = Math.cos(angle) * 0.12;
    const satellites = Math.min(i + 1, 4);
    const sats = [];
    for (let k = 0; k < satellites; k++) {
      const sa = angle + ((k / satellites) - 0.5) * 0.9;
      sats.push([
        x + Math.cos(sa) * 0.22,
        y + Math.sin(sa) * 0.18,
        z + (k - satellites / 2) * 0.06,
      ]);
    }
    return { stage, x, y, z, satellites: sats, index: i };
  });
}

function TimelineNode({ entry, themeId, hot, dimmed, fadeRef, onHover, onSelect }) {
  const ref = useRef();
  const point = useRef();
  const live = useRef([entry.x, entry.y, entry.z]);
  const t = THEME[themeId] || THEME.night;
  const color = semanticColor("transform", themeId);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const d = Math.min(dt, 0.05);
    const fade = fadeRef.current;
    const s = (hot ? 1.25 : dimmed ? 0.7 : 1) * fade;
    ref.current.scale.setScalar(
      THREE.MathUtils.damp(ref.current.scale.x || 0.001, Math.max(0.001, s), 5, d)
    );
    live.current = [entry.x, entry.y, entry.z];
    if (point.current?.material) {
      point.current.material.opacity = fade * (hot ? 0.95 : dimmed ? 0.25 : 0.65);
      point.current.material.size = hot ? 8 : 5.5;
      point.current.material.color.set(hot ? t.accent : color);
    }
  });

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
    return g;
  }, []);

  const satGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(entry.satellites.length * 3);
    entry.satellites.forEach((p, i) => {
      arr[i * 3] = p[0] - entry.x;
      arr[i * 3 + 1] = p[1] - entry.y;
      arr[i * 3 + 2] = p[2] - entry.z;
    });
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [entry]);

  return (
    <group
      ref={ref}
      position={[entry.x, entry.y, entry.z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover?.(entry.stage);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover?.(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(entry.stage, live.current);
      }}
    >
      <points ref={point} geometry={geom} frustumCulled={false}>
        <pointsMaterial
          map={getPointMap()}
          size={5.5}
          sizeAttenuation={false}
          color={color}
          transparent
          opacity={0.6}
          depthWrite={false}
          alphaTest={0.35}
          toneMapped={false}
        />
      </points>
      <points geometry={satGeom} frustumCulled={false}>
        <pointsMaterial
          map={getPointMap()}
          size={2.4}
          sizeAttenuation={false}
          color={t.steel}
          transparent
          opacity={0.4}
          depthWrite={false}
          alphaTest={0.35}
          toneMapped={false}
        />
      </points>
      <mesh visible={false}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
      {hot && (
        <>
          <Text
            position={[0, 0.18, 0]}
            fontSize={0.055}
            color={t.accent}
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.002}
            outlineColor={t.bg}
          >
            {entry.stage.year}
          </Text>
          <Text
            position={[0, 0.09, 0]}
            fontSize={0.036}
            color={t.ink}
            anchorX="center"
            anchorY="bottom"
            maxWidth={1.2}
            outlineWidth={0.002}
            outlineColor={t.bg}
          >
            {entry.stage.title.toUpperCase()}
          </Text>
        </>
      )}
    </group>
  );
}

/**
 * Experience layer — career timeline as POINT + LINE spine with growing complexity.
 */
export default function ExperienceField({ themeId, active, onHover, onSelect }) {
  const root = useRef();
  const spineRef = useRef();
  const fade = useRef(0);
  const [hoverStage, setHoverStage] = useState(null);
  const t = THEME[themeId] || THEME.night;
  const layout = useMemo(() => timelineLayout(), []);

  const spineGeom = useMemo(() => {
    const pts = layout.map((e) => new THREE.Vector3(e.x, e.y, e.z));
    const curve = new THREE.CatmullRomCurve3(pts);
    const sampled = curve.getPoints(48);
    return new THREE.BufferGeometry().setFromPoints(sampled);
  }, [layout]);

  const linkGeoms = useMemo(
    () =>
      layout.map((entry) => {
        const arr = new Float32Array(entry.satellites.length * 6);
        entry.satellites.forEach((p, i) => {
          const o = i * 6;
          arr[o] = entry.x;
          arr[o + 1] = entry.y;
          arr[o + 2] = entry.z;
          arr[o + 3] = p[0];
          arr[o + 4] = p[1];
          arr[o + 5] = p[2];
        });
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
        return g;
      }),
    [layout]
  );

  useEffect(() => {
    if (!active) fade.current = 0;
  }, [active]);

  useFrame((_, dt) => {
    if (!root.current) return;
    const d = Math.min(dt, 0.05);
    fade.current = THREE.MathUtils.damp(fade.current, active ? 1 : 0, active ? 2.8 : 5, d);
    root.current.visible = fade.current > 0.02;
    if (spineRef.current?.material) {
      spineRef.current.material.opacity = fade.current * 0.35;
      spineRef.current.material.color.set(semanticColor("data", themeId));
    }
  });

  return (
    <group ref={root} visible={false}>
      <line ref={spineRef} geometry={spineGeom}>
        <lineBasicMaterial color={t.steel} transparent opacity={0.2} depthWrite={false} />
      </line>

      {layout.map((entry, i) => (
        <lineSegments key={`links-${entry.stage.id}`} geometry={linkGeoms[i]}>
          <lineBasicMaterial
            color={t.steel}
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </lineSegments>
      ))}

      {layout.map((entry) => (
        <TimelineNode
          key={entry.stage.id}
          entry={entry}
          themeId={themeId}
          hot={hoverStage?.id === entry.stage.id}
          dimmed={!!hoverStage && hoverStage.id !== entry.stage.id}
          fadeRef={fade}
          onHover={(stage) => {
            setHoverStage(stage);
            onHover?.(stage);
          }}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
