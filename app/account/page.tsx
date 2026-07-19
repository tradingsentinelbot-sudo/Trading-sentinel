import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckoutButton } from "@/components/auth/CheckoutButton";
import { TrialButton } from "@/components/auth/TrialButton";
import { SESSION_COOKIE, getCurrentSession } from "@/lib/telegramAuth";
import { getLicenseStatus, type LicenseStatus } from "@/lib/backendClient";

export const metadata: Metadata = {
  title: "Il tuo account — Trading Sentinel",
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const session = await getCurrentSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/accedi");

  let license: LicenseStatus | null = null;
  let backendError: string | null = null;
  try {
    license = await getLicenseStatus(session.tid);
  } catch (err) {
    backendError = err instanceof Error ? err.message : "Errore sconosciuto";
  }

  return (
    <>
      <Navbar />
      <main className="pb-24 pt-32 md:pt-44">
        <div className="container-sentinel max-w-2xl">
          <h1 className="text-section-mobile md:text-section-desktop font-display font-semibold text-ink">
            Il tuo account
          </h1>
          <p className="mt-2 text-[14px] text-ink-faint">Telegram ID: {session.tid}</p>

          <div className="mt-10 rounded-card border border-white/[0.06] bg-white/[0.03] p-6">
            <h2 className="text-[16px] font-semibold text-ink">Stato licenza</h2>

            {backendError && (
              <div className="mt-3 rounded-control border border-amber-500/20 bg-amber-500/[0.06] p-4">
                <p className="text-[14px] text-amber-300">
                  Integrazione con il backend non ancora collegata.
                </p>
                <p className="mt-1 text-[13px] text-ink-faint">{backendError}</p>
              </div>
            )}

            {license && (
              <div className="mt-3 text-[14px] text-ink-muted">
                <p>Piano: {license.plan}</p>
                <p>Stato: {license.active ? "attivo" : "non attivo"}</p>
                {license.expiresAt && <p>Scadenza: {license.expiresAt}</p>}
              </div>
            )}
          </div>

          <div className="mt-8">
            <TrialButton />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <CheckoutButton plan="basic" label="Attiva piano Basic" />
            <CheckoutButton plan="pro" label="Attiva piano Pro" />
          </div>

          <form action="/api/auth/logout" method="post" className="mt-10">
            <button type="submit" className="text-[13px] text-ink-faint underline hover:text-ink-muted">
              Esci
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
