"use client";

import { ACTIVE_SCULPTURE, type QualityTier } from "@/constants/scene";
import { KeystoneSculpture } from "@/components/background/KeystoneSculpture";
import { CubeSculpture } from "@/components/background/CubeSculpture";

/**
 * DigitalSculpture3D — dispatcher tra le due varianti attualmente in
 * confronto. Cambia `ACTIVE_SCULPTURE` in constants/scene.ts per passare
 * dall'una all'altra.
 */
export function DigitalSculpture3D({ tier }: { tier: QualityTier }) {
  return ACTIVE_SCULPTURE === "cube" ? <CubeSculpture tier={tier} /> : <KeystoneSculpture tier={tier} />;
}
