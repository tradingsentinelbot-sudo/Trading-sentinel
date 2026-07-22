import Link from "next/link";
import { LogoMark } from "@/components/ui/LogoMark";

const LEGAL_LINKS = [
  { label: "Termini di Servizio", href: "/terms-of-service" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Risk Disclosure", href: "/risk-disclosure" },
];

const TECHNICAL_FAQS = [
  ["Il bot funziona anche quando il telefono è spento?", "Sì. Il bot gira sul server (Raspberry Pi o altro). Il telefono riceve le notifiche Telegram non appena viene riacceso o riconnesso."],
  ["Cosa succede se il bot si riavvia mentre ho trade aperti?", "I trade vengono riletti dal file JSON al riavvio. Il bot riprende il monitoraggio automaticamente. Con il Pro, anche lo stato delle notifiche attese (Y/N) viene ripristinato da file."],
  ["Cosa succede se perdo la connessione internet?", "Il ciclo di monitoraggio genera un errore silenzioso e riprende al ciclo successivo (2 secondi dopo). Non vengono perse notifiche già generate. I dati dei trade non vengono alterati."],
  ["Il bot chiude automaticamente le posizioni reali sulla piattaforma?", "No. Il bot è uno strumento di notifica e monitoraggio. Non interagisce con nessuna piattaforma di trading. Le posizioni reali devono essere chiuse manualmente dall'utente."],
  ["Posso avere più trade sullo stesso asset?", "Sì. Il Basic supporta 3 trade contemporanei, il Pro 5. Possono essere tutti long, tutti short, o una combinazione."],
  ["Cosa succede a mezzanotte se ho trade aperti senza flag overnight?", "Il bot li chiude dal proprio registro (non dalla piattaforma reale) e smette di monitorarli. Invia una notifica \"CHIUSURA AUTOMATICA\" con il dettaglio di cosa è stato chiuso e cosa mantenuto."],
  ["Il bot invia notifiche per ogni ciclo di 2 secondi?", "No. Una notifica viene inviata solo nel momento in cui il prezzo attraversa un livello (transizione da sopra a sotto o viceversa). Se il prezzo resta stabilmente sopra un livello, non arrivano ulteriori notifiche fino al prossimo attraversamento."],
  ["Posso impostare un alert su un livello di prezzo specifico indipendente dai trade?", "/alertup 3400 avvisa quando il prezzo supera 3400. /alertdown 3300 avvisa quando scende sotto 3300. Gli alert scattano una sola volta e vengono rimossi automaticamente."],
  ["Con il Pro, se ho livelli personalizzati e poi cambio idea, come torno ai livelli standard?", "/levelsoff3 ripristina i livelli standard (±0.3R e ±0.7R) per il trade 3. /resetlevels li ripristina su tutti i trade attivi contemporaneamente."],
  ["Lo storico di /history (Pro) contiene anche le risposte ai miei comandi?", "No. Lo storico contiene esclusivamente le notifiche automatiche generate dal bot: superamenti di livello, alert prezzo, chiusure di mezzanotte. Le risposte ai comandi manuali non vengono registrate."],
  ["Cosa mostra /report (Pro)?", "Numero di trade attivi, quali trade hanno il flag overnight attivo, alert prezzo UP e DOWN attivi con i relativi valori, e l'ultimo prezzo di XAUUSD."],
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-obsidian">
      <div className="container-sentinel py-14">
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-start">
          <div className="flex flex-col gap-3">
            <a href="/" className="flex items-center gap-2.5" aria-label="Trading Sentinel — Home">
              <LogoMark className="h-6 w-6" />
              <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
                Trading Sentinel
              </span>
            </a>
            <p className="max-w-xs text-[13px] leading-relaxed text-ink-faint">
              Strumento di monitoraggio operativo per XAUUSD. Non è un servizio di
              consulenza finanziaria e non esegue operazioni di trading.
            </p>
          </div>

          <nav aria-label="Documentazione legale">
            <ul className="flex flex-col gap-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px] text-ink-muted transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <details className="mt-12 border-t border-white/[0.06] pt-6">
          <summary className="cursor-pointer list-none text-[14px] font-medium text-ink transition-colors hover:text-silver">
            FAQ Tecniche
          </summary>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {TECHNICAL_FAQS.map(([question, answer]) => (
              <details key={question} className="rounded-control border border-white/[0.06] bg-white/[0.02] p-4">
                <summary className="cursor-pointer text-[13px] font-medium leading-relaxed text-ink">
                  {question}
                </summary>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{answer}</p>
              </details>
            ))}
          </div>
        </details>

        <div className="mt-10 border-t border-white/[0.06] pt-6">
          <p className="text-[12px] leading-relaxed text-ink-faint">
            Il trading su strumenti finanziari comporta un elevato livello di rischio e
            può comportare la perdita del capitale investito. Trading Sentinel non apre,
            modifica o chiude operazioni per conto dell&apos;utente.
          </p>
          <p className="mt-3 text-[12px] text-ink-faint">© {year} Trading Sentinel. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
