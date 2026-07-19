import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripeClient";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/telegramAuth";

/**
 * POST /api/checkout
 * Body: { plan: "basic" | "pro" }
 *
 * Crea una sessione Stripe Checkout e restituisce l'URL a cui reindirizzare
 * l'utente. Richiede una sessione Telegram valida (l'utente deve essere
 * loggato) così l'id Telegram può essere associato al pagamento tramite
 * `client_reference_id` — il webhook lo userà per notificare il backend.
 *
 * Variabili d'ambiente richieste: STRIPE_SECRET_KEY, STRIPE_PRICE_ID_BASIC,
 * STRIPE_PRICE_ID_PRO, NEXT_PUBLIC_SITE_URL, SESSION_SECRET.
 */
export async function POST(request: NextRequest) {
  const sessionSecret = process.env.SESSION_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!sessionSecret || !siteUrl) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = sessionCookie ? await verifySessionToken(sessionCookie, sessionSecret) : null;
  if (!session) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  let body: { plan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const priceId =
    body.plan === "pro" ? process.env.STRIPE_PRICE_ID_PRO : body.plan === "basic" ? process.env.STRIPE_PRICE_ID_BASIC : null;

  if (!priceId) {
    return NextResponse.json({ error: "invalid_plan_or_not_configured" }, { status: 400 });
  }

  try {
    const stripe = getStripeClient();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: String(session.tid),
      metadata: { telegramId: String(session.tid), plan: body.plan ?? "" },
      success_url: `${siteUrl}/account?checkout=success`,
      cancel_url: `${siteUrl}/account?checkout=cancelled`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    return NextResponse.json(
      { error: "stripe_error", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
