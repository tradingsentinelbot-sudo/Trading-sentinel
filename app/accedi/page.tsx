import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TelegramLoginButton } from "@/components/auth/TelegramLoginButton";
import { SESSION_COOKIE, getCurrentSession } from "@/lib/telegramAuth";

export const metadata: Metadata = {
  title: "Accedi — Trading Sentinel",
};

export default async function AccediPage() {
  const cookieStore = await cookies();
  const session = await getCurrentSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (session) redirect("/account");

  return (
    <>
      <Navbar />
      <main className="pb-24 pt-32 md:pt-44">
        <div className="container-sentinel max-w-md">
          <h1 className="text-section-mobile md:text-section-desktop font-display font-semibold text-ink">
            Accedi con Telegram
          </h1>
          <p className="mt-4 text-body-mobile text-ink-muted">
            Trading Sentinel usa il tuo account Telegram per l&apos;accesso — è lo stesso
            account collegato al bot che ti invia le notifiche operative.
          </p>
          <div className="mt-8">
            <TelegramLoginButton />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
