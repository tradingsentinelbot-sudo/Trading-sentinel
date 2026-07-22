"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerformanceMonitor } from "@react-three/drei";
import { CameraRig } from "@/components/background/CameraRig";
import { DigitalSculpture3D } from "@/components/background/DigitalSculpture3D";
import { TIER_SETTINGS, type QualityTier } from "@/constants/scene";
import { useDeviceTier } from "@/hooks/useDeviceTier";

export function SceneCanvas() {
  const { tier, reducedMotion, ready } = useDeviceTier();
  const [degraded, setDegraded] = useState(false);

  if (!ready) return null;

  const effectiveTier: QualityTier = degraded && tier === "desktop" ? "tablet" : tier;
  const settings = TIER_SETTINGS[effectiveTier];

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.96]" aria-hidden>
      <Canvas
        frameloop={reducedMotion ? "demand" : "always"}
        dpr={settings.dpr}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 34, position: [0.72, 0.25, 5.4] }}
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <color attach="background" args={["#0A0D11"]} />
        <fog attach="fog" args={["#0A0D11", 7.5, 19]} />

        <ambientLight intensity={0.28} />
        <hemisphereLight args={["#65788A", "#080A0D", 0.42]} />
        <directionalLight position={[3.5, 5, 3]} intensity={1.35} color="#EAEAEA" />
        <directionalLight position={[-4, 1, -3]} intensity={0.28} color="#2A3442" />
        <pointLight position={[0.1, 1.3, 1.7]} intensity={0.42} distance={5.5} color="#DAA017" />

        {settings.transmissionMaterial && <Environment preset="city" environmentIntensity={0.48} />}

        <Suspense fallback={null}>
          <DigitalSculpture3D tier={effectiveTier} />
        </Suspense>

        <CameraRig pointerParallax={settings.pointerParallax && !reducedMotion} />
      </Canvas>
    </div>
  );
}
