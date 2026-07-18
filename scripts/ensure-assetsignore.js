// Script eseguito dopo `opennextjs-cloudflare build`.
//
// Fa due cose, entrambe verificabili nel log della build:
//
// 1. Copia public/.assetsignore dentro .open-next/assets, così Wrangler
//    non carica MAI sorgenti .ts/.map come asset statici — indipendente
//    dal fatto che si sia individuata la causa esatta del bug segnalato.
//
// 2. Scansiona .open-next/assets alla ricerca di file .ts/.tsx/.map/.d.ts
//    REALMENTE presenti nell'output di build e li stampa in console.
//    Se questo script stampa dei file, è la prova diretta (non
//    un'ipotesi) di quali sorgenti finiscono nella cartella servita da
//    Wrangler e da dove provengono — la causa cercata da giorni.

const fs = require("fs");
const path = require("path");

const ASSETS_DIR = path.join(process.cwd(), ".open-next", "assets");
const SOURCE_IGNORE = path.join(process.cwd(), "public", ".assetsignore");
const TARGET_IGNORE = path.join(ASSETS_DIR, ".assetsignore");

const SUSPECT_EXTENSIONS = [".ts", ".tsx", ".map", ".d.ts"];

function copyAssetsIgnore() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.warn(`[ensure-assetsignore] ATTENZIONE: ${ASSETS_DIR} non esiste. La build di OpenNext potrebbe aver fallito prima di questo step.`);
    return;
  }
  if (!fs.existsSync(SOURCE_IGNORE)) {
    console.warn(`[ensure-assetsignore] ATTENZIONE: ${SOURCE_IGNORE} non trovato, nulla da copiare.`);
    return;
  }
  fs.copyFileSync(SOURCE_IGNORE, TARGET_IGNORE);
  console.log(`[ensure-assetsignore] .assetsignore copiato in ${TARGET_IGNORE}`);
}

function scanForSuspectFiles(dir, found = []) {
  if (!fs.existsSync(dir)) return found;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanForSuspectFiles(full, found);
    } else if (SUSPECT_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      found.push(full);
    }
  }
  return found;
}

copyAssetsIgnore();

const suspects = scanForSuspectFiles(ASSETS_DIR);
if (suspects.length > 0) {
  console.warn(
    `[ensure-assetsignore] TROVATI ${suspects.length} file sorgente/sourcemap dentro ${ASSETS_DIR} (bloccati da .assetsignore, ma la loro presenza è la causa reale da segnalare):`
  );
  suspects.forEach((f) => console.warn(`  - ${f}`));
} else {
  console.log("[ensure-assetsignore] Nessun file .ts/.tsx/.map/.d.ts trovato dentro .open-next/assets.");
}
