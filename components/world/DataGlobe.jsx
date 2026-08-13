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
  const signalRef = useRef();
  const riverRef = useRef();
  const circuitRef = useRef();
  const energy = useRef(0.02);
  const reveal = useRef(0);
  const density = useRef(0.2);
  const secretWake = useRef(0);
  const decompose = useRef(0);
  const riverAwake = useRef(0);
  const orient = useRef({ x: 0.015, y: 0.01 });
  const target = useRef({ x: 0.015, y: 0.01 });
  const vel = useRef({ x: 0, y: 0 }); // spring inertia for field
  const worldTmp = useRef(new THREE.Vector3());
  const ndcTmp = useRef(new THREE.Vector3());
  const attractors = useRef([]);
  const { camera } = useThree();
  const t = THEME[themeId] || THEME.night;
  const day = themeId === "day";
  const map = useMemo(() => grainTex(), []);

  const MICRO = reducedMotion ? 1100 : 2800;
  const SIGNAL = reducedMotion ? 50 : 110;
  const RIVER = reducedMotion ? 80 : 220;
  const CIRCUIT = 42;

  // Three scales — screen px
  // ~2–3px micro · ~3–4px signal · crisp, not blobs
  const SIZE_MICRO = day ? 2.55 : 2.35;
  const SIZE_SIGNAL = day ? 3.7 : 3.5;
  const SIZE_RIVER = day ? 3.4 : 3.2;
  const SIZE_CIRCUIT = day ? 4.2 : 4.0;

  const steel = useMemo(() => new THREE.Color(day ? "#2a3340" : "#d0dce8"), [day]);
  const silver = useMemo(() => new THREE.Color(day ? "#3d4a5a" : "#eef3f8"), [day]);
  const mute = useMemo(() => new THREE.Color(day ? "#556274" : "#8a9eb2"), [day]);
  const dataBlue = useMemo(() => new THREE.Color(t.data), [t.data]);
  const teal = useMemo(() => new THREE.Color(t.transform), [t.transform]);
  const accent = useMemo(() => new THREE.Color(t.accent), [t.accent]);
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

      if (h < 0.42) {
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
      } else if (h < 0.52) {
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
      } else if (h < 0.62) {
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
        if (hash(i + 29) < 0.22) continue;
        const yy = 1 - (mi / Math.max(1, MICRO - 1)) * 2;
        const rr = Math.sqrt(Math.max(0, 1 - yy * yy));
        const theta = Math.PI * (3 - Math.sqrt(5)) * mi;
        const r = 1.8 + hash(i + 31) * 0.08;
        x = Math.cos(theta) * rr * r;
        y = yy * r;
        z = Math.sin(theta) * rr * r;
        role = 0;
        cIdx = Math.floor(((Math.atan2(z, x) + Math.PI) / (Math.PI * 2)) * 4) % 4;
        opa = 0.45 + hash(i + 50) * 0.4;
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
      baseMicro: trim(microBase, mi),
      seeds: microSeeds.subarray(0, mi).slice(),
      roles: microRoles.subarray(0, mi).slice(),
      clusterIdx: microCluster.subarray(0, mi).slice(),
      opacBase: microOpac.subarray(0, mi).slice(),
      rivers,
      circuitCurve,
      velBuf: velBuf.subarray(0, mi * 3),
    };
  }, [MICRO, SIGNAL, RIVER, CIRCUIT, steel, silver, mute, accent]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const cursor = cursorRef?.current;
    const story = stateRef?.current?.story || "explore";
    const wake = stateRef?.current?.wake || 0;
    const inWork = layer === "work";
    const inAi = layer === "ai";
    const inExp = layer === "experience";
    const inAbout = layer === "about";
    const inContact = layer === "contact";
    const inPipeline = !!stateRef?.current?.pipelineActive;

    decompose.current = THREE.MathUtils.damp(
      decompose.current,
      inWork && !inPipeline ? 1 : inPipeline ? 0.12 : inAi || inExp ? 0.35 : 0,
      1.4,
      dt
    );
    const dec = decompose.current;

    // Same material — different world states
    const densTarget = inPipeline
      ? 0.04
      : inAbout
        ? 0.12
        : inContact
          ? 0.22
          : inAi
            ? 0.28
            : inExp
              ? 0.32
              : inWork
                ? 0.5
                : story === "silence"
                  ? 0.28
                  : story === "emergence"
                    ? 0.55
                    : story === "connection"
                      ? 0.78
                      : 1;
    density.current = THREE.MathUtils.damp(density.current, densTarget, 1.15, dt);
    reveal.current = THREE.MathUtils.damp(
      reveal.current,
      story === "silence" && !inWork ? 0.45 : densTarget,
      1.7,
      dt
    );

    // Opening: first river awakens, then field
    const riverTarget =
      story === "silence" ? 0.15 : story === "emergence" ? 0.55 : 1;
    riverAwake.current = THREE.MathUtils.damp(riverAwake.current, riverTarget, 1.2, dt);

    if (cursor?.active && (story === "explore" || story === "identity") && !inWork) {
      target.current.y = cursor.nx * 0.05;
      target.current.x = 0.015 + cursor.ny * 0.04;
      energy.current = THREE.MathUtils.damp(
        energy.current,
        0.28 + Math.min(0.25, Math.hypot(cursor.vx, cursor.vy) * 0.01),
        2.4,
        dt
      );
    } else {
      target.current.y = THREE.MathUtils.damp(target.current.y, 0.01, 0.9, dt);
      target.current.x = THREE.MathUtils.damp(target.current.x, 0.015, 0.9, dt);
      energy.current = THREE.MathUtils.damp(energy.current, 0.02 + wake * 0.2, 1.5, dt);
    }

    // Spring orient — no continuous spin show
    vel.current.x += (target.current.x - orient.current.x) * 4.5 * dt;
    vel.current.y += (target.current.y - orient.current.y) * 4.5 * dt;
    vel.current.x *= 0.86;
    vel.current.y *= 0.86;
    orient.current.x += vel.current.x * dt * 18;
    orient.current.y += vel.current.y * dt * 18;
    group.current.rotation.x = orient.current.x;
    group.current.rotation.y = orient.current.y + Math.sin(time * 0.012) * 0.004;
    const scaleBase = 0.78 + reveal.current * 0.22;
    let scaleMul = THREE.MathUtils.lerp(scaleBase, 1.45, dec * 0.65);
    if (inAi) scaleMul = THREE.MathUtils.lerp(scaleBase, 1.15, 0.7);
    if (inExp) scaleMul = THREE.MathUtils.lerp(scaleBase, 0.85, 0.6);
    if (inAbout) scaleMul = THREE.MathUtils.lerp(scaleBase, 0.55, 0.8);
    if (inContact) scaleMul = THREE.MathUtils.lerp(scaleBase, 0.7, 0.5);
    group.current.scale.setScalar(scaleMul);
    group.current.position.set(0, inAbout ? 0.15 : 0, inAi ? -0.2 : 0);
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
        }
        velBuf[i3] *= 0.88;
        velBuf[i3 + 1] *= 0.88;
        velBuf[i3 + 2] *= 0.88;
        x += velBuf[i3];
        y += velBuf[i3 + 1];

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
          0.18,
          wake * 0.1 + (role === 2 ? secretWake.current * 0.16 : 0) + e * 0.08
        );
        tmpC.current.copy(role === 3 ? mute : steel).lerp(dataBlue, hot);
        if (role === 2 && secretWake.current > 0.65) tmpC.current.lerp(teal, 0.2);
        if (dec > 0.45) tmpC.current.lerp(mute, 0.15);
        col[i3] = tmpC.current.r;
        col[i3 + 1] = tmpC.current.g;
        col[i3 + 2] = tmpC.current.b;
      }
      microRef.current.geometry.attributes.position.needsUpdate = true;
      microRef.current.geometry.attributes.color.needsUpdate = true;
      microRef.current.material.opacity =
        (0.78 + reveal.current * 0.2) * (inPipeline ? 0.06 : 1 - dec * 0.3);
      microRef.current.material.size = SIZE_MICRO * (1 + e * 0.04);
    }

    secretWake.current = THREE.MathUtils.damp(
      secretWake.current,
      nearSecret > 0.45 || wake > 0.7 ? 1 : nearSecret * 0.9,
      2.6,
      dt
    );

    // SIGNAL — sparse travelling grains on river paths
    if (signalRef.current && !reducedMotion) {
      const pos = signalRef.current.geometry.attributes.position.array;
      const col = signalRef.current.geometry.attributes.color.array;
      for (let i = 0; i < SIGNAL; i++) {
        const riv = rivers[i % rivers.length];
        const u = (time * riv.speed * 0.55 + i / SIGNAL) % 1;
        const p = riv.curve.getPoint(u);
        const i3 = i * 3;
        pos[i3] = p.x;
        pos[i3 + 1] = p.y;
        pos[i3 + 2] = p.z;
        tmpC.current.copy(steel).lerp(dataBlue, 0.12 + riverAwake.current * 0.15);
        col[i3] = tmpC.current.r;
        col[i3 + 1] = tmpC.current.g;
        col[i3 + 2] = tmpC.current.b;
      }
      signalRef.current.geometry.attributes.position.needsUpdate = true;
      signalRef.current.geometry.attributes.color.needsUpdate = true;
      signalRef.current.material.opacity =
        reveal.current * riverAwake.current * 0.55 * (1 - dec * 0.6);
      signalRef.current.material.size = SIZE_SIGNAL;
      signalRef.current.visible = !inPipeline;
    }

    // DATA RIVERS — the extraordinary visual (hundreds of travelling units)
    if (riverRef.current && !reducedMotion) {
      const pos = riverRef.current.geometry.attributes.position.array;
      const col = riverRef.current.geometry.attributes.color.array;
      const per = Math.floor(RIVER / rivers.length);
      let fi = 0;
      rivers.forEach((riv, ri) => {
        for (let k = 0; k < per && fi < RIVER; k++) {
          const i3 = fi * 3;
          if (riverAwake.current < 0.08) {
            pos[i3 + 1] = -99;
          } else {
            const u = (time * riv.speed + k / per + ri * 0.17) % 1;
            const p = riv.curve.getPoint(u);
            pos[i3] = p.x;
            pos[i3 + 1] = p.y;
            pos[i3 + 2] = p.z;
            // Stream / ETL / event personalities via hue restraint
            if (riv.kind === "etl") tmpC.current.copy(steel).lerp(teal, 0.22);
            else if (riv.kind === "event")
              tmpC.current.copy(steel).lerp(accent, 0.12 + secretWake.current * 0.15);
            else tmpC.current.copy(silver).lerp(dataBlue, 0.15);
            col[i3] = tmpC.current.r;
            col[i3 + 1] = tmpC.current.g;
            col[i3 + 2] = tmpC.current.b;
          }
          fi++;
        }
      });
      riverRef.current.geometry.attributes.position.needsUpdate = true;
      riverRef.current.geometry.attributes.color.needsUpdate = true;
      riverRef.current.material.opacity =
        reveal.current * riverAwake.current * (0.35 + secretWake.current * 0.35) * (1 - dec * 0.5);
      riverRef.current.material.size = SIZE_RIVER * (1 + secretWake.current * 0.1);
      riverRef.current.visible = !inPipeline;
    }

    // Hidden circuitry — revealed under the field
    if (circuitRef.current) {
      const pos = circuitRef.current.geometry.attributes.position.array;
      for (let i = 0; i < CIRCUIT; i++) {
        const i3 = i * 3;
        const u = (i / (CIRCUIT - 1) + time * 0.08 * secretWake.current) % 1;
        const p = circuitCurve.getPoint(u);
        pos[i3] = p.x;
        pos[i3 + 1] = p.y;
        pos[i3 + 2] = p.z;
      }
      circuitRef.current.geometry.attributes.position.needsUpdate = true;
      circuitRef.current.material.opacity =
        reveal.current * secretWake.current * 0.85 * (1 - dec * 0.75);
      circuitRef.current.material.size = SIZE_CIRCUIT;
      circuitRef.current.visible = !inPipeline && secretWake.current > 0.05;
    }

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
          opacity={0.88}
          depthWrite={false}
          alphaTest={0.35}
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
          opacity={0.2}
          depthWrite={false}
          alphaTest={0.3}
          toneMapped={false}
        />
      </points>
      <points ref={riverRef} geometry={riverGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={SIZE_RIVER}
          sizeAttenuation={false}
          vertexColors
          transparent
          opacity={0.25}
          depthWrite={false}
          alphaTest={0.3}
          toneMapped={false}
        />
      </points>
      <points ref={circuitRef} geometry={circuitGeom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={SIZE_CIRCUIT}
          sizeAttenuation={false}
          vertexColors
          transparent
          opacity={0}
          depthWrite={false}
          alphaTest={0.3}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
