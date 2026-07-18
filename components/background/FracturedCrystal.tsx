"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { generateShardSpecs } from "@/components/background/crystalFracture";
import { buildFracturedShards, type FracturedShard } from "@/components/background/crystalCSG";
import {
  FRACTURE_ENVELOPE,
  FRACTURE_LAMINA_PER_FAMILY,
  SCULPTURE_WORLD_POSITION,
  type QualityTier,
} from "@/constants/scene";
import { useControlledStillness } from "@/hooks/useControlledStillness";

/**
 * FracturedCrystal — Approccio A, v2: struttura a famiglie deterministiche
 * (massa centrale sugli assi dell'inviluppo + famiglie di lamine diagonali
 * ripetute con jitter stretto), non più una distribuzione uniforme sulla
 * sfera. Nessuna BoxGeometry "nuda" in scena: ogni mesh renderizzata è
 * l'esito di un'intersezione booleana (CSG) con l'inviluppo.
 *
 * NON VERIFICATO visivamente da me (nessuna capacità di rendering in
 * questo ambiente) — solo verificato a livello di codice/logica.
 */
function Shard({ shard, useTransmission }: { shard: FracturedShard; useTransmission: boolean }) {
  const isCore = shard.kind === "core";
  return (
    <mesh geometry={shard.geometry}>
      {useTransmission ? (
        <MeshTransmissionMaterial
          transmission={isCore ? 0.72 : 0.9}
          thickness={isCore ? 0.4 : 0.15}
          roughness={isCore ? 0.08 : 0.04}
          ior={1.42}
          chromaticAberration={0.012}
          color={isCore ? "#B9CDFF" : "#DCE8FF"}
          attenuationColor="#5C93FF"
          attenuationDistance={isCore ? 0.5 : 0.9}
          transparent
          opacity={isCore ? 0.88 : 0.7}
        />
      ) : (
        <meshPhysicalMaterial
          color={isCore ? "#8FA8E0" : "#B9CDFF"}
          roughness={0.15}
          metalness={0.05}
          transparent
          opacity={isCore ? 0.7 : 0.4}
        />
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
      <sphereGeometry args={[0.05, 20, 20]} />
      <meshStandardMaterial ref={matRef} color="#F2C94C" emissive="#F2C94C" emissiveIntensity={1.8} toneMapped={false} />
    </mesh>
  );
}

export function FracturedCrystal({ tier }: { tier: QualityTier }) {
  const useTransmission = tier !== "mobile";
  const reflectiveGround = tier !== "mobile";
  const laminaPerFamily = FRACTURE_LAMINA_PER_FAMILY[tier];

  // Costruzione una sola volta: seed fisso + tier fisso per la durata del
  // mount => stesso identico risultato ogni volta, mai ricalcolato.
  const shards = useMemo(() => {
    const envelopeRadius = Math.max(FRACTURE_ENVELOPE.width, FRACTURE_ENVELOPE.height, FRACTURE_ENVELOPE.depth) / 2;
    const specs = generateShardSpecs(laminaPerFamily, envelopeRadius);
    return buildFracturedShards(specs, FRACTURE_ENVELOPE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laminaPerFamily]);

  return (
    <group position={SCULPTURE_WORLD_POSITION}>
      <group position={[0, FRACTURE_ENVELOPE.height / 2, 0]}>
        {shards.map((shard, i) => (
          <Shard key={i} shard={shard} useTransmission={useTransmission} />
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
