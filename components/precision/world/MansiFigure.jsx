"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { PRECISION_ASSETS, smoothstep, lerp } from "@/lib/data/precision";

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
 * Cinematic Mansi — digitized from authored stills (unaltered face).
 * Sparse presence: scale reference, not the visual centerpiece.
 */
export default function MansiFigure({ progressRef, theme, activeSlug }) {
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
    const g = progressRef.current || 0;

    // Appear sparingly: far at start, approach mid, leave during deep work/exhibit
    const show =
      smoothstep(0.02, 0.12, g) *
      (1 - smoothstep(0.62, 0.78, g)) *
      (activeSlug ? 0 : 1);

    root.current.visible = show > 0.05;
    if (show < 0.05) return;

    const approach = smoothstep(0.1, 0.35, g);
    const mid = smoothstep(0.35, 0.55, g);

    const x = lerp(2.4, 1.6, approach) + lerp(0, -0.4, mid);
    const z = lerp(17.5, 11.5, approach) + lerp(0, -4.5, mid);

    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, x, 1.6, dt);
    root.current.position.z = THREE.MathUtils.damp(root.current.position.z, z, 1.6, dt);
    root.current.scale.setScalar(1.05 + approach * 0.08);

    if (plate.current) {
      plate.current.lookAt(camera.position.x, root.current.position.y + 1.1, camera.position.z);
    }
  });

  if (!map) return null;

  return (
    <group ref={root} position={[2.4, 0, 17.5]}>
      <mesh ref={plate} position={[0, 1.15, 0]}>
        <planeGeometry args={[0.85, 1.85]} />
        <meshBasicMaterial
          map={map}
          transparent
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.22, 24]} />
        <meshBasicMaterial color="#000" transparent opacity={theme === "day" ? 0.08 : 0.22} />
      </mesh>
    </group>
  );
}
