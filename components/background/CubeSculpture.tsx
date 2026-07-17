"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, MeshReflectorMaterial, Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { SCULPTURE_WORLD_POSITION, type QualityTier } from "@/constants/scene";
import { useControlledStillness } from "@/hooks/useControlledStillness";

/**
 * CubeSculpture — variante "Cubo di vetro", ricostruita a partire dallo
 * screenshot di riferimento (Active Theory): cubo esterno traslucido +
 * cubo interno annidato (stessa orientazione), asse verticale dorato che
 * attraversa il centro, raggi blu diagonali che lo attraversano, campo di
 * particelle rade. Variante alternativa al Keystone Compresso, per
 * confronto diretto — non sostituisce la Bible concettuale, la affianca.
 */

const OUTER_SIZE = 0.85;
const INNER_SIZE = 0.42;

function NestedCube({ useTransmission }: { useTransmission: boolean }) {
  const outerRef = useRef<any>(null);
  const { activeEvent } = useControlledStillness(2);

  useFrame(() => {
    if (!outerRef.current) return;
    const isTargeted = activeEvent?.type === "facet-glow";
    const target = isTargeted ? 0.6 : 0.86;
    if ("transmission" in outerRef.current) {
      outerRef.current.transmission = THREE.MathUtils.lerp(outerRef.current.transmission ?? 0.86, target, 0.045);
    }
  });

  return (
    <group>
      <mesh position={[0, OUTER_SIZE / 2, 0]}>
        <boxGeometry args={[OUTER_SIZE, OUTER_SIZE, OUTER_SIZE]} />
        {useTransmission ? (
          <MeshTransmissionMaterial
            ref={outerRef}
            transmission={0.86}
            thickness={0.3}
            roughness={0.06}
            ior={1.38}
            chromaticAberration={0.012}
            color="#5C93FF"
            attenuationColor="#3D7DFA"
            attenuationDistance={0.8}
            transparent
            opacity={0.75}
          />
        ) : (
          <meshPhysicalMaterial color="#5C93FF" roughness={0.12} metalness={0.15} transparent opacity={0.55} />
        )}
      </mesh>

      <mesh position={[0, OUTER_SIZE * 0.42, 0]}>
        <boxGeometry args={[INNER_SIZE, INNER_SIZE, INNER_SIZE]} />
        {useTransmission ? (
          <MeshTransmissionMaterial
            transmission={0.9}
            thickness={0.18}
            roughness={0.04}
            ior={1.42}
            chromaticAberration={0.01}
            color="#EAF1FF"
            attenuationColor="#5C93FF"
            attenuationDistance={0.6}
            transparent
            opacity={0.8}
          />
        ) : (
          <meshPhysicalMaterial color="#EAF1FF" roughness={0.08} metalness={0.05} transparent opacity={0.5} />
        )}
      </mesh>
    </group>
  );
}

function GoldenAxis() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!matRef.current) return;
    const t = state.clock.elapsedTime;
    const breath = (Math.sin((t / 20) * Math.PI * 2) + 1) / 2;
    matRef.current.emissiveIntensity = 1.6 + breath * 0.35;
  });

  return (
    <mesh position={[0, OUTER_SIZE * 0.55, 0]}>
      <boxGeometry args={[0.028, OUTER_SIZE * 2.1, 0.028]} />
      <meshStandardMaterial ref={matRef} color="#F2C94C" emissive="#F2C94C" emissiveIntensity={1.6} toneMapped={false} />
    </mesh>
  );
}

function DiagonalBeams({ count }: { count: number }) {
  const beams = useMemo(() => {
    const list: { position: [number, number, number]; rotation: [number, number, number]; length: number }[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + 0.3;
      const tilt = 0.5 + ((i * 13) % 5) * 0.06;
      list.push({
        position: [Math.cos(a) * 0.05, OUTER_SIZE * 0.5, Math.sin(a) * 0.05],
        rotation: [tilt, a, 0],
        length: 2.2 + ((i * 7) % 4) * 0.3,
      });
    }
    return list;
  }, [count]);

  return (
    <group>
      {beams.map((b, i) => (
        <mesh key={i} position={b.position} rotation={b.rotation}>
          <boxGeometry args={[0.008, b.length, 0.008]} />
          <meshStandardMaterial color="#5C93FF" emissive="#3D7DFA" emissiveIntensity={0.9} transparent opacity={0.35} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Sparkles({ count }: { count: number }) {
  const positions = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i * 2.399963) % (Math.PI * 2); // distribuzione a spirale aurea, deterministica
      const r = 0.7 + ((i * 0.618) % 1) * 1.4;
      const y = ((i * 0.382) % 1) * OUTER_SIZE * 2.4;
      pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    return pts;
  }, [count]);

  return (
    <Instances limit={positions.length}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#5C93FF" emissive="#5C93FF" emissiveIntensity={1.8} toneMapped={false} />
      {positions.map((p, i) => (
        <Instance key={i} position={p} scale={0.008 + ((i * 11) % 5) * 0.003} />
      ))}
    </Instances>
  );
}

export function CubeSculpture({ tier }: { tier: QualityTier }) {
  const useTransmission = tier !== "mobile";
  const reflectiveGround = tier !== "mobile";
  const beamCount = tier === "desktop" ? 10 : tier === "tablet" ? 7 : 4;
  const sparkleCount = tier === "desktop" ? 90 : tier === "tablet" ? 55 : 30;

  return (
    <group position={SCULPTURE_WORLD_POSITION}>
      <NestedCube useTransmission={useTransmission} />
      <GoldenAxis />
      <DiagonalBeams count={beamCount} />
      <Sparkles count={sparkleCount} />

      {reflectiveGround ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
          <circleGeometry args={[4, 48]} />
          <MeshReflectorMaterial
            blur={[300, 80]}
            resolution={512}
            mixBlur={1}
            mixStrength={25}
            roughness={0.9}
            depthScale={0.4}
            minDepthThreshold={0.85}
            color="#0A0B0D"
            metalness={0.4}
          />
        </mesh>
      ) : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
          <circleGeometry args={[4, 32]} />
          <meshStandardMaterial color="#0A0B0D" roughness={1} />
        </mesh>
      )}
    </group>
  );
}
