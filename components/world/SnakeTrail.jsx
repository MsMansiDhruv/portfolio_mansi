"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ORANGE = "#f97316";

function polyline(points) {
  const segs = [];
  let length = 0;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    segs.push({ a, b, d, start: length });
    length += d;
  }
  return { segs, length };
}

function at(path, dist) {
  if (!path.length || dist < 0 || dist > path.length) return null;
  let d = dist;
  for (const seg of path.segs) {
    if (d <= seg.d || seg === path.segs[path.segs.length - 1]) {
      const t = seg.d ? Math.min(1, d / seg.d) : 0;
      return {
        x: seg.a.x + (seg.b.x - seg.a.x) * t,
        y: seg.a.y + (seg.b.y - seg.a.y) * t,
      };
    }
    d -= seg.d;
  }
  return null;
}

function routes() {
  const layer = document.querySelector(".wd-root")?.getAttribute("data-layer") || "world";
  const nav = document.querySelector(`.wd-bar .wd-nav__item[aria-current="page"]`) || document.querySelector(".wd-brand");
  const section = document.querySelector(`[data-world-layer="${layer}"]`);
  const from = rectOf(nav);
  const to = rectOf(section);
  const out = [];
  if (from && to) {
    const origin = { x: from.left + from.width / 2, y: from.bottom };
    const hit = { x: to.left + Math.min(72, to.width * 0.12), y: to.top + 88 };
    const rail = 18;
    out.push(
      polyline([
        origin,
        { x: origin.x, y: origin.y + 16 },
        { x: rail, y: origin.y + 16 },
        { x: rail, y: hit.y },
        hit,
      ])
    );
  }
  const brand = rectOf(document.querySelector(".wd-brand"));
  const items = [...document.querySelectorAll(".wd-bar .wd-nav__item")];
  if (brand && items.length) {
    const pts = [{ x: brand.right + 8, y: brand.top + brand.height / 2 }];
    items.forEach((item) => {
      const b = item.getBoundingClientRect();
      pts.push({ x: b.left + b.width / 2, y: b.bottom - 4 });
    });
    out.push(polyline(pts));
  }
  return out;
}

function rectOf(el) {
  if (!el) return null;
  const b = el.getBoundingClientRect();
  if (b.width < 2) return null;
  return b;
}

function drawSnake(ctx, path, travel, teal, mouse, motion) {
  if (!path.length) return;
  const step = 7;
  const pts = [];
  for (let d = 0; d <= path.length; d += step) {
    const p = at(path, d);
    if (p) pts.push({ ...p, d });
  }
  const tip = at(path, path.length);
  if (tip) pts.push({ ...tip, d: path.length });
  if (pts.length < 2) return;

  const headD = travel % (path.length + 80);
  for (let i = 1; i < pts.length; i += 1) {
    const a = pts[i - 1];
    const b = pts[i];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dist = Math.hypot(mx - mouse.x, my - mouse.y);
    const near = Math.max(0, 1 - dist / (68 + motion * 40));
    const along = a.d / path.length;
    const fromHead = Math.max(0, 1 - Math.abs(a.d - Math.min(headD, path.length)) / 220);
    ctx.strokeStyle = near > 0.2 ? ORANGE : teal;
    ctx.globalAlpha = 0.28 + fromHead * 0.45 + near * 0.35;
    ctx.lineWidth = 1.6 + fromHead * 2.4 + near * 1.1;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  const nose = at(path, Math.min(headD, path.length));
  if (!nose) return;
  const dist = Math.hypot(nose.x - mouse.x, nose.y - mouse.y);
  const near = Math.max(0, 1 - dist / 72);
  ctx.globalAlpha = 0.9 + near * 0.1;
  ctx.fillStyle = near > 0.2 ? ORANGE : "#fff";
  ctx.beginPath();
  ctx.arc(nose.x, nose.y, 2.6 + near * 0.8, 0, Math.PI * 2);
  ctx.fill();
}

export default function SnakeTrail({ enabled = true }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!enabled || !ready) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -999, y: -999, vx: 0, vy: 0, px: -999, py: -999 };
    let raf = 0;
    let dist = 0;
    let last = performance.now();

    const size = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    size();

    const onMove = (e) => {
      mouse.vx = e.clientX - mouse.px;
      mouse.vy = e.clientY - mouse.py;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.px = e.clientX;
      mouse.py = e.clientY;
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      dist += dt * 240;
      mouse.vx *= 0.92;
      mouse.vy *= 0.92;
      const teal =
        getComputedStyle(document.documentElement).getPropertyValue("--wd-accent").trim() || "#1cd6ac";
      const motion = Math.min(1, Math.hypot(mouse.vx, mouse.vy) / 28);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineJoin = "miter";
      ctx.miterLimit = 2;
      ctx.lineCap = "square";
      const paths = routes();
      paths.forEach((path, i) => {
        drawSnake(ctx, path, dist + i * 220, teal, mouse, motion);
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", size);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", size);
    };
  }, [enabled, ready]);

  if (!enabled || !ready) return null;

  return createPortal(<canvas ref={canvasRef} className="wd-snake-trail" aria-hidden />, document.body);
}
