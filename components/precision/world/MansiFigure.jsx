"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { PRECISION_ASSETS } from "@/lib/data/precision";

function cropFigure(image, opts) {
  const { x, y, w, h } = opts;
  const sw = Math.max(8, Math.floor(image.width * w));
  const sh = Math.max(8, Math.floor(image.height * h));
  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    image,
    Math.floor(image.width * x),
    Math.floor(image.height * y),
    sw,
    sh,
    0,
    0,
    sw,
    sh
  );
  const data = ctx.getImageData(0, 0, sw, sh);
  const d = data.data;
  const cx = sw * 0.5;
  const cy = sh * 0.5;
  for (let i = 0; i < d.length; i += 4) {
    const px = (i / 4) % sw;
    const py = Math.floor(i / 4 / sw);
    const nx = (px - cx) / (sw * 0.46);
    const ny = (py - cy) / (sh * 0.5);
    const r = Math.sqrt(nx * nx + ny * ny * 0.92);
    const a = Math.max(0, Math.min(1, 1.28 - r));
    d[i + 3] = Math.floor(d[i + 3] * Math.pow(a, 1.25));
  }
  ctx.putImageData(data, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Human-scale Mansi — sparse presence inside the world.
 * Existing character asset, unaltered face. Not a hero illustration.
 */
export default function MansiFigure({ theme, interactionRef, activeSlug }) {
  const root = useRef();
  const plate = useRef();
  const nightImg = useLoader(THREE.TextureLoader, PRECISION_ASSETS.lookingBack);
  const heroImg = useLoader(THREE.TextureLoader, PRECISION_ASSETS.hero);
  const [mapN, setMapN] = useState(null);
  const [mapD, setMapD] = useState(null);

  useEffect(() => {
    if (!nightImg.image || !heroImg.image) return;
    const n = cropFigure(nightImg.image, { x: 0.34, y: 0.28, w: 0.32, h: 0.62 });
    const h = cropFigure(heroImg.image, { x: 0.48, y: 0.2, w: 0.28, h: 0.6 });
    setMapN(n);
    setMapD(h);
    return () => {
      n.dispose();
      h.dispose();
    };
  }, [nightImg, heroImg]);

  const map = theme === "day" ? mapD || mapN : mapN || mapD;

  useFrame(({ camera }, delta) => {
    if (!root.current) return;
    const dt = Math.min(delta, 0.05);
    const hide = !!activeSlug;
    root.current.visible = !hide;
    if (hide) return;

    const energy = interactionRef?.current?.energy ?? 0.25;
    // Observe near home — slight drift toward live streams
    const tx = 2.15 + Math.sin(energy * 2) * 0.15;
    const tz = 9.8 - energy * 1.4;

    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, tx, 1.2, dt);
    root.current.position.z = THREE.MathUtils.damp(root.current.position.z, tz, 1.2, dt);

    if (plate.current) {
      plate.current.lookAt(camera.position.x, root.current.position.y + 1.05, camera.position.z);
    }
  });

  if (!map) return null;

  return (
    <group ref={root} position={[2.2, 0, 10]}>
      <mesh ref={plate} position={[0, 1.05, 0]}>
        <planeGeometry args={[0.72, 1.55]} />
        <meshBasicMaterial
          map={map}
          transparent
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <circleGeometry args={[0.18, 24]} />
        <meshBasicMaterial color="#000" transparent opacity={theme === "day" ? 0.07 : 0.2} />
      </mesh>
    </group>
  );
}
