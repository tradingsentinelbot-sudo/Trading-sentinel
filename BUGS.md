# Known Issues

## APERTO — File generati nella galleria Android (`index.ts`, e ora anche il PNG della Hero)

**Stato**: aperto, non risolto. Indagine proseguita con hardening aggiuntivo, non dichiarato "irriproducibile" — il fenomeno è considerato reale.

**Nuova evidenza (cambia la diagnosi)**: oltre ai file `index.ts` (~23
occorrenze), è comparso in galleria anche il file PNG della Hero
(`hero-artifact.png`) — un asset legittimo e necessario al sito, non un
sorgente esposto per errore. Questo è un dato importante: se un file
`.ts` (mai inteso per essere servito) e un file `.png` (intenzionalmente
servito, correttamente) generano lo stesso comportamento, la causa più
probabile non è "quale file viene servito" ma "come viene gestita/
memorizzata dal dispositivo qualunque risorsa che il sito serve o che il
browser mette in cache" — un meccanismo a monte del tipo di file, non
specifico al nostro codice sorgente.

**Verificato** (grep esaustivo, invariato dal giro precedente): nessun
riferimento a `MediaRecorder`, `captureStream`, `Blob`, `download`,
`toDataURL` nel codice applicativo; nessun service worker/manifest;
`public/` conteneva solo asset legittimi (immagine Hero, `.assetsignore`).

**Modificato in questo giro** (hardening aggiuntivo, indipendente dalla
causa esatta):
- `public/_headers` — impone `Content-Disposition: inline` e
  `X-Content-Type-Options: nosniff` su tutti gli asset statici serviti da
  Cloudflare Workers. Confermato dalla documentazione ufficiale Cloudflare
  che `_headers` si applica alle risposte servite direttamente dagli
  asset statici (il nostro caso, essendo `hero-artifact.png` un file
  reale in `public/`) e non alle risposte generate dal Worker/SSR — quindi
  è applicabile qui.
- Restano attivi `public/.assetsignore`, `scripts/ensure-assetsignore.js`,
  `productionBrowserSourceMaps: false` (giro precedente).

**Non verificabile da questo ambiente**: non è possibile eseguire una
build/deploy reale né osservare il comportamento di un browser Android
reale da qui. Non posso confermare se l'hardening risolve il fenomeno.

**Decisione**: sviluppo funzionale prosegue, come da istruzione esplicita.
Bug isolato, non bloccante, hardening applicato ai punti verificabili dal
codice.

