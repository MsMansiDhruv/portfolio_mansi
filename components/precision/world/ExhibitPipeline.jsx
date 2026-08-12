"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getPipeline } from "@/lib/data/data-pipelines";
import { THEME_PALETTE } from "@/lib/data/precision";

const N = 900;

/**
 * Exhibit-local data pipeline — behaviour differs per real project metaphor.
 * Particles are the transition and the explanation.
 */
export default function ExhibitPipeline({ exhibit, theme, active, intensity = 0, cursorRef }) {
  const points = useRef();
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const pipeline = getPipeline(exhibit?.slug);

  const { positions, phases, states, colors } = useMemo(() => {
    const positions = new Float32Array(N * 3);
    const phases = new Float32Array(N);
    const states = new Float32Array(N);
    const colors = new Float32Array(N * 3);
    const live = new THREE.Color(theme === "day" ? "#2a3a4c" : "#9eb4cc");

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      phases[i] = Math.random();
      states[i] = 0;
      const intake = Math.floor(Math.random() * (pipeline.intake || 3));
      positions[i3] = (intake - (pipeline.intake - 1) / 2) * 0.55 + (Math.random() - 0.5) * 0.15;
      positions[i3 + 1] = 0.7 + Math.random() * 0.3;
      positions[i3 + 2] = 1.8 + Math.random() * 0.8;
      colors[i3] = live.r;
      colors[i3 + 1] = live.g;
      colors[i3 + 2] = live.b;
    }
    return { positions, phases, states, colors };
  }, [pipeline, theme]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  useFrame((_, delta) => {
    if (!points.current || !exhibit) return;
    const dt = Math.min(delta, 0.05);
    const live = active && intensity > 0.05;
    points.current.visible = live;
    if (!live) return;
    const pos = points.current.geometry.attributes.position.array;
    const col = points.current.geometry.attributes.color.array;
    const origin = exhibit.position;
    const mode = pipeline.mode;
    const stages = pipeline.stages || [];
    const cursor = cursorRef?.current;
    const speed = 0.2 + intensity * 0.75;

    // World-space origin for cursor influence (parent group already places us)
    const ox = origin[0];
    const oy = origin[1];
    const oz = origin[2];

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      phases[i] += dt * (0.25 + speed);

      let t = (phases[i] % 1);
      let rejected = states[i] > 0.5;

      // Stage index along pipeline
      const stageCount = Math.max(1, stages.length);
      const si = Math.min(stageCount - 1, Math.floor(t * stageCount));
      const stage = stages[si];
      const local = t * stageCount - si;

      // Rejection chance at stage
      if (!rejected && stage?.reject > 0 && local > 0.45 && local < 0.55) {
        if (Math.random() < stage.reject * 0.035 * intensity) {
          states[i] = 1;
          rejected = true;
        }
      }

      let x = 0;
      let y = stage?.y ?? 1.4;
      let z = 1.6 - t * 3.4;

      if (mode === "layers") {
        // Strata: flatten onto successive horizontal shelves
        x = (Math.sin(phases[i] * 4 + i) * 0.35) * (1 - t * 0.5);
        y = (stage?.y ?? 1.2) + Math.sin(local * Math.PI) * 0.05;
        z = 1.4 - si * 0.35 - local * 0.3;
      } else if (mode === "spine") {
        // Many signals → node → output axis
        const spread = (1 - Math.min(1, si / (stageCount - 1))) * 1.1;
        x = Math.sin(phases[i] * 2 + i * 0.2) * spread * (1 - local);
        if (si >= stageCount - 1) {
          x *= 0.15;
          z = -0.4 - local * 1.2;
        } else {
          z = 1.5 - t * 2.8;
        }
        y = 1.2 + Math.sin(phases[i]) * 0.15;
      } else if (mode === "sieve") {
        // Wide harvest → filter → thin report
        const width = 1.4 * (1 - t * 0.85);
        x = (Math.random() - 0.5) * 0.02 + Math.sin(phases[i] * 3 + i) * width;
        y = 0.9 + t * 1.2;
        z = 1.2 - t * 2.6;
      } else if (mode === "split") {
        // Mixed → fork left/right
        if (si < 2) {
          x = Math.sin(phases[i]) * 0.2;
          z = 1.4 - t * 1.5;
        } else {
          const left = i % 2 === 0;
          x = (left ? -1.15 : 1.15) * Math.min(1, local + 0.2);
          z = 0.2 - local * 1.4;
          y = left ? 1.25 : 1.7;
        }
      }

      if (rejected) {
        x += (x >= 0 ? 1 : -1) * (0.8 + local);
        y -= dt * 1.2;
        z += dt * 0.2;
        col[i3] = THREE.MathUtils.lerp(col[i3], 0.35, 0.08);
        col[i3 + 1] = THREE.MathUtils.lerp(col[i3 + 1], 0.65, 0.08);
        col[i3 + 2] = THREE.MathUtils.lerp(col[i3 + 2], 0.75, 0.08);
      } else if (t > 0.82) {
        col[i3] = THREE.MathUtils.lerp(col[i3], 0.88, 0.06);
        col[i3 + 1] = THREE.MathUtils.lerp(col[i3 + 1], 0.62, 0.06);
        col[i3 + 2] = THREE.MathUtils.lerp(col[i3 + 2], 0.22, 0.06);
      }

      // Cursor bend (local space)
      if (cursor) {
        const wx = ox + x;
        const wy = oy + y;
        const wz = oz + z;
        const dx = wx - cursor.x;
        const dy = wy - cursor.y;
        const dz = wz - cursor.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 1.8 && d > 0.01) {
          const f = (1 - d / 1.8) * 0.08;
          x += (dx / d) * f;
          y += (dy / d) * f * 0.4;
        }
      }

      if (t > 0.98 || (rejected && y < 0.15)) {
        phases[i] = Math.random() * 0.05;
        states[i] = 0;
        const intake = Math.floor(Math.random() * (pipeline.intake || 3));
        x = (intake - (pipeline.intake - 1) / 2) * 0.55;
        y = 0.75 + Math.random() * 0.25;
        z = 1.7;
      }

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.geometry.attributes.color.needsUpdate = true;
    points.current.material.opacity = 0.35 + intensity * 0.55;
  });

  if (!exhibit) return null;

  return (
    <group>
      {/* Quiet architectural gates — minimal, not decorative clutter */}
      {(pipeline.stages || []).slice(0, 4).map((s, i) => (
        <mesh key={s.id} position={[0, s.y, 1.05 - i * 0.48]}>
          <boxGeometry args={[modeWidth(pipeline.mode, i) * 0.55, 0.02, 0.02]} />
          <meshStandardMaterial
            color={p.aluminium}
            metalness={0.9}
            roughness={0.25}
            emissive={p.amber}
            emissiveIntensity={intensity > 0.2 ? 0.08 + intensity * 0.12 : 0}
          />
        </mesh>
      ))}

      <points ref={points} geometry={geom} frustumCulled={false}>
        <pointsMaterial
          size={0.038}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
}

function modeWidth(mode, i) {
  if (mode === "layers") return 1.8 - i * 0.2;
  if (mode === "sieve") return 2.2 - i * 0.35;
  if (mode === "split") return i >= 2 ? 0.7 : 1.2;
  return 1.1;
}
