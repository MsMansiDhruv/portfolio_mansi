"use client";

import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PRECISION_ASSETS, THEME_PALETTE } from "@/lib/data/precision";
import { EXHIBITION_EXHIBITS } from "@/lib/data/exhibition-exhibits";
import ProjectExhibit from "./ProjectExhibit";

/**
 * Open plaza — exhibits on the approach path, quiet continuation beyond.
 */
export default function ExhibitionHall({
  theme,
  activeSlug,
  nearSlug,
  onSelectExhibit,
}) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const labelColor = theme === "day" ? "#12141a" : "#e8eef6";
  const exhibitPlate = useTexture(PRECISION_ASSETS.exhibition);
  exhibitPlate.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -16]} receiveShadow>
        <planeGeometry args={[18, 24]} />
        <meshStandardMaterial color={p.floor} metalness={0.58} roughness={0.4} />
      </mesh>

      {/* Quiet media wall deeper in — atmosphere, not clutter */}
      <mesh position={[-6.9, 2.4, -14]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5.5, 2.8]} />
        <meshStandardMaterial map={exhibitPlate} roughness={0.5} metalness={0.05} />
      </mesh>

      <Text
        position={[-6.5, 4.0, 15.5]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.11}
        color={labelColor}
        anchorX="left"
        letterSpacing={0.12}
      >
        WORK · PLAZA
      </Text>

      {EXHIBITION_EXHIBITS.map((ex) => (
        <ProjectExhibit
          key={ex.slug}
          exhibit={ex}
          theme={theme}
          active={nearSlug === ex.slug}
          focused={activeSlug === ex.slug}
          onSelect={onSelectExhibit}
        />
      ))}
    </group>
  );
}
