import * as THREE from "three";
import { mulberry32, randomBetween } from "@/lib/rng";
import {
  FRACTURE_SEED,
  FRACTURE_CORE_THICKNESS,
  FRACTURE_LAMINA_FAMILY_AXES,
  FRACTURE_LAMINA_THICKNESS_RANGE,
  FRACTURE_LAMINA_OFFSET_RANGE,
  FRACTURE_FAMILY_JITTER,
} from "@/constants/scene";

export type ShardSpec = {
  normal: THREE.Vector3;
  offset: number;
  thickness: number;
  kind: "core" | "lamina";
};

const AXES: THREE.Vector3[] = [
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(0, 0, -1),
];

/**
 * Genera le specifiche di frattura a famiglie (Approccio A):
 *
 * - 6 lamine "core", spesse, allineate ai 3 assi dell'inviluppo — la massa
 *   centrale coerente. Offset piccolo e fisso (vicino al centro): tagliano
 *   via gli angoli dell'inviluppo, non lo attraversano da parte a parte.
 * - Per ogni famiglia diagonale (FRACTURE_LAMINA_FAMILY_AXES), N lamine
 *   sottili con jitter angolare stretto attorno alla stessa direzione:
 *   leggono come pannelli ripetuti quasi paralleli, non come tagli
 *   indipendenti — è la ripetizione a creare il ritmo della reference.
 *
 * Seed fisso: stesso identico risultato ad ogni esecuzione. Chiamata una
 * sola volta dal chiamante (dentro useMemo), mai a runtime per frame.
 */
export function generateShardSpecs(laminaPerFamily: number, envelopeRadius: number): ShardSpec[] {
  const rng = mulberry32(FRACTURE_SEED);
  const specs: ShardSpec[] = [];

  // Massa centrale: 6 lamine spesse sugli assi dell'inviluppo.
  for (const axis of AXES) {
    specs.push({
      normal: axis.clone(),
      offset: envelopeRadius * randomBetween(rng, 0.55, 0.7),
      thickness: randomBetween(rng, FRACTURE_CORE_THICKNESS[0], FRACTURE_CORE_THICKNESS[1]),
      kind: "core",
    });
  }

  // Famiglie di lamine diagonali, ripetute con jitter stretto.
  for (const axisTuple of FRACTURE_LAMINA_FAMILY_AXES) {
    const familyAxis = new THREE.Vector3(...axisTuple).normalize();

    for (let i = 0; i < laminaPerFamily; i++) {
      const jitterAxis = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize();
      const jitterAngle = randomBetween(rng, -FRACTURE_FAMILY_JITTER, FRACTURE_FAMILY_JITTER);
      const normal = familyAxis.clone().applyAxisAngle(jitterAxis, jitterAngle).normalize();

      const offsetFrac = randomBetween(rng, FRACTURE_LAMINA_OFFSET_RANGE[0], FRACTURE_LAMINA_OFFSET_RANGE[1]);
      const thickness = randomBetween(rng, FRACTURE_LAMINA_THICKNESS_RANGE[0], FRACTURE_LAMINA_THICKNESS_RANGE[1]);

      specs.push({
        normal,
        offset: offsetFrac * envelopeRadius,
        thickness,
        kind: "lamina",
      });
    }
  }

  return specs;
}
