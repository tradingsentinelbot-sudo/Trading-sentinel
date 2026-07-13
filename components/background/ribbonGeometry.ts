import * as THREE from "three";

/**
 * buildRibbonGeometry — costruisce una superficie a nastro (non un tubo).
 *
 * Il percorso centrale è una curva tipo Lissajous su un piano inclinato.
 * A differenza di una TubeGeometry (sezione circolare costante), qui si
 * genera una striscia a sezione rettangolare la cui larghezza varia lungo
 * il percorso e che ruota progressivamente attorno al proprio asse (twist),
 * così la superficie si "attorciglia" nello spazio invece di sembrare un
 * condotto. Una micro-irregolarità deterministica (somma di seni, non
 * rumore casuale) viene applicata ai vertici per evitare una superficie
 * troppo perfetta.
 */
export function buildRibbonGeometry(params: {
  radiusA: number;
  radiusB: number;
  angle: number;
  twist: number;
  width: number;
  segments: number;
  seedOffset: number;
}) {
  const { radiusA, radiusB, angle, twist, width, segments, seedOffset } = params;

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const tilt = new THREE.Matrix4().makeRotationZ(angle);

  const centerAt = (u: number) => {
    // Lissajous su un piano, poi inclinato di `angle` attorno a Z.
    const theta = u * Math.PI * 2;
    const x = Math.cos(theta * 1) * radiusA;
    const y = Math.sin(theta * 2 + seedOffset) * radiusB * 0.5;
    const z = Math.sin(theta * 1) * radiusA * 0.55;
    const v = new THREE.Vector3(x, y, z).applyMatrix4(tilt);
    return v;
  };

  const microDisplace = (u: number) => {
    // Irregolarità deterministica, non rumore casuale.
    return (
      Math.sin(u * 37 + seedOffset * 3) * 0.006 +
      Math.sin(u * 71 + seedOffset * 5) * 0.003
    );
  };

  const widthAt = (u: number) => {
    // La larghezza respira lievemente lungo il percorso.
    return width * (0.7 + 0.3 * Math.sin(u * Math.PI * 4 + seedOffset));
  };

  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const p0 = centerAt(u);
    const p1 = centerAt((u + 0.001) % 1);
    const tangent = p1.clone().sub(p0).normalize();

    // Frame di Frenet semplificato: up di riferimento + twist progressivo.
    const twistAngle = u * twist;
    const refUp = new THREE.Vector3(0, 1, 0);
    let side = new THREE.Vector3().crossVectors(tangent, refUp);
    if (side.lengthSq() < 1e-6) side = new THREE.Vector3(1, 0, 0);
    side.normalize();
    let up = new THREE.Vector3().crossVectors(side, tangent).normalize();

    // Applica il twist ruotando side/up attorno a tangent.
    const twistQuat = new THREE.Quaternion().setFromAxisAngle(tangent, twistAngle);
    side.applyQuaternion(twistQuat);
    up.applyQuaternion(twistQuat);

    const w = widthAt(u) / 2;
    const disp = microDisplace(u);

    const left = p0.clone().addScaledVector(side, -w).addScaledVector(up, disp);
    const right = p0.clone().addScaledVector(side, w).addScaledVector(up, disp);

    positions.push(left.x, left.y, left.z);
    positions.push(right.x, right.y, right.z);

    normals.push(up.x, up.y, up.z);
    normals.push(up.x, up.y, up.z);

    uvs.push(0, u);
    uvs.push(1, u);

    if (i < segments) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = i * 2 + 2;
      const d = i * 2 + 3;
      indices.push(a, b, c, b, d, c);
      // faccia posteriore per evitare "trasparenza" da un solo lato
      indices.push(c, b, a, c, d, b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}
