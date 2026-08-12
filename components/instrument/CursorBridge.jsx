"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Pointer → world plane (y≈0). Active only while over canvas. */
export default function CursorBridge({ cursorRef }) {
  const { camera, gl } = useThree();
  const ndc = useRef(new THREE.Vector2());
  const prev = useRef(new THREE.Vector3(0, 0, 2));
  const ray = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const hit = useRef(new THREE.Vector3());
  const over = useRef(false);

  useEffect(() => {
    const el = gl.domElement;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      ndc.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.current.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      over.current = true;
    };
    const leave = () => {
      over.current = false;
      if (cursorRef?.current) cursorRef.current.active = false;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [gl, cursorRef]);

  useFrame((_, delta) => {
    if (!cursorRef?.current) return;
    const cur = cursorRef.current;
    if (!over.current) {
      cur.active = false;
      cur.vx = cur.vy = cur.vz = 0;
      return;
    }
    const dt = Math.max(0.001, Math.min(delta, 0.05));
    ray.current.setFromCamera(ndc.current, camera);
    if (!ray.current.ray.intersectPlane(plane.current, hit.current)) {
      cur.active = false;
      return;
    }
    const x = THREE.MathUtils.damp(cur.x ?? 0, hit.current.x, 14, dt);
    const y = THREE.MathUtils.damp(cur.y ?? 0, hit.current.y, 14, dt);
    const z = THREE.MathUtils.damp(cur.z ?? 2, hit.current.z, 14, dt);
    cur.vx = (x - prev.current.x) / dt;
    cur.vy = (y - prev.current.y) / dt;
    cur.vz = (z - prev.current.z) / dt;
    prev.current.set(x, y, z);
    cur.x = x;
    cur.y = y;
    cur.z = z;
    cur.active = true;
  });

  return null;
}
