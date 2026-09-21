"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";
import "./Threads.css";

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;
uniform float uY;
#define PI 3.1415926538
const int u_line_count = 48;
const float u_line_width = 16.0;
const float u_line_blur = 14.0;

float Perlin2D(vec2 P) {
  vec2 Pi = floor(P);
  vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
  vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
  Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
  Pt += vec2(26.0, 161.0).xyxy;
  Pt *= Pt;
  Pt = Pt.xzxz * Pt.yyww;
  vec4 hash_x = fract(Pt * (1.0 / 951.135664));
  vec4 hash_y = fract(Pt * (1.0 / 642.949883));
  vec4 grad_x = hash_x - 0.49999;
  vec4 grad_y = hash_y - 0.49999;
  vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
    * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
  grad_results *= 1.4142135623730950;
  vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
    * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
  vec4 blend2 = vec4(blend, vec2(1.0 - blend));
  return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float pixel(float count, vec2 resolution) {
  return (1.0 / max(resolution.x, resolution.y)) * count;
}

float lineFn(vec2 st, float width, float perc, vec2 mouse, float time, float amplitude, float distance) {
  float split_offset = (perc * 0.4);
  float split_point = 0.1 + split_offset;
  float amplitude_normal = smoothstep(split_point, 0.7, st.x);
  float finalAmplitude = amplitude_normal * 0.5 * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);
  float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
  float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;
  float xnoise = mix(
    Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
    Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
    st.x * 0.3
  );
  float y = uY + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;
  float line_start = smoothstep(
    y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
    y, st.y
  );
  float line_end = smoothstep(
    y,
    y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
    st.y
  );
  return clamp((line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))), 0.0, 1.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  float line_strength = 1.0;
  for (int i = 0; i < u_line_count; i++) {
    float p = float(i) / float(u_line_count);
    line_strength *= (1.0 - lineFn(
      uv, u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p), p, uMouse, iTime, uAmplitude, uDistance
    ));
  }
  float colorVal = 1.0 - line_strength;
  fragColor = vec4(uColor * colorVal, colorVal);
}

void main() {
  vec2 coord = gl_FragCoord.xy;
  coord.y = iResolution.y - coord.y;
  mainImage(gl_FragColor, coord);
}
`;

export default function Threads({
  color = [0.11, 0.84, 0.67],
  amplitude = 1,
  distance = 0.18,
  enableMouseInteraction = true,
  yCenter = 0.5,
  className = "",
  ...rest
}) {
  const containerRef = useRef(null);
  const animationFrameId = useRef(0);
  const propsRef = useRef({ color, amplitude, distance, enableMouseInteraction, yCenter });
  propsRef.current = { color, amplitude, distance, enableMouseInteraction, yCenter };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        powerPreference: "high-performance",
      });
    } catch {
      return undefined;
    }

    const gl = renderer?.gl;
    if (!gl) return undefined;

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    container.appendChild(gl.canvas);

    let geometry;
    let program;
    let mesh;
    try {
      geometry = new Triangle(gl);
      program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          iTime: { value: 0 },
          iResolution: {
            value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
          },
          uColor: { value: new Color(...propsRef.current.color) },
          uAmplitude: { value: propsRef.current.amplitude },
          uDistance: { value: propsRef.current.distance },
          uMouse: { value: new Float32Array([0.5, 0.5]) },
          uY: { value: propsRef.current.yCenter },
        },
      });
      mesh = new Mesh(gl, { geometry, program });
    } catch {
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return undefined;
    }

    function resize() {
      const width = Math.max(container.clientWidth, window.innerWidth, 2);
      const height = Math.max(container.clientHeight, window.innerHeight, 2);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.dpr = dpr;
      renderer.setSize(width, height);
      program.uniforms.iResolution.value.r = gl.canvas.width;
      program.uniforms.iResolution.value.g = gl.canvas.height;
      program.uniforms.iResolution.value.b = gl.canvas.width / gl.canvas.height;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("resize", resize);
    resize();

    const currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetMouse = [(e.clientX - rect.left) / rect.width, 1.0 - (e.clientY - rect.top) / rect.height];
    };
    const handleMouseLeave = () => {
      targetMouse = [0.5, 0.5];
    };
    window.addEventListener("pointermove", handleMouseMove, { passive: true });
    window.addEventListener("pointerleave", handleMouseLeave);

    let isVisible = true;

    const update = (t) => {
      animationFrameId.current = requestAnimationFrame(update);
      if (!isVisible || document.hidden) return;
      try {
        const next = propsRef.current;
        const ink = program.uniforms.uColor.value;
        ink.r = next.color[0];
        ink.g = next.color[1];
        ink.b = next.color[2];
        program.uniforms.uAmplitude.value = next.amplitude;
        program.uniforms.uDistance.value = next.distance;
        program.uniforms.uY.value = next.yCenter;
        if (next.enableMouseInteraction) {
          currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
          currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
          program.uniforms.uMouse.value[0] = currentMouse[0];
          program.uniforms.uMouse.value[1] = currentMouse[1];
        } else {
          program.uniforms.uMouse.value[0] = 0.5;
          program.uniforms.uMouse.value[1] = 0.5;
        }
        program.uniforms.iTime.value = t * 0.001;
        renderer.render({ scene: mesh });
      } catch {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMouseMove);
      window.removeEventListener("pointerleave", handleMouseLeave);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      try {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        /* ignore */
      }
    };
  }, []);

  return <div ref={containerRef} className={`threads-container${className ? ` ${className}` : ""}`} {...rest} />;
}
