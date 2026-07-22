"use client";

import dynamic from "next/dynamic";

/**
 * Import dinamico con ssr:false: il Canvas WebGL non deve mai essere
 * renderizzato lato server. Isolato in un proprio file perché
 * `next/dynamic(..., { ssr:false })` non è consentito dentro un Server
 * Component come app/layout.tsx.
 */
const SceneCanvas = dynamic(
  () => import("@/components/background/SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false }
);

export function SceneCanvasClientOnly() {
  return <SceneCanvas />;
}
