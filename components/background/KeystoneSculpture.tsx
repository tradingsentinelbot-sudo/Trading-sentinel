"use client";

import { useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SCULPTURE_WORLD_POSITION, type QualityTier } from "@/constants/scene";
import { useControlledStillness } from "@/hooks/useControlledStillness";

function Metal({ kind }: { kind: "silver" | "brushed" | "pvd" }) {
  if (kind === "silver") return <meshPhysicalMaterial color="#B7BEC6" metalness={0.98} roughness={0.24} envMapIntensity={1.45} />;
  if (kind === "brushed") return <meshPhysicalMaterial color="#737D87" metalness={0.96} roughness={0.38} envMapIntensity={1.15} />;
  return <meshPhysicalMaterial color="#0B0E12" metalness={0.88} roughness={0.26} clearcoat={0.5} clearcoatRoughness={0.18} envMapIntensity={0.72} />;
}

function StructuralMasses({ tier }: { tier: QualityTier }) {
  const compact = tier === "mobile" ? 0.84 : tier === "tablet" ? 0.93 : 1;
  return (
    <group scale={compact}>
      <RoundedBox args={[0.82, 2.9, 0.72]} position={[0, 1.42, -0.18]} radius={0.035} smoothness={3}><Metal kind="pvd" /></RoundedBox>
      <RoundedBox args={[0.22, 3.25, 0.88]} position={[-0.36, 1.62, 0.05]} rotation={[0, 0, -0.055]} radius={0.018} smoothness={3}><Metal kind="silver" /></RoundedBox>
      <RoundedBox args={[0.18, 3.48, 0.9]} position={[-0.08, 1.76, 0.12]} rotation={[0, 0, -0.015]} radius={0.016} smoothness={3}><Metal kind="brushed" /></RoundedBox>
      <RoundedBox args={[0.22, 3.08, 0.84]} position={[0.25, 1.56, 0.18]} rotation={[0, 0, 0.045]} radius={0.018} smoothness={3}><Metal kind="silver" /></RoundedBox>
      <RoundedBox args={[0.58, 2.22, 0.16]} position={[0.02, 1.15, 0.54]} radius={0.025} smoothness={3}><Metal kind="pvd" /></RoundedBox>
      <RoundedBox args={[1.42, 0.34, 1.08]} position={[0.02, -0.12, 0.02]} radius={0.025} smoothness={3}><Metal kind="pvd" /></RoundedBox>
      <RoundedBox args={[1.02, 0.22, 0.94]} position={[0.02, 0.17, 0.05]} radius={0.018} smoothness={3}><Metal kind="brushed" /></RoundedBox>
    </group>
  );
}

function DiagonalBraces() {
  return (
    <group>
      <RoundedBox args={[0.13, 2.1, 0.13]} position={[-0.62, 1.32, 0.34]} rotation={[0, 0, -0.38]} radius={0.012} smoothness={2}><Metal kind="silver" /></RoundedBox>
      <RoundedBox args={[0.11, 1.85, 0.11]} position={[0.56, 1.22, 0.36]} rotation={[0, 0, 0.42]} radius={0.01} smoothness={2}><Metal kind="brushed" /></RoundedBox>
      <RoundedBox args={[0.08, 1.65, 0.08]} position={[-0.42, 1.5, 0.48]} rotation={[0, 0, 0.16]} radius={0.008} smoothness={2}><Metal kind="silver" /></RoundedBox>
    </group>
  );
}

function InnerChamber() {
  return (
    <group position={[0.02, 1.2, 0.66]}>
      <mesh><boxGeometry args={[0.42, 1.72, 0.04]} /><meshPhysicalMaterial color="#151B21" metalness={0.18} roughness={0.12} transmission={0.42} transparent opacity={0.58} thickness={0.18} ior={1.45} /></mesh>
      <mesh position={[0, 0, 0.035]}><boxGeometry args={[0.045, 1.28, 0.025]} /><meshStandardMaterial color="#D6A84A" emissive="#D6A84A" emissiveIntensity={1.7} toneMapped={false} /></mesh>
    </group>
  );
}

function AmberCore() {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  const { activeEvent } = useControlledStillness(1);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const breath = 0.12 * (0.5 + 0.5 * Math.sin((clock.elapsedTime / 24) * Math.PI * 2));
    ref.current.emissiveIntensity = 1.45 + breath + (activeEvent?.type === "facet-glow" ? 0.28 : 0);
  });
  return <mesh position={[0.02, 1.2, 0.72]}><boxGeometry args={[0.055, 1.35, 0.035]} /><meshStandardMaterial ref={ref} color="#D6A84A" emissive="#D6A84A" emissiveIntensity={1.45} toneMapped={false} /></mesh>;
}

function Ground({ tier }: { tier: QualityTier }) {
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.34, 0]}><circleGeometry args={[4.2, tier === "mobile" ? 32 : 48]} /><meshStandardMaterial color="#080A0D" roughness={0.94} metalness={0.2} /></mesh>;
}

export function KeystoneSculpture({ tier }: { tier: QualityTier }) {
  return <group position={SCULPTURE_WORLD_POSITION} rotation={[0, -0.16, 0]}><StructuralMasses tier={tier} /><DiagonalBraces /><InnerChamber /><AmberCore /><Ground tier={tier} /></group>;
}
