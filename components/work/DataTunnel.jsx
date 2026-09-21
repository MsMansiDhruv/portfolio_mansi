"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;
uniform vec3 uInk;
uniform vec3 uTeal;
uniform vec3 uOrange;
void main(){
  vec2 p = (gl_FragCoord.xy / uRes) * 2.0 - 1.0;
  p.x *= uRes.x / uRes.y;
  float r = length(p);
  float a = atan(p.y, p.x);
  float z = 0.85 / (r + 0.12) + uScroll * 3.6 + uTime * 0.22;
  float rings = 1.0 - smoothstep(0.0, 0.07, abs(fract(z) - 0.5));
  float lanes = 1.0 - smoothstep(0.0, 0.09, abs(fract(a * 2.546 + z * 0.18) - 0.5));
  float fog = smoothstep(0.12, 1.35, r);
  vec3 col = uInk;
  col += uTeal * rings * 0.42 * fog;
  col += uOrange * lanes * 0.16 * fog;
  float core = smoothstep(0.18, 0.0, r);
  col += mix(uTeal, uOrange, 0.35) * core * 0.55;
  gl_FragColor = vec4(col, 0.92);
}
`;

const PVERT = `
attribute vec3 pos;
uniform float uTime;
uniform float uScroll;
uniform float uAspect;
varying float vA;
void main(){
  float z = fract(pos.z + uTime * 0.08 + uScroll * 0.55);
  float depth = z * 2.6 + 0.18;
  vec2 xy = pos.xy / depth;
  xy.x /= uAspect;
  float dir = pos.y > 0.0 ? 1.0 : -1.0;
  xy += vec2(sin(uTime * 0.4 + pos.x * 8.0), cos(uTime * 0.3 + pos.y * 6.0)) * 0.012 * dir;
  gl_Position = vec4(xy, 0.0, 1.0);
  gl_PointSize = mix(1.4, 5.2, 1.0 - z);
  vA = mix(0.15, 0.95, 1.0 - z);
}
`;

const PFRAG = `
precision mediump float;
uniform vec3 uTeal;
uniform vec3 uOrange;
varying float vA;
void main(){
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float d = dot(p, p);
  if (d > 1.0) discard;
  vec3 c = mix(uTeal, uOrange, gl_PointCoord.x);
  gl_FragColor = vec4(c, vA * (1.0 - d));
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

function hexRgb(hex) {
  const n = hex.replace("#", "");
  return [
    parseInt(n.slice(0, 2), 16) / 255,
    parseInt(n.slice(2, 4), 16) / 255,
    parseInt(n.slice(4, 6), 16) / 255,
  ];
}

function themeColors() {
  const day = document.documentElement.getAttribute("data-world-theme") === "day";
  return day
    ? { ink: hexRgb("f4f1ea"), teal: hexRgb("0e9f84"), orange: hexRgb("f97316") }
    : { ink: hexRgb("070908"), teal: hexRgb("1cd6ac"), orange: hexRgb("f97316") };
}

export default function DataTunnel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) return undefined;

    const tunnelProg = gl.createProgram();
    gl.attachShader(tunnelProg, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(tunnelProg, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(tunnelProg);

    const particleProg = gl.createProgram();
    gl.attachShader(particleProg, compile(gl, gl.VERTEX_SHADER, PVERT));
    gl.attachShader(particleProg, compile(gl, gl.FRAGMENT_SHADER, PFRAG));
    gl.linkProgram(particleProg);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const COUNT = 720;
    const data = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const rad = 0.22 + Math.random() * 0.78;
      data[i * 3] = Math.cos(a) * rad;
      data[i * 3 + 1] = Math.sin(a) * rad;
      data[i * 3 + 2] = Math.random();
    }
    const particles = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, particles);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const locA = gl.getAttribLocation(tunnelProg, "a");
    const locPos = gl.getAttribLocation(particleProg, "pos");
    let w = 0;
    let h = 0;
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const tick = (now) => {
      const t = (now - start) / 1000;
      const host = canvas.closest(".wd-archive") || document.documentElement;
      const scroll = Number.parseFloat(getComputedStyle(host).getPropertyValue("--wd-tunnel")) || 0;
      const { ink, teal, orange } = themeColors();

      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(tunnelProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(locA);
      gl.vertexAttribPointer(locA, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(gl.getUniformLocation(tunnelProg, "uRes"), canvas.width, canvas.height);
      gl.uniform1f(gl.getUniformLocation(tunnelProg, "uTime"), t);
      gl.uniform1f(gl.getUniformLocation(tunnelProg, "uScroll"), scroll);
      gl.uniform3fv(gl.getUniformLocation(tunnelProg, "uInk"), ink);
      gl.uniform3fv(gl.getUniformLocation(tunnelProg, "uTeal"), teal);
      gl.uniform3fv(gl.getUniformLocation(tunnelProg, "uOrange"), orange);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.useProgram(particleProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, particles);
      gl.enableVertexAttribArray(locPos);
      gl.vertexAttribPointer(locPos, 3, gl.FLOAT, false, 0, 0);
      gl.uniform1f(gl.getUniformLocation(particleProg, "uTime"), t);
      gl.uniform1f(gl.getUniformLocation(particleProg, "uScroll"), scroll);
      gl.uniform1f(gl.getUniformLocation(particleProg, "uAspect"), w / Math.max(h, 1));
      gl.uniform3fv(gl.getUniformLocation(particleProg, "uTeal"), teal);
      gl.uniform3fv(gl.getUniformLocation(particleProg, "uOrange"), orange);
      gl.drawArrays(gl.POINTS, 0, COUNT);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className="wd-tunnel" aria-hidden />;
}
