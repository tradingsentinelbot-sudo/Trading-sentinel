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
 * Seed fisso, nessun Math.random() a runtime. Struttura a famiglie
 * (non distribuzione uniforme): massa centrale + famiglie di lamine
 * diagonali ripetute — vedi generateShardSpecs in crystalFracture.ts.
 */
export const FRACTURE_SEED = 133742;

export const FRACTURE_ENVELOPE = {
  width: 1.0,
  height: 1.3,
  depth: 0.92,
};

/**
 * Struttura a famiglie, non distribuzione uniforme sulla sfera.
 *
 * - CORE: 6 lamine spesse allineate ai 3 assi dell'inviluppo (±X ±Y ±Z) —
 *   la "massa centrale coerente" richiesta. Fisse, sempre presenti,
 *   costo CSG trascurabile (6 operazioni).
 * - LAMINA: famiglie di direzioni diagonali; ogni famiglia genera più
 *   lamine sottili quasi parallele tra loro (piccolo jitter deterministico
 *   attorno alla stessa direzione) — è la ripetizione a produrre il ritmo
 *   visivo della reference, non tante direzioni diverse senza relazione.
 */
export const FRACTURE_CORE_THICKNESS: [number, number] = [0.16, 0.24];

export const FRACTURE_LAMINA_FAMILY_AXES: [number, number, number][] = [
  [1, 1, 0],
  [1, -1, 0],
  [0, 1, 1],
  [0, 1, -1],
  [1, 0, 1],
  [1, 0, -1],
];

export const FRACTURE_LAMINA_PER_FAMILY: Record<QualityTier, number> = {
  desktop: 3,
  tablet: 2,
  mobile: 1,
};

export const FRACTURE_LAMINA_THICKNESS_RANGE: [number, number] = [0.018, 0.05];
export const FRACTURE_LAMINA_OFFSET_RANGE: [number, number] = [0.12, 0.82];
/** Jitter angolare stretto attorno all'asse della famiglia — mantiene le lamine "quasi parallele". */
export const FRACTURE_FAMILY_JITTER = 0.11;

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
