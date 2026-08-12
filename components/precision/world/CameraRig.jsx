"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { WORLD_VIEWS } from "@/lib/data/precision";

/**
 * Destination camera — cinematic travel through one persistent world.
 * Supports hall destinations, exhibit enter (via particle mid), and reverse exit.
 */
export default function CameraRig({ cameraTargetRef, lookOffsetRef }) {
  const { camera } = useThree();
  const look = useRef({ x: WORLD_VIEWS.home.lookAt[0], y: WORLD_VIEWS.home.lookAt[1], z: WORLD_VIEWS.home.lookAt[2] });
  const pos = useRef({ x: WORLD_VIEWS.home.position[0], y: WORLD_VIEWS.home.position[1], z: WORLD_VIEWS.home.position[2] });
  const fov = useRef(WORLD_VIEWS.home.fov);
  const blend = useRef(1);
  const lastToken = useRef(0);
  const fromSnap = useRef(null);

  useFrame((_, delta) => {
    const dt = Math.min(Math.max(delta, 0), 0.05);
    const target = cameraTargetRef?.current;
    if (!target?.position || !target?.lookAt) return;

    if (target.token && target.token !== lastToken.current) {
      lastToken.current = target.token;
      blend.current = 0;
      fromSnap.current = {
        position: [pos.current.x, pos.current.y, pos.current.z],
        lookAt: [look.current.x, look.current.y, look.current.z],
        fov: fov.current,
      };
    }

    const rate = target.mode === "enter" || target.mode === "exit" ? 1.05 : 1.55;
    blend.current = THREE.MathUtils.damp(blend.current, 1, rate, dt);
    const b = blend.current;

    let desired = {
      position: target.position,
      lookAt: target.lookAt,
      fov: target.fov ?? 36,
    };

    if (fromSnap.current && b < 0.999) {
      const mid = target.mid;
      if (mid && (target.mode === "enter" || target.mode === "exit")) {
        // Two-leg path: current → mid (along data) → destination
        if (b < 0.5) {
          const t = THREE.MathUtils.smoothstep(b / 0.5, 0, 1);
          const from = target.mode === "exit" && target.reverseFrom ? target.reverseFrom : fromSnap.current;
          desired = {
            position: [
              from.position[0] + (mid.position[0] - from.position[0]) * t,
              from.position[1] + (mid.position[1] - from.position[1]) * t,
              from.position[2] + (mid.position[2] - from.position[2]) * t,
            ],
            lookAt: [
              from.lookAt[0] + (mid.lookAt[0] - from.lookAt[0]) * t,
              from.lookAt[1] + (mid.lookAt[1] - from.lookAt[1]) * t,
              from.lookAt[2] + (mid.lookAt[2] - from.lookAt[2]) * t,
            ],
            fov: THREE.MathUtils.lerp(from.fov, target.fov ?? 34, t * 0.5),
          };
        } else {
          const t = THREE.MathUtils.smoothstep((b - 0.5) / 0.5, 0, 1);
          desired = {
            position: [
              mid.position[0] + (target.position[0] - mid.position[0]) * t,
              mid.position[1] + (target.position[1] - mid.position[1]) * t,
              mid.position[2] + (target.position[2] - mid.position[2]) * t,
            ],
            lookAt: [
              mid.lookAt[0] + (target.lookAt[0] - mid.lookAt[0]) * t,
              mid.lookAt[1] + (target.lookAt[1] - mid.lookAt[1]) * t,
              mid.lookAt[2] + (target.lookAt[2] - mid.lookAt[2]) * t,
            ],
            fov: THREE.MathUtils.lerp(target.fov ?? 34, target.fov ?? 34, t),
          };
        }
      } else {
        const t = THREE.MathUtils.smoothstep(b, 0, 1);
        const from = fromSnap.current;
        desired = {
          position: [
            from.position[0] + (target.position[0] - from.position[0]) * t,
            from.position[1] + (target.position[1] - from.position[1]) * t,
            from.position[2] + (target.position[2] - from.position[2]) * t,
          ],
          lookAt: [
            from.lookAt[0] + (target.lookAt[0] - from.lookAt[0]) * t,
            from.lookAt[1] + (target.lookAt[1] - from.lookAt[1]) * t,
            from.lookAt[2] + (target.lookAt[2] - from.lookAt[2]) * t,
          ],
          fov: THREE.MathUtils.lerp(from.fov, target.fov ?? 36, t),
        };
      }
    }

    const damp = 1 - Math.exp(-3.2 * dt);
    pos.current.x += (desired.position[0] - pos.current.x) * damp;
    pos.current.y += (desired.position[1] - pos.current.y) * damp;
    pos.current.z += (desired.position[2] - pos.current.z) * damp;
    look.current.x += (desired.lookAt[0] - look.current.x) * damp;
    look.current.y += (desired.lookAt[1] - look.current.y) * damp;
    look.current.z += (desired.lookAt[2] - look.current.z) * damp;
    fov.current += (desired.fov - fov.current) * damp;

    // Subtle observe offset from pointer drag (hall only)
    const off = lookOffsetRef?.current;
    const ox = target.mode === "hall" ? (off?.yaw ?? 0) : 0;
    const oy = target.mode === "hall" ? (off?.pitch ?? 0) : 0;

    camera.position.set(pos.current.x, pos.current.y, pos.current.z);
    camera.lookAt(look.current.x + ox, look.current.y + oy, look.current.z);
    if (Math.abs(camera.fov - fov.current) > 0.02) {
      camera.fov = fov.current;
      camera.updateProjectionMatrix();
    }

    // Signal arrival
    if (cameraTargetRef.current) {
      cameraTargetRef.current.arrived = b > 0.96;
    }
  });

  return null;
}
