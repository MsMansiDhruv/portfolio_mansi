import * as THREE from "three";
import { spherePoint, fibonacciPoints } from "./sphereMath";

const RADIUS = 2.2;

function themeColors(isDark) {
  return isDark
    ? {
        bg: 0x080a10,
        globe: 0x141c28,
        wire: 0x3a4556,
        node: 0xc45c5c,
        nodeHover: 0xe8e4dc,
        particle: 0x6eb5c0,
        thread: 0xc45c5c,
        ambient: 0xffffff,
        ambientInt: 0.12,
        keyInt: 0.35,
      }
    : {
        bg: 0xebe6dc,
        globe: 0xd4cfc4,
        wire: 0x8a8478,
        node: 0xa04040,
        nodeHover: 0x1a1520,
        particle: 0x5a7a82,
        thread: 0xa04040,
        ambient: 0xffffff,
        ambientInt: 0.55,
        keyInt: 0.25,
      };
}

export function createUniverse(canvas, { nodes, isDark, onHover, onNodeClick }) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  let colors = themeColors(isDark);
  let darkMode = isDark;
  renderer.setClearColor(colors.bg, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(colors.bg, 0.08);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.set(0, 0.3, 6.2);

  const ambient = new THREE.AmbientLight(colors.ambient, colors.ambientInt);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, colors.keyInt);
  keyLight.position.set(2, 3, 4);
  scene.add(keyLight);

  const accentLight = new THREE.PointLight(colors.node, isDark ? 0.5 : 0.25, 12);
  accentLight.position.set(-1, 1, 2);
  scene.add(accentLight);

  const universeGroup = new THREE.Group();
  scene.add(universeGroup);

  // Constellation shell
  const shellGeo = new THREE.IcosahedronGeometry(RADIUS, 2);
  const shellMat = new THREE.MeshStandardMaterial({
    color: colors.globe,
    metalness: 0.35,
    roughness: 0.75,
    transparent: true,
    opacity: isDark ? 0.35 : 0.55,
  });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  universeGroup.add(shell);

  const wire = new THREE.Mesh(
    shellGeo,
    new THREE.MeshBasicMaterial({
      color: colors.wire,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.12 : 0.2,
    })
  );
  universeGroup.add(wire);

  // Surface particles
  const pts = fibonacciPoints(420, RADIUS * 1.01);
  const pPositions = new Float32Array(pts.length * 3);
  pts.forEach((p, i) => {
    pPositions[i * 3] = p.x;
    pPositions[i * 3 + 1] = p.y;
    pPositions[i * 3 + 2] = p.z;
  });
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({
    color: colors.particle,
    size: 0.025,
    transparent: true,
    opacity: isDark ? 0.45 : 0.35,
    depthWrite: false,
  });
  const particles = new THREE.Points(pGeo, pMat);
  universeGroup.add(particles);

  // Node meshes
  const nodeMeshes = [];
  const threadGroup = new THREE.Group();
  universeGroup.add(threadGroup);

  nodes.forEach((node) => {
    const coords = spherePoint(node.theta, node.phi, RADIUS * 1.08);
    const pos = new THREE.Vector3(coords.x, coords.y, coords.z);
    const geo = new THREE.SphereGeometry(0.06, 12, 12);
    const mat = new THREE.MeshStandardMaterial({
      color: colors.node,
      emissive: colors.node,
      emissiveIntensity: isDark ? 0.35 : 0.15,
      metalness: 0.4,
      roughness: 0.5,
      transparent: true,
      opacity: 1,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData = { nodeId: node.id };
    universeGroup.add(mesh);
    nodeMeshes.push({ mesh, node, pos });

    const threadGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(pos.x, pos.y, pos.z),
    ]);
    const thread = new THREE.Line(
      threadGeo,
      new THREE.LineBasicMaterial({
        color: colors.thread,
        transparent: true,
        opacity: 0,
      })
    );
    thread.userData = { nodeId: node.id };
    threadGroup.add(thread);
  });

  // Interaction
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hoveredId = null;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let rotY = 0;
  let rotX = 0.15;
  let intro = 0;
  let disposed = false;
  let transition = null;
  let connectedLevel = 0;

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function beginTransition(nodeId, onComplete) {
    if (transition) return;

    const entry = nodeMeshes.find((n) => n.node.id === nodeId);
    if (!entry) {
      onComplete?.();
      return;
    }

    isDragging = false;
    velocityX = 0;
    velocityY = 0;

    transition = {
      duration: 920,
      start: performance.now(),
      target: entry.mesh,
      onComplete: typeof onComplete === "function" ? onComplete : null,
    };
  }

  function setConnectedLevel(level) {
    connectedLevel = Math.max(0, Math.min(1, level));
    threadGroup.children.forEach((t) => {
      if (t.userData.nodeId !== hoveredId) {
        t.material.opacity = connectedLevel * 0.18;
      }
    });
    pMat.opacity = (darkMode ? 0.45 : 0.35) + connectedLevel * 0.2;
  }

  function setTheme(dark) {
    darkMode = dark;
    colors = themeColors(dark);
    renderer.setClearColor(colors.bg, 1);
    scene.fog.color.setHex(colors.bg);
    shellMat.color.setHex(colors.globe);
    shellMat.opacity = dark ? 0.35 : 0.55;
    wire.material.color.setHex(colors.wire);
    pMat.color.setHex(colors.particle);
    pMat.opacity = (dark ? 0.45 : 0.35) + connectedLevel * 0.2;
    nodeMeshes.forEach(({ mesh }) => {
      mesh.material.color.setHex(colors.node);
      mesh.material.emissive.setHex(colors.node);
      mesh.material.emissiveIntensity = dark ? 0.35 : 0.15;
    });
    threadGroup.children.forEach((t) => t.material.color.setHex(colors.thread));
    ambient.intensity = colors.ambientInt;
    keyLight.intensity = colors.keyInt;
    accentLight.intensity = dark ? 0.5 : 0.25;
  }

  function updatePointer(e, rect) {
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pick() {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));
    const id = hits[0]?.object?.userData?.nodeId ?? null;
    if (id !== hoveredId) {
      hoveredId = id;
      onHover?.(hoveredId);
      nodeMeshes.forEach(({ mesh, node }) => {
        const active = node.id === hoveredId;
        mesh.scale.setScalar(active ? 1.6 : 1);
        mesh.material.emissiveIntensity = active ? (darkMode ? 0.7 : 0.35) : darkMode ? 0.35 : 0.15;
      });
      threadGroup.children.forEach((t) => {
        if (t.userData.nodeId === hoveredId) {
          t.material.opacity = 0.45;
        } else {
          t.material.opacity = connectedLevel * 0.18;
        }
      });
    }
  }

  function bindEvents() {
    const el = canvas;

    const onDown = (e) => {
      if (transition) return;
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      velocityX = 0;
      velocityY = 0;
    };

    const onMove = (e) => {
      if (transition) return;
      const rect = el.getBoundingClientRect();
      updatePointer(e, rect);
      if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        velocityX = dx * 0.004;
        velocityY = dy * 0.003;
        rotY += velocityX;
        rotX = Math.max(-0.5, Math.min(0.5, rotX + velocityY));
        lastX = e.clientX;
        lastY = e.clientY;
      }
      pick();
    };

    const onUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      if (transition) return;
      if (Math.abs(velocityX) > 0.02 || Math.abs(velocityY) > 0.02) return;
      if (hoveredId) onNodeClick?.(hoveredId);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);
    el.addEventListener("click", onClick);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onUp);
      el.removeEventListener("click", onClick);
    };
  }

  const unbind = bindEvents();

  function setIntro(t) {
    intro = Math.max(0, Math.min(1, t));
  }

  function resize(w, h) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function render() {
    if (disposed) return;

    const now = performance.now();
    if (transition) {
      const elapsed = now - transition.start;
      const raw = Math.min(1, elapsed / transition.duration);
      const e = smoothstep(raw);

      camera.position.z = THREE.MathUtils.lerp(6.2, 1.6, e);
      camera.fov = THREE.MathUtils.lerp(42, 58, e);
      camera.updateProjectionMatrix();

      const target = transition.target;
      target.scale.setScalar(1 + e * 2.5);
      target.material.emissiveIntensity = darkMode ? 0.7 + e * 0.5 : 0.35 + e * 0.3;

      nodeMeshes.forEach(({ mesh }) => {
        if (mesh !== target) {
          mesh.material.opacity = 1 - e * 0.85;
          mesh.material.transparent = true;
        }
      });
      shellMat.opacity = (darkMode ? 0.35 : 0.55) + e * 0.25;

      if (raw >= 1) {
        const done = transition.onComplete;
        transition = null;
        try {
          done?.();
        } catch (err) {
          console.error("[universe] transition complete failed:", err);
        }
      }
    } else if (!isDragging) {
      rotY += velocityX;
      rotX += velocityY;
      velocityX *= 0.94;
      velocityY *= 0.94;
    }
    universeGroup.rotation.y = rotY;
    universeGroup.rotation.x = rotX;
    universeGroup.rotation.y += 0.0008;

    const scale = 0.85 + intro * 0.15;
    universeGroup.scale.setScalar(scale);

    shell.rotation.y += 0.0003;
    wire.rotation.y -= 0.0002;

    if (connectedLevel > 0 && !transition) {
      threadGroup.children.forEach((t) => {
        if (t.userData.nodeId !== hoveredId) {
          t.material.opacity = Math.max(t.material.opacity, connectedLevel * 0.15);
        }
      });
    }

    renderer.render(scene, camera);
  }

  function dispose() {
    disposed = true;
    unbind();
    renderer.dispose();
    shellGeo.dispose();
    shellMat.dispose();
    pGeo.dispose();
    pMat.dispose();
    nodeMeshes.forEach(({ mesh }) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
  }

  return { setTheme, setIntro, setConnectedLevel, beginTransition, resize, render, dispose };
}
