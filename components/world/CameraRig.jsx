"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const HOME_CAM = {
  position: [1.2, 0.05, 9.6],
  lookAt: [1.2, 0.02, 0],
  fov: 32,
};

const ZOOM_MIN = 4.2;
const ZOOM_MAX = 16;
const ORBIT_YAW = 0.18; // ~10°
const ORBIT_PITCH = 0.1; // ~5.7°

/**
 * Camera with limited orbital mouse influence, inertia, approach, wheel zoom.
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
  const orbit = useRef({ yaw: 0, pitch: 0, vYaw: 0, vPitch: 0 });
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
      const tp = new THREE.Vector3(...target.position);
      const tl = new THREE.Vector3(...(target.lookAt || HOME_CAM.lookAt));
      zoomDist.current = tp.distanceTo(tl);
    }

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

    // Limited orbital mouse — expensive, not a spin
    const cursor = cursorRef?.current;
    const stream = target.mode !== "enter";
    const yawT = stream && cursor?.active ? cursor.nx * ORBIT_YAW : 0;
    const pitchT = stream && cursor?.active ? cursor.ny * ORBIT_PITCH : 0;
    orbit.current.vYaw += (yawT - orbit.current.yaw) * 3.2 * dt;
    orbit.current.vPitch += (pitchT - orbit.current.pitch) * 3.2 * dt;
    orbit.current.vYaw *= 0.9;
    orbit.current.vPitch *= 0.9;
    orbit.current.yaw += orbit.current.vYaw;
    orbit.current.pitch += orbit.current.vPitch;
    orbit.current.yaw = THREE.MathUtils.clamp(orbit.current.yaw, -ORBIT_YAW, ORBIT_YAW);
    orbit.current.pitch = THREE.MathUtils.clamp(
      orbit.current.pitch,
      -ORBIT_PITCH,
      ORBIT_PITCH
    );

    if (stream) {
      const lookV = new THREE.Vector3(...desired.lookAt);
      const camV = new THREE.Vector3(...desired.position);
      const offset = camV.clone().sub(lookV);
      const qYaw = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        orbit.current.yaw
      );
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(qYaw);
      const qPitch = new THREE.Quaternion().setFromAxisAngle(right, orbit.current.pitch);
      offset.applyQuaternion(qYaw).applyQuaternion(qPitch);
      desired.position = [lookV.x + offset.x, lookV.y + offset.y, lookV.z + offset.z];
      desired.lookAt[0] += orbit.current.yaw * 0.35;
      desired.lookAt[1] += orbit.current.pitch * 0.45;
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
