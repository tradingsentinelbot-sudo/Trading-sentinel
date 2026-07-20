/**
 * Configurazione centralizzata del percorso commerciale.
 *
 * Logica prevista: Utente interessato → CTA → Telegram Bot Manager.
 * Il Bot Manager è un progetto separato, non ancora pronto — NESSUN link
 * viene inventato qui.
 *
 * TELEGRAM_BOT_MANAGER_URL resta `null` finché non viene fornito il link
 * reale (tramite la variabile d'ambiente NEXT_PUBLIC_TELEGRAM_BOT_MANAGER_URL).
 * Quando verrà fornito: si imposta quella variabile d'ambiente e tutte le
 * CTA commerciali iniziano automaticamente a puntare lì — zero modifiche
 * di codice necessarie.
 *
 * Comportamento nel frattempo (vedi handleCommercialCTA in
 * lib/commercialCta.ts): le CTA restano pienamente funzionanti, instradate
 * verso il flusso Telegram-login + Stripe già costruito su questo sito
 * (/accedi), così nessuna CTA è "rotta" o punta a un link fittizio.
 */
export const TELEGRAM_BOT_MANAGER_URL: string | null =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_MANAGER_URL || null;
