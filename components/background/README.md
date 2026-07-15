# components/background

Ambiente 3D reale del sito (Global Technical Directive — Rendering &
Experience Architecture). Un Canvas WebGL persistente, montato una sola
volta in `app/layout.tsx`.

- `SceneCanvasClientOnly.tsx` — wrapper `next/dynamic(ssr:false)`.
- `SceneCanvas.tsx` — il `<Canvas>`, luci, fog, Environment, post-processing
  adattivo per tier di qualità.
- `CameraRig.tsx` — waypoint di camera guidati dallo scroll + Camera
  Presence (deriva continua e deterministica). Approvato, non toccare
  senza richiesta esplicita.
- `DigitalSculpture3D.tsx` — il Monolite: solido sfaccettato (guscio
  esterno + nucleo interno annidato), base riflettente, condotti di
  energia. Sostituisce definitivamente il precedente sistema a nastri
  (linea progettuale abbandonata — comunicava "organismo", non "manufatto
  tecnologico").
- `crystalGeometry.ts` — geometria proprietaria del Monolite (icosaedro
  affusolato, spigoli netti, non un primitivo riconoscibile).
- `heroStillness.ts` — generatore di batch di micro-eventi (facce che si
  illuminano, condotti/fasci che pulsano), seedato.

Nessuna chiamata `Math.random()` a runtime: variazioni sempre pianificate
in batch o generate da funzioni deterministiche del tempo
(`lib/wander.ts`, `lib/rng.ts`).
