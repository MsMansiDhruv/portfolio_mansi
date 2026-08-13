import * as THREE from "three";

/** Shared fine information grain — hard core, minimal glow */
let cached = null;

export function getPointMap() {
  if (cached) return cached;
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, 32, 32);
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.beginPath();
  ctx.arc(16, 16, 5.5, 0, Math.PI * 2);
  ctx.fill();
  const g = ctx.createRadialGradient(16, 16, 5, 16, 16, 9);
  g.addColorStop(0, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(16, 16, 9, 0, Math.PI * 2);
  ctx.fill();
  cached = new THREE.CanvasTexture(c);
  cached.needsUpdate = true;
  cached.generateMipmaps = false;
  cached.minFilter = THREE.NearestFilter;
  cached.magFilter = THREE.NearestFilter;
  return cached;
}
