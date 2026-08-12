"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const CAM_VIEWS = {
  home: { position: [0, 0.35, 7.2], lookAt: [0, 0, 0], fov: 42 },
  work: { position: [0.4, 0.8, 8.5], lookAt: [0, 0.1, 0], fov: 40 },
  project: { position: [1.2, 0.6, 5.2], lookAt: [2.5, 0.2, 2], fov: 36 },
  "ai-lab": { position: [0, 0.2, 5.5], lookAt: [0, 0, 0], fov: 45 },
  experience: { position: [-0.6, 0.55, 6.8], lookAt: [0, 0, 0], fov: 42 },
  about: { position: [0.3, 0.4, 6.2], lookAt: [0, 0.1, 0], fov: 44 },
  contact: { position: [0, 0.3, 6.5], lookAt: [0, 0, 0], fov: 44 },
};

export function viewOf(id, project) {
  if (id === "project" && project) {
    const x = Math.cos(project.angle) * project.radius;
    const z = Math.sin(project.angle) * project.radius;
    return {
      position: [x * 0.35, 0.55 + project.y, z * 0.35 + 3.8],
      lookAt: [x * 0.85, project.y, z * 0.85],
      fov: 34,
    };
  }
  return CAM_VIEWS[id] || CAM_VIEWS.home;
}

export default function CameraRig({ cameraTargetRef }) {
  const { camera } = useThree();
  const pos = useRef({ x: 0, y: 0.35, z: 7.2 });
  const look = useRef({ x: 0, y: 0, z: 0 });
  const fov = useRef(42);
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

    const rate = target.mode === "enter" ? 1.15 : 1.4;
    blend.current = THREE.MathUtils.damp(blend.current, 1, rate, dt);
    const b = blend.current;

    let desired = {
      position: target.position,
      lookAt: target.lookAt,
      fov: target.fov ?? 42,
    };

    if (from.current && b < 0.999 && target.mid) {
      const m = target.mid;
      if (b < 0.5) {
        const t = THREE.MathUtils.smoothstep(b / 0.5, 0, 1);
        const f = from.current;
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
          fov: THREE.MathUtils.lerp(f.fov, target.fov ?? 42, t * 0.45),
        };
      } else {
        const t = THREE.MathUtils.smoothstep((b - 0.5) / 0.5, 0, 1);
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
            THREE.MathUtils.lerp(from.current.fov, target.fov ?? 42, 0.5),
            target.fov ?? 42,
            t
          ),
        };
      }
    }

    const k = 1 - Math.exp(-3.2 * dt);
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
  });

  return null;
}
