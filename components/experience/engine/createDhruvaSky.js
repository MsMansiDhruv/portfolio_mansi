import * as THREE from "three";

/**
 * DHRUVA SKY — the signature engine.
 *
 * "Dhruv" (ध्रुव) is the North Star: the fixed point the sky turns around.
 * The whole experience is Mansi's night sky. Her interests are constellations
 * that draw themselves as the story reaches them. Engineering is what
 * astronomy has always been: starlight collected, cleaned, and cataloged.
 *
 * Master phases (same timeline as plates + typography):
 *   0–15 entry · 15–30 her sky (interactive constellations) · 30–45 personal
 *   constellations draw · 45–65 starlight becomes the catalog · 65–80 standing
 *   stones (projects) · 80–90 lab · 90–100 the completed sky, threaded to Dhruva.
 */

const STAR_COUNT = 2200;
const STREAM_COUNT = 4;
const PARTICLES_PER_STREAM = 110;
const LATTICE_COUNT = 220;
const MONOLITH_COUNT = 5;
const CLEAR_ALPHA = 0.44;

function palette(dark) {
  return dark
    ? {
        bg: new THREE.Color(0x05060a),
        star: new THREE.Color(0xe8e4d8),
        dhruva: new THREE.Color(0xfff3da),
        line: new THREE.Color(0xa84848),
        stream: new THREE.Color(0x6faeb8),
        lattice: new THREE.Color(0x1c2430),
        latticeEdge: new THREE.Color(0x5a9ea8),
        monolith: new THREE.Color(0x14181f),
        monolithEdge: new THREE.Color(0xa84848),
        ambient: 0.18,
        key: 0.35,
        starOpacity: 0.9,
        milky: 0.16,
      }
    : {
        bg: new THREE.Color(0xe7e0d2),
        star: new THREE.Color(0x8a8070),
        dhruva: new THREE.Color(0xb8743f),
        line: new THREE.Color(0x8c3838),
        stream: new THREE.Color(0x4a7a84),
        lattice: new THREE.Color(0xc8c2b4),
        latticeEdge: new THREE.Color(0x4a7a84),
        monolith: new THREE.Color(0xd4cec2),
        monolithEdge: new THREE.Color(0x8c3838),
        ambient: 0.55,
        key: 0.3,
        starOpacity: 0.35,
        milky: 0.04,
      };
}

const CAM_KEYS = [
  { t: 0.0, pos: [0, -0.4, 13.5], look: [0, 3.2, -6], fov: 42 },
  { t: 0.13, pos: [0, 0.2, 11], look: [0, 3.6, -7], fov: 44 },
  { t: 0.22, pos: [2.4, 0.8, 9], look: [-1.5, 4.2, -8], fov: 47 },
  { t: 0.3, pos: [-2, 1, 8], look: [1.5, 4.5, -8.5], fov: 48 },
  { t: 0.42, pos: [-3, 0.8, 6.6], look: [2.5, 3.5, -8], fov: 48 },
  { t: 0.5, pos: [-0.6, 0.2, 5.5], look: [0, -0.6, -4.5], fov: 48 },
  { t: 0.6, pos: [1.3, -1.4, 3.8], look: [0, -2.4, -4.5], fov: 50 },
  { t: 0.7, pos: [0.2, -2.1, 1.4], look: [0, -2.6, -5.5], fov: 54 },
  { t: 0.82, pos: [-1.7, -2, -2.2], look: [0.5, -2.2, -8], fov: 52 },
  { t: 0.91, pos: [1.2, -1.7, -5.6], look: [0, -2, -10], fov: 48 },
  { t: 1.0, pos: [0, 1.6, 15.5], look: [0, 1.4, -6], fov: 42 },
];

/**
 * Constellations, ordered to match EXPERIENCE_TERRITORIES:
 * build, think, play, move, connect, create.
 * Each has a sky position, a stylized polyline figure, and the scroll window
 * in which it draws itself (its chapter of the story).
 */
const CONSTELLATIONS = [
  {
    id: "build",
    center: [8.5, 3.2, -6],
    scale: 1.8,
    draw: [0.475, 0.6],
    pts: [
      [-0.8, -1], [-0.5, -0.2], [-0.7, 0.4], [-0.2, 0.9], [0.3, 1.3], [0.6, 0.6], [0.4, -0.1], [0.7, -1],
    ],
  },
  {
    id: "think",
    center: [-3, 8, -14],
    scale: 1.7,
    draw: [0.8, 0.86],
    pts: [
      [-0.6, 0.9], [0.2, 1.25], [0.8, 0.7], [0.7, 0], [0.1, -0.3], [0, -0.9], [0, -1.35],
    ],
  },
  {
    id: "play",
    center: [-7.5, 5.5, -11],
    scale: 1.7,
    draw: [0.3, 0.385],
    pts: [
      [0, 1.3], [-0.5, 0.6], [-0.35, -0.2], [-0.8, -1], [0.8, -1], [0.35, -0.2], [0.5, 0.6], [0, 1.3],
    ],
  },
  {
    id: "move",
    center: [7.5, 6.5, -10],
    scale: 1.8,
    draw: [0.375, 0.43],
    pts: [
      [-1.1, -0.8], [0, 0.9], [1.1, -0.8], [0.45, 0.1], [-0.45, 0.1], [-1.1, -0.8],
    ],
  },
  {
    id: "connect",
    center: [-9, 3.4, -7],
    scale: 1.6,
    draw: [0.415, 0.475],
    pts: [0, 1, 2, 3, 4, 5, 0].map((i) => {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      return [Math.cos(a), Math.sin(a)];
    }),
  },
  {
    id: "create",
    center: [2.5, 8.5, -13],
    scale: 1.6,
    draw: [0.66, 0.79],
    pts: [
      [0, 1.2], [0, 0], [1.1, 0.5], [0, 0], [1, -0.9], [0, 0], [-1, -0.9], [0, 0], [-1.1, 0.5], [0, 0], [0, 1.2],
    ],
  },
];

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function sampleCamera(progress, out) {
  let a = CAM_KEYS[0];
  let b = CAM_KEYS[CAM_KEYS.length - 1];
  for (let i = 0; i < CAM_KEYS.length - 1; i++) {
    if (progress >= CAM_KEYS[i].t && progress <= CAM_KEYS[i + 1].t) {
      a = CAM_KEYS[i];
      b = CAM_KEYS[i + 1];
      break;
    }
  }
  const span = Math.max(1e-6, b.t - a.t);
  const k = smoothstep(Math.min(1, Math.max(0, (progress - a.t) / span)));
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

function mulberry(seed) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let x = Math.imul(s ^ (s >>> 15), 1 | s);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** Soft radial glow texture, shared by stars and the Dhruva halo. */
function makeGlowTexture(size = 128) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.55)");
  g.addColorStop(0.6, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDhruvaSky(canvas, { isDark, onTerritoryHover } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  let cur = palette(isDark);
  let from = cur;
  let themeMix = 1;
  let themeStart = 0;
  const THEME_MS = 1400;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(cur.bg.getHex(), 0.04);
  renderer.setClearColor(cur.bg, CLEAR_ALPHA);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  const camState = { pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 42 };

  const ambient = new THREE.AmbientLight(0xffffff, cur.ambient);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, cur.key);
  key.position.set(3, 8, 4);
  scene.add(key);

  const rand = mulberry(20260812);
  const glowTex = makeGlowTexture();

  /* ---------- Starfield: three clouds with phase-offset twinkle ---------- */
  const starClouds = [];
  for (let c = 0; c < 3; c++) {
    const count = Math.floor(STAR_COUNT / 3);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // upper hemisphere shell, radius 16–34
      const r = 16 + rand() * 18;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(rand() * 0.85); // bias upward
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) - 2;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: cur.star,
      size: 0.09 + c * 0.05,
      map: glowTex,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(geo, mat));
    starClouds.push({ geo, mat, phase: c * 2.1 });
  }

  /* ---------- Milky way band ---------- */
  const milkyMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: cur.star,
    transparent: true,
    opacity: cur.milky,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    rotation: -0.5,
  });
  const milky = new THREE.Sprite(milkyMat);
  milky.position.set(-4, 8, -22);
  milky.scale.set(46, 14, 1);
  scene.add(milky);

  /* ---------- DHRUVA — the fixed star ---------- */
  const dhruvaPos = new THREE.Vector3(0, 9.5, -15);
  const dhruvaCoreMat = new THREE.MeshBasicMaterial({ color: cur.dhruva, transparent: true, opacity: 1 });
  const dhruvaCore = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), dhruvaCoreMat);
  dhruvaCore.position.copy(dhruvaPos);
  scene.add(dhruvaCore);

  const dhruvaGlowMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: cur.dhruva,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const dhruvaGlow = new THREE.Sprite(dhruvaGlowMat);
  dhruvaGlow.position.copy(dhruvaPos);
  dhruvaGlow.scale.set(5, 5, 1);
  scene.add(dhruvaGlow);

  // diffraction cross: two elongated glow sprites
  const crossMats = [];
  for (let i = 0; i < 2; i++) {
    const mat = new THREE.SpriteMaterial({
      map: glowTex,
      color: cur.dhruva,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      rotation: i * Math.PI * 0.5,
    });
    const spike = new THREE.Sprite(mat);
    spike.position.copy(dhruvaPos);
    spike.scale.set(i === 0 ? 11 : 0.5, i === 0 ? 0.5 : 11, 1);
    scene.add(spike);
    crossMats.push(mat);
  }

  /* ---------- Constellations ---------- */
  const constellations = CONSTELLATIONS.map((def) => {
    const center = new THREE.Vector3(...def.center);
    const verts = def.pts.map(
      ([x, y]) =>
        new THREE.Vector3(
          center.x + x * def.scale,
          center.y + y * def.scale,
          center.z + (rand() - 0.5) * 0.6
        )
    );

    const lineGeo = new THREE.BufferGeometry().setFromPoints(verts);
    const lineMat = new THREE.LineBasicMaterial({ color: cur.line, transparent: true, opacity: 0 });
    const line = new THREE.Line(lineGeo, lineMat);
    line.geometry.setDrawRange(0, 0);
    scene.add(line);

    const starPos = new Float32Array(verts.length * 3);
    verts.forEach((v, i) => {
      starPos[i * 3] = v.x;
      starPos[i * 3 + 1] = v.y;
      starPos[i * 3 + 2] = v.z;
    });
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: cur.star,
      size: 0.34,
      map: glowTex,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    const hit = new THREE.Mesh(
      new THREE.SphereGeometry(def.scale * 1.6, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hit.position.copy(center);
    scene.add(hit);

    return { def, center, verts, lineGeo, lineMat, starGeo, starMat, hit, hoverLerp: 0 };
  });
  const hitMeshes = constellations.map((c, i) => {
    c.hit.userData.index = i;
    return c.hit;
  });

  /* ---------- Threads to Dhruva (final reveal) ---------- */
  const threadPts = [];
  constellations.forEach((c) => threadPts.push(c.center.clone(), dhruvaPos.clone()));
  // the catalog below is part of the same sky
  threadPts.push(new THREE.Vector3(0, -2.6, -6), dhruvaPos.clone());
  const threadGeo = new THREE.BufferGeometry().setFromPoints(threadPts);
  const threadMat = new THREE.LineBasicMaterial({ color: cur.line, transparent: true, opacity: 0 });
  scene.add(new THREE.LineSegments(threadGeo, threadMat));

  /* ---------- Shooting star ---------- */
  const shootGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const shootMat = new THREE.LineBasicMaterial({ color: cur.star, transparent: true, opacity: 0 });
  scene.add(new THREE.Line(shootGeo, shootMat));
  let shootStart = 2000;
  let shootFrom = new THREE.Vector3();
  let shootDir = new THREE.Vector3();

  /* ---------- Starlight streams → catalog ---------- */
  const streamCurves = [];
  for (let s = 0; s < STREAM_COUNT; s++) {
    const xOff = (s - (STREAM_COUNT - 1) / 2) * 1.15;
    streamCurves.push(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(xOff * 2.4, 3.2, -7.5),
        new THREE.Vector3(xOff * 1.6, 0.6, -6),
        new THREE.Vector3(xOff * 1, -1.4, -5),
        new THREE.Vector3(xOff * 0.5, -2.3, -5),
        new THREE.Vector3(xOff * 0.25, -2.55, -5.5),
      ])
    );
  }
  const streamTotal = STREAM_COUNT * PARTICLES_PER_STREAM;
  const streamPos = new Float32Array(streamTotal * 3);
  const streamCol = new Float32Array(streamTotal * 3);
  const streamT = new Float32Array(streamTotal);
  const streamSpeed = new Float32Array(streamTotal);
  const streamDropped = new Uint8Array(streamTotal);
  for (let i = 0; i < streamTotal; i++) {
    streamT[i] = rand();
    streamSpeed[i] = 0.0016 + rand() * 0.0022;
    streamDropped[i] = rand() < 0.13 ? 1 : 0;
  }
  const streamGeo = new THREE.BufferGeometry();
  streamGeo.setAttribute("position", new THREE.BufferAttribute(streamPos, 3));
  streamGeo.setAttribute("color", new THREE.BufferAttribute(streamCol, 3));
  const streamMat = new THREE.PointsMaterial({
    size: 0.05,
    map: glowTex,
    transparent: true,
    opacity: 0,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(streamGeo, streamMat));

  /* ---------- The catalog (structured starlight) ---------- */
  const latticeGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
  const latticeMat = new THREE.MeshStandardMaterial({
    color: cur.lattice,
    emissive: cur.latticeEdge,
    emissiveIntensity: 0.08,
    metalness: 0.35,
    roughness: 0.6,
    transparent: true,
    opacity: 0,
  });
  const lattice = new THREE.InstancedMesh(latticeGeo, latticeMat, LATTICE_COUNT);
  lattice.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(lattice);

  const scatter = [];
  const target = [];
  const gridW = 16;
  for (let i = 0; i < LATTICE_COUNT; i++) {
    scatter.push(new THREE.Vector3((rand() - 0.5) * 16, (rand() - 0.5) * 10 - 2, (rand() - 0.5) * 14 - 6));
    const gx = i % gridW;
    const gz = Math.floor(i / gridW);
    const height = 0.4 + Math.abs(Math.sin(gx * 1.7 + gz * 2.3)) * 1.6;
    target.push(new THREE.Vector3((gx - gridW / 2) * 0.42, -3 + height * 0.5, -4.5 - gz * 0.42));
  }
  const dummy = new THREE.Object3D();
  const heights = target.map((_, i) => {
    const gx = i % gridW;
    const gz = Math.floor(i / gridW);
    return 0.4 + Math.abs(Math.sin(gx * 1.7 + gz * 2.3)) * 1.6;
  });

  /* ---------- Standing stones (projects) ---------- */
  const monolithGroup = new THREE.Group();
  scene.add(monolithGroup);
  const monolithMats = [];
  const monolithEdgeMats = [];
  for (let i = 0; i < MONOLITH_COUNT; i++) {
    const h = 1.6 + (i % 3) * 0.5;
    const geo = new THREE.BoxGeometry(0.55, h, 0.55);
    const mat = new THREE.MeshStandardMaterial({
      color: cur.monolith,
      metalness: 0.45,
      roughness: 0.55,
      transparent: true,
      opacity: 0,
    });
    monolithMats.push(mat);
    const mesh = new THREE.Mesh(geo, mat);
    const side = i % 2 === 0 ? -1 : 1;
    mesh.position.set(side * (1.2 + (i % 2) * 0.4), -2.4 + h / 2 - 0.8, -4.5 - i * 1.6);
    monolithGroup.add(mesh);

    const edgeMat = new THREE.LineBasicMaterial({ color: cur.monolithEdge, transparent: true, opacity: 0 });
    monolithEdgeMats.push(edgeMat);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat);
    edges.position.copy(mesh.position);
    monolithGroup.add(edges);
  }

  /* ---------- State ---------- */
  let progress = 0;
  let disposed = false;
  let lastAssembly = -1;

  const tmpColor = new THREE.Color();
  const streamColor = new THREE.Color();
  const badCol = new THREE.Color(0xa84848);

  /* ---------- Pointer: parallax + constellation raycast ---------- */
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const parTarget = { x: 0, y: 0 };
  const par = { x: 0, y: 0 };
  let pointerActive = false;
  let hovered = -1;

  function setPointer(ndcX, ndcY) {
    parTarget.x = ndcX;
    parTarget.y = ndcY;
    pointerNdc.set(ndcX, ndcY);
    pointerActive = true;
  }

  function pickTerritory() {
    if (!pointerActive) return -1;
    const active = Math.max(seg(0.14, 0.2) * (1 - seg(0.3, 0.4)), seg(0.9, 1));
    if (active < 0.25) return -1;
    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(hitMeshes, false);
    return hits.length ? hits[0].object.userData.index : -1;
  }

  function click() {
    return hovered;
  }

  function setProgress(t) {
    progress = Math.max(0, Math.min(1, t));
  }

  function setTheme(dark) {
    from = {
      bg: cur.bg.clone(),
      star: cur.star.clone(),
      dhruva: cur.dhruva.clone(),
      line: cur.line.clone(),
      stream: cur.stream.clone(),
      lattice: cur.lattice.clone(),
      latticeEdge: cur.latticeEdge.clone(),
      monolith: cur.monolith.clone(),
      monolithEdge: cur.monolithEdge.clone(),
      ambient: ambient.intensity,
      key: key.intensity,
      starOpacity: cur.starOpacity,
      milky: cur.milky,
    };
    cur = palette(dark);
    themeMix = 0;
    themeStart = performance.now();
  }

  function applyTheme(mix) {
    const k = smoothstep(mix);
    tmpColor.lerpColors(from.bg, cur.bg, k);
    renderer.setClearColor(tmpColor, CLEAR_ALPHA);
    scene.fog.color.copy(tmpColor);
    starClouds.forEach(({ mat }) => mat.color.lerpColors(from.star, cur.star, k));
    milkyMat.color.lerpColors(from.star, cur.star, k);
    dhruvaCoreMat.color.lerpColors(from.dhruva, cur.dhruva, k);
    dhruvaGlowMat.color.lerpColors(from.dhruva, cur.dhruva, k);
    crossMats.forEach((m) => m.color.lerpColors(from.dhruva, cur.dhruva, k));
    constellations.forEach((c) => {
      c.lineMat.color.lerpColors(from.line, cur.line, k);
      c.starMat.color.lerpColors(from.star, cur.star, k);
    });
    threadMat.color.lerpColors(from.line, cur.line, k);
    shootMat.color.lerpColors(from.star, cur.star, k);
    latticeMat.color.lerpColors(from.lattice, cur.lattice, k);
    latticeMat.emissive.lerpColors(from.latticeEdge, cur.latticeEdge, k);
    monolithMats.forEach((m) => m.color.lerpColors(from.monolith, cur.monolith, k));
    monolithEdgeMats.forEach((m) => m.color.lerpColors(from.monolithEdge, cur.monolithEdge, k));
    ambient.intensity = from.ambient + (cur.ambient - from.ambient) * k;
    key.intensity = from.key + (cur.key - from.key) * k;
  }

  function resize(w, h) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function seg(a, b) {
    if (progress <= a) return 0;
    if (progress >= b) return 1;
    return (progress - a) / (b - a);
  }

  function render(now) {
    if (disposed) return;
    const time = now ?? performance.now();

    if (themeMix < 1) {
      themeMix = Math.min(1, (time - themeStart) / THEME_MS);
      applyTheme(themeMix);
    }

    /* Camera journey + damped cursor parallax */
    par.x += (parTarget.x - par.x) * 0.05;
    par.y += (parTarget.y - par.y) * 0.05;
    sampleCamera(progress, camState);
    camera.position.set(
      camState.pos.x + par.x * 0.38,
      camState.pos.y + par.y * 0.22,
      camState.pos.z
    );
    camera.lookAt(camState.look.x - par.x * 0.2, camState.look.y - par.y * 0.12, camState.look.z);
    if (Math.abs(camera.fov - camState.fov) > 0.05) {
      camera.fov = camState.fov;
      camera.updateProjectionMatrix();
    }

    /* Hover */
    const nowHovered = pickTerritory();
    if (nowHovered !== hovered) {
      hovered = nowHovered;
      canvas.style.cursor = hovered >= 0 ? "pointer" : "";
      onTerritoryHover?.(hovered);
    }

    /* Phase intensities */
    const entryT = seg(0.01, 0.1);
    const skyDim = 1 - seg(0.5, 0.62) * 0.75; // sky recedes during the descent
    const streamsT = seg(0.46, 0.56) * (1 - seg(0.66, 0.74));
    const cityT = seg(0.56, 0.67);
    const galleryT = seg(0.65, 0.8);
    const finaleT = seg(0.9, 1);
    const skyVis = Math.max(skyDim, finaleT);

    /* Stars appear one by one at entry, twinkle forever */
    starClouds.forEach(({ mat, phase }, i) => {
      const appear = seg(0.005 + i * 0.02, 0.06 + i * 0.03);
      const twinkle = 0.72 + Math.sin(time * 0.0011 + phase) * 0.22;
      mat.opacity = appear * twinkle * cur.starOpacity * skyVis;
    });
    milkyMat.opacity = entryT * cur.milky * skyVis;

    /* Dhruva breathes — brightest at entry and at the reveal */
    const pulse = 0.9 + Math.sin(time * 0.0016) * 0.1;
    const dhruvaVis = Math.max(entryT * skyDim, finaleT) * pulse;
    dhruvaGlowMat.opacity = 0.8 * dhruvaVis;
    dhruvaCoreMat.opacity = dhruvaVis;
    crossMats.forEach((m) => {
      m.opacity = 0.42 * dhruvaVis;
    });
    dhruvaGlow.scale.setScalar(5 * (0.92 + Math.sin(time * 0.0016) * 0.08));
    dhruvaGlow.scale.z = 1;

    /* Constellations draw at their chapter; hover completes them early */
    constellations.forEach((c, i) => {
      const chapterT = seg(c.def.draw[0], c.def.draw[1]);
      const hoverTarget = i === hovered ? 1 : 0;
      c.hoverLerp += (hoverTarget - c.hoverLerp) * 0.09;
      const drawT = Math.max(smoothstep(chapterT), c.hoverLerp, finaleT);
      const total = c.verts.length;
      c.lineGeo.setDrawRange(0, Math.max(0, Math.round(total * drawT)));
      const baseVis = Math.max(seg(0.14, 0.2) * (1 - seg(0.48, 0.56)), seg(c.def.draw[0], c.def.draw[1]) > 0 ? skyDim : 0, finaleT);
      c.lineMat.opacity = drawT * (0.28 + c.hoverLerp * 0.45 + finaleT * 0.25) * Math.max(baseVis, drawT * skyVis);
      const twinkle = 0.5 + Math.sin(time * 0.0013 + i * 1.7) * 0.18;
      c.starMat.opacity = Math.max(seg(0.1, 0.18) * twinkle, drawT * 0.9) * cur.starOpacity * skyVis;
    });

    /* Threads to Dhruva — the payoff */
    threadMat.opacity = finaleT * 0.3;

    /* Shooting star — a small delight, sky phases only */
    const shootAge = (time - shootStart) / 1400;
    if (shootAge > 1) {
      if (rand() < 0.008) {
        shootStart = time;
        shootFrom.set((rand() - 0.5) * 24, 7 + rand() * 6, -12 - rand() * 8);
        shootDir.set(-(0.5 + rand()) * 4, -(0.5 + rand() * 0.8) * 2, 0);
      }
      shootMat.opacity = 0;
    } else {
      const head = shootFrom.clone().addScaledVector(shootDir, shootAge);
      const tail = head.clone().addScaledVector(shootDir, -0.22);
      shootGeo.setFromPoints([tail, head]);
      shootMat.opacity = Math.sin(shootAge * Math.PI) * 0.75 * skyVis * (progress < 0.5 || finaleT > 0 ? 1 : 0);
    }

    /* Starlight streams — records fall, validation drops the bad ones */
    streamMat.opacity = streamsT * 0.9;
    if (streamsT > 0.01) {
      streamColor.lerpColors(from.stream ?? cur.stream, cur.stream, smoothstep(themeMix));
      for (let i = 0; i < streamTotal; i++) {
        streamT[i] += streamSpeed[i];
        if (streamT[i] > 1) streamT[i] -= 1;
        const s = Math.floor(i / PARTICLES_PER_STREAM);
        const p = streamCurves[s].getPoint(streamT[i]);
        const dropped = streamDropped[i] === 1 && streamT[i] > 0.55;
        const fall = dropped ? (streamT[i] - 0.55) * 3 : 0;
        streamPos[i * 3] = p.x;
        streamPos[i * 3 + 1] = p.y - fall * fall * 1.4;
        streamPos[i * 3 + 2] = p.z;
        const c = dropped ? badCol : streamColor;
        const fade = dropped ? Math.max(0, 1 - fall * 1.2) : 1;
        streamCol[i * 3] = c.r * fade;
        streamCol[i * 3 + 1] = c.g * fade;
        streamCol[i * 3 + 2] = c.b * fade;
      }
      streamGeo.attributes.position.needsUpdate = true;
      streamGeo.attributes.color.needsUpdate = true;
    }

    /* The catalog assembles from scattered light */
    const assembly = smoothstep(cityT);
    latticeMat.opacity = Math.min(1, cityT * 2) * 0.92;
    if (Math.abs(assembly - lastAssembly) > 0.0015 && cityT > 0) {
      lastAssembly = assembly;
      for (let i = 0; i < LATTICE_COUNT; i++) {
        const sc = scatter[i];
        const tg = target[i];
        dummy.position.set(
          sc.x + (tg.x - sc.x) * assembly,
          sc.y + (tg.y - sc.y) * assembly,
          sc.z + (tg.z - sc.z) * assembly
        );
        const sy = 0.4 + assembly * heights[i] * 2.4;
        dummy.scale.set(1, sy, 1);
        dummy.rotation.set((1 - assembly) * sc.x, (1 - assembly) * sc.y, 0);
        dummy.updateMatrix();
        lattice.setMatrixAt(i, dummy.matrix);
      }
      lattice.instanceMatrix.needsUpdate = true;
    }
    latticeMat.emissiveIntensity = 0.06 + assembly * 0.14 + Math.sin(time * 0.001) * 0.03 * assembly;

    /* Standing stones wake as the camera passes */
    monolithMats.forEach((m, i) => {
      const local = Math.min(1, Math.max(0, galleryT * MONOLITH_COUNT * 1.4 - i));
      m.opacity = local * 0.95;
    });
    monolithEdgeMats.forEach((m, i) => {
      const local = Math.min(1, Math.max(0, galleryT * MONOLITH_COUNT * 1.4 - i));
      m.opacity = local * (0.5 + Math.sin(time * 0.0018 + i) * 0.18);
    });

    renderer.render(scene, camera);
  }

  function dispose() {
    disposed = true;
    renderer.dispose();
    glowTex.dispose();
    starClouds.forEach(({ geo, mat }) => {
      geo.dispose();
      mat.dispose();
    });
    milkyMat.dispose();
    dhruvaCore.geometry.dispose();
    dhruvaCoreMat.dispose();
    dhruvaGlowMat.dispose();
    crossMats.forEach((m) => m.dispose());
    constellations.forEach((c) => {
      c.lineGeo.dispose();
      c.lineMat.dispose();
      c.starGeo.dispose();
      c.starMat.dispose();
      c.hit.geometry.dispose();
      c.hit.material.dispose();
    });
    threadGeo.dispose();
    threadMat.dispose();
    shootGeo.dispose();
    shootMat.dispose();
    streamGeo.dispose();
    streamMat.dispose();
    latticeGeo.dispose();
    latticeMat.dispose();
    monolithGroup.traverse((o) => {
      o.geometry?.dispose?.();
      o.material?.dispose?.();
    });
  }

  return { setProgress, setPointer, click, setTheme, resize, render, dispose };
}
