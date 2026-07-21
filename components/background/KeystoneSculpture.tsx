"use client";

import { useMemo, useRef } from "react";
import { RoundedBox, MeshReflectorMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCULPTURE_WORLD_POSITION, type QualityTier } from "@/constants/scene";
import { useControlledStillness } from "@/hooks/useControlledStillness";

/**
 * Trading Sentinel architectural monolith.
 *
 * Art direction:
 * - vertical architectural mass, not a floating 2D ornament;
 * - metallic silver + brushed metal + dark glass;
 * - steel-blue atmospheric reflections;
 * - restrained amber internal light;
 * - no blue crystal, no organic network, no particles as decoration.
 *
 * The sculpture is deliberately assembled from coherent architectural plates:
 * a central dark core, staggered silver fins and a controlled internal void.
 */

type Plate = {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  material: "silver" | "brushed" | "dark";
  bevel: number;
};

const PLATES: Plate[] = [
  // Rear structural mass
  { position: [-0.42, 1.35, -0.12], scale: [0.28, 2.5, 0.48], rotation: [0, 0, -0.035], material: "dark", bevel: 0.025 },
  { position: [0.38, 1.48, -0.08], scale: [0.32, 2.75, 0.46], rotation: [0, 0, 0.04], material: "dark", bevel: 0.025 },

  // Silver architectural fins
  { position: [-0.2, 1.62, 0.05], scale: [0.22, 3.15, 0.52], rotation: [0, 0, -0.02], material: "silver", bevel: 0.018 },
  { position: [0.06, 1.72, 0.08], scale: [0.18, 3.35, 0.56], rotation: [0, 0, 0.012], material: "silver", bevel: 0.016 },
  { position: [0.3, 1.52, 0.12], scale: [0.2, 2.95, 0.5], rotation: [0, 0, 0.028], material: "brushed", bevel: 0.016 },

  // Dark front blade framing the controlled void
  { position: [0.02, 1.18, 0.34], scale: [0.34, 2.25, 0.16], rotation: [0, 0, 0], material: "dark", bevel: 0.022 },
];

function PlateMaterial({ kind }: { kind: Plate["material"] }) {
  if (kind === "silver") {
    return (
      <meshPhysicalMaterial
        color="#B7BEC6"
        metalness={0.96}
        roughness={0.28}
        envMapIntensity={1.15}
      />
    );
  }
  if (kind === "brushed") {
    return (
      <meshPhysicalMaterial
        color="#7F8994"
        metalness={0.94}
        roughness={0.42}
        envMapIntensity={0.95}
      />
    );
  }
  return (
    <meshPhysicalMaterial
      color="#111820"
      metalness={0.82}
      roughness={0.3}
      clearcoat={0.32}
      clearcoatRoughness={0.2}
      envMapIntensity={0.62}
    />
  );
}

function ArchitecturalPlates() {
  return (
    <group>
      {PLATES.map((plate, index) => (
        <RoundedBox
          key={index}
          args={plate.scale}
          radius={plate.bevel}
          smoothness={4}
          position={plate.position}
          rotation={plate.rotation}
        >
          <PlateMaterial kind={plate.material} />
        </RoundedBox>
      ))}
    </group>
  );
}

function ControlledVoid() {
  return (
    <mesh position={[0.02, 1.25, 0.43]}>
      <boxGeometry args={[0.14, 1.75, 0.035]} />
      <meshPhysicalMaterial
        color="#18212A"
        metalness={0.05}
        roughness={0.12}
        transmission={0.25}
        transparent
        opacity={0.72}
        emissive="#090B0D"
      />
    </mesh>
  );
}

function InnerAmberCore() {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  const { activeEvent } = useControlledStillness(1);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const breath = (Math.sin((t / 24) * Math.PI * 2) + 1) / 2;
    const eventBoost = activeEvent?.type === "facet-glow" ? 0.35 : 0;
    ref.current.emissiveIntensity = 1.25 + breath * 0.18 + eventBoost;
  });

  return (
    <mesh position={[0.02, 1.22, 0.47]}>
      <boxGeometry args={[0.045, 1.35, 0.035]} />
      <meshStandardMaterial
        ref={ref}
        color="#D6A84A"
        emissive="#D6A84A"
        emissiveIntensity={1.25}
        toneMapped={false}
      />
    </mesh>
  );
}

function ArchitecturalAccentLines() {
  const lines = useMemo(
    () => [
      { position: [-0.33, 2.18, 0.34] as [number, number, number], width: 0.012, height: 1.1 },
      { position: [0.35, 1.98, 0.36] as [number, number, number], width: 0.009, height: 1.35 },
      { position: [-0.08, 2.7, 0.38] as [number, number, number], width: 0.008, height: 0.55 },
    ],
    []
  );

  return (
    <group>
      {lines.map((line, index) => (
        <mesh key={index} position={line.position}>
          <boxGeometry args={[line.width, line.height, 0.008]} />
          <meshStandardMaterial
            color="#D6A84A"
            emissive="#D6A84A"
            emissiveIntensity={0.48}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Ground({ tier }: { tier: QualityTier }) {
  if (tier === "mobile") {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
        <circleGeometry args={[4.5, 32]} />
        <meshStandardMaterial color="#080A0D" roughness={1} />
      </mesh>
    );
  }

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
      <circleGeometry args={[4.5, 64]} />
      <MeshReflectorMaterial
        blur={[350, 90]}
        resolution={512}
        mixBlur={1}
        mixStrength={14}
        roughness={0.86}
        depthScale={0.28}
        minDepthThreshold={0.82}
        color="#080A0D"
        metalness={0.38}
      />
    </mesh>
  );
}

export function KeystoneSculpture({ tier }: { tier: QualityTier }) {
  return (
    <group position={SCULPTURE_WORLD_POSITION} scale={tier === "mobile" ? 0.78 : tier === "tablet" ? 0.9 : 1}>
      <group position={[0, -0.12, 0]}>
        <ArchitecturalPlates />
        <ControlledVoid />
        <InnerAmberCore />
        <ArchitecturalAccentLines />
        <Ground tier={tier} />
      </group>
    </group>
  );
}
