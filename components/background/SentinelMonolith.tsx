"use client";

import { RoundedBox, MeshTransmissionMaterial, MeshReflectorMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { SCULPTURE_WORLD_POSITION, type QualityTier } from "@/constants/scene";

const STEEL_BLUE = "#6F89A8";
const SENTINEL_BLUE = "#4D7CFF";
const SILVER = "#C7CCD4";

function Metal({ color, roughness = 0.28 }: { color: string; roughness?: number }) {
  return <meshPhysicalMaterial color={color} metalness={0.96} roughness={roughness} clearcoat={0.65} clearcoatRoughness={0.16} envMapIntensity={1.65} />;
}

function PulseCore() {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!material.current) return;
    const t = (Math.sin(clock.elapsedTime * 0.22) + 1) / 2;
    material.current.color.lerpColors(new THREE.Color(STEEL_BLUE), new THREE.Color(SENTINEL_BLUE), t);
    material.current.emissive.lerpColors(new THREE.Color(STEEL_BLUE), new THREE.Color(SENTINEL_BLUE), t);
    material.current.emissiveIntensity = 1.1 + t * 0.9;
  });
  return (
    <mesh position={[0.04, 1.52, 0.58]}>
      <boxGeometry args={[0.045, 2.35, 0.025]} />
      <meshStandardMaterial ref={material} color={STEEL_BLUE} emissive={STEEL_BLUE} emissiveIntensity={1.3} toneMapped={false} />
    </mesh>
  );
}

function MonolithBody({ compact }: { compact: number }) {
  return (
    <group scale={compact}>
      <RoundedBox args={[0.92, 3.15, 0.78]} position={[0, 1.48, -0.12]} radius={0.045} smoothness={5}>
        <Metal color="#11161D" roughness={0.22} />
      </RoundedBox>
      <RoundedBox args={[0.16, 3.48, 0.94]} position={[-0.43, 1.68, 0.08]} rotation={[0, 0, -0.075]} radius={0.018} smoothness={4}>
        <Metal color={SILVER} roughness={0.32} />
      </RoundedBox>
      <RoundedBox args={[0.12, 3.25, 0.98]} position={[-0.20, 1.58, 0.14]} rotation={[0, 0, -0.018]} radius={0.014} smoothness={4}>
        <Metal color={STEEL_BLUE} roughness={0.36} />
      </RoundedBox>
      <RoundedBox args={[0.18, 3.1, 0.9]} position={[0.28, 1.5, 0.2]} rotation={[0, 0, 0.06]} radius={0.018} smoothness={4}>
        <Metal color={SILVER} roughness={0.26} />
      </RoundedBox>
      <RoundedBox args={[0.62, 2.3, 0.12]} position={[0.04, 1.22, 0.55]} radius={0.03} smoothness={4}>
        <MeshTransmissionMaterial transmission={0.82} thickness={0.22} roughness={0.12} ior={1.45} chromaticAberration={0.025} color="#172231" attenuationColor={SENTINEL_BLUE} attenuationDistance={0.65} />
      </RoundedBox>
      <RoundedBox args={[1.48, 0.34, 1.1]} position={[0.02, -0.18, 0.02]} radius={0.035} smoothness={5}>
        <Metal color="#0C1117" roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[1.06, 0.22, 0.94]} position={[0.02, 0.12, 0.04]} radius={0.02} smoothness={4}>
        <Metal color={STEEL_BLUE} roughness={0.42} />
      </RoundedBox>
    </group>
  );
}

function StructuralBraces() {
  return (
    <group>
      <RoundedBox args={[0.09, 2.2, 0.09]} position={[-0.62, 1.36, 0.36]} rotation={[0, 0, -0.42]} radius={0.012} smoothness={3}><Metal color={SILVER} roughness={0.34} /></RoundedBox>
      <RoundedBox args={[0.08, 1.9, 0.08]} position={[0.58, 1.24, 0.38]} rotation={[0, 0, 0.45]} radius={0.01} smoothness={3}><Metal color={STEEL_BLUE} roughness={0.4} /></RoundedBox>
      <RoundedBox args={[0.06, 1.6, 0.06]} position={[-0.42, 1.56, 0.5]} rotation={[0, 0, 0.18]} radius={0.008} smoothness={3}><Metal color={SILVER} roughness={0.3} /></RoundedBox>
    </group>
  );
}

export function SentinelMonolith({ tier }: { tier: QualityTier }) {
  const compact = tier === "mobile" ? 0.78 : tier === "tablet" ? 0.9 : 1;
  return (
    <group position={SCULPTURE_WORLD_POSITION} rotation={[0, -0.18, 0]}>
      <MonolithBody compact={compact} />
      <StructuralBraces />
      <PulseCore />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.36, 0]}>
        <circleGeometry args={[4.4, tier === "mobile" ? 32 : 64]} />
        <MeshReflectorMaterial blur={[240, 60]} resolution={tier === "mobile" ? 256 : 512} mixBlur={1} mixStrength={18} roughness={0.82} depthScale={0.3} minDepthThreshold={0.85} color="#090D13" metalness={0.62} />
      </mesh>
    </group>
  );
}
