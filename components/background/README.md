# components/background

Ambiente 3D reale del sito. Canvas WebGL persistente, montato una volta in
`app/layout.tsx`.

- `SceneCanvas.tsx` — `<Canvas>`, luci (incl. hemisphereLight), fog,
  Environment, post-processing.
- `CameraRig.tsx` — waypoint di camera + Camera Presence.
- `DigitalSculpture3D.tsx` — dispatcher tra varianti (`ACTIVE_SCULPTURE`
  in `constants/scene.ts`). Attiva: **fracture**.
  - `FracturedCrystal.tsx` — Approccio A (CSG procedurale, approvato):
    massa unica composta da lamine reali, ottenute intersecando lastre
    orientate deterministicamente con l'inviluppo del cristallo.
  - `crystalFracture.ts` — genera le specifiche delle lamine (spirale
    aurea + jitter seedato, seed fisso `FRACTURE_SEED`).
  - `crystalCSG.ts` — esegue le operazioni booleane (three-bvh-csg),
    una sola volta per tier, mai a runtime.
  - `KeystoneSculpture.tsx`, `CubeSculpture.tsx` — varianti precedenti,
    mantenute per confronto.
- `heroStillness.ts` — generatore di batch Controlled Stillness.

Nessuna chiamata `Math.random()` a runtime.
