import * as THREE from "three";

const INK = 0x0a0e14;
const ACCENT = 0x6eb5c0;
const CHAMPAGNE = 0xc4b896;
const IVORY = 0xe6e2da;

function ease(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function createDataWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(INK, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(INK, 0.045);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
  camera.position.set(0, 1.2, 8);

  const ambient = new THREE.AmbientLight(0xffffff, 0.08);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(IVORY, 0.35);
  keyLight.position.set(2, 4, 3);
  scene.add(keyLight);

  const accentLight = new THREE.PointLight(ACCENT, 0.6, 20);
  accentLight.position.set(-1, 2, 2);
  scene.add(accentLight);

  // --- Chaotic particles (raw data) ---
  const PARTICLE_COUNT = 2200;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const seeds = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
    seeds[i] = Math.random();
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: CHAMPAGNE,
    size: 0.035,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // --- Raw data fragments ---
  const fragmentGroup = new THREE.Group();
  for (let i = 0; i < 24; i++) {
    const frag = new THREE.Mesh(
      new THREE.BoxGeometry(0.12 + Math.random() * 0.2, 0.04, 0.08),
      new THREE.MeshStandardMaterial({
        color: IVORY,
        transparent: true,
        opacity: 0.2 + Math.random() * 0.25,
        metalness: 0.2,
        roughness: 0.8,
      })
    );
    frag.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 4, -2 - Math.random() * 8);
    frag.rotation.set(Math.random(), Math.random(), Math.random());
    fragmentGroup.add(frag);
  }
  scene.add(fragmentGroup);

  const pipelineGroup = new THREE.Group();
  const stageMeshes = [];
  const stageLabels = ["Raw", "Ingest", "Transform", "Store", "Analyze"];
  stageLabels.forEach((_, i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.55 + i * 0.08, 0.025, 8, 48),
      new THREE.MeshStandardMaterial({
        color: ACCENT,
        emissive: ACCENT,
        emissiveIntensity: 0.15,
        metalness: 0.6,
        roughness: 0.35,
        transparent: true,
        opacity: 0.7,
      })
    );
    ring.position.set(0, 0.5, -6 - i * 2.2);
    ring.rotation.x = Math.PI / 2;
    pipelineGroup.add(ring);
    stageMeshes.push(ring);

    const core = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.35, 0.35),
      new THREE.MeshStandardMaterial({
        color: IVORY,
        metalness: 0.3,
        roughness: 0.6,
        transparent: true,
        opacity: 0.25,
      })
    );
    core.position.copy(ring.position);
    pipelineGroup.add(core);
  });
  scene.add(pipelineGroup);

  // --- Stream line ---
  const streamPoints = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    streamPoints.push(new THREE.Vector3(Math.sin(t * 4) * 0.3, 0.5, -6 - t * 12));
  }
  const streamGeo = new THREE.BufferGeometry().setFromPoints(streamPoints);
  const streamLine = new THREE.Line(
    streamGeo,
    new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.35 })
  );
  scene.add(streamLine);

  // --- Engineering structure (modular boxes) ---
  const structureGroup = new THREE.Group();
  structureGroup.position.set(0, 0, -22);
  for (let i = 0; i < 8; i++) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.4 + Math.random() * 0.6, 0.8),
      new THREE.MeshStandardMaterial({
        color: 0x1a2230,
        metalness: 0.5,
        roughness: 0.7,
        transparent: true,
        opacity: 0.85,
      })
    );
    box.position.set((i % 4) * 1.4 - 2, Math.floor(i / 4) * 1.2, (i % 2) * 0.5);
    structureGroup.add(box);
  }
  const brokenPiece = structureGroup.children[3];
  scene.add(structureGroup);

  // --- Project artifacts ---
  const projectGroup = new THREE.Group();
  projectGroup.position.set(0, 1, -32);
  for (let i = 0; i < 3; i++) {
    const artifact = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.5 + i * 0.15, 0),
      new THREE.MeshStandardMaterial({
        color: CHAMPAGNE,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      })
    );
    artifact.position.set(i * 2.5 - 2.5, i * 0.3, 0);
    projectGroup.add(artifact);
  }
  scene.add(projectGroup);

  // --- Engineering signature (abstract, no face) ---
  const signature = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.65, 1),
    new THREE.MeshStandardMaterial({
      color: ACCENT,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })
  );
  signature.position.set(0, 2, -48);
  scene.add(signature);

  const innerSig = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.25, 0.06, 64, 8),
    new THREE.MeshStandardMaterial({
      color: CHAMPAGNE,
      emissive: CHAMPAGNE,
      emissiveIntensity: 0.2,
      metalness: 0.4,
      roughness: 0.5,
    })
  );
  signature.add(innerSig);

  // --- Convergence point (contact) ---
  const convergeGeo = new THREE.BufferGeometry();
  const convergePositions = new Float32Array(300 * 3);
  for (let i = 0; i < 300; i++) {
    convergePositions[i * 3] = (Math.random() - 0.5) * 4;
    convergePositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    convergePositions[i * 3 + 2] = -58 + Math.random() * 2;
  }
  convergeGeo.setAttribute("position", new THREE.BufferAttribute(convergePositions, 3));
  const convergePoints = new THREE.Points(
    convergeGeo,
    new THREE.PointsMaterial({ color: ACCENT, size: 0.04, transparent: true, opacity: 0.6 })
  );
  scene.add(convergePoints);

  let progress = 0;
  let time = 0;
  let broken = false;

  function setProgress(t) {
    progress = Math.max(0, Math.min(1, t));
    broken = progress > 0.42 && progress < 0.48;
  }

  function updateParticles() {
    const pos = particleGeo.attributes.position.array;
    const organize = ease(Math.max(0, Math.min(1, (progress - 0.05) / 0.25)));
    const converge = ease(Math.max(0, Math.min(1, (progress - 0.92) / 0.06)));

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const sx = seeds[i] * 100;
      const baseX = positions[i * 3];
      const baseY = positions[i * 3 + 1];
      const baseZ = positions[i * 3 + 2];

      const streamX = Math.sin(baseZ * 0.3 + time * 0.5 + sx) * 0.4 * organize;
      const streamY = baseY * (1 - organize * 0.7) + organize * 0.5;
      const streamZ = baseZ - progress * 18;

      const cx = converge > 0 ? lerp(streamX + baseX * (1 - organize), 0, converge) : streamX + baseX * (1 - organize * 0.85);
      const cy = converge > 0 ? lerp(streamY, 0, converge) : streamY;
      const cz = converge > 0 ? lerp(streamZ, -57, converge) : streamZ;

      pos[i * 3] = cx + Math.sin(time + sx) * 0.02 * (1 - organize);
      pos[i * 3 + 1] = cy + Math.cos(time * 0.7 + sx) * 0.02 * (1 - organize);
      pos[i * 3 + 2] = cz;
    }
    particleGeo.attributes.position.needsUpdate = true;
    particleMat.opacity = 0.25 + (1 - converge) * 0.45;
  }

  function updateCamera() {
    const p = progress;
    const eased = ease(p);

    // Continuous forward journey with gentle arcs — no teleports
    const z = lerp(8, -54, eased);
    let y = 1.2;
    let lookY = 0.5;

    if (p < 0.22) {
      y = lerp(1.2, 0.8, ease(p / 0.22));
    } else if (p < 0.4) {
      const t = (p - 0.22) / 0.18;
      y = lerp(0.8, 1.4, ease(t));
    } else if (p < 0.52) {
      y = 1.1 + Math.sin((p - 0.4) * 8) * 0.08;
    } else if (p < 0.76) {
      y = lerp(1.1, 2.2, ease((p - 0.52) / 0.24));
    } else {
      const t = ease((p - 0.76) / 0.24);
      y = lerp(2.2, 6, t);
      lookY = lerp(0.5, -2, t);
    }

    const x = Math.sin(p * Math.PI * 1.15) * 1.4;
    const roll = Math.sin(p * Math.PI * 2) * 0.02;

    camera.position.set(x, y, z);
    camera.rotation.z = roll;
    camera.lookAt(x * 0.3, lookY, z - 8);
  }

  function updateScene() {
    fragmentGroup.visible = progress > 0.06 && progress < 0.28;
    fragmentGroup.children.forEach((f, i) => {
      f.position.z -= 0.002;
      f.rotation.y += 0.003 + i * 0.0002;
      if (f.position.z < -18) f.position.z += 14;
    });

    pipelineGroup.visible = progress > 0.15;
    structureGroup.visible = progress > 0.35;
    projectGroup.visible = progress > 0.48;
    signature.visible = progress > 0.82;
    convergePoints.visible = progress > 0.9;

    stageMeshes.forEach((ring, i) => {
      const local = (progress - 0.18 - i * 0.035) / 0.12;
      ring.material.opacity = 0.15 + Math.max(0, Math.min(1, local)) * 0.65;
      ring.rotation.z += 0.002;
    });

    if (brokenPiece) {
      brokenPiece.position.y = broken ? 0.8 + Math.sin(time * 3) * 0.05 : 0;
      brokenPiece.rotation.z = broken ? 0.4 : 0;
    }

    signature.rotation.y = time * 0.15;
    signature.rotation.x = Math.sin(time * 0.2) * 0.2;
    innerSig.rotation.x = time * 0.4;

    projectGroup.children.forEach((c, i) => {
      c.rotation.y = time * (0.2 + i * 0.05);
    });

    accentLight.intensity = 0.4 + Math.sin(time * 0.5) * 0.15;
  }

  function resize(width, height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function render() {
    time += 0.008;
    updateParticles();
    updateCamera();
    updateScene();
    renderer.render(scene, camera);
  }

  function dispose() {
    renderer.dispose();
    particleGeo.dispose();
    particleMat.dispose();
    streamGeo.dispose();
    convergeGeo.dispose();
  }

  return { setProgress, resize, render, dispose };
}
