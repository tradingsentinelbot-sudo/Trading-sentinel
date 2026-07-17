import * as THREE from "three";
import { mulberry32, randomBetween } from "@/lib/rng";
import {
  FRACTURE_SEED,
  FRACTURE_THICKNESS_RANGE,
  FRACTURE_OFFSET_RANGE,
  FRACTURE_ANGLE_JITTER,
} from "@/constants/scene";

export type ShardSpec = {
  normal: THREE.Vector3;
  offset: number;
  thickness: number;
};

/**
 * Distribuzione a spirale aurea (Fibonacci sphere): punti quasi-equidistanti
 * su una sfera, matematica pura, non casuale. È la base delle "fratture
 * controllate": senza questa distribuzione le normali tenderebbero ad
 * addensarsi in modo irregolare invece di coprire lo spazio con ritmo.
 */
function fibonacciSphere(index: number, total: number): THREE.Vector3 {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (index / (total - 1)) * 2; // da 1 a -1
  const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = goldenAngle * index;
  const x = Math.cos(theta) * radiusAtY;
  const z = Math.sin(theta) * radiusAtY;
  return new THREE.Vector3(x, y, z);
}

/**
 * Genera la lista di lamine per la frattura del cristallo. Chiamata una
 * sola volta (dal chiamante, tipicamente dentro un useMemo con dipendenze
 * vuote) — il seed è fisso, quindi l'output è sempre identico tra le
 * esecuzioni: nessuna variazione a runtime, nessuna chiamata random dopo
 * questa generazione.
 */
export function generateShardSpecs(count: number, envelopeRadius: number): ShardSpec[] {
  const rng = mulberry32(FRACTURE_SEED);
  const specs: ShardSpec[] = [];

  for (let i = 0; i < count; i++) {
    const base = fibonacciSphere(i, count);

    // Jitter angolare controllato: sposta leggermente la normale attorno
    // al punto deterministico della spirale, entro un cono stretto —
    // "controllato", non "casuale": l'ampiezza è la stessa per tutte.
    const jitterAxis = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize();
    const jitterAngle = randomBetween(rng, -FRACTURE_ANGLE_JITTER, FRACTURE_ANGLE_JITTER);
    const normal = base.clone().applyAxisAngle(jitterAxis, jitterAngle).normalize();

    const offsetFrac = randomBetween(rng, FRACTURE_OFFSET_RANGE[0], FRACTURE_OFFSET_RANGE[1]);
    const thickness = randomBetween(rng, FRACTURE_THICKNESS_RANGE[0], FRACTURE_THICKNESS_RANGE[1]);

    specs.push({
      normal,
      offset: offsetFrac * envelopeRadius,
      thickness,
    });
  }

  return specs;
}
