# Trading Sentinel — Landing Page

Stack: Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · React Three Fiber · Cloudflare Workers (OpenNext)

## Avvio locale

```bash
npm install
npm run dev
```

## Script disponibili

```bash
npm run dev            # avvio in sviluppo
npm run build           # build di produzione (next build)
npm run lint             # ESLint
npm run typecheck    # controllo tipi TypeScript (tsc --noEmit)
npm run format          # formatta il progetto con Prettier
npm run format:check  # verifica la formattazione senza scrivere
npm run cf:build       # build trasformata per Cloudflare Workers (OpenNext)
npm run cf:preview    # build + preview locale nel runtime Workers reale
npm run cf:deploy     # build + deploy su Cloudflare (wrangler deploy)
```

## Deploy su Cloudflare

Il progetto usa **`@opennextjs/cloudflare`**, l'adapter ufficialmente
raccomandato da Cloudflare per Next.js (sostituisce `@cloudflare/next-on-pages`,
deprecato). Deploya su Cloudflare **Workers** — non su un progetto legacy
"Pages".

⚠️ **Causa più probabile di un errore "wrangler config non valido per il
deploy configurato"**: nel dashboard Cloudflare esistono ancora due tipi di
progetto distinti sotto l'unica sezione "Workers & Pages" — un vecchio
progetto **Pages** (che si aspetta una chiave `pages_build_output_dir`, non
`main`/`assets`) e un progetto **Workers** (il nostro formato). Se la repo è
già collegata come progetto Pages, `wrangler.jsonc` risulterà sempre
incompatibile qualunque cosa contenga. La soluzione è creare/collegare la
repo come progetto **Workers**, non Pages.

Deploy manuale:

```bash
npm run cf:deploy
```

Deploy automatico via Git: **Workers & Pages → Create → Workers → Import a
repository**, poi imposta un **unico comando di deploy** (non separare Build
e Deploy command in due passaggi):

- Deploy command: `npm run cf:deploy`
- Build command: lascia vuoto/default

⚠️ Non usare `npx wrangler deploy` come deploy command separato da un build
command precedente: è un bug noto e documentato della combinazione
Wrangler↔OpenNext (Wrangler rileva il progetto OpenNext e richiama
internamente `opennextjs-cloudflare deploy` in un contesto che non trova più
la configurazione compilata dal passaggio di build precedente — vedi
[cloudflare/workers-sdk#13134](https://github.com/cloudflare/workers-sdk/issues/13134),
[#11729](https://github.com/cloudflare/workers-sdk/issues/11729),
[opennextjs-cloudflare#1102](https://github.com/opennextjs/opennextjs-cloudflare/issues/1102)).
Eseguire build e deploy come un unico comando (`npm run cf:deploy`) evita il
problema alla radice.

File di configurazione coinvolti: `wrangler.jsonc`, `open-next.config.ts`.
Nessun passaggio manuale successivo al deploy da Git è richiesto.

## Architettura

```
app/                  # App Router — layout, pagine, globals.css
components/
  ui/                 # Componenti di base (Button, Badge, Section, ...)
  layout/             # Navbar, Footer
  sections/            # Sezioni della landing (Hero, ProblemSection, ...) — 04.1
  motion/             # Varianti Framer Motion condivise + RevealOnScroll
  background/         # Ambiente 3D reale (React Three Fiber) — Canvas unico, persistente
constants/             # Dati statici (navigazione, soglie, Controlled Stillness, ...)
hooks/                 # Hook condivisi (useScrolled, useIsDesktop, useControlledStillness, ...)
types/                  # Tipi TypeScript condivisi
lib/                    # Utility (cn, rng seedato, ...)
```

## Stato sviluppo

- [x] Fase 2.5 — Digital Sculpture riscritta come **replica fedele** dell'immagine di riferimento approvata: cubo esterno + cubo interno annidato (stessa orientazione, non ruotato), piedistallo a 3 lastre impilate e sfalsate, 18 fasci verticali densi dall'alto, 4 fasci di condotti curvi alla base (5 filamenti ciascuno + punti sparkle). Sostituisce sia il sistema a nastri sia il Monolite astratto (entrambi abbandonati).

- [x] Fase 2.4 — Digital Sculpture riscritta da zero come **Monolite**: solido geometrico sfaccettato (guscio esterno + nucleo interno annidato), base riflettente, condotti di energia (fasci discendenti + condotti radiali), zero movimento della geometria. Abbandonato definitivamente il sistema a nastri (linea progettuale bocciata: leggeva "organismo/tentacolare" invece di "manufatto tecnologico"). Basato su analisi di un'immagine di riferimento approvata come nuova base artistica del progetto.

- [x] Fase 2.3 — Rifinitura direzione artistica Digital Sculpture: da 4 nastri sottili/irregolari a 3 elementi strutturali in simmetria radiale, larghezza costante (niente più assottigliamento), twist minimo, superficie pulita, deriva più lenta e contenuta, nucleo più grande — massa percepita e controllo, non organismo

- [x] Fase 1 — Setup progetto, design system, componenti base (Button, Badge, Section, StatusIndicator, LogoMark), Navbar
- [x] Fase 1.1 — Refactoring architetturale (constants, types, hooks, components/motion, components/background) + script typecheck/format
- [x] Fase 2 — Hero Section (badge, titolo, sottotitolo, CTA) + ambiente 3D reale secondo la Global Technical Directive: Canvas React Three Fiber persistente, Digital Sculpture procedurale (nastri custom, nucleo emissivo), CameraRig con waypoint + Camera Presence, Controlled Stillness via scheduler seedato, qualità adattiva desktop/tablet/mobile
- [x] Fase 2.1 — Deploy Cloudflare Workers via adapter ufficiale OpenNext (`@opennextjs/cloudflare`), sostituito `@cloudflare/next-on-pages` deprecato
- [x] Fase 2.2 — Allineamento versioni per compatibilità reale: Next.js 16.2.6, React 19, React Three Fiber 9 + drei 10 + postprocessing 3, migrazione `framer-motion` → `motion`
- [ ] Fase 3 — Sezione Problema
- [ ] Fase 4 — Cos'è Trading Sentinel
- [ ] Fase 5 — Come funziona
- [ ] Fase 6 — Vantaggi / Perché Trading Sentinel
- [ ] Fase 7 — Per chi è pensato / Pricing (Basic, Pro, Confronto)
- [ ] Fase 8 — Free Trial / Come acquistare
- [ ] Fase 9 — FAQ
- [ ] Fase 10 — Footer
- [ ] Fase 11 — Pagine legali (Risk Disclosure, Terms of Service, Privacy Policy)
- [ ] Fase 12 — SEO, favicon, Open Graph, rifinitura performance/accessibilità

Documentazione di riferimento vincolante: Fase 00–07 (congelate).
