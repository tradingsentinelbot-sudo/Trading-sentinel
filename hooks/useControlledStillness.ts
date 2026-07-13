"use client";

import { useEffect, useRef, useState } from "react";
import { generateStillnessBatch, type StillnessEvent } from "@/components/background/heroStillness";

type StillnessState = {
  activeEvent: StillnessEvent | null;
  reduced: boolean;
};

/**
 * useControlledStillness — pianifica ed espone micro-eventi radi nel tempo.
 *
 * - Il seed viene scelto una sola volta al mount (nessuna chiamata random
 *   durante il render, nessun mismatch di idratazione: lo stato iniziale
 *   lato server e al primo paint client è sempre "quiete").
 * - La coda di eventi è pre-calcolata a batch; a runtime lo scheduler usa
 *   solo setTimeout per consumarla, mai Math.random() per frame.
 * - Rispetta prefers-reduced-motion: nessun evento viene pianificato.
 */
export function useControlledStillness(targetCount: number): StillnessState {
  const [activeEvent, setActiveEvent] = useState<StillnessEvent | null>(null);
  const [reduced, setReduced] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;

    let cancelled = false;
    let queue: StillnessEvent[] = [];
    let idx = 0;
    let batchStart = performance.now();
    let seedCounter = (Date.now() ^ 0x9e3779b9) >>> 0;

    const nextBatch = () => {
      seedCounter = (seedCounter + 2654435761) >>> 0;
      queue = generateStillnessBatch(seedCounter, targetCount, 0);
      idx = 0;
      batchStart = performance.now();
    };

    const scheduleNext = () => {
      if (cancelled) return;
      if (idx >= queue.length) nextBatch();

      const event = queue[idx];
      idx += 1;

      const elapsed = performance.now() - batchStart;
      const delay = Math.max(0, event.atMs - elapsed);

      const startTimeout = setTimeout(() => {
        if (cancelled) return;
        setActiveEvent(event);
        const endTimeout = setTimeout(() => {
          if (cancelled) return;
          setActiveEvent(null);
          scheduleNext();
        }, event.durationMs);
        timeouts.current.push(endTimeout);
      }, delay);

      timeouts.current.push(startTimeout);
    };

    nextBatch();
    scheduleNext();

    return () => {
      cancelled = true;
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, [targetCount]);

  return { activeEvent, reduced };
}
