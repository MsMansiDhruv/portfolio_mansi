"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { THEME } from "@/lib/data/data-world";

/** Crisp circular data unit */
function cellTex() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, 64, 64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.68, "rgba(255,255,255,1)");
  g.addColorStop(0.86, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function hash(i) {
  return Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
}

/**
 * Data Core V6 — monochrome computational ecosystem.
 * Structured clusters + hidden corridor. Colour wakes on presence.
 */
export default function DataGlobe({
  themeId,
  cursorRef,
  stateRef,
  reducedMotion = false,
}) {
  const group = useRef();
  const microRef = useRef();
  const signalRef = useRef();
  const secretRef = useRef();
  const breath = useRef(0);
  const energy = useRef(0.08);
  const reveal = useRef(0);
  const density = useRef(0.22);
  const secretWake = useRef(0);
  const orient = useRef({ x: 0.04, y: 0.02 });
  const target = useRef({ x: 0.04, y: 0.02 });
  const worldTmp = useRef(new THREE.Vector3());
  const ndcTmp = useRef(new THREE.Vector3());
  const { camera } = useThree();
  const t = THEME[themeId] || THEME.night;
  const day = themeId === "day";
  const map = useMemo(() => cellTex(), []);

  const MICRO = reducedMotion ? 700 : 1700;
  const SIGNAL = reducedMotion ? 60 : 140;
  const SECRET = 48;

  const SIZE_DATA = day ? 0.32 : 0.3;
  const SIZE_SIGNAL = day ? 0.44 : 0.42;
  const SIZE_SECRET = day ? 0.5 : 0.48;

  const steel = useMemo(() => new THREE.Color(day ? "#5a6878" : "#9aaec0"), [day]);
  const mute = useMemo(() => new THREE.Color(day ? "#7a8898" : "#7a8fa4"), [day]);
  const accent = useMemo(() => new THREE.Color(t.accent), [t.accent]);
  const dataBlue = useMemo(() => new THREE.Color(t.data), [t.data]);
  const tmpA = useRef(new THREE.Color());
  const tmpB = useRef(new THREE.Color());

  const {
    microGeom,
    signalGeom,
    secretGeom,
    baseMicro,
    baseSignal,
    baseSecret,
    seeds,
    roles,
    secretCurve,
  } = useMemo(() => {
    // Hidden corridor through the core — discovery path toward WORK
    const secretCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-1.55, -0.35, 0.9),
      new THREE.Vector3(-0.4, 0.55, 1.35),
      new THREE.Vector3(0.55, -0.2, 1.45),
      new THREE.Vector3(1.65, 0.25, 0.75)
    );

    const microPos = new Float32Array(MICRO * 3);
    const microCol = new Float32Array(MICRO * 3);
    const microBase = new Float32Array(MICRO * 3);
    const microSeeds = new Float32Array(MICRO);
    const microRoles = new Uint8Array(MICRO); // 0 field, 1 cluster, 2 corridor

    // Cluster centers — internal logic, not uniform sprinkles
    const clusters = [
      [0.9, 0.55, 0.75],
      [-0.85, 0.35, 0.95],
      [0.15, -0.85, 0.7],
      [-0.35, 0.15, -1.15],
      [1.05, -0.25, -0.55],
    ];

    let mi = 0;
    let attempt = 0;
    while (mi < MICRO && attempt < MICRO * 4) {
      const i = attempt++;
      const h = hash(i);
      let x;
      let y;
      let z;
      let role = 0;

      if (h < 0.28) {
        const c = clusters[i % clusters.length];
        const s = 0.22 + hash(i + 3) * 0.28;
        const a = hash(i + 7) * Math.PI * 2;
        const b = hash(i + 11) * Math.PI;
        x = c[0] + Math.sin(b) * Math.cos(a) * s;
        y = c[1] + Math.sin(b) * Math.sin(a) * s * 0.85;
        z = c[2] + Math.cos(b) * s;
        role = 1;
      } else if (h < 0.4) {
        const u = hash(i + 17);
        const p = secretCurve.getPoint(u);
        const tang = secretCurve.getTangent(u);
        const n = new THREE.Vector3(-tang.z, 0.2, tang.x).normalize();
        const off = (hash(i + 19) - 0.5) * 0.35;
        x = p.x + n.x * off;
        y = p.y + (hash(i + 23) - 0.5) * 0.28;
        z = p.z + n.z * off;
        role = 2;
      } else {
        // Fibonacci shell — denser equator, thinner poles (still a sphere)
        const yy = 1 - (mi / (MICRO - 1)) * 2;
        const rr = Math.sqrt(Math.max(0, 1 - yy * yy));
        const theta = Math.PI * (3 - Math.sqrt(5)) * mi;
        const r = 1.72 + hash(i + 31) * 0.18;
        x = Math.cos(theta) * rr * r;
        y = yy * r;
        z = Math.sin(theta) * rr * r;
        role = 0;
      }

      const len = Math.hypot(x, y, z) || 1;
      if (len > 1.95) {
        const s = 1.9 / len;
        x *= s;
        y *= s;
        z *= s;
      }

      microPos[mi * 3] = x;
      microPos[mi * 3 + 1] = y;
      microPos[mi * 3 + 2] = z;
      microBase[mi * 3] = x;
      microBase[mi * 3 + 1] = y;
      microBase[mi * 3 + 2] = z;
      microSeeds[mi] = hash(i + 41);
      microRoles[mi] = role;

      const base = role === 1 ? mute : steel;
      microCol[mi * 3] = base.r;
      microCol[mi * 3 + 1] = base.g;
      microCol[mi * 3 + 2] = base.b;
      mi++;
    }

    const signalPos = new Float32Array(SIGNAL * 3);
    const signalCol = new Float32Array(SIGNAL * 3);
    const signalBase = new Float32Array(SIGNAL * 3);
    for (let i = 0; i < SIGNAL; i++) {
      const u = i / SIGNAL;
      const p = secretCurve.getPoint((u + hash(i) * 0.08) % 1);
      const jitter = 0.08;
      signalPos[i * 3] = p.x + (hash(i + 2) - 0.5) * jitter;
      signalPos[i * 3 + 1] = p.y + (hash(i + 4) - 0.5) * jitter;
      signalPos[i * 3 + 2] = p.z + (hash(i + 6) - 0.5) * jitter;
      signalBase[i * 3] = signalPos[i * 3];
      signalBase[i * 3 + 1] = signalPos[i * 3 + 1];
      signalBase[i * 3 + 2] = signalPos[i * 3 + 2];
      signalCol[i * 3] = steel.r;
      signalCol[i * 3 + 1] = steel.g;
      signalCol[i * 3 + 2] = steel.b;
    }

    const secretPos = new Float32Array(SECRET * 3);
    const secretCol = new Float32Array(SECRET * 3);
    const secretBase = new Float32Array(SECRET * 3);
    for (let i = 0; i < SECRET; i++) {
      const p = secretCurve.getPoint(i / (SECRET - 1));
      secretPos[i * 3] = p.x;
      secretPos[i * 3 + 1] = p.y;
      secretPos[i * 3 + 2] = p.z;
      secretBase[i * 3] = p.x;
      secretBase[i * 3 + 1] = p.y;
      secretBase[i * 3 + 2] = p.z;
      secretCol[i * 3] = accent.r;
      secretCol[i * 3 + 1] = accent.g;
      secretCol[i * 3 + 2] = accent.b;
    }

    const trim = (arr, n) => arr.subarray(0, n * 3).slice();
    const mg = new THREE.BufferGeometry();
    mg.setAttribute("position", new THREE.BufferAttribute(trim(microPos, mi), 3));
    mg.setAttribute("color", new THREE.BufferAttribute(trim(microCol, mi), 3));
    const sg = new THREE.BufferGeometry();
    sg.setAttribute("position", new THREE.BufferAttribute(signalPos, 3));
    sg.setAttribute("color", new THREE.BufferAttribute(signalCol, 3));
    const hg = new THREE.BufferGeometry();
    hg.setAttribute("position", new THREE.BufferAttribute(secretPos, 3));
    hg.setAttribute("color", new THREE.BufferAttribute(secretCol, 3));

    return {
      microGeom: mg,
      signalGeom: sg,
      secretGeom: hg,
      baseMicro: trim(microBase, mi),
      baseSignal: signalBase,
      baseSecret: secretBase,
      seeds: microSeeds.subarray(0, mi).slice(),
      roles: microRoles.subarray(0, mi).slice(),
      secretCurve,
    };
  }, [MICRO, SIGNAL, SECRET, steel, mute, accent]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const cursor = cursorRef?.current;
    const story = stateRef?.current?.story || "explore";
    const wake = stateRef?.current?.wake || 0;

    // Progressive density — something immediately, then fill
    const densTarget =
      story === "silence"
        ? 0.2
        : story === "emergence"
          ? 0.45
          : story === "connection"
            ? 0.7
            : 1;
    density.current = THREE.MathUtils.damp(density.current, densTarget, 1.1, dt);

    let revealTarget = densTarget;
    if (story === "silence") revealTarget = 0.35;
    reveal.current = THREE.MathUtils.damp(reveal.current, revealTarget, 1.6, dt);
    breath.current = reducedMotion ? 0 : Math.sin(time * 0.38) * 0.5 + 0.5;

    if (cursor?.active && (story === "explore" || story === "identity")) {
      target.current.y = cursor.nx * 0.1;
      target.current.x = 0.04 + cursor.ny * 0.08;
      energy.current = THREE.MathUtils.damp(
        energy.current,
        0.4 + Math.min(0.35, Math.hypot(cursor.vx, cursor.vy) * 0.01),
        2.4,
        dt
      );
    } else {
      target.current.y = THREE.MathUtils.damp(target.current.y, 0.02, 0.7, dt);
      target.current.x = THREE.MathUtils.damp(target.current.x, 0.04, 0.7, dt);
      energy.current = THREE.MathUtils.damp(
        energy.current,
        0.08 + breath.current * 0.05 + wake * 0.25,
        1.2,
        dt
      );
    }

    orient.current.x = THREE.MathUtils.damp(orient.current.x, target.current.x, 1.5, dt);
    orient.current.y = THREE.MathUtils.damp(orient.current.y, target.current.y, 1.5, dt);
    group.current.rotation.x = orient.current.x;
    group.current.rotation.y = orient.current.y + Math.sin(time * 0.03) * 0.04;
    group.current.scale.setScalar(0.72 + reveal.current * 0.28 + breath.current * 0.01);
    group.current.position.set(0, Math.sin(time * 0.14) * 0.015, 0);
    group.current.updateMatrixWorld();

    const e = energy.current;
    let nearSecret = 0;

    if (microRef.current && baseMicro) {
      const pos = microRef.current.geometry.attributes.position.array;
      const col = microRef.current.geometry.attributes.color.array;
      const n = Math.floor(baseMicro.length / 3);
      const visible = Math.floor(n * density.current);
      microRef.current.geometry.setDrawRange(0, visible);

      for (let i = 0; i < visible; i++) {
        if (reducedMotion) break;
        const i3 = i * 3;
        const seed = seeds[i] || 0;
        const role = roles[i] || 0;
        // Idle: almost still
        let x = baseMicro[i3] + Math.cos(time * 0.18 + seed * 10) * 0.012;
        let y = baseMicro[i3 + 1] + Math.sin(time * 0.2 + seed * 8) * 0.014;
        let z = baseMicro[i3 + 2] + Math.sin(time * 0.16 + seed * 6) * 0.012;

        worldTmp.current.set(x, y, z);
        group.current.localToWorld(worldTmp.current);
        ndcTmp.current.copy(worldTmp.current).project(camera);
        const nx = ndcTmp.current.x;
        const ny = ndcTmp.current.y;

        if (cursor?.active) {
          const dx = nx - cursor.nx;
          const dy = ny - cursor.ny;
          const d2 = dx * dx + dy * dy;
          // Local gravity anomaly — only nearby points
          if (d2 < 0.14) {
            const f = (0.14 - d2) * 0.7;
            const attract = wake > 0.5 || role === 2 ? -0.45 : 1;
            x += dx * f * 1.2 * attract;
            y += dy * f * 1.2 * attract;
            if (role === 2) nearSecret = Math.max(nearSecret, 1 - d2 / 0.14);
          }
        }

        // Node wake: heartbeat pulse through nearby field
        if (wake > 0.2 && role === 1) {
          const pulse = 1 + Math.sin(time * 3.2) * 0.04 * wake;
          x *= pulse;
          y *= pulse;
          z *= pulse;
        }

        pos[i3] = x;
        pos[i3 + 1] = y;
        pos[i3 + 2] = z;

        const hot = wake * 0.55 + (role === 2 ? secretWake.current * 0.8 : 0);
        tmpA.current.copy(steel).lerp(dataBlue, Math.min(0.55, hot));
        if (role === 2 && secretWake.current > 0.4) tmpA.current.lerp(accent, 0.35);
        col[i3] = tmpA.current.r;
        col[i3 + 1] = tmpA.current.g;
        col[i3 + 2] = tmpA.current.b;
      }
      microRef.current.geometry.attributes.position.needsUpdate = true;
      microRef.current.geometry.attributes.color.needsUpdate = true;
      microRef.current.material.opacity = 0.55 + reveal.current * 0.4;
      microRef.current.material.size = SIZE_DATA * (1 + e * 0.08);
    }

    secretWake.current = THREE.MathUtils.damp(
      secretWake.current,
      nearSecret > 0.35 || wake > 0.7 ? 1 : nearSecret * 0.8,
      3,
      dt
    );

    if (signalRef.current && baseSignal && !reducedMotion) {
      const pos = signalRef.current.geometry.attributes.position.array;
      const col = signalRef.current.geometry.attributes.color.array;
      for (let i = 0; i < SIGNAL; i++) {
        const i3 = i * 3;
        const u = (time * 0.08 + i / SIGNAL) % 1;
        const p = secretCurve.getPoint(u);
        pos[i3] = p.x;
        pos[i3 + 1] = p.y + Math.sin(time + i) * 0.02;
        pos[i3 + 2] = p.z;
        tmpB.current.copy(steel).lerp(dataBlue, 0.25 + secretWake.current * 0.5);
        col[i3] = tmpB.current.r;
        col[i3 + 1] = tmpB.current.g;
        col[i3 + 2] = tmpB.current.b;
      }
      signalRef.current.geometry.attributes.position.needsUpdate = true;
      signalRef.current.geometry.attributes.color.needsUpdate = true;
      signalRef.current.material.opacity =
        reveal.current * (0.15 + secretWake.current * 0.7);
      signalRef.current.material.size = SIZE_SIGNAL;
    }

    if (secretRef.current) {
      secretRef.current.material.opacity =
        reveal.current * secretWake.current * 0.85;
      secretRef.current.material.size =
        SIZE_SECRET * (0.9 + secretWake.current * 0.25);
      // Traveling highlight along the secret route
      if (!reducedMotion && secretWake.current > 0.2) {
        const pos = secretRef.current.geometry.attributes.position.array;
        for (let i = 0; i < SECRET; i++) {
          const i3 = i * 3;
          const u = (i / (SECRET - 1) + time * 0.12) % 1;
          const p = secretCurve.getPoint(u);
          pos[i3] = THREE.MathUtils.lerp(baseSecret[i3], p.x, 0.35);
          pos[i3 + 1] = THREE.MathUtils.lerp(baseSecret[i3 + 1], p.y, 0.35);
          pos[i3 + 2] = THREE.MathUtils.lerp(baseSecret[i3 + 2], p.z, 0.35);
        }
        secretRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }

    if (stateRef?.current) {
      stateRef.current.globeEnergy = e;
      stateRef.current.globeRotY = orient.current.y;
      stateRef.current.globeRotX = orient.current.x;
      stateRef.current.breath = breath.current;
      stateRef.current.reveal = reveal.current;
      stateRef.current.colourWake = THREE.MathUtils.clamp(
        e * 0.7 + wake * 0.8 + secretWake.current * 0.5,
        0,
        1
      );
      stateRef.current.secretWake = secretWake.current;
    }
  });

  return (
    <group ref={group}>
      <points ref={microRef} geometry={microGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={SIZE_DATA}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          alphaTest={0.4}
          toneMapped={false}
        />
      </points>
      <points ref={signalRef} geometry={signalGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={SIZE_SIGNAL}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.2}
          depthWrite={false}
          alphaTest={0.35}
          toneMapped={false}
        />
      </points>
      <points ref={secretRef} geometry={secretGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={SIZE_SECRET}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0}
          depthWrite={false}
          alphaTest={0.35}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
