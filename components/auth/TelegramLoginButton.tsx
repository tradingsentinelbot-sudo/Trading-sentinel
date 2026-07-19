"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    onTelegramAuth?: (user: Record<string, unknown>) => void;
  }
}

/**
 * TelegramLoginButton — monta il widget ufficiale "Login with Telegram"
 * (https://core.telegram.org/widgets/login). Al login, invia i dati a
 * /api/auth/telegram per la verifica server-side e la creazione sessione.
 *
 * Richiede NEXT_PUBLIC_TELEGRAM_BOT_USERNAME (username del bot, senza @).
 */
export function TelegramLoginButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

  useEffect(() => {
    if (!botUsername || !containerRef.current) return;

    window.onTelegramAuth = async (user) => {
      setStatus("loading");
      setErrorMessage(null);
      try {
        const res = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error ?? "login_failed");
        }
        router.push("/account");
        router.refresh();
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "login_failed");
      }
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);

    return () => {
      window.onTelegramAuth = undefined;
    };
  }, [botUsername, router]);

  if (!botUsername) {
    return (
      <p className="text-[13px] text-ink-faint">
        Login Telegram non configurato: manca <code>NEXT_PUBLIC_TELEGRAM_BOT_USERNAME</code>.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <div ref={containerRef} />
      {status === "loading" && <p className="text-[13px] text-ink-muted">Accesso in corso…</p>}
      {status === "error" && (
        <p className="text-[13px] text-red-400">Accesso non riuscito ({errorMessage}). Riprova.</p>
      )}
    </div>
  );
}
