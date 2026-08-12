"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { THEME, damp } from "@/lib/data/instrument";

function countFor(width, reduced) {
  if (reduced) return 700;
  if (width < 768) return 900;
  if (width < 1100) return 1400;
  return 2000;
}

function h(i, s = 1) {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function circleTex() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.5, "rgba(255,255,255,0.7)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

/**
 * Living data lattice — computational material, not decoration.
 * Roles: stream / lattice / route / reject
 */
export default function DataLattice({
  themeId,
  cursorRef,
  stateRef,
  reducedMotion = false,
}) {
  const points = useRef();
  const routes = useRef();
  const reveal = useRef(0);
  const pulse = useRef(0);
  const t = THEME[themeId] || THEME.night;
  const size = useThree((s) => s.size);
  const map = useMemo(() => circleTex(), []);

  const N = useMemo(
    () => countFor(size.width, reducedMotion),
    [size.width, reducedMotion]
  );

  const sim = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const base = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    const phase = new Float32Array(N);
    const role = new Uint8Array(N);
    const col = new Float32Array(N * 3);

    const cStream = new THREE.Color(t.data);
    const cAccent = new THREE.Color(t.accent);
    const cSteel = new THREE.Color(t.steel);
    const cMute = cSteel.clone().multiplyScalar(themeId === "day" ? 0.55 : 0.45);

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      const r = h(i, 2);
      const roleId = r < 0.62 ? 0 : r < 0.74 ? 1 : r < 0.9 ? 2 : r < 0.96 ? 3 : 4;
      role[i] = roleId;
      phase[i] = h(i, 3) * Math.PI * 2;

      let x;
      let y;
      let z;
      if (roleId === 0) {
        // Tight flow channels — information in lanes
        const lane = Math.floor(h(i, 4) * 3) - 1;
        x = lane * 1.15 + (h(i, 5) - 0.5) * 0.18;
        y = (h(i, 6) - 0.5) * 0.22;
        z = 5.5 - h(i, 7) * 12;
      } else if (roleId === 1) {
        // Very sparse structural markers
        x = (Math.floor(h(i, 8) * 5) - 2) * 1.4;
        y = (Math.floor(h(i, 9) * 2) - 0.5) * 0.35;
        z = (Math.floor(h(i, 10) * 6) - 1) * 1.6;
      } else if (roleId === 2) {
        x = (h(i, 11) - 0.5) * 0.22;
        y = (h(i, 12) - 0.5) * 0.12;
        z = 5 - h(i, 13) * 11;
      } else if (roleId === 3) {
        x = (h(i, 14) > 0.5 ? 1 : -1) * (2.0 + h(i, 15) * 0.8);
        y = -0.15 + h(i, 16) * 0.35;
        z = 2.5 - h(i, 17) * 7;
      } else {
        x = (h(i, 18) - 0.5) * 0.1;
        y = 0;
        z = 4 - h(i, 19) * 9;
      }

      z = Math.min(z, 5.8);
      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
      base[i3] = x;
      base[i3 + 1] = y;
      base[i3 + 2] = z;
      vel[i3] = vel[i3 + 1] = vel[i3 + 2] = 0;

      const c =
        roleId === 4 || roleId === 2
          ? cAccent
          : roleId === 3
            ? cMute
            : roleId === 1
              ? cSteel
              : cStream;
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;
    }

    // Structural routes — faint always, stronger on reveal
    const segs = [];
    const push = (a, b) => segs.push(...a, ...b);
    for (let s = 0; s < 14; s++) {
      const t0 = s / 14;
      const t1 = (s + 1) / 14;
      const z0 = 5.5 - t0 * 12;
      const z1 = 5.5 - t1 * 12;
      const w0 = Math.max(0.08, 1 - t0 * 0.9);
      const w1 = Math.max(0.08, 1 - t1 * 0.9);
      push([-1.35 * w0, 0.05, z0], [-1.35 * w1, 0.05, z1]);
      push([0, 0.08, z0], [0, 0.08, z1]);
      push([1.35 * w0, 0.05, z0], [1.35 * w1, 0.05, z1]);
    }
    push([-0.4, 0.08, 0.6], [0, 0.1, -0.2]);
    push([0.4, 0.08, 0.6], [0, 0.1, -0.2]);
    for (let s = 0; s < 8; s++) {
      const t0 = s / 8;
      const t1 = (s + 1) / 8;
      push([0, 0.1, -0.2 - t0 * 6], [0, 0.08, -0.2 - t1 * 6]);
    }

    const routePos = new Float32Array(segs);
    const routeCol = new Float32Array(segs.length);
    const rc = new THREE.Color(t.accent);
    for (let i = 0; i < segs.length; i += 3) {
      routeCol[i] = rc.r;
      routeCol[i + 1] = rc.g;
      routeCol[i + 2] = rc.b;
    }

    return { pos, base, vel, phase, role, col, routePos, routeCol };
  }, [N, themeId, t.accent, t.data, t.steel]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(sim.pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(sim.col, 3));
    return g;
  }, [sim]);

  const routeGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(sim.routePos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(sim.routeCol, 3));
    return g;
  }, [sim]);

  useEffect(
    () => () => {
      map.dispose();
      geom.dispose();
      routeGeom.dispose();
    },
    [map, geom, routeGeom]
  );

  useFrame((_, delta) => {
    if (!points.current) return;
    const dt = Math.min(delta, 0.045);
    const st = stateRef?.current;
    const view = st?.view || "home";
    const hover = st?.hoverSlug;
    const active = st?.activeSlug;
    const scroll = st?.scroll || 0;

    const cursor = cursorRef?.current;
    const cx = cursor?.x ?? 0;
    const cy = cursor?.y ?? 0;
    const cz = cursor?.z ?? 2;
    const activeCursor = !!cursor?.active;
    const spd = Math.hypot(cursor?.vx || 0, cursor?.vy || 0, cursor?.vz || 0);

    // Reveal charge — quiet until cursor travels the field
    const inField =
      activeCursor &&
      Math.abs(cx) < 2.8 &&
      Math.abs(cy) < 1.2 &&
      cz < 5.5 &&
      cz > -4;
    const charge = inField
      ? Math.min(1, reveal.current + dt * (0.1 + Math.min(spd, 3) * 0.025))
      : Math.max(0, reveal.current - dt * 0.22);
    reveal.current = charge;
    pulse.current = damp(pulse.current, st?.travelPulse || 0, 2.2, dt);
    if (st) {
      st.reveal = reveal.current;
      if (st.travelPulse > 0) st.travelPulse = Math.max(0, st.travelPulse - dt * 0.6);
    }

    const rv = view === "home" ? reveal.current : Math.min(0.35, reveal.current);
    const motion = reducedMotion ? 0.3 : 1;
    const pos = points.current.geometry.attributes.position.array;
    const col = points.current.geometry.attributes.color.array;
    const { base, vel, phase, role } = sim;

    const dim = active ? 0.22 : 1;
    const day = themeId === "day";

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      const r = role[i];
      phase[i] += dt * (0.25 + rv * 0.4) * motion;

      let x = pos[i3];
      let y = pos[i3 + 1];
      let z = pos[i3 + 2];
      let vx = vel[i3];
      let vy = vel[i3 + 1];
      let vz = vel[i3 + 2];

      let tx = base[i3];
      let ty = base[i3 + 1];

      if (r === 0) {
        const taper = Math.max(0.12, (z + 5) / 12);
        tx = base[i3] * taper;
        ty = Math.sin(phase[i]) * 0.08;
        if (rv > 0.2) {
          const lane = Math.sign(base[i3] || 0.001) * 1.35 * taper;
          tx = THREE.MathUtils.lerp(tx, lane === 0 ? 0 : lane, rv * 0.8);
        }
      } else if (r === 1) {
        tx = base[i3] + Math.sin(phase[i] * 0.4) * 0.06;
        ty = base[i3 + 1] + Math.cos(phase[i] * 0.5) * 0.04;
      } else if (r === 2 || r === 4) {
        tx = THREE.MathUtils.lerp(base[i3], 0, rv);
        ty = Math.sin(phase[i] * 0.5) * 0.04;
      } else if (r === 3) {
        tx = (x >= 0 ? 1 : -1) * (2.3 + Math.sin(phase[i]) * 0.4);
        ty = -0.15 + Math.sin(phase[i] * 1.2) * 0.12;
      }

      // View morphs
      if (view === "work") {
        tx = THREE.MathUtils.lerp(tx, base[i3] * 1.35, 0.12 + pulse.current * 0.15);
        ty = THREE.MathUtils.lerp(ty, base[i3 + 1] * 0.6 + 0.2, 0.1);
      } else if (view === "experience") {
        tx = THREE.MathUtils.lerp(tx, (h(i, 40) - 0.5) * 4.2, 0.08);
        ty = THREE.MathUtils.lerp(ty, -0.4 + h(i, 41) * 1.2, 0.07);
      } else if (view === "about" || view === "contact") {
        tx = THREE.MathUtils.lerp(tx, 0, 0.06);
        ty = THREE.MathUtils.lerp(ty, 0, 0.06);
        vz -= 0.01;
      } else if (view === "home" && scroll > 0.05) {
        // Scroll gently tightens structure
        tx *= 1 - scroll * 0.25;
      }

      if (hover && r < 3) {
        // Soft attraction toward hovered project (encoded in state)
        const hx = st?.hoverX ?? 0;
        const hz = st?.hoverZ ?? 0;
        const dx = hx - x;
        const dz = hz - z;
        const d = Math.hypot(dx, dz) || 1;
        if (d < 4) {
          const f = (1 - d / 4) * 0.04;
          vx += (dx / d) * f;
          vz += (dz / d) * f;
        }
      }

      if (activeCursor && !reducedMotion) {
        const dx = x - cx;
        const dy = y - cy;
        const dz = z - cz;
        const d = Math.hypot(dx, dy, dz);
        if (d < 2.4 && d > 0.02) {
          const f = Math.pow(1 - d / 2.4, 2);
          vx += (dx / d) * f * 0.05;
          vy += (dy / d) * f * 0.035;
          vz += (dz / d) * f * 0.03;
          vx += (-dz / d) * f * 0.028;
          vz += (dx / d) * f * 0.028;
        }
      }

      vx *= 0.9;
      vy *= 0.9;
      x += (tx - x) * Math.min(1, dt * 1.5) + vx * motion;
      y += (ty - y) * Math.min(1, dt * 1.5) + vy * motion;

      let sz =
        r === 1
          ? Math.sin(phase[i]) * 0.03
          : r === 3
            ? -0.12
            : -0.28 - (r === 4 ? 0.2 : 0);
      sz *= 1 + rv * 0.55 + pulse.current * 0.4;
      z += (sz + vz) * motion * (0.95 + Math.sin(phase[i]) * 0.05);

      if (z < -8 || (r === 3 && y < -0.6)) {
        z = 5.4 + h(i, 50) * 0.4;
        x = base[i3];
        y = base[i3 + 1];
        vx = vy = vz = 0;
      }

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
      vel[i3] = vx;
      vel[i3 + 1] = vy;
      vel[i3 + 2] = vz;

      const a = Math.min(1, (0.35 + rv * 0.55) * dim);
      if (r === 2 || r === 4) {
        const g = r === 2 && rv < 0.15 ? 0.12 : 0.55 + rv * 0.45;
        col[i3] = (day ? 0.72 : 0.9) * a * g;
        col[i3 + 1] = (day ? 0.5 : 0.66) * a * g;
        col[i3 + 2] = (day ? 0.16 : 0.28) * a * g;
      } else if (r === 3) {
        col[i3] = 0.35 * a;
        col[i3 + 1] = 0.45 * a;
        col[i3 + 2] = 0.5 * a;
      } else if (r === 1) {
        col[i3] = (day ? 0.18 : 0.45) * a;
        col[i3 + 1] = (day ? 0.24 : 0.52) * a;
        col[i3 + 2] = (day ? 0.3 : 0.6) * a;
      } else {
        col[i3] = (day ? 0.14 : 0.42) * a * (1 + rv * 0.25);
        col[i3 + 1] = (day ? 0.28 : 0.52) * a * (1 + rv * 0.25);
        col[i3 + 2] = (day ? 0.36 : 0.62) * a * (1 + rv * 0.25);
      }
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.geometry.attributes.color.needsUpdate = true;
    points.current.material.opacity = day ? 0.9 : 0.88;
    points.current.material.size = (day ? 0.058 : 0.052) * (1 + rv * 0.08);

    if (routes.current) {
      const baseOp = day ? 0.1 : 0.14;
      routes.current.material.opacity =
        baseOp + Math.max(0, rv - 0.1) * (day ? 0.45 : 0.65);
    }
  });

  return (
    <group>
      <points ref={points} geometry={geom} frustumCulled={false}>
        <pointsMaterial
          map={map}
          size={0.052}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          alphaTest={0.02}
        />
      </points>
      <lineSegments ref={routes} geometry={routeGeom} frustumCulled={false}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
