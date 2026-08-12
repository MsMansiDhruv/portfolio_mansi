"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { THEME } from "@/lib/data/data-world";

function circleTex() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.55, "rgba(255,255,255,0.65)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

/**
 * Living data globe — scientific instrument, not Earth / not hologram.
 */
export default function DataGlobe({
  themeId,
  cursorRef,
  stateRef,
  reducedMotion = false,
}) {
  const group = useRef();
  const points = useRef();
  const wires = useRef();
  const rot = useRef({ x: 0.18, y: 0 });
  const target = useRef({ x: 0.18, y: 0 });
  const energy = useRef(0.15);
  const t = THEME[themeId] || THEME.night;
  const map = useMemo(() => circleTex(), []);

  const COUNT = reducedMotion ? 900 : 2200;

  const { posAttr, colAttr, wirePos } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const base = new THREE.Color(t.data);
    const accent = new THREE.Color(t.accent);
    const wire = new THREE.Color(t.wire);

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      // Fibonacci sphere distribution
      const y = 1 - (i / (COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      const r = 1.55 + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 0.04;
      positions[i3] = x * r;
      positions[i3 + 1] = y * r;
      positions[i3 + 2] = z * r;

      const hot = i % 37 === 0;
      const c = hot ? accent : i % 5 === 0 ? wire : base;
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    // Latitude / longitude wireframe
    const segs = [];
    const push = (a, b) => segs.push(...a, ...b);
    const R = 1.52;
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = ((90 - lat) * Math.PI) / 180;
      const y = R * Math.cos(phi);
      const rr = R * Math.sin(phi);
      for (let i = 0; i < 64; i++) {
        const a0 = (i / 64) * Math.PI * 2;
        const a1 = ((i + 1) / 64) * Math.PI * 2;
        push(
          [rr * Math.cos(a0), y, rr * Math.sin(a0)],
          [rr * Math.cos(a1), y, rr * Math.sin(a1)]
        );
      }
    }
    for (let lon = 0; lon < 360; lon += 30) {
      const theta = (lon * Math.PI) / 180;
      for (let i = 0; i < 48; i++) {
        const p0 = (i / 48) * Math.PI;
        const p1 = ((i + 1) / 48) * Math.PI;
        push(
          [
            R * Math.sin(p0) * Math.cos(theta),
            R * Math.cos(p0),
            R * Math.sin(p0) * Math.sin(theta),
          ],
          [
            R * Math.sin(p1) * Math.cos(theta),
            R * Math.cos(p1),
            R * Math.sin(p1) * Math.sin(theta),
          ]
        );
      }
    }

    return {
      posAttr: new THREE.BufferAttribute(positions, 3),
      colAttr: new THREE.BufferAttribute(colors, 3),
      wirePos: new Float32Array(segs),
    };
  }, [COUNT, t.accent, t.data, t.wire]);

  const pointsGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", posAttr);
    g.setAttribute("color", colAttr);
    return g;
  }, [posAttr, colAttr]);

  const wireGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(wirePos, 3));
    return g;
  }, [wirePos]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    const cursor = cursorRef?.current;
    const st = stateRef?.current;
    const view = st?.view || "home";

    // Cursor steers globe orientation — explore, don't auto-spin
    if (cursor?.active && view === "home") {
      target.current.y = cursor.nx * 0.55;
      target.current.x = 0.18 + cursor.ny * 0.35;
      energy.current = THREE.MathUtils.damp(energy.current, 0.55 + Math.min(1, Math.hypot(cursor.vx, cursor.vy) * 0.02), 2, dt);
    } else if (view === "work" || view === "project") {
      target.current.y = THREE.MathUtils.damp(target.current.y, 0.4, 1.2, dt);
      target.current.x = THREE.MathUtils.damp(target.current.x, 0.25, 1.2, dt);
      energy.current = THREE.MathUtils.damp(energy.current, 0.35, 1.5, dt);
    } else if (view === "ai-lab") {
      target.current.y += dt * 0.08;
      energy.current = THREE.MathUtils.damp(energy.current, 0.7, 1.5, dt);
    } else {
      target.current.y = THREE.MathUtils.damp(target.current.y, 0, 0.8, dt);
      target.current.x = THREE.MathUtils.damp(target.current.x, 0.18, 0.8, dt);
      energy.current = THREE.MathUtils.damp(energy.current, 0.18, 1.2, dt);
    }

    // Subtle idle drift only when quiet
    if (!cursor?.active && view === "home" && !reducedMotion) {
      target.current.y += dt * 0.035;
    }

    rot.current.x = THREE.MathUtils.damp(rot.current.x, target.current.x, 2.2, dt);
    rot.current.y = THREE.MathUtils.damp(rot.current.y, target.current.y, 2.2, dt);
    group.current.rotation.x = rot.current.x;
    group.current.rotation.y = rot.current.y;

    if (points.current) {
      points.current.material.opacity =
        (themeId === "day" ? 0.72 : 0.85) * (0.75 + energy.current * 0.35);
      points.current.material.size =
        (themeId === "day" ? 0.028 : 0.026) * (1 + energy.current * 0.15);
    }
    if (wires.current) {
      wires.current.material.opacity =
        (themeId === "day" ? 0.18 : 0.22) + energy.current * 0.18;
    }

    if (st) {
      st.globeEnergy = energy.current;
      st.globeRotY = rot.current.y;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.48, 48, 48]} />
        <meshStandardMaterial
          color={t.globe}
          metalness={themeId === "day" ? 0.35 : 0.55}
          roughness={themeId === "day" ? 0.55 : 0.4}
          transparent
          opacity={themeId === "day" ? 0.35 : 0.42}
        />
      </mesh>

      <lineSegments ref={wires} geometry={wireGeom}>
        <lineBasicMaterial
          color={t.wire}
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </lineSegments>

      <points ref={points} geometry={pointsGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={0.026}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          alphaTest={0.02}
        />
      </points>
    </group>
  );
}
