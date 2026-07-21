/**
 * Controlled Stillness — parametri condivisi.
 * Il silenzio è lo stato normale, l'evento è l'eccezione.
 * Nessun valore qui è pensato per animazioni continue riconoscibili:
 * definiscono solo i limiti entro cui lo scheduler pianifica eventi radi.
 * Rif. Global Creative Direction — sezione Controlled Stillness.
 */
export const STILLNESS = {
  // Intervallo (ms) tra un micro-evento e il successivo, per elemento.
  eventGapMs: [4200, 11000] as [number, number],
  // Durata (ms) di un singolo micro-evento (transizione + rientro in quiete).
  eventDurationMs: [900, 1800] as [number, number],
  // Intensità (0..1) dell'evento: quanto si discosta dallo stato di quiete.
  intensity: [0.15, 0.4] as [number, number],
  // Numero di eventi pre-pianificati per batch (evita rigenerazioni frequenti).
  batchSize: 10,
  // Periodo del respiro del nucleo (ms) — unica animazione continua.
  corePeriodMs: [13000, 18000] as [number, number],
};

/**
 * Origine luce ambientale della Hero: punto di riferimento cromatico che le
 * sezioni successive erediteranno (in forma più discreta) per dare
 * continuità allo spazio, come richiesto dalla Global Creative Direction.
 */
export const AMBIENT_LIGHT_ORIGIN = {
  color: "#D6A84A",
  colorSoft: "#E5C477",
};
