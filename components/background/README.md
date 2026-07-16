# components/background

Ambiente 3D reale del sito (Global Technical Directive). Canvas WebGL
persistente, montato una volta in `app/layout.tsx`. Architettura tecnica
congelata come baseline ("build sculpture 3d") — vedi FASE 2B.

- `SceneCanvasClientOnly.tsx` — wrapper `next/dynamic(ssr:false)`. Non toccato.
- `SceneCanvas.tsx` — `<Canvas>`, luci, fog, Environment, post-processing.
  Non toccato in questo step (Materiali).
- `CameraRig.tsx` — waypoint di camera + Camera Presence. Non toccato.
- `DigitalSculpture3D.tsx` — **Digital Sculpture, Step 1 (Materiali)**:
  Keystone Compresso, gerarchia materica secondo la Bible concettuale
  (PVD nero / metallo spazzolato / vetro limitato al taglio / principio
  attivo confinato). Sostituisce l'archetipo Cubo.
- `heroStillness.ts` — generatore di batch Controlled Stillness. Non
  toccato (stessi tipi di evento, wiring nel componente aggiornato solo
  dove necessario dopo la rimozione della vecchia geometria).

Nessuna chiamata `Math.random()` a runtime.
