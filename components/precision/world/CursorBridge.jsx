"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Maps pointer to a world-space point on a horizontal plane (y≈1.25).
 * Active only while the pointer is over the canvas.
 */
export default function CursorBridge({ cursorRef }) {
  const { camera, gl } = useThree();
  const ndc = useRef(new THREE.Vector2(0, 0));
  const prevWorld = useRef(new THREE.Vector3(0, 1.25, 10));
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.25));
  const hit = useRef(new THREE.Vector3());
  const over = useRef(false);

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      ndc.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      over.current = true;
    };
    const onLeave = () => {
      over.current = false;
      if (cursorRef?.current) cursorRef.current.active = false;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerout", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerout", onLeave);
    };
  }, [gl, cursorRef]);

  useFrame((_, delta) => {
    if (!cursorRef?.current) return;
    const cur = cursorRef.current;
    if (!over.current) {
      cur.active = false;
      cur.vx = 0;
      cur.vy = 0;
      cur.vz = 0;
      return;
    }

    const dt = Math.max(0.001, Math.min(delta, 0.05));
    raycaster.current.setFromCamera(ndc.current, camera);
    const ok = raycaster.current.ray.intersectPlane(plane.current, hit.current);

    if (ok) {
      const newX = THREE.MathUtils.damp(cur.x ?? 0, hit.current.x, 12, dt);
      const newY = THREE.MathUtils.damp(cur.y ?? 1.25, hit.current.y, 12, dt);
      const newZ = THREE.MathUtils.damp(cur.z ?? 10, hit.current.z, 12, dt);

      cur.vx = (newX - prevWorld.current.x) / dt;
      cur.vy = (newY - prevWorld.current.y) / dt;
      cur.vz = (newZ - prevWorld.current.z) / dt;
      prevWorld.current.set(newX, newY, newZ);

      cur.x = newX;
      cur.y = newY;
      cur.z = newZ;
      cur.active = true;
    } else {
      cur.active = false;
    }
  });

  return null;
}
