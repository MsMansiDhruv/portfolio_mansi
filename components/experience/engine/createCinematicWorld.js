import * as THREE from "three";

/**
 * Systems engine — interactive technical portfolio world.
 * void → systems map → live pipelines → architecture lattice → project installs → reveal.
 * Data behaviour is literal: records flow, validation drops bad records, survivors assemble.
 */

const DUST_COUNT = 900;
const STREAM_COUNT = 4;
const PARTICLES_PER_STREAM = 110;
const LATTICE_COUNT = 220;
const MONOLITH_COUNT = 5;

function palette(dark) {
  return dark
    ? {
        bg: new THREE.Color(0x08090c),
        dust: new THREE.Color(0x6a7488),
        node: new THREE.Color(0x5a9ea8),
        thread: new THREE.Color(0x5a9ea8),
        stream: new THREE.Color(0x6faeb8),
        lattice: new THREE.Color(0x1c2430),
        latticeEdge: new THREE.Color(0x5a9ea8),
        monolith: new THREE.Color(0x14181f),
        monolithEdge: new THREE.Color(0x5a9ea8),
        ambient: 0.18,
        key: 0.42,
      }
    : {
        bg: new THREE.Color(0xf3efe6),
        dust: new THREE.Color(0x7a7468),
        node: new THREE.Color(0x3d7a84),
        thread: new THREE.Color(0x4a7a84),
        stream: new THREE.Color(0x3d7a84),
        lattice: new THREE.Color(0xd4cec2),
        latticeEdge: new THREE.Color(0x3d7a84),
        monolith: new THREE.Color(0xe4ded2),
        monolithEdge: new THREE.Color(0x8c3838),
        ambient: 0.62,
        key: 0.35,
      };
}

/** Data-engineering icon geometries for the systems map nodes */
const NODE_SPECS = [
  { icon: "funnel", color: 0x3d8b9e }, // INGEST
  { icon: "octa", color: 0xb89858 }, // TRANSFORM
  { icon: "cylinder", color: 0x5a7a9e }, // STORE
  { icon: "box", color: 0x4a9e7a }, // SERVE
  { icon: "ring", color: 0x7a6a9e }, // OBSERVE
  { icon: "icosa", color: 0xa84848 }, // AI LAB
];

function makeIconGeometry(icon) {
  switch (icon) {
    case "funnel":
      return new THREE.ConeGeometry(0.12, 0.22, 6);
    case "octa":
      return new THREE.OctahedronGeometry(0.13, 0);
    case "cylinder":
      return new THREE.CylinderGeometry(0.1, 0.1, 0.2, 12);
    case "box":
      return new THREE.BoxGeometry(0.18, 0.18, 0.18);
    case "ring":
      return new THREE.TorusGeometry(0.1, 0.035, 8, 18);
    case "icosa":
      return new THREE.IcosahedronGeometry(0.13, 0);
    default:
      return new THREE.SphereGeometry(0.1, 12, 12);
  }
}

/** Camera — engineer journey: systems overview → dive into pipelines → gallery → pullback */
const CAM_KEYS = [
  { t: 0.0, pos: [0, 0.4, 11.5], look: [0, 0, 0], fov: 38 },
  { t: 0.12, pos: [0, 0.5, 9.2], look: [0, 0.1, 0], fov: 40 },
  { t: 0.22, pos: [2.2, 0.9, 7.2], look: [0, 0.15, 0], fov: 42 },
  { t: 0.32, pos: [-0.4, 0.1, 5.2], look: [0, -0.6, -1.2], fov: 46 },
  { t: 0.45, pos: [1.2, -1.1, 3.6], look: [0, -2, -3.2], fov: 50 },
  { t: 0.58, pos: [0.2, -2, 1.4], look: [0, -2.4, -5.2], fov: 52 },
  { t: 0.72, pos: [-1.4, -1.9, -1.8], look: [0.4, -2.2, -7.5], fov: 50 },
  { t: 0.86, pos: [1.0, -1.5, -4.8], look: [0, -1.8, -9], fov: 46 },
  { t: 1.0, pos: [0, 2.8, 12], look: [0, -1, -2.5], fov: 38 },
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

const TERRITORY_COUNT = 6;

export function createCinematicWorld(canvas, { isDark, onTerritoryHover } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  let cur = palette(isDark);
  let from = cur;
  let themeMix = 1;
  let themeStart = 0;
  const THEME_MS = 1000;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(cur.bg.getHex(), 0.05);
  renderer.setClearColor(cur.bg, 1);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  const camState = { pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 38 };

  const ambient = new THREE.AmbientLight(0xffffff, cur.ambient);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, cur.key);
  key.position.set(3, 5, 4);
  scene.add(key);
  const accent = new THREE.PointLight(cur.node.getHex(), 0.6, 18);
  accent.position.set(0, -2, -5);
  scene.add(accent);

  const rand = mulberry(20260812);

  /* ---------- Atmospheric dust ---------- */
  const dustPos = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i++) {
    dustPos[i * 3] = (rand() - 0.5) * 34;
    dustPos[i * 3 + 1] = (rand() - 0.5) * 20 - 1;
    dustPos[i * 3 + 2] = (rand() - 0.5) * 40 - 4;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: cur.dust,
    size: 0.03,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  scene.add(new THREE.Points(dustGeo, dustMat));

  /* ---------- Systems map — DE icon nodes ---------- */
  const NODE_COUNT = NODE_SPECS.length;
  const nodeGroup = new THREE.Group();
  scene.add(nodeGroup);
  const nodePositions = [];
  const nodeMats = [];
  const nodeMeshes = [];
  const nodeBaseColors = NODE_SPECS.map((s) => new THREE.Color(s.color));

  for (let i = 0; i < NODE_COUNT; i++) {
    const angle = (i / NODE_COUNT) * Math.PI * 2 - Math.PI / 2;
    const r = 2.15;
    const p = new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r * 0.55, Math.sin(angle * 2) * 0.35);
    nodePositions.push(p);

    const color = nodeBaseColors[i];
    const mat = new THREE.MeshStandardMaterial({
      color: color.clone(),
      emissive: color.clone(),
      emissiveIntensity: 0,
      metalness: 0.25,
      roughness: 0.45,
      transparent: true,
      opacity: 0,
    });
    nodeMats.push(mat);
    const mesh = new THREE.Mesh(makeIconGeometry(NODE_SPECS[i].icon), mat);
    mesh.position.copy(p);
    if (NODE_SPECS[i].icon === "cylinder") mesh.rotation.x = Math.PI / 2;
    nodeGroup.add(mesh);
    nodeMeshes.push(mesh);
  }

  /* Invisible hit targets — generous so icons are easy to click */
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitMeshes = [];
  for (let i = 0; i < TERRITORY_COUNT; i++) {
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.48, 10, 10), hitMat);
    hit.position.copy(nodePositions[i]);
    hit.userData.index = i;
    nodeGroup.add(hit);
    hitMeshes.push(hit);
  }

  /* Pipeline ring connecting the stages (teal, not red) */
  const threadMats = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const next = (i + 1) % NODE_COUNT;
    const mat = new THREE.LineBasicMaterial({ color: cur.thread, transparent: true, opacity: 0 });
    threadMats.push(mat);
    const geo = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[next]]);
    nodeGroup.add(new THREE.Line(geo, mat));
  }

  /* ---------- Data streams (descent) ---------- */
  const streamCurves = [];
  for (let s = 0; s < STREAM_COUNT; s++) {
    const xOff = (s - (STREAM_COUNT - 1) / 2) * 1.1;
    streamCurves.push(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(xOff * 1.6, 0.4, 0.5),
        new THREE.Vector3(xOff * 1.2, -0.8, -1.2),
        new THREE.Vector3(xOff * 0.8, -1.8, -3),
        new THREE.Vector3(xOff * 0.5, -2.3, -4.6),
        new THREE.Vector3(xOff * 0.25, -2.45, -6),
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
    // roughly 1 in 8 records fails validation
    streamDropped[i] = rand() < 0.13 ? 1 : 0;
  }
  const streamGeo = new THREE.BufferGeometry();
  streamGeo.setAttribute("position", new THREE.BufferAttribute(streamPos, 3));
  streamGeo.setAttribute("color", new THREE.BufferAttribute(streamCol, 3));
  const streamMat = new THREE.PointsMaterial({
    size: 0.045,
    transparent: true,
    opacity: 0,
    vertexColors: true,
    depthWrite: false,
  });
  scene.add(new THREE.Points(streamGeo, streamMat));

  /* ---------- Computation city (lattice) ---------- */
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
    scatter.push(
      new THREE.Vector3((rand() - 0.5) * 16, (rand() - 0.5) * 10 - 2, (rand() - 0.5) * 14 - 6)
    );
    const gx = i % gridW;
    const gz = Math.floor(i / gridW);
    const height = 0.4 + Math.abs(Math.sin(gx * 1.7 + gz * 2.3)) * 1.6;
    target.push(
      new THREE.Vector3((gx - gridW / 2) * 0.42, -2.9 + height * 0.5, -4.5 - gz * 0.42)
    );
  }
  const dummy = new THREE.Object3D();
  const heights = target.map((_, i) => {
    const gx = i % gridW;
    const gz = Math.floor(i / gridW);
    return 0.4 + Math.abs(Math.sin(gx * 1.7 + gz * 2.3)) * 1.6;
  });

  /* ---------- Project monoliths ---------- */
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
    mesh.position.set(side * (1.2 + (i % 2) * 0.4), -2.3 + h / 2 - 0.8, -4.5 - i * 1.6);
    monolithGroup.add(mesh);

    const edgeMat = new THREE.LineBasicMaterial({ color: cur.monolithEdge, transparent: true, opacity: 0 });
    monolithEdgeMats.push(edgeMat);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat);
    edges.position.copy(mesh.position);
    monolithGroup.add(edges);
  }

  /* ---------- Final connective web ---------- */
  const webMat = new THREE.LineBasicMaterial({ color: cur.thread, transparent: true, opacity: 0 });
  const webPts = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    webPts.push(nodePositions[i].clone(), new THREE.Vector3(0, -2.4, -6));
  }
  const webGeo = new THREE.BufferGeometry().setFromPoints(webPts);
  scene.add(new THREE.LineSegments(webGeo, webMat));

  /* ---------- State ---------- */
  let progress = 0;
  let disposed = false;
  let lastAssembly = -1;

  const tmpColor = new THREE.Color();
  const streamColor = new THREE.Color();
  const badCol = new THREE.Color(0xb89858); // amber = dropped records (not all-red scene)

  /* ---------- Pointer: parallax + territory raycast ---------- */
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const parTarget = { x: 0, y: 0 };
  const par = { x: 0, y: 0 };
  let pointerActive = false;
  let hovered = -1;

  /** ndcX/ndcY in NDC space (-1..1, y up). */
  function setPointer(ndcX, ndcY) {
    parTarget.x = ndcX;
    parTarget.y = ndcY;
    pointerNdc.set(ndcX, ndcY);
    pointerActive = true;
  }

  function pickTerritory() {
    if (!pointerActive) return -1;
    const active = Math.max(seg(0.08, 0.16) * (1 - seg(0.3, 0.4)), seg(0.88, 1));
    if (active < 0.25) return -1;
    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(hitMeshes, false);
    return hits.length ? hits[0].object.userData.index : -1;
  }

  /** Returns the hovered territory index (or -1); call on canvas click. */
  function click() {
    return hovered;
  }

  function setProgress(t) {
    progress = Math.max(0, Math.min(1, t));
  }

  function setTheme(dark) {
    from = {
      bg: cur.bg.clone(),
      dust: cur.dust.clone(),
      node: cur.node.clone(),
      thread: cur.thread.clone(),
      stream: cur.stream.clone(),
      lattice: cur.lattice.clone(),
      latticeEdge: cur.latticeEdge.clone(),
      monolith: cur.monolith.clone(),
      monolithEdge: cur.monolithEdge.clone(),
      ambient: ambient.intensity,
      key: key.intensity,
    };
    cur = palette(dark);
    themeMix = 0;
    themeStart = performance.now();
  }

  function applyTheme(mix) {
    const k = smoothstep(mix);
    tmpColor.lerpColors(from.bg, cur.bg, k);
    renderer.setClearColor(tmpColor, 1);
    scene.fog.color.copy(tmpColor);
    dustMat.color.lerpColors(from.dust, cur.dust, k);
    nodeMats.forEach((m, i) => {
      // Keep stage identity colors; only soften slightly toward theme
      const base = nodeBaseColors[i];
      m.color.copy(base);
      m.emissive.copy(base);
    });
    threadMats.forEach((m) => m.color.lerpColors(from.thread, cur.thread, k));
    latticeMat.color.lerpColors(from.lattice, cur.lattice, k);
    latticeMat.emissive.lerpColors(from.latticeEdge, cur.latticeEdge, k);
    monolithMats.forEach((m) => m.color.lerpColors(from.monolith, cur.monolith, k));
    monolithEdgeMats.forEach((m) => m.color.lerpColors(from.monolithEdge, cur.monolithEdge, k));
    webMat.color.lerpColors(from.thread, cur.thread, k);
    ambient.intensity = from.ambient + (cur.ambient - from.ambient) * k;
    key.intensity = from.key + (cur.key - from.key) * k;
    accent.color.copy(nodeBaseColors[0]);
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
    par.x += (parTarget.x - par.x) * 0.055;
    par.y += (parTarget.y - par.y) * 0.055;
    sampleCamera(progress, camState);
    camera.position.set(
      camState.pos.x + par.x * 0.34,
      camState.pos.y + par.y * 0.2,
      camState.pos.z
    );
    camera.lookAt(camState.look.x - par.x * 0.16, camState.look.y - par.y * 0.1, camState.look.z);
    if (Math.abs(camera.fov - camState.fov) > 0.05) {
      camera.fov = camState.fov;
      camera.updateProjectionMatrix();
    }

    /* Territory hover */
    const nowHovered = pickTerritory();
    if (nowHovered !== hovered) {
      hovered = nowHovered;
      canvas.style.cursor = hovered >= 0 ? "pointer" : "";
      onTerritoryHover?.(hovered);
    }

    /* Phase intensities — systems map → pipelines → architecture → gallery → reveal */
    const constellationT = Math.max(seg(0.06, 0.14) * (1 - seg(0.32, 0.42)), seg(0.88, 1) * 0.85);
    const streamsT = seg(0.3, 0.42) * (1 - seg(0.58, 0.68));
    const cityT = seg(0.45, 0.58);
    const galleryT = seg(0.55, 0.74);
    const finaleT = seg(0.9, 1);

    const nodeVis = Math.max(constellationT, finaleT, 0.15); // keep icons readable early
    nodeMats.forEach((m, i) => {
      const local = Math.min(1, Math.max(0.25, nodeVis));
      m.opacity = local * 0.98;
      m.emissiveIntensity = local * (0.35 + (i === hovered ? 0.85 : 0.15));
    });
    nodeMeshes.forEach((mesh, i) => {
      const targetScale = i === hovered ? 1.55 : 1;
      const s = mesh.scale.x + (targetScale - mesh.scale.x) * 0.14;
      mesh.scale.setScalar(s);
      mesh.rotation.y = time * 0.0004 + i * 0.4;
    });
    threadMats.forEach((m, i) => {
      const base = Math.max(constellationT * 0.45, finaleT * 0.35, 0.12);
      m.opacity = i === hovered || i === (hovered - 1 + NODE_COUNT) % NODE_COUNT ? Math.min(1, base * 2.2) : base;
    });
    nodeGroup.rotation.y = time * 0.00008;

    /* Data streams — records flow, validation drops the bad ones */
    streamMat.opacity = streamsT * 0.9;
    if (streamsT > 0.01) {
      streamColor.lerpColors(from.stream ?? cur.stream, cur.stream, smoothstep(themeMix));
      for (let i = 0; i < streamTotal; i++) {
        streamT[i] += streamSpeed[i];
        if (streamT[i] > 1) streamT[i] -= 1;
        const s = Math.floor(i / PARTICLES_PER_STREAM);
        const p = streamCurves[s].getPoint(streamT[i]);
        const dropped = streamDropped[i] === 1 && streamT[i] > 0.55;
        // dropped records fall out of the stream after the validation gate
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

    /* City assembles from chaos */
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

    /* Monolith gallery wakes as camera passes */
    monolithMats.forEach((m, i) => {
      const local = Math.min(1, Math.max(0, galleryT * MONOLITH_COUNT * 1.4 - i));
      m.opacity = local * 0.95;
    });
    monolithEdgeMats.forEach((m, i) => {
      const local = Math.min(1, Math.max(0, galleryT * MONOLITH_COUNT * 1.4 - i));
      m.opacity = local * (0.5 + Math.sin(time * 0.0018 + i) * 0.18);
    });

    /* Final connected reveal */
    webMat.opacity = finaleT * 0.3;

    renderer.render(scene, camera);
  }

  function dispose() {
    disposed = true;
    renderer.dispose();
    dustGeo.dispose();
    dustMat.dispose();
    streamGeo.dispose();
    streamMat.dispose();
    latticeGeo.dispose();
    latticeMat.dispose();
    webGeo.dispose();
    webMat.dispose();
    nodeGroup.traverse((o) => {
      o.geometry?.dispose?.();
      o.material?.dispose?.();
    });
    monolithGroup.traverse((o) => {
      o.geometry?.dispose?.();
      o.material?.dispose?.();
    });
  }

  return { setProgress, setPointer, click, setTheme, resize, render, dispose };
}
