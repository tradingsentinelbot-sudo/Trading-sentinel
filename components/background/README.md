# components/background

Ambiente 3D reale del sito. Canvas WebGL persistente, montato una volta in
`app/layout.tsx`.

- `SceneCanvas.tsx` — `<Canvas>`, luci (incluso `hemisphereLight`, luce
  indiretta economica aggiunta per correggere un bug di visibilità dei
  metalli su mobile), fog, Environment, post-processing.
- `CameraRig.tsx` — waypoint di camera + Camera Presence.
- `DigitalSculpture3D.tsx` — **dispatcher** tra le due varianti in
  confronto diretto (`ACTIVE_SCULPTURE` in `constants/scene.ts`):
  - `KeystoneSculpture.tsx` — concept Keystone Compresso (Bible FASE 2B).
  - `CubeSculpture.tsx` — ricostruzione fedele dello screenshot di
    riferimento (cubo annidato, asse dorato, raggi blu, sparkle).
- `heroStillness.ts` — generatore di batch Controlled Stillness.

Nessuna chiamata `Math.random()` a runtime.
