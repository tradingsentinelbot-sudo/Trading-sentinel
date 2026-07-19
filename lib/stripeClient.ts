import Stripe from "stripe";

/**
 * Client Stripe condiviso. Usa createFetchHttpClient(): il client HTTP di
 * default di Stripe si basa su moduli Node (`http`/`https`) non presenti
 * nel runtime dei Cloudflare Workers; la variante fetch-based è quella
 * ufficialmente supportata da Stripe per ambienti edge/Workers.
 *
 * Nessun `apiVersion` fissato esplicitamente: si usa il default della
 * versione della SDK installata (vedi package.json) — evita di pinnare
 * una stringa di versione API che potrebbe disallinearsi dalla SDK reale.
 */
export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY non configurata.");
  }
  return new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });
}
