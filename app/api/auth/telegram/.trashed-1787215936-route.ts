import { NextRequest, NextResponse } from "next/server";
import {
  verifyTelegramAuth,
  createSessionToken,
  SESSION_COOKIE,
  type TelegramAuthPayload,
} from "@/lib/telegramAuth";

/**
 * POST /api/auth/telegram
 *
 * Riceve i dati inviati dal widget "Login with Telegram" (vedi
 * components/auth/TelegramLoginButton.tsx), li verifica server-side con
 * TELEGRAM_BOT_TOKEN, e imposta un cookie di sessione firmato.
 *
 * Variabili d'ambiente richieste: TELEGRAM_BOT_TOKEN, SESSION_SECRET.
 */
export async function POST(request: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const sessionSecret = process.env.SESSION_SECRET;

  if (!botToken || !sessionSecret) {
    return NextResponse.json(
      { error: "server_misconfigured", detail: "TELEGRAM_BOT_TOKEN o SESSION_SECRET non configurati." },
      { status: 500 }
    );
  }

  let payload: TelegramAuthPayload;
  try {
    payload = (await request.json()) as TelegramAuthPayload;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const result = await verifyTelegramAuth(payload, botToken);
  if (!result.valid) {
    return NextResponse.json({ error: "invalid_auth", reason: result.reason }, { status: 401 });
  }

  const token = await createSessionToken(payload.id, sessionSecret);

  const response = NextResponse.json({
    ok: true,
    user: { id: payload.id, username: payload.username ?? null, firstName: payload.first_name ?? null },
  });

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
