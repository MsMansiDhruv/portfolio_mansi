"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { smoothstep, THEME_PALETTE } from "@/lib/data/precision";

const COUNT = 2400;

/**
 * Living data field — every point is a datum with velocity and purpose.
 * Quiet at enter → streams join → branch → converge → singular output.
 * Cursor subtly bends nearby particles.
 */
export default function DataField({
  progressRef,
  theme,
  cursorRef,
  activeSlug,
}) {
  const points = useRef();
  const { camera } = useThree();
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;

  const { positions, velocities, phases, roles, colors, baseColor } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const roles = new Float32Array(COUNT); // 0 streamA, 1 streamB, 2 streamC, 3 reject, 4 converge, 5 output
    const colors = new Float32Array(COUNT * 3);
    const base = new THREE.Color(theme === "day" ? "#3a4a5c" : "#8aa0b8");
    const amber = new THREE.Color(p.amber);
    const cyan = new THREE.Color(p.cyan || "#5ec8d8");

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const role = i < COUNT * 0.28 ? 0 : i < COUNT * 0.5 ? 1 : i < COUNT * 0.68 ? 2 : i < COUNT * 0.78 ? 3 : i < COUNT * 0.9 ? 4 : 5;
      roles[i] = role;
      phases[i] = Math.random();

      // Spawn far ahead (+Z), travel toward convergence (0) then output (−Z)
      const lane =
        role === 0 ? -1.8 + Math.random() * 0.6 :
        role === 1 ? -0.3 + Math.random() * 0.6 :
        role === 2 ? 1.2 + Math.random() * 0.6 :
        role === 3 ? (Math.random() - 0.5) * 4 :
        role === 5 ? (Math.random() - 0.5) * 0.25 :
        (Math.random() - 0.5) * 1.2;

      positions[i3] = lane;
      positions[i3 + 1] = 0.9 + Math.random() * 1.4;
      positions[i3 + 2] = 18 + Math.random() * 8;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = -0.35 - Math.random() * 0.55;

      const c = role === 5 ? amber : role === 3 ? cyan.clone().multiplyScalar(0.55) : role >= 4 ? amber : base;
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
    const g = progressRef.current || 0;
    const pos = points.current.geometry.attributes.position.array;
    const col = points.current.geometry.attributes.color.array;

    // Awaken: quiet → stream → join → branch → converge → output
    const awakeA = smoothstep(0.08, 0.2, g);
    const awakeB = smoothstep(0.16, 0.3, g);
    const awakeC = smoothstep(0.24, 0.38, g);
    const chaos = smoothstep(0.34, 0.48, g);
    const converge = smoothstep(0.46, 0.58, g);
    const clarified = smoothstep(0.54, 0.62, g);
    const output = smoothstep(0.58, 0.72, g);
    const work = smoothstep(0.68, 0.85, g);

    // Hold during clarity — reduce motion
    const hold = converge * (1 - output * 0.85);
    const speedScale = (0.15 + awakeA * 0.85) * (1 - hold * 0.72) * (activeSlug ? 0.35 : 1);

    const cursor = cursorRef?.current;
    const cx = cursor?.x ?? 0;
    const cy = cursor?.y ?? 1.2;
    const cz = cursor?.z ?? 10;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const role = roles[i];
      let alive =
        role === 0 ? awakeA :
        role === 1 ? awakeB :
        role === 2 ? awakeC :
        role === 3 ? chaos * 0.7 :
        role === 4 ? converge :
        output;

      if (alive < 0.02) {
        // Park quietly off-volume when dormant
        if (pos[i3 + 2] < 22) {
          pos[i3 + 2] = 22 + Math.random() * 4;
        }
        continue;
      }

      phases[i] += dt * (0.15 + speedScale * 0.4);
      let x = pos[i3];
      let y = pos[i3 + 1];
      let z = pos[i3 + 2];

      let vx = velocities[i3];
      let vy = velocities[i3 + 1];
      let vz = velocities[i3 + 2] * speedScale;

      // Target lanes by role / world phase
      let targetX =
        role === 0 ? -1.6 :
        role === 1 ? 0 :
        role === 2 ? 1.6 :
        role === 3 ? x + Math.sin(phases[i] * 3) * 0.8 :
        role === 5 ? Math.sin(phases[i] * 0.7) * 0.08 :
        0;

      if (chaos > 0.1 && role < 3) {
        targetX += Math.sin(phases[i] * 2.2 + role) * chaos * 1.4;
      }
      if (converge > 0.05 && role < 4) {
        targetX = THREE.MathUtils.lerp(targetX, 0, converge);
      }
      if (role === 3 && chaos > 0.2) {
        // Rejected data drifts outward / falls
        targetX = (x > 0 ? 1 : -1) * (2.8 + Math.random());
        vy -= dt * 0.35;
      }
      if (role === 5 || (clarified > 0.5 && role === 4)) {
        targetX *= 1 - clarified;
        vz = -0.55 * speedScale * (0.4 + output);
      }

      // Soft cursor influence — expensive, subtle
      const dx = x - cx;
      const dy = y - cy;
      const dz = z - cz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 2.4 && dist > 0.01) {
        const force = (1 - dist / 2.4) * 0.045;
        vx += (dx / dist) * force;
        vy += (dy / dist) * force * 0.5;
        vz += (dz / dist) * force * 0.25;
      }

      x += (targetX - x) * Math.min(1, dt * 1.4) + vx;
      y += vy * dt * 8;
      z += vz * (0.9 + Math.sin(phases[i]) * 0.08);

      // Vertical settle toward path height
      const pathY = role === 5 ? 1.35 : 1.1 + Math.sin(phases[i] + role) * 0.25;
      y += (pathY - y) * dt * 1.2;

      // Recycle
      if (z < -22 || (role === 3 && y < 0.2)) {
        z = 18 + Math.random() * 6;
        x =
          role === 0 ? -1.8 + Math.random() * 0.5 :
          role === 1 ? -0.2 + Math.random() * 0.4 :
          role === 2 ? 1.3 + Math.random() * 0.5 :
          (Math.random() - 0.5) * 3;
        y = 0.95 + Math.random() * 1.2;
        vy = 0;
      }

      // Work zone: keep a thinner presence near exhibits
      if (work > 0.2 && role < 4 && z < -4) {
        z = THREE.MathUtils.lerp(z, -4 + Math.random() * 2, work * 0.02);
      }

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;

      // Dim / tint by role
      const a = Math.min(1, alive * 1.15);
      if (role === 5 && output > 0.2) {
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
    points.current.material.opacity = theme === "day" ? 0.72 : 0.85;

    // Face camera slightly for readability
    void camera;
  });

  return (
    <points ref={points} geometry={geom} frustumCulled={false}>
      <pointsMaterial
        size={theme === "day" ? 0.045 : 0.055}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
