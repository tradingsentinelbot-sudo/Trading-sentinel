# Known Issues

## APERTO — File `index.ts` generati nella galleria Android

**Stato**: aperto, non risolto, indagine sospesa su richiesta esplicita.

**Osservazione riportata**: aprendo il sito su dispositivo Android reale,
compaiono ripetutamente file denominati `index.ts` (23 occorrenze
nell'ultima osservazione; in precedenza, con una build diversa, erano
comparsi file video vuoti da 0 secondi) nella galleria/storage del
dispositivo.

**Verificato nel codice** (grep esaustivo su tutto il repository):
- Nessun riferimento a `MediaRecorder`, `captureStream`, `Blob`, `video/`,
  attributi `download`, `toDataURL`.
- Nessun service worker, manifest PWA, o script di generazione file.
- `public/` non conteneva asset sorgente prima dell'intervento di
  hardening (vedi sotto).

**Mitigazione applicata** (senza conferma della causa esatta):
- `public/.assetsignore` — esclude `*.ts`, `*.tsx`, `*.map`, `*.d.ts`
  dagli asset caricati su Cloudflare Workers.
- `scripts/ensure-assetsignore.js` — eseguito dopo ogni `cf:build`,
  copia l'ignore file nell'output e scansiona `.open-next/assets`
  segnalando in console eventuali file sospetti realmente presenti.
- `productionBrowserSourceMaps: false` esplicito in `next.config.js`.

**Non verificato**: non è stato possibile eseguire una build reale in
questo ambiente di sviluppo (nessun accesso di rete) per confermare se le
mitigazioni sopra risolvono il fenomeno.

**Prossimi passi (quando si riprenderà l'indagine)**: controllare l'output
di `scripts/ensure-assetsignore.js` al prossimo deploy; se non segnala
file sospetti, la causa non è nella cartella asset servita da Wrangler e
andrà cercata lato dispositivo/browser (nome esatto dei file, percorso di
salvataggio, riproducibilità su altri siti WebGL).

**Decisione**: sviluppo funzionale prosegue. Bug isolato, non bloccante.
