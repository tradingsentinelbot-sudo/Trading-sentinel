import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/telegramAuth";
import { notifyTrialStarted } from "@/lib/backendClient";

export async function POST(request: NextRequest) {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const cookieValue = request.cookies.get(SESSION_COOKIE)?.value;
  const session = cookieValue ? await verifySessionToken(cookieValue, sessionSecret) : null;
  if (!session) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  try {
    await notifyTrialStarted(session.tid);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "backend_not_connected", detail: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }
}
