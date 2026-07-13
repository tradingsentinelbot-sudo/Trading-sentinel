# components/background

Ambiente 3D reale del sito (Global Technical Directive — Rendering &
Experience Architecture). Non più DOM/SVG: un Canvas WebGL persistente,
montato una sola volta in `app/layout.tsx` e condiviso da tutte le sezioni.

- `SceneCanvasClientOnly.tsx` — wrapper `next/dynamic(ssr:false)`.
- `SceneCanvas.tsx` — il `<Canvas>`, luci, fog, Environment, post-processing
  adattivo per tier di qualità.
- `CameraRig.tsx` — waypoint di camera guidati dallo scroll + Camera
  Presence (deriva continua e deterministica).
- `DigitalSculpture3D.tsx` — l'entità proprietaria: nastri procedurali +
  nucleo emissivo che respira, pilotati anche da Controlled Stillness.
- `ribbonGeometry.ts` — geometria custom a nastro (non TubeGeometry).
- `heroStillness.ts` — generatore di batch di micro-eventi, seedato.

Nessun componente rappresenta oggetti reali riconoscibili (vincolo Global
Creative Direction). Nessuna chiamata `Math.random()` a runtime: variazioni
sempre pianificate in batch o generate da funzioni deterministiche del tempo
(`lib/wander.ts`, `lib/rng.ts`).
