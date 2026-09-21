"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { buildPortraitCloud, REGION } from "@/lib/particle-portrait/buildFaceCloud";
import { buildGlbPortraitCloud } from "@/lib/particle-portrait/buildGlbPortraitCloud";
import { THEME } from "@/lib/data/data-world";

const TEXTURED_GLB_SRC = "/lab/mansi-textured.glb";

const portraitMeshVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorld = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const portraitMeshFrag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 34.45);
    return fract(p.x * p.y);
  }

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float luma = dot(tex.rgb, vec3(0.2126, 0.7152, 0.0722));
    if (luma > 0.93) discard;

    vec3 charcoal = vec3(0.07, 0.09, 0.12);
    vec3 shade = vec3(0.26, 0.32, 0.4);
    vec3 steel = vec3(0.67, 0.76, 0.86);
    vec3 ivory = vec3(0.95, 0.94, 0.9);
    vec3 gold = vec3(0.98, 0.8, 0.53);

    float breakup = hash21(vUv * vec2(920.0, 1280.0) + vWorld.xy * 10.0);
    float feature = 0.0;
    feature = max(feature, exp(-pow(vUv.x - 0.387, 2.0) * 240.0 - pow(vUv.y - 0.47, 2.0) * 300.0));
    feature = max(feature, exp(-pow(vUv.x - 0.676, 2.0) * 240.0 - pow(vUv.y - 0.432, 2.0) * 300.0));
    feature = max(feature, exp(-pow(vUv.x - 0.505, 2.0) * 170.0 - pow(vUv.y - 0.54, 2.0) * 82.0));
    feature = max(feature, exp(-pow(vUv.x - 0.535, 2.0) * 110.0 - pow(vUv.y - 0.688, 2.0) * 190.0));

    float goldMask = 0.0;
    goldMask += exp(-pow(vUv.x - 0.505, 2.0) * 90.0 - pow(vUv.y - 0.5, 2.0) * 40.0) * 0.7;
    goldMask += exp(-pow(vUv.x - 0.64, 2.0) * 40.0 - pow(vUv.y - 0.52, 2.0) * 25.0) * 0.35;
    goldMask += exp(-pow(vUv.x - 0.54, 2.0) * 75.0 - pow(vUv.y - 0.686, 2.0) * 180.0) * 0.45;
    goldMask += exp(-pow(vUv.x - 0.53, 2.0) * 26.0 - pow(vUv.y - 0.33, 2.0) * 120.0) * 0.28;
    goldMask += max(0.0, abs(vUv.x - 0.52) - 0.18) * 0.42;
    goldMask += smoothstep(0.08, 0.0, distance(vUv, vec2(0.49, 0.16))) * 0.5;
    goldMask = clamp(goldMask, 0.0, 1.0);

    vec3 base = mix(charcoal, shade, smoothstep(0.12, 0.28, luma));
    base = mix(base, steel, smoothstep(0.26, 0.62, luma));
    base = mix(base, ivory, smoothstep(0.54, 0.86, luma));
    base = mix(base, gold, goldMask * smoothstep(0.34, 0.84, luma));

    float stipple = smoothstep(0.08, 0.92, breakup + feature * 0.22);
    float alpha = 0.0;
    alpha = mix(0.18, 0.72, smoothstep(0.18, 0.82, luma));
    alpha += feature * 0.22;
    alpha += goldMask * 0.18;
    alpha *= stipple;
    alpha *= 0.92 + max(vNormal.z, 0.0) * 0.08;
    if (alpha < 0.08) discard;

    gl_FragColor = vec4(base, alpha);
  }
`;

function TexturedIdentityMesh({ reducedMotion }) {
  const [payload, setPayload] = useState(null);
  const mat = useRef();

  useEffect(() => {
    let alive = true;
    const loader = new GLTFLoader();
    loader.load(
      TEXTURED_GLB_SRC,
      (gltf) => {
        if (!alive) return;
        let mesh = null;
        gltf.scene.updateMatrixWorld(true);
        gltf.scene.traverse((obj) => {
          if (!mesh && obj.isMesh && obj.geometry?.attributes?.position) mesh = obj;
        });
        if (!mesh) return;
        const geometry = mesh.geometry.clone();
        geometry.applyMatrix4(mesh.matrixWorld);
        geometry.computeVertexNormals();
        const box = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const scale = 2.42 / Math.max(size.x, size.y, size.z);
        const pos = geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          pos.setXYZ(
            i,
            (pos.getX(i) - center.x) * scale,
            (pos.getY(i) - center.y) * scale - 0.06,
            (pos.getZ(i) - center.z) * scale * 0.92
          );
        }
        pos.needsUpdate = true;
        geometry.computeVertexNormals();
        const map = mesh.material?.map || mesh.material?.emissiveMap || null;
        if (map) {
          map.flipY = false;
          map.needsUpdate = true;
        }
        setPayload({ geometry, map });
      },
      undefined,
      () => {}
    );
    return () => {
      alive = false;
    };
  }, []);

  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
  });

  if (!payload?.geometry || !payload?.map) return null;

  return (
    <mesh geometry={payload.geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={portraitMeshVert}
        fragmentShader={portraitMeshFrag}
        uniforms={{
          uMap: { value: payload.map },
          uTime: { value: 0 },
        }}
        transparent
        depthWrite={false}
        depthTest
        toneMapped={false}
      />
    </mesh>
  );
}

function filterIdentityCloud(cloud) {
  if (!cloud?.count) return null;
  const keep = [];
  for (let i = 0; i < cloud.count; i++) {
    const region = cloud.regions[i];
    const roll = Math.sin((i + 1) * 63.173) * 43758.5453;
    const slot = roll - Math.floor(roll);
    if (region >= REGION.EYES && region <= REGION.JAW) keep.push(i);
    else if (region === REGION.FACE && slot > 0.55) keep.push(i);
  }
  if (!keep.length) return null;
  const next = {
    positions: new Float32Array(keep.length * 3),
    colors: new Float32Array(keep.length * 3),
    sizes: new Float32Array(keep.length),
    phases: new Float32Array(keep.length),
    regions: new Float32Array(keep.length),
    scatter: new Float32Array(keep.length * 3),
    lock: new Float32Array(keep.length),
    count: keep.length,
  };
  keep.forEach((srcIndex, dstIndex) => {
    const region = cloud.regions[srcIndex];
    let sizeScale = 1;
    if (region === REGION.EYES) sizeScale = 1.42;
    else if (region === REGION.NOSE) sizeScale = 1.26;
    else if (region === REGION.MOUTH) sizeScale = 1.38;
    else if (region === REGION.JAW) sizeScale = 1.12;
    else if (region === REGION.FACE) sizeScale = 0.96;
    next.positions[dstIndex * 3 + 0] = cloud.positions[srcIndex * 3 + 0];
    next.positions[dstIndex * 3 + 1] = cloud.positions[srcIndex * 3 + 1];
    next.positions[dstIndex * 3 + 2] = cloud.positions[srcIndex * 3 + 2];
    next.colors[dstIndex * 3 + 0] = cloud.colors[srcIndex * 3 + 0];
    next.colors[dstIndex * 3 + 1] = cloud.colors[srcIndex * 3 + 1];
    next.colors[dstIndex * 3 + 2] = cloud.colors[srcIndex * 3 + 2];
    next.sizes[dstIndex] = cloud.sizes[srcIndex] * sizeScale;
    next.phases[dstIndex] = cloud.phases[srcIndex];
    next.regions[dstIndex] = cloud.regions[srcIndex];
    next.scatter[dstIndex * 3 + 0] = cloud.scatter[srcIndex * 3 + 0];
    next.scatter[dstIndex * 3 + 1] = cloud.scatter[srcIndex * 3 + 1];
    next.scatter[dstIndex * 3 + 2] = cloud.scatter[srcIndex * 3 + 2];
    next.lock[dstIndex] = cloud.lock[srcIndex];
  });
  return next;
}

function refineHeroCloud(cloud) {
  if (!cloud?.count) return null;
  const keep = [];
  for (let i = 0; i < cloud.count; i++) {
    const region = cloud.regions[i];
    const roll = Math.sin((i + 1) * 91.173) * 43758.5453;
    const slot = roll - Math.floor(roll);
    let keepPoint = true;
    if (region === REGION.SHOULDER) keepPoint = slot > 0.62;
    else if (region === REGION.NECK) keepPoint = slot > 0.42;
    else if (region === REGION.FIELD) keepPoint = slot > 0.48;
    else if (region === REGION.FACE) keepPoint = slot > 0.16;
    else if (region === REGION.HAIR) keepPoint = slot > 0.12;
    else if (region === REGION.BUN) keepPoint = slot > 0.08;
    if (keepPoint) keep.push(i);
  }
  const next = {
    positions: new Float32Array(keep.length * 3),
    colors: new Float32Array(keep.length * 3),
    sizes: new Float32Array(keep.length),
    phases: new Float32Array(keep.length),
    regions: new Float32Array(keep.length),
    scatter: new Float32Array(keep.length * 3),
    lock: new Float32Array(keep.length),
    count: keep.length,
  };
  keep.forEach((srcIndex, dstIndex) => {
    const region = cloud.regions[srcIndex];
    let sizeScale = 1;
    if (region >= REGION.EYES && region <= REGION.MOUTH) sizeScale = 1.16;
    else if (region === REGION.JAW) sizeScale = 1.08;
    else if (region === REGION.FACE) sizeScale = 0.94;
    else if (region === REGION.HAIR || region === REGION.BUN) sizeScale = 0.92;
    else if (region === REGION.NECK) sizeScale = 0.78;
    else if (region === REGION.SHOULDER || region === REGION.FIELD) sizeScale = 0.7;
    next.positions[dstIndex * 3 + 0] = cloud.positions[srcIndex * 3 + 0];
    next.positions[dstIndex * 3 + 1] = cloud.positions[srcIndex * 3 + 1];
    next.positions[dstIndex * 3 + 2] = cloud.positions[srcIndex * 3 + 2];
    next.colors[dstIndex * 3 + 0] = cloud.colors[srcIndex * 3 + 0];
    next.colors[dstIndex * 3 + 1] = cloud.colors[srcIndex * 3 + 1];
    next.colors[dstIndex * 3 + 2] = cloud.colors[srcIndex * 3 + 2];
    next.sizes[dstIndex] = cloud.sizes[srcIndex] * sizeScale;
    next.phases[dstIndex] = cloud.phases[srcIndex];
    next.regions[dstIndex] = cloud.regions[srcIndex];
    next.scatter[dstIndex * 3 + 0] = cloud.scatter[srcIndex * 3 + 0];
    next.scatter[dstIndex * 3 + 1] = cloud.scatter[srcIndex * 3 + 1];
    next.scatter[dstIndex * 3 + 2] = cloud.scatter[srcIndex * 3 + 2];
    next.lock[dstIndex] = cloud.lock[srcIndex];
  });
  return next;
}

function refinePhotoHeroCloud(cloud) {
  if (!cloud?.count) return null;
  const keep = [];
  for (let i = 0; i < cloud.count; i++) {
    const region = cloud.regions[i];
    const roll = Math.sin((i + 1) * 41.173) * 43758.5453;
    const slot = roll - Math.floor(roll);
    let keepPoint = true;
    if (region === REGION.SHOULDER) keepPoint = slot > 0.8;
    else if (region === REGION.NECK) keepPoint = slot > 0.58;
    else if (region === REGION.HAIR || region === REGION.BUN) keepPoint = slot > 0.08;
    else if (region === REGION.FACE) keepPoint = slot > 0.015;
    if (keepPoint) keep.push(i);
  }
  const next = {
    positions: new Float32Array(keep.length * 3),
    colors: new Float32Array(keep.length * 3),
    sizes: new Float32Array(keep.length),
    phases: new Float32Array(keep.length),
    regions: new Float32Array(keep.length),
    scatter: new Float32Array(keep.length * 3),
    lock: new Float32Array(keep.length),
    count: keep.length,
  };
  keep.forEach((srcIndex, dstIndex) => {
    const region = cloud.regions[srcIndex];
    let sizeScale = 1;
    if (region === REGION.EYES) sizeScale = 1.42;
    else if (region === REGION.NOSE) sizeScale = 1.3;
    else if (region === REGION.MOUTH) sizeScale = 1.4;
    else if (region === REGION.JAW) sizeScale = 1.18;
    else if (region === REGION.FACE) sizeScale = 1.12;
    else if (region === REGION.HAIR || region === REGION.BUN) sizeScale = 0.98;
    else if (region === REGION.NECK) sizeScale = 0.82;
    else if (region === REGION.SHOULDER) sizeScale = 0.72;
    next.positions[dstIndex * 3 + 0] = cloud.positions[srcIndex * 3 + 0];
    next.positions[dstIndex * 3 + 1] = cloud.positions[srcIndex * 3 + 1];
    next.positions[dstIndex * 3 + 2] = cloud.positions[srcIndex * 3 + 2];
    next.colors[dstIndex * 3 + 0] = cloud.colors[srcIndex * 3 + 0];
    next.colors[dstIndex * 3 + 1] = cloud.colors[srcIndex * 3 + 1];
    next.colors[dstIndex * 3 + 2] = cloud.colors[srcIndex * 3 + 2];
    next.sizes[dstIndex] = cloud.sizes[srcIndex] * sizeScale;
    next.phases[dstIndex] = cloud.phases[srcIndex];
    next.regions[dstIndex] = cloud.regions[srcIndex];
    next.scatter[dstIndex * 3 + 0] = cloud.scatter[srcIndex * 3 + 0];
    next.scatter[dstIndex * 3 + 1] = cloud.scatter[srcIndex * 3 + 1];
    next.scatter[dstIndex * 3 + 2] = cloud.scatter[srcIndex * 3 + 2];
    next.lock[dstIndex] = cloud.lock[srcIndex];
  });
  return next;
}

function buildGoldHighlightCloud(cloud) {
  if (!cloud?.count) return null;
  const keep = [];
  for (let i = 0; i < cloud.count; i++) {
    const r = cloud.colors[i * 3 + 0];
    const g = cloud.colors[i * 3 + 1];
    const b = cloud.colors[i * 3 + 2];
    const warm = r > 0.84 && g > 0.62 && b < 0.66;
    if (warm) keep.push(i);
  }
  if (!keep.length) return null;
  const next = {
    positions: new Float32Array(keep.length * 3),
    colors: new Float32Array(keep.length * 3),
    sizes: new Float32Array(keep.length),
    phases: new Float32Array(keep.length),
    regions: new Float32Array(keep.length),
    scatter: new Float32Array(keep.length * 3),
    lock: new Float32Array(keep.length),
    count: keep.length,
  };
  keep.forEach((srcIndex, dstIndex) => {
    next.positions[dstIndex * 3 + 0] = cloud.positions[srcIndex * 3 + 0];
    next.positions[dstIndex * 3 + 1] = cloud.positions[srcIndex * 3 + 1];
    next.positions[dstIndex * 3 + 2] = cloud.positions[srcIndex * 3 + 2];
    next.colors[dstIndex * 3 + 0] = Math.min(1, cloud.colors[srcIndex * 3 + 0] * 1.06);
    next.colors[dstIndex * 3 + 1] = Math.min(1, cloud.colors[srcIndex * 3 + 1] * 1.02);
    next.colors[dstIndex * 3 + 2] = cloud.colors[srcIndex * 3 + 2] * 0.82;
    next.sizes[dstIndex] = cloud.sizes[srcIndex] * 1.24;
    next.phases[dstIndex] = cloud.phases[srcIndex];
    next.regions[dstIndex] = cloud.regions[srcIndex];
    next.scatter[dstIndex * 3 + 0] = cloud.scatter[srcIndex * 3 + 0];
    next.scatter[dstIndex * 3 + 1] = cloud.scatter[srcIndex * 3 + 1];
    next.scatter[dstIndex * 3 + 2] = cloud.scatter[srcIndex * 3 + 2];
    next.lock[dstIndex] = cloud.lock[srcIndex];
  });
  return next;
}

function grainMap() {
  const c = document.createElement("canvas");
  c.width = 28;
  c.height = 28;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, 28, 28);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(14, 14, 4.1, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.generateMipmaps = false;
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

const HERO_ROUTES = [
  {
    id: "work",
    label: "WORK",
    detail: "Project systems waking",
    color: "accent",
    labelPos: [1.26, 0.06, 0.14],
    semantic: null,
    points: [
      [0.1, 0.98, -0.24],
      [0.82, 0.52, -0.48],
      [1.58, 0.14, -0.06],
      [1.98, -0.04, 0.32],
    ],
  },
  {
    id: "ai",
    label: "AI LAB",
    detail: "Semantic field responding",
    color: "data",
    labelPos: [0.98, 0.54, -0.18],
    semantic: ["REASON", "SYSTEM", "DATA"],
    points: [
      [0.42, 0.92, -0.18],
      [0.7, 0.66, -0.72],
      [1.06, 0.46, -0.42],
      [1.42, 0.3, -0.18],
    ],
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    detail: "Temporal systems preview",
    color: "steel",
    labelPos: [-1.5, 0.12, -0.3],
    semantic: null,
    points: [
      [-0.26, 0.58, 0.26],
      [-0.82, 0.42, 0.2],
      [-1.34, 0.24, -0.08],
      [-1.76, 0.02, -0.36],
    ],
  },
  {
    id: "about",
    label: "ABOUT",
    detail: "Human signal remains",
    color: "ivory",
    labelPos: [-1.12, 0.72, -0.14],
    semantic: ["HUMAN", "INTELLIGENCE"],
    points: [
      [-0.22, 1.06, -0.18],
      [-0.62, 1.08, -0.12],
      [-0.96, 0.92, -0.08],
      [-1.2, 0.74, -0.14],
    ],
  },
  {
    id: "contact",
    label: "CONTACT",
    detail: "Final signal convergence",
    color: "teal",
    labelPos: [0.24, -1.18, 0.08],
    semantic: null,
    points: [
      [0.22, -0.18, 0.3],
      [0.42, -0.52, 0.18],
      [0.38, -0.9, 0.1],
      [0.24, -1.16, 0.08],
    ],
  },
];

const vert = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aRegion;
  attribute float aLock;
  attribute vec3 aScatter;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec3 uCursor;
  uniform float uCursorStrength;
  uniform float uMotion;
  uniform float uReveal;
  uniform float uPointScale;
  uniform float uAlphaScale;
  uniform float uFrontOnly;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLock;
  varying float vRegion;

  void main() {
    vec3 p = position;
    float amp = 0.0022 * uMotion;
    if (aRegion >= 1.0 && aRegion <= 2.0) amp = 0.006;
    if (aRegion >= 8.0) amp = 0.009;
    if (aRegion <= 6.0) amp *= 0.42;

    p.x += sin(uTime * 0.2 + aPhase * 6.2831) * amp;
    p.y += cos(uTime * 0.16 + aPhase * 5.17) * amp * 0.85;
    p.z += sin(uTime * 0.12 + aPhase * 4.0) * amp * 0.6;

    vec3 field = aScatter;
    float fieldMix = smoothstep(0.0, 1.0, uReveal) * (1.0 - aLock) * 0.08;
    p = mix(p, field, fieldMix);

    vec2 d = p.xy - uCursor.xy;
    float dist = length(d);
    float cursorFalloff = smoothstep(0.85, 0.04, dist);
    float deform = mix(0.01, 0.045, 1.0 - aLock);
    p.xy += normalize(d + 0.0001) * cursorFalloff * uCursorStrength * -deform;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depthBoost = clamp(1.1 + mv.z * 0.03, 0.84, 1.18);
    float regionScale = 1.0;
    float warmMask = smoothstep(0.72, 0.92, color.r) * smoothstep(0.56, 0.82, color.g) * (1.0 - smoothstep(0.7, 0.92, color.b));
    if (aRegion >= 3.0 && aRegion <= 5.0) regionScale = 1.22;
    else if (aRegion == 6.0) regionScale = 1.1;
    else if (aRegion == 0.0) regionScale = 1.08;
    else if (aRegion == 1.0 || aRegion == 2.0) regionScale = 0.92;
    else if (aRegion >= 7.0) regionScale = 0.88;
    regionScale += warmMask * 0.24;
    gl_PointSize = max(0.72, aSize * regionScale * uPointScale * uPixelRatio * depthBoost);

    float alpha = 1.0;
    if (aRegion >= 8.0) alpha = 0.48;
    if (aRegion >= 10.0) alpha = 0.24;
    if (aRegion >= 11.0) alpha = 0.9;
    vAlpha = alpha * uAlphaScale;
    vColor = color;
    vLock = aLock;
    vRegion = aRegion;
  }
`;

const frag = /* glsl */ `
  uniform sampler2D uMap;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLock;
  varying float vRegion;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    if (tex.a < 0.52) discard;
    float falloff = smoothstep(0.18, 0.86, tex.a);
    float luminance = dot(vColor, vec3(0.2126, 0.7152, 0.0722));
    float contrast = smoothstep(0.16, 0.88, luminance);
    vec3 tone = mix(vColor * 0.88, vColor * 1.2, vLock);
    tone = mix(tone, tone * 1.1, contrast * 0.42);
    float warmMask = smoothstep(0.72, 0.92, vColor.r) * smoothstep(0.56, 0.8, vColor.g) * (1.0 - smoothstep(0.7, 0.92, vColor.b));
    tone = mix(tone, tone * 1.52 + vec3(0.12, 0.05, 0.0), warmMask);
    float alphaBoost = 1.0;
    if (vRegion >= 3.0 && vRegion <= 5.0) alphaBoost = 1.36;
    else if (vRegion == 6.0) alphaBoost = 1.14;
    else if (vRegion == 0.0) alphaBoost = 1.08;
    else if (vRegion == 1.0 || vRegion == 2.0) alphaBoost = 0.84;
    else if (vRegion >= 7.0) alphaBoost = 0.64;
    alphaBoost += warmMask * 0.72;
    gl_FragColor = vec4(tone, falloff * vAlpha * alphaBoost);
  }
`;

function HeroPortrait({
  cloud,
  cursorRef,
  activePreview,
  reducedMotion,
  themeId,
  pointScale = 1,
  alphaScale = 1,
  frontOnly = false,
  additive = false,
}) {
  const t = THEME[themeId] || THEME.night;
  const map = useMemo(() => grainMap(), []);
  const mat = useRef();
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(cloud.positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(cloud.colors, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(cloud.sizes, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(cloud.phases, 1));
    g.setAttribute("aRegion", new THREE.BufferAttribute(cloud.regions, 1));
    g.setAttribute("aLock", new THREE.BufferAttribute(cloud.lock, 1));
    g.setAttribute("aScatter", new THREE.BufferAttribute(cloud.scatter, 3));
    return g;
  }, [cloud]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uCursor: { value: new THREE.Vector3() },
      uCursorStrength: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
      uReveal: { value: 0 },
      uPointScale: { value: pointScale },
      uAlphaScale: { value: alphaScale },
      uFrontOnly: { value: frontOnly ? 1 : 0 },
      uMap: { value: map },
    }),
    [alphaScale, frontOnly, map, pointScale, reducedMotion]
  );

  useFrame((state, dt) => {
    if (!mat.current) return;
    const active = activePreview ? 1 : 0;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), 1.9);
    mat.current.uniforms.uCursor.value.set(
      cursorRef.current.x,
      cursorRef.current.y,
      cursorRef.current.z
    );
    mat.current.uniforms.uCursorStrength.value = cursorRef.current.active
      ? THREE.MathUtils.lerp(
          mat.current.uniforms.uCursorStrength.value,
          0.85,
          active ? 0.08 : 0.05
        )
      : THREE.MathUtils.lerp(mat.current.uniforms.uCursorStrength.value, 0, 0.08);
    mat.current.uniforms.uReveal.value = THREE.MathUtils.damp(
      mat.current.uniforms.uReveal.value,
      active,
      2.1,
      dt
    );
    mat.current.uniforms.uMotion.value = reducedMotion ? 0 : 1;
    mat.current.uniforms.uPointScale.value = pointScale;
    mat.current.uniforms.uAlphaScale.value = alphaScale;
    mat.current.uniforms.uFrontOnly.value = frontOnly ? 1 : 0;
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        vertexColors
        toneMapped={false}
      />
    </points>
  );
}

function PortraitRotationRig({ cursorRef, reducedMotion, children }) {
  const group = useRef();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const yawVel = useRef(0);
  const pitchVel = useRef(0);
  const dragging = useRef(false);
  const pointerId = useRef(null);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onDown = (event) => {
      if (event.pointerType === "touch" || event.button === 0) {
        dragging.current = true;
        pointerId.current = event.pointerId;
        last.current.x = event.clientX;
        last.current.y = event.clientY;
      }
    };

    const onMove = (event) => {
      if (!dragging.current) return;
      if (pointerId.current !== null && event.pointerId !== pointerId.current) return;
      const dx = event.clientX - last.current.x;
      const dy = event.clientY - last.current.y;
      last.current.x = event.clientX;
      last.current.y = event.clientY;
      yaw.current += dx * 0.0085;
      pitch.current += dy * 0.0048;
      pitch.current = THREE.MathUtils.clamp(pitch.current, -0.4, 0.32);
      yawVel.current = dx * 0.0012;
      pitchVel.current = dy * 0.0007;
    };

    const onUp = (event) => {
      if (pointerId.current !== null && event.pointerId !== pointerId.current) return;
      dragging.current = false;
      pointerId.current = null;
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  useFrame((state, dt) => {
    if (!group.current) return;

    if (dragging.current) {
      yawVel.current = THREE.MathUtils.damp(yawVel.current, yawVel.current, 20, dt);
      pitchVel.current = THREE.MathUtils.damp(pitchVel.current, pitchVel.current, 20, dt);
    } else {
      yaw.current += yawVel.current;
      pitch.current += pitchVel.current;
      yawVel.current = THREE.MathUtils.damp(yawVel.current, 0, 2.2, dt);
      pitchVel.current = THREE.MathUtils.damp(pitchVel.current, 0, 2.6, dt);

      const targetYaw = reducedMotion ? 0 : cursorRef.current.x * 0.2;
      const targetPitch = reducedMotion ? 0 : cursorRef.current.y * 0.1;
      yaw.current = THREE.MathUtils.damp(yaw.current, targetYaw, 1.4, dt);
      pitch.current = THREE.MathUtils.damp(pitch.current, targetPitch, 1.8, dt);
    }

    yaw.current = THREE.MathUtils.clamp(yaw.current, -0.34, 0.24);
    pitch.current = THREE.MathUtils.clamp(pitch.current, -0.4, 0.32);
    group.current.rotation.y = yaw.current;
    group.current.rotation.x = pitch.current;
  });

  return <group ref={group}>{children}</group>;
}

function PreviewRoutes({ activeId, themeId, reducedMotion }) {
  const t = THEME[themeId] || THEME.night;
  const mats = useRef([]);
  const packetRef = useRef();
  const labelRefs = useRef({});
  const packetMap = useMemo(() => grainMap(), []);

  const routes = useMemo(
    () =>
      HERO_ROUTES.map((route) => ({
        ...route,
        curve: new THREE.CubicBezierCurve3(
          new THREE.Vector3(...route.points[0]),
          new THREE.Vector3(...route.points[1]),
          new THREE.Vector3(...route.points[2]),
          new THREE.Vector3(...route.points[3])
        ),
      })),
    []
  );

  const lineGeoms = useMemo(
    () =>
      routes.map((route) => {
        const pts = route.curve.getPoints(44);
        return new THREE.BufferGeometry().setFromPoints(pts);
      }),
    [routes]
  );

  const packetGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(routes.length * 3), 3)
    );
    g.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(routes.length * 3), 3)
    );
    return g;
  }, [routes.length]);

  const palette = useMemo(
    () => ({
      accent: new THREE.Color(t.accent),
      data: new THREE.Color(t.data),
      steel: new THREE.Color(t.steel),
      teal: new THREE.Color(t.transform),
      ivory: new THREE.Color(t.ink),
    }),
    [t]
  );

  useFrame((state, dt) => {
    const time = state.clock.elapsedTime;
    const pos = packetRef.current?.geometry?.attributes?.position?.array;
    const col = packetRef.current?.geometry?.attributes?.color?.array;
    routes.forEach((route, i) => {
      const hot = activeId === route.id;
        const mat = mats.current[i];
        if (mat) {
        const target = hot ? 0.96 : 0.12;
        mat.opacity = THREE.MathUtils.damp(mat.opacity, target, 4.6, dt);
        mat.color.copy(palette[route.color] || palette.steel);
      }

      if (pos && col) {
        const i3 = i * 3;
        const p = route.curve.getPoint(
          reducedMotion
            ? 0.15 + i * 0.04
            : hot
              ? (time * 0.16 + i * 0.12) % 1
              : (0.08 + i * 0.13) % 1
        );
        pos[i3] = p.x;
        pos[i3 + 1] = p.y;
        pos[i3 + 2] = p.z;
        const c = palette[route.color] || palette.steel;
        col[i3] = c.r;
        col[i3 + 1] = c.g;
        col[i3 + 2] = c.b;
      }

      const label = labelRefs.current[route.id];
      if (label) {
        label.material.opacity = THREE.MathUtils.damp(
          label.material.opacity,
          hot ? 1 : 0,
          6,
          dt
        );
      }
    });

    if (packetRef.current) {
      packetRef.current.geometry.attributes.position.needsUpdate = true;
      packetRef.current.geometry.attributes.color.needsUpdate = true;
        packetRef.current.material.opacity = activeId ? 1 : 0.18;
    }
  });

  return (
    <group>
      {lineGeoms.map((geom, i) => (
        <line key={routes[i].id} geometry={geom}>
          <lineBasicMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            color={t.steel}
            transparent
            opacity={0.06}
            depthWrite={false}
            toneMapped={false}
          />
        </line>
      ))}

      <points ref={packetRef} geometry={packetGeom} frustumCulled={false}>
        <pointsMaterial
          map={packetMap}
          size={4.4}
          sizeAttenuation={false}
          vertexColors
          transparent
            opacity={0.24}
          depthWrite={false}
          alphaTest={0.4}
          toneMapped={false}
        />
      </points>

      {routes.map((route) => {
        const hot = activeId === route.id;
        if (!hot) return null;
        return (
          <group key={`${route.id}-label`}>
            <Text
              ref={(r) => {
                if (r) labelRefs.current[route.id] = r;
              }}
              position={route.labelPos}
                fontSize={0.1}
                color={t.ink}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.003}
              outlineColor={t.bg}
            >
              {route.label}
            </Text>
            {route.semantic?.map((term, idx) => (
              <Text
                key={`${route.id}-${term}`}
                position={[
                  route.labelPos[0] + (idx - 1) * 0.22,
                  route.labelPos[1] - 0.16,
                  route.labelPos[2],
                ]}
                fontSize={0.042}
                color={idx === 1 ? t.data : t.faint}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.002}
                outlineColor={t.bg}
              >
                {term}
              </Text>
            ))}
          </group>
        );
      })}
    </group>
  );
}

export default function PortraitHeroField({
  themeId,
  cursorRef,
  hoverId,
  reducedMotion = false,
}) {
  const [cloud, setCloud] = useState(null);
  const [identityCloud, setIdentityCloud] = useState(null);
  const [goldCloud, setGoldCloud] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let alive = true;
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    Promise.allSettled([buildPortraitCloud({ mobile }), buildGlbPortraitCloud({ mobile })])
      .then((results) => {
        const front = results[0].status === "fulfilled" ? results[0].value : null;
        const glb = results[1].status === "fulfilled" ? results[1].value : null;
        if (!alive) return;
        const main = refinePhotoHeroCloud(front) || front;
        if (!main?.count) throw new Error("Portrait unavailable");
        setCloud(main);
        const gold = buildGoldHighlightCloud(main);
        if (gold?.count) setGoldCloud(gold);
        const support = glb ? refineHeroCloud(glb) : null;
        if (support?.count) setIdentityCloud(support);
      })
      .catch((error) => {
        console.error("[portrait-hero-field]", error);
        if (alive) setLoadError(error?.message || "Portrait unavailable");
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!cloud || loadError) return null;

  return (
    <group position={[0.24, 0.02, 0]} scale={1.56}>
      <PortraitRotationRig cursorRef={cursorRef} reducedMotion={reducedMotion}>
        <TexturedIdentityMesh reducedMotion={reducedMotion} />
        <HeroPortrait
          cloud={cloud}
          cursorRef={cursorRef}
          activePreview={null}
          reducedMotion={reducedMotion}
          themeId={themeId}
          pointScale={1.08}
          alphaScale={0.52}
        />
        {goldCloud ? (
          <HeroPortrait
            cloud={goldCloud}
            cursorRef={cursorRef}
            activePreview={null}
            reducedMotion={reducedMotion}
            themeId={themeId}
            pointScale={1.22}
            alphaScale={0.38}
            additive
          />
        ) : null}
        {identityCloud ? (
          <HeroPortrait
            cloud={identityCloud}
            cursorRef={cursorRef}
            activePreview={null}
            reducedMotion={reducedMotion}
            themeId={themeId}
            pointScale={0.64}
            alphaScale={0.06}
          />
        ) : null}
      </PortraitRotationRig>
      <PreviewRoutes activeId={hoverId} themeId={themeId} reducedMotion={reducedMotion} />
    </group>
  );
}
