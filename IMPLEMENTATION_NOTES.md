# Trading Sentinel — Implementation Notes

## Correzione build

L'errore di prerendering era causato da componenti Server che importavano e renderizzavano `motion/react` direttamente. `Solution.tsx` e `HowItWorks.tsx` sono stati marcati come Client Components, mantenendo `app/page.tsx` come Server Component.

## Direzione visuale implementata

- Canvas React Three Fiber persistente dietro il DOM.
- Hero senza immagine artefatto in una colonna separata.
- Visual 3D trattato come ambiente della pagina, non come card/immagine sotto il testo.
- Baseline cubo di vetro controllata da `ACTIVE_SCULPTURE`.
- Palette coerente con Obsidian / Graphite / Soft White / Sentinel Blue / Metallic Silver / accenti oro limitati.
- CTA primaria con gradiente blu e CTA secondaria con superficie traslucida e bordo silver.
- Overlay di contrasto locale nella Hero per preservare leggibilità senza nascondere l'ambiente.

## Integrazione futura

Le CTA commerciali passano da `lib/commercialCta.ts`. Quando sarà disponibile il link reale del Telegram Bot Manager, valorizzare `NEXT_PUBLIC_TELEGRAM_BOT_MANAGER_URL`.


## Premium direction update
- Mobile navigation actions are explicit buttons to guarantee section navigation and menu closure.
- Active sculpture is now Keystone Compresso, replacing the previous cube variant.
- Primary CTA no longer uses the previous blue metallic gradient; palette is neutral soft-white / metallic silver with restrained gold accents.
