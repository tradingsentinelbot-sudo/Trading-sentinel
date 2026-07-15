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
 * Il Monolite: un solido geometrico sfaccettato (non un nastro, non un
 * organismo). Presenza monumentale, massa percepita, struttura annidata
 * leggibile — guscio esterno + nucleo interno più piccolo e ruotato,
 * visibile in trasparenza, come richiesto dal riferimento approvato.
 */
export const CRYSTAL = {
  outerRadius: 0.62,
  outerDetail: 0,
  outerStretchY: 1.4,
  outerTaper: 0.68,
  innerRadius: 0.3,
  innerDetail: 0,
  innerStretchY: 1.25,
  innerTaper: 0.6,
  innerRotationY: Math.PI / 5, // ruotato rispetto al guscio esterno: struttura visibile, non identica
};

export const CORE_RADIUS = 0.1;

/**
 * Altezza della base del Monolite rispetto al proprio centro geometrico.
 * L'icosaedro ha vertici a distanza `radius` dal centro; dopo `stretchY`
 * il vertice più basso è a `-radius * stretchY`: è lì che deve poggiare
 * il piano di base, non a metà (altrimenti il piano attraverserebbe il
 * solido invece di sostenerlo).
 */
export const CRYSTAL_GROUND_OFFSET = CRYSTAL.outerRadius * CRYSTAL.outerStretchY;

/**
 * Condotti di energia: linee che si irradiano dalla base sul "pavimento"
 * (infrastruttura, non tentacoli — direzione unica, nessun movimento
 * indipendente) e fasci sottili che scendono dall'alto verso il monolite.
 * Rif. immagine di riferimento approvata.
 */
export const BASE_CONDUITS_COUNT = 6;
export const BASE_CONDUIT_RADIUS = 2.4;
export const DESCENDING_BEAMS_COUNT = 5;
export const DESCENDING_BEAM_HEIGHT = 2.2;
export const DESCENDING_BEAM_SCATTER = 0.34;

export type QualityTier = "desktop" | "tablet" | "mobile";

export const TIER_SETTINGS: Record<
  QualityTier,
  {
    crystalDetail: number;
    dpr: [number, number];
    transmissionMaterial: boolean;
    postProcessing: boolean;
    pointerParallax: boolean;
    reflectiveGround: boolean;
  }
> = {
  desktop: { crystalDetail: 1, dpr: [1, 2], transmissionMaterial: true, postProcessing: true, pointerParallax: true, reflectiveGround: true },
  tablet: { crystalDetail: 0, dpr: [1, 1.5], transmissionMaterial: true, postProcessing: false, pointerParallax: false, reflectiveGround: true },
  mobile: { crystalDetail: 0, dpr: [1, 1.5], transmissionMaterial: false, postProcessing: false, pointerParallax: false, reflectiveGround: false },
};
