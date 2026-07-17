"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { generateShardSpecs } from "@/components/background/crystalFracture";
import { buildFracturedShards } from "@/components/background/crystalCSG";
import {
  FRACTURE_ENVELOPE,
  FRACTURE_SHARD_COUNT,
  SCULPTURE_WORLD_POSITION,
  type QualityTier,
} from "@/constants/scene";
import { useControlledStillness } from "@/hooks/useControlledStillness";

/**
 * FracturedCrystal — Approccio A (approvato): massa unica composta da
 * numerose lamine reali, ottenute intersecando (CSG) lastre orientate
 * deterministicamente con l'inviluppo del cristallo. Nessuna BoxGeometry
 * "nuda" in scena: ogni mesh renderizzata è il risultato di un'operazione
 * booleana, quindi geometricamente irregolare e sfaccettata.
 *
 * Calcolo eseguito una sola volta per tier (useMemo, dipendenze fisse):
 * mai ricostruito per frame, mai a runtime.
 */
function Shard({ geometry, useTransmission, dim }: { geometry: THREE.BufferGeometry; useTransmission: boolean; dim: boolean }) {
  const matRef = useRef<any>(null);

  useFrame(() => {
    if (!matRef.current) return;
    const targetOpacity = dim ? 0.55 : 0.82;
    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity ?? 0.7, targetOpacity, 0.04);
  });

  return (
    <mesh geometry={geometry}>
      {useTransmission ? (
        <MeshTransmissionMaterial
          ref={matRef}
          transmission={0.88}
          thickness={0.2}
          roughness={0.05}
          ior={1.42}
          chromaticAberration={0.014}
          color="#DCE8FF"
          attenuationColor="#5C93FF"
          attenuationDistance={0.75}
          transparent
          opacity={0.78}
        />
      ) : (
        <meshPhysicalMaterial ref={matRef} color="#B9CDFF" roughness={0.15} metalness={0.05} transparent opacity={0.5} />
      )}
    </mesh>
  );
}

function CoreLight() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const { activeEvent } = useControlledStillness(1);

  useFrame((state) => {
    if (!matRef.current) return;
    const t = state.clock.elapsedTime;
    const breath = (Math.sin((t / 22) * Math.PI * 2) + 1) / 2;
    const eventBoost = activeEvent?.type === "facet-glow" ? 0.4 : 0;
    matRef.current.emissiveIntensity = 1.8 + breath * 0.3 + eventBoost;
  });

  return (
    <mesh>
      <sphereGeometry args={[0.055, 20, 20]} />
      <meshStandardMaterial ref={matRef} color="#F2C94C" emissive="#F2C94C" emissiveIntensity={1.8} toneMapped={false} />
    </mesh>
  );
}

export function FracturedCrystal({ tier }: { tier: QualityTier }) {
  const useTransmission = tier !== "mobile";
  const reflectiveGround = tier !== "mobile";
  const shardCount = FRACTURE_SHARD_COUNT[tier];

  // Costruzione una sola volta: seed fisso + tier fisso per la durata del
  // mount => stesso identico risultato ogni volta, mai ricalcolato.
  const geometries = useMemo(() => {
    const envelopeRadius = Math.max(FRACTURE_ENVELOPE.width, FRACTURE_ENVELOPE.height, FRACTURE_ENVELOPE.depth) / 2;
    const specs = generateShardSpecs(shardCount, envelopeRadius);
    return buildFracturedShards(specs, FRACTURE_ENVELOPE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shardCount]);

  const { activeEvent } = useControlledStillness(geometries.length);

  return (
    <group position={SCULPTURE_WORLD_POSITION}>
      <group position={[0, FRACTURE_ENVELOPE.height / 2, 0]}>
        {geometries.map((geo, i) => (
          <Shard
            key={i}
            geometry={geo}
            useTransmission={useTransmission}
            dim={activeEvent?.type === "conduit-pulse" && activeEvent.targetIndex % geometries.length === i}
          />
        ))}
        <CoreLight />
      </group>

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
