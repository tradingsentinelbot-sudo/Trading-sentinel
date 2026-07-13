/**
 * wander — deriva deterministica e continua, funzione pura del tempo.
 *
 * Non usa Math.random(): somma alcune sinusoidi con rapporti di frequenza
 * "incommensurabili" (senza fattori comuni evidenti). Il risultato non è
 * mai realmente periodico su una scala percepibile dall'utente, ma è
 * completamente deterministico e a costo computazionale trascurabile.
 *
 * Usato per Camera Presence (Global Technical Directive) e per le
 * micro-variazioni ambientali della Digital Sculpture.
 */
export function wander(t: number, seedOffset = 0, amplitude = 1): number {
  const a = Math.sin(t * 0.0537 + seedOffset * 1.7);
  const b = Math.sin(t * 0.0219 + seedOffset * 3.1) * 0.6;
  const c = Math.sin(t * 0.0913 + seedOffset * 5.3) * 0.35;
  return ((a + b + c) / 1.95) * amplitude;
}

/**
 * wander3 — variante a tre assi indipendenti (offset di seed diversi per asse).
 */
export function wander3(t: number, seedOffset = 0, amplitude = 1) {
  return {
    x: wander(t, seedOffset, amplitude),
    y: wander(t, seedOffset + 11.3, amplitude),
    z: wander(t, seedOffset + 23.7, amplitude),
  };
}
