"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, MeshReflectorMaterial, Line, Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import {
  CUBE,
  CORE_RADIUS,
  SCULPTURE_WORLD_POSITION,
  PLINTH_LAYERS,
  PLINTH_TOP_Y,
  DESCENDING_BEAM_HEIGHT,
  DESCENDING_BEAM_SCATTER,
  BASE_CONDUIT_DIRECTIONS,
  BASE_CONDUIT_STRANDS_PER_BUNDLE,
  BASE_CONDUIT_LENGTH,
  BASE_CONDUIT_SPARKLES_PER_STRAND,
  type QualityTier,
} from "@/constants/scene";
import { AMBIENT_LIGHT_ORIGIN } from "@/constants/stillness";
import { useControlledStillness } from "@/hooks/useControlledStillness";
import type { StillnessEvent } from "@/components/background/heroStillness";

/**
 * Digital Sculpture — replica fedele del riferimento approvato: cubo
 * traslucido con un cubo interno annidato (stessa orientazione), poggiato
 * su un piedistallo a lastre impilate e sfalsate, alimentato da fasci
 * verticali densi dall'alto e da fasci di condotti curvi alla base.
 * Nessuna geometria organica: solo forme regolari e flussi direzionali.
 */

function CubeShell({
  size,
  useTransmission,
  active,
  isInner,
}: {
  size: number;
  useTransmission: boolean;
  active: StillnessEvent | null;
  isInner: boolean;
}) {
  const materialRef = useRef<any>(null);
  const isTargeted = active?.type === "facet-glow" && active?.targetIndex % 2 === (isInner ? 1 : 0);

  useFrame(() => {
    if (!materialRef.current) return;
    const targetTransmission = isTargeted ? 0.6 : 0.88;
    const targetOpacity = isTargeted ? 0.92 : 0.75;
    if ("transmission" in materialRef.current) {
      materialRef.current.transmission = THREE.MathUtils.lerp(
        materialRef.current.transmission ?? 0.88,
        targetTransmission,
        0.045
      );
    }
    materialRef.current.opacity = THREE.MathUtils.lerp(
      materialRef.current.opacity ?? 0.75,
      targetOpacity,
      0.045
    );
  });

  return (
    <mesh position={[0, size / 2, 0]}>
      <boxGeometry args={[size, size, size]} />
      {useTransmission ? (
        <MeshTransmissionMaterial
          ref={materialRef}
          transmission={0.88}
          thickness={0.35}
          roughness={0.06}
          chromaticAberration={0.01}
          ior={1.4}
          color={AMBIENT_LIGHT_ORIGIN.colorSoft}
          attenuationColor={AMBIENT_LIGHT_ORIGIN.color}
          attenuationDistance={0.8}
          transparent
          opacity={0.75}
        />
      ) : (
        <meshPhysicalMaterial
          ref={materialRef}
          color={AMBIENT_LIGHT_ORIGIN.colorSoft}
          roughness={0.12}
          metalness={0.2}
          transparent
          opacity={0.8}
        />
      )}
    </mesh>
  );
}

function Plinth() {
  return (
    <group>
      {PLINTH_LAYERS.map((layer, i) => (
        <mesh key={i} position={[0, layer.yOffset + layer.height / 2, 0]} rotation={[0, layer.rotationY, 0]}>
          <boxGeometry args={[layer.size, layer.height, layer.size]} />
          <meshStandardMaterial color="#12141a" roughness={0.35} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function DescendingBeams({ count, active }: { count: number; active: StillnessEvent | null }) {
  const beams = useMemo(() => {
    const list: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 * 3.1 + i * 0.7;
      const r = DESCENDING_BEAM_SCATTER * (0.4 + (0.6 * ((i * 37) % 11)) / 10);
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      list.push({
        start: new THREE.Vector3(x, DESCENDING_BEAM_HEIGHT, z),
        end: new THREE.Vector3(x * 0.55, CUBE.outerSize * 0.92, z * 0.55),
      });
    }
    return list;
  }, [count]);

  return (
    <group>
      {beams.map((b, i) => {
        const isActive = active?.type === "beam-flicker" && active.targetIndex % count === i;
        return (
          <Line
            key={i}
            points={[b.start, b.end]}
            color={AMBIENT_LIGHT_ORIGIN.colorSoft}
            lineWidth={isActive ? 1.3 : 0.55}
            transparent
            opacity={isActive ? 0.75 : 0.16}
          />
        );
      })}
    </group>
  );
}

function BaseConduits({ active }: { active: StillnessEvent | null }) {
  const { curves, sparklePositions } = useMemo(() => {
    const allCurves: { points: THREE.Vector3[]; bundle: number }[] = [];
    const sparkles: THREE.Vector3[] = [];
    const directionAngles = [0.6, 2.5, 3.7, 5.6];

    for (let d = 0; d < BASE_CONDUIT_DIRECTIONS; d++) {
      const baseAngle = directionAngles[d % directionAngles.length];
      const perpAngle = baseAngle + Math.PI / 2;
      const perp = new THREE.Vector3(Math.cos(perpAngle), 0, Math.sin(perpAngle));

      for (let s = 0; s < BASE_CONDUIT_STRANDS_PER_BUNDLE; s++) {
        const lateral = (s - (BASE_CONDUIT_STRANDS_PER_BUNDLE - 1) / 2) * 0.075;
        const waveAmp = 0.28 + (s % 3) * 0.05;

        const p0 = new THREE.Vector3(Math.cos(baseAngle) * 0.9, 0, Math.sin(baseAngle) * 0.9).addScaledVector(
          perp,
          lateral
        );
        const p1 = new THREE.Vector3(
          Math.cos(baseAngle) * BASE_CONDUIT_LENGTH * 0.45,
          0.02,
          Math.sin(baseAngle) * BASE_CONDUIT_LENGTH * 0.45
        ).addScaledVector(perp, lateral + waveAmp);
        const p2 = new THREE.Vector3(
          Math.cos(baseAngle) * BASE_CONDUIT_LENGTH * 0.75,
          -0.01,
          Math.sin(baseAngle) * BASE_CONDUIT_LENGTH * 0.75
        ).addScaledVector(perp, lateral - waveAmp * 0.6);
        const p3 = new THREE.Vector3(
          Math.cos(baseAngle) * BASE_CONDUIT_LENGTH,
          -0.03,
          Math.sin(baseAngle) * BASE_CONDUIT_LENGTH
        ).addScaledVector(perp, lateral);

        const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3]);
        const pts = curve.getPoints(28);
        allCurves.push({ points: pts, bundle: d });

        for (let k = 0; k < BASE_CONDUIT_SPARKLES_PER_STRAND; k++) {
          const t = 0.2 + (k / BASE_CONDUIT_SPARKLES_PER_STRAND) * 0.75;
          sparkles.push(curve.getPointAt(t));
        }
      }
    }

    return { curves: allCurves, sparklePositions: sparkles };
  }, []);

  return (
    <group>
      {curves.map((c, i) => {
        const isActive = active?.type === "conduit-pulse" && active.targetIndex % BASE_CONDUIT_DIRECTIONS === c.bundle;
        return (
          <Line
            key={i}
            points={c.points}
            color={AMBIENT_LIGHT_ORIGIN.colorSoft}
            lineWidth={isActive ? 1.2 : 0.5}
            transparent
            opacity={isActive ? 0.8 : 0.2}
          />
        );
      })}

      <Instances limit={sparklePositions.length}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial
          color={AMBIENT_LIGHT_ORIGIN.colorSoft}
          emissive={AMBIENT_LIGHT_ORIGIN.color}
          emissiveIntensity={2}
          toneMapped={false}
        />
        {sparklePositions.map((p, i) => (
          <Instance key={i} position={p} scale={0.012 + ((i * 13) % 5) * 0.002} />
        ))}
      </Instances>
    </group>
  );
}

export function DigitalSculpture3D({ tier }: { tier: QualityTier }) {
  const settings = {
    desktop: { transmission: true, reflectiveGround: true, beamCount: 18 },
    tablet: { transmission: true, reflectiveGround: true, beamCount: 12 },
    mobile: { transmission: false, reflectiveGround: false, beamCount: 8 },
  }[tier];

  const { activeEvent } = useControlledStillness(Math.max(BASE_CONDUIT_DIRECTIONS, settings.beamCount));
  const coreRef = useRef<THREE.Mesh>(null);
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const innerCubeY = CUBE.outerSize / 2;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const breath = (Math.sin((t / 22) * Math.PI * 2) + 1) / 2;
    const scale = 1 + breath * 0.05;
    if (coreRef.current) coreRef.current.scale.setScalar(scale);
    if (coreMatRef.current) {
      coreMatRef.current.emissiveIntensity = 1.4 + breath * 0.35;
    }
  });

  return (
    <group position={SCULPTURE_WORLD_POSITION}>
      <group position={[0, PLINTH_TOP_Y, 0]}>
        <CubeShell size={CUBE.outerSize} useTransmission={settings.transmission} active={activeEvent} isInner={false} />

        <group position={[0, innerCubeY - CUBE.innerSize / 2 - (CUBE.outerSize - CUBE.innerSize) * 0.15, 0]}>
          <CubeShell size={CUBE.innerSize} useTransmission={settings.transmission} active={activeEvent} isInner />
        </group>

        <mesh ref={coreRef} position={[0, innerCubeY, 0]}>
          <sphereGeometry args={[CORE_RADIUS, 24, 24]} />
          <meshStandardMaterial
            ref={coreMatRef}
            color={AMBIENT_LIGHT_ORIGIN.colorSoft}
            emissive={AMBIENT_LIGHT_ORIGIN.color}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
        <pointLight position={[0, innerCubeY, 0]} color={AMBIENT_LIGHT_ORIGIN.colorSoft} intensity={1.5} distance={2.8} decay={2} />

        <DescendingBeams count={settings.beamCount} active={activeEvent} />
      </group>

      <Plinth />
      <BaseConduits active={activeEvent} />

      {settings.reflectiveGround ? (
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
