"use client";

import { useEffect, useRef } from "react";

const FRAMES = 120;

function theme() {
  const day = document.documentElement.getAttribute("data-world-theme") === "day";
  return day
    ? { ink: "#f4f1ea", teal: "#0e9f84", orange: "#f97316", faint: "rgba(14,159,132,0.14)" }
    : { ink: "#070908", teal: "#1cd6ac", orange: "#f97316", faint: "rgba(28,214,172,0.16)" };
}

function drawFrame(ctx, w, h, t, pal) {
  ctx.clearRect(0, 0, w, h);
  const cx = w * 0.5;
  const cy = h * 0.48;
  const scale = Math.min(w, h) * 0.42;
  const rot = t * Math.PI * 2;
  const R = 1;
  const r = 0.32;
  const rings = 28;
  const segs = 48;

  ctx.lineWidth = Math.max(1, scale * 0.004);
  for (let i = 0; i < rings; i += 1) {
    const u0 = (i / rings) * Math.PI * 2;
    ctx.beginPath();
    let first = true;
    for (let j = 0; j <= segs; j += 1) {
      const v = (j / segs) * Math.PI * 2;
      const u = u0 + rot * 0.35;
      const x = (R + r * Math.cos(v)) * Math.cos(u);
      const y = r * Math.sin(v) * 0.92;
      const z = (R + r * Math.cos(v)) * Math.sin(u);
      const p = 2.15 / (z + 2.4);
      const px = cx + x * scale * p;
      const py = cy + y * scale * p;
      if (first) {
        ctx.moveTo(px, py);
        first = false;
      } else ctx.lineTo(px, py);
    }
    const depth = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(u0 + rot));
    ctx.strokeStyle = i % 7 === 0 ? pal.orange : pal.teal;
    ctx.globalAlpha = 0.08 + depth * 0.22;
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  for (let k = 0; k < 18; k += 1) {
    const u = rot * 1.4 + (k / 18) * Math.PI * 2;
    const v = rot * 2.1 + k * 0.7;
    const x = (R + r * Math.cos(v)) * Math.cos(u);
    const y = r * Math.sin(v) * 0.92;
    const z = (R + r * Math.cos(v)) * Math.sin(u);
    const p = 2.15 / (z + 2.4);
    const px = cx + x * scale * p;
    const py = cy + y * scale * p;
    const s = (1.6 + 3.4 * p) * (w / 720);
    ctx.fillStyle = k % 3 ? pal.teal : pal.orange;
    ctx.beginPath();
    ctx.arc(px, py, s, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function ScrollRig() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx2d = canvas.getContext("2d", { alpha: true });
    if (!ctx2d) return undefined;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = -1;

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      last = -1;
    };
    resize();

    const paint = () => {
      const pal = theme();
      const t = reduced ? 0.18 : frameRef.current / (FRAMES - 1);
      const key = Math.round(t * FRAMES);
      if (key === last) return;
      last = key;
      drawFrame(ctx2d, w, h, t, pal);
    };
    paint();

    if (reduced) {
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }

    let ctx;
    let killed = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapMod, stMod]) => {
      if (killed) return;
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      gsap.config({ force3D: true });

      ctx = gsap.context(() => {
        const host = root.closest(".wd-archive") || root;
        const layers = [
          [".wd-rig__sky", 40],
          [".wd-rig__field", 110],
          [".wd-rig__seq", 24],
          [".wd-rig__fore", 220],
        ];
        layers.forEach(([sel, y]) => {
          gsap.to(root.querySelector(sel), {
            y,
            ease: "none",
            force3D: true,
            scrollTrigger: { trigger: host, start: "top top", end: "bottom bottom", scrub: 0.85 },
          });
        });

        gsap.to(root.querySelector(".wd-rig__mark"), {
          rotation: 120,
          ease: "none",
          force3D: true,
          scrollTrigger: { trigger: host, start: "top top", end: "bottom bottom", scrub: 0.7 },
        });

        gsap.fromTo(
          root.querySelector(".wd-rig__progress"),
          { strokeDashoffset: 126 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: host, start: "top top", end: "bottom bottom", scrub: 0.4 },
          }
        );

        ScrollTrigger.create({
          trigger: host,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            frameRef.current = Math.round(self.progress * (FRAMES - 1));
            if (!raf) raf = requestAnimationFrame(() => {
              raf = 0;
              paint();
            });
          },
        });
      }, root);
    });

    window.addEventListener("resize", resize);
    return () => {
      killed = true;
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
      ctx?.revert();
    };
  }, []);

  return (
    <div className="wd-rig" ref={rootRef} aria-hidden>
      <div className="wd-rig__layer wd-rig__sky">
        <span className="wd-rig__wash wd-rig__wash--a" />
        <span className="wd-rig__wash wd-rig__wash--b" />
      </div>

      <div className="wd-rig__layer wd-rig__field">
        <svg className="wd-rig__svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="wd-rig-dots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.2" cy="1.2" r="0.9" className="wd-rig__dot" />
            </pattern>
          </defs>
          <rect width="1440" height="900" fill="url(#wd-rig-dots)" />
          <ellipse cx="720" cy="460" rx="420" ry="168" className="wd-rig__orbit" />
          <ellipse cx="720" cy="460" rx="290" ry="110" className="wd-rig__orbit is-soft" />
          <ellipse cx="720" cy="460" rx="160" ry="58" className="wd-rig__orbit is-hot" />
        </svg>
      </div>

      <div className="wd-rig__layer wd-rig__seq">
        <canvas ref={canvasRef} className="wd-rig__canvas" />
      </div>

      <div className="wd-rig__layer wd-rig__fore">
        <i className="wd-rig__mote is-a" />
        <i className="wd-rig__mote is-b" />
        <i className="wd-rig__mote is-c" />
        <i className="wd-rig__mote is-d" />
        <svg className="wd-rig__mark" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" className="wd-rig__ring" />
          <circle cx="24" cy="24" r="20" className="wd-rig__progress" pathLength="126" />
          <path d="M24 10v6M24 32v6M10 24h6M32 24h6" className="wd-rig__cross" />
        </svg>
      </div>
    </div>
  );
}
