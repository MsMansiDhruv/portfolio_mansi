"use client";

import { useEffect, useRef } from "react";

const COUNT = 420;
const MAX_WAVES = 2;

function hash(n, s) {
  const x = Math.sin(n * s) * 43758.5453;
  return x - Math.floor(x);
}

export default function WorkSwarm() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      host.removeChild(canvas);
      return undefined;
    }

    const cx = new Float32Array(COUNT);
    const cy = new Float32Array(COUNT);
    const rad = new Float32Array(COUNT);
    const phase = new Float32Array(COUNT);
    const spin = new Float32Array(COUNT);
    const mix = new Float32Array(COUNT);
    const bit = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i += 1) {
      cx[i] = hash(i, 127.1) * 2 - 1;
      cy[i] = hash(i, 269.5) * 2 - 1;
      rad[i] = 0.002 + hash(i, 91.3) * 0.008;
      phase[i] = hash(i, 53.1) * Math.PI * 2;
      spin[i] = 0.12 + hash(i, 17.9) * 0.18;
      mix[i] = hash(i, 73.7);
      bit[i] = 2.4 + hash(i, 11.3) * 2.2;
    }

    const waves = [];
    const mouse = { x: 0.2, y: 0.05, px: 0, py: 0, moved: false };
    const target = { x: 0.2, y: 0.05 };
    let w = 2;
    let h = 2;
    let dpr = 1;
    let lastSpawn = 0;

    const resize = () => {
      w = Math.max(window.innerWidth, 2);
      h = Math.max(window.innerHeight, 2);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    const spawnWave = (x, y, vigor) => {
      if (waves.length >= MAX_WAVES) waves.shift();
      waves.push({
        x,
        y,
        r: 8,
        vr: 3.2 + vigor * 2.4,
        max: 68 + vigor * 42,
        life: 1,
      });
    };

    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      const nx = e.clientX;
      const ny = e.clientY;
      const dx = nx - mouse.px;
      const dy = ny - mouse.py;
      const dist = Math.hypot(dx, dy);
      mouse.px = nx;
      mouse.py = ny;
      mouse.moved = true;
      const now = performance.now();
      if (dist > 26 && now - lastSpawn > 110) {
        lastSpawn = now;
        spawnWave(nx, ny, Math.min(1, dist / 90));
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    resize();

    let raf = 0;
    let t0 = performance.now();
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const t = (now - t0) * 0.001;
      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;

      const mx = (mouse.x * 0.5 + 0.5) * w;
      const my = (mouse.y * 0.5 + 0.5) * h;
      const zone = Math.min(w, h) * 0.16;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const glow = ctx.createRadialGradient(mx, my, 6, mx, my, zone);
      glow.addColorStop(0, "rgba(249, 115, 22, 0.16)");
      glow.addColorStop(0.32, "rgba(249, 115, 22, 0.08)");
      glow.addColorStop(0.7, "rgba(28, 214, 172, 0.02)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(mx - zone, my - zone, zone * 2, zone * 2);

      for (let k = waves.length - 1; k >= 0; k -= 1) {
        const sw = waves[k];
        sw.r += sw.vr;
        sw.vr *= 0.985;
        sw.life -= 0.022;
        if (sw.r > sw.max || sw.life <= 0) {
          waves.splice(k, 1);
          continue;
        }
        const a = sw.life * 0.22;
        ctx.strokeStyle = `rgba(249, 115, 22, ${a})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < COUNT; i += 1) {
        const ox = (cx[i] * 0.5 + 0.5) * w;
        const oy = (cy[i] * 0.5 + 0.5) * h;
        const orbit = rad[i] * Math.min(w, h);
        const ang = phase[i] + t * spin[i];
        let x = ox + Math.cos(ang) * orbit;
        let y = oy + Math.sin(ang) * orbit * 0.7;

        const dxm = x - mx;
        const dym = y - my;
        const dm = Math.hypot(dxm, dym);
        const inZone = dm < zone;
        if (inZone) {
          const fall = 1 - dm / zone;
          const push = fall * fall;
          x += (-dym / (dm + 18)) * push * 5;
          y += (dxm / (dm + 18)) * push * 5;
        }

        for (let k = 0; k < waves.length; k += 1) {
          const sw = waves[k];
          const ddx = x - sw.x;
          const ddy = y - sw.y;
          const dsw = Math.hypot(ddx, ddy);
          const band = Math.abs(dsw - sw.r);
          if (band < 10 && dsw < sw.max) {
            const kick = (1 - band / 10) * 5 * sw.life;
            x += (ddx / (dsw + 0.001)) * kick;
            y += (ddy / (dsw + 0.001)) * kick;
          }
        }

        const near = inZone ? Math.pow(1 - dm / zone, 1.2) : 0;
        const heat = Math.min(1, mix[i] * 0.08 + near * 0.92);
        const r = 36 + heat * 210;
        const g = 248 - heat * 120;
        const b = 214 - heat * 175;
        const s = bit[i] + near * 1.1;
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${0.18 + mix[i] * 0.1})`;
        ctx.fillRect(x - s, y - s, s * 2, s * 2);
        ctx.fillStyle = `rgba(${Math.min(255, r + 50) | 0},${Math.min(255, g + 18) | 0},${Math.min(255, b + 24) | 0},${0.82 + near * 0.12})`;
        ctx.fillRect(x - s * 0.38, y - s * 0.38, s * 0.76, s * 0.76);
      }
      ctx.globalCompositeOperation = "source-over";
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      if (host.contains(canvas)) host.removeChild(canvas);
    };
  }, []);

  return <div ref={hostRef} className="wd-swarm" aria-hidden />;
}
