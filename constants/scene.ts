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
  twist: number; // torsione minima lungo il nastro, radianti totali
  width: number;
  driftAmplitude: number;
  driftSpeed: number;
  seedOffset: number;
};

/**
 * Tre elementi strutturali in simmetria radiale (120° l'uno dall'altro),
 * stessi raggi: leggono come un'unica struttura progettata — un armillario
 * o una turbina — non come nastri indipendenti che si intrecciano a caso.
 * Larghezza sostanziale e costante, torsione minima, movimento lento e
 * di ampiezza contenuta: massa percepita, non nervosismo organico.
 */
export const RIBBONS_3D: RibbonSpec3D[] = [
  { angle: 0, radiusA: 0.86, radiusB: 0.42, twist: Math.PI * 0.18, width: 0.16, driftAmplitude: 0.014, driftSpeed: 0.35, seedOffset: 0 },
  { angle: (Math.PI * 2) / 3, radiusA: 0.86, radiusB: 0.44, twist: Math.PI * 0.22, width: 0.17, driftAmplitude: 0.012, driftSpeed: 0.3, seedOffset: 7.2 },
  { angle: (Math.PI * 4) / 3, radiusA: 0.84, radiusB: 0.4, twist: Math.PI * 0.2, width: 0.165, driftAmplitude: 0.013, driftSpeed: 0.32, seedOffset: 14.9 },
];

export const CORE_RADIUS = 0.15;

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
