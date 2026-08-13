"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import {
  ORBITS,
  TECH_NODES,
  TECH_LINKS,
  THEME,
  INFRA_WAKE,
  orbitPosition,
  semanticColor,
} from "@/lib/data/data-world";

const FLOW_PER_LINK = 5;

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

function nodeWorldPos(node, orbitPhase) {
  return orbitPosition(node.orbit, node.angle + (orbitPhase[node.orbit] || 0));
}

/**
 * NODE = precision point + optional targeting ring (LINE).
 * No cubes, spheres, or decorative meshes.
 */
function TechNode({ node, themeId, hot, dimmed, stateRef, onHover, onSelect }) {
  const ref = useRef();
  const point = useRef();
  const livePos = useRef([0, 0, 0]);
  const pulse = useRef(0);
  const map = useMemo(() => cellMap(), []);
  const t = THEME[themeId] || THEME.night;
  const isCore = node.tier === "core";
  // SYSTEM NODE scale — rare, 6–12px; dormant until discovered
  const size = isCore ? 9 : 6.5;

  useFrame((state, dt) => {
    if (!ref.current) return;
    const d = Math.min(dt, 0.05);
    const reveal = stateRef?.current?.reveal ?? 1;
    const colourWake = stateRef?.current?.colourWake ?? 0;
    const phase = stateRef?.current?.orbitPhase || {};
    const pos = orbitPosition(node.orbit, node.angle + (phase[node.orbit] || 0));
    livePos.current = pos;
    // Heartbeat only on selected / hovered node — propagates via wake
    pulse.current = hot
      ? 0.5 + Math.sin(state.clock.elapsedTime * 3.2) * 0.5
      : 0;
    const s = (hot ? 1.25 + pulse.current * 0.14 : dimmed ? 0.68 : 1) * reveal;
    ref.current.scale.setScalar(
      THREE.MathUtils.damp(ref.current.scale.x || 0.001, Math.max(0.001, s), 6, d)
    );
    ref.current.position.set(pos[0], pos[1], pos[2]);
    if (point.current?.material) {
      // DORMANT → DISCOVERED → CONNECTED
      const baseOp = dimmed ? 0.12 : 0.22 + colourWake * 0.35;
      point.current.material.opacity = 0.15 + reveal * (hot ? 0.85 : baseOp);
      point.current.material.size =
        size * (hot ? 1.2 + pulse.current * 0.12 : dimmed ? 0.75 : 0.9);
      point.current.material.color.set(
        hot ? t.accent : colourWake > 0.35 || !dimmed ? t.steel : t.steel
      );
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
        e.stopPropagation();
        onHover?.(node);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover?.(null);
      }}
      onClick={(e) => {
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
      {/* Invisible pick field — not rendered as decorative geometry */}
      <mesh visible={false}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
      {hot && (
        <Text
          position={[0, 0.16, 0]}
          fontSize={0.055}
          color={t.ink}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.0025}
          outlineColor={t.bg}
        >
          {node.label.toUpperCase()}
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
  onHover,
  onSelect,
  stateRef,
  layer = "world",
}) {
  const root = useRef();
  const orbitPhase = useRef({ cloud: 0, platform: 0, analytics: 0, ai: 0 });
  const flowRef = useRef();
  const linkMats = useRef([]);
  const t = THEME[themeId] || THEME.night;
  const net = connectedIds(hoverId);
  const nodePosCache = useRef({});
  const inWork = layer === "work";
  const flowMap = useMemo(() => cellMap(), []);

  const { curves, baseLines, flowCount } = useMemo(() => {
    const curves = [];
    const baseLines = [];
    TECH_LINKS.forEach(([a, b], li) => {
      const na = TECH_NODES.find((n) => n.id === a);
      const nb = TECH_NODES.find((n) => n.id === b);
      if (!na || !nb) return;
      curves.push({
        a,
        b,
        phase: li * 0.11,
        kind: na.kind,
        important: li % 5 === 0,
        signal: li % 7 === 0,
      });
      baseLines.push({ a, b, kind: na.kind, important: li % 5 === 0 });
    });
    return { curves, baseLines, flowCount: curves.length * FLOW_PER_LINK };
  }, []);

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

  const linkGeoms = useMemo(
    () =>
      baseLines.map(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(74 * 3), 3)
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
      const va = new THREE.Vector3(...pa);
      const vb = new THREE.Vector3(...pb);
      // Organic fiber route — cubic spline, not diagram chord
      const mid = va.clone().add(vb).multiplyScalar(0.5);
      const lift = va.clone().cross(vb).normalize().multiplyScalar(0.35 + (i % 3) * 0.12);
      if (!Number.isFinite(lift.x)) lift.set(0, 0.4, 0);
      const c1 = va
        .clone()
        .lerp(mid, 0.45)
        .add(lift)
        .normalize()
        .multiplyScalar((va.length() + vb.length()) * 0.52);
      const c2 = vb
        .clone()
        .lerp(mid, 0.45)
        .add(lift.clone().multiplyScalar(-0.65))
        .normalize()
        .multiplyScalar((va.length() + vb.length()) * 0.52);
      const curve = new THREE.CubicBezierCurve3(va, c1, c2, vb);
      tr.curve = curve;
      const pts = curve.getPoints(36);
      const arr = linkGeoms[i].attributes.position.array;
      for (let k = 0; k < pts.length; k++) {
        arr[k * 3] = pts[k].x;
        arr[k * 3 + 1] = pts[k].y;
        arr[k * 3 + 2] = pts[k].z;
      }
      linkGeoms[i].setDrawRange(0, pts.length);
      linkGeoms[i].attributes.position.needsUpdate = true;

      const mat = linkMats.current[i];
      if (mat) {
        // Arcs only when relationship matters — idle nearly invisible
        const related = !!net && (net.has(tr.a) || net.has(tr.b));
        const selectedHot = !!net;
        const target = selectedHot
          ? related
            ? streamReveal * reveal * layerFade * (0.55 + colourWake * 0.35)
            : 0.01 * reveal
          : streamReveal * reveal * layerFade * (tr.important ? 0.018 : 0.004);
        mat.opacity = THREE.MathUtils.damp(mat.opacity, target, 5, d);
        const c = new THREE.Color(
          related ? (tr.signal ? t.accent : semanticColor(tr.kind, themeId)) : t.steel
        );
        if (!related) c.lerp(new THREE.Color(t.steel), 0.85);
        mat.color.copy(c);
      }
    });

    if (flowRef.current) {
      const pos = flowRef.current.geometry.attributes.position.array;
      const col = flowRef.current.geometry.attributes.color.array;
      const tmp = new THREE.Color();
      let fi = 0;
      curves.forEach((tr) => {
        const related = !!net && (net.has(tr.a) || net.has(tr.b));
        const speed = related ? 0.32 : 0.06;
        if (tr.signal && related) tmp.set(t.accent);
        else if (related) tmp.set(semanticColor(tr.kind, themeId));
        else tmp.set(t.steel);
        for (let k = 0; k < FLOW_PER_LINK; k++) {
          const i3 = fi * 3;
          // Flow particles only when a relationship is active
          if (tr.curve && related && streamReveal > 0.15 && !inWork) {
            const u = (time * speed + tr.phase + k / FLOW_PER_LINK) % 1;
            const p = tr.curve.getPoint(u);
            pos[i3] = p.x;
            pos[i3 + 1] = p.y;
            pos[i3 + 2] = p.z;
            col[i3] = tmp.r;
            col[i3 + 1] = tmp.g;
            col[i3 + 2] = tmp.b;
          } else {
            pos[i3 + 1] = -99;
          }
          fi++;
        }
      });
      flowRef.current.geometry.attributes.position.needsUpdate = true;
      flowRef.current.geometry.attributes.color.needsUpdate = true;
      flowRef.current.material.opacity = net
        ? streamReveal * layerFade * 0.9
        : 0;
      flowRef.current.material.size = net ? 2.4 : 1.6;
    }

    if (stateRef?.current) {
      stateRef.current.wake = hoverId
        ? 1
        : THREE.MathUtils.damp(stateRef.current.wake || 0, 0, 2, d);
      stateRef.current.infraWake = hoverId ? INFRA_WAKE[hoverId] || null : null;
      stateRef.current.orbitPhase = { ...orbitPhase.current };
    }

    root.current.visible = !inWork || reveal > 0.05;
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
            opacity={0.07}
            depthWrite={false}
          />
        </line>
      ))}

      <points ref={flowRef} geometry={flowGeom} frustumCulled={false}>
        <pointsMaterial
          map={flowMap}
          size={2}
          sizeAttenuation={false}
          vertexColors
          transparent
          opacity={0.5}
          depthWrite={false}
          alphaTest={0.4}
          toneMapped={false}
        />
      </points>

      {TECH_NODES.map((node) => (
        <TechNode
          key={node.id}
          node={node}
          themeId={themeId}
          hot={hoverId === node.id}
          dimmed={!!net && !net.has(node.id)}
          stateRef={stateRef}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
