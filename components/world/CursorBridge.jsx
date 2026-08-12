"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Pointer → NDC + world influence. Active only over canvas. */
export default function CursorBridge({ cursorRef }) {
  const { camera, gl } = useThree();
  const ndc = useRef(new THREE.Vector2());
  const prev = useRef({ x: 0, y: 0 });
  const over = useRef(false);
  const ray = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const hit = useRef(new THREE.Vector3());

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
      cur.vx = 0;
      cur.vy = 0;
      return;
    }
    const dt = Math.max(0.001, Math.min(delta, 0.05));
    const nx = ndc.current.x;
    const ny = ndc.current.y;
    cur.vx = (nx - prev.current.x) / dt;
    cur.vy = (ny - prev.current.y) / dt;
    prev.current = { x: nx, y: ny };
    cur.nx = nx;
    cur.ny = ny;
    cur.active = true;

    // Soft world hit for particle disturbance on z=0 plane near camera look
    plane.current.constant = 0;
    ray.current.setFromCamera(ndc.current, camera);
    if (ray.current.ray.intersectPlane(plane.current, hit.current)) {
      cur.x = hit.current.x;
      cur.y = hit.current.y;
      cur.z = hit.current.z;
    }
  });

  return null;
}
