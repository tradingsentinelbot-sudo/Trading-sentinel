import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Configurazione dell'adapter OpenNext — approccio ufficiale raccomandato
 * da Cloudflare per Next.js (sostituisce @cloudflare/next-on-pages,
 * deprecato). Trasforma l'output di `next build` in un Worker + asset
 * statici, evitando qualsiasi tentativo di caricare `.next/cache` come
 * asset (causa originaria dei fallimenti di deploy).
 *
 * Configurazione minima: nessuna cache incrementale su KV/R2 richiesta per
 * ora, la landing non usa ISR. Si estenderà qui se in futuro verranno
 * introdotte pagine con revalidazione.
 */
export default defineCloudflareConfig({});
