# components/background

Ambiente 3D reale del sito. Canvas WebGL persistente, montato una volta in
`app/layout.tsx`.

- `SceneCanvas.tsx` — `<Canvas>`, luci (incl. hemisphereLight), fog,
  Environment, post-processing.
- `CameraRig.tsx` — waypoint di camera + Camera Presence.
- `DigitalSculpture3D.tsx` — dispatcher tra varianti (`ACTIVE_SCULPTURE`
  in `constants/scene.ts`). Attiva: **fracture**.
  - `FracturedCrystal.tsx` — Approccio A v2 (CSG procedurale, struttura a
    famiglie: massa centrale sugli assi + famiglie di lamine diagonali
    ripetute con jitter stretto). NON verificato visivamente in questo
    ambiente — solo verificato a livello di codice/logica.
  - `crystalFracture.ts` — genera le specifiche delle lamine (seed fisso
    `FRACTURE_SEED`, nessuna distribuzione uniforme sulla sfera).
  - `crystalCSG.ts` — esegue le operazioni booleane (three-bvh-csg), una
    sola volta per tier, mai a runtime.
  - `KeystoneSculpture.tsx`, `CubeSculpture.tsx` — varianti precedenti,
    mantenute per confronto.
- `heroStillness.ts` — generatore di batch Controlled Stillness.

Nessuna chiamata `Math.random()` a runtime.
