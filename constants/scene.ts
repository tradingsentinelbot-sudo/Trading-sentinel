/**
 * Parametri della scena realtime (Global Technical Directive).
 * Un solo Canvas persistente: ogni sezione futura aggiungerà qui il proprio
 * waypoint di camera, mai un nuovo Canvas.
 */

export type CameraWaypoint = {
  id: string;
  /** Progresso di scroll (0..1 sull'intera pagina) a cui il waypoint è "raggiunto". */
  scrollAt: number;
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
};

export const CAMERA_WAYPOINTS: CameraWaypoint[] = [
  {
    id: "hero",
    scrollAt: 0,
    position: [0.6, 0.35, 5.2],
    lookAt: [0.35, 0, 0],
    fov: 32,
  },
  {
    id: "hero-exit",
    scrollAt: 0.16,
    position: [0.2, -0.1, 6.6],
    lookAt: [0.15, -0.15, 0],
    fov: 34,
  },
];

/** Ampiezza di Camera Presence — spostamenti minimi, mai un'orbita. */
export const CAMERA_PRESENCE = {
  positionAmplitude: 0.035,
  lookAtAmplitude: 0.02,
};

/** Posizione mondo della Digital Sculpture (fissa: è la camera a muoversi). */
export const SCULPTURE_WORLD_POSITION: [number, number, number] = [0.55, 0, 0];

export type RibbonSpec3D = {
  angle: number; // inclinazione del piano dell'orbita, radianti
  radiusA: number;
  radiusB: number;
  twist: number; // avvolgimento lungo il nastro, radianti totali
  width: number;
  driftAmplitude: number;
  seedOffset: number;
};

export const RIBBONS_3D: RibbonSpec3D[] = [
  { angle: 0.21, radiusA: 0.85, radiusB: 0.4, twist: Math.PI * 1.4, width: 0.05, driftAmplitude: 0.05, seedOffset: 0 },
  { angle: 1.15, radiusA: 0.78, radiusB: 0.52, twist: Math.PI * 1.1, width: 0.045, driftAmplitude: 0.045, seedOffset: 7.2 },
  { angle: 2.05, radiusA: 0.9, radiusB: 0.34, twist: Math.PI * 1.65, width: 0.04, driftAmplitude: 0.06, seedOffset: 14.9 },
  { angle: 2.75, radiusA: 0.72, radiusB: 0.48, twist: Math.PI * 0.9, width: 0.048, driftAmplitude: 0.04, seedOffset: 21.4 },
];

export const CORE_RADIUS = 0.09;

export type QualityTier = "desktop" | "tablet" | "mobile";

export const TIER_SETTINGS: Record<
  QualityTier,
  {
    ribbonSegments: number;
    dpr: [number, number];
    transmissionMaterial: boolean;
    postProcessing: boolean;
    pointerParallax: boolean;
  }
> = {
  desktop: { ribbonSegments: 160, dpr: [1, 2], transmissionMaterial: true, postProcessing: true, pointerParallax: true },
  tablet: { ribbonSegments: 96, dpr: [1, 1.5], transmissionMaterial: true, postProcessing: false, pointerParallax: false },
  mobile: { ribbonSegments: 56, dpr: [1, 1.5], transmissionMaterial: false, postProcessing: false, pointerParallax: false },
};
