"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import {
  ORBITS,
  TECH_NODES,
  TECH_LINKS,
  TECH_META,
  THEME,
  INFRA_WAKE,
  orbitPosition,
  semanticColor,
} from "@/lib/data/data-world";

const FLOW_PER_LINK = 7;
const ROUTE_SAMPLES = 161;
// Only two quiet reference labels remain at rest. The rest of the system is
// discovered through interaction, so the hero retains editorial silence.
const AMBIENT_NODE_IDS = new Set(["aws", "databricks"]);
// The hero is a composed object, not a topology diagram. These are the five
// deliberate streams visible in the resting World state.
const HERO_ROUTE_INDEX = new Set([0, 1, 7, 8, 9]);

/** Circular point map — without this, PointsMaterial draws squares */
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

function connectedIds(hoverId) {
  if (!hoverId) return null;
  const set = new Set([hoverId]);
  TECH_LINKS.forEach(([a, b]) => {
    if (a === hoverId || b === hoverId) {
      set.add(a);
      set.add(b);
    }
  });
  return set;
}

const INTERNAL_LAYOUT = {
  work: [1.42, -0.08, 0.66],
  ai: [-0.7, 0.94, -0.5],
  experience: [-1.38, 0.04, 0.64],
  about: [0.06, 1.18, -0.78],
  contact: [0.92, -0.9, -0.76],
  aws: [1.34, 0.28, -0.22],
  s3: [0.72, 0.7, 0.94],
  lambda: [0.2, 1.16, -0.42],
  ec2: [1.05, -0.62, -0.88],
  azure: [-1.18, 0.46, -0.56],
  databricks: [-0.28, -0.78, 0.08],
  spark: [-1.1, -0.16, 0.54],
  python: [-0.72, -1.06, -0.4],
  sql: [0.18, -1.1, 0.54],
  iceberg: [-0.48, 0.02, 1.34],
  redshift: [0.92, -0.56, 0.6],
  powerbi: [-0.78, 0.9, 0.1],
  terraform: [0.2, -0.92, -0.68],
  mlflow: [1.34, -0.1, 0.16],
  docker: [0.68, 0.28, -1.16],
  ailab: [-0.04, 1.26, 0.16],
};

function nodeWorldPos(node, orbitPhase) {
  const base = INTERNAL_LAYOUT[node.id];
  if (!base) return orbitPosition(node.orbit, node.angle + (orbitPhase[node.orbit] || 0));
  const phase = orbitPhase[node.orbit] || 0;
  const drift = node.tier === "core" ? 0.02 : 0.035;
  return [
    base[0] + Math.sin(node.angle * 1.7 + phase * 6) * drift,
    base[1] + Math.cos(node.angle * 1.3 + phase * 5) * drift * 0.75,
    base[2] + Math.sin(node.angle * 1.15 - phase * 4) * drift,
  ];
}

/**
 * NODE = precision point + optional targeting ring (LINE).
 * No cubes, spheres, or decorative meshes.
 */
function TechNode({
  node,
  themeId,
  hot,
  selected,
  dimmed,
  stateRef,
  onHover,
  onSelect,
}) {
  const ref = useRef();
  const point = useRef();
  const aura = useRef();
  const livePos = useRef([0, 0, 0]);
  const pulse = useRef(0);
  const map = useMemo(() => cellMap(), []);
  const t = THEME[themeId] || THEME.night;
  const isCore = node.tier === "core";
  const ambientLabel = node.interactive === false && TECH_META[node.id]?.portalLabel;
  // SYSTEM NODE — 6–10px (day slightly larger for contrast)
  const isInteractive = node.interactive !== false;
  const size = isCore
    ? themeId === "day"
      ? 14
      : 12.5
    : themeId === "day"
      ? 5.4
      : 5.2;
  const meta = TECH_META[node.id];
  const awake = hot || selected;

  useFrame((state, dt) => {
    if (!ref.current) return;
    const d = Math.min(dt, 0.05);
    const reveal = stateRef?.current?.reveal ?? 1;
    const colourWake = stateRef?.current?.colourWake ?? 0;
    const phase = stateRef?.current?.orbitPhase || {};
    const pos = nodeWorldPos(node, phase);
    livePos.current = pos;
    // Heartbeat only on selected / hovered node — propagates via wake
    pulse.current = awake
      ? 0.5 + Math.sin(state.clock.elapsedTime * 3.2) * 0.5
      : 0;
    const s =
      (awake ? 1.35 + pulse.current * 0.16 : dimmed ? 0.62 : 1) * reveal;
    ref.current.scale.setScalar(
      THREE.MathUtils.damp(ref.current.scale.x || 0.001, Math.max(0.001, s), 6, d)
    );
    ref.current.position.set(pos[0], pos[1], pos[2]);
    if (point.current?.material) {
      // DORMANT → DISCOVERED → CONNECTED / PORTAL
        const baseOp = dimmed ? 0.12 : 0.38 + colourWake * 0.44;
        point.current.material.opacity =
          (isInteractive ? 0.24 : 0.22) +
          reveal * (awake ? 0.92 : baseOp * (isInteractive ? 1 : 0.72));
      point.current.material.size =
        size *
        (awake ? 1.28 + pulse.current * 0.14 : dimmed ? 0.7 : 0.95);
      point.current.material.color.set(
        selected
          ? t.accent
          : hot
            ? semanticColor(node.kind, themeId, 1)
            : isInteractive
              ? t.steel
              : semanticColor(node.kind, themeId, 0.92)
      );
    }
    if (aura.current?.material) {
      aura.current.material.color.set(
        selected ? t.accent : hot ? semanticColor(node.kind, themeId, 1) : isCore ? t.accent : semanticColor(node.kind, themeId, 0.9)
      );
      aura.current.material.opacity = reveal * (awake ? 0.62 : isCore ? 0.16 : 0.07);
      aura.current.material.size = isCore ? (awake ? 38 : 27) : 14;
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
      onPointerOver={(e) => {
        if (!isInteractive) return;
        e.stopPropagation();
        onHover?.(node);
      }}
      onPointerOut={(e) => {
        if (!isInteractive) return;
        e.stopPropagation();
        onHover?.(null);
      }}
      onClick={(e) => {
        if (!isInteractive) return;
        e.stopPropagation();
        onSelect?.(node, livePos.current);
      }}
    >
      <points ref={point} geometry={geom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={size}
          sizeAttenuation={false}
          color={t.steel}
          transparent
          opacity={0.9}
          depthWrite={false}
          alphaTest={0.45}
          toneMapped={false}
        />
      </points>
      <points ref={aura} geometry={geom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={isCore ? 27 : 14}
          sizeAttenuation={false}
          color={t.accent}
          transparent
          opacity={0.12}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          alphaTest={0.02}
          toneMapped={false}
        />
      </points>
      {/* Invisible pick field — not rendered as decorative geometry */}
      <mesh visible={false}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
      {AMBIENT_NODE_IDS.has(node.id) && (
        <Text
          position={[node.angle > Math.PI ? -0.24 : 0.24, isCore ? 0.06 : 0.03, 0]}
          fontSize={0.057}
          color={awake ? semanticColor(node.kind, themeId, 1) : t.faint}
          anchorX={node.angle > Math.PI ? "right" : "left"}
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor={t.bg}
        >
          {(meta?.portalLabel || node.label).toUpperCase()}
        </Text>
      )}
      {AMBIENT_NODE_IDS.has(node.id) && meta?.detail && (
        <Text
          position={[node.angle > Math.PI ? -0.24 : 0.24, isCore ? -0.015 : -0.04, 0]}
          fontSize={0.024}
          color={themeId === "day" ? "#51606f" : "#b9c6d1"}
          anchorX={node.angle > Math.PI ? "right" : "left"}
          anchorY="top"
          outlineWidth={0.002}
          outlineColor={t.bg}
        >
          {meta.detail}
        </Text>
      )}
      {awake && isInteractive && (
        <Text
          position={[0, selected ? 0.22 : 0.16, 0]}
          fontSize={selected ? 0.062 : 0.052}
          color={t.ink}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.003}
          outlineColor={t.bg}
        >
          {(meta?.portalLabel || node.label).toUpperCase()}
        </Text>
      )}
      {awake && isInteractive && meta?.detail && (
        <Text
          position={[0, 0.1, 0]}
          fontSize={0.03}
          color={semanticColor(node.kind, themeId, 1)}
          anchorX="center"
          anchorY="top"
          outlineWidth={0.002}
          outlineColor={t.bg}
        >
          {meta.detail.toUpperCase()}
        </Text>
      )}
    </group>
  );
}

/**
 * Layers 2–3: SYSTEMS + CONNECTIONS.
 * POINT nodes · LINE orbits/pipelines · travelling data units on streams.
 */
export default function TechConstellation({
  themeId,
  hoverId,
  selectedId = null,
  onHover,
  onSelect,
  stateRef,
  layer = "world",
}) {
  const root = useRef();
  const orbitPhase = useRef({ cloud: 0, platform: 0, analytics: 0, ai: 0 });
  const flowRef = useRef();
  const routeGlowRef = useRef();
  const linkMats = useRef([]);
  const t = THEME[themeId] || THEME.night;
  const activeId = selectedId || hoverId;
  const net = connectedIds(activeId);
  const nodePosCache = useRef({});
  const inWork = layer === "work";
  const compactViewport = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 768,
    []
  );
  const flowMap = useMemo(() => cellMap(), []);
  const flowColor = useRef(new THREE.Color());

  const { curves, baseLines, flowCount, glowCount } = useMemo(() => {
    const nodeById = new Map(TECH_NODES.map((node) => [node.id, node]));
    const curves = [];
    const baseLines = [];
    TECH_LINKS.forEach(([a, b], li) => {
      if (!HERO_ROUTE_INDEX.has(li)) return;
      const na = nodeById.get(a);
      const nb = nodeById.get(b);
      if (!na || !nb) return;
      curves.push({
        a,
        b,
        phase: li * 0.11,
        kind: li === 9 ? "data" : na.kind,
        important: [0, 1, 7, 8, 9].includes(li),
        // Warm gold is reserved for the one hero convergence. Everything
        // else is cool system light so the composition keeps its hierarchy.
        signal: li === 0,
      });
      baseLines.push({ a, b, kind: na.kind, important: [0, 1, 7, 9].includes(li) });
    });
    return {
      curves,
      baseLines,
      flowCount: curves.length * FLOW_PER_LINK,
      glowCount: curves.length * ROUTE_SAMPLES,
    };
  }, []);

  const curveState = useMemo(
    () =>
      curves.map(() => ({
        va: new THREE.Vector3(),
        vb: new THREE.Vector3(),
        mid: new THREE.Vector3(),
        lift: new THREE.Vector3(),
        c1: new THREE.Vector3(),
        c2: new THREE.Vector3(),
        avg: new THREE.Vector3(),
        curve: new THREE.CubicBezierCurve3(
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3()
        ),
        samples: Array.from({ length: ROUTE_SAMPLES }, () => new THREE.Vector3()),
      })),
    [curves]
  );

  const flowGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(flowCount * 3), 3)
    );
    g.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(flowCount * 3), 3)
    );
    return g;
  }, [flowCount]);

  const glowGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(glowCount * 3), 3)
    );
    g.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(glowCount * 3), 3)
    );
    return g;
  }, [glowCount]);

  const linkGeoms = useMemo(
    () =>
      baseLines.map(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(123 * 3), 3)
        );
        return g;
      }),
    [baseLines.length]
  );

  useFrame((state, dt) => {
    if (!root.current) return;
    const time = state.clock.elapsedTime;
    const d = Math.min(dt, 0.05);
    const story = stateRef?.current?.story || "explore";
    const reveal = stateRef?.current?.reveal ?? 1;
    const colourWake = stateRef?.current?.colourWake ?? 0;
    const layerFade = inWork ? 0.2 : 1;
    const streamReveal =
      story === "silence"
        ? 0
        : story === "emergence"
          ? 0.25
          : story === "connection"
            ? 0.55
            : story === "reveal"
              ? 0.85
              : 1;

    ORBITS.forEach((o) => {
      // Quiet field — orbits barely drift
      orbitPhase.current[o.id] +=
        o.speed * d * (story === "explore" || story === "identity" ? 0.28 : 0.08);
    });

    TECH_NODES.forEach((node) => {
      nodePosCache.current[node.id] = nodeWorldPos(node, orbitPhase.current);
    });

    curves.forEach((tr, i) => {
      const pa = nodePosCache.current[tr.a];
      const pb = nodePosCache.current[tr.b];
      if (!pa || !pb || !linkGeoms[i]) return;
      const runtime = curveState[i];
      runtime.va.set(pa[0], pa[1], pa[2]);
      runtime.vb.set(pb[0], pb[1], pb[2]);
      // Internal volumetric route — runs through the globe, not around it
      const mid = runtime.mid.copy(runtime.va).add(runtime.vb).multiplyScalar(0.5);
      const radial = runtime.avg.copy(mid).normalize();
      const chord = runtime.lift.copy(runtime.vb).sub(runtime.va).normalize();
      const side = new THREE.Vector3().crossVectors(radial, chord).normalize();
      if (!Number.isFinite(side.x)) side.set(0, 1, 0);
      const inward = radial.clone().multiplyScalar(-0.9 - (i % 3) * 0.06);
      const bend = side.multiplyScalar(((i % 2 === 0 ? 1 : -1) * (0.055 + (i % 3) * 0.018)));
      const avgLen = runtime.avg.copy(runtime.va).add(runtime.vb).multiplyScalar(0.5).length() || 1;
      const c1 = runtime.c1
        .copy(runtime.va)
        .lerp(mid, 0.38)
        .add(inward)
        .add(bend)
        .clampLength(0, 2.18);
      const c2 = runtime.c2
        .copy(runtime.vb)
        .lerp(mid, 0.38)
        .add(inward)
        .addScaledVector(bend, -0.85)
        .clampLength(0, 2.18);
      const curve = runtime.curve;
      curve.v0.copy(runtime.va);
      curve.v1.copy(c1);
      curve.v2.copy(c2);
      curve.v3.copy(runtime.vb);
      tr.curve = curve;
      const arr = linkGeoms[i].attributes.position.array;
      for (let k = 0; k < runtime.samples.length; k++) {
        curve.getPoint(k / (runtime.samples.length - 1), runtime.samples[k]);
        arr[k * 3] = runtime.samples[k].x;
        arr[k * 3 + 1] = runtime.samples[k].y;
        arr[k * 3 + 2] = runtime.samples[k].z;
      }
      linkGeoms[i].setDrawRange(0, runtime.samples.length);
      linkGeoms[i].attributes.position.needsUpdate = true;

      const mat = linkMats.current[i];
      if (mat) {
        // Arcs only when relationship matters — idle nearly invisible
        const related = !!net && (net.has(tr.a) || net.has(tr.b));
        const selectedHot = !!net;
        const portalBoost = selectedId ? 1.35 : 1;
        const target = selectedHot
          ? related
            ? streamReveal * reveal * layerFade * (0.82 + colourWake * 0.42) * portalBoost
            : 0.008 * reveal
          : streamReveal * reveal * layerFade * (tr.signal ? 0.64 : tr.important ? 0.075 : 0.012);
        mat.opacity = THREE.MathUtils.damp(mat.opacity, target, 5, d);
        const c = new THREE.Color(
          related
            ? tr.signal
              ? t.accent
              : semanticColor(tr.kind, themeId)
            : tr.signal
              ? t.accent
              : tr.important
                ? semanticColor(tr.kind, themeId, 0.88)
                : t.steel
        );
        if (!related && !tr.signal && !tr.important) {
          c.lerp(new THREE.Color(semanticColor(tr.kind, themeId, 0.72)), 0.24);
        }
        mat.color.copy(c);
      }
    });

    if (routeGlowRef.current) {
      const pos = routeGlowRef.current.geometry.attributes.position.array;
      const col = routeGlowRef.current.geometry.attributes.color.array;
      let gi = 0;
      curves.forEach((tr, i) => {
        const runtime = curveState[i];
        const active = !!net && (net.has(tr.a) || net.has(tr.b));
        const glowColor = new THREE.Color(
          active
            ? tr.signal
              ? t.accent
              : semanticColor(tr.kind, themeId, 1)
            : tr.signal
              ? t.accent
              : tr.important
                ? semanticColor(tr.kind, themeId, 0.82)
                : semanticColor(tr.kind, themeId, 0.5)
        );
        for (let k = 0; k < runtime.samples.length; k++) {
          const sample = runtime.samples[k];
          const i3 = gi * 3;
          pos[i3] = sample.x;
          pos[i3 + 1] = sample.y;
          pos[i3 + 2] = sample.z;
          const fade = active ? 1 : tr.signal ? 1 : tr.important ? 0.18 : 0.025;
          // A few route values sit above white so the bloom pass catches
          // structure, not the entire particle shell.
          const intensity = tr.signal ? 1.55 : tr.important ? 1.12 : 0.42;
          col[i3] = glowColor.r * fade * intensity;
          col[i3 + 1] = glowColor.g * fade * intensity;
          col[i3 + 2] = glowColor.b * fade * intensity;
          gi++;
        }
      });
      routeGlowRef.current.geometry.attributes.position.needsUpdate = true;
      routeGlowRef.current.geometry.attributes.color.needsUpdate = true;
      routeGlowRef.current.material.opacity = net
        ? streamReveal * layerFade * 0.96
        : streamReveal * layerFade * 0.72;
      routeGlowRef.current.material.size = net ? (selectedId ? 5.4 : 4.2) : 3.1;
    }

    if (flowRef.current) {
      const pos = flowRef.current.geometry.attributes.position.array;
      const col = flowRef.current.geometry.attributes.color.array;
      let fi = 0;
      curves.forEach((tr) => {
        const related = !!net && (net.has(tr.a) || net.has(tr.b));
        const speed = related ? 0.32 : 0.06;
        if (tr.signal && related) flowColor.current.set(t.accent);
        else if (related) flowColor.current.set(semanticColor(tr.kind, themeId));
        else flowColor.current.set(t.steel);
        for (let k = 0; k < FLOW_PER_LINK; k++) {
          const i3 = fi * 3;
          // Flow particles only when a relationship is active
          if (tr.curve && (related || (!net && tr.signal)) && streamReveal > 0.15 && !inWork) {
            const u = (time * speed + tr.phase + k / FLOW_PER_LINK) % 1;
            const p = tr.curve.getPoint(u);
            pos[i3] = p.x;
            pos[i3 + 1] = p.y;
            pos[i3 + 2] = p.z;
            col[i3] = flowColor.current.r;
            col[i3 + 1] = flowColor.current.g;
            col[i3 + 2] = flowColor.current.b;
          } else {
            pos[i3 + 1] = -99;
          }
          fi++;
        }
      });
      flowRef.current.geometry.attributes.position.needsUpdate = true;
      flowRef.current.geometry.attributes.color.needsUpdate = true;
      flowRef.current.material.opacity = net
        ? streamReveal * layerFade * 1
        : streamReveal * layerFade * 0.76;
      flowRef.current.material.size = net ? (selectedId ? 3.8 : 3.2) : 2.6;
    }

    if (stateRef?.current) {
      stateRef.current.wake = activeId
        ? selectedId
          ? 1
          : 0.85
        : THREE.MathUtils.damp(stateRef.current.wake || 0, 0, 2, d);
      stateRef.current.infraWake = activeId ? INFRA_WAKE[activeId] || null : null;
      stateRef.current.orbitPhase = { ...orbitPhase.current };
    }

    root.current.visible = !inWork || reveal > 0.05;
    root.current.scale.setScalar(compactViewport ? 0.62 : 1);
    root.current.position.y = compactViewport ? 0.36 : 0;
    // Routes, nodes and packets are part of the data core. Keeping this
    // transform in lockstep with DataGlobe is what makes cursor rotation feel
    // like handling one computational object rather than a globe plus UI.
    root.current.rotation.x = stateRef?.current?.globeRotX || 0;
    root.current.rotation.y = stateRef?.current?.globeRotY || 0;
  });

  return (
    <group ref={root}>
      {linkGeoms.map((g, i) => (
        <line key={baseLines[i].a + baseLines[i].b} geometry={g}>
          <lineBasicMaterial
            ref={(m) => {
              linkMats.current[i] = m;
            }}
            color={t.steel}
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </line>
      ))}

      <points ref={flowRef} geometry={flowGeom} frustumCulled={false}>
        <pointsMaterial
          map={flowMap}
          size={2.6}
          sizeAttenuation={false}
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          alphaTest={0.4}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      <points ref={routeGlowRef} geometry={glowGeom} frustumCulled={false}>
        <pointsMaterial
          map={flowMap}
          size={3.1}
          sizeAttenuation={false}
          vertexColors
          transparent
          opacity={0.42}
          depthWrite={false}
          depthTest={false}
          alphaTest={0.02}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
      <points geometry={glowGeom} frustumCulled={false}>
        <pointsMaterial
          map={flowMap}
          size={0.9}
          sizeAttenuation={false}
          vertexColors
          transparent
          opacity={0.86}
          depthWrite={false}
          depthTest={false}
          alphaTest={0.28}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      {TECH_NODES.map((node) => (
        <TechNode
          key={node.id}
          node={node}
          themeId={themeId}
          hot={hoverId === node.id || selectedId === node.id}
          selected={selectedId === node.id}
          dimmed={!!net && !net.has(node.id)}
          stateRef={stateRef}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
