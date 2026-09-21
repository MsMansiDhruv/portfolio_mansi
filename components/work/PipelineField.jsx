"use client";

import { useEffect, useRef } from "react";

const PATHS = {
  ingest: "M 36 24 C 18 170 52 310 28 470 C 12 640 58 790 40 990",
  serve: "M 1404 36 C 1428 190 1388 330 1416 500 C 1436 670 1392 820 1410 990",
  cross: "M 40 34 C 420 18 980 48 1400 32",
  branchA: "M 36 430 C 120 400 150 470 36 510",
  branchB: "M 1404 430 C 1320 400 1280 500 1404 540",
  lake: "M 1288 640 L 1408 640 L 1408 760 L 1288 760 Z",
};

const KINDS = ["record", "batch", "schema", "json", "sql", "event", "row", "fail"];

function palette() {
  const day = document.documentElement.getAttribute("data-world-theme") === "day";
  return day
    ? { teal: "rgba(14,159,132,0.72)", orange: "rgba(249,115,22,0.7)", mute: "rgba(14,159,132,0.28)" }
    : { teal: "rgba(28,214,172,0.78)", orange: "rgba(249,115,22,0.78)", mute: "rgba(28,214,172,0.32)" };
}

function makePackets(n, lengths) {
  return Array.from({ length: n }, (_, i) => ({
    kind: KINDS[i % KINDS.length],
    path: i % 5 === 0 ? "cross" : i % 2 ? "serve" : "ingest",
    t: (i / n) % 1,
    speed: 0.018 + (i % 7) * 0.004,
    wait: 0,
  }));
}

export default function PipelineField() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 780px)").matches;
    if (reduced) return undefined;

    const host = root.closest(".wd-archive") || root;
    const ctx2d = canvas.getContext("2d", { alpha: true });
    const svg = root.querySelector(".wd-pipe__svg");
    const pathEls = {
      ingest: svg.querySelector("#wd-pipe-ingest"),
      serve: svg.querySelector("#wd-pipe-serve"),
      cross: svg.querySelector("#wd-pipe-cross"),
    };
    const lengths = {
      ingest: pathEls.ingest.getTotalLength(),
      serve: pathEls.serve.getTotalLength(),
      cross: pathEls.cross.getTotalLength(),
    };
    const count = mobile ? 10 : 28;
    const packets = makePackets(count, lengths);
    const mouse = { x: 0.5, y: 0.4, tx: 0.5, ty: 0.4, vx: 0, hot: 0, lastStorm: 0 };
    let w = 0;
    let h = 0;
    let running = true;
    let raf = 0;
    let last = performance.now();
    let ctx;
    let stage = "raw";

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const toCanvas = (pt) => {
      const box = svg.viewBox.baseVal;
      return { x: (pt.x / box.width) * w, y: (pt.y / box.height) * h };
    };

    const drawKind = (ctxd, kind, x, y, pal, a) => {
      ctxd.globalAlpha = a;
      ctxd.strokeStyle = kind === "fail" ? pal.orange : pal.teal;
      ctxd.fillStyle = kind === "event" ? pal.orange : pal.teal;
      ctxd.lineWidth = 1.1;
      if (kind === "batch") {
        ctxd.strokeRect(x - 5, y - 3, 10, 6);
      } else if (kind === "schema") {
        ctxd.beginPath();
        ctxd.moveTo(x, y - 4);
        ctxd.lineTo(x + 4, y);
        ctxd.lineTo(x, y + 4);
        ctxd.lineTo(x - 4, y);
        ctxd.closePath();
        ctxd.stroke();
      } else if (kind === "json") {
        ctxd.font = "9px ui-monospace, monospace";
        ctxd.fillText("{ }", x - 6, y + 3);
      } else if (kind === "sql") {
        ctxd.font = "8px ui-monospace, monospace";
        ctxd.fillText("SEL", x - 8, y + 3);
      } else if (kind === "event") {
        ctxd.beginPath();
        ctxd.arc(x, y, 2.2, 0, Math.PI * 2);
        ctxd.fill();
      } else if (kind === "row") {
        ctxd.fillRect(x - 6, y - 1, 12, 2);
      } else if (kind === "fail") {
        ctxd.beginPath();
        ctxd.arc(x, y, 3, 0, Math.PI * 2);
        ctxd.stroke();
      } else {
        ctxd.fillRect(x - 1.5, y - 1.5, 3, 3);
      }
    };

    const tick = (now) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      mouse.hot *= 0.96;
      const pal = palette();
      const align = stage === "gold" ? 0.92 : stage === "silver" ? 0.55 : 0.18;
      ctx2d.clearRect(0, 0, w, h);

      packets.forEach((p) => {
        if (p.wait > 0) {
          p.wait -= dt;
          return;
        }
        const len = lengths[p.path];
        const el = pathEls[p.path];
        if (!el) return;
        p.t += p.speed * dt * (stage === "raw" ? 0.7 : 1);
        if (p.t > 1) {
          p.t = 0;
          if (p.kind === "fail") p.path = "ingest";
        }
        if (stage !== "raw" && p.kind === "fail" && p.t > 0.45 && p.t < 0.55) {
          p.wait = 1.4;
        }
        const pt = toCanvas(el.getPointAtLength(p.t * len));
        const dx = mouse.x * w - pt.x;
        const dy = mouse.y * h - pt.y;
        const d2 = dx * dx + dy * dy;
        let ox = 0;
        let oy = 0;
        if (d2 < 140 * 140) {
          const pull = (1 - Math.sqrt(d2) / 140) * 10 * mouse.hot;
          ox = (dx / 140) * pull;
          oy = (dy / 140) * pull;
        }
        const jitter = (1 - align) * Math.sin(now * 0.003 + p.t * 12) * 4;
        drawKind(ctx2d, p.kind, pt.x + ox, pt.y + oy + jitter, pal, 0.55 + align * 0.25);
      });
      ctx2d.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
      mouse.hot = Math.min(1, mouse.hot + 0.12);
      const speed = Math.hypot(e.movementX, e.movementY);
      if (speed > 28 && nowSafe() - mouse.lastStorm > 1600) {
        mouse.lastStorm = nowSafe();
        packets.filter((_, i) => i % 6 === 0).forEach((p) => {
          p.wait = 0;
          p.speed = Math.min(0.08, p.speed * 1.8);
        });
        window.setTimeout(() => packets.forEach((p) => (p.speed = 0.018 + (p.t * 7) % 0.028)), 900);
      }
    };
    const nowSafe = () => performance.now();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          stage = entry.target.getAttribute("data-pipe-stage") || "raw";
          root.setAttribute("data-stage", stage);
        });
      },
      { threshold: 0.35 }
    );
    host.querySelectorAll("[data-pipe-stage]").forEach((el) => io.observe(el));

    const onHot = (e) => {
      const card = e.target.closest(".wd-archive__card");
      root.classList.toggle("is-card-hot", Boolean(card));
    };

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapMod, stMod]) => {
      if (!running) return;
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      gsap.config({ force3D: true, nullTargetWarn: false });

      ctx = gsap.context(() => {
        const layers = [
          [".wd-pipe__far", 0.05, 18],
          [".wd-pipe__struct", 0.15, 42],
          [".wd-pipe__live", 0.3, 28],
          [".wd-pipe__fore", 0.5, 64],
        ];
        const setters = layers.map(([sel, coeff]) => {
          const el = root.querySelector(sel);
          return {
            el,
            coeff,
            x: gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" }),
            y: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" }),
          };
        });

        const onPtr = (e) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          setters.forEach((s) => {
            s.x(nx * 36 * s.coeff);
            s.y(ny * 22 * s.coeff);
          });
        };
        window.addEventListener("pointermove", onPtr, { passive: true });

        gsap.to(".wd-pipe__schema", {
          rotationY: 8,
          y: 6,
          duration: 18,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          force3D: true,
        });

        gsap.to("#wd-pipe-cross", {
          attr: { d: "M 40 48 C 460 70 920 22 1400 56" },
          ease: "none",
          scrollTrigger: { trigger: host, start: "top top", end: "bottom bottom", scrub: 1.1 },
        });
        gsap.to(".wd-pipe__far", {
          y: 30,
          rotation: 1.2,
          ease: "none",
          force3D: true,
          scrollTrigger: { trigger: host, start: "top top", end: "bottom bottom", scrub: 1.4 },
        });
        gsap.to(".wd-pipe__struct", {
          x: -16,
          ease: "none",
          force3D: true,
          scrollTrigger: { trigger: host, start: "top top", end: "bottom bottom", scrub: 0.9 },
        });
        gsap.fromTo(
          ".wd-pipe__part",
          { y: 0 },
          {
            y: (i) => (i % 2 ? 10 : -8),
            ease: "none",
            stagger: 0.04,
            scrollTrigger: { trigger: host, start: "top top", end: "bottom bottom", scrub: 0.8 },
          }
        );

        root.querySelectorAll(".wd-pipe__node").forEach((node) => {
          node.addEventListener("pointerenter", () => {
            gsap.to(node, { scale: 1.35, duration: 0.35, ease: "power2.out", overwrite: "auto" });
            mouse.hot = 1;
            packets.slice(0, 4).forEach((p) => {
              p.t = 0.2;
              p.wait = 0;
            });
          });
          node.addEventListener("pointerleave", () => {
            gsap.to(node, { scale: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
          });
        });

        root._pipePtr = onPtr;
      }, root);
    });

    window.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerover", onHot);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => {
      running = document.visibilityState === "visible";
      if (running) raf = requestAnimationFrame(tick);
    });
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerover", onHot);
      window.removeEventListener("resize", resize);
      if (root._pipePtr) window.removeEventListener("pointermove", root._pipePtr);
      io.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <div className="wd-pipe" ref={rootRef} aria-hidden>
      <svg className="wd-pipe__svg" viewBox="0 0 1440 1000" preserveAspectRatio="none">
        <g className="wd-pipe__far">
          <path className="wd-pipe__grid" d="M 16 90 H 70 M 16 210 H 64 M 16 330 H 68 M 1370 130 H 1424 M 1376 280 H 1428" />
          <circle className="wd-pipe__ghost" cx="32" cy="96" r="14" />
          <circle className="wd-pipe__ghost" cx="1408" cy="148" r="16" />
        </g>
        <g className="wd-pipe__struct">
          <path id="wd-pipe-ingest" className="wd-pipe__cable" d={PATHS.ingest} />
          <path id="wd-pipe-serve" className="wd-pipe__cable" d={PATHS.serve} />
          <path id="wd-pipe-cross" className="wd-pipe__cable is-cross" d={PATHS.cross} />
          <path className="wd-pipe__cable is-branch" d={PATHS.branchA} />
          <path className="wd-pipe__cable is-branch" d={PATHS.branchB} />
          <circle className="wd-pipe__node" cx="36" cy="150" r="4.5" />
          <circle className="wd-pipe__node is-hot" cx="1404" cy="210" r="4.5" />
          <circle className="wd-pipe__node" cx="36" cy="430" r="4" />
          <circle className="wd-pipe__node is-hot" cx="1404" cy="430" r="4" />
          <circle className="wd-pipe__node" cx="36" cy="720" r="4" />
          <g className="wd-pipe__lake">
            <rect className="wd-pipe__part" x="1328" y="640" width="88" height="16" />
            <rect className="wd-pipe__part" x="1336" y="660" width="72" height="16" />
            <rect className="wd-pipe__part" x="1344" y="680" width="56" height="16" />
            <rect className="wd-pipe__part" x="1352" y="700" width="40" height="16" />
          </g>
        </g>
        <g className="wd-pipe__live">
          <g className="wd-pipe__schema" transform="translate(18 250)">
            <path className="wd-pipe__tree" d="M 10 0 V 54 M 10 18 H 28 M 10 36 H 34 M 28 18 V 28" />
          </g>
          <text className="wd-pipe__frag" x="14" y="390">CSV</text>
          <text className="wd-pipe__frag" x="12" y="412">JSON</text>
          <text className="wd-pipe__frag is-hot" x="10" y="434">EVENT</text>
          <text className="wd-pipe__frag" x="1368" y="300">JOIN</text>
          <text className="wd-pipe__frag is-hot" x="1358" y="322">GROUP</text>
        </g>
        <g className="wd-pipe__fore">
          <text className="wd-pipe__frag is-fore" x="12" y="56">RAW</text>
          <text className="wd-pipe__frag is-fore" x="1366" y="56">SERVE</text>
        </g>
      </svg>
      <canvas ref={canvasRef} className="wd-pipe__canvas" />
    </div>
  );
}
