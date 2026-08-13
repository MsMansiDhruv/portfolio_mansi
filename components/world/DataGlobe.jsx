"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PARTICLE_SPECTRUM, THEME } from "@/lib/data/data-world";

/** Soft organic blob — brushstroke particle */
function blobTex() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, 64, 64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 28);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.75)");
  g.addColorStop(0.75, "rgba(255,255,255,0.2)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(32, 32, 24, 14, -0.55, 0, Math.PI * 2);
  ctx.fill();
  // second soft lobe — organic, not a perfect circle
  ctx.beginPath();
  ctx.ellipse(36, 28, 14, 10, 0.3, 0, Math.PI * 2);
  ctx.globalAlpha = 0.55;
  ctx.fill();
  ctx.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

/**
 * Living data field — same geometry & antigravity motion in both themes.
 * Only materials / lighting change with day · night.
 */
export default function DataGlobe({
  themeId,
  cursorRef,
  stateRef,
  reducedMotion = false,
}) {
  const group = useRef();
  const microRef = useRef();
  const activeRef = useRef();
  const core = useRef();
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
  const map = useMemo(() => blobTex(), []);

  // Same counts both themes — one world
  const MICRO = reducedMotion ? 900 : 2200;
  const ACTIVE = reducedMotion ? 80 : 200;

  const { microGeom, activeGeom, baseMicro, baseActive, seeds } = useMemo(() => {
    const spectrum = PARTICLE_SPECTRUM.map((hex) => new THREE.Color(hex));
    // Night: same hues, slightly deeper
    if (!day) {
      spectrum.forEach((c) => c.offsetHSL(0, -0.04, -0.12));
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
        0.7 +
        Math.sin(i * 0.017) * Math.cos(i * 0.031) * 0.28 +
        ((i % 11) / 11) * 0.1;
      if (dens < 0.58 && i % 2 !== 0) continue;
      if (i % 6 === 0) continue;

      const jitter = 1 + (Math.sin(i * 19.1) * 0.5 + 0.5) * 0.09;
      // Loose shell — airy field, not a solid ball
      const r = 1.7 * jitter * (0.88 + dens * 0.18);
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
      const r = 1.82 + (i % 5) * 0.02;
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

    let revealTarget = 1;
    if (story === "silence") revealTarget = 0.1;
    else if (story === "emergence") revealTarget = 0.55;
    else if (story === "connection") revealTarget = 0.85;
    reveal.current = THREE.MathUtils.damp(reveal.current, revealTarget, 1.4, dt);

    breath.current = reducedMotion ? 0 : Math.sin(time * 0.5) * 0.5 + 0.5;

    if (cursor?.active && story === "explore") {
      target.current.y = cursor.nx * 0.22;
      target.current.x = 0.08 + cursor.ny * 0.16;
      energy.current = THREE.MathUtils.damp(
        energy.current,
        0.5 + Math.min(0.4, Math.hypot(cursor.vx, cursor.vy) * 0.015),
        2.2,
        dt
      );
    } else {
      target.current.y = THREE.MathUtils.damp(
        target.current.y,
        0.04 + Math.sin(time * 0.07) * 0.03,
        0.7,
        dt
      );
      target.current.x = THREE.MathUtils.damp(
        target.current.x,
        0.08 + Math.sin(time * 0.05) * 0.02,
        0.7,
        dt
      );
      energy.current = THREE.MathUtils.damp(
        energy.current,
        0.12 + breath.current * 0.08 + wake * 0.2,
        1.1,
        dt
      );
    }

    orient.current.x = THREE.MathUtils.damp(orient.current.x, target.current.x, 1.8, dt);
    orient.current.y = THREE.MathUtils.damp(orient.current.y, target.current.y, 1.8, dt);
    // Slow orbital drift — antigravity field, not a spinning globe
    group.current.rotation.x = orient.current.x;
    group.current.rotation.y = orient.current.y + time * 0.018;
    const lift = 1 + breath.current * 0.02 + Math.sin(time * 0.35) * 0.012;
    group.current.scale.setScalar(lift * (0.4 + reveal.current * 0.6));
    group.current.position.y = Math.sin(time * 0.28) * 0.08;
    group.current.updateMatrixWorld();

    const e = energy.current;
    const colourWake = THREE.MathUtils.clamp(e * 0.9 + wake * 0.7, 0, 1);

    if (microRef.current && baseMicro && !reducedMotion) {
      const pos = microRef.current.geometry.attributes.position.array;
      const n = pos.length / 3;
      for (let i = 0; i < n; i++) {
        const i3 = i * 3;
        const seed = seeds[i] || 0;
        // Antigravity — buoyant, slow, weightless
        const floatY =
          Math.sin(time * 0.65 + seed * 14) * 0.11 +
          Math.sin(time * 0.22 + seed * 3) * 0.06 +
          breath.current * 0.04;
        const floatX =
          Math.cos(time * 0.4 + seed * 11) * 0.07 +
          Math.sin(time * 0.15 + i * 0.01) * 0.04;
        const floatZ =
          Math.sin(time * 0.48 + seed * 8) * 0.065 +
          Math.cos(time * 0.19 + seed * 5) * 0.035;

        let x = baseMicro[i3] + floatX;
        let y = baseMicro[i3 + 1] + floatY;
        let z = baseMicro[i3 + 2] + floatZ;

        // Gentle outward drift — particles want to leave gravity
        const len = Math.hypot(x, y, z) || 1;
        const outward = 0.02 + breath.current * 0.015;
        x *= 1 + outward * 0.15;
        y *= 1 + outward * 0.2;
        z *= 1 + outward * 0.15;

        worldTmp.current.set(x, y, z);
        group.current.localToWorld(worldTmp.current);
        ndcTmp.current.copy(worldTmp.current).project(camera);
        const nx = ndcTmp.current.x;
        const ny = ndcTmp.current.y;

        // Repel from hero type (lower-left)
        if (nx < 0.15 && ny < 0.5) {
          const sx = THREE.MathUtils.clamp((0.15 - nx) / 0.9, 0, 1);
          const sy = THREE.MathUtils.clamp((0.5 - ny) / 1.15, 0, 1);
          const strength = Math.pow(sx * sy, 0.8);
          x += strength * 1.5;
          y += strength * 0.5;
          if (strength > 0.32) y -= 14;
        }

        // Cursor antigravity push
        if (cursor?.active) {
          const dx = nx - cursor.nx;
          const dy = ny - cursor.ny;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.22) {
            const f = (0.22 - d2) * 1.1;
            x += dx * f * 2.6;
            y += dy * f * 2.6;
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
        const floatY = Math.sin(time * 0.85 + i * 0.4) * 0.14;
        let x = baseActive[i3] + Math.cos(time * 0.5 + i * 0.2) * 0.08;
        let y = baseActive[i3 + 1] + floatY + breath.current * 0.05;
        let z = baseActive[i3 + 2] + Math.sin(time * 0.45 + i * 0.15) * 0.07;

        worldTmp.current.set(x, y, z);
        group.current.localToWorld(worldTmp.current);
        ndcTmp.current.copy(worldTmp.current).project(camera);
        if (ndcTmp.current.x < 0.15 && ndcTmp.current.y < 0.5) {
          const sx = THREE.MathUtils.clamp((0.15 - ndcTmp.current.x) / 0.9, 0, 1);
          const sy = THREE.MathUtils.clamp((0.5 - ndcTmp.current.y) / 1.15, 0, 1);
          const strength = Math.pow(sx * sy, 0.8);
          x += strength * 1.55;
          if (strength > 0.32) y -= 14;
        }
        pos[i3] = x;
        pos[i3 + 1] = y;
        pos[i3 + 2] = z;
      }
      activeRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (microRef.current) {
      microRef.current.material.opacity = reveal.current * (day ? 0.95 : 0.9);
      microRef.current.material.size =
        (day ? 0.075 : 0.065) * (1 + e * 0.15 + breath.current * 0.12);
    }
    if (activeRef.current) {
      activeRef.current.material.opacity = reveal.current * 0.95;
      activeRef.current.material.size =
        (day ? 0.11 : 0.095) * (0.9 + colourWake * 0.25 + breath.current * 0.2);
    }
    if (core.current) {
      // Nearly invisible core — field is the form
      core.current.material.opacity = (day ? 0.03 : 0.12) * reveal.current;
    }

    if (stateRef?.current) {
      stateRef.current.globeEnergy = e;
      stateRef.current.globeRotY = orient.current.y + time * 0.018;
      stateRef.current.globeRotX = orient.current.x;
      stateRef.current.breath = breath.current;
      stateRef.current.reveal = reveal.current;
      stateRef.current.colourWake = colourWake;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={core}>
        <sphereGeometry args={[1.45, 32, 32]} />
        <meshPhysicalMaterial
          color={t.globe}
          emissive={t.globeEmissive}
          emissiveIntensity={day ? 0 : 0.05}
          metalness={0.35}
          roughness={0.55}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      <points ref={microRef} geometry={microGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={day ? 0.075 : 0.065}
          sizeAttenuation
          vertexColors
          color="#ffffff"
          transparent
          opacity={0.92}
          depthWrite={false}
          alphaTest={0.12}
          toneMapped={false}
        />
      </points>

      <points ref={activeRef} geometry={activeGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={day ? 0.11 : 0.095}
          sizeAttenuation
          vertexColors
          color="#ffffff"
          transparent
          opacity={0.95}
          depthWrite={false}
          alphaTest={0.1}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
