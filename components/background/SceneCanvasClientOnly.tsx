"use client";

import dynamic from "next/dynamic";

const SceneCanvas2D = dynamic(
  () => import("@/components/background/SceneCanvas2D").then((m) => m.SceneCanvas2D),
  { ssr: false }
);

export function SceneCanvasClientOnly() {
  return <SceneCanvas2D />;
}
