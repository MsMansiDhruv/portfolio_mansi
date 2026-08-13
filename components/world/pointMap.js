import * as THREE from "three";

/** Shared crisp circular point texture — PointsMaterial is square without a map */
let cached = null;

export function getPointMap() {
  if (cached) return cached;
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.62, "rgba(255,255,255,1)");
  g.addColorStop(0.82, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();
  cached = new THREE.CanvasTexture(c);
  cached.needsUpdate = true;
  cached.generateMipmaps = false;
  cached.minFilter = THREE.LinearFilter;
  cached.magFilter = THREE.LinearFilter;
  return cached;
}
