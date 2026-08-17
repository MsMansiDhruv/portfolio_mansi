"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { THEME, getWorkClusters } from "@/lib/data/data-world";

/** Crisp circular grain — hard edge, minimal halo */
function grainTex() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, 64, 64);
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.beginPath();
  ctx.arc(32, 32, 11, 0, Math.PI * 2);
  ctx.fill();
  // One-pixel soft falloff only (not bloom)
  const g = ctx.createRadialGradient(32, 32, 10, 32, 32, 14);
  g.addColorStop(0, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(32, 32, 14, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

function hash(i) {
  return Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
}

function seedAwareSignalColor(index, steel, dataBlue, accent) {
  const seed = hash(index * 1.731 + 9.17);
  const color = steel.clone().lerp(dataBlue, 0.2 + seed * 0.12);
  if (seed > 0.78) color.lerp(accent, 0.3);
  return color;
}

function onSphere(lat, lon, r) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const th = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(th),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(th)
  );
}

/**
 * DATA CORE — artificial planet of information.
 * Weather · rivers · hidden circuitry · antigravity touch · WORK open.
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
  const energy = useRef(0.02);
  const reveal = useRef(0);
  const density = useRef(0.2);
  const secretWake = useRef(0);
  const decompose = useRef(0);
  const riverAwake = useRef(0);
  const scrollWake = useRef(0);
  const signalCurrent = useRef(0);
  const aiThought = useRef(0);
  const shapeProgress = useRef(0);
  const assemble = useRef(0);
  const groupPos = useRef({ x: 0, y: 0, z: 0 });
  const orient = useRef({ x: 0.08, y: 0.22 });
  const target = useRef({ x: 0.08, y: 0.22 });
  const vel = useRef({ x: 0, y: 0 }); // spring inertia for field
  const worldTmp = useRef(new THREE.Vector3());
  const ndcTmp = useRef(new THREE.Vector3());
  const attractors = useRef([]);
  const { camera } = useThree();
  const t = THEME[themeId] || THEME.night;
  const day = themeId === "day";
  const map = useMemo(() => grainTex(), []);
  const compactViewport = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 768,
    []
  );
  const quality = useMemo(() => {
    if (typeof window === "undefined") return 1;
    const mobile = window.innerWidth < 768;
    const memory = navigator.deviceMemory || 8;
    if (reducedMotion) return 0.5;
    if (mobile) return 0.58;
    if (memory <= 4) return 0.78;
    return 1;
  }, [reducedMotion]);

  const MICRO = Math.max(1200, Math.round((reducedMotion ? 1500 : 5800) * quality));
  const SIGNAL = Math.max(42, Math.round((reducedMotion ? 56 : 116) * quality));
  const RIVER = Math.max(96, Math.round((reducedMotion ? 96 : 300) * quality));
  const CIRCUIT = Math.max(24, Math.round(42 * quality));

  // A larger, evenly distributed shell reads as a designed object at distance.
  // A little larger than a conventional point cloud so the field reads as
  // individual matter, not static grain. It stays screen-space crisp.
  const SIZE_MICRO = day ? 6.2 : 5.2;
  const SIZE_SIGNAL = day ? 6.1 : 5.45;
  const SIZE_RIVER = day ? 6.1 : 5.45;
  const SIZE_CIRCUIT = day ? 6.8 : 6.05;

  const steel = useMemo(() => new THREE.Color(day ? "#5a6a7c" : "#f6f4f2"), [day]);
  const silver = useMemo(() => new THREE.Color(day ? "#6d7f93" : "#ddd8eb"), [day]);
  const mute = useMemo(() => new THREE.Color(day ? "#8a98a8" : "#77718b"), [day]);
  const dataBlue = useMemo(
    () => new THREE.Color(day ? "#6d63a9" : t.data),
    [day, t.data]
  );
  const teal = useMemo(
    () => new THREE.Color(day ? "#4d9bda" : t.transform),
    [day, t.transform]
  );
  const accent = useMemo(
    () => new THREE.Color(day ? "#bd629d" : t.accent),
    [day, t.accent]
  );
  const tmpC = useRef(new THREE.Color());

  useMemo(() => {
    attractors.current = getWorkClusters().map((c) => new THREE.Vector3(...c.unfold));
  }, []);

  const {
    microGeom,
    signalGeom,
    riverGeom,
    circuitGeom,
    baseMicro,
    seeds,
    roles,
    clusterIdx,
    opacBase,
    shapeTargets,
    rivers,
    circuitCurve,
    velBuf,
  } = useMemo(() => {
    // Hidden circuitry spine — revealed by antigravity touch
    const circuitCurve = new THREE.CubicBezierCurve3(
      onSphere(12, -40, 1.55),
      onSphere(28, 10, 1.72),
      onSphere(-8, 55, 1.68),
      onSphere(5, 110, 1.5)
    );

    // Data rivers — ETL / stream metaphors as luminous matter flows
    const rivers = [
      {
        curve: new THREE.CubicBezierCurve3(
          onSphere(-20, -90, 1.62),
          onSphere(10, -20, 1.85),
          onSphere(25, 40, 1.8),
          onSphere(-5, 100, 1.58)
        ),
        speed: 0.07,
        kind: "stream",
      },
      {
        curve: new THREE.CubicBezierCurve3(
          onSphere(40, 20, 1.5),
          onSphere(15, 70, 1.78),
          onSphere(-30, 120, 1.7),
          onSphere(-15, 170, 1.52)
        ),
        speed: 0.11,
        kind: "etl",
      },
      {
        curve: new THREE.CubicBezierCurve3(
          onSphere(-35, -150, 1.48),
          onSphere(-10, -80, 1.75),
          onSphere(35, -10, 1.82),
          onSphere(20, 60, 1.55)
        ),
        speed: 0.05,
        kind: "batch",
      },
      {
        curve: new THREE.CubicBezierCurve3(
          onSphere(5, 140, 1.6),
          onSphere(-25, -160, 1.7),
          onSphere(30, -100, 1.65),
          onSphere(0, -40, 1.52)
        ),
        speed: 0.15,
        kind: "event",
      },
    ];

    // Weather islands — dense / empty / corridors
    const weather = [
      { p: onSphere(25, -30, 1.35), s: 0.42, dens: 1 },
      { p: onSphere(-15, 60, 1.4), s: 0.5, dens: 1 },
      { p: onSphere(50, 120, 1.2), s: 0.35, dens: 0.85 },
      { p: onSphere(-40, -100, 1.25), s: 0.38, dens: 0.9 },
      { p: onSphere(10, 200, 1.3), s: 0.45, dens: 1 },
      { p: onSphere(-5, -160, 1.15), s: 0.28, dens: 0.7 },
      { p: onSphere(60, 40, 1.1), s: 0.32, dens: 0.8 },
    ];

    const microPos = new Float32Array(MICRO * 3);
    const microCol = new Float32Array(MICRO * 3);
    const microBase = new Float32Array(MICRO * 3);
    const microSeeds = new Float32Array(MICRO);
    const microRoles = new Uint8Array(MICRO);
    const microCluster = new Int8Array(MICRO);
    const microOpac = new Float32Array(MICRO);
    const velBuf = new Float32Array(MICRO * 3);

    let mi = 0;
    let attempt = 0;
    while (mi < MICRO && attempt < MICRO * 6) {
      const i = attempt++;
      const h = hash(i);
      let x;
      let y;
      let z;
      let role = 0;
      let cIdx = -1;
      let opa = 0.55 + hash(i + 9) * 0.45;

      // A precise shell carries the silhouette. Denser "weather" clusters
      // are accents within it, not the object itself.
      if (h < 0.16) {
        const w = weather[i % weather.length];
        if (hash(i + 2) > w.dens) continue;
        const a = hash(i + 7) * Math.PI * 2;
        const b = hash(i + 11) * Math.PI;
        const s = w.s * (0.25 + hash(i + 3) * 0.85);
        x = w.p.x + Math.sin(b) * Math.cos(a) * s;
        y = w.p.y + Math.sin(b) * Math.sin(a) * s * 0.72;
        z = w.p.z + Math.cos(b) * s;
        role = 1;
        cIdx = i % 4;
        opa = 0.65 + hash(i + 15) * 0.35;
      } else if (h < 0.25) {
        const riv = rivers[i % rivers.length];
        const u = hash(i + 17);
        const p = riv.curve.getPoint(u);
        const tang = riv.curve.getTangent(u);
        const n = new THREE.Vector3(-tang.z, 0.12, tang.x).normalize();
        const off = (hash(i + 19) - 0.5) * 0.18;
        x = p.x + n.x * off;
        y = p.y + (hash(i + 23) - 0.5) * 0.12;
        z = p.z + n.z * off;
        role = 2;
        cIdx = i % 4;
        opa = 0.75;
      } else if (h < 0.3) {
        // Quiet voids — interior emptiness, not broken silhouette
        if (hash(i + 29) < 0.82) continue;
        const lat = (hash(i + 33) - 0.5) * 160;
        const lon = hash(i + 37) * 360 - 180;
        const p = onSphere(lat, lon, 1.55 + hash(i + 41) * 0.3);
        x = p.x;
        y = p.y;
        z = p.z;
        role = 3;
        opa = 0.25 + hash(i + 45) * 0.25;
      } else {
        // Complete spherical silhouette — denser than voids, quieter than islands
        if (hash(i + 29) < 0.1) continue;
        const yy = 1 - (mi / Math.max(1, MICRO - 1)) * 2;
        const rr = Math.sqrt(Math.max(0, 1 - yy * yy));
        const theta = Math.PI * (3 - Math.sqrt(5)) * mi;
        const r = 1.8 + hash(i + 31) * 0.08;
        x = Math.cos(theta) * rr * r;
        y = yy * r;
        z = Math.sin(theta) * rr * r;
        role = 0;
        cIdx = Math.floor(((Math.atan2(z, x) + Math.PI) / (Math.PI * 2)) * 4) % 4;
        opa = 0.52 + hash(i + 50) * 0.42;
      }

      // Enforce spherical silhouette
      const len = Math.hypot(x, y, z) || 1;
      if (len > 1.92) {
        const s = 1.88 / len;
        x *= s;
        y *= s;
        z *= s;
      } else if (len < 0.55 && role !== 1) {
        const s = 0.7 / len;
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
      microSeeds[mi] = hash(i + 61);
      microRoles[mi] = role;
      microCluster[mi] = cIdx;
      microOpac[mi] = opa;

      const base = role === 3 ? mute : role === 1 ? silver : steel;
      microCol[mi * 3] = base.r;
      microCol[mi * 3 + 1] = base.g;
      microCol[mi * 3 + 2] = base.b;
      mi++;
    }

    const signalPos = new Float32Array(SIGNAL * 3);
    const signalCol = new Float32Array(SIGNAL * 3);
    for (let i = 0; i < SIGNAL; i++) {
      const riv = rivers[i % rivers.length];
      const p = riv.curve.getPoint(i / SIGNAL);
      signalPos[i * 3] = p.x;
      signalPos[i * 3 + 1] = p.y;
      signalPos[i * 3 + 2] = p.z;
      signalCol[i * 3] = steel.r;
      signalCol[i * 3 + 1] = steel.g;
      signalCol[i * 3 + 2] = steel.b;
    }

    const riverPos = new Float32Array(RIVER * 3);
    const riverCol = new Float32Array(RIVER * 3);
    for (let i = 0; i < RIVER; i++) {
      riverPos[i * 3 + 1] = -99;
      riverCol[i * 3] = silver.r;
      riverCol[i * 3 + 1] = silver.g;
      riverCol[i * 3 + 2] = silver.b;
    }

    const circuitPos = new Float32Array(CIRCUIT * 3);
    const circuitCol = new Float32Array(CIRCUIT * 3);
    for (let i = 0; i < CIRCUIT; i++) {
      const p = circuitCurve.getPoint(i / (CIRCUIT - 1));
      circuitPos[i * 3] = p.x;
      circuitPos[i * 3 + 1] = p.y;
      circuitPos[i * 3 + 2] = p.z;
      circuitCol[i * 3] = accent.r;
      circuitCol[i * 3 + 1] = accent.g;
      circuitCol[i * 3 + 2] = accent.b;
    }

    const trim = (arr, n) => arr.subarray(0, n * 3).slice();
    const basePoints = trim(microBase, mi);
    // Shape targets are generated once. Keeping the transition as typed-array
    // interpolation avoids per-frame allocations while thousands of particles
    // are in flight.
    const shapeTargets = {
      world: basePoints,
      work: new Float32Array(mi * 3),
      ai: new Float32Array(mi * 3),
      experience: new Float32Array(mi * 3),
      about: new Float32Array(mi * 3),
      contact: new Float32Array(mi * 3),
    };
    for (let i = 0; i < mi; i++) {
      const i3 = i * 3;
      const seed = microSeeds[i];
      const p = seed * Math.PI * 2;
      const lane = (Math.floor(hash(i + 71) * 5) - 2) * 0.56;
      shapeTargets.work[i3] = lane + Math.sin(seed * 73) * 0.12;
      shapeTargets.work[i3 + 1] = (hash(i + 19) - 0.5) * 3.45;
      shapeTargets.work[i3 + 2] = (hash(i + 43) - 0.5) * 2.2;
      const turn = seed * Math.PI * 9;
      shapeTargets.ai[i3] = Math.cos(turn) * 1.08;
      shapeTargets.ai[i3 + 1] = (seed - 0.5) * 3.8;
      shapeTargets.ai[i3 + 2] = Math.sin(turn) * 1.08 + (i % 2 ? 0.13 : -0.13);
      shapeTargets.experience[i3] = (seed - 0.5) * 4.4;
      shapeTargets.experience[i3 + 1] = Math.sin(seed * Math.PI * 8) * 0.52 + lane * 0.16;
      shapeTargets.experience[i3 + 2] = Math.cos(seed * Math.PI * 6) * 0.68;
      const radius = 0.8 + hash(i + 31) * 1.05;
      shapeTargets.about[i3] = Math.cos(p * 3) * radius;
      shapeTargets.about[i3 + 1] = Math.sin(p * 2) * radius * 0.78;
      shapeTargets.about[i3 + 2] = Math.sin(p * 5) * 0.72;
      const ring = 1.05 + hash(i + 5) * 0.34;
      shapeTargets.contact[i3] = Math.cos(p) * ring;
      shapeTargets.contact[i3 + 1] = Math.sin(p) * ring;
      shapeTargets.contact[i3 + 2] = (hash(i + 37) - 0.5) * 0.34;
    }
    const mg = new THREE.BufferGeometry();
    mg.setAttribute("position", new THREE.BufferAttribute(trim(microPos, mi), 3));
    mg.setAttribute("color", new THREE.BufferAttribute(trim(microCol, mi), 3));
    const sg = new THREE.BufferGeometry();
    sg.setAttribute("position", new THREE.BufferAttribute(signalPos, 3));
    sg.setAttribute("color", new THREE.BufferAttribute(signalCol, 3));
    const rg = new THREE.BufferGeometry();
    rg.setAttribute("position", new THREE.BufferAttribute(riverPos, 3));
    rg.setAttribute("color", new THREE.BufferAttribute(riverCol, 3));
    const cg = new THREE.BufferGeometry();
    cg.setAttribute("position", new THREE.BufferAttribute(circuitPos, 3));
    cg.setAttribute("color", new THREE.BufferAttribute(circuitCol, 3));

    return {
      microGeom: mg,
      signalGeom: sg,
      riverGeom: rg,
      circuitGeom: cg,
      baseMicro: basePoints,
      seeds: microSeeds.subarray(0, mi).slice(),
      roles: microRoles.subarray(0, mi).slice(),
      clusterIdx: microCluster.subarray(0, mi).slice(),
      opacBase: microOpac.subarray(0, mi).slice(),
      shapeTargets,
      rivers,
      circuitCurve,
      velBuf: velBuf.subarray(0, mi * 3),
    };
  // Theme changes are material-only. Keeping this geometry stable preserves
  // the living particle field, its velocity, and its current scroll state.
  }, [MICRO, SIGNAL, RIVER, CIRCUIT]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const cursor = cursorRef?.current;
    const story = stateRef?.current?.story || "explore";
    const wake = stateRef?.current?.wake || 0;
    const inWork = layer === "work";
    const inAi = layer === "ai";
    const inPipeline = !!stateRef?.current?.pipelineActive;
    const aiConsoleOpen = !!stateRef?.current?.aiConsoleOpen;
    const aiThinking = !!stateRef?.current?.aiThinking;
    const scrollVelocity = stateRef?.current?.scrollVelocity || 0;
    const scrollProgress = stateRef?.current?.scrollProgress || 0;
    scrollWake.current = THREE.MathUtils.damp(scrollWake.current, Math.min(1, Math.abs(scrollVelocity) * 1.4), 4.5, dt);
    aiThought.current = THREE.MathUtils.damp(aiThought.current, aiThinking ? 1 : 0, aiThinking ? 3.5 : 1.25, dt);
    const thought = aiThought.current;
    // Signal Current: a narrow, particle-only route that eases in under the
    // pointer and becomes a quieter ambient circulation after selection.
    const currentTarget = cursor?.active && !inPipeline ? 1 : inPipeline ? 0.24 : 0;
    signalCurrent.current = THREE.MathUtils.damp(
      signalCurrent.current,
      currentTarget,
      currentTarget > signalCurrent.current ? 4.1 : 1.25,
      dt
    );

    const layerOrder = ["world", "work", "ai", "experience", "about", "contact"];
    const targetProgress =
      typeof stateRef?.current?.shapeProgress === "number"
        ? stateRef.current.shapeProgress
        : Math.max(0, layerOrder.indexOf(layer));
    shapeProgress.current = THREE.MathUtils.damp(shapeProgress.current, targetProgress, 2.05, dt);
    const span = Math.max(1, layerOrder.length - 1);
    const p = THREE.MathUtils.clamp(shapeProgress.current, 0, span);
    const fromIndex = Math.min(Math.floor(p), span);
    const toIndex = Math.min(fromIndex + 1, span);
    const fromId = layerOrder[fromIndex];
    const toId = layerOrder[toIndex];
    const alignment = THREE.MathUtils.smoothstep(p - fromIndex, 0, 1);

    const assembleTarget =
      typeof stateRef?.current?.assemble === "number"
        ? stateRef.current.assemble
        : 1;
    assemble.current += (assembleTarget - assemble.current) * Math.min(1, 1 - Math.exp(-dt * 5.4));
    if (assembleTarget > 0.995 && assemble.current > 0.985) assemble.current = 1;

    const forming = assemble.current < 0.995;
    const scatter = Math.pow(Math.max(0, 1 - assemble.current), 2.15);

    decompose.current = THREE.MathUtils.damp(
      decompose.current,
      inPipeline ? 0.12 : inWork ? 0.18 : inAi ? 0.1 : 0,
      1.4,
      dt
    );
    const dec = decompose.current;

    // Same material — different world states
    const densTarget = forming
      ? 0.92
      : inPipeline
        ? 0.28
      : aiConsoleOpen
        ? aiThinking ? 0.84 : 0.58
      : inWork
        ? 0.82
        : inAi
          ? 0.9
          : 1;
    density.current = THREE.MathUtils.damp(density.current, densTarget, 1.35, dt);
    reveal.current = THREE.MathUtils.damp(reveal.current, forming ? 0.92 : densTarget, 1.55, dt);

    const riverTarget = forming ? 0.72 : story === "silence" ? 0.15 : story === "emergence" ? 0.55 : 1;
    riverAwake.current = THREE.MathUtils.damp(riverAwake.current, riverTarget, 1.2, dt);

    if (!forming && cursor?.active && (story === "explore" || story === "identity") && !inWork) {
      target.current.y = cursor.nx * Math.PI;
      target.current.x = THREE.MathUtils.clamp(0.08 + cursor.ny * 0.72, -0.9, 0.9);
      energy.current = THREE.MathUtils.damp(
        energy.current,
        0.28 + Math.min(0.25, Math.hypot(cursor.vx, cursor.vy) * 0.01),
        2.4,
        dt
      );
    } else {
      target.current.y = THREE.MathUtils.damp(target.current.y, 0.22, 0.9, dt);
      target.current.x = THREE.MathUtils.damp(target.current.x, 0.08, 0.9, dt);
      energy.current = THREE.MathUtils.damp(energy.current, 0.02 + wake * 0.2, 1.5, dt);
    }

    // Globe rotation follows cursor directly, with damping on the object itself
    vel.current.x += (target.current.x - orient.current.x) * 3.8 * dt;
    vel.current.y += (target.current.y - orient.current.y) * 3.2 * dt;
    vel.current.x *= 0.82;
    vel.current.y *= 0.82;
    orient.current.x += vel.current.x * dt * 14;
    orient.current.y += vel.current.y * dt * 14;
    group.current.rotation.x = orient.current.x;
    group.current.rotation.y = orient.current.y;
    const scaleBase = 0.78 + reveal.current * 0.22;
    let scaleMul = THREE.MathUtils.lerp(scaleBase, 1.06, dec * 0.35);
    if (aiConsoleOpen) scaleMul = THREE.MathUtils.lerp(scaleBase, 0.9, 0.7);
    // Portrait screens need a deliberately composed, breathing object rather
    // than a desktop globe cropped by the narrow viewport.
    if (compactViewport) scaleMul *= 0.62;
    group.current.scale.setScalar(scaleMul);
    const gx = aiConsoleOpen ? -1.55 : inAi ? 1.45 : 0;
    const gy = compactViewport ? 0.36 : 0;
    groupPos.current.x = THREE.MathUtils.damp(groupPos.current.x, gx, 1.85, dt);
    groupPos.current.y = THREE.MathUtils.damp(groupPos.current.y, gy, 1.85, dt);
    group.current.position.set(groupPos.current.x, groupPos.current.y, 0);
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

        let x = baseMicro[i3];
        let y = baseMicro[i3 + 1];
        let z = baseMicro[i3 + 2];
        let currentInfluence = 0;
        let thinkingInfluence = 0;

        // Scroll chapters blend as one continuous field — no burst, no void.
        {
          const from = shapeTargets[fromId] || baseMicro;
          const next = shapeTargets[toId] || baseMicro;
          x = THREE.MathUtils.lerp(from[i3], next[i3], alignment);
          y = THREE.MathUtils.lerp(from[i3 + 1], next[i3 + 1], alignment);
          z = THREE.MathUtils.lerp(from[i3 + 2], next[i3 + 2], alignment);
          const scatterAmt = scatter;
          if (scatterAmt > 0.002) {
            const flare = 1 + scatterAmt * (3.6 + seed * 4.4);
            x *= flare;
            y *= flare * (0.82 + seed * 0.35);
            z *= flare;
          }
        }

        // A response is composed by the same intelligence seen at left: the
        // spiral fills from its base, travels upward, then quietly settles.
        // No separate loading ornament is rendered in the chat surface.
        if (thought > 0.002 && aiConsoleOpen) {
          const flowingSeed = (seed + time * 0.115) % 1;
          const turn = flowingSeed * Math.PI * 9;
          const radius = 1.08 + Math.sin(time * 4.2 + seed * 38) * 0.075 * thought;
          x = THREE.MathUtils.lerp(x, Math.cos(turn) * radius, thought * 0.82);
          y = THREE.MathUtils.lerp(y, (flowingSeed - 0.5) * 3.8, thought * 0.82);
          z = THREE.MathUtils.lerp(z, Math.sin(turn) * radius + (i % 2 ? 0.13 : -0.13), thought * 0.82);
          const band = Math.abs(flowingSeed - 0.5);
          thinkingInfluence = Math.pow(Math.max(0, 1 - band / 0.16), 2) * thought;
        }

        // Quiet weather drift
        if (!reducedMotion && !inWork) {
          const amp = role === 1 ? 0.006 : 0.0025;
          x += Math.cos(time * 0.1 + seed * 9) * amp;
          y += Math.sin(time * 0.12 + seed * 7) * amp;
          z += Math.sin(time * 0.09 + seed * 5) * amp;
        }

        if (dec > 0.02 && attractors.current[ci]) {
          const a = attractors.current[ci];
          const pull = dec * (0.5 + (role === 1 ? 0.3 : 0));
          x = THREE.MathUtils.lerp(x, a.x + (seed - 0.5) * 0.6, pull);
          y = THREE.MathUtils.lerp(y, a.y + (hash(i + 2) - 0.5) * 0.45, pull);
          z = THREE.MathUtils.lerp(z, a.z + (hash(i + 5) - 0.5) * 0.4, pull);
        }

        if (signalCurrent.current > 0.008) {
          // z is the route's depth parameter, so the current actually passes
          // through the volume instead of drawing a line on top of the shell.
          const routeT = THREE.MathUtils.clamp((z + 1.9) / 3.8, 0, 1);
          const pointerX = cursor?.active ? cursor.nx * 0.76 : 0.14;
          const pointerY = cursor?.active ? cursor.ny * 0.46 : -0.04;
          const routeX = pointerX + Math.sin(routeT * Math.PI * 1.15 + time * 0.16) * 0.46;
          const routeY = pointerY + Math.cos(routeT * Math.PI * 1.7 + time * 0.13) * 0.31;
          const routeDistance = Math.hypot(x - routeX, y - routeY);
          const routeWidth = reducedMotion ? 0.19 : 0.145;
          currentInfluence = Math.pow(
            Math.max(0, 1 - routeDistance / routeWidth),
            2
          ) * signalCurrent.current;

          if (currentInfluence > 0.001) {
            // Barely pull neighbouring matter into the route, then advect it
            // forward. This creates a dense current without a rendered tube.
            x = THREE.MathUtils.lerp(x, routeX, currentInfluence * 0.075);
            y = THREE.MathUtils.lerp(y, routeY, currentInfluence * 0.075);
            if (!reducedMotion) {
              const tangentX = Math.cos(routeT * Math.PI * 1.15 + time * 0.16) * 0.16;
              const tangentY = -Math.sin(routeT * Math.PI * 1.7 + time * 0.13) * 0.13;
              velBuf[i3] += tangentX * currentInfluence * 0.62 * dt;
              velBuf[i3 + 1] += tangentY * currentInfluence * 0.62 * dt;
              velBuf[i3 + 2] += currentInfluence * 0.9 * dt;
            }
          }
        }

        worldTmp.current.set(x, y, z);
        group.current.localToWorld(worldTmp.current);
        ndcTmp.current.copy(worldTmp.current).project(camera);

        // Antigravity — spring force with inertia, no jitter
        if (cursor?.active && !inPipeline) {
          const dx = ndcTmp.current.x - cursor.nx;
          const dy = ndcTmp.current.y - cursor.ny;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.12) {
            const fall = Math.max(0, 1 - d2 / 0.12);
            const f = fall * fall * 0.55;
            const attract = role === 2 && secretWake.current > 0.35 ? -0.4 : 1;
            velBuf[i3] += dx * f * 28 * attract * dt;
            velBuf[i3 + 1] += dy * f * 28 * attract * dt;
            if (role === 2 || d2 < 0.04) {
              nearSecret = Math.max(nearSecret, fall);
            }
          }

          // Scroll turns the pointer field into a short-lived data pattern:
          // close particles circulate; the outer band resolves into a wave.
          if (scrollWake.current > 0.015 && d2 < 0.2) {
            const fall = Math.max(0, 1 - d2 / 0.2);
            const spin = Math.sign(scrollVelocity || 1) * fall * scrollWake.current;
            const pattern = Math.sin(seed * 32 + time * 5 + scrollProgress * 18);
            velBuf[i3] += (-dy * 34 * spin + pattern * 4 * spin) * dt;
            velBuf[i3 + 1] += (dx * 34 * spin + Math.cos(seed * 27 + time * 4) * 3 * spin) * dt;
            velBuf[i3 + 2] += Math.sin(seed * 41 + time * 6) * spin * 0.004;
          }
        }

        // Screen-space confirmation keeps Signal Current tied to an actual
        // hover over the visible globe. It samples existing particles along a
        // thin, gently curved route rather than painting a new line.
        if (signalCurrent.current > 0.01) {
          const currentX = cursor?.active ? cursor.nx : 0.12;
          const currentY = cursor?.active ? cursor.ny : -0.04;
          const along = ndcTmp.current.x - currentX;
          const pathY = currentY + Math.sin(along * 8.5 + time * 0.55) * 0.055;
          const pathDistance = Math.abs(ndcTmp.current.y - pathY);
          const onVisibleRoute = Math.max(0, 1 - Math.abs(along) / 0.58);
          const thinBand = Math.pow(Math.max(0, 1 - pathDistance / 0.042), 2);
          const visibleCurrent = thinBand * onVisibleRoute * signalCurrent.current;
          currentInfluence = Math.max(currentInfluence, visibleCurrent);

          if (visibleCurrent > 0.001 && !reducedMotion) {
            // Tiny forward drift gives the highlighted particles direction;
            // the rest of the field remains entirely untouched.
            velBuf[i3] += visibleCurrent * 0.018;
            velBuf[i3 + 1] += Math.cos(along * 8.5 + time * 0.55) * visibleCurrent * 0.009;
          }
        }
        velBuf[i3] *= 0.88;
        velBuf[i3 + 1] *= 0.88;
        velBuf[i3 + 2] *= 0.88;
        x += velBuf[i3];
        y += velBuf[i3 + 1];
        z += velBuf[i3 + 2];

        if (wake > 0.3 && role === 1 && !inWork) {
          const pulse = 1 + Math.sin(time * 2.6 + seed * 5) * 0.012 * wake;
          x *= pulse;
          y *= pulse;
          z *= pulse;
        }

        pos[i3] = x;
        pos[i3 + 1] = y;
        pos[i3 + 2] = z;

        // Neutral matter — colour only as system response
        const hot = Math.min(
          0.38,
          wake * 0.14 + (role === 2 ? secretWake.current * 0.24 : 0) + e * 0.12
        );
        tmpC.current.copy(role === 3 ? mute : steel).lerp(dataBlue, hot * 0.62);
        const signalBand = Math.abs(y) < 0.78 && x > 0.25;
        const coolBand = z < -0.35 && Math.abs(y) < 0.95;
        if (role === 1 && (seed > 0.72 || secretWake.current > 0.46 || signalBand)) {
          tmpC.current.lerp(accent, (signalBand ? 0.24 : 0.34) + secretWake.current * 0.18);
        }
        if (role === 2 && secretWake.current > 0.45) {
          tmpC.current.lerp(seed > 0.42 ? accent : teal, 0.34 + secretWake.current * 0.22);
        }
        // Rare cool highlights provide a controlled hierarchy across the shell.
        if (role !== 3 && seed > 0.978) {
          tmpC.current.lerp(accent, 0.68);
        }
        if (role === 0 && coolBand && seed > 0.68) {
          tmpC.current.lerp(dataBlue, 0.34);
        }
        if (role === 0 && seed > 0.93) {
          tmpC.current.lerp(accent, 0.44);
        }
        if (currentInfluence > 0.001) {
          // A restrained pale highlight — never a neon trail or solid beam.
          tmpC.current.lerp(silver, Math.min(0.82, currentInfluence * 1.1));
        }
        if (thinkingInfluence > 0.001) {
          tmpC.current.lerp(accent, 0.2 + thinkingInfluence * 0.64);
        }
        if (dec > 0.45) tmpC.current.lerp(mute, 0.15);
        col[i3] = tmpC.current.r;
        col[i3 + 1] = tmpC.current.g;
        col[i3 + 2] = tmpC.current.b;
      }
      microRef.current.geometry.attributes.position.needsUpdate = true;
      microRef.current.geometry.attributes.color.needsUpdate = true;
      microRef.current.material.opacity = Math.min(
        1,
        (0.98 + reveal.current * 0.18) *
          (day ? 1.08 : 1) *
          (inPipeline ? 0.06 : aiConsoleOpen ? 0.72 : 1 - dec * 0.3)
      );
      microRef.current.material.size = SIZE_MICRO * (1 + e * 0.1 + thought * 0.16);
    }

    secretWake.current = THREE.MathUtils.damp(
      secretWake.current,
      nearSecret > 0.45 || wake > 0.7 ? 1 : nearSecret * 0.9,
      2.6,
      dt
    );

    if (stateRef?.current) {
      stateRef.current.globeEnergy = e;
      stateRef.current.globeRotY = orient.current.y;
      stateRef.current.globeRotX = orient.current.x;
      stateRef.current.breath = 0;
      stateRef.current.reveal = reveal.current;
      stateRef.current.colourWake = THREE.MathUtils.clamp(
        e * 0.45 + wake * 0.55 + secretWake.current * 0.45,
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
          size={SIZE_MICRO}
          sizeAttenuation={false}
          vertexColors
          transparent
          opacity={0.96}
          depthWrite={false}
          alphaTest={day ? 0.18 : 0.28}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

