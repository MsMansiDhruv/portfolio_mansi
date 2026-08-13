"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { THEME, getWorkClusters } from "@/lib/data/data-world";

/** Fine information grain — hard core, almost no glow */
function grainTex() {
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, 32, 32);
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.beginPath();
  ctx.arc(16, 16, 5.5, 0, Math.PI * 2);
  ctx.fill();
  // tiny soft edge only
  const g = ctx.createRadialGradient(16, 16, 5, 16, 16, 9);
  g.addColorStop(0, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(16, 16, 9, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = false;
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

function hash(i) {
  return Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
}

/**
 * Data Core — living computational field.
 * Fine grains · uneven topology · local gravity · secret network · WORK decompose.
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
  const signalRef = useRef();
  const secretRef = useRef();
  const energy = useRef(0.02);
  const reveal = useRef(0);
  const density = useRef(0.18);
  const secretWake = useRef(0);
  const decompose = useRef(0);
  const orient = useRef({ x: 0.02, y: 0.01 });
  const target = useRef({ x: 0.02, y: 0.01 });
  const worldTmp = useRef(new THREE.Vector3());
  const ndcTmp = useRef(new THREE.Vector3());
  const attractors = useRef([]);
  const { camera } = useThree();
  const t = THEME[themeId] || THEME.night;
  const day = themeId === "day";
  const map = useMemo(() => grainTex(), []);

  const MICRO = reducedMotion ? 900 : 2400;
  const SIGNAL = reducedMotion ? 40 : 90;
  const SECRET = 36;

  // Screen-space grains (px) — collective behaviour is the spectacle
  const SIZE_DATA = day ? 1.55 : 1.45;
  const SIZE_SIGNAL = day ? 2.1 : 2.0;
  const SIZE_SECRET = day ? 2.6 : 2.5;

  const steel = useMemo(() => new THREE.Color(day ? "#4a5564" : "#9aaec0"), [day]);
  const mute = useMemo(() => new THREE.Color(day ? "#6a7686" : "#7e92a6"), [day]);
  const voidTone = useMemo(() => new THREE.Color(day ? "#8a94a0" : "#5a6a7c"), [day]);
  const accent = useMemo(() => new THREE.Color(t.accent), [t.accent]);
  const dataBlue = useMemo(() => new THREE.Color(t.data), [t.data]);
  const tmpA = useRef(new THREE.Color());
  const tmpB = useRef(new THREE.Color());

  useMemo(() => {
    attractors.current = getWorkClusters().map((c) => new THREE.Vector3(...c.unfold));
  }, []);

  const {
    microGeom,
    signalGeom,
    secretGeom,
    baseMicro,
    baseSecret,
    seeds,
    roles,
    clusterIdx,
    secretCurve,
  } = useMemo(() => {
    const secretCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-1.5, -0.3, 0.85),
      new THREE.Vector3(-0.35, 0.5, 1.3),
      new THREE.Vector3(0.5, -0.15, 1.4),
      new THREE.Vector3(1.6, 0.2, 0.7)
    );

    const microPos = new Float32Array(MICRO * 3);
    const microCol = new Float32Array(MICRO * 3);
    const microBase = new Float32Array(MICRO * 3);
    const microSeeds = new Float32Array(MICRO);
    const microRoles = new Uint8Array(MICRO); // 0 sparse, 1 cluster, 2 corridor, 3 dormant void
    const microCluster = new Int8Array(MICRO);

    // Dense islands — living topology, not uniform shell
    const islands = [
      [0.95, 0.5, 0.7],
      [-0.9, 0.3, 0.95],
      [0.2, -0.9, 0.65],
      [-0.4, 0.2, -1.1],
      [1.05, -0.3, -0.5],
      [-0.7, -0.55, 0.35],
      [0.45, 0.85, -0.4],
    ];

    let mi = 0;
    let attempt = 0;
    while (mi < MICRO && attempt < MICRO * 5) {
      const i = attempt++;
      const h = hash(i);
      let x;
      let y;
      let z;
      let role = 0;
      let cIdx = -1;

      if (h < 0.34) {
        cIdx = i % islands.length;
        const c = islands[cIdx];
        const s = 0.12 + hash(i + 3) * 0.38;
        const a = hash(i + 7) * Math.PI * 2;
        const b = hash(i + 11) * Math.PI;
        x = c[0] + Math.sin(b) * Math.cos(a) * s;
        y = c[1] + Math.sin(b) * Math.sin(a) * s * 0.8;
        z = c[2] + Math.cos(b) * s;
        role = 1;
      } else if (h < 0.46) {
        const u = hash(i + 17);
        const p = secretCurve.getPoint(u);
        const tang = secretCurve.getTangent(u);
        const n = new THREE.Vector3(-tang.z, 0.15, tang.x).normalize();
        const off = (hash(i + 19) - 0.5) * 0.28;
        x = p.x + n.x * off;
        y = p.y + (hash(i + 23) - 0.5) * 0.22;
        z = p.z + n.z * off;
        role = 2;
        cIdx = Math.floor(u * 4) % 4;
      } else if (h < 0.62) {
        // Dormant / almost empty regions — intentional voids
        const yy = (hash(i + 33) * 2 - 1) * 1.6;
        const a = hash(i + 37) * Math.PI * 2;
        const r = 1.35 + hash(i + 41) * 0.45;
        x = Math.cos(a) * r * 0.55;
        y = yy;
        z = Math.sin(a) * r * 0.55;
        role = 3;
      } else {
        // Sparse shell for silhouette — not filled
        if (hash(i + 29) < 0.45) continue;
        const yy = 1 - (mi / Math.max(1, MICRO - 1)) * 2;
        const rr = Math.sqrt(Math.max(0, 1 - yy * yy));
        const theta = Math.PI * (3 - Math.sqrt(5)) * mi * 1.7;
        const r = 1.78 + hash(i + 31) * 0.14;
        x = Math.cos(theta) * rr * r;
        y = yy * r;
        z = Math.sin(theta) * rr * r;
        role = 0;
        cIdx = Math.floor(((Math.atan2(z, x) + Math.PI) / (Math.PI * 2)) * 4) % 4;
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
      microCluster[mi] = cIdx;

      const base = role === 3 ? voidTone : role === 1 ? mute : steel;
      microCol[mi * 3] = base.r;
      microCol[mi * 3 + 1] = base.g;
      microCol[mi * 3 + 2] = base.b;
      mi++;
    }

    const signalPos = new Float32Array(SIGNAL * 3);
    const signalCol = new Float32Array(SIGNAL * 3);
    for (let i = 0; i < SIGNAL; i++) {
      const p = secretCurve.getPoint(i / SIGNAL);
      signalPos[i * 3] = p.x;
      signalPos[i * 3 + 1] = p.y;
      signalPos[i * 3 + 2] = p.z;
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
      baseSecret: secretBase,
      seeds: microSeeds.subarray(0, mi).slice(),
      roles: microRoles.subarray(0, mi).slice(),
      clusterIdx: microCluster.subarray(0, mi).slice(),
      secretCurve,
    };
  }, [MICRO, SIGNAL, SECRET, steel, mute, voidTone, accent]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const cursor = cursorRef?.current;
    const story = stateRef?.current?.story || "explore";
    const wake = stateRef?.current?.wake || 0;
    const inWork = layer === "work";
    const inPipeline = !!stateRef?.current?.pipelineActive;

    decompose.current = THREE.MathUtils.damp(
      decompose.current,
      inWork && !inPipeline ? 1 : inPipeline ? 0.15 : 0,
      1.6,
      dt
    );
    const dec = decompose.current;

    const densTarget = inPipeline
      ? 0.05
      : inWork
        ? 0.55
        : story === "silence"
          ? 0.22
          : story === "emergence"
            ? 0.48
            : story === "connection"
              ? 0.72
              : 1;
    density.current = THREE.MathUtils.damp(density.current, densTarget, 1.2, dt);

    let revealTarget = densTarget;
    if (story === "silence" && !inWork) revealTarget = 0.4;
    reveal.current = THREE.MathUtils.damp(reveal.current, revealTarget, 1.8, dt);

    if (cursor?.active && (story === "explore" || story === "identity") && !inWork) {
      target.current.y = cursor.nx * 0.06;
      target.current.x = 0.02 + cursor.ny * 0.05;
      energy.current = THREE.MathUtils.damp(
        energy.current,
        0.22 + Math.min(0.2, Math.hypot(cursor.vx, cursor.vy) * 0.008),
        2.2,
        dt
      );
    } else {
      target.current.y = THREE.MathUtils.damp(target.current.y, 0.01, 0.8, dt);
      target.current.x = THREE.MathUtils.damp(target.current.x, 0.02, 0.8, dt);
      energy.current = THREE.MathUtils.damp(
        energy.current,
        0.015 + wake * 0.18,
        1.4,
        dt
      );
    }

    orient.current.x = THREE.MathUtils.damp(orient.current.x, target.current.x, 1.4, dt);
    orient.current.y = THREE.MathUtils.damp(orient.current.y, target.current.y, 1.4, dt);
    // Quiet — no continuous spin show
    group.current.rotation.x = orient.current.x;
    group.current.rotation.y = orient.current.y + Math.sin(time * 0.018) * 0.006;
    const scaleBase = 0.74 + reveal.current * 0.26;
    group.current.scale.setScalar(THREE.MathUtils.lerp(scaleBase, 1.35, dec * 0.55));
    group.current.position.set(0, 0, 0);
    group.current.updateMatrixWorld();

    let nearSecret = 0;
    const e = energy.current;

    if (microRef.current && baseMicro) {
      const pos = microRef.current.geometry.attributes.position.array;
      const col = microRef.current.geometry.attributes.color.array;
      const n = Math.floor(baseMicro.length / 3);
      const visible = Math.floor(n * density.current);
      microRef.current.geometry.setDrawRange(0, visible);

      for (let i = 0; i < visible; i++) {
        const i3 = i * 3;
        const seed = seeds[i] || 0;
        const role = roles[i] || 0;
        const ci = clusterIdx[i] >= 0 ? clusterIdx[i] % 4 : i % 4;

        // Idle: almost still — micro only
        let x = baseMicro[i3];
        let y = baseMicro[i3 + 1];
        let z = baseMicro[i3 + 2];
        if (!reducedMotion && !inWork) {
          x += Math.cos(time * 0.12 + seed * 10) * 0.003;
          y += Math.sin(time * 0.14 + seed * 8) * 0.0035;
          z += Math.sin(time * 0.1 + seed * 6) * 0.003;
        }

        // WORK: spherical field stretches toward four system attractors
        if (dec > 0.02 && attractors.current[ci]) {
          const a = attractors.current[ci];
          const pull = dec * (0.55 + (role === 1 ? 0.25 : 0));
          x = THREE.MathUtils.lerp(x, a.x + (seed - 0.5) * 0.55, pull);
          y = THREE.MathUtils.lerp(y, a.y + (hash(i + 2) - 0.5) * 0.4, pull);
          z = THREE.MathUtils.lerp(z, a.z + (hash(i + 5) - 0.5) * 0.35, pull);
        }

        worldTmp.current.set(x, y, z);
        group.current.localToWorld(worldTmp.current);
        ndcTmp.current.copy(worldTmp.current).project(camera);
        const nx = ndcTmp.current.x;
        const ny = ndcTmp.current.y;

        if (cursor?.active && !inPipeline) {
          const dx = nx - cursor.nx;
          const dy = ny - cursor.ny;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.11) {
            const f = (0.11 - d2) * 0.55;
            // Repel + reveal — magnetic dust
            const attract = role === 2 && secretWake.current > 0.3 ? -0.35 : 1;
            x += dx * f * 1.05 * attract;
            y += dy * f * 1.05 * attract;
            if (role === 2) nearSecret = Math.max(nearSecret, 1 - d2 / 0.11);
          }
        }

        if (wake > 0.25 && role === 1 && !inWork) {
          const pulse = 1 + Math.sin(time * 2.8 + seed * 4) * 0.018 * wake;
          x *= pulse;
          y *= pulse;
          z *= pulse;
        }

        pos[i3] = x;
        pos[i3 + 1] = y;
        pos[i3 + 2] = z;

        // Near-monochrome — colour is rare and meaningful
        const hot = Math.min(0.14, wake * 0.12 + (role === 2 ? secretWake.current * 0.14 : 0));
        tmpA.current.copy(role === 3 ? voidTone : steel).lerp(dataBlue, hot);
        if (role === 2 && secretWake.current > 0.7) tmpA.current.lerp(accent, 0.16);
        if (dec > 0.4) tmpA.current.lerp(mute, 0.2);
        col[i3] = tmpA.current.r;
        col[i3 + 1] = tmpA.current.g;
        col[i3 + 2] = tmpA.current.b;
      }
      microRef.current.geometry.attributes.position.needsUpdate = true;
      microRef.current.geometry.attributes.color.needsUpdate = true;
      microRef.current.material.opacity =
        (0.72 + reveal.current * 0.28) * (inPipeline ? 0.08 : 1 - dec * 0.35);
      microRef.current.material.size = SIZE_DATA * (1 + e * 0.05);
    }

    secretWake.current = THREE.MathUtils.damp(
      secretWake.current,
      nearSecret > 0.4 || wake > 0.75 ? 1 : nearSecret * 0.85,
      2.8,
      dt
    );

    if (signalRef.current && !reducedMotion) {
      const pos = signalRef.current.geometry.attributes.position.array;
      const col = signalRef.current.geometry.attributes.color.array;
      for (let i = 0; i < SIGNAL; i++) {
        const i3 = i * 3;
        const u = (time * 0.06 + i / SIGNAL) % 1;
        const p = secretCurve.getPoint(u);
        pos[i3] = p.x;
        pos[i3 + 1] = p.y;
        pos[i3 + 2] = p.z;
        tmpB.current.copy(steel).lerp(dataBlue, 0.08 + secretWake.current * 0.2);
        col[i3] = tmpB.current.r;
        col[i3 + 1] = tmpB.current.g;
        col[i3 + 2] = tmpB.current.b;
      }
      signalRef.current.geometry.attributes.position.needsUpdate = true;
      signalRef.current.geometry.attributes.color.needsUpdate = true;
      signalRef.current.material.opacity =
        reveal.current * (0.08 + secretWake.current * 0.55) * (1 - dec * 0.7);
      signalRef.current.material.size = SIZE_SIGNAL;
      signalRef.current.visible = !inPipeline;
    }

    if (secretRef.current) {
      secretRef.current.material.opacity =
        reveal.current * secretWake.current * 0.75 * (1 - dec * 0.8);
      secretRef.current.material.size = SIZE_SECRET;
      secretRef.current.visible = !inPipeline && secretWake.current > 0.08;
      if (!reducedMotion && secretWake.current > 0.25 && baseSecret) {
        const pos = secretRef.current.geometry.attributes.position.array;
        for (let i = 0; i < SECRET; i++) {
          const i3 = i * 3;
          const u = (i / (SECRET - 1) + time * 0.1) % 1;
          const p = secretCurve.getPoint(u);
          pos[i3] = THREE.MathUtils.lerp(baseSecret[i3], p.x, 0.4);
          pos[i3 + 1] = THREE.MathUtils.lerp(baseSecret[i3 + 1], p.y, 0.4);
          pos[i3 + 2] = THREE.MathUtils.lerp(baseSecret[i3 + 2], p.z, 0.4);
        }
        secretRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }

    if (stateRef?.current) {
      stateRef.current.globeEnergy = e;
      stateRef.current.globeRotY = orient.current.y;
      stateRef.current.globeRotX = orient.current.x;
      stateRef.current.breath = 0;
      stateRef.current.reveal = reveal.current;
      stateRef.current.colourWake = THREE.MathUtils.clamp(
        e * 0.5 + wake * 0.6 + secretWake.current * 0.4,
        0,
        1
      );
      stateRef.current.secretWake = secretWake.current;
      stateRef.current.decompose = dec;
    }
  });

  return (
    <group ref={group}>
      <points ref={microRef} geometry={microGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={SIZE_DATA}
          sizeAttenuation={false}
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          alphaTest={0.45}
          toneMapped={false}
        />
      </points>
      <points ref={signalRef} geometry={signalGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={SIZE_SIGNAL}
          sizeAttenuation={false}
          vertexColors
          transparent
          opacity={0.12}
          depthWrite={false}
          alphaTest={0.4}
          toneMapped={false}
        />
      </points>
      <points ref={secretRef} geometry={secretGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={SIZE_SECRET}
          sizeAttenuation={false}
          vertexColors
          transparent
          opacity={0}
          depthWrite={false}
          alphaTest={0.4}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
