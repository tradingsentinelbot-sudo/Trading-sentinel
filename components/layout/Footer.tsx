import Link from "next/link";
import { LogoMark } from "@/components/ui/LogoMark";

const LEGAL_LINKS = [
  { label: "Termini di Servizio", href: "/terms-of-service" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Risk Disclosure", href: "/risk-disclosure" },
];

/**
 * Footer — documentazione legale, disclaimer, trust indicators.
 * Rif. Fase 08 (FASE 08 — CLAUDE EXECUTION PROMPT, sezione "IMPLEMENTAZIONE").
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-obsidian">
      <div className="container-sentinel py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-6 w-6" />
              <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
                Trading Sentinel
              </span>
            </div>
            <p className="max-w-xs text-[13px] leading-relaxed text-ink-faint">
              Strumento di monitoraggio operativo per XAUUSD. Non è un servizio di
              consulenza finanziaria e non esegue operazioni di trading.
            </p>
          </div>

          <nav aria-label="Documentazione legale">
            <ul className="flex flex-col gap-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/[0.06] pt-6">
          <p className="text-[12px] leading-relaxed text-ink-faint">
            Il trading su strumenti finanziari comporta un elevato livello di rischio e
            può comportare la perdita del capitale investito. Trading Sentinel non apre,
            modifica o chiude operazioni per conto dell&apos;utente.
          </p>
          <p className="mt-3 text-[12px] text-ink-faint">
            © {year} Trading Sentinel. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}
