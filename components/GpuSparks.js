"use client";

import { useEffect, useRef } from "react";

export default function GpuSparks() {
  const particles = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    let canvas = document.getElementById("gpu-sparks-canvas");

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "gpu-sparks-canvas";
      canvas.style.position = "fixed";
      canvas.style.inset = "0";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "40"; // lower than UI
      canvas.style.mixBlendMode = "normal";
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext("2d");
    let dpr = window.devicePixelRatio || 1;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }

    resize();
    window.addEventListener("resize", resize);

    const MAX_PARTICLES = 35;
    const COLOR = "rgba(255, 220, 120,";

    function createParticle(x, y) {
      particles.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        alpha: 1,
        size: Math.random() * 1.8 + 0.5,
      });
      if (particles.current.length > MAX_PARTICLES) {
        particles.current.shift();
      }
    }

    function handleMove(e) {
      for (let i = 0; i < 2; i++) {
        createParticle(
          e.clientX + (Math.random() - 0.5) * 8,
          e.clientY + (Math.random() - 0.5) * 8
        );
      }
    }

    window.addEventListener("mousemove", handleMove);

    function update() {
      // 🔥 CORRECT CLEAR SEQUENCE
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) return;

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = `${COLOR}${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(255, 220, 120, 0.9)";
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(update);
    }

    rafRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return null;
}
