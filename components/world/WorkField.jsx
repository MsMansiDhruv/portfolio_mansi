"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { getWorkClusters, THEME, semanticColor } from "@/lib/data/data-world";

function cellMap() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 28);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.55, "rgba(255,255,255,0.9)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(32, 32, 28, 0, Math.PI * 2);
  ctx.fill();
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

/** Build topology point/line networks for each project metaphor */
function buildTopology(topology, seed = 0) {
  const pts = [];
  const links = [];
  const rnd = (i) => {
    const x = Math.sin(seed * 12.9 + i * 78.1) * 43758.5453;
    return x - Math.floor(x);
  };

  if (topology === "tangle") {
    for (let i = 0; i < 18; i++) {
      pts.push([
        (rnd(i) - 0.5) * 1.4,
        (rnd(i + 3) - 0.5) * 1.0,
        (rnd(i + 7) - 0.5) * 0.6,
      ]);
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (rnd(i * 17 + j) > 0.72) links.push([i, j]);
      }
    }
  } else if (topology === "hub") {
    pts.push([0, 0, 0]);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const r = i < 5 ? 0.85 : 1.25;
      pts.push([Math.cos(a) * r, Math.sin(a) * r * 0.55, (rnd(i) - 0.5) * 0.3]);
      links.push([0, i + 1]);
    }
    for (let i = 1; i <= 5; i++) links.push([i, i + 5]);
  } else if (topology === "fan") {
    pts.push([0.55, 0, 0]);
    for (let i = 0; i < 12; i++) {
      pts.push([
        -0.9,
        (i / 11 - 0.5) * 1.5,
        (rnd(i) - 0.5) * 0.4,
      ]);
      links.push([i + 1, 0]);
    }
  } else {
    // split — one congested hub → two calm branches
    pts.push([0, 0, 0]);
    for (let i = 0; i < 6; i++) {
      pts.push([(rnd(i) - 0.5) * 0.5, (rnd(i + 2) - 0.5) * 0.5, 0.1]);
      links.push([0, i + 1]);
    }
    const left = pts.length;
    pts.push([-1.1, 0.2, 0]);
    pts.push([-1.35, 0.55, 0.1]);
    pts.push([-1.35, -0.15, -0.1]);
    links.push([0, left], [left, left + 1], [left, left + 2]);
    const right = pts.length;
    pts.push([1.1, 0.15, 0]);
    pts.push([1.4, 0.5, 0]);
    pts.push([1.4, -0.2, 0.1]);
    links.push([0, right], [right, right + 1], [right, right + 2]);
  }

  return { pts, links };
}

function Cluster({
  cluster,
  themeId,
  active,
  selected,
  unfold,
  onHover,
  onSelect,
}) {
  const root = useRef();
  const pointsRef = useRef();
  const linesRef = useRef();
  const progress = useRef(0);
  const map = useMemo(() => cellMap(), []);
  const t = THEME[themeId] || THEME.night;
  const color = selected
    ? t.accent
    : active
      ? semanticColor("data", themeId)
      : t.steel;

  const { pts, links, home, target } = useMemo(() => {
    const topo = buildTopology(cluster.topology, cluster.index + 1);
    const a = cluster.homeAngle;
    const r = cluster.homeRadius;
    return {
      ...topo,
      home: [Math.cos(a) * r, Math.sin(a) * 0.35, Math.sin(a) * r * 0.55],
      target: cluster.unfold,
    };
  }, [cluster]);

  const pointGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      arr[i * 3] = p[0];
      arr[i * 3 + 1] = p[1];
      arr[i * 3 + 2] = p[2];
    });
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [pts]);

  const lineGeom = useMemo(() => {
    const arr = new Float32Array(links.length * 6);
    links.forEach(([a, b], i) => {
      const o = i * 6;
      arr[o] = pts[a][0];
      arr[o + 1] = pts[a][1];
      arr[o + 2] = pts[a][2];
      arr[o + 3] = pts[b][0];
      arr[o + 4] = pts[b][1];
      arr[o + 5] = pts[b][2];
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [pts, links]);

  useFrame((_, dt) => {
    if (!root.current) return;
    const d = Math.min(dt, 0.05);
    progress.current = THREE.MathUtils.damp(
      progress.current,
      unfold ? 1 : 0,
      2.2,
      d
    );
    const u = progress.current;
    root.current.position.set(
      THREE.MathUtils.lerp(home[0], target[0], u),
      THREE.MathUtils.lerp(home[1], target[1], u),
      THREE.MathUtils.lerp(home[2], target[2], u)
    );
    const s = THREE.MathUtils.lerp(0.15, selected ? 1.15 : 0.85, u);
    root.current.scale.setScalar(s);
    root.current.visible = u > 0.02;

    if (pointsRef.current?.material) {
      pointsRef.current.material.opacity = 0.15 + u * 0.8;
      pointsRef.current.material.color.set(color);
      pointsRef.current.material.size = selected ? 0.14 : 0.1;
    }
    if (linesRef.current?.material) {
      linesRef.current.material.opacity = 0.05 + u * (selected ? 0.55 : 0.28);
      linesRef.current.material.color.set(color);
    }
  });

  return (
    <group
      ref={root}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover?.(cluster);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover?.(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(cluster, root.current.position.toArray());
      }}
    >
      <points ref={pointsRef} geometry={pointGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={0.14}
          sizeAttenuation
          color={color}
          transparent
          opacity={0}
          depthWrite={false}
          alphaTest={0.12}
          toneMapped={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeom}>
        <lineBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
      </lineSegments>
      <mesh visible={false}>
        <sphereGeometry args={[0.55, 10, 10]} />
        <meshBasicMaterial />
      </mesh>
      {unfold && (
        <Text
          position={[0, 0.85, 0]}
          fontSize={0.07}
          color={t.ink}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.003}
          outlineColor={t.bg}
        >
          {`PROJECT ${cluster.code}`}
        </Text>
      )}
      {unfold && (active || selected) && (
        <Text
          position={[0, 0.72, 0]}
          fontSize={0.045}
          color={t.steel}
          anchorX="center"
          anchorY="bottom"
          maxWidth={2.2}
          outlineWidth={0.002}
          outlineColor={t.bg}
        >
          {cluster.cardTitle}
        </Text>
      )}
    </group>
  );
}

/**
 * WORK layer — Data Orbit unfolds into four system clusters.
 * Same world. No project grid fade.
 */
export default function WorkField({
  themeId,
  active,
  hoverSlug,
  selectedSlug,
  onHover,
  onSelect,
}) {
  const clusters = useMemo(() => getWorkClusters(), []);

  return (
    <group>
      {clusters.map((c) => (
        <Cluster
          key={c.slug}
          cluster={c}
          themeId={themeId}
          active={hoverSlug === c.slug}
          selected={selectedSlug === c.slug}
          unfold={active}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
