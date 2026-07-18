import * as THREE from "three";
import { Brush, Evaluator, INTERSECTION } from "three-bvh-csg";
import type { ShardSpec } from "@/components/background/crystalFracture";

/**
 * buildFracturedShards — per ogni lamina, costruisce una lastra orientata
 * lungo la sua normale e la interseca (CSG) con l'inviluppo del cristallo.
 * Il risultato è un frammento reale con spessore vero, mai una superficie
 * infinita: è l'intersezione con l'inviluppo a garantire che la silhouette
 * complessiva resti leggibile (nessuna lamina esce dal volume principale).
 *
 * Costo: operazioni CSG reali, quindi va chiamata una sola volta (il
 * chiamante la invoca dentro un useMemo con dipendenze vuote) — mai per
 * frame, mai in useFrame.
 */
export type FracturedShard = {
  geometry: THREE.BufferGeometry;
  kind: ShardSpec["kind"];
};

export function buildFracturedShards(
  shards: ShardSpec[],
  envelope: { width: number; height: number; depth: number }
): FracturedShard[] {
  const envelopeBrush = new Brush(new THREE.BoxGeometry(envelope.width, envelope.height, envelope.depth));
  envelopeBrush.updateMatrixWorld();

  const evaluator = new Evaluator();
  evaluator.attributes = ["position", "normal"];

  const slabSpan = Math.max(envelope.width, envelope.height, envelope.depth) * 3;
  const upAxis = new THREE.Vector3(0, 0, 1);
  const results: FracturedShard[] = [];

  for (const shard of shards) {
    const slabGeometry = new THREE.BoxGeometry(slabSpan, slabSpan, shard.thickness);
    const slabBrush = new Brush(slabGeometry);

    const quaternion = new THREE.Quaternion().setFromUnitVectors(upAxis, shard.normal);
    slabBrush.quaternion.copy(quaternion);
    slabBrush.position.copy(shard.normal.clone().multiplyScalar(shard.offset));
    slabBrush.updateMatrixWorld();

    const result = evaluator.evaluate(slabBrush, envelopeBrush, INTERSECTION);
    if (result.geometry.attributes.position && result.geometry.attributes.position.count > 0) {
      result.geometry.computeVertexNormals();
      results.push({ geometry: result.geometry, kind: shard.kind });
    }

    slabGeometry.dispose();
  }

  return results;
}
