"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { THEME_PALETTE } from "@/lib/data/precision";

const LAB_NODES = [
  { id: "agentic-reasoning", title: "AGENTIC REASONING", desc: "LLM feedback loops & schema validation", pos: [-1.8, 1.6, -6.5] },
  { id: "stream-processing", title: "REAL-TIME STREAMS", desc: "Kafka / Spark low-latency pipeline evaluation", pos: [1.8, 1.6, -6.5] },
  { id: "schema-inference", title: "SCHEMA INFERENCE", desc: "Automated structure synthesis from unstructured data", pos: [0, 2.2, -8.0] },
  { id: "vector-search", title: "VECTOR RETRIEVAL", desc: "Semantic indexing & hybrid RAG pipelines", pos: [0, 0.9, -7.2] },
];

/**
 * Spatial AI LAB — Mansi's Interactive Reasoning Environment.
 * Inputs form node connections, hypotheses branch, and conclusions emerge.
 */
export default function AiLabWorld({ theme, activeView, cursorRef }) {
  const p = THEME_PALETTE[theme] || THEME_PALETTE.night;
  const isDay = theme === "day";
  const labelColor = isDay ? "#0c121a" : "#eef4fb";
  const [activeNode, setActiveNode] = useState(null);
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.15;
    }
  });

  const isVisible = activeView === "ai-lab";

  return (
    <group position={[0, 0, 0]}>
      {/* Central Reasoning Nucleus */}
      <group position={[0, 1.5, -7.2]}>
        <mesh ref={ringRef}>
          <ringGeometry args={[1.2, 1.25, 32]} />
          <meshBasicMaterial
            color={p.amber}
            transparent
            opacity={isVisible ? (isDay ? 0.35 : 0.65) : 0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Text
          position={[0, 0.05, 0]}
          fontSize={0.078}
          color={p.amber}
          anchorX="center"
          letterSpacing={0.2}
        >
          SYSTEM REASONING FIELD
        </Text>
      </group>

      {/* Interactive Reasoning Nodes */}
      {LAB_NODES.map((node) => {
        const isHovered = activeNode === node.id;
        return (
          <group
            key={node.id}
            position={node.pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              setActiveNode(node.id);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setActiveNode(null);
            }}
          >
            {/* Pedestal Node */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.32, 0.32, 0.32]} />
              <meshStandardMaterial
                color={isHovered ? p.amber : p.metalDark}
                metalness={0.8}
                roughness={0.2}
                emissive={p.amber}
                emissiveIntensity={isHovered ? 0.45 : 0.08}
              />
            </mesh>

            {/* Connecting line to nucleus */}
            <line>
              <bufferGeometry
                attach="geometry"
                onUpdate={(geom) => {
                  geom.setFromPoints([
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(-node.pos[0], 1.5 - node.pos[1], -7.2 - node.pos[2]),
                  ]);
                }}
              />
              <lineBasicMaterial
                attach="material"
                color={isHovered ? p.amber : isDay ? "#8a9ab0" : "#3e526a"}
                transparent
                opacity={isHovered ? 0.8 : 0.25}
                linewidth={1}
              />
            </line>

            {/* Typography */}
            <Text
              position={[0, 0.35, 0]}
              fontSize={0.068}
              color={isHovered ? p.amber : labelColor}
              anchorX="center"
              letterSpacing={0.14}
            >
              {node.title}
            </Text>

            {isHovered && (
              <Text
                position={[0, -0.32, 0]}
                fontSize={0.052}
                color={isDay ? "#2c3e50" : "#a2b4c8"}
                anchorX="center"
                maxWidth={1.8}
                textAlign="center"
              >
                {node.desc}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}
