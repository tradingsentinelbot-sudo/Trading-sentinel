"use client";

import { useMemo, useRef } from "react";
import { RoundedBox, MeshReflectorMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCULPTURE_WORLD_POSITION, type QualityTier } from "@/constants/scene";
import { useControlledStillness } from "@/hooks/useControlledStillness";

/**
 * Reference-led architectural monolith.
 *
 * The hero object is intentionally built from many independent architectural
 * elements rather than one generic primitive: staggered silver fins, dark
 * structural plates, a recessed amber core, lower suspended blocks and a
 * sparse field of orbiting rock fragments.
 */

type Panel = {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  material: "silver" | "brushed" | "dark";
  bevel?: number;
};

const PANELS: Panel[] = [
  // Rear vertical architecture
  { position: [-0.58, 1.75, -0.22], scale: [0.28, 2.9, 0.42], rotation: [0, 0, -0.06], material: "dark" },
  { position: [-0.35, 1.92, -0.18], scale: [0.24, 3.35, 0.52], rotation: [0, 0, -0.025], material: "silver" },
  { position: [-0.12, 2.03, -0.14], scale: [0.18, 3.62, 0.55], rotation: [0, 0, 0.012], material: "brushed" },
  { position: [0.10, 1.98, -0.12], scale: [0.20, 3.48, 0.52], rotation: [0, 0, 0.02], material: "silver" },
  { position: [0.34, 1.86, -0.18], scale: [0.24, 3.18, 0.48], rotation: [0, 0, 0.045], material: "brushed" },
  { position: [0.57, 1.67, -0.22], scale: [0.30, 2.76, 0.40], rotation: [0, 0, 0.07], material: "dark" },

  // Front architectural blades: deliberately offset to create the layered silhouette.
  { position: [-0.46, 1.55, 0.28], scale: [0.20, 2.62, 0.16], rotation: [0, 0, -0.09], material: "silver" },
  { position: [-0.20, 1.40, 0.36], scale: [0.15, 2.28, 0.18], rotation: [0, 0, -0.035], material: "brushed" },
  { position: [0.18, 1.38, 0.38], scale: [0.17, 2.42, 0.18], rotation: [0, 0, 0.04], material: "silver" },
  { position: [0.45, 1.52, 0.30], scale: [0.22, 2.58, 0.16], rotation: [0, 0, 0.085], material: "brushed" },

  // Upper cap / stepped crown
  { position: [-0.23, 3.48, -0.04], scale: [0.38, 0.28, 0.56], rotation: [0, 0, -0.06], material: "silver" },
  { position: [0.14, 3.54, -0.02], scale: [0.32, 0.22, 0.52], rotation: [0, 0, 0.05], material: "brushed" },

  // Lower suspended architectural blocks
  { position: [-0.34, -0.05, 0.02], scale: [0.46, 0.34, 0.62], rotation: [0, 0, -0.04], material: "dark" },
  { position: [0.10, -0.14, 0.04], scale: [0.38, 0.48, 0.54], rotation: [0, 0, 0.035], material: "silver" },
  { position: [0.43, 0.02, 0.00], scale: [0.34, 0.28, 0.48], rotation: [0, 0, 0.08], material: "brushed" },
];

function Material({ kind }: { kind: Panel["material"] }) {
  if (kind === "silver") {
    return (
      <meshPhysicalMaterial
        color="#B7BEC2"
        metalness={0.98}
        roughness={0.24}
        envMapIntensity={1.65}
      />
    );
  }
  if (kind === "brushed") {
    return (
      <meshPhysicalMaterial
        color="#858B8E"
        metalness={0.97}
        roughness={0.38}
        envMapIntensity={1.35}
      />
    );
  }
  return (
    <meshPhysicalMaterial
      color="#111417"
      metalness={0.86}
      roughness={0.30}
      clearcoat={0.42}
      clearcoatRoughness={0.18}
      envMapIntensity={0.92}
    />
  );
}

function ArchitecturalBody() {
  return (
    <group>
      {PANELS.map((panel, index) => (
        <RoundedBox
          key={index}
          args={panel.scale}
          radius={panel.bevel ?? 0.018}
          smoothness={4}
          position={panel.position}
          rotation={panel.rotation}
        >
          <Material kind={panel.material} />
        </RoundedBox>
      ))}
    </group>
  );
}

function RecessedAmberCore() {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  const { activeEvent } = useControlledStillness(1);

  useFrame((state) => {
    if (!ref.current) return;
    const breath = (Math.sin((state.clock.elapsedTime / 18) * Math.PI * 2) + 1) / 2;
    const eventBoost = activeEvent?.type === "facet-glow" ? 0.25 : 0;
    ref.current.emissiveIntensity = 1.25 + breath * 0.18 + eventBoost;
  });

  return (
    <group position={[0.01, 1.55, 0.43]}>
      <mesh>
        <boxGeometry args={[0.075, 2.15, 0.045]} />
        <meshStandardMaterial ref={ref} color="#D6A84A" emissive="#D6A84A" emissiveIntensity={1.25} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[0.18, 1.38, 0.025]} />
        <meshStandardMaterial color="#6F4B19" emissive="#D6A84A" emissiveIntensity={0.22} transparent opacity={0.32} toneMapped={false} />
      </mesh>
    </group>
  );
}

function ArchitecturalSeams() {
  const seams = useMemo(
    () => [
      { position: [-0.35, 2.60, 0.38] as [number, number, number], height: 1.05, width: 0.008 },
      { position: [0.36, 2.35, 0.38] as [number, number, number], height: 1.38, width: 0.007 },
      { position: [-0.06, 3.12, 0.40] as [number, number, number], height: 0.42, width: 0.006 },
    ],
    []
  );

  return (
    <group>
      {seams.map((seam, index) => (
        <mesh key={index} position={seam.position}>
          <boxGeometry args={[seam.width, seam.height, 0.009]} />
          <meshStandardMaterial color="#D6A84A" emissive="#D6A84A" emissiveIntensity={0.34} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function RockField({ tier }: { tier: QualityTier }) {
  const rocks = useMemo(() => {
    const count = tier === "desktop" ? 18 : tier === "tablet" ? 12 : 7;
    const result: { position: [number, number, number]; scale: [number, number, number]; rotation: [number, number, number] }[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i * 2.399963) % (Math.PI * 2);
      const radius = 1.55 + ((i * 0.618033) % 1) * 1.75;
      const y = -0.3 + ((i * 0.371) % 1) * 3.5;
      const s = 0.045 + ((i * 0.173) % 1) * 0.12;
      result.push({
        position: [Math.cos(a) * radius, y, Math.sin(a) * radius - 0.15],
        scale: [s * 1.5, s * 0.8, s],
        rotation: [i * 0.71, i * 1.13, i * 0.43],
      });
    }
    return result;
  }, [tier]);

  return (
    <group>
      {rocks.map((rock, index) => (
        <mesh key={index} position={rock.position} scale={rock.scale} rotation={rock.rotation}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#303437" roughness={0.96} metalness={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function Ground({ tier }: { tier: QualityTier }) {
  if (tier === "mobile") {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, 0]}>
        <circleGeometry args={[5.2, 32]} />
        <meshStandardMaterial color="#0A0B0D" roughness={1} />
      </mesh>
    );
  }

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, 0]}>
      <circleGeometry args={[5.2, 72]} />
      <MeshReflectorMaterial
        blur={[420, 110]}
        resolution={512}
        mixBlur={1}
        mixStrength={10}
        roughness={0.92}
        depthScale={0.22}
        minDepthThreshold={0.82}
        color="#0A0B0D"
        metalness={0.30}
      />
    </mesh>
  );
}

export function KeystoneSculpture({ tier }: { tier: QualityTier }) {
  const scale = tier === "mobile" ? 0.72 : tier === "tablet" ? 0.86 : 1;

  return (
    <group position={SCULPTURE_WORLD_POSITION} scale={scale}>
      <group position={[0, -0.08, 0]}>
        <ArchitecturalBody />
        <RecessedAmberCore />
        <ArchitecturalSeams />
        <RockField tier={tier} />
        <Ground tier={tier} />
      </group>
    </group>
  );
}
