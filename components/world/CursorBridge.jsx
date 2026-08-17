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
  const dragging = useRef(false);
  const pointerId = useRef(null);
  const lastDrag = useRef({ x: 0, y: 0, t: 0 });
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
      if (dragging.current && cursorRef?.current) {
        const now = performance.now();
        const dt = Math.max(8, now - lastDrag.current.t);
        const dx = e.clientX - lastDrag.current.x;
        const dy = e.clientY - lastDrag.current.y;
        cursorRef.current.dragDX = dx;
        cursorRef.current.dragDY = dy;
        cursorRef.current.dragVX = dx / dt;
        cursorRef.current.dragVY = dy / dt;
        lastDrag.current = { x: e.clientX, y: e.clientY, t: now };
      }
    };
    const down = (e) => {
      if (e.button !== 0 && e.pointerType !== "touch") return;
      dragging.current = true;
      pointerId.current = e.pointerId;
      lastDrag.current = { x: e.clientX, y: e.clientY, t: performance.now() };
      if (cursorRef?.current) {
        cursorRef.current.dragActive = true;
        cursorRef.current.dragDX = 0;
        cursorRef.current.dragDY = 0;
      }
      el.setPointerCapture?.(e.pointerId);
    };
    const up = (e) => {
      if (pointerId.current !== null && e.pointerId !== pointerId.current) return;
      dragging.current = false;
      pointerId.current = null;
      if (cursorRef?.current) {
        cursorRef.current.dragActive = false;
        cursorRef.current.dragDX = 0;
        cursorRef.current.dragDY = 0;
      }
      el.releasePointerCapture?.(e.pointerId);
    };
    const leave = () => {
      over.current = false;
      if (cursorRef?.current) {
        cursorRef.current.active = false;
        cursorRef.current.dragActive = false;
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
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
      cur.dragDX = 0;
      cur.dragDY = 0;
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
    if (!cur.dragActive) {
      cur.dragDX = 0;
      cur.dragDY = 0;
      cur.dragVX *= 0.92;
      cur.dragVY *= 0.92;
    }
  });

  return null;
}
