import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripeClient";
import { notifySubscriptionActive } from "@/lib/backendClient";

/**
 * POST /api/webhook/stripe
 *
 * Riceve gli eventi Stripe (in particolare `checkout.session.completed`).
 * Verifica la firma con SubtleCrypto (compatibile col runtime Cloudflare
 * Workers, non richiede il modulo Node `crypto`).
 *
 * Variabili d'ambiente richieste: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET.
 *
 * ATTENZIONE: la notifica al backend esistente (notifySubscriptionActive)
 * non è ancora collegata a un endpoint reale — vedi lib/backendClient.ts.
 * L'evento Stripe viene comunque verificato e gestito correttamente; solo
 * l'ultimo passo (avvisare il bot) è in attesa del contratto API reale.
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch (err) {
    return NextResponse.json(
      { error: "invalid_signature", detail: err instanceof Error ? err.message : String(err) },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const telegramId = Number(session.client_reference_id ?? session.metadata?.telegramId);
    const plan = session.metadata?.plan === "pro" ? "pro" : "basic";

    if (telegramId && session.customer && session.subscription) {
      try {
        await notifySubscriptionActive({
          telegramId,
          plan,
          stripeCustomerId: String(session.customer),
          stripeSubscriptionId: String(session.subscription),
        });
      } catch (err) {
        // Il pagamento è comunque avvenuto correttamente: logghiamo
        // l'errore di notifica al backend ma rispondiamo comunque 200 a
        // Stripe (altrimenti Stripe continuerebbe a ritentare l'evento
        // all'infinito per un problema che non è di Stripe).
        console.error("[stripe-webhook] notifySubscriptionActive fallita:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
