import * as THREE from "three";

/**
 * Work exhibition hall — Quiet Instrument language.
 * Four installations at depth; metaphors differ by project.
 */

function palette(dark) {
  return dark
    ? {
        bg: new THREE.Color(0x0a0c10),
        fog: new THREE.Color(0x0a0c10),
        steel: new THREE.Color(0x2a3340),
        graphite: new THREE.Color(0x141820),
        signal: new THREE.Color(0x7a9eac),
        amber: new THREE.Color(0xd4b07a),
        ambient: 0.24,
        key: 0.4,
      }
    : {
        bg: new THREE.Color(0xf3efe7),
        fog: new THREE.Color(0xe8e2d8),
        steel: new THREE.Color(0x4a5560),
        graphite: new THREE.Color(0xd8d2c6),
        signal: new THREE.Color(0x3d5f70),
        amber: new THREE.Color(0x9a7040),
        ambient: 0.72,
        key: 0.3,
      };
}

const CAM = [
  { t: 0, pos: [0, 1.4, 12], look: [0, 0, -2], fov: 36 },
  { t: 0.35, pos: [0.4, 1.0, 8], look: [0, -0.2, -4], fov: 38 },
  { t: 0.7, pos: [-0.6, 0.6, 3], look: [0.2, -0.4, -8], fov: 40 },
  { t: 1, pos: [0, 2.2, 10], look: [0, -0.5, -6], fov: 34 },
];

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function sampleCam(p, out) {
  let a = CAM[0];
  let b = CAM[CAM.length - 1];
  for (let i = 0; i < CAM.length - 1; i++) {
    if (p >= CAM[i].t && p <= CAM[i + 1].t) {
      a = CAM[i];
      b = CAM[i + 1];
      break;
    }
  }
  const k = smoothstep((p - a.t) / Math.max(1e-6, b.t - a.t));
  out.pos.set(
    a.pos[0] + (b.pos[0] - a.pos[0]) * k,
    a.pos[1] + (b.pos[1] - a.pos[1]) * k,
    a.pos[2] + (b.pos[2] - a.pos[2]) * k
  );
  out.look.set(
    a.look[0] + (b.look[0] - a.look[0]) * k,
    a.look[1] + (b.look[1] - a.look[1]) * k,
    a.look[2] + (b.look[2] - a.look[2]) * k
  );
  out.fov = a.fov + (b.fov - a.fov) * k;
}

/** Metaphor builders — return group + materials */
function buildStrata(pal) {
  const g = new THREE.Group();
  const mats = [];
  for (let i = 0; i < 3; i++) {
    const m = new THREE.MeshStandardMaterial({
      color: i === 0 ? pal.steel : i === 1 ? pal.signal : pal.amber,
      metalness: 0.4,
      roughness: 0.55,
      transparent: true,
      opacity: 0.92,
    });
    mats.push(m);
    const slab = new THREE.Mesh(new THREE.BoxGeometry(1.6 - i * 0.2, 0.14, 1.0), m);
    slab.position.y = i * 0.38;
    slab.rotation.y = 0.25 * (1 - i * 0.35);
    g.add(slab);
  }
  return { g, mats };
}

function buildSpine(pal) {
  const g = new THREE.Group();
  const mats = [];
  const spine = new THREE.MeshStandardMaterial({
    color: pal.signal,
    metalness: 0.5,
    roughness: 0.4,
  });
  mats.push(spine);
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.9, 8), spine));
  for (let i = 0; i < 5; i++) {
    const m = new THREE.MeshStandardMaterial({ color: pal.steel, metalness: 0.4, roughness: 0.5 });
    mats.push(m);
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.025, 0.025), m);
    t.position.set(-0.55, 0.7 - i * 0.28, 0);
    t.rotation.z = 0.4;
    g.add(t);
  }
  return { g, mats };
}

function buildHarvest(pal) {
  const g = new THREE.Group();
  const mats = [];
  const gate = new THREE.MeshStandardMaterial({ color: pal.amber, metalness: 0.45, roughness: 0.45 });
  mats.push(gate);
  const torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.045, 8, 28), gate);
  torus.rotation.x = Math.PI / 2;
  g.add(torus);
  const crystal = new THREE.MeshStandardMaterial({ color: pal.signal, metalness: 0.55, roughness: 0.35 });
  mats.push(crystal);
  g.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), crystal));
  return { g, mats };
}

function buildSplit(pal) {
  const g = new THREE.Group();
  const left = new THREE.MeshStandardMaterial({ color: pal.steel, metalness: 0.5, roughness: 0.4 });
  const right = new THREE.MeshStandardMaterial({ color: pal.signal, metalness: 0.4, roughness: 0.5 });
  const a = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.3, 0.6), left);
  a.position.x = -0.5;
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.75), right);
  b.position.x = 0.5;
  g.add(a, b);
  return { g, mats: [left, right] };
}

const BUILDERS = [buildStrata, buildSpine, buildHarvest, buildSplit];
const POSITIONS = [
  [2.4, -0.6, -4],
  [-2.5, -0.5, -7],
  [2.2, -0.4, -10.5],
  [-2.0, -0.5, -13.5],
];

export function createExhibitionHall(canvas, { isDark = true } = {}) {
  let cur = palette(isDark);
  let from = null;
  let themeMix = 1;
  let themeT0 = 0;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(cur.bg, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = cur.bg.clone();
  scene.fog = new THREE.Fog(cur.fog, 8, 32);

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
  const camState = { pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 36 };
  const lookTarget = new THREE.Vector3();

  const ambient = new THREE.AmbientLight(0xffffff, cur.ambient);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xf0ebe3, cur.key);
  key.position.set(5, 9, 4);
  scene.add(key);
  const amber = new THREE.PointLight(0xd4b07a, 0.3, 16);
  amber.position.set(0, 1.2, -8);
  scene.add(amber);

  const floorMat = new THREE.MeshStandardMaterial({ color: cur.graphite, metalness: 0.3, roughness: 0.8 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 50), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.6;
  scene.add(floor);

  const installs = [];
  const allMats = [];
  BUILDERS.forEach((build, i) => {
    const { g, mats } = build(cur);
    g.position.set(...POSITIONS[i]);
    scene.add(g);
    installs.push(g);
    allMats.push(...mats);
  });

  /* Connecting lines — mindset, not neon */
  const webMat = new THREE.LineBasicMaterial({ color: cur.signal, transparent: true, opacity: 0.22 });
  const webPts = [];
  for (let i = 0; i < POSITIONS.length; i++) {
    webPts.push(new THREE.Vector3(...POSITIONS[i]), new THREE.Vector3(0, -0.2, -8));
  }
  const webGeo = new THREE.BufferGeometry().setFromPoints(webPts);
  scene.add(new THREE.LineSegments(webGeo, webMat));

  let progress = 0;
  let disposed = false;
  const pointer = new THREE.Vector2(0, 0);
  let hot = -1;

  function setProgress(p) {
    progress = Math.min(1, Math.max(0, p));
  }
  function setPointer(x, y) {
    pointer.set(x, y);
  }
  function setTheme(dark) {
    from = {
      bg: cur.bg.clone(),
      fog: cur.fog.clone(),
      graphite: cur.graphite.clone(),
      signal: cur.signal.clone(),
      ambient: ambient.intensity,
      key: key.intensity,
    };
    cur = palette(dark);
    themeMix = 0;
    themeT0 = performance.now();
  }
  function resize(w, h) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  function pick() {
    return hot;
  }

  const raycaster = new THREE.Raycaster();
  const hitMeshes = [];
  installs.forEach((g, i) => {
    const hit = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hit.position.copy(g.position);
    hit.userData.index = i;
    scene.add(hit);
    hitMeshes.push(hit);
  });

  function render(time) {
    if (disposed) return;

    if (themeMix < 1) {
      themeMix = Math.min(1, (time - themeT0) / 1000);
      const k = smoothstep(themeMix);
      scene.background.lerpColors(from.bg, cur.bg, k);
      scene.fog.color.lerpColors(from.fog, cur.fog, k);
      renderer.setClearColor(scene.background, 1);
      floorMat.color.lerpColors(from.graphite, cur.graphite, k);
      webMat.color.lerpColors(from.signal, cur.signal, k);
      ambient.intensity = from.ambient + (cur.ambient - from.ambient) * k;
      key.intensity = from.key + (cur.key - from.key) * k;
    }

    sampleCam(progress, camState);
    camera.position.lerp(camState.pos, 0.07);
    lookTarget.lerp(camState.look, 0.07);
    camera.lookAt(lookTarget);
    camera.fov += (camState.fov - camera.fov) * 0.06;
    camera.position.x += pointer.x * 0.15;
    camera.position.y += pointer.y * 0.08;
    camera.updateProjectionMatrix();

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(hitMeshes, false);
    hot = hits.length ? hits[0].object.userData.index : -1;

    installs.forEach((g, i) => {
      const wake = hot === i ? 1.08 : 1;
      g.scale.lerp(new THREE.Vector3(wake, wake, wake), 0.08);
      g.rotation.y = Math.sin(time * 0.0003 + i) * 0.04;
      if (i === 2) g.children[1] && (g.children[1].rotation.y = time * 0.0005);
    });

    /* Finale — pullback reveals connection */
    webMat.opacity = 0.12 + progress * 0.2;

    renderer.render(scene, camera);
  }

  function dispose() {
    disposed = true;
    renderer.dispose();
    scene.traverse((o) => {
      o.geometry?.dispose?.();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose?.());
        else o.material.dispose?.();
      }
    });
  }

  return { setProgress, setPointer, setTheme, resize, render, pick, dispose };
}
