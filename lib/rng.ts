/**
 * Piccolo PRNG deterministico (mulberry32).
 * Usato per pianificare in anticipo batch di eventi (Controlled Stillness),
 * mai per generare valori ad ogni frame o ad ogni render.
 */
export function mulberry32(seed: number) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomBetween(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min);
}

export function pickIndex(rng: () => number, length: number) {
  return Math.floor(rng() * length) % length;
}
