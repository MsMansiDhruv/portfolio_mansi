"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PARTICLE_SPECTRUM, THEME } from "@/lib/data/data-world";

/** Precision data-cell texture — hard unit with soft edge, not a glowing star */
function cellTex() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, 64, 64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 28);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.95)");
  g.addColorStop(0.72, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(32, 32, 26, 0, Math.PI * 2);
  ctx.fill();
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

/**
 * Data Orbit — Layer 1.
 * POINT primitives only. Readable cells. Idle drift + cursor field.
 */
export default function DataGlobe({
  themeId,
  cursorRef,
  stateRef,
  reducedMotion = false,
  layer = "world",
}) {
  const group = useRef();
  const microRef = useRef();
  const activeRef = useRef();
  const breath = useRef(0);
  const energy = useRef(0.1);
  const reveal = useRef(0);
  const orient = useRef({ x: 0.08, y: 0.04 });
  const target = useRef({ x: 0.08, y: 0.04 });
  const worldTmp = useRef(new THREE.Vector3());
  const ndcTmp = useRef(new THREE.Vector3());
  const { camera } = useThree();
  const t = THEME[themeId] || THEME.night;
  const day = themeId === "day";
  const map = useMemo(() => cellTex(), []);

  const MICRO = reducedMotion ? 700 : 1600;
  const ACTIVE = reducedMotion ? 90 : 220;

  // Apparent sizes: ~3–5px micro, ~5–8px active at home distance
  const SIZE_MICRO = day ? 0.2 : 0.18;
  const SIZE_ACTIVE = day ? 0.32 : 0.3;

  const { microGeom, activeGeom, baseMicro, baseActive, seeds } = useMemo(() => {
    const spectrum = PARTICLE_SPECTRUM.map((hex) => new THREE.Color(hex));
    if (!day) {
      spectrum.forEach((c) => c.offsetHSL(0, -0.02, -0.08));
    }

    const microPos = new Float32Array(MICRO * 3);
    const microCol = new Float32Array(MICRO * 3);
    const microBase = new Float32Array(MICRO * 3);
    const microSeeds = new Float32Array(MICRO);

    let mi = 0;
    for (let i = 0; i < MICRO; i++) {
      const y = 1 - (i / (MICRO - 1)) * 2;
      const rr = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      const dens =
        0.72 +
        Math.sin(i * 0.017) * Math.cos(i * 0.031) * 0.22 +
        ((i % 11) / 11) * 0.08;
      if (dens < 0.55 && i % 2 !== 0) continue;
      if (i % 5 === 0) continue;

      const jitter = 1 + (Math.sin(i * 19.1) * 0.5 + 0.5) * 0.08;
      const r = 1.72 * jitter * (0.9 + dens * 0.16);
      const x = Math.cos(theta) * rr * r;
      const z = Math.sin(theta) * rr * r;
      const yy = y * r;

      microPos[mi * 3] = x;
      microPos[mi * 3 + 1] = yy;
      microPos[mi * 3 + 2] = z;
      microBase[mi * 3] = x;
      microBase[mi * 3 + 1] = yy;
      microBase[mi * 3 + 2] = z;
      microSeeds[mi] = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;

      const u =
        (y * 0.5 + 0.5) * 0.55 +
        ((((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) /
          (Math.PI * 2)) *
          0.45;
      const idx = Math.floor(u * (spectrum.length - 0.001));
      const c = spectrum[Math.max(0, Math.min(spectrum.length - 1, idx))];
      microCol[mi * 3] = c.r;
      microCol[mi * 3 + 1] = c.g;
      microCol[mi * 3 + 2] = c.b;
      mi++;
    }

    const activePos = new Float32Array(ACTIVE * 3);
    const activeCol = new Float32Array(ACTIVE * 3);
    const activeBase = new Float32Array(ACTIVE * 3);
    for (let i = 0; i < ACTIVE; i++) {
      const y = 1 - (i / (ACTIVE - 1)) * 2;
      const rr = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = Math.PI * (3 - Math.sqrt(5)) * i * 7.3;
      const r = 1.88 + (i % 5) * 0.025;
      activePos[i * 3] = Math.cos(theta) * rr * r;
      activePos[i * 3 + 1] = y * r;
      activePos[i * 3 + 2] = Math.sin(theta) * rr * r;
      activeBase[i * 3] = activePos[i * 3];
      activeBase[i * 3 + 1] = activePos[i * 3 + 1];
      activeBase[i * 3 + 2] = activePos[i * 3 + 2];
      const c = spectrum[i % spectrum.length];
      activeCol[i * 3] = c.r;
      activeCol[i * 3 + 1] = c.g;
      activeCol[i * 3 + 2] = c.b;
    }

    const trim = (arr, n) => arr.subarray(0, n * 3).slice();
    const mg = new THREE.BufferGeometry();
    mg.setAttribute("position", new THREE.BufferAttribute(trim(microPos, mi), 3));
    mg.setAttribute("color", new THREE.BufferAttribute(trim(microCol, mi), 3));
    const ag = new THREE.BufferGeometry();
    ag.setAttribute("position", new THREE.BufferAttribute(activePos, 3));
    ag.setAttribute("color", new THREE.BufferAttribute(activeCol, 3));

    return {
      microGeom: mg,
      activeGeom: ag,
      baseMicro: trim(microBase, mi),
      baseActive: activeBase,
      seeds: microSeeds.subarray(0, mi).slice(),
    };
  }, [MICRO, ACTIVE, day]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const cursor = cursorRef?.current;
    const story = stateRef?.current?.story || "explore";
    const wake = stateRef?.current?.wake || 0;
    const inWork = layer === "work";

    let revealTarget = 1;
    if (story === "silence") revealTarget = 0.08;
    else if (story === "emergence") revealTarget = 0.35;
    else if (story === "connection") revealTarget = 0.65;
    else if (story === "reveal") revealTarget = 0.9;
    else if (story === "identity") revealTarget = 0.98;
    if (inWork) revealTarget *= 0.42;
    reveal.current = THREE.MathUtils.damp(reveal.current, revealTarget, 1.4, dt);

    breath.current = reducedMotion ? 0 : Math.sin(time * 0.42) * 0.5 + 0.5;

    if (cursor?.active && (story === "explore" || story === "identity")) {
      target.current.y = cursor.nx * 0.18;
      target.current.x = 0.08 + cursor.ny * 0.14;
      energy.current = THREE.MathUtils.damp(
        energy.current,
        0.45 + Math.min(0.35, Math.hypot(cursor.vx, cursor.vy) * 0.012),
        2.2,
        dt
      );
    } else {
      target.current.y = THREE.MathUtils.damp(
        target.current.y,
        0.04 + Math.sin(time * 0.06) * 0.025,
        0.65,
        dt
      );
      target.current.x = THREE.MathUtils.damp(
        target.current.x,
        0.08 + Math.sin(time * 0.045) * 0.018,
        0.65,
        dt
      );
      energy.current = THREE.MathUtils.damp(
        energy.current,
        0.1 + breath.current * 0.06 + wake * 0.18,
        1.1,
        dt
      );
    }

    orient.current.x = THREE.MathUtils.damp(orient.current.x, target.current.x, 1.6, dt);
    orient.current.y = THREE.MathUtils.damp(orient.current.y, target.current.y, 1.6, dt);
    group.current.rotation.x = orient.current.x;
    group.current.rotation.y = orient.current.y + time * 0.012;
    const lift = 1 + breath.current * 0.015 + Math.sin(time * 0.28) * 0.008;
    group.current.scale.setScalar(lift * (0.35 + reveal.current * 0.65));
    group.current.position.y = Math.sin(time * 0.22) * 0.05;
    group.current.updateMatrixWorld();

    const e = energy.current;
    const colourWake = THREE.MathUtils.clamp(e * 0.9 + wake * 0.7, 0, 1);

    if (microRef.current && baseMicro && !reducedMotion) {
      const pos = microRef.current.geometry.attributes.position.array;
      const n = pos.length / 3;
      for (let i = 0; i < n; i++) {
        const i3 = i * 3;
        const seed = seeds[i] || 0;
        // Idle: almost still — scientific instrument, not particle party
        const floatY = Math.sin(time * 0.28 + seed * 14) * 0.04 + breath.current * 0.02;
        const floatX = Math.cos(time * 0.22 + seed * 11) * 0.03;
        const floatZ = Math.sin(time * 0.25 + seed * 8) * 0.03;

        let x = baseMicro[i3] + floatX;
        let y = baseMicro[i3 + 1] + floatY;
        let z = baseMicro[i3 + 2] + floatZ;

        worldTmp.current.set(x, y, z);
        group.current.localToWorld(worldTmp.current);
        ndcTmp.current.copy(worldTmp.current).project(camera);
        const nx = ndcTmp.current.x;
        const ny = ndcTmp.current.y;

        // Clear editorial rail (lower-left)
        if (nx < 0.12 && ny < 0.45) {
          const sx = THREE.MathUtils.clamp((0.12 - nx) / 0.85, 0, 1);
          const sy = THREE.MathUtils.clamp((0.45 - ny) / 1.1, 0, 1);
          const strength = Math.pow(sx * sy, 0.85);
          x += strength * 1.35;
          if (strength > 0.35) y -= 12;
        }

        // Cursor field — gentle bend / drift (scientific instrument)
        if (cursor?.active && story !== "silence") {
          const dx = nx - cursor.nx;
          const dy = ny - cursor.ny;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.18) {
            const f = (0.18 - d2) * 0.55;
            // Align + slight outward — not violent push
            x += dx * f * 1.4 + cursor.vx * 0.0008;
            y += dy * f * 1.4 + cursor.vy * 0.0008;
          }
        }

        pos[i3] = x;
        pos[i3 + 1] = y;
        pos[i3 + 2] = z;
      }
      microRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (activeRef.current && baseActive && !reducedMotion) {
      const pos = activeRef.current.geometry.attributes.position.array;
      for (let i = 0; i < ACTIVE; i++) {
        const i3 = i * 3;
        let x = baseActive[i3] + Math.cos(time * 0.3 + i * 0.2) * 0.04;
        let y = baseActive[i3 + 1] + Math.sin(time * 0.35 + i * 0.4) * 0.055;
        let z = baseActive[i3 + 2] + Math.sin(time * 0.28 + i * 0.15) * 0.04;

        worldTmp.current.set(x, y, z);
        group.current.localToWorld(worldTmp.current);
        ndcTmp.current.copy(worldTmp.current).project(camera);
        if (ndcTmp.current.x < 0.12 && ndcTmp.current.y < 0.45) {
          const sx = THREE.MathUtils.clamp((0.12 - ndcTmp.current.x) / 0.85, 0, 1);
          const sy = THREE.MathUtils.clamp((0.45 - ndcTmp.current.y) / 1.1, 0, 1);
          const strength = Math.pow(sx * sy, 0.85);
          x += strength * 1.4;
          if (strength > 0.35) y -= 12;
        }
        if (cursor?.active) {
          const dx = ndcTmp.current.x - cursor.nx;
          const dy = ndcTmp.current.y - cursor.ny;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.16) {
            const f = (0.16 - d2) * 0.7;
            x += dx * f * 1.6;
            y += dy * f * 1.6;
          }
        }
        pos[i3] = x;
        pos[i3 + 1] = y;
        pos[i3 + 2] = z;
      }
      activeRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (microRef.current) {
      microRef.current.material.opacity = reveal.current * (day ? 0.92 : 0.88);
      microRef.current.material.size =
        SIZE_MICRO * (1 + e * 0.12 + breath.current * 0.08);
      microRef.current.material.color.set(day ? "#ffffff" : t.steel);
    }
    if (activeRef.current) {
      activeRef.current.material.opacity = reveal.current * 0.96;
      activeRef.current.material.size =
        SIZE_ACTIVE * (0.92 + colourWake * 0.22 + breath.current * 0.1);
    }

    if (stateRef?.current) {
      stateRef.current.globeEnergy = e;
      stateRef.current.globeRotY = orient.current.y + time * 0.012;
      stateRef.current.globeRotX = orient.current.x;
      stateRef.current.breath = breath.current;
      stateRef.current.reveal = reveal.current;
      stateRef.current.colourWake = colourWake;
    }
  });

  return (
    <group ref={group}>
      <points ref={microRef} geometry={microGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={SIZE_MICRO}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          alphaTest={0.15}
          toneMapped={false}
        />
      </points>

      <points ref={activeRef} geometry={activeGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={SIZE_ACTIVE}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.95}
          depthWrite={false}
          alphaTest={0.12}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
