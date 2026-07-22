"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SCULPTURE_WORLD_POSITION, type QualityTier } from "@/constants/scene";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const NEAR_BLACK = "#080A0D";
const CHARCOAL = "#14181E";
const SOFT_WHITE = "#EAEAEA";
const SILVER = "#B7B8C2";
const STEEL_BLUE = "#2A3442";
const SENTINEL_BLUE = "#2D5B8A";
const AMBER = "#DAA017";

function Metal({ color, roughness = 0.34 }: { color: string; roughness?: number }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0.94}
      roughness={roughness}
      clearcoat={0.55}
      clearcoatRoughness={0.18}
      envMapIntensity={1.35}
    />
  );
}

function PulseCore() {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const steel = useMemo(() => new THREE.Color(STEEL_BLUE), []);
  const sentinel = useMemo(() => new THREE.Color(SENTINEL_BLUE), []);

  useFrame(({ clock }) => {
    if (!material.current) return;
    const t = (Math.sin(clock.elapsedTime * 0.42) + 1) / 2;
    material.current.color.lerpColors(steel, sentinel, t);
    material.current.emissive.lerpColors(steel, sentinel, t);
    material.current.emissiveIntensity = 0.7 + t * 0.65;
  });

  return (
    <group position={[0.02, 1.5, 0.54]}>
      <mesh>
        <boxGeometry args={[0.045, 2.3, 0.025]} />
        <meshStandardMaterial ref={material} color={STEEL_BLUE} emissive={STEEL_BLUE} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      <pointLight color={SENTINEL_BLUE} intensity={0.24} distance={2.8} decay={2} />
    </group>
  );
}

function MonolithBody({ compact }: { compact: number }) {
  return (
    <group scale={compact}>
      {/* Deep central mass: the object must read as a monolith before its details are read. */}
      <RoundedBox args={[1.02, 3.35, 0.86]} position={[0, 1.48, -0.12]} radius={0.035} smoothness={4}>
        <Metal color={CHARCOAL} roughness={0.26} />
      </RoundedBox>

      {/* Tall architectural blades. Silver, not blue. */}
      <RoundedBox args={[0.22, 3.82, 0.98]} position={[-0.43, 1.72, 0.08]} rotation={[0, 0, -0.065]} radius={0.018} smoothness={3}>
        <Metal color={SILVER} roughness={0.29} />
      </RoundedBox>
      <RoundedBox args={[0.15, 3.58, 1.02]} position={[-0.18, 1.62, 0.13]} rotation={[0, 0, -0.02]} radius={0.012} smoothness={3}>
        <Metal color={SOFT_WHITE} roughness={0.36} />
      </RoundedBox>
      <RoundedBox args={[0.22, 3.48, 0.96]} position={[0.30, 1.57, 0.17]} rotation={[0, 0, 0.055]} radius={0.018} smoothness={3}>
        <Metal color={SILVER} roughness={0.25} />
      </RoundedBox>
      <RoundedBox args={[0.12, 3.2, 0.92]} position={[0.54, 1.44, 0.06]} rotation={[0, 0, 0.09]} radius={0.012} smoothness={3}>
        <Metal color="#707783" roughness={0.33} />
      </RoundedBox>

      {/* Dark glass cavity. It is an inset, not the whole object. */}
      <RoundedBox args={[0.58, 2.42, 0.12]} position={[0.02, 1.20, 0.53]} radius={0.025} smoothness={4}>
        <meshPhysicalMaterial color="#11161B" metalness={0.18} roughness={0.1} transmission={0.34} thickness={0.12} clearcoat={0.8} envMapIntensity={1.8} />
      </RoundedBox>

      {/* Internal amber architecture. */}
      <RoundedBox args={[0.09, 2.62, 0.08]} position={[-0.12, 1.36, 0.62]} rotation={[0, 0, -0.025]} radius={0.01} smoothness={3}>
        <Metal color={AMBER} roughness={0.24} />
      </RoundedBox>
      <RoundedBox args={[0.06, 1.92, 0.07]} position={[0.22, 1.1, 0.65]} rotation={[0, 0, 0.08]} radius={0.008} smoothness={3}>
        <Metal color="#B77A1A" roughness={0.28} />
      </RoundedBox>

      {/* Layered lower mass, giving the suspended structure weight. */}
      <RoundedBox args={[1.52, 0.34, 1.14]} position={[0.02, -0.20, 0.02]} radius={0.035} smoothness={4}>
        <Metal color={NEAR_BLACK} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[1.14, 0.24, 0.94]} position={[0.02, 0.10, 0.04]} radius={0.018} smoothness={3}>
        <Metal color={SILVER} roughness={0.38} />
      </RoundedBox>
      <RoundedBox args={[0.74, 0.18, 0.72]} position={[0.02, 0.30, 0.05]} radius={0.014} smoothness={3}>
        <Metal color={CHARCOAL} roughness={0.28} />
      </RoundedBox>
    </group>
  );
}

function StructuralBraces() {
  return (
    <group>
      <RoundedBox args={[0.075, 2.55, 0.075]} position={[-0.66, 1.36, 0.38]} rotation={[0, 0, -0.42]} radius={0.01} smoothness={3}>
        <Metal color={SILVER} roughness={0.34} />
      </RoundedBox>
      <RoundedBox args={[0.065, 2.15, 0.065]} position={[0.62, 1.20, 0.38]} rotation={[0, 0, 0.45]} radius={0.009} smoothness={3}>
        <Metal color="#777C86" roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.05, 1.75, 0.05]} position={[-0.40, 1.62, 0.58]} rotation={[0, 0, 0.18]} radius={0.007} smoothness={3}>
        <Metal color={SOFT_WHITE} roughness={0.3} />
      </RoundedBox>
    </group>
  );
}

function OrbitingRocks({ tier }: { tier: QualityTier }) {
  const group = useRef<THREE.Group>(null);
  const progress = useScrollProgress();
  const rocks = useMemo(() => {
    const count = tier === "desktop" ? 18 : tier === "tablet" ? 12 : 7;
    return Array.from({ length: count }, (_, i) => {
      const a = i * 2.399963 + 0.4;
      const radius = 2.7 + (i % 4) * 0.7;
      return {
        position: [Math.cos(a) * radius, -0.4 + Math.sin(a * 1.7) * 1.8, Math.sin(a) * radius * 0.58 - 0.4] as [number, number, number],
        scale: 0.055 + (i % 5) * 0.018,
        rotation: [a * 0.8, a * 1.1, a * 0.45] as [number, number, number],
      };
    });
  }, [tier]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    const p = progress;
    group.current.rotation.y = t * 0.008 + p * 0.09;
    group.current.rotation.x = Math.sin(t * 0.06) * 0.012 + p * 0.025;
    group.current.position.z = -0.12 + p * 0.18;
  });

  return (
    <group ref={group}>
      {rocks.map((rock, i) => (
        <mesh key={i} position={rock.position} rotation={rock.rotation} scale={rock.scale}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#3A414B" : "#242B33"} roughness={0.92} metalness={0.08} />
        </mesh>
      ))}
    </group>
  );
}

export function SentinelMonolith({ tier }: { tier: QualityTier }) {
  const compact = tier === "mobile" ? 0.78 : tier === "tablet" ? 0.9 : 1;
  const group = useRef<THREE.Group>(null);
  const progress = useScrollProgress();

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = -0.18 + progress * 0.10;
    group.current.rotation.x = progress * 0.028;
    group.current.position.x = SCULPTURE_WORLD_POSITION[0] + progress * 0.10;
  });

  return (
    <group ref={group} position={SCULPTURE_WORLD_POSITION}>
      <MonolithBody compact={compact} />
      <StructuralBraces />
      <PulseCore />
      <OrbitingRocks tier={tier} />
    </group>
  );
}
