"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const HOME_CAM = {
  // Globe upper-right; type lower-left
  position: [0.4, 0.15, 11.2],
  lookAt: [2.4, 0.35, 0],
  fov: 34,
};

const ZOOM_MIN = 4.2;
const ZOOM_MAX = 16;

/**
 * Smooth camera with cursor parallax, approach-to-node, and wheel zoom.
 */
export default function CameraRig({ cameraTargetRef, cursorRef }) {
  const { camera } = useThree();
  const pos = useRef({
    x: HOME_CAM.position[0],
    y: HOME_CAM.position[1],
    z: HOME_CAM.position[2],
  });
  const look = useRef({
    x: HOME_CAM.lookAt[0],
    y: HOME_CAM.lookAt[1],
    z: HOME_CAM.lookAt[2],
  });
  const fov = useRef(HOME_CAM.fov);
  const blend = useRef(1);
  const token = useRef(0);
  const from = useRef(null);
  const parallax = useRef({ x: 0, y: 0 });
  const zoomDist = useRef(
    new THREE.Vector3(...HOME_CAM.position).distanceTo(
      new THREE.Vector3(...HOME_CAM.lookAt)
    )
  );

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
      // Sync zoom distance to new target
      const tp = new THREE.Vector3(...target.position);
      const tl = new THREE.Vector3(...(target.lookAt || HOME_CAM.lookAt));
      zoomDist.current = tp.distanceTo(tl);
    }

    // Wheel zoom — pull camera along view ray
    if (typeof target.zoomDelta === "number" && target.zoomDelta !== 0) {
      const factor = Math.exp(target.zoomDelta * 0.0015);
      zoomDist.current = THREE.MathUtils.clamp(
        zoomDist.current * factor,
        ZOOM_MIN,
        ZOOM_MAX
      );
      target.zoomDelta = 0;

      const lookV = new THREE.Vector3(
        target.lookAt[0],
        target.lookAt[1],
        target.lookAt[2]
      );
      const dir = new THREE.Vector3(
        target.position[0] - lookV.x,
        target.position[1] - lookV.y,
        target.position[2] - lookV.z
      );
      if (dir.lengthSq() < 1e-6) dir.set(0, 0.2, 1);
      dir.normalize().multiplyScalar(zoomDist.current);
      target.position = [lookV.x + dir.x, lookV.y + dir.y, lookV.z + dir.z];
      // Keep stream mode so we don't snap into enter animation
      if (target.mode === "enter") {
        /* still allow zoom while focused */
      }
    }

    const rate = target.mode === "enter" ? 1.05 : 1.35;
    blend.current = THREE.MathUtils.damp(blend.current, 1, rate, dt);
    const b = blend.current;

    let desired = {
      position: [...target.position],
      lookAt: [...target.lookAt],
      fov: target.fov ?? HOME_CAM.fov,
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
          fov: THREE.MathUtils.lerp(f.fov, target.fov ?? HOME_CAM.fov, t * 0.4),
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
            THREE.MathUtils.lerp(from.current.fov, target.fov ?? HOME_CAM.fov, 0.5),
            target.fov ?? HOME_CAM.fov,
            t
          ),
        };
      }
    }

    const cursor = cursorRef?.current;
    const px = cursor?.active ? cursor.nx * 0.18 : 0;
    const py = cursor?.active ? cursor.ny * 0.12 : 0;
    parallax.current.x = THREE.MathUtils.damp(parallax.current.x, px, 2.4, dt);
    parallax.current.y = THREE.MathUtils.damp(parallax.current.y, py, 2.4, dt);

    if (target.mode !== "enter") {
      desired.position[0] += parallax.current.x;
      desired.position[1] += parallax.current.y;
      desired.lookAt[0] += parallax.current.x * 0.35;
      desired.lookAt[1] += parallax.current.y * 0.35;
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
  });

  return null;
}

export function approachNode(nodePos, distance = 2.8) {
  const p = new THREE.Vector3(...nodePos);
  const dir = p.clone().normalize();
  return {
    position: [
      p.x * 0.45 + dir.x * 0.2,
      p.y * 0.45 + 0.35,
      p.z * 0.45 + distance,
    ],
    lookAt: [p.x * 0.92, p.y * 0.92, p.z * 0.92],
    fov: 34,
  };
}
