"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import {
  KEYSTONE_MASSES,
  KEYSTONE_TOTAL_HEIGHT,
  CUT_GAP,
  CORE_HEIGHT_RATIO,
  CORE_RADIUS,
  SCULPTURE_WORLD_POSITION,
  type QualityTier,
} from "@/constants/scene";
import { useControlledStillness } from "@/hooks/useControlledStillness";

/**
 * Digital Sculpture — Keystone Compresso (Bible concettuale FASE 2B).
 *
 * STEP 1 — MATERIALI. Questo file implementa esclusivamente la gerarchia
 * materica approvata:
 *   - massa di base: PVD nero (assorbe la luce, non è mai silhouette pura)
 *   - masse intermedie: metallo spazzolato microfine (riflessi direzionali)
 *   - il vuoto controllato: vetro rifrattivo, unico elemento trasparente
 *   - il principio attivo: emissione interna propria, confinata al taglio
 *
 * La geometria a masse compresse è il supporto minimo necessario per
 * applicare questi materiali secondo la gerarchia della Bible (ogni
 * materiale è definito per una massa specifica) — le proporzioni fini,
 * la composizione e il framing restano fuori scope, assegnati agli step
 * successivi della roadmap.
 *
 * Illuminazione, camera, rendering, post-processing, densità dell'aria:
 * NON toccati in questo file. Controlled Stillness: stesso hook, nessuna
 * modifica al sistema di scheduling.
 */

function PvdMass({ width, height, depth, yBase }: { width: number; height: number; depth: number; yBase: number }) {
  const half = (width - CUT_GAP) / 2;
  return (
    <group>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (CUT_GAP / 2 + half / 2), yBase + height / 2, 0]}>
          <boxGeometry args={[half, height, depth]} />
          {/*
            PVD nero: assorbe la maggior parte della luce ma conserva una
            risposta speculare stretta e minima — sufficiente a rivelare
            spigoli e volume, mai una silhouette nera assoluta (correzione
            esplicita ricevuta). Clearcoat sottile = il rivestimento fisico
            reale di un trattamento PVD, non un lucido decorativo.
          */}
          <meshPhysicalMaterial
            color="#06070a"
            metalness={0.85}
            roughness={0.34}
            clearcoat={0.15}
            clearcoatRoughness={0.28}
            envMapIntensity={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

function BrushedMass({
  width,
  height,
  depth,
  yBase,
  brushDirection = 0,
}: {
  width: number;
  height: number;
  depth: number;
  yBase: number;
  brushDirection?: number;
}) {
  const half = (width - CUT_GAP) / 2;
  return (
    <group>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (CUT_GAP / 2 + half / 2), yBase + height / 2, 0]}>
          <boxGeometry args={[half, height, depth]} />
          {/*
            Metallo spazzolato microfine: la direzione della spazzolatura
            è una conseguenza della lavorazione di quel pezzo specifico
            (Step 7 — micro-dettagli), qui espressa come anisotropia della
            risposta speculare, non come texture applicata.
          */}
          <meshPhysicalMaterial
            color="#B7BEC7"
            metalness={0.92}
            roughness={0.4}
            envMapIntensity={0.5}
            {...({ anisotropy: 0.65, anisotropyRotation: brushDirection } as any)}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Il vuoto controllato: unico elemento trasparente della composizione.
 * Segmentato per massa (una lastra di vetro per ogni livello) in modo che
 * la sua profondità coincida sempre con quella della massa che attraversa
 * in quel punto — resta percepito come un taglio unico e continuo.
 */
function ControlledVoid({ useTransmission }: { useTransmission: boolean }) {
  return (
    <group>
      {KEYSTONE_MASSES.map((mass, i) => (
        <mesh key={i} position={[0, mass.yBase + mass.height / 2, 0]}>
          <boxGeometry args={[CUT_GAP * 0.86, mass.height, mass.depth * 0.94]} />
          {useTransmission ? (
            <MeshTransmissionMaterial
              transmission={0.92}
              thickness={0.16}
              roughness={0.045}
              ior={1.45}
              chromaticAberration={0.012}
              color="#EAF1FF"
              attenuationColor="#EAF1FF"
              attenuationDistance={1.1}
              transparent
              opacity={0.9}
            />
          ) : (
            <meshPhysicalMaterial color="#EAF1FF" roughness={0.08} metalness={0} transparent opacity={0.45} />
          )}
        </mesh>
      ))}
    </group>
  );
}

/**
 * Il principio attivo: emissione interna propria, confinata al taglio.
 * Non è una luce di scena (nessun pointLight qui: la sua visibilità viene
 * esclusivamente dal materiale emissivo, non dalla propagazione fisica —
 * quella parte, se necessaria, appartiene allo step Illuminazione).
 * Terminologia Bible: "nucleo/sorgente/emissione interna", mai "energia".
 */
function InnerSource() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const { activeEvent } = useControlledStillness(1);

  useFrame((state) => {
    if (!matRef.current) return;
    // Respiro lento e minimo, coerente con Controlled Stillness (invariato).
    const t = state.clock.elapsedTime;
    const breath = (Math.sin((t / 22) * Math.PI * 2) + 1) / 2;
    const eventBoost = activeEvent?.type === "facet-glow" ? 0.4 : 0;
    matRef.current.emissiveIntensity = 1.8 + breath * 0.3 + eventBoost;
  });

  const coreHeight = KEYSTONE_TOTAL_HEIGHT * CORE_HEIGHT_RATIO;
  const centerY = KEYSTONE_TOTAL_HEIGHT / 2;

  return (
    <mesh position={[0, centerY, 0]}>
      <boxGeometry args={[CUT_GAP * 0.4, coreHeight, CORE_RADIUS * 2]} />
      <meshStandardMaterial
        ref={matRef}
        color="#F2C94C"
        emissive="#F2C94C"
        emissiveIntensity={1.8}
        toneMapped={false}
      />
    </mesh>
  );
}

export function DigitalSculpture3D({ tier }: { tier: QualityTier }) {
  const useTransmission = tier !== "mobile";
  const reflectiveGround = tier !== "mobile";

  return (
    <group position={SCULPTURE_WORLD_POSITION}>
      {KEYSTONE_MASSES.map((mass, i) =>
        mass.material === "pvd" ? (
          <PvdMass key={i} width={mass.width} height={mass.height} depth={mass.depth} yBase={mass.yBase} />
        ) : (
          <BrushedMass
            key={i}
            width={mass.width}
            height={mass.height}
            depth={mass.depth}
            yBase={mass.yBase}
            brushDirection={mass.brushDirection}
          />
        )
      )}

      <ControlledVoid useTransmission={useTransmission} />
      <InnerSource />

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
