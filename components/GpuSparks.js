"use client";

import { useEffect, useRef } from "react";

/**
 * EXACT same spark logic you wrote.
 * Only difference:
 *   - canvas is appended to document.body
 *   - uses DPR-aware sizing
 *   - pointer events and transforms removed
 *   - no layout offsets => no cursor gap
 */

export default function GpuSparks() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    // Create canvas and attach to body
    const canvas = document.createElement("canvas");
    canvasRef.current = canvas;
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "60";
    canvas.style.transform = "none";
    canvas.style.mixBlendMode = "normal"; // unchanged
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // Keep your spark settings exactly the same
    const MAX_PARTICLES = 35;
    const COLOR = "rgba(255, 220, 120,";

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function createParticle(x, y) {
      particles.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        alpha: 1,
        size: Math.random() * 1.8 + 0.5,
      });
      if (particles.current.length > MAX_PARTICLES) particles.current.shift();
    }

    function handleMove(e) {
      const x = e.clientX;
      const y = e.clientY;

      for (let i = 0; i < 2; i++) {
        createParticle(
          x + (Math.random() - 0.5) * 8,
          y + (Math.random() - 0.5) * 8
        );
      }
    }
    window.addEventListener("mousemove", handleMove);

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;

        ctx.beginPath();
        ctx.fillStyle = `${COLOR}${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(255, 220, 120, 0.9)";
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(update);
    }

    rafRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return null; // we inject canvas into body
}
