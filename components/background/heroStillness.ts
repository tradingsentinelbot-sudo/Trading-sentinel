import { mulberry32, randomBetween, pickIndex } from "@/lib/rng";
import { STILLNESS } from "@/constants/stillness";

export type StillnessEventType = "facet-glow" | "conduit-pulse" | "beam-flicker";

export type StillnessEvent = {
  id: number;
  type: StillnessEventType;
  targetIndex: number; // quale faccia/condotto/fascio è coinvolto
  atMs: number; // istante di inizio, relativo all'avvio dello scheduler
  durationMs: number;
  intensity: number;
};

const EVENT_TYPES: StillnessEventType[] = ["facet-glow", "conduit-pulse", "beam-flicker"];

/**
 * Genera un batch di eventi pianificati in anticipo, a partire da un seed.
 * Nessuna chiamata random viene fatta a runtime dopo questa generazione:
 * lo scheduler consuma solo questa coda pre-calcolata.
 */
export function generateStillnessBatch(
  seed: number,
  targetCount: number,
  startAtMs = 0
): StillnessEvent[] {
  const rng = mulberry32(seed);
  const events: StillnessEvent[] = [];
  let cursor = startAtMs;

  for (let i = 0; i < STILLNESS.batchSize; i++) {
    cursor += randomBetween(rng, STILLNESS.eventGapMs[0], STILLNESS.eventGapMs[1]);
    events.push({
      id: seed + i,
      type: EVENT_TYPES[pickIndex(rng, EVENT_TYPES.length)],
      targetIndex: pickIndex(rng, targetCount),
      atMs: cursor,
      durationMs: randomBetween(rng, STILLNESS.eventDurationMs[0], STILLNESS.eventDurationMs[1]),
      intensity: randomBetween(rng, STILLNESS.intensity[0], STILLNESS.intensity[1]),
    });
  }

  return events;
}
