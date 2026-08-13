"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { getPointMap } from "./pointMap";
import { THEME, semanticColor } from "@/lib/data/data-world";
import { getProjectMeta } from "@/lib/data/project-meta";

const FLOW_PER_PATH = 4;
const SCALE = 2.5;

function rnd(seed, i) {
  const x = Math.sin(seed * 12.9 + i * 78.1) * 43758.5453;
  return x - Math.floor(x);
}

/** Build chaotic + resolved pipeline geometry per topology metaphor */
function buildPipeline(topology, seed = 1, stageLabels = []) {
  const chaoticPts = [];
  const chaoticLinks = [];
  const cleanPts = [];
  const cleanLinks = [];
  const stages = [];
  const paths = [];

  const labelAt = (i, fallback) => {
    const raw = stageLabels[i];
    if (!raw) return fallback;
    return String(raw).split("—")[0].trim().toUpperCase().slice(0, 24);
  };

  if (topology === "tangle") {
    for (let i = 0; i < 16; i++) {
      chaoticPts.push([
        (rnd(seed, i) - 0.5) * 1.6,
        (rnd(seed, i + 5) - 0.5) * 1.1,
        (rnd(seed, i + 11) - 0.5) * 0.5,
      ]);
    }
    for (let i = 0; i < chaoticPts.length; i++) {
      for (let j = i + 1; j < chaoticPts.length; j++) {
        if (rnd(seed, i * 19 + j) > 0.68) chaoticLinks.push([i, j]);
      }
    }

    const layerCount = Math.max(3, stageLabels.length || 3);
    for (let i = 0; i < layerCount; i++) {
      const x = -0.95 + (i / (layerCount - 1)) * 1.9;
      cleanPts.push([x, 0, 0]);
      stages.push({
        label: labelAt(i, ["SOURCE", "TRANSFORM", "OUTPUT"][i] || "STAGE"),
        pos: [x, 0.22, 0],
      });
      if (i > 0) cleanLinks.push([i - 1, i]);
    }
    for (let i = 0; i < layerCount; i++) {
      for (let k = 0; k < 3; k++) {
        cleanPts.push([
          cleanPts[i][0],
          (k - 1) * 0.18,
          (rnd(seed, i + k + 40) - 0.5) * 0.12,
        ]);
        cleanLinks.push([i, cleanPts.length - 1]);
      }
    }
  } else if (topology === "hub") {
    chaoticPts.push([0, 0, 0]);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      chaoticPts.push([
        Math.cos(a) * 0.95,
        Math.sin(a) * 0.65,
        (rnd(seed, i) - 0.5) * 0.35,
      ]);
      chaoticLinks.push([0, i + 1]);
      if (i % 3 === 0 && i > 0) chaoticLinks.push([i, i + 1]);
    }

    cleanPts.push([0, 0, 0]);
    stages.push({ label: "DECISION", pos: [0, 0.24, 0] });
    for (let i = 0; i < 6; i++) {
      const y = (i / 5 - 0.5) * 1.2;
      cleanPts.push([-0.95, y, (rnd(seed, i) - 0.5) * 0.15]);
      cleanLinks.push([0, i + 1]);
    }
    for (let i = 0; i < 4; i++) {
      const y = (i / 3 - 0.5) * 0.9;
      const w = 0.55 + rnd(seed, i + 20) * 0.35;
      cleanPts.push([0.95 * w, y, 0]);
      cleanLinks.push([0, 6 + i]);
    }
    stages.push({ label: "INPUT", pos: [-1.05, 0.55, 0] });
    stages.push({ label: "OUTPUT", pos: [1.05, 0.55, 0] });
  } else if (topology === "fan") {
    for (let i = 0; i < 10; i++) {
      chaoticPts.push([
        -0.85 + rnd(seed, i) * 0.35,
        (i / 9 - 0.5) * 1.5,
        (rnd(seed, i + 8) - 0.5) * 0.45,
      ]);
      if (i > 0) chaoticLinks.push([i - 1, i]);
      if (i > 2 && rnd(seed, i + 30) > 0.5) chaoticLinks.push([0, i]);
    }

    cleanPts.push([-0.15, 0, 0], [0.75, 0, 0]);
    cleanLinks.push([0, 1]);
    stages.push({ label: "MERGE", pos: [-0.15, 0.22, 0] });
    stages.push({ label: "OUTPUT", pos: [0.75, 0.22, 0] });
    for (let i = 0; i < 8; i++) {
      cleanPts.push([-0.95, (i / 7 - 0.5) * 1.35, (rnd(seed, i) - 0.5) * 0.12]);
      cleanLinks.push([2 + i, 0]);
    }
    stages.push({ label: "SOURCE", pos: [-1.05, 0.55, 0] });
  } else {
    // split
    chaoticPts.push([0, 0, 0]);
    for (let i = 0; i < 10; i++) {
      chaoticPts.push([
        (rnd(seed, i) - 0.5) * 0.55,
        (rnd(seed, i + 4) - 0.5) * 0.55,
        (rnd(seed, i + 9) - 0.5) * 0.25,
      ]);
      chaoticLinks.push([0, i + 1]);
    }

    cleanPts.push([0, 0, 0]);
    stages.push({ label: "CONGESTION", pos: [0, 0.24, 0] });
    const left = cleanPts.length;
    cleanPts.push([-0.55, 0.15, 0], [-1.15, 0.45, 0.08], [-1.15, -0.2, -0.06]);
    cleanLinks.push([0, left], [left, left + 1], [left, left + 2]);
    const right = cleanPts.length;
    cleanPts.push([0.55, 0.1, 0], [1.15, 0.42, 0], [1.15, -0.18, 0.06]);
    cleanLinks.push([0, right], [right, right + 1], [right, right + 2]);
    stages.push({ label: "SPECIALIZED", pos: [-1.25, 0.62, 0] });
    stages.push({ label: "SPECIALIZED", pos: [1.25, 0.62, 0] });
  }

  const linkSet = (links, pts) => {
    const seen = new Set();
    links.forEach(([a, b]) => {
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (seen.has(key)) return;
      seen.add(key);
      const va = new THREE.Vector3(...pts[a]);
      const vb = new THREE.Vector3(...pts[b]);
      const mid = va.clone().add(vb).multiplyScalar(0.5);
      if (topology !== "tangle") {
        mid.y += 0.08;
        mid.z += (rnd(seed, a + b) - 0.5) * 0.12;
      }
      paths.push(new THREE.QuadraticBezierCurve3(va, mid, vb));
    });
  };

  linkSet(cleanLinks, cleanPts);

  return { chaoticPts, chaoticLinks, cleanPts, cleanLinks, stages, paths };
}

/**
 * Immersive project pipeline — POINT + LINE field when a work cluster is entered.
 */
export default function ProjectPipeline({ themeId, cluster, active, onReady }) {
  const root = useRef();
  const pointsRef = useRef();
  const linesRef = useRef();
  const flowRef = useRef();
  const fade = useRef(0);
  const resolve = useRef(0);
  const readySent = useRef(false);
  const t = THEME[themeId] || THEME.night;

  const meta = useMemo(
    () => (cluster?.slug ? getProjectMeta(cluster.slug) : null),
    [cluster?.slug]
  );

  const { chaoticPts, chaoticLinks, cleanPts, cleanLinks, stages, paths } = useMemo(() => {
    if (!cluster) {
      return {
        chaoticPts: [],
        chaoticLinks: [],
        cleanPts: [],
        cleanLinks: [],
        stages: [],
        paths: [],
      };
    }
    return buildPipeline(
      cluster.topology || "hub",
      (cluster.index ?? 0) + 7,
      meta?.architectureLayers || []
    );
  }, [cluster, meta]);

  const pointCount = Math.max(chaoticPts.length, cleanPts.length);
  const flowCount = paths.length * FLOW_PER_PATH;

  const pointGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3)
    );
    return g;
  }, [pointCount]);

  const lineGeom = useMemo(() => {
    const maxLinks = Math.max(chaoticLinks.length, cleanLinks.length);
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(Math.max(maxLinks, 1) * 6), 3)
    );
    return g;
  }, [chaoticLinks.length, cleanLinks.length]);

  const flowGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(Math.max(flowCount, 1) * 3), 3)
    );
    return g;
  }, [flowCount]);

  useEffect(() => {
    readySent.current = false;
    if (!active) fade.current = 0;
  }, [active, cluster?.slug]);

  useFrame((state, dt) => {
    if (!root.current) return;
    const d = Math.min(dt, 0.05);
    const targetFade = active ? 1 : 0;
    fade.current = THREE.MathUtils.damp(fade.current, targetFade, active ? 2.8 : 5, d);
    resolve.current = THREE.MathUtils.damp(
      resolve.current,
      active ? 1 : 0,
      active ? 1.4 : 4,
      d
    );

    root.current.visible = fade.current > 0.015;
    root.current.scale.setScalar(SCALE * (0.85 + fade.current * 0.15));

    if (fade.current > 0.85 && active && !readySent.current) {
      readySent.current = true;
      onReady?.();
    }

    const u = resolve.current;
    const posArr = pointGeom.attributes.position.array;
    const count = Math.max(chaoticPts.length, cleanPts.length);
    for (let i = 0; i < count; i++) {
      const c = chaoticPts[i] || cleanPts[i] || [0, 0, 0];
      const r = cleanPts[i] || chaoticPts[i] || [0, 0, 0];
      const i3 = i * 3;
      posArr[i3] = THREE.MathUtils.lerp(c[0], r[0], u);
      posArr[i3 + 1] = THREE.MathUtils.lerp(c[1], r[1], u);
      posArr[i3 + 2] = THREE.MathUtils.lerp(c[2], r[2], u);
    }
    pointGeom.setDrawRange(0, count);
    pointGeom.attributes.position.needsUpdate = true;

    const links = u > 0.5 ? cleanLinks : chaoticLinks;
    const pts = links === cleanLinks ? cleanPts : chaoticPts;
    const lineArr = lineGeom.attributes.position.array;
    links.forEach(([a, b], li) => {
      const pa = pts[a] || [0, 0, 0];
      const pb = pts[b] || [0, 0, 0];
      const o = li * 6;
      lineArr[o] = pa[0];
      lineArr[o + 1] = pa[1];
      lineArr[o + 2] = pa[2];
      lineArr[o + 3] = pb[0];
      lineArr[o + 4] = pb[1];
      lineArr[o + 5] = pb[2];
    });
    lineGeom.setDrawRange(0, links.length * 2);
    lineGeom.attributes.position.needsUpdate = true;

    if (flowRef.current && paths.length) {
      const fArr = flowGeom.attributes.position.array;
      const time = state.clock.elapsedTime;
      let fi = 0;
      paths.forEach((curve, pi) => {
        for (let k = 0; k < FLOW_PER_PATH; k++) {
          const i3 = fi * 3;
          if (fade.current > 0.2 && u > 0.35) {
            const speed = cluster?.topology === "split" ? 0.14 : 0.22;
            const pt = curve.getPoint((time * speed + pi * 0.13 + k / FLOW_PER_PATH) % 1);
            fArr[i3] = pt.x;
            fArr[i3 + 1] = pt.y;
            fArr[i3 + 2] = pt.z;
          } else {
            fArr[i3 + 1] = -99;
          }
          fi++;
        }
      });
      flowGeom.attributes.position.needsUpdate = true;
      flowRef.current.material.opacity = fade.current * (0.35 + u * 0.45);
    }

    const kind =
      cluster?.topology === "hub"
        ? "ai"
        : cluster?.topology === "fan"
          ? "data"
          : cluster?.topology === "split"
            ? "transform"
            : "infra";
    const color = semanticColor(kind, themeId);

    if (pointsRef.current?.material) {
      pointsRef.current.material.opacity = fade.current * (0.25 + u * 0.65);
      pointsRef.current.material.color.set(color);
      pointsRef.current.material.size = 0.08 + u * 0.04;
    }
    if (linesRef.current?.material) {
      linesRef.current.material.opacity = fade.current * (0.08 + u * 0.42);
      linesRef.current.material.color.set(color);
    }
  });

  if (!cluster) return null;

  return (
    <group ref={root} position={[0, 0, 0]} visible={false}>
      <points ref={pointsRef} geometry={pointGeom} frustumCulled={false}>
        <pointsMaterial
          map={getPointMap()}
          size={0.1}
          sizeAttenuation
          color={t.data}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeom}>
        <lineBasicMaterial color={t.steel} transparent opacity={0} depthWrite={false} />
      </lineSegments>
      <points ref={flowRef} geometry={flowGeom} frustumCulled={false}>
        <pointsMaterial
          map={getPointMap()}
          size={0.055}
          sizeAttenuation
          color={t.accent}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      {stages.map((s) => (
        <Text
          key={s.label + s.pos[0]}
          position={s.pos}
          fontSize={0.042}
          color={t.steel}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.002}
          outlineColor={t.bg}
        >
          {s.label}
        </Text>
      ))}
    </group>
  );
}
