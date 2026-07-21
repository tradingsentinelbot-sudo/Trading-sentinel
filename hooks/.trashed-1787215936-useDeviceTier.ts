"use client";

import { useEffect, useState } from "react";
import type { QualityTier } from "@/constants/scene";

function computeTier(): QualityTier {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (width < 768) return "mobile";
  if (width < 1200 || coarsePointer) return "tablet";
  return "desktop";
}

/**
 * useDeviceTier — determina il livello di qualità della scena 3D e se
 * l'utente richiede motion ridotto. Nessuna geometria/materiale pesante
 * viene istanziato finché questo hook non ha risolto il tier lato client.
 */
export function useDeviceTier() {
  const [tier, setTier] = useState<QualityTier>("desktop");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTier(computeTier());
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReady(true);

    const onResize = () => setTier(computeTier());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { tier, reducedMotion, ready };
}
