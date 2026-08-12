"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { THEME_PALETTE } from "@/lib/data/precision";
import { EXHIBITION_EXHIBITS } from "@/lib/data/exhibition-exhibits";

/**
 * Roles — information behaving inside a system (not decoration):
 * 0–2  source clusters / ingest streams
 * 3    quality rejects (deflected)
 * 4    transform conduits
 * 5    refined output
 * 6    structural lattice (sparse, intentional)
 * 7    hidden route seeds — awaken on cursor reveal
 */

function pickCount(reducedMotion) {
  if (typeof window === "undefined") return 2000;
  if (reducedMotion) return 900;
  const w = window.innerWidth || 1200;
  if (w < 768) return 1000;
  if (w < 1100) return 1500;
  return 2200;
}

function hash01(i, salt = 1) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function makeCircleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Living data field — one GPU Points buffer + reveal LineSegments.
 * Cursor influence is subtle; sustained motion reveals a hidden route.
 */
export default function DataField({
  theme,
  cursorRef,
  interactionRef,
  reducedMotion = false,
}) {
  const points = useRef();
  const routes = useRef();
  const energy = useRef(0.22);
  const reveal = useRef(0);
  const pathCharge = useRef(0);
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const size = useThree((s) => s.size);

  const COUNT = useMemo(
    () => pickCount(reducedMotion || size.width < 768),
    [reducedMotion, size.width]
  );

  const circleMap = useMemo(() => makeCircleTexture(), []);

  const sim = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const base = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const roles = new Uint8Array(COUNT);
    const lanes = new Float32Array(COUNT);
    const colors = new Float32Array(COUNT * 3);

    const baseCol = new THREE.Color(theme === "day" ? "#1e2a36" : "#7d97b3");
    const amber = new THREE.Color(p.amber);
    const cyan = new THREE.Color(p.cyan || "#5ec8d8");
    const steel = new THREE.Color(theme === "day" ? "#2a3a4c" : "#98aec4");
    const route = new THREE.Color(theme === "day" ? "#8a5a12" : "#e0a83a");

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const r = hash01(i, 2);
      let role;
      // Bias toward stream structure; sparse lattice
      if (r < 0.24) role = 0;
      else if (r < 0.48) role = 1;
      else if (r < 0.68) role = 2;
      else if (r < 0.78) role = 3;
      else if (r < 0.88) role = 4;
      else if (r < 0.95) role = 5;
      else if (r < 0.98) role = 6;
      else role = 7;

      roles[i] = role;
      phases[i] = hash01(i, 3) * Math.PI * 2;
      lanes[i] = hash01(i, 4);

      const streamX = role === 0 ? -2.15 : role === 1 ? 0 : role === 2 ? 2.15 : 0;
      let x;
      let y;
      let z;

      if (role < 3) {
        // Tight corridor tubes — records in lanes
        x = streamX + (hash01(i, 5) - 0.5) * 0.42;
        y = 0.95 + hash01(i, 6) * 0.55;
        z = 12.5 - hash01(i, 7) * 26;
      } else if (role === 3) {
        x = (hash01(i, 8) > 0.5 ? 1 : -1) * (2.7 + hash01(i, 9) * 1.1);
        y = 0.4 + hash01(i, 10) * 0.7;
        z = 8 - hash01(i, 11) * 14;
      } else if (role === 4) {
        x = (hash01(i, 12) - 0.5) * 0.7;
        y = 1.05 + hash01(i, 22) * 0.35;
        z = 6 - hash01(i, 13) * 12;
      } else if (role === 5) {
        x = (hash01(i, 14) - 0.5) * 0.18;
        y = 1.2 + hash01(i, 15) * 0.22;
        z = 0.5 - hash01(i, 16) * 13;
      } else if (role === 6) {
        const gx = Math.floor(hash01(i, 17) * 5) - 2;
        const gz = Math.floor(hash01(i, 18) * 6);
        x = gx * 2.1;
        y = 0.55 + (hash01(i, 19) > 0.5 ? 1.1 : 0);
        z = 10 - gz * 3.5;
      } else {
        const t = hash01(i, 20);
        x = (hash01(i, 21) - 0.5) * 0.5;
        y = 1.22;
        z = 10 - t * 20;
      }

      // Keep particles off the near camera plane (avoids giant billboards)
      z = Math.min(z, 12.2);

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      base[i3] = x;
      base[i3 + 1] = y;
      base[i3 + 2] = z;
      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = role === 6 ? 0 : -0.32 - hash01(i, 23) * 0.38;

      let c = baseCol;
      if (role === 5 || role === 7) c = amber;
      else if (role === 3) c = cyan;
      else if (role === 4) c = steel;
      else if (role === 6) c = steel.clone().multiplyScalar(0.55);

      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    // Revealed architecture — polyline along the convergence spine + branches
    const routePts = [];
    const pushSeg = (a, b) => {
      routePts.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    };
    // Three ingest → nexus
    for (let s = 0; s < 12; s++) {
      const t0 = s / 12;
      const t1 = (s + 1) / 12;
      const z0 = 11 - t0 * 11;
      const z1 = 11 - t1 * 11;
      const taper0 = Math.max(0.08, 1 - t0 * 0.92);
      const taper1 = Math.max(0.08, 1 - t1 * 0.92);
      pushSeg([-2.2 * taper0, 1.15, z0], [-2.2 * taper1, 1.18, z1]);
      pushSeg([0, 1.2, z0], [0, 1.25, z1]);
      pushSeg([2.2 * taper0, 1.15, z0], [2.2 * taper1, 1.18, z1]);
    }
    // Branches into nexus
    pushSeg([-0.35, 1.25, 1.2], [0, 1.32, 0.2]);
    pushSeg([0.35, 1.25, 1.2], [0, 1.32, 0.2]);
    pushSeg([0, 1.28, 1.6], [0, 1.32, 0.2]);
    // Output spine
    for (let s = 0; s < 10; s++) {
      const t0 = s / 10;
      const t1 = (s + 1) / 10;
      pushSeg(
        [0, 1.32, 0.1 - t0 * 12],
        [0, 1.3 + Math.sin(t1 * 2) * 0.02, 0.1 - t1 * 12]
      );
    }
    // Side quality rejection arcs
    pushSeg([0.4, 1.2, 4.5], [2.8, 0.7, 3.2]);
    pushSeg([-0.4, 1.2, 4.5], [-2.8, 0.7, 3.2]);

    const routePositions = new Float32Array(routePts);
    const routeColors = new Float32Array(routePts.length);
    for (let i = 0; i < routePts.length; i += 3) {
      routeColors[i] = route.r;
      routeColors[i + 1] = route.g;
      routeColors[i + 2] = route.b;
    }

    return {
      positions,
      base,
      velocities,
      phases,
      roles,
      lanes,
      colors,
      routePositions,
      routeColors,
    };
  }, [COUNT, theme, p.amber, p.cyan]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(sim.positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(sim.colors, 3));
    return g;
  }, [sim]);

  const routeGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(sim.routePositions, 3)
    );
    g.setAttribute("color", new THREE.BufferAttribute(sim.routeColors, 3));
    return g;
  }, [sim]);

  useFrame((_, delta) => {
    if (!points.current) return;
    const dt = Math.min(delta, 0.045);
    const ix = interactionRef?.current;
    const inside = !!ix?.activeSlug;
    const viewId = ix?.viewId || "home";
    const travelPulse = ix?.travelPulse ?? 0;
    if (ix && travelPulse > 0) {
      ix.travelPulse = Math.max(0, travelPulse - dt * 0.55);
    }

    const cursor = cursorRef?.current;
    const cx = cursor?.x ?? 0;
    const cy = cursor?.y ?? 1.25;
    const cz = cursor?.z ?? 10;
    const cvx = cursor?.vx ?? 0;
    const cvy = cursor?.vy ?? 0;
    const cvz = cursor?.vz ?? 0;
    const cursorActive = cursor?.active ?? false;
    const cursorSpeed = Math.sqrt(cvx * cvx + cvy * cvy + cvz * cvz);

    // Signature charge: move through the mid-field to awaken the hidden route
    const inCorridor =
      cursorActive &&
      Math.abs(cx) < 3.2 &&
      cy > 0.4 &&
      cy < 2.4 &&
      cz < 11 &&
      cz > -8;
    // Discoverable, not automatic — sustained travel through the field
    const chargeTarget = inCorridor
      ? Math.min(1, pathCharge.current + dt * (0.12 + Math.min(cursorSpeed, 4) * 0.03))
      : Math.max(0, pathCharge.current - dt * 0.28);
    pathCharge.current = chargeTarget;
    reveal.current = THREE.MathUtils.damp(
      reveal.current,
      inside ? 0.15 : pathCharge.current,
      2.2,
      dt
    );
    const rv = reveal.current;

    const targetEnergy = inside ? 0.3 : 0.22 + rv * 0.55 + (cursorActive ? 0.08 : 0);
    energy.current = THREE.MathUtils.damp(energy.current, targetEnergy, 2.4, dt);
    const e = energy.current;

    const pos = points.current.geometry.attributes.position.array;
    const col = points.current.geometry.attributes.color.array;
    const { base, velocities, phases, roles, lanes } = sim;

    const baseR = theme === "day" ? 0.12 : 0.49;
    const baseG = theme === "day" ? 0.18 : 0.59;
    const baseB = theme === "day" ? 0.26 : 0.72;
    const motionScale = reducedMotion ? 0.35 : 1;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const role = roles[i];
      phases[i] += dt * (0.28 + e * 0.55) * motionScale;

      let x = pos[i3];
      let y = pos[i3 + 1];
      let z = pos[i3 + 2];
      let vx = velocities[i3];
      let vy = velocities[i3 + 1];
      let vz = velocities[i3 + 2];

      let targetX = base[i3];
      let targetY = base[i3 + 1];

      if (role < 3) {
        // Streams converge toward the processing spine as Z advances
        const taper = Math.max(0.1, (z + 6) / 18);
        targetX = base[i3] * taper;
        targetY = 1.05 + Math.sin(phases[i] + role) * 0.14;
        // Reveal tightens streams into clear corridors
        if (rv > 0.2) {
          const laneX = (role - 1) * 2.15 * taper;
          targetX = THREE.MathUtils.lerp(targetX, laneX, rv * 0.85);
        }
      } else if (role === 3) {
        targetX = (x >= 0 ? 1 : -1) * (2.9 + Math.sin(phases[i] * 1.4) * 0.7);
        targetY = 0.35 + Math.sin(phases[i]) * 0.25;
        vy -= dt * 0.3;
      } else if (role === 4) {
        targetX = Math.sin(phases[i] * 0.75) * (0.55 - rv * 0.35);
        targetY = 1.18 + Math.cos(phases[i] * 0.45) * 0.1;
      } else if (role === 5) {
        targetX = Math.sin(phases[i] * 0.35) * 0.06;
        targetY = 1.28 + Math.sin(phases[i] * 0.7) * 0.04;
      } else if (role === 6) {
        targetX = base[i3] + Math.sin(phases[i] * 0.4) * 0.12;
        targetY = base[i3 + 1] + Math.cos(phases[i] * 0.55) * 0.08;
      } else if (role === 7) {
        // Hidden route particles — dormant until reveal
        const t = lanes[i];
        targetX = Math.sin(t * Math.PI * 2 + phases[i] * 0.05) * (0.05 + (1 - rv) * 0.4);
        targetY = 1.24 + Math.sin(phases[i] * 0.6) * 0.03;
        // Pull onto the spine as reveal grows
        targetX = THREE.MathUtils.lerp(targetX, 0, rv);
      }

      // Destination reorganization — field reshapes with navigation
      if (viewId === "work" && role < 6) {
        const ex = EXHIBITION_EXHIBITS[i % EXHIBITION_EXHIBITS.length];
        if (ex) {
          const pull = 0.02 + travelPulse * 0.06;
          targetX = THREE.MathUtils.lerp(targetX, ex.position[0], pull * 4);
          targetY = THREE.MathUtils.lerp(targetY, ex.position[1] + 1.2, pull * 3);
        }
      } else if (viewId === "ai-lab" && role < 5) {
        // Branching field — questions fan outward
        const branch = (lanes[i] - 0.5) * 3.2;
        targetX = THREE.MathUtils.lerp(targetX, branch, 0.08 + travelPulse * 0.12);
        targetY = THREE.MathUtils.lerp(targetY, 1.4 + Math.abs(branch) * 0.08, 0.06);
      } else if (viewId === "experience" && role !== 6) {
        // Progressive density along career axis
        targetX = THREE.MathUtils.lerp(targetX, (lanes[i] - 0.5) * 4.5, 0.07);
        targetY = THREE.MathUtils.lerp(targetY, 0.9 + lanes[i] * 1.1, 0.05);
      }

      // Travel pulse accelerates flow along the spine
      if (travelPulse > 0.05 && role < 6) {
        vz -= travelPulse * 0.08;
        targetX *= 1 - travelPulse * 0.25;
      }

      // Cursor field — soft bend / repulsion, no glow
      if (cursorActive && !reducedMotion) {
        const dx = x - cx;
        const dy = y - cy;
        const dz = z - cz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const radius = 2.8;
        if (dist < radius && dist > 0.02) {
          const factor = Math.pow(1 - dist / radius, 2);
          const push = factor * 0.055;
          vx += (dx / dist) * push;
          vy += (dy / dist) * push * 0.4;
          vz += (dz / dist) * push * 0.25;
          // Tangential routing — data bends around the cursor
          const swirl = factor * 0.032;
          vx += (-dz / dist) * swirl;
          vz += (dx / dist) * swirl;
          if (cursorSpeed > 0.08) {
            vx += cvx * factor * 0.02;
            vy += cvy * factor * 0.012;
            vz += cvz * factor * 0.016;
          }
          // Signature: nearby role-7 / stream particles get drawn into a temporary path
          if (rv > 0.35 && (role < 3 || role === 7)) {
            const pull = factor * rv * 0.04;
            vx -= (dx / dist) * pull * 0.6;
            vz -= (dz / dist) * pull * 0.35;
            targetX = THREE.MathUtils.lerp(targetX, cx * 0.15, factor * rv * 0.25);
          }
        }
      }

      vx *= 0.9;
      vy *= 0.9;

      x += (targetX - x) * Math.min(1, dt * 1.45) + vx * motionScale;
      y += vy * dt * 7 * motionScale;

      let speedZ =
        role === 6
          ? Math.sin(phases[i]) * 0.04
          : role === 7
            ? -0.2 - rv * 0.45
            : -0.36 - (role === 5 ? 0.32 : 0);
      // Reveal accelerates refined flow
      speedZ *= 1 + e * 0.7 + rv * 0.45;
      z += (speedZ + vz) * (0.94 + Math.sin(phases[i]) * 0.06) * motionScale;

      if (z < -16 || (role === 3 && y < 0.08)) {
        z = 11.5 + hash01(i, 30) * 0.6;
        x = base[i3] + (hash01(i, 31) - 0.5) * 0.35;
        y = base[i3 + 1];
        vx = 0;
        vy = 0;
      }

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
      velocities[i3] = vx;
      velocities[i3 + 1] = vy;
      velocities[i3 + 2] = vz;

      const dim = inside ? 0.26 : 1;
      const alpha = Math.min(1, (0.38 + e * 0.8) * dim);

      if (role === 5 || (role === 7 && rv > 0.25)) {
        const glow = role === 7 ? 0.55 + rv * 0.45 : 1;
        col[i3] = 0.92 * alpha * glow;
        col[i3 + 1] = 0.68 * alpha * glow;
        col[i3 + 2] = 0.22 * alpha * glow;
      } else if (role === 3) {
        col[i3] = 0.28 * alpha;
        col[i3 + 1] = 0.7 * alpha;
        col[i3 + 2] = 0.8 * alpha;
      } else if (role === 4) {
        col[i3] = (baseR + 0.12) * alpha;
        col[i3 + 1] = (baseG + 0.15) * alpha;
        col[i3 + 2] = (baseB + 0.2) * alpha;
      } else if (role === 6) {
        col[i3] = baseR * 0.55 * alpha;
        col[i3 + 1] = baseG * 0.55 * alpha;
        col[i3 + 2] = baseB * 0.55 * alpha;
      } else {
        // Stream particles brighten as corridors lock in
        const lock = 1 + rv * 0.35;
        col[i3] = baseR * alpha * lock;
        col[i3 + 1] = baseG * alpha * lock;
        col[i3 + 2] = baseB * alpha * lock;
      }

      // Hide dormant route seeds until reveal begins
      if (role === 7 && rv < 0.12) {
        col[i3] *= 0.15;
        col[i3 + 1] *= 0.15;
        col[i3 + 2] *= 0.15;
      }
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.geometry.attributes.color.needsUpdate = true;
    points.current.material.opacity = theme === "day" ? 0.92 : 0.9;
    points.current.material.size =
      (theme === "day" ? 0.068 : 0.062) * (1 + rv * 0.08);

    if (routes.current) {
      // Structure always faintly present; cursor travel unlocks full route
      const baseOp = theme === "day" ? 0.12 : 0.18;
      const revealOp = Math.max(0, (rv - 0.12) * 1.05) * (theme === "day" ? 0.5 : 0.75);
      routes.current.visible = true;
      routes.current.material.opacity = baseOp + revealOp;
      routes.current.material.blending =
        rv > 0.35 ? THREE.AdditiveBlending : THREE.NormalBlending;
    }

    if (ix) {
      ix.energy = e;
      ix.reveal = rv;
    }
  });

  return (
    <group>
      <points ref={points} geometry={geom} frustumCulled={false}>
        <pointsMaterial
          map={circleMap}
          size={theme === "day" ? 0.055 : 0.062}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.NormalBlending}
          alphaTest={0.02}
        />
      </points>

      <lineSegments ref={routes} geometry={routeGeom} frustumCulled={false}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </lineSegments>
    </group>
  );
}
