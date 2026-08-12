"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Billboard, Line } from "@react-three/drei";
import * as THREE from "three";
import { STORY_JOURNEY } from "@/lib/data/story";
import { STORY_BRANCHES } from "@/lib/data/story-branches";
import { PLATFORM_ARCHITECTURE_FLOW } from "@/lib/data/home-content";
import { segmentProgress } from "./useScrollProgress";

const MIDNIGHT = "#0b0f18";
const CHARCOAL = "#141a26";
const CYAN = "#5eb8c4";
const AMBER = "#c9a962";
const IVORY = "#e8e4dc";

function ease(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function roadCurve() {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(-6, 0, 0),
    new THREE.Vector3(-3.5, 0, -1.2),
    new THREE.Vector3(-1, 0, -0.4),
    new THREE.Vector3(1.5, 0, 0.6),
    new THREE.Vector3(4, 0, 0.2),
    new THREE.Vector3(6.5, 0, -0.8),
    new THREE.Vector3(9, 0, 0.4),
  ]);
}

function DarkRoom({ opacity, laptopGlow }) {
  return (
    <group visible={opacity > 0.01}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={MIDNIGHT} roughness={1} metalness={0} transparent opacity={opacity * 0.9} />
      </mesh>
      <mesh position={[0, 2.5, -4]} receiveShadow>
        <planeGeometry args={[14, 5]} />
        <meshStandardMaterial color={CHARCOAL} roughness={1} transparent opacity={opacity * 0.85} />
      </mesh>
      {/* Desk */}
      <mesh position={[0.3, 0.42, 0.2]}>
        <boxGeometry args={[2.4, 0.06, 1.1]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.95} transparent opacity={opacity} />
      </mesh>
      {/* Laptop */}
      <mesh position={[0.15, 0.52, 0.05]} rotation={[-0.35, 0.15, 0]}>
        <boxGeometry args={[0.55, 0.02, 0.38]} />
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={laptopGlow * 0.8}
          transparent
          opacity={opacity}
        />
      </mesh>
      <pointLight position={[0.2, 0.7, 0.3]} color={CYAN} intensity={laptopGlow * 2.2} distance={4} decay={2} />
    </group>
  );
}

function CodeLine({ progress, opacity }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      pts.push(new THREE.Vector3(-0.5 + t * 2.5, 0.55 + Math.sin(t * Math.PI) * 0.08, 0.1 + t * 0.4));
    }
    return pts;
  }, []);

  const visibleCount = Math.max(2, Math.floor(progress * points.length));
  const visiblePoints = points.slice(0, visibleCount);

  if (opacity < 0.01 || visiblePoints.length < 2) return null;

  return (
    <Line
      points={visiblePoints}
      color={CYAN}
      lineWidth={1.5}
      transparent
      opacity={opacity * 0.85}
      toneMapped={false}
    />
  );
}

function CareerRoad({ progress, opacity }) {
  const curve = useMemo(() => roadCurve(), []);
  const tubeGeo = useMemo(() => {
    const geo = new THREE.TubeGeometry(curve, 64, 0.03, 8, false);
    geo.setDrawRange(0, 0);
    return geo;
  }, [curve]);

  useFrame(() => {
    const total = tubeGeo.index ? tubeGeo.index.count : tubeGeo.attributes.position.count;
    const draw = Math.floor(total * progress);
    tubeGeo.setDrawRange(0, draw);
  });

  const milestones = STORY_JOURNEY.length;

  return (
    <group visible={opacity > 0.01}>
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color={IVORY}
          emissive={CYAN}
          emissiveIntensity={0.15}
          transparent
          opacity={opacity * 0.7}
          roughness={0.4}
        />
      </mesh>
      {STORY_JOURNEY.map((beat, i) => {
        const t = (i + 1) / (milestones + 1);
        const point = curve.getPoint(t);
        const lit = progress >= t - 0.05;
        return (
          <group key={beat.id} position={[point.x, point.y + 0.08, point.z]}>
            <mesh>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial
                color={lit ? CYAN : IVORY}
                emissive={lit ? CYAN : "#000000"}
                emissiveIntensity={lit ? 0.4 : 0}
                transparent
                opacity={opacity * (lit ? 0.9 : 0.35)}
              />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.01, 0.18, 0.01]} />
              <meshStandardMaterial color={IVORY} transparent opacity={opacity * 0.25} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function BranchPaths({ progress, opacity }) {
  const curve = useMemo(() => roadCurve(), []);

  return (
    <group visible={opacity > 0.01}>
      {STORY_BRANCHES.map((branch) => {
        const origin = curve.getPoint(branch.offset);
        const end = origin.clone().add(new THREE.Vector3(Math.sin(branch.angle) * 2.2, 0.15, Math.cos(branch.angle) * 1.6));
        const mid = origin.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 0.25, 0));
        const branchCurve = new THREE.QuadraticBezierCurve3(origin, mid, end);
        const branchPoints = branchCurve.getPoints(Math.max(2, Math.floor(progress * 16)));

        if (branchPoints.length < 2) return null;

        return (
          <group key={branch.id}>
            <Line
              points={branchPoints}
              color={AMBER}
              lineWidth={1}
              transparent
              opacity={opacity * 0.55}
              toneMapped={false}
            />
            <mesh position={[end.x, end.y, end.z]}>
              <sphereGeometry args={[0.04, 10, 10]} />
              <meshStandardMaterial
                color={AMBER}
                emissive={AMBER}
                emissiveIntensity={progress > 0.85 ? 0.35 : 0.1}
                transparent
                opacity={opacity * 0.7}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function PipelineNodes({ progress, opacity }) {
  const stages = PLATFORM_ARCHITECTURE_FLOW;
  const spacing = 1.6;
  const startX = -((stages.length - 1) * spacing) / 2;

  return (
    <group position={[0, 1.2, -2]} visible={opacity > 0.01}>
      {stages.map((stage, i) => {
        const x = startX + i * spacing;
        const lit = progress >= (i + 1) / stages.length;
        const nextLit = i < stages.length - 1 && progress >= (i + 2) / stages.length;

        return (
          <group key={stage.stage} position={[x, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial
                color={lit ? CYAN : IVORY}
                emissive={lit ? CYAN : "#000000"}
                emissiveIntensity={lit ? 0.35 : 0}
                transparent
                opacity={opacity * (lit ? 0.85 : 0.3)}
              />
            </mesh>
            {i < stages.length - 1 && nextLit ? (
              <Line
                points={[
                  [0, 0, 0],
                  [spacing, 0, 0],
                ]}
                color={CYAN}
                lineWidth={1}
                transparent
                opacity={opacity * 0.45}
              />
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

function CharacterBillboard({ progress, stageIndex }) {
  const texture = useTexture("/character/mansi.png");
  const groupRef = useRef();
  const curve = useMemo(() => roadCurve(), []);

  const stageStyles = [
    { brightness: 0.45, opacity: 0.6 },
    { brightness: 0.65, opacity: 0.72 },
    { brightness: 0.85, opacity: 0.88 },
    { brightness: 0.95, opacity: 0.95 },
    { brightness: 1, opacity: 1 },
  ];
  const style = stageStyles[Math.min(stageIndex, stageStyles.length - 1)];

  useFrame((state) => {
    if (!groupRef.current) return;

    const roomPhase = 1 - Math.min(1, progress / 0.18);
    const roadPhase = segmentProgress(progress, 0.18, 0.58);
    const roadT = ease(roadPhase);

    let pos;
    if (roomPhase > 0.05) {
      pos = new THREE.Vector3(-0.8, 0.55, 0.6);
    } else {
      pos = curve.getPoint(Math.max(0.05, roadT * 0.92));
      pos.y += 0.55;
    }

    groupRef.current.position.lerp(pos, 0.08);
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.03;
  });

  return (
    <Billboard ref={groupRef} follow lockX lockY lockZ>
      <mesh>
        <planeGeometry args={[0.85, 1.15]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={style.opacity}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </Billboard>
  );
}

function CinematicCamera({ progress }) {
  useFrame(({ camera }) => {
    const roomPhase = 1 - Math.min(1, progress / 0.2);
    const roadPhase = segmentProgress(progress, 0.15, 0.58);
    const branchPhase = segmentProgress(progress, 0.52, 0.72);
    const pipePhase = segmentProgress(progress, 0.68, 0.85);

    const curve = roadCurve();
    const roadPoint = curve.getPoint(ease(roadPhase) * 0.85);

    let targetPos;
    let lookAt;

    if (roomPhase > 0.1) {
      targetPos = new THREE.Vector3(1.8 * roomPhase, 1.3, 3.2 * roomPhase + 0.5);
      lookAt = new THREE.Vector3(0, 0.5, 0);
    } else if (pipePhase > 0.05) {
      targetPos = new THREE.Vector3(0, 2.2, 4.5 - pipePhase * 1.2);
      lookAt = new THREE.Vector3(0, 1, -1.5);
    } else if (branchPhase > 0.05) {
      targetPos = new THREE.Vector3(roadPoint.x - 2.5, 2.4, roadPoint.z + 3.5);
      lookAt = roadPoint.clone().setY(0.4);
    } else {
      targetPos = new THREE.Vector3(roadPoint.x - 1.8, 1.8, roadPoint.z + 2.8);
      lookAt = roadPoint.clone().setY(0.35);
    }

    camera.position.lerp(targetPos, 0.06);
    camera.lookAt(lookAt);
  });

  return null;
}

function fogForProgress(progress) {
  if (progress < 0.2) return MIDNIGHT;
  if (progress < 0.55) return "#0c1019";
  if (progress < 0.75) return "#0d121c";
  return "#0e131d";
}

export default function CinematicWorld({ progress = 0 }) {
  const stageIndex = Math.min(
    STORY_JOURNEY.length - 1,
    Math.floor(segmentProgress(progress, 0.22, 0.58) * STORY_JOURNEY.length)
  );

  const roomOpacity = 1 - segmentProgress(progress, 0.12, 0.28);
  const laptopGlow = 0.4 + segmentProgress(progress, 0, 0.15) * 0.6;
  const codeProgress = segmentProgress(progress, 0.1, 0.22);
  const codeOpacity = segmentProgress(progress, 0.08, 0.12) * (1 - segmentProgress(progress, 0.22, 0.28));
  const roadProgress = segmentProgress(progress, 0.2, 0.58);
  const roadOpacity = segmentProgress(progress, 0.18, 0.24) * (1 - segmentProgress(progress, 0.58, 0.66) * 0.35);
  const branchProgress = segmentProgress(progress, 0.52, 0.72);
  const branchOpacity = segmentProgress(progress, 0.5, 0.56) * (1 - segmentProgress(progress, 0.72, 0.78));
  const pipeProgress = segmentProgress(progress, 0.66, 0.84);
  const pipeOpacity = segmentProgress(progress, 0.64, 0.7) * (1 - segmentProgress(progress, 0.84, 0.9));

  return (
    <>
      <color attach="background" args={[fogForProgress(progress)]} />
      <fog attach="fog" args={[fogForProgress(progress), 4, 16]} />
      <ambientLight intensity={0.08} />
      <directionalLight position={[4, 6, 2]} intensity={0.15} color={IVORY} />
      <CinematicCamera progress={progress} />
      <DarkRoom opacity={roomOpacity} laptopGlow={laptopGlow} />
      <CodeLine progress={codeProgress} opacity={codeOpacity} />
      <CareerRoad progress={roadProgress} opacity={roadOpacity} />
      <BranchPaths progress={branchProgress} opacity={branchOpacity} />
      <PipelineNodes progress={pipeProgress} opacity={pipeOpacity} />
      <CharacterBillboard progress={progress} stageIndex={stageIndex} />
    </>
  );
}
