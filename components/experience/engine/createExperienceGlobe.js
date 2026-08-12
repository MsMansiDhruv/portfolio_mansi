import * as THREE from "three";
import { fibonacciPoints } from "@/components/universe/engine/sphereMath";

const RADIUS = 2.4;

function colors(isDark) {
  return isDark
    ? { bg: 0x060810, globe: 0x121820, wire: 0x3a4556, node: 0xa84848, particle: 0x5a9ea8, thread: 0xa84848 }
    : { bg: 0xebe6dc, globe: 0xd4cfc4, wire: 0x8a8478, node: 0x8c3838, particle: 0x5a7a82, thread: 0x8c3838 };
}

export function createExperienceGlobe(canvas, { isDark }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  let palette = colors(isDark);
  let darkMode = isDark;
  renderer.setClearColor(palette.bg, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(palette.bg, 0.07);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.set(0, 0.2, 7);

  scene.add(new THREE.AmbientLight(0xffffff, isDark ? 0.14 : 0.5));
  const key = new THREE.DirectionalLight(0xffffff, isDark ? 0.32 : 0.22);
  key.position.set(2, 3, 4);
  scene.add(key);

  const group = new THREE.Group();
  scene.add(group);

  const shellGeo = new THREE.IcosahedronGeometry(RADIUS, 2);
  const shellMat = new THREE.MeshStandardMaterial({
    color: palette.globe,
    metalness: 0.4,
    roughness: 0.72,
    transparent: true,
    opacity: isDark ? 0.28 : 0.5,
  });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  group.add(shell);

  const wire = new THREE.Mesh(
    shellGeo,
    new THREE.MeshBasicMaterial({ color: palette.wire, wireframe: true, transparent: true, opacity: isDark ? 0.1 : 0.18 })
  );
  group.add(wire);

  const pts = fibonacciPoints(360, RADIUS * 1.02);
  const positions = new Float32Array(pts.length * 3);
  pts.forEach((p, i) => {
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
  });
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: palette.particle,
    size: 0.022,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const particles = new THREE.Points(pGeo, pMat);
  group.add(particles);

  const nodeCount = 14;
  const nodeMeshes = [];
  const threads = new THREE.Group();
  group.add(threads);

  for (let i = 0; i < nodeCount; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const x = RADIUS * 1.06 * Math.sin(phi) * Math.cos(theta);
    const y = RADIUS * 1.06 * Math.cos(phi);
    const z = RADIUS * 1.06 * Math.sin(phi) * Math.sin(theta);

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 10, 10),
      new THREE.MeshStandardMaterial({
        color: palette.node,
        emissive: palette.node,
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0,
      })
    );
    mesh.position.set(x, y, z);
    nodeMeshes.push(mesh);
    group.add(mesh);

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)]),
      new THREE.LineBasicMaterial({ color: palette.thread, transparent: true, opacity: 0 })
    );
    threads.add(line);
  }

  let progress = 0;
  let disposed = false;

  function setProgress(t) {
    progress = Math.max(0, Math.min(1, t));
  }

  function setTheme(dark) {
    darkMode = dark;
    palette = colors(dark);
    renderer.setClearColor(palette.bg, 1);
    scene.fog.color.setHex(palette.bg);
    shellMat.color.setHex(palette.globe);
    wire.material.color.setHex(palette.wire);
    pMat.color.setHex(palette.particle);
    nodeMeshes.forEach((m) => {
      m.material.color.setHex(palette.node);
      m.material.emissive.setHex(palette.node);
    });
    threads.children.forEach((l) => l.material.color.setHex(palette.thread));
  }

  function resize(w, h) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function render() {
    if (disposed) return;

    const intro = Math.min(1, progress / 0.2);
    const connect = Math.max(0, Math.min(1, (progress - 0.2) / 0.5));
    const dive = Math.max(0, Math.min(1, (progress - 0.58) / 0.2));
    const finale = Math.max(0, Math.min(1, (progress - 0.88) / 0.12));

    group.rotation.y = progress * Math.PI * 1.8 + performance.now() * 0.00015;
    group.rotation.x = 0.12 + dive * 0.35;

    const scale = 0.7 + intro * 0.3;
    group.scale.setScalar(scale);

    pMat.opacity = intro * (darkMode ? 0.5 : 0.35);

    nodeMeshes.forEach((mesh, i) => {
      const threshold = i / nodeCount;
      const vis = connect > threshold - 0.05 ? Math.min(1, (connect - threshold + 0.05) * 8) : 0;
      mesh.material.opacity = vis * 0.95;
      mesh.material.emissiveIntensity = vis * (darkMode ? 0.45 : 0.2);
      mesh.scale.setScalar(1 + vis * 0.4);
    });

    threads.children.forEach((line, i) => {
      const threshold = i / nodeCount;
      line.material.opacity = Math.max(finale * 0.25, connect > threshold ? 0.12 + connect * 0.2 : 0);
    });

    shellMat.opacity = (darkMode ? 0.28 : 0.5) + dive * 0.15;
    wire.material.opacity = (darkMode ? 0.1 : 0.18) + dive * 0.12;

    camera.position.z = THREE.MathUtils.lerp(7, 4.2, dive * 0.6 + finale * 0.25);
    camera.position.y = THREE.MathUtils.lerp(0.2, -0.4, dive * 0.5);

    shell.rotation.y += 0.0004;
    renderer.render(scene, camera);
  }

  function dispose() {
    disposed = true;
    renderer.dispose();
    shellGeo.dispose();
    shellMat.dispose();
    pGeo.dispose();
    pMat.dispose();
    nodeMeshes.forEach((m) => {
      m.geometry.dispose();
      m.material.dispose();
    });
  }

  return { setProgress, setTheme, resize, render, dispose };
}
