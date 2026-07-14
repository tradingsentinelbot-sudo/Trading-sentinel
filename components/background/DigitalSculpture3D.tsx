"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { buildRibbonGeometry } from "@/components/background/ribbonGeometry";
import { RIBBONS_3D, CORE_RADIUS, SCULPTURE_WORLD_POSITION, type QualityTier } from "@/constants/scene";
import { AMBIENT_LIGHT_ORIGIN } from "@/constants/stillness";
import { useControlledStillness } from "@/hooks/useControlledStillness";
import { wander } from "@/lib/wander";

const CORE_LAYER = 1; // layer dedicato al bloom selettivo (vedi SceneCanvas)

function Ribbon({
  spec,
  index,
  segments,
  useTransmission,
  active,
}: {
  spec: (typeof RIBBONS_3D)[number];
  index: number;
  segments: number;
  useTransmission: boolean;
  active: { targetIndex: number; type: string } | null;
}) {
  const geometry = useMemo(
    () =>
      buildRibbonGeometry({
        radiusA: spec.radiusA,
        radiusB: spec.radiusB,
        angle: spec.angle,
        twist: spec.twist,
        width: spec.width,
        segments,
        seedOffset: spec.seedOffset,
      }),
    [spec, segments]
  );

  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);

  const isTargeted = active?.targetIndex === index;
  const isRealign = isTargeted && active?.type === "realign";
  const isRefraction = isTargeted && active?.type === "refraction";

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Deriva ambientale minima e lenta: massa che si assesta, non parti
    // che si agitano — ogni nastro ha una propria velocità (mai sincronizzate).
    const driftRot = wander(t, spec.seedOffset, spec.driftAmplitude, spec.driftSpeed);
    const realignBoost = isRealign ? 0.02 : 0;

    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      driftRot + realignBoost,
      0.025
    );

    if (materialRef.current) {
      const targetTransmission = isRefraction ? 0.62 : 0.82;
      const targetOpacity = isRefraction ? 0.9 : 0.78;
      if ("transmission" in materialRef.current) {
        materialRef.current.transmission = THREE.MathUtils.lerp(
          materialRef.current.transmission ?? 0.82,
          targetTransmission,
          0.05
        );
      }
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity ?? 0.78,
        targetOpacity,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        {useTransmission ? (
          <MeshTransmissionMaterial
            ref={materialRef}
            transmission={0.82}
            thickness={0.4}
            roughness={0.14}
            chromaticAberration={0.006}
            ior={1.3}
            color={AMBIENT_LIGHT_ORIGIN.colorSoft}
            attenuationColor={AMBIENT_LIGHT_ORIGIN.color}
            attenuationDistance={0.5}
            transparent
            opacity={0.78}
          />
        ) : (
          <meshPhysicalMaterial
            ref={materialRef}
            color={AMBIENT_LIGHT_ORIGIN.colorSoft}
            roughness={0.18}
            metalness={0.22}
            transparent
            opacity={0.85}
          />
        )}
      </mesh>
    </group>
  );
}

/**
 * DigitalSculpture3D — l'entità proprietaria della Hero come oggetto 3D reale.
 * Tre elementi strutturali in simmetria radiale attorno a un nucleo
 * energetico: massa percepita, precisione, controllo — non un organismo.
 * Rif. Global Technical Directive — punto 5, Global Creative Direction.
 */
export function DigitalSculpture3D({ tier }: { tier: QualityTier }) {
  const settings = {
    desktop: { segments: 160, transmission: true },
    tablet: { segments: 96, transmission: true },
    mobile: { segments: 56, transmission: false },
  }[tier];

  const { activeEvent } = useControlledStillness(RIBBONS_3D.length);
  const coreRef = useRef<THREE.Mesh>(null);
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    // Il nucleo respira: unica presenza costante, periodo lungo (20s),
    // variazione contenuta — centro energetico di una struttura pesante,
    // non un indicatore che lampeggia.
    const t = state.clock.elapsedTime;
    const breath = (Math.sin((t / 20) * Math.PI * 2) + 1) / 2; // 0..1
    const scale = 1 + breath * 0.05;
    if (coreRef.current) coreRef.current.scale.setScalar(scale);
    if (coreMatRef.current) {
      coreMatRef.current.emissiveIntensity = 1.3 + breath * 0.35;
    }
  });

  return (
    <group position={SCULPTURE_WORLD_POSITION}>
      {RIBBONS_3D.map((spec, i) => (
        <Ribbon
          key={i}
          spec={spec}
          index={i}
          segments={settings.segments}
          useTransmission={settings.transmission}
          active={activeEvent}
        />
      ))}

      <mesh ref={coreRef} layers={CORE_LAYER}>
        <sphereGeometry args={[CORE_RADIUS, 32, 32]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color={AMBIENT_LIGHT_ORIGIN.colorSoft}
          emissive={AMBIENT_LIGHT_ORIGIN.color}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={AMBIENT_LIGHT_ORIGIN.colorSoft} intensity={1.2} distance={2.2} decay={2} />
    </group>
  );
}
