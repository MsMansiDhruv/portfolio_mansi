"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const VIEWS = {
  home: { position: [0.15, 1.55, 7.2], lookAt: [0, 0.05, 0], fov: 40 },
  work: { position: [0.1, 1.7, 4.2], lookAt: [0, 0.2, -2.2], fov: 38 },
  experience: { position: [0, 1.8, 5.5], lookAt: [0, 0.3, -1], fov: 40 },
  about: { position: [0.2, 1.5, 6.2], lookAt: [0, 0.1, 0.5], fov: 42 },
  contact: { position: [0, 1.45, 5.8], lookAt: [0, 0, -0.5], fov: 42 },
  project: null,
};

/**
 * Smooth destination camera — stream midpoints, never teleport.
 */
export default function CameraRig({ cameraTargetRef }) {
  const { camera } = useThree();
  const pos = useRef({ x: 0.15, y: 1.55, z: 7.2 });
  const look = useRef({ x: 0, y: 0.05, z: 0 });
  const fov = useRef(40);
  const blend = useRef(1);
  const token = useRef(0);
  const from = useRef(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const target = cameraTargetRef?.current;
    if (!target?.position) return;

    if (target.token && target.token !== token.current) {
      token.current = target.token;
      blend.current = 0;
      from.current = {
        position: [pos.current.x, pos.current.y, pos.current.z],
        lookAt: [look.current.x, look.current.y, look.current.z],
        fov: fov.current,
      };
    }

    const rate = target.mode === "enter" ? 1.1 : 1.35;
    blend.current = THREE.MathUtils.damp(blend.current, 1, rate, dt);
    const b = blend.current;

    let desired = {
      position: target.position,
      lookAt: target.lookAt,
      fov: target.fov ?? 40,
    };

    if (from.current && b < 0.999 && target.mid) {
      if (b < 0.5) {
        const t = THREE.MathUtils.smoothstep(b / 0.5, 0, 1);
        const f = from.current;
        const m = target.mid;
        desired = {
          position: [
            f.position[0] + (m.position[0] - f.position[0]) * t,
            f.position[1] + (m.position[1] - f.position[1]) * t,
            f.position[2] + (m.position[2] - f.position[2]) * t,
          ],
          lookAt: [
            f.lookAt[0] + (m.lookAt[0] - f.lookAt[0]) * t,
            f.lookAt[1] + (m.lookAt[1] - f.lookAt[1]) * t,
            f.lookAt[2] + (m.lookAt[2] - f.lookAt[2]) * t,
          ],
          fov: THREE.MathUtils.lerp(f.fov, target.fov ?? 40, t * 0.5),
        };
      } else {
        const t = THREE.MathUtils.smoothstep((b - 0.5) / 0.5, 0, 1);
        const m = target.mid;
        desired = {
          position: [
            m.position[0] + (target.position[0] - m.position[0]) * t,
            m.position[1] + (target.position[1] - m.position[1]) * t,
            m.position[2] + (target.position[2] - m.position[2]) * t,
          ],
          lookAt: [
            m.lookAt[0] + (target.lookAt[0] - m.lookAt[0]) * t,
            m.lookAt[1] + (target.lookAt[1] - m.lookAt[1]) * t,
            m.lookAt[2] + (target.lookAt[2] - m.lookAt[2]) * t,
          ],
          fov: THREE.MathUtils.lerp(
            THREE.MathUtils.lerp(from.current.fov, target.fov ?? 40, 0.5),
            target.fov ?? 40,
            t
          ),
        };
      }
    } else if (from.current && b < 0.999) {
      const t = THREE.MathUtils.smoothstep(b, 0, 1);
      const f = from.current;
      desired = {
        position: [
          f.position[0] + (target.position[0] - f.position[0]) * t,
          f.position[1] + (target.position[1] - f.position[1]) * t,
          f.position[2] + (target.position[2] - f.position[2]) * t,
        ],
        lookAt: [
          f.lookAt[0] + (target.lookAt[0] - f.lookAt[0]) * t,
          f.lookAt[1] + (target.lookAt[1] - f.lookAt[1]) * t,
          f.lookAt[2] + (target.lookAt[2] - f.lookAt[2]) * t,
        ],
        fov: THREE.MathUtils.lerp(f.fov, target.fov ?? 40, t),
      };
    }

    const k = 1 - Math.exp(-3.4 * dt);
    pos.current.x += (desired.position[0] - pos.current.x) * k;
    pos.current.y += (desired.position[1] - pos.current.y) * k;
    pos.current.z += (desired.position[2] - pos.current.z) * k;
    look.current.x += (desired.lookAt[0] - look.current.x) * k;
    look.current.y += (desired.lookAt[1] - look.current.y) * k;
    look.current.z += (desired.lookAt[2] - look.current.z) * k;
    fov.current += (desired.fov - fov.current) * k;

    camera.position.set(pos.current.x, pos.current.y, pos.current.z);
    camera.lookAt(look.current.x, look.current.y, look.current.z);
    if (Math.abs(camera.fov - fov.current) > 0.02) {
      camera.fov = fov.current;
      camera.updateProjectionMatrix();
    }
    if (cameraTargetRef.current) cameraTargetRef.current.arrived = b > 0.96;
  });

  return null;
}

export function viewCamera(id, projectNode) {
  if (id === "project" && projectNode) {
    return {
      position: [projectNode[0] * 0.35, 1.55, projectNode[2] + 2.6],
      lookAt: [projectNode[0], 0.45, projectNode[2]],
      fov: 34,
    };
  }
  return VIEWS[id] || VIEWS.home;
}
