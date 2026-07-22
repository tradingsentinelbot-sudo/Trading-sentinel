"use client";

import { ACTIVE_SCULPTURE, type QualityTier } from "@/constants/scene";
import { KeystoneSculpture } from "@/components/background/KeystoneSculpture";
import { CubeSculpture } from "@/components/background/CubeSculpture";
import { FracturedCrystal } from "@/components/background/FracturedCrystal";

/**
 * DigitalSculpture3D — dispatcher tra le varianti attualmente in
 * confronto. Cambia `ACTIVE_SCULPTURE` in constants/scene.ts per passare
 * dall'una all'altra. Attiva: "fracture" (Approccio A, CSG procedurale).
 */
export function DigitalSculpture3D({ tier }: { tier: QualityTier }) {
  if (ACTIVE_SCULPTURE === "fracture") return <FracturedCrystal tier={tier} />;
  return ACTIVE_SCULPTURE === "cube" ? <CubeSculpture tier={tier} /> : <KeystoneSculpture tier={tier} />;
}
