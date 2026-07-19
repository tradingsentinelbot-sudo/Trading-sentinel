/**
 * backendClient — punto di integrazione con il backend/bot Telegram
 * esistente (gestione licenze, utenti, abbonamenti).
 *
 * ATTENZIONE — DA COMPLETARE: non conosco il contratto reale di
 * quell'API (URL base, path degli endpoint, formato di autenticazione
 * delle richieste server-to-server, forma esatta delle risposte). I
 * valori sotto sono segnaposto espliciti, non funzionanti — non li
 * presento come implementazione conclusa.
 *
 * Cosa mi serve per completare questo file:
 *   1. URL base dell'API del backend (es. https://api.tuobot.dev)
 *   2. Come si autenticano le richieste server-to-server (API key in
 *      header? bearer token? secret condiviso?)
 *   3. Endpoint per: leggere lo stato licenza di un utente Telegram,
 *      attivare una trial, attivare un abbonamento dopo pagamento Stripe
 *   4. Forma esatta della risposta di ciascun endpoint
 *
 * Fino ad allora, ogni funzione qui sotto lancia un errore esplicito
 * invece di restituire dati finti — per non far sembrare "funzionante"
 * un'integrazione che non lo è.
 */

const BACKEND_BASE_URL = process.env.BACKEND_API_BASE_URL;
const BACKEND_API_KEY = process.env.BACKEND_API_KEY;

class BackendNotConfiguredError extends Error {
  constructor(action: string) {
    super(
      `backendClient.${action}: BACKEND_API_BASE_URL/BACKEND_API_KEY non configurati, oppure il contratto API reale non è stato ancora fornito. Nessuna chiamata è stata effettuata.`
    );
    this.name = "BackendNotConfiguredError";
  }
}

export type LicenseStatus = {
  active: boolean;
  plan: "trial" | "basic" | "pro" | "none";
  expiresAt: string | null;
};

/**
 * Legge lo stato della licenza per un utente Telegram.
 * TODO: sostituire il path/metodo con quello reale del backend.
 */
export async function getLicenseStatus(telegramId: number): Promise<LicenseStatus> {
  if (!BACKEND_BASE_URL || !BACKEND_API_KEY) {
    throw new BackendNotConfiguredError("getLicenseStatus");
  }

  const res = await fetch(`${BACKEND_BASE_URL}/TODO-endpoint-stato-licenza/${telegramId}`, {
    headers: { Authorization: `Bearer ${BACKEND_API_KEY}` },
  });
  if (!res.ok) throw new Error(`backendClient.getLicenseStatus: risposta ${res.status}`);
  return res.json();
}

/**
 * Notifica al backend l'avvio di una trial per un utente Telegram.
 * TODO: sostituire il path/metodo/payload con quello reale del backend.
 */
export async function notifyTrialStarted(telegramId: number): Promise<void> {
  if (!BACKEND_BASE_URL || !BACKEND_API_KEY) {
    throw new BackendNotConfiguredError("notifyTrialStarted");
  }

  const res = await fetch(`${BACKEND_BASE_URL}/TODO-endpoint-avvia-trial`, {
    method: "POST",
    headers: { Authorization: `Bearer ${BACKEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId }),
  });
  if (!res.ok) throw new Error(`backendClient.notifyTrialStarted: risposta ${res.status}`);
}

/**
 * Notifica al backend l'attivazione di un abbonamento dopo pagamento
 * Stripe completato con successo (chiamato dal webhook Stripe).
 * TODO: sostituire il path/metodo/payload con quello reale del backend.
 */
export async function notifySubscriptionActive(params: {
  telegramId: number;
  plan: "basic" | "pro";
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}): Promise<void> {
  if (!BACKEND_BASE_URL || !BACKEND_API_KEY) {
    throw new BackendNotConfiguredError("notifySubscriptionActive");
  }

  const res = await fetch(`${BACKEND_BASE_URL}/TODO-endpoint-attiva-abbonamento`, {
    method: "POST",
    headers: { Authorization: `Bearer ${BACKEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`backendClient.notifySubscriptionActive: risposta ${res.status}`);
}
