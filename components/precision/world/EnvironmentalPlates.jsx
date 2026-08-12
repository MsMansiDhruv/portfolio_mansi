"use client";

import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PRECISION_ASSETS, THEME_PALETTE } from "@/lib/data/precision";

/**
 * Environmental plates — projected / mounted surfaces inside the hall.
 * Supporting assets, not page backgrounds.
 */
export default function EnvironmentalPlates({ theme }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const nightPlate = useTexture(PRECISION_ASSETS.nightFocus);
  const dayPlate = useTexture(PRECISION_ASSETS.dayClarity);
  const exhibit = useTexture(PRECISION_ASSETS.exhibition);
  const hero = useTexture(PRECISION_ASSETS.hero);
  const character = useTexture(PRECISION_ASSETS.characterMaster);

  [nightPlate, dayPlate, exhibit, hero, character].forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
  });

  const wallMap = theme === "day" ? dayPlate : nightPlate;

  return (
    <group>
      <group position={[-6.22, 2.35, 10]}>
        <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.04, 0, 0]}>
          <planeGeometry args={[5.7, 3.4]} />
          <meshStandardMaterial color={p.metalDark} metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[5.5, 3.2]} />
          <meshStandardMaterial
            map={wallMap}
            metalness={0.15}
            roughness={0.55}
            transparent
            opacity={theme === "day" ? 0.58 : 0.42}
          />
        </mesh>
      </group>

      <mesh position={[6.2, 2.2, 2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[4.8, 2.8]} />
        <meshStandardMaterial
          map={hero}
          metalness={0.12}
          roughness={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>

      <mesh position={[5.95, 1.7, 8.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.4, 1.8]} />
        <meshStandardMaterial
          map={character}
          metalness={0.05}
          roughness={0.6}
          transparent
          opacity={0.55}
        />
      </mesh>

      <mesh position={[-5.8, 2.1, -16]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5.2, 3]} />
        <meshStandardMaterial
          map={exhibit}
          metalness={0.1}
          roughness={0.48}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}
