"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, MeshReflectorMaterial, Line } from "@react-three/drei";
import * as THREE from "three";
import { buildCrystalGeometry } from "@/components/background/crystalGeometry";
import {
  CRYSTAL,
  CRYSTAL_GROUND_OFFSET,
  CORE_RADIUS,
  SCULPTURE_WORLD_POSITION,
  BASE_CONDUITS_COUNT,
  BASE_CONDUIT_RADIUS,
  DESCENDING_BEAMS_COUNT,
  DESCENDING_BEAM_HEIGHT,
  DESCENDING_BEAM_SCATTER,
  type QualityTier,
} from "@/constants/scene";
import { AMBIENT_LIGHT_ORIGIN } from "@/constants/stillness";
import { useControlledStillness } from "@/hooks/useControlledStillness";
import type { StillnessEvent } from "@/components/background/heroStillness";

/**
 * Il Monolite — solido geometrico sfaccettato, guscio esterno + nucleo
 * interno annidato, poggiato su una base riflettente, alimentato da
 * condotti di energia. Presenza monumentale, massa percepita, struttura
 * costruita, ordine, centralità. Nessun movimento della geometria stessa:
 * la vita dell'oggetto è comunicata dalla luce (nucleo, spigoli, condotti),
 * non dal movimento della forma. Rif. immagine di riferimento approvata.
 */

function CrystalShell({
  radius,
  detail,
  stretchY,
  taper,
  rotationY = 0,
  useTransmission,
  active,
  isInner,
}: {
  radius: number;
  detail: number;
  stretchY: number;
  taper: number;
  rotationY?: number;
  useTransmission: boolean;
  active: StillnessEvent | null;
  isInner: boolean;
}) {
  const geometry = useMemo(
    () => buildCrystalGeometry({ radius, detail, stretchY, taper }),
    [radius, detail, stretchY, taper]
  );
  const materialRef = useRef<any>(null);

  const isFacetEvent = active?.type === "facet-glow";
  const isTargeted = isFacetEvent && active?.targetIndex % 2 === (isInner ? 1 : 0);

  useFrame(() => {
    if (!materialRef.current) return;
    const targetTransmission = isTargeted ? 0.62 : 0.86;
    const targetOpacity = isTargeted ? 0.92 : 0.8;
    if ("transmission" in materialRef.current) {
      materialRef.current.transmission = THREE.MathUtils.lerp(
        materialRef.current.transmission ?? 0.86,
        targetTransmission,
        0.045
      );
    }
    materialRef.current.opacity = THREE.MathUtils.lerp(
      materialRef.current.opacity ?? 0.8,
      targetOpacity,
      0.045
    );
  });

  return (
    <mesh geometry={geometry} rotation={[0, rotationY, 0]}>
      {useTransmission ? (
        <MeshTransmissionMaterial
          ref={materialRef}
          transmission={0.86}
          thickness={0.55}
          roughness={0.1}
          chromaticAberration={0.008}
          ior={1.35}
          flatShading
          color={AMBIENT_LIGHT_ORIGIN.colorSoft}
          attenuationColor={AMBIENT_LIGHT_ORIGIN.color}
          attenuationDistance={0.7}
          transparent
          opacity={0.8}
        />
      ) : (
        <meshPhysicalMaterial
          ref={materialRef}
          color={AMBIENT_LIGHT_ORIGIN.colorSoft}
          roughness={0.16}
          metalness={0.25}
          flatShading
          transparent
          opacity={0.86}
        />
      )}
    </mesh>
  );
}

function BaseConduits({ active }: { active: StillnessEvent | null }) {
  const points = useMemo(() => {
    const groups: THREE.Vector3[][] = [];
    for (let i = 0; i < BASE_CONDUITS_COUNT; i++) {
      const a = (i / BASE_CONDUITS_COUNT) * Math.PI * 2;
      const start = new THREE.Vector3(0, -CRYSTAL_GROUND_OFFSET, 0);
      const mid = new THREE.Vector3(
        Math.cos(a) * BASE_CONDUIT_RADIUS * 0.45,
        -CRYSTAL_GROUND_OFFSET,
        Math.sin(a) * BASE_CONDUIT_RADIUS * 0.45
      );
      const end = new THREE.Vector3(
        Math.cos(a) * BASE_CONDUIT_RADIUS,
        -CRYSTAL_GROUND_OFFSET,
        Math.sin(a) * BASE_CONDUIT_RADIUS
      );
      groups.push([start, mid, end]);
    }
    return groups;
  }, []);

  return (
    <group>
      {points.map((pts, i) => {
        const isActive = active?.type === "conduit-pulse" && active.targetIndex % BASE_CONDUITS_COUNT === i;
        return (
          <Line
            key={i}
            points={pts}
            color={AMBIENT_LIGHT_ORIGIN.colorSoft}
            lineWidth={isActive ? 1.6 : 0.8}
            transparent
            opacity={isActive ? 0.85 : 0.22}
          />
        );
      })}
    </group>
  );
}

function DescendingBeams({ active }: { active: StillnessEvent | null }) {
  const beams = useMemo(() => {
    const list: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    for (let i = 0; i < DESCENDING_BEAMS_COUNT; i++) {
      const a = (i / DESCENDING_BEAMS_COUNT) * Math.PI * 2 + 0.4;
      const r = DESCENDING_BEAM_SCATTER;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      list.push({
        start: new THREE.Vector3(x, DESCENDING_BEAM_HEIGHT, z),
        end: new THREE.Vector3(x * 0.4, CRYSTAL.outerRadius * CRYSTAL.outerStretchY * 0.78, z * 0.4),
      });
    }
    return list;
  }, []);

  return (
    <group>
      {beams.map((b, i) => {
        const isActive = active?.type === "beam-flicker" && active.targetIndex % DESCENDING_BEAMS_COUNT === i;
        return (
          <Line
            key={i}
            points={[b.start, b.end]}
            color={AMBIENT_LIGHT_ORIGIN.colorSoft}
            lineWidth={isActive ? 1.4 : 0.6}
            transparent
            opacity={isActive ? 0.7 : 0.15}
          />
        );
      })}
    </group>
  );
}

export function DigitalSculpture3D({ tier }: { tier: QualityTier }) {
  const settings = {
    desktop: { detail: 1, transmission: true, reflectiveGround: true },
    tablet: { detail: 0, transmission: true, reflectiveGround: true },
    mobile: { detail: 0, transmission: false, reflectiveGround: false },
  }[tier];

  const { activeEvent } = useControlledStillness(Math.max(BASE_CONDUITS_COUNT, DESCENDING_BEAMS_COUNT));
  const coreRef = useRef<THREE.Mesh>(null);
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    // Il nucleo respira: unica presenza costante, periodo lungo, variazione
    // contenuta — centro energetico di una struttura pesante e stabile.
    const t = state.clock.elapsedTime;
    const breath = (Math.sin((t / 22) * Math.PI * 2) + 1) / 2; // 0..1
    const scale = 1 + breath * 0.045;
    if (coreRef.current) coreRef.current.scale.setScalar(scale);
    if (coreMatRef.current) {
      coreMatRef.current.emissiveIntensity = 1.3 + breath * 0.3;
    }
  });

  return (
    <group position={SCULPTURE_WORLD_POSITION}>
      {/* Guscio esterno */}
      <CrystalShell
        radius={CRYSTAL.outerRadius}
        detail={settings.detail}
        stretchY={CRYSTAL.outerStretchY}
        taper={CRYSTAL.outerTaper}
        useTransmission={settings.transmission}
        active={activeEvent}
        isInner={false}
      />

      {/* Nucleo interno annidato: visibile in trasparenza, ruotato */}
      <CrystalShell
        radius={CRYSTAL.innerRadius}
        detail={settings.detail}
        stretchY={CRYSTAL.innerStretchY}
        taper={CRYSTAL.innerTaper}
        rotationY={CRYSTAL.innerRotationY}
        useTransmission={settings.transmission}
        active={activeEvent}
        isInner
      />

      {/* Punto di equilibrio: la sorgente di luce propria */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[CORE_RADIUS, 24, 24]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color={AMBIENT_LIGHT_ORIGIN.colorSoft}
          emissive={AMBIENT_LIGHT_ORIGIN.color}
          emissiveIntensity={1.3}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={AMBIENT_LIGHT_ORIGIN.colorSoft} intensity={1.4} distance={2.6} decay={2} />

      <BaseConduits active={activeEvent} />
      <DescendingBeams active={activeEvent} />

      {/* Base: piano riflettente che ancora l'oggetto — massa e gravità percepita */}
      {settings.reflectiveGround ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -CRYSTAL_GROUND_OFFSET - 0.01, 0]}>
          <circleGeometry args={[3.2, 48]} />
          <MeshReflectorMaterial
            blur={[300, 80]}
            resolution={512}
            mixBlur={1}
            mixStrength={30}
            roughness={0.9}
            depthScale={0.4}
            minDepthThreshold={0.85}
            color="#0A0B0D"
            metalness={0.4}
          />
        </mesh>
      ) : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -CRYSTAL_GROUND_OFFSET - 0.01, 0]}>
          <circleGeometry args={[3.2, 32]} />
          <meshStandardMaterial color="#0A0B0D" roughness={1} />
        </mesh>
      )}
    </group>
  );
}
