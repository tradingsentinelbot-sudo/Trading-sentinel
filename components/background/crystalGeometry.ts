import * as THREE from "three";

/**
 * buildCrystalGeometry — un poliedro sfaccettato, affusolato verso l'alto
 * (obelisco/monolite), a facce piatte (flat shading: le normali non sono
 * condivise tra i vertici, quindi ogni faccia cattura la luce in modo
 * distinto, con spigoli netti).
 *
 * Parte da un icosaedro (solido geometrico, non un cubo — evita di essere
 * immediatamente "nominabile") e applica una deformazione deterministica:
 * assottigliamento progressivo verso l'alto (taper) e allungamento verticale
 * (stretchY). Il risultato è una forma proprietaria, non un primitivo
 * standard riconoscibile, ma comunque leggibile come solido "costruito".
 */
export function buildCrystalGeometry({
  radius,
  detail = 0,
  stretchY = 1.35,
  taper = 0.7,
}: {
  radius: number;
  detail?: number;
  stretchY?: number;
  taper?: number;
}) {
  const base = new THREE.IcosahedronGeometry(radius, detail);
  const geometry = base.toNonIndexed(); // spigoli netti: nessuna normale condivisa
  const pos = geometry.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const yNorm = (v.y / radius + 1) / 2; // 0 in basso, 1 in alto
    const taperFactor = THREE.MathUtils.lerp(1, taper, yNorm);
    v.x *= taperFactor;
    v.z *= taperFactor;
    v.y *= stretchY;
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}
