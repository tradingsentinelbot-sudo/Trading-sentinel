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

/**
 * Il Cubo: replica fedele della geometria e del contesto dell'immagine di
 * riferimento approvata. Cubo esterno traslucido + cubo interno annidato,
 * stessa orientazione (nessuna rotazione reciproca), nucleo di luce al
 * centro. Poggia su un piedistallo a lastre impilate e leggermente
 * sfalsate.
 */
export const CUBE = {
  outerSize: 0.92,
  innerSize: 0.42,
};

export const CORE_RADIUS = 0.06;

/**
 * Piedistallo: lastre scure impilate, ciascuna leggermente più grande e
 * ruotata rispetto alla successiva, come nel riferimento.
 */
export type PlinthLayer = {
  size: number;
  height: number;
  rotationY: number;
  yOffset: number;
};

export const PLINTH_LAYERS: PlinthLayer[] = [
  { size: 1.9, height: 0.05, rotationY: 0, yOffset: 0 },
  { size: 1.55, height: 0.055, rotationY: 0.07, yOffset: 0.05 },
  { size: 1.25, height: 0.06, rotationY: -0.05, yOffset: 0.105 },
];

/** Altezza totale del piedistallo: qui poggia la base del cubo. */
export const PLINTH_TOP_Y =
  PLINTH_LAYERS.reduce((max, l) => Math.max(max, l.yOffset + l.height), 0);

/**
 * Fasci verticali densi che scendono dall'alto e convergono sulla sommità
 * del cubo — replica del "flusso di dati" del riferimento.
 */
export const DESCENDING_BEAMS_COUNT = 18;
export const DESCENDING_BEAM_HEIGHT = 3.2;
export const DESCENDING_BEAM_SCATTER = 0.5;

/**
 * Condotti alla base: non linee singole, ma fasci di 5 filamenti paralleli
 * con andamento a curva morbida (non radiale rigido), in 4 direzioni come
 * nel riferimento. Ogni fascio porta alcuni punti di luce (sparkle) fissi
 * lungo il percorso.
 */
export const BASE_CONDUIT_DIRECTIONS = 4;
export const BASE_CONDUIT_STRANDS_PER_BUNDLE = 5;
export const BASE_CONDUIT_LENGTH = 3.4;
export const BASE_CONDUIT_SPARKLES_PER_STRAND = 4;

export type QualityTier = "desktop" | "tablet" | "mobile";

export const TIER_SETTINGS: Record<
  QualityTier,
  {
    dpr: [number, number];
    transmissionMaterial: boolean;
    postProcessing: boolean;
    pointerParallax: boolean;
    reflectiveGround: boolean;
    beamCount: number;
  }
> = {
  desktop: { dpr: [1, 2], transmissionMaterial: true, postProcessing: true, pointerParallax: true, reflectiveGround: true, beamCount: DESCENDING_BEAMS_COUNT },
  tablet: { dpr: [1, 1.5], transmissionMaterial: true, postProcessing: false, pointerParallax: false, reflectiveGround: true, beamCount: 12 },
  mobile: { dpr: [1, 1.5], transmissionMaterial: false, postProcessing: false, pointerParallax: false, reflectiveGround: false, beamCount: 8 },
};
