import * as THREE from "three";

/**
 * THE LIVING SYSTEM — Quiet Instrument
 * Classy tech cinema: physical data, Clarification, exhibition halls, reasoning chamber.
 * Materials + light + depth — not neon.
 */

const FLOW_COUNT = 5;
const PARTICLES_PER = 90;
const DUST = 280;

function palette(dark) {
  return dark
    ? {
        bg: new THREE.Color(0x0a0c10),
        fog: new THREE.Color(0x0a0c10),
        steel: new THREE.Color(0x2a3340),
        graphite: new THREE.Color(0x141820),
        signal: new THREE.Color(0x5b7c8a),
        amber: new THREE.Color(0xc4a06a),
        ivory: new THREE.Color(0xece8e1),
        noise: new THREE.Color(0x6a5040),
        green: new THREE.Color(0x2a3d36),
        ambient: 0.22,
        key: 0.38,
        fogNear: 6,
        fogFar: 28,
      }
    : {
        bg: new THREE.Color(0xf3efe7),
        fog: new THREE.Color(0xe8e2d8),
        steel: new THREE.Color(0x6a7380),
        graphite: new THREE.Color(0xd8d2c6),
        signal: new THREE.Color(0x5a7588),
        amber: new THREE.Color(0xb8925c),
        ivory: new THREE.Color(0x16181e),
        noise: new THREE.Color(0xa08060),
        green: new THREE.Color(0x6d8578),
        ambient: 0.7,
        key: 0.32,
        fogNear: 8,
        fogFar: 36,
      };
}

const CAM_KEYS = [
  { t: 0.0, pos: [0.2, 1.2, 14], look: [0, 0.2, 0], fov: 36 },
  { t: 0.08, pos: [0.1, 0.9, 12], look: [0, 0.1, -1], fov: 38 },
  { t: 0.18, pos: [1.4, 0.5, 8.5], look: [0, -0.2, -2], fov: 40 },
  { t: 0.3, pos: [-0.8, 0.2, 5.5], look: [0.2, -0.4, -4], fov: 42 },
  { t: 0.4, pos: [0.3, 0.1, 3.2], look: [0, -0.2, -6], fov: 40 },
  { t: 0.48, pos: [0, 0.4, 1.5], look: [0, 0, -8], fov: 34 },
  { t: 0.56, pos: [2.2, -0.2, -2], look: [1.5, -0.5, -6], fov: 42 },
  { t: 0.64, pos: [-1.8, -0.4, -5], look: [-1, -0.6, -9], fov: 42 },
  { t: 0.7, pos: [1.6, -0.3, -8], look: [0.5, -0.5, -12], fov: 40 },
  { t: 0.78, pos: [0, 0.6, -11], look: [0, 0.2, -16], fov: 38 },
  { t: 0.88, pos: [0, 1.8, -8], look: [0, 0, -12], fov: 36 },
  { t: 1.0, pos: [0, 3.5, 6], look: [0, -0.5, -6], fov: 34 },
];

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function sampleCam(progress, out) {
  let a = CAM_KEYS[0];
  let b = CAM_KEYS[CAM_KEYS.length - 1];
  for (let i = 0; i < CAM_KEYS.length - 1; i++) {
    if (progress >= CAM_KEYS[i].t && progress <= CAM_KEYS[i + 1].t) {
      a = CAM_KEYS[i];
      b = CAM_KEYS[i + 1];
      break;
    }
  }
  const k = smoothstep(Math.min(1, Math.max(0, (progress - a.t) / Math.max(1e-6, b.t - a.t))));
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

/** Tiny back-facing scale mark — never a portrait */
function createSilhouette(mat) {
  const g = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), mat);
  head.position.y = 0.48;
  g.add(head);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.22, 2, 6), mat);
  body.position.y = 0.22;
  g.add(body);
  const legL = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.18, 2, 4), mat);
  legL.position.set(-0.04, -0.12, 0);
  g.add(legL);
  const legR = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.18, 2, 4), mat);
  legR.position.set(0.04, -0.12, 0);
  g.add(legR);
  return g;
}

function makeFlowCurve(i, clarified) {
  const side = i % 2 === 0 ? -1 : 1;
  const spread = clarified ? 0.15 : 1.1 + i * 0.25;
  const yOff = clarified ? 0 : (i - 2) * 0.35;
  const pts = [
    new THREE.Vector3(side * spread * 1.8, yOff + 0.8, 10),
    new THREE.Vector3(side * spread * 1.2, yOff * 0.6, 6),
    new THREE.Vector3(side * (clarified ? 0.08 : spread * 0.7), clarified ? 0 : yOff * 0.3, 2),
    new THREE.Vector3(0, clarified ? -0.1 : yOff * 0.1, -2),
    new THREE.Vector3(0, 0, -8),
  ];
  return new THREE.CatmullRomCurve3(pts);
}

export function createCinematicWorld(canvas, { isDark = true, onTerritoryHover } = {}) {
  let cur = palette(isDark);
  let from = null;
  let themeMix = 1;
  let themeT0 = 0;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(cur.bg, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(cur.fog, cur.fogNear, cur.fogFar);
  scene.background = cur.bg.clone();

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
  const camState = { pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 36 };
  const lookTarget = new THREE.Vector3();

  const ambient = new THREE.AmbientLight(0xffffff, cur.ambient);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xf0ebe3, cur.key);
  key.position.set(4, 8, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x5b7c8a, 0.12);
  fill.position.set(-5, 2, -3);
  scene.add(fill);
  const amberPoint = new THREE.PointLight(0xc4a06a, 0.35, 18);
  amberPoint.position.set(0, 1.5, -6);
  scene.add(amberPoint);

  /* Ground plane — instrument floor */
  const floorMat = new THREE.MeshStandardMaterial({
    color: cur.graphite,
    metalness: 0.35,
    roughness: 0.75,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 60), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.8;
  scene.add(floor);

  /* Fine structural rails */
  const railMat = new THREE.MeshStandardMaterial({
    color: cur.steel,
    metalness: 0.55,
    roughness: 0.45,
  });
  const rails = new THREE.Group();
  scene.add(rails);
  for (let i = 0; i < 4; i++) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 22), railMat);
    rail.position.set((i - 1.5) * 2.2, -1.55, -2);
    rails.add(rail);
  }

  /* Sparse dust */
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 24;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: cur.signal,
    size: 0.025,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  scene.add(new THREE.Points(dustGeo, dustMat));

  /* Physical flows — weight, velocity, noise until Clarification */
  const flowCurvesChaos = [];
  const flowCurvesClear = [];
  for (let i = 0; i < FLOW_COUNT; i++) {
    flowCurvesChaos.push(makeFlowCurve(i, false));
    flowCurvesClear.push(makeFlowCurve(i, true));
  }

  const flowTotal = FLOW_COUNT * PARTICLES_PER;
  const flowGeo = new THREE.BufferGeometry();
  const flowPos = new Float32Array(flowTotal * 3);
  const flowCol = new Float32Array(flowTotal * 3);
  const flowT = new Float32Array(flowTotal);
  const flowSpeed = new Float32Array(flowTotal);
  const flowNoise = new Float32Array(flowTotal);
  for (let i = 0; i < flowTotal; i++) {
    flowT[i] = Math.random();
    flowSpeed[i] = 0.0008 + Math.random() * 0.0018;
    flowNoise[i] = Math.random() > 0.72 ? 1 : 0;
  }
  flowGeo.setAttribute("position", new THREE.BufferAttribute(flowPos, 3));
  flowGeo.setAttribute("color", new THREE.BufferAttribute(flowCol, 3));
  const flowMat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    sizeAttenuation: true,
  });
  scene.add(new THREE.Points(flowGeo, flowMat));

  /* Channel tubes (architectural, not neon) */
  const channelGroup = new THREE.Group();
  scene.add(channelGroup);
  const channelMats = [];
  for (let i = 0; i < FLOW_COUNT; i++) {
    const curve = flowCurvesChaos[i];
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 48, 0.035, 5, false),
      new THREE.MeshStandardMaterial({
        color: cur.steel,
        metalness: 0.5,
        roughness: 0.55,
        transparent: true,
        opacity: 0,
      })
    );
    channelMats.push(tube.material);
    channelGroup.add(tube);
  }

  /* Core instrument mass — clarified architecture */
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);
  const coreMat = new THREE.MeshStandardMaterial({
    color: cur.graphite,
    metalness: 0.45,
    roughness: 0.5,
    transparent: true,
    opacity: 0,
  });
  const core = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.4, 1.2), coreMat);
  core.position.set(0, -0.2, -8);
  coreGroup.add(core);
  const coreEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.8, 2.4, 1.2)),
    new THREE.LineBasicMaterial({ color: cur.signal, transparent: true, opacity: 0 })
  );
  coreEdge.position.copy(core.position);
  coreGroup.add(coreEdge);
  const coreEdgeMat = coreEdge.material;

  /* Four exhibition installations */
  const installGroup = new THREE.Group();
  scene.add(installGroup);
  const installMats = [];

  function addInstall(buildFn, x, z) {
    const g = new THREE.Group();
    g.position.set(x, -0.8, z);
    const mats = buildFn(g, cur);
    installMats.push(...mats);
    installGroup.add(g);
    return g;
  }

  /* A — Strata (modernization) */
  addInstall((g, pal) => {
    const mats = [];
    for (let i = 0; i < 3; i++) {
      const m = new THREE.MeshStandardMaterial({
        color: i === 0 ? pal.steel : i === 1 ? pal.signal : pal.amber,
        metalness: 0.4,
        roughness: 0.55,
        transparent: true,
        opacity: 0,
      });
      mats.push(m);
      const slab = new THREE.Mesh(new THREE.BoxGeometry(1.4 - i * 0.15, 0.12, 0.9), m);
      slab.position.y = i * 0.35;
      slab.rotation.y = (1 - i * 0.2) * 0.35;
      slab.userData.baseRot = slab.rotation.y;
      slab.userData.layer = i;
      g.add(slab);
    }
    return mats;
  }, 2.4, -5.5);

  /* B — Decision spine */
  addInstall((g, pal) => {
    const mats = [];
    const spineM = new THREE.MeshStandardMaterial({
      color: pal.signal,
      metalness: 0.5,
      roughness: 0.4,
      transparent: true,
      opacity: 0,
    });
    mats.push(spineM);
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8), spineM));
    for (let i = 0; i < 6; i++) {
      const m = new THREE.MeshStandardMaterial({
        color: pal.steel,
        metalness: 0.4,
        roughness: 0.5,
        transparent: true,
        opacity: 0,
      });
      mats.push(m);
      const thread = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.02), m);
      thread.position.set(-0.5, 0.6 - i * 0.22, (i - 2.5) * 0.08);
      thread.rotation.z = 0.35;
      g.add(thread);
    }
    return mats;
  }, -2.6, -8.2);

  /* C — Harvest atrium */
  addInstall((g, pal) => {
    const mats = [];
    const gateM = new THREE.MeshStandardMaterial({
      color: pal.amber,
      metalness: 0.45,
      roughness: 0.45,
      transparent: true,
      opacity: 0,
    });
    mats.push(gateM);
    const gate = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.04, 8, 24), gateM);
    gate.rotation.x = Math.PI / 2;
    g.add(gate);
    const crystalM = new THREE.MeshStandardMaterial({
      color: pal.signal,
      metalness: 0.55,
      roughness: 0.35,
      transparent: true,
      opacity: 0,
    });
    mats.push(crystalM);
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), crystalM);
    crystal.position.y = -0.15;
    g.add(crystal);
    return mats;
  }, 2.2, -11);

  /* D — Split volume */
  addInstall((g, pal) => {
    const mats = [];
    const leftM = new THREE.MeshStandardMaterial({
      color: pal.steel,
      metalness: 0.5,
      roughness: 0.4,
      transparent: true,
      opacity: 0,
    });
    const rightM = new THREE.MeshStandardMaterial({
      color: pal.signal,
      metalness: 0.4,
      roughness: 0.5,
      transparent: true,
      opacity: 0,
    });
    mats.push(leftM, rightM);
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.2, 0.55), leftM);
    left.position.x = -0.45;
    left.userData.split = -1;
    g.add(left);
    const right = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.85, 0.7), rightM);
    right.position.x = 0.45;
    right.userData.split = 1;
    g.add(right);
    return mats;
  }, -2.0, -13.5);

  /* Mind chamber — aperture + filaments */
  const mindGroup = new THREE.Group();
  mindGroup.position.set(0, 0.4, -17);
  scene.add(mindGroup);
  const mindRingMat = new THREE.MeshStandardMaterial({
    color: cur.ivory,
    metalness: 0.2,
    roughness: 0.6,
    transparent: true,
    opacity: 0,
  });
  const mindRing = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.03, 8, 48), mindRingMat);
  mindGroup.add(mindRing);
  const filamentMat = new THREE.LineBasicMaterial({ color: cur.ivory, transparent: true, opacity: 0 });
  const filPts = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    filPts.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(a) * 1.4, Math.sin(a) * 0.7, -0.2));
  }
  const filGeo = new THREE.BufferGeometry().setFromPoints(filPts);
  mindGroup.add(new THREE.LineSegments(filGeo, filamentMat));

  /* Silhouette — sparse scale */
  const silMat = new THREE.MeshStandardMaterial({
    color: 0x0a0c10,
    roughness: 0.95,
    metalness: 0.05,
    transparent: true,
    opacity: 0,
  });
  const silhouette = createSilhouette(silMat);
  scene.add(silhouette);

  /* Finale connective web */
  const webMat = new THREE.LineBasicMaterial({ color: cur.signal, transparent: true, opacity: 0 });
  const webPts = [
    new THREE.Vector3(2.4, -0.5, -5.5),
    new THREE.Vector3(0, -0.2, -8),
    new THREE.Vector3(-2.6, -0.5, -8.2),
    new THREE.Vector3(0, -0.2, -8),
    new THREE.Vector3(2.2, -0.5, -11),
    new THREE.Vector3(0, -0.2, -8),
    new THREE.Vector3(-2, -0.5, -13.5),
    new THREE.Vector3(0, -0.2, -8),
    new THREE.Vector3(0, 0.4, -17),
    new THREE.Vector3(0, -0.2, -8),
  ];
  const webGeo = new THREE.BufferGeometry().setFromPoints(webPts);
  scene.add(new THREE.LineSegments(webGeo, webMat));

  let progress = 0;
  let disposed = false;
  const pointer = new THREE.Vector2(0, 0);
  const tmp = new THREE.Vector3();
  const tmpB = new THREE.Vector3();

  function seg(a, b) {
    if (progress <= a) return 0;
    if (progress >= b) return 1;
    return (progress - a) / (b - a);
  }

  function setProgress(p) {
    progress = Math.min(1, Math.max(0, p));
  }

  function setPointer(x, y) {
    pointer.set(x, y);
  }

  function click() {
    return -1;
  }

  function setTheme(dark) {
    from = {
      bg: cur.bg.clone(),
      fog: cur.fog.clone(),
      steel: cur.steel.clone(),
      graphite: cur.graphite.clone(),
      signal: cur.signal.clone(),
      amber: cur.amber.clone(),
      ivory: cur.ivory.clone(),
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

  function render(time) {
    if (disposed) return;

    if (themeMix < 1) {
      themeMix = Math.min(1, (time - themeT0) / 1100);
      const k = smoothstep(themeMix);
      scene.background.lerpColors(from.bg, cur.bg, k);
      scene.fog.color.lerpColors(from.fog, cur.fog, k);
      renderer.setClearColor(scene.background, 1);
      floorMat.color.lerpColors(from.graphite, cur.graphite, k);
      railMat.color.lerpColors(from.steel, cur.steel, k);
      dustMat.color.lerpColors(from.signal, cur.signal, k);
      channelMats.forEach((m) => m.color.lerpColors(from.steel, cur.steel, k));
      coreMat.color.lerpColors(from.graphite, cur.graphite, k);
      coreEdgeMat.color.lerpColors(from.signal, cur.signal, k);
      webMat.color.lerpColors(from.signal, cur.signal, k);
      filamentMat.color.lerpColors(from.ivory, cur.ivory, k);
      mindRingMat.color.lerpColors(from.ivory, cur.ivory, k);
      ambient.intensity = from.ambient + (cur.ambient - from.ambient) * k;
      key.intensity = from.key + (cur.key - from.key) * k;
      scene.fog.near = cur.fogNear;
      scene.fog.far = cur.fogFar;
    }

    sampleCam(progress, camState);
    camera.position.lerp(camState.pos, 0.06);
    lookTarget.lerp(camState.look, 0.06);
    camera.lookAt(lookTarget);
    camera.fov += (camState.fov - camera.fov) * 0.05;
    camera.position.x += pointer.x * 0.12;
    camera.position.y += pointer.y * 0.06;
    camera.updateProjectionMatrix();

    const flowT_ = smoothstep(seg(0.08, 0.18)) * (1 - smoothstep(seg(0.5, 0.58)));
    const structureT = smoothstep(seg(0.24, 0.36));
    const clarifyT = smoothstep(seg(0.4, 0.5));
    const exhibitT = smoothstep(seg(0.52, 0.58));
    const mindT = smoothstep(seg(0.74, 0.84));
    const personT = smoothstep(seg(0.88, 0.96));

    /* Channels appear in structure */
    channelMats.forEach((m, i) => {
      m.opacity = structureT * (0.35 + (i % 3) * 0.08) * (1 - clarifyT * 0.5);
    });

    /* Flows — chaos → clarity */
    flowMat.opacity = Math.max(flowT_, clarifyT * 0.5) * 0.85;
    const clarify = clarifyT;
    for (let i = 0; i < flowTotal; i++) {
      const speedMul = 0.7 + (1 - flowNoise[i] * 0.5) * (0.5 + clarify * 0.8);
      flowT[i] += flowSpeed[i] * speedMul * (0.85 + (1 - clarify) * 0.4);
      if (flowT[i] > 1) flowT[i] -= 1;

      const s = Math.floor(i / PARTICLES_PER);
      const chaos = flowCurvesChaos[s].getPoint(flowT[i], tmp);
      const clear = flowCurvesClear[s].getPoint(flowT[i], tmpB);
      const x = chaos.x + (clear.x - chaos.x) * clarify;
      const y = chaos.y + (clear.y - chaos.y) * clarify;
      const z = chaos.z + (clear.z - chaos.z) * clarify;

      /* Noise particles fall away during clarification */
      const noiseDrop = flowNoise[i] * clarify;
      const fall = noiseDrop * noiseDrop * 1.8;
      const alive = 1 - noiseDrop;

      flowPos[i * 3] = x + (1 - clarify) * Math.sin(time * 0.001 + i) * 0.08 * flowNoise[i];
      flowPos[i * 3 + 1] = y - fall;
      flowPos[i * 3 + 2] = z;

      const isNoise = flowNoise[i] > 0.5 && clarify < 0.85;
      const c = isNoise ? cur.noise : cur.signal;
      flowCol[i * 3] = c.r * alive;
      flowCol[i * 3 + 1] = c.g * alive;
      flowCol[i * 3 + 2] = c.b * alive;
    }
    flowGeo.attributes.position.needsUpdate = true;
    flowGeo.attributes.color.needsUpdate = true;

    /* Core resolves at clarification hold */
    coreMat.opacity = clarifyT * 0.92;
    coreEdgeMat.opacity = clarifyT * (0.45 + Math.sin(time * 0.0012) * 0.08);
    core.scale.setScalar(0.85 + clarifyT * 0.15);

    /* Installations wake sequentially */
    const nInst = installGroup.children.length;
    installGroup.children.forEach((g, gi) => {
      const local = Math.min(1, Math.max(0, exhibitT * nInst * 1.35 - gi));
      g.children.forEach((child) => {
        if (child.material) {
          child.material.opacity = local * 0.9;
        }
        if (child.userData.baseRot != null) {
          child.rotation.y = child.userData.baseRot * (1 - local);
        }
        if (child.userData.split) {
          child.position.x = child.userData.split * (0.15 + local * 0.35);
        }
        if (child.geometry?.type === "OctahedronGeometry") {
          child.rotation.y = time * 0.0004;
        }
      });
    });

    /* Mind chamber */
    mindRingMat.opacity = mindT * 0.75;
    filamentMat.opacity = mindT * 0.35;
    mindRing.rotation.z = time * 0.00015;
    mindGroup.scale.setScalar(0.7 + mindT * 0.3);

    /* Finale web */
    webMat.opacity = personT * 0.28;

    /* Silhouette — rare scale beats */
    let silOp = 0;
    let silPos = [0.9, -1.15, 9.5];
    if (progress < 0.12) {
      silOp = smoothstep(seg(0.02, 0.06)) * (1 - smoothstep(seg(0.09, 0.12))) * 0.9;
      silPos = [0.85, -1.15, 9.2];
    } else if (progress > 0.48 && progress < 0.54) {
      silOp = 0.55;
      silPos = [1.1, -1.2, -6.5];
    } else if (progress > 0.76 && progress < 0.84) {
      silOp = 0.4;
      silPos = [0.7, -0.9, -15.5];
    } else if (progress > 0.92) {
      silOp = 0.5;
      silPos = [1.4, -1.1, -4];
    }
    silMat.opacity = silOp;
    silhouette.position.set(silPos[0], silPos[1], silPos[2]);
    silhouette.rotation.y = Math.PI + 0.15;
    silhouette.scale.setScalar(0.85);

    amberPoint.intensity = 0.2 + clarifyT * 0.35 + mindT * 0.15;

    onTerritoryHover?.(-1);
    renderer.render(scene, camera);
  }

  function dispose() {
    disposed = true;
    renderer.dispose();
    dustGeo.dispose();
    dustMat.dispose();
    flowGeo.dispose();
    flowMat.dispose();
    floor.geometry.dispose();
    floorMat.dispose();
    webGeo.dispose();
    webMat.dispose();
    filGeo.dispose();
    filamentMat.dispose();
    scene.traverse((o) => {
      o.geometry?.dispose?.();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose?.());
        else o.material.dispose?.();
      }
    });
  }

  return { setProgress, setPointer, click, setTheme, resize, render, dispose };
}
