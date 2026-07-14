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

Deploy automatico via Git (consigliato): **Workers & Pages → Create →
Workers → Import a repository** (non "Pages → Connect to Git") e imposta:

- Build command: `npm run cf:build`
- Deploy command: `npx wrangler deploy`

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
