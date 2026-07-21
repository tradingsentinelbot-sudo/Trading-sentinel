"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CameraRig } from "@/components/background/CameraRig";
import { DigitalSculpture3D } from "@/components/background/DigitalSculpture3D";
import { TIER_SETTINGS, type QualityTier } from "@/constants/scene";
import { useDeviceTier } from "@/hooks/useDeviceTier";

/**
 * SceneCanvas — l'unico ambiente 3D persistente del sito (Global Technical
 * Directive, punto 2/11). Montato una sola volta nel layout, dietro a tutta
 * l'interfaccia React tradizionale, che resta interamente leggibile e
 * interattiva sopra di esso (`pointer-events: none` sul wrapper).
 *
 * frameloop="always": Camera Presence richiede una deriva continua, quindi
 * "demand" non porterebbe benefici reali qui — il budget prestazionale è
 * garantito da geometria leggera, dpr limitato e post-processing solo su
 * desktop (vedi TIER_SETTINGS).
 */
export function SceneCanvas() {
  const { tier, reducedMotion, ready } = useDeviceTier();
  const [degraded, setDegraded] = useState(false);

  if (!ready) return null;

  const effectiveTier: QualityTier = degraded && tier === "desktop" ? "tablet" : tier;
  const settings = TIER_SETTINGS[effectiveTier];

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.92]" aria-hidden>
      <Canvas
        frameloop={reducedMotion ? "demand" : "always"}
        dpr={settings.dpr}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 34, position: [0.72, 0.25, 5.4] }}
        onCreated={({ camera }) => {
          camera.layers.enableAll();
        }}
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <color attach="background" args={["#080A0D"]} />
        <fog attach="fog" args={["#080A0D", 4.5, 10]} />

        <ambientLight intensity={0.14} />
        <hemisphereLight args={["#7B8EA8", "#07090D", 0.48]} />
        <directionalLight position={[2, 3, 2]} intensity={1.05} color="#EAEAEA" />
        <directionalLight position={[-2, -1, -1.5]} intensity={0.16} color="#536273" />
        <pointLight position={[0.45, 1.1, 1.7]} intensity={0.58} distance={5.8} color="#D6A84A" />

        {settings.transmissionMaterial && (
          <Environment preset="city" environmentIntensity={0.35} />
        )}

        <Suspense fallback={null}>
          <DigitalSculpture3D tier={effectiveTier} />
        </Suspense>

        <CameraRig pointerParallax={settings.pointerParallax && !reducedMotion} />

        {settings.postProcessing && !reducedMotion && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.9} intensity={0.4} mipmapBlur radius={0.5} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
