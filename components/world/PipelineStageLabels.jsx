"use client";

import { Text } from "@react-three/drei";
import { THEME } from "@/lib/data/data-world";

/** Home-only 3D labels — kept out of project pages so Troika does not load there. */
export default function PipelineStageLabels({ stages, themeId }) {
  const t = THEME[themeId] || THEME.night;
  return (
    <>
      {stages.map((stage, index) => (
        <Text
          key={`${stage.label}-${index}`}
          position={stage.pos}
          fontSize={0.045}
          maxWidth={1.35}
          color={index === 0 ? t.accent : t.steel}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.002}
          outlineColor={t.bg}
        >
          {stage.label}
        </Text>
      ))}
    </>
  );
}
