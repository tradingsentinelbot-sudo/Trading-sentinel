import { TELEGRAM_BOT_MANAGER_URL } from "@/constants/config";

/**
 * handleCommercialCTA — punto unico da cui partono tutte le CTA
 * commerciali (Free Trial, Buy Basic, Buy Pro).
 *
 * Se TELEGRAM_BOT_MANAGER_URL è configurato, apre quel link (percorso
 * commerciale definitivo). Finché non lo è, instrada verso il flusso
 * interno già funzionante (/accedi — login Telegram + Stripe) invece di
 * lasciare la CTA inattiva o puntata a un link inventato.
 *
 * Nessuna CTA nel sito deve chiamare router.push("/accedi") o un URL
 * Telegram direttamente: passano tutte da qui, così il giorno in cui
 * arriva il link reale del Bot Manager basta valorizzare la variabile
 * d'ambiente — zero modifiche di codice.
 */
export function resolveCommercialCTA(): { type: "bot-manager" | "internal-fallback"; href: string } {
  if (TELEGRAM_BOT_MANAGER_URL) {
    return { type: "bot-manager", href: TELEGRAM_BOT_MANAGER_URL };
  }
  return { type: "internal-fallback", href: "/accedi" };
}
