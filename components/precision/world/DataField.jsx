"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { THEME_PALETTE } from "@/lib/data/precision";
import { EXHIBITION_EXHIBITS } from "@/lib/data/exhibition-exhibits";

const COUNT = 980;

/**
 * Interactive data field — particles are records with velocity and purpose.
 * Quiet by default. Cursor bends nearby streams. Hovered exhibits attract flow.
 */
export default function DataField({ theme, cursorRef, interactionRef }) {
  const points = useRef();
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const energy = useRef(0.22);

  const { positions, velocities, phases, roles, colors, baseColor } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const roles = new Float32Array(COUNT); // 0–2 streams, 3 reject, 4 merge, 5 output
    const colors = new Float32Array(COUNT * 3);
    const base = new THREE.Color(theme === "day" ? "#3a4a5c" : "#8aa0b8");
    const amber = new THREE.Color(p.amber);
    const cyan = new THREE.Color(p.cyan || "#5ec8d8");

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const role =
        i < COUNT * 0.3 ? 0 :
        i < COUNT * 0.55 ? 1 :
        i < COUNT * 0.72 ? 2 :
        i < COUNT * 0.82 ? 3 :
        i < COUNT * 0.92 ? 4 : 5;
      roles[i] = role;
      phases[i] = Math.random();

      const lane =
        role === 0 ? -1.6 + Math.random() * 0.5 :
        role === 1 ? -0.25 + Math.random() * 0.5 :
        role === 2 ? 1.1 + Math.random() * 0.5 :
        role === 5 ? (Math.random() - 0.5) * 0.2 :
        (Math.random() - 0.5) * 2.2;

      positions[i3] = lane;
      positions[i3 + 1] = 0.95 + Math.random() * 1.1;
      positions[i3 + 2] = 12 + Math.random() * 6;

      velocities[i3] = (Math.random() - 0.5) * 0.015;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.008;
      velocities[i3 + 2] = -0.28 - Math.random() * 0.4;

      const c = role === 5 ? amber : role === 3 ? cyan.clone().multiplyScalar(0.55) : base;
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    return { positions, velocities, phases, roles, colors, baseColor: base };
  }, [theme, p.amber, p.cyan]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  useFrame((_, delta) => {
    if (!points.current) return;
    const dt = Math.min(delta, 0.05);
    const ix = interactionRef?.current;
    const hoverSlug = ix?.hoverSlug || null;
    const activeSlug = ix?.activeSlug || null;
    const inside = !!activeSlug;

    const hoverEx = hoverSlug
      ? EXHIBITION_EXHIBITS.find((e) => e.slug === hoverSlug)
      : null;

    const targetEnergy = inside ? 0.35 : hoverEx ? 0.72 : 0.28;
    energy.current = THREE.MathUtils.damp(energy.current, targetEnergy, 2.2, dt);
    const e = energy.current;

    const pos = points.current.geometry.attributes.position.array;
    const col = points.current.geometry.attributes.color.array;
    const cursor = cursorRef?.current;
    const cx = cursor?.x ?? 0;
    const cy = cursor?.y ?? 1.2;
    const cz = cursor?.z ?? 8;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const role = roles[i];
      phases[i] += dt * (0.2 + e * 0.55);

      let x = pos[i3];
      let y = pos[i3 + 1];
      let z = pos[i3 + 2];

      let vx = velocities[i3];
      let vy = velocities[i3 + 1];
      let vz = velocities[i3 + 2] * (0.45 + e * 0.9);

      let targetX =
        role === 0 ? -1.45 :
        role === 1 ? 0 :
        role === 2 ? 1.45 :
        role === 3 ? x + Math.sin(phases[i] * 2.4) * 0.6 :
        role === 5 ? Math.sin(phases[i] * 0.6) * 0.06 :
        Math.sin(phases[i] + role) * 0.4;

      // Merge toward center as streams travel
      if (z < 6 && role < 3) {
        targetX *= Math.max(0.15, (z + 4) / 10);
      }

      // Rejected drift
      if (role === 3) {
        targetX = (x >= 0 ? 1 : -1) * (2.2 + Math.sin(phases[i]) * 0.4);
        vy -= dt * 0.25;
      }

      // Attract toward hovered exhibit — data discovers the installation
      if (hoverEx && role < 5) {
        const hx = hoverEx.position[0];
        const hy = hoverEx.position[1] + 1.4;
        const hz = hoverEx.position[2];
        const dx = hx - x;
        const dy = hy - y;
        const dz = hz - z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        if (d < 9) {
          const pull = (1 - d / 9) * 0.055;
          vx += (dx / d) * pull;
          vy += (dy / d) * pull * 0.45;
          vz += (dz / d) * pull * 0.35;
        }
      }

      // Cursor influence — bend / separate
      const dx = x - cx;
      const dy = y - cy;
      const dz = z - cz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 2.2 && dist > 0.01) {
        const force = (1 - dist / 2.2) * 0.055;
        vx += (dx / dist) * force;
        vy += (dy / dist) * force * 0.45;
        vz += (dz / dist) * force * 0.2;
      }

      x += (targetX - x) * Math.min(1, dt * 1.35) + vx;
      y += vy * dt * 7;
      z += vz * (0.92 + Math.sin(phases[i]) * 0.06);

      const pathY = role === 5 ? 1.32 : 1.05 + Math.sin(phases[i] + role) * 0.22;
      y += (pathY - y) * dt * 1.15;

      if (z < -10 || (role === 3 && y < 0.15)) {
        z = 12 + Math.random() * 5;
        x =
          role === 0 ? -1.6 + Math.random() * 0.45 :
          role === 1 ? -0.2 + Math.random() * 0.4 :
          role === 2 ? 1.2 + Math.random() * 0.45 :
          (Math.random() - 0.5) * 2.5;
        y = 0.95 + Math.random() * 1.0;
        vy = 0;
      }

      // Dim world streams while inside an exhibit
      const dim = inside ? 0.28 : 1;

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;

      const a = Math.min(1, (0.35 + e * 0.9) * dim);
      if (role === 5) {
        col[i3] = 0.88 * a;
        col[i3 + 1] = 0.62 * a;
        col[i3 + 2] = 0.2 * a;
      } else if (role === 3) {
        col[i3] = 0.35 * a;
        col[i3 + 1] = 0.7 * a;
        col[i3 + 2] = 0.78 * a;
      } else {
        col[i3] = baseColor.r * a;
        col[i3 + 1] = baseColor.g * a;
        col[i3 + 2] = baseColor.b * a;
      }
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.geometry.attributes.color.needsUpdate = true;
    points.current.material.opacity = theme === "day" ? 0.68 : 0.82;

    if (interactionRef?.current) {
      interactionRef.current.energy = e;
    }
  });

  return (
    <points ref={points} geometry={geom} frustumCulled={false}>
      <pointsMaterial
        size={theme === "day" ? 0.032 : 0.038}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.62}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
