# components/background

Ambiente 3D reale del sito (Global Technical Directive). Canvas WebGL
persistente, montato una volta in `app/layout.tsx`.

- `SceneCanvasClientOnly.tsx` — wrapper `next/dynamic(ssr:false)`.
- `SceneCanvas.tsx` — `<Canvas>`, luci, fog, Environment, post-processing
  per tier.
- `CameraRig.tsx` — waypoint di camera + Camera Presence. Approvato, non
  toccare senza richiesta esplicita.
- `DigitalSculpture3D.tsx` — replica fedele dell'immagine di riferimento
  approvata: cubo esterno + cubo interno annidato (stessa orientazione),
  piedistallo a lastre impilate e sfalsate, fasci verticali densi dall'alto,
  4 fasci di condotti curvi alla base (ciascuno 5 filamenti + sparkle
  lungo il percorso). Sostituisce sia il precedente sistema a nastri sia
  il Monolite sfaccettato astratto (entrambe linee progettuali abbandonate).
- `heroStillness.ts` — generatore di batch di micro-eventi (facce che si
  illuminano, fasci di condotti/raggi che pulsano), seedato.

Nessuna chiamata `Math.random()` a runtime: variazioni sempre pianificate
in batch o generate da funzioni deterministiche del tempo
(`lib/wander.ts`, `lib/rng.ts`).
