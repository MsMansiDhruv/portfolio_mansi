"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { getPointMap } from "./pointMap";
import { THEME, semanticColor } from "@/lib/data/data-world";
import { EXPERIENCE_CHAMBERS } from "@/lib/data/mansi-experience";

/** Conceptual vocabulary for AI Lab — links only, no invented facts */
export const SEMANTIC_WORDS = [
  {
    id: "reason",
    label: "REASON",
    links: ["model", "context", "architecture"],
    mode: "architecture",
  },
  {
    id: "model",
    label: "MODEL",
    links: ["reason", "evaluation", "pipeline"],
    mode: "pipeline",
  },
  {
    id: "context",
    label: "CONTEXT",
    links: ["reason", "agent", "architecture"],
    mode: "ask",
  },
  {
    id: "agent",
    label: "AGENT",
    links: ["context", "pipeline", "evaluation"],
    mode: "ask",
  },
  {
    id: "pipeline",
    label: "PIPELINE",
    links: ["model", "agent", "cost"],
    mode: "pipeline",
  },
  {
    id: "architecture",
    label: "ARCHITECTURE",
    links: ["reason", "context", "cost"],
    mode: "architecture",
  },
  {
    id: "evaluation",
    label: "EVALUATION",
    links: ["model", "agent", "interview"],
    mode: "interview",
  },
  {
    id: "cost",
    label: "COST",
    links: ["pipeline", "architecture", "cloud"],
    mode: "cloud",
  },
  {
    id: "cloud",
    label: "CLOUD",
    links: ["cost", "architecture"],
    mode: "cloud",
  },
  {
    id: "interview",
    label: "INTERVIEW",
    links: ["evaluation", "reason"],
    mode: "interview",
  },
];

function wordHomePos(i, total) {
  const a = (i / total) * Math.PI * 2 - Math.PI / 2;
  const r = 0.75 + (i % 3) * 0.12;
  return [Math.cos(a) * r, Math.sin(a) * r * 0.55, Math.sin(a * 1.3) * 0.18];
}

function focusClusterPos(focusId) {
  const idx = SEMANTIC_WORDS.findIndex((w) => w.id === focusId);
  if (idx < 0) return null;
  const spread = 0.35;
  return SEMANTIC_WORDS.map((w, i) => {
    const rel = i - idx;
    const angle = (rel / SEMANTIC_WORDS.length) * Math.PI * 1.4;
    return [Math.sin(angle) * spread, Math.cos(angle) * spread * 0.6, rel * 0.04];
  });
}

function chamberPos(i, total) {
  const a = (i / total) * Math.PI * 2 + 0.5;
  return [Math.cos(a) * 1.35, -0.85 + Math.sin(a) * 0.25, Math.sin(a) * 0.2];
}

function connectedWords(hoverId, focusWord) {
  const anchor = hoverId || focusWord;
  if (!anchor) return null;
  const set = new Set([anchor]);
  SEMANTIC_WORDS.forEach((w) => {
    if (w.id === anchor) w.links.forEach((l) => set.add(l));
    if (w.links.includes(anchor)) set.add(w.id);
  });
  return set;
}

function SemanticWord({
  word,
  themeId,
  home,
  focusTargets,
  focusTRef,
  fadeRef,
  hot,
  dimmed,
  onWordHover,
  onWordSelect,
}) {
  const ref = useRef();
  const point = useRef();
  const t = THEME[themeId] || THEME.night;
  const color = semanticColor("ai", themeId);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const d = Math.min(dt, 0.05);
    const idx = SEMANTIC_WORDS.findIndex((w) => w.id === word.id);
    const target = focusTargets ? focusTargets[idx] || home : home;
    const u = focusTRef.current;
    const fade = fadeRef.current;
    ref.current.position.set(
      THREE.MathUtils.lerp(home[0], target[0], u),
      THREE.MathUtils.lerp(home[1], target[1], u),
      THREE.MathUtils.lerp(home[2], target[2], u)
    );
    const s = (hot ? 1.2 : dimmed ? 0.65 : 1) * fade;
    ref.current.scale.setScalar(
      THREE.MathUtils.damp(ref.current.scale.x || 0.001, Math.max(0.001, s), 6, d)
    );
    if (point.current?.material) {
      point.current.material.opacity = fade * (hot ? 0.95 : dimmed ? 0.25 : 0.7);
      point.current.material.size = hot ? 3.4 : 2.4;
      point.current.material.color.set(hot ? t.accent : t.steel);
    }
  });

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
    return g;
  }, []);

  return (
    <group
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation();
        onWordHover?.(word.id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onWordHover?.(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onWordSelect?.(word.id);
      }}
    >
      <points ref={point} geometry={geom} frustumCulled={false}>
        <pointsMaterial
          map={getPointMap()}
          size={2.4}
          sizeAttenuation={false}
          color={t.steel}
          transparent
          opacity={0.5}
          depthWrite={false}
          alphaTest={0.4}
          toneMapped={false}
        />
      </points>
      <mesh visible={false}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
      <Text
        position={[0, 0.1, 0]}
        fontSize={hot ? 0.055 : 0.042}
        color={hot ? t.ink : t.steel}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.002}
        outlineColor={t.bg}
        fillOpacity={hot ? 1 : dimmed ? 0.25 : 0.72}
      >
        {word.label}
      </Text>
    </group>
  );
}

function ChamberNode({ chamber, pos, themeId, onModeSelect }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
    return g;
  }, []);
  const t = THEME[themeId] || THEME.night;

  return (
    <group
      position={pos}
      onClick={(e) => {
        e.stopPropagation();
        onModeSelect?.(chamber);
      }}
    >
      <points geometry={geom} frustumCulled={false}>
        <pointsMaterial
          map={getPointMap()}
          size={3.6}
          sizeAttenuation={false}
          color={t.accent}
          transparent
          opacity={0.85}
          depthWrite={false}
          alphaTest={0.4}
          toneMapped={false}
        />
      </points>
      <mesh visible={false}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
      <Text
        position={[0, 0.18, 0]}
        fontSize={0.055}
        color={t.ink}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.0025}
        outlineColor={t.bg}
        maxWidth={1.4}
      >
        {chamber.label}
      </Text>
      <Text
        position={[0, 0.06, 0]}
        fontSize={0.032}
        color={t.steel}
        anchorX="center"
        anchorY="bottom"
        maxWidth={1.2}
      >
        {chamber.hint}
      </Text>
    </group>
  );
}

/**
 * AI Lab semantic field — linked vocabulary + chamber destinations.
 */
export default function SemanticField({
  themeId,
  active,
  focusWord,
  onWordHover,
  onWordSelect,
  onModeSelect,
}) {
  const root = useRef();
  const linesRef = useRef();
  const fade = useRef(0);
  const focusT = useRef(0);
  const wordPos = useRef({});
  const [hoverWord, setHoverWord] = useState(null);
  const t = THEME[themeId] || THEME.night;
  const net = connectedWords(hoverWord, focusWord);

  const homes = useMemo(
    () => SEMANTIC_WORDS.map((_, i) => wordHomePos(i, SEMANTIC_WORDS.length)),
    []
  );
  const focusTargets = useMemo(
    () => (focusWord ? focusClusterPos(focusWord) : null),
    [focusWord]
  );

  const links = useMemo(() => {
    const out = [];
    const seen = new Set();
    SEMANTIC_WORDS.forEach((w) => {
      w.links.forEach((lid) => {
        const key = w.id < lid ? `${w.id}-${lid}` : `${lid}-${w.id}`;
        if (seen.has(key)) return;
        seen.add(key);
        out.push([w.id, lid]);
      });
    });
    return out;
  }, []);

  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(links.length * 6), 3)
    );
    return g;
  }, [links.length]);

  useEffect(() => {
    if (!active) {
      fade.current = 0;
      focusT.current = 0;
    }
  }, [active]);

  useFrame((_, dt) => {
    if (!root.current) return;
    const d = Math.min(dt, 0.05);
    fade.current = THREE.MathUtils.damp(fade.current, active ? 1 : 0, active ? 2.8 : 5, d);
    focusT.current = THREE.MathUtils.damp(
      focusT.current,
      focusWord ? 1 : 0,
      focusWord ? 3.2 : 2.5,
      d
    );
    root.current.visible = fade.current > 0.02;

    SEMANTIC_WORDS.forEach((w, i) => {
      const home = homes[i];
      const target = focusTargets ? focusTargets[i] : home;
      const u = focusT.current;
      wordPos.current[w.id] = [
        THREE.MathUtils.lerp(home[0], target[0], u),
        THREE.MathUtils.lerp(home[1], target[1], u),
        THREE.MathUtils.lerp(home[2], target[2], u),
      ];
    });

    if (linesRef.current) {
      const arr = lineGeom.attributes.position.array;
      links.forEach(([a, b], li) => {
        const pa = wordPos.current[a] || [0, 0, 0];
        const pb = wordPos.current[b] || [0, 0, 0];
        const lit = !net || (net.has(a) && net.has(b));
        const o = li * 6;
        arr[o] = pa[0];
        arr[o + 1] = pa[1];
        arr[o + 2] = pa[2];
        arr[o + 3] = lit ? pb[0] : pa[0];
        arr[o + 4] = lit ? pb[1] : pa[1];
        arr[o + 5] = lit ? pb[2] : pa[2];
      });
      lineGeom.attributes.position.needsUpdate = true;
      linesRef.current.material.opacity = fade.current * (net ? 0.38 : 0.12);
      linesRef.current.material.color.set(semanticColor("ai", themeId));
    }
  });

  return (
    <group ref={root} visible={false}>
      <lineSegments ref={linesRef} geometry={lineGeom}>
        <lineBasicMaterial color={t.steel} transparent opacity={0.1} depthWrite={false} />
      </lineSegments>

      {SEMANTIC_WORDS.map((word, i) => (
        <SemanticWord
          key={word.id}
          word={word}
          themeId={themeId}
          home={homes[i]}
          focusTargets={focusTargets}
          focusTRef={focusT}
          fadeRef={fade}
          hot={hoverWord === word.id || focusWord === word.id}
          dimmed={!!net && !net.has(word.id)}
          onWordHover={(id) => {
            setHoverWord(id);
            onWordHover?.(id);
          }}
          onWordSelect={onWordSelect}
        />
      ))}

      {EXPERIENCE_CHAMBERS.map((chamber, i) => (
        <ChamberNode
          key={chamber.id}
          chamber={chamber}
          pos={chamberPos(i, EXPERIENCE_CHAMBERS.length)}
          themeId={themeId}
          onModeSelect={onModeSelect}
        />
      ))}
    </group>
  );
}
