/**
 * Verifica e firma della sessione per il login "Telegram Login Widget".
 *
 * Algoritmo di verifica: quello ufficiale documentato da Telegram
 * (https://core.telegram.org/widgets/login#checking-authorization).
 * secret_key = SHA256(bot_token); hash atteso = HMAC-SHA256(data_check_string, secret_key).
 *
 * Nessuna libreria esterna: usa Web Crypto (SubtleCrypto), disponibile sia
 * in Node.js (>=18, incluso il runtime `nodejs_compat` di Cloudflare
 * Workers) sia nativamente nei Workers.
 */

export type TelegramAuthPayload = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

async function sha256(input: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
}

async function hmacSha256Hex(keyBytes: ArrayBuffer, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Verifica l'autenticità dei dati ricevuti dal widget Telegram.
 * Richiede TELEGRAM_BOT_TOKEN nelle variabili d'ambiente.
 */
export async function verifyTelegramAuth(
  payload: TelegramAuthPayload,
  botToken: string,
  maxAgeSeconds = 86400
): Promise<{ valid: boolean; reason?: string }> {
  const { hash, ...rest } = payload;

  const dataCheckString = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${(rest as Record<string, unknown>)[key]}`)
    .join("\n");

  const secretKey = await sha256(botToken);
  const expectedHash = await hmacSha256Hex(secretKey, dataCheckString);

  if (expectedHash !== hash) {
    return { valid: false, reason: "hash_mismatch" };
  }

  const ageSeconds = Math.floor(Date.now() / 1000) - payload.auth_date;
  if (ageSeconds > maxAgeSeconds) {
    return { valid: false, reason: "expired" };
  }

  return { valid: true };
}

/** Nome del cookie di sessione. */
export const SESSION_COOKIE = "ts_session";

/**
 * Firma un token di sessione minimale (id Telegram + scadenza) con HMAC,
 * usando SESSION_SECRET come chiave. Formato: base64(payload).hex(hmac).
 */
export async function createSessionToken(telegramId: number, secret: string, ttlSeconds = 60 * 60 * 24 * 30) {
  const payload = JSON.stringify({ tid: telegramId, exp: Math.floor(Date.now() / 1000) + ttlSeconds });
  const payloadB64 = btoa(payload);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  const sigHex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${payloadB64}.${sigHex}`;
}

export async function verifySessionToken(token: string, secret: string): Promise<{ tid: number } | null> {
  const [payloadB64, sigHex] = token.split(".");
  if (!payloadB64 || !sigHex) return null;

  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  const expectedHex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
  if (expectedHex !== sigHex) return null;

  try {
    const payload = JSON.parse(atob(payloadB64)) as { tid: number; exp: number };
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { tid: payload.tid };
  } catch {
    return null;
  }
}

/**
 * getCurrentSession — helper per i Server Component: legge ed verifica il
 * cookie di sessione. Da chiamare con i cookie di `next/headers`, es.:
 *   const session = await getCurrentSession(cookies().get(SESSION_COOKIE)?.value);
 */
export async function getCurrentSession(cookieValue: string | undefined) {
  const secret = process.env.SESSION_SECRET;
  if (!cookieValue || !secret) return null;
  return verifySessionToken(cookieValue, secret);
}
