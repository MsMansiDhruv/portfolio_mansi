"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;
uniform vec2 uMouse;
uniform float uDay;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float sdSeg(vec2 p, vec2 a, vec2 b){
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
  return length(pa - ba * h);
}

void main(){
  vec2 res = max(uRes, vec2(1.0));
  vec2 uv = gl_FragCoord.xy / res;
  float aspect = res.x / res.y;
  vec2 p = (uv * 2.0 - 1.0) * vec2(aspect, 1.0);
  vec2 m = vec2((uMouse.x * 2.0 - 1.0) * aspect, -(uMouse.y * 2.0 - 1.0));
  vec2 away = p - m;
  float md = length(away);
  p += normalize(away + vec2(0.0001)) * 0.018 * exp(-md * 2.8);
  p.y += uScroll * 0.42;
  p.x += uScroll * 0.06;

  vec2 cell = vec2(0.34, 0.26);
  vec2 gid = floor(p / cell);
  vec2 l = (p - gid * cell) / cell;
  float n = hash(gid);

  float d = sdSeg(l, vec2(-0.05, 0.30), vec2(0.46, 0.30));
  d = min(d, sdSeg(l, vec2(0.46, 0.30), vec2(0.46, 0.76)));
  d = min(d, sdSeg(l, vec2(0.46, 0.76), vec2(1.05, 0.76)));

  float pipe = smoothstep(0.026, 0.007, d);
  float hair = smoothstep(0.055, 0.018, d) * 0.18;
  float along = l.x * 0.7 + l.y * 0.5 + n;
  float pkt = smoothstep(0.07, 0.0, abs(fract(along * 2.1 - uTime * (0.08 + n * 0.06)) - 0.5));
  pkt *= pipe;

  float nodeA = smoothstep(0.055, 0.018, length(l - vec2(0.46, 0.30)));
  float nodeB = smoothstep(0.055, 0.018, length(l - vec2(0.46, 0.76)));
  float hex = max(nodeA, nodeB);
  float breath = 0.55 + 0.45 * sin(uTime * 1.7 + n * 6.28318);
  float warm = smoothstep(0.42, 0.72, l.y);

  vec3 teal = mix(vec3(0.11, 0.84, 0.67), vec3(0.05, 0.52, 0.44), uDay);
  vec3 org = vec3(0.98, 0.45, 0.09);
  vec3 ink = mix(vec3(0.027, 0.035, 0.031), vec3(0.957, 0.945, 0.918), uDay);
  vec3 line = mix(teal, org, warm);
  vec3 col = ink;
  col += line * (hair + pipe * 0.42);
  col += line * pkt * 0.85;
  col += mix(teal, org, warm) * hex * breath * 0.7;
  col += mix(teal, org, 0.45) * exp(-md * md * 6.0) * 0.16;
  float quiet = smoothstep(0.12, 0.62, length((uv - vec2(0.32, 0.28)) * vec2(1.35, 1.15)));
  col = mix(ink, col, mix(0.28, 1.0, quiet));
  col = mix(ink, col, mix(0.28, 1.0, quiet));
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    return null;
  }
  return sh;
}

export default function ParticleAssets() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.4, tx: 0.5, ty: 0.4 });
  const scroll = useRef(0);
  const lenis = useLenis();

  useEffect(() => {
    const fn = (e) => {
      scroll.current = e.limit ? e.scroll / e.limit : 0;
    };
    lenis?.on("scroll", fn);
    return () => lenis?.off("scroll", fn);
  }, [lenis]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "high-performance" });
    if (!gl) return undefined;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return undefined;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return undefined;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uScroll = gl.getUniformLocation(prog, "uScroll");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uDay = gl.getUniformLocation(prog, "uDay");
    const start = performance.now();
    let raf = 0;
    let live = true;

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const onMove = (e) => {
      mouse.current.tx = e.clientX / window.innerWidth;
      mouse.current.ty = e.clientY / window.innerHeight;
    };

    let xTo;
    let yTo;
    let gsapCtx;
    import("gsap").then((mod) => {
      const gsap = mod.gsap;
      gsapCtx = gsap.context(() => {
        xTo = gsap.quickTo(mouse.current, "x", { duration: 0.7, ease: "power3" });
        yTo = gsap.quickTo(mouse.current, "y", { duration: 0.7, ease: "power3" });
      });
    });

    const move = (e) => {
      onMove(e);
      xTo?.(mouse.current.tx);
      yTo?.(mouse.current.ty);
    };

    const tick = (now) => {
      if (!live) return;
      if (!xTo) {
        mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.08;
        mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.08;
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform1f(uScroll, scroll.current);
      gl.uniform2f(uMouse, mouse.current.x, mouse.current.y);
      const day = document.documentElement.getAttribute("data-world-theme") === "day" ? 1 : 0;
      gl.uniform1f(uDay, day);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => {
      live = document.visibilityState === "visible";
      if (live) raf = requestAnimationFrame(tick);
    });
    raf = requestAnimationFrame(tick);

    return () => {
      live = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
      gsapCtx?.revert();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className="wd-lattice" aria-hidden />;
}
