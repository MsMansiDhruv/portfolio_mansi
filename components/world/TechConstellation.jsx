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

const FLOW_PER_LINK = 4;

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

function TechNode({ node, themeId, hot, dimmed, stateRef, onHover, onSelect }) {
  const ref = useRef();
  const ring = useRef();
  const livePos = useRef([0, 0, 0]);
  const t = THEME[themeId] || THEME.night;
  const color = semanticColor(node.kind, themeId);
  const isCore = node.tier === "core";
  const size = isCore ? 0.07 : 0.036;

  useFrame((_, dt) => {
    if (!ref.current) return;
    const d = Math.min(dt, 0.05);
    const reveal = stateRef?.current?.reveal ?? 1;
    const colourWake = stateRef?.current?.colourWake ?? 0;
    const phase = stateRef?.current?.orbitPhase || {};
    const pos = orbitPosition(node.orbit, node.angle + (phase[node.orbit] || 0));
    livePos.current = pos;
    const s = (hot ? 1.35 : dimmed ? 0.78 : 1) * reveal;
    ref.current.scale.setScalar(
      THREE.MathUtils.damp(ref.current.scale.x || 0.001, Math.max(0.001, s), 6, d)
    );
    ref.current.position.set(pos[0], pos[1], pos[2]);
    if (ring.current) {
      ring.current.material.opacity = THREE.MathUtils.damp(
        ring.current.material.opacity,
        hot ? 0.5 : 0,
        6,
        d
      );
    }
    const mesh = ref.current.children?.[0];
    if (mesh?.material) {
      mesh.material.emissiveIntensity = hot
        ? 0.35 * Math.max(0.35, colourWake)
        : 0.03 + 0.12 * colourWake;
      mesh.material.opacity = 0.15 + reveal * 0.85;
    }
  });

  return (
    <group
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        onHover?.(node);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "";
        onHover?.(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(node, livePos.current);
      }}
    >
      {isCore ? (
        <mesh>
          <boxGeometry args={[size * 1.4, size * 1.4, size * 1.4]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.05}
            metalness={0.85}
            roughness={0.2}
            clearcoat={0.5}
            transparent
            opacity={0.5}
          />
        </mesh>
      ) : (
        <mesh>
          <sphereGeometry args={[size, 16, 16]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.04}
            metalness={0.8}
            roughness={0.25}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
      <mesh visible={false}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshBasicMaterial />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.8, size * 2.1, 28]} />
        <meshBasicMaterial
          color={t.accent}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {hot && (
        <Text
          position={[0, size + 0.1, 0]}
          fontSize={0.06}
          color={t.ink}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.003}
          outlineColor={t.bg}
        >
          {node.label}
        </Text>
      )}
    </group>
  );
}

/**
 * Domain orbits + infrastructure streams.
 * Colour wakes on interaction; idle stays steel.
 */
export default function TechConstellation({
  themeId,
  hoverId,
  onHover,
  onSelect,
  stateRef,
}) {
  const root = useRef();
  const orbitPhase = useRef({ cloud: 0, platform: 0, analytics: 0, ai: 0 });
  const flowRef = useRef();
  const orbitMats = useRef([]);
  const linkMats = useRef([]);
  const t = THEME[themeId] || THEME.night;
  const net = connectedIds(hoverId);
  const nodePosCache = useRef({});

  const orbitGeoms = useMemo(
    () =>
      ORBITS.map((orbit) => {
        const pts = [];
        const steps = 96;
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          const [x, y, z] = orbitPosition(orbit.id, a);
          pts.push(new THREE.Vector3(x, y, z));
        }
        return new THREE.BufferGeometry().setFromPoints(pts);
      }),
    []
  );

  const { curves, baseLines, flowCount } = useMemo(() => {
    const curves = [];
    const baseLines = [];
    TECH_LINKS.forEach(([a, b], li) => {
      const na = TECH_NODES.find((n) => n.id === a);
      const nb = TECH_NODES.find((n) => n.id === b);
      if (!na || !nb) return;
      curves.push({ a, b, phase: li * 0.11, kind: na.kind, important: li % 5 === 0 });
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
          new THREE.BufferAttribute(new Float32Array(58 * 3), 3)
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
    const streamReveal =
      story === "silence"
        ? 0
        : story === "emergence"
          ? 0.15
          : story === "connection"
            ? 0.7
            : 1;

    ORBITS.forEach((o) => {
      orbitPhase.current[o.id] += o.speed * d * (story === "explore" ? 1 : 0.35);
    });

    // Update node positions
    TECH_NODES.forEach((node) => {
      nodePosCache.current[node.id] = nodeWorldPos(node, orbitPhase.current);
    });

    // Orbit path opacity
    orbitMats.current.forEach((mat, i) => {
      if (!mat) return;
      const orbit = ORBITS[i];
      const lit =
        !hoverId ||
        TECH_NODES.some((n) => n.id === hoverId && n.orbit === orbit.id);
      const idle = themeId === "day" ? 0.06 : 0.08;
      const hot = themeId === "day" ? 0.22 : 0.28;
      const target = reveal * (lit ? (net ? hot : idle) : idle * 0.45);
      mat.opacity = THREE.MathUtils.damp(mat.opacity, target, 4, d);
      mat.color.set(semanticColor(orbit.colorKey, themeId));
    });

    // Rebuild link curves from live node positions
    curves.forEach((tr, i) => {
      const pa = nodePosCache.current[tr.a];
      const pb = nodePosCache.current[tr.b];
      if (!pa || !pb || !linkGeoms[i]) return;
      const va = new THREE.Vector3(...pa);
      const vb = new THREE.Vector3(...pb);
      const mid = va
        .clone()
        .add(vb)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar((va.length() + vb.length()) * 0.55);
      const curve = new THREE.QuadraticBezierCurve3(va, mid, vb);
      tr.curve = curve;
      const pts = curve.getPoints(28);
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
        const lit = !net || net.has(tr.a) || net.has(tr.b);
        const base = tr.important ? 0.22 : 0.1;
        const target =
          streamReveal *
          reveal *
          (lit ? (net ? 0.55 : base) * (0.35 + colourWake * 0.65) : 0.03);
        mat.opacity = THREE.MathUtils.damp(mat.opacity, target, 5, d);
        const c = new THREE.Color(semanticColor(tr.kind, themeId));
        if (colourWake < 0.25) c.lerp(new THREE.Color(t.steel), 0.7);
        mat.color.copy(c);
      }
    });

    if (flowRef.current) {
      const pos = flowRef.current.geometry.attributes.position.array;
      const col = flowRef.current.geometry.attributes.color.array;
      const tmp = new THREE.Color();
      let fi = 0;
      curves.forEach((tr) => {
        const lit = !net || net.has(tr.a) || net.has(tr.b);
        const speed = lit && net ? 0.32 : 0.1;
        tmp.set(semanticColor(tr.kind, themeId));
        if (colourWake < 0.3) tmp.lerp(new THREE.Color(t.steel), 0.65);
        if (net && lit) tmp.lerp(new THREE.Color(t.accent), 0.25);
        for (let k = 0; k < FLOW_PER_LINK; k++) {
          const i3 = fi * 3;
          if (tr.curve && lit && streamReveal > 0.2) {
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
      flowRef.current.material.opacity =
        streamReveal * (0.25 + colourWake * 0.7) * (net ? 0.95 : 0.5);
      flowRef.current.material.size = net ? 0.038 : 0.024;
    }

    // Wake level for globe / infra
    if (stateRef?.current) {
      stateRef.current.wake = hoverId ? 1 : THREE.MathUtils.damp(stateRef.current.wake || 0, 0, 2, d);
      stateRef.current.infraWake = hoverId ? INFRA_WAKE[hoverId] || null : null;
      stateRef.current.orbitPhase = { ...orbitPhase.current };
    }
  });

  return (
    <group ref={root}>
      {orbitGeoms.map((g, i) => (
        <lineLoop key={ORBITS[i].id} geometry={g}>
          <lineBasicMaterial
            ref={(m) => {
              orbitMats.current[i] = m;
            }}
            color={t.steel}
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </lineLoop>
      ))}

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
          size={0.024}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.4}
          depthWrite={false}
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
