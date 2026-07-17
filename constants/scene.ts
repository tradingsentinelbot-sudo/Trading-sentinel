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
 * Keystone Compresso — masse rettilinee compresse verso un asse centrale,
 * base continua con la massa principale (nessuna giunzione visibile tra
 * "artefatto" e "piedistallo": sono la stessa entità). Rif. Bible
 * concettuale approvata (FASE 2B).
 *
 * Ogni massa è divisa in due metà lungo X, separate da CUT_GAP: è lì che
 * passa l'unico vuoto controllato dell'artefatto.
 *
 * Le proporzioni esatte (compressione, rastremazione) sono un primo
 * assestamento: la taratura fine di composizione/scala è materia dello
 * step "Composizione", non di questo step.
 */
export type MassSpec = {
  width: number;
  height: number;
  depth: number;
  yBase: number;
  material: "pvd" | "brushed";
  brushDirection?: number; // radianti, direzione della spazzolatura (solo "brushed")
};

export const KEYSTONE_MASSES: MassSpec[] = [
  { width: 1.3, height: 0.36, depth: 1.05, yBase: 0, material: "pvd" },
  { width: 0.95, height: 0.4, depth: 0.8, yBase: 0.36, material: "brushed", brushDirection: 0 },
  { width: 0.64, height: 0.42, depth: 0.56, yBase: 0.76, material: "brushed", brushDirection: Math.PI / 2 },
];

export const KEYSTONE_TOTAL_HEIGHT = KEYSTONE_MASSES.reduce(
  (h, m) => Math.max(h, m.yBase + m.height),
  0
);

/** Larghezza del vuoto controllato che attraversa le masse. */
export const CUT_GAP = 0.055;

/**
 * Il principio attivo (emissione interna): una regione concentrata al
 * centro del taglio, non l'intera sua estensione — un nucleo, non una
 * superficie che si illumina per intero.
 */
export const CORE_HEIGHT_RATIO = 0.42; // percentuale dell'altezza totale del taglio
export const CORE_RADIUS = 0.05;

export type QualityTier = "desktop" | "tablet" | "mobile";

/**
 * Frattura procedurale del cristallo (Approccio A, approvato).
 * Seed fisso, nessun Math.random() a runtime: la lista di lamine viene
 * generata una sola volta da una distribuzione deterministica (spirale
 * aurea per le normali + jitter seedato entro limiti stretti) e poi
 * tagliata via CSG dentro l'inviluppo — mai ricalcolata per frame.
 */
export const FRACTURE_SEED = 133742;

export const FRACTURE_ENVELOPE = {
  width: 1.05,
  height: 1.25,
  depth: 0.95,
};

/** Numero di lamine per tier — meno lamine = meno operazioni CSG (costose in build, mai a runtime). */
export const FRACTURE_SHARD_COUNT: Record<QualityTier, number> = {
  desktop: 26,
  tablet: 18,
  mobile: 12,
};

export const FRACTURE_THICKNESS_RANGE: [number, number] = [0.05, 0.15];
/** Distanza delle lamine dal centro, come frazione del raggio dell'inviluppo. */
export const FRACTURE_OFFSET_RANGE: [number, number] = [0.08, 0.85];
/** Jitter angolare massimo applicato alla normale deterministica (radianti). */
export const FRACTURE_ANGLE_JITTER = 0.35;

/**
 * Toggle temporaneo per confrontare direttamente le due varianti della
 * Digital Sculpture in build reale. "cube" = ricostruzione fedele dello
 * screenshot di riferimento; "keystone" = concept Keystone Compresso.
 */
export type SculptureVariant = "keystone" | "cube" | "fracture";
export const ACTIVE_SCULPTURE: SculptureVariant = "fracture";

export const TIER_SETTINGS: Record<
  QualityTier,
  {
    dpr: [number, number];
    transmissionMaterial: boolean;
    postProcessing: boolean;
    pointerParallax: boolean;
  }
> = {
  desktop: { dpr: [1, 2], transmissionMaterial: true, postProcessing: true, pointerParallax: true },
  tablet: { dpr: [1, 1.5], transmissionMaterial: true, postProcessing: false, pointerParallax: false },
  mobile: { dpr: [1, 1.5], transmissionMaterial: false, postProcessing: false, pointerParallax: false },
};
