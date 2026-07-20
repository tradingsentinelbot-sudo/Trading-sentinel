import Link from "next/link";
import { ShieldAlert, Lock, FileText } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

const TRUST_POINTS = [
  {
    icon: Lock,
    title: "Nessun accesso al tuo conto broker",
    text: "Trading Sentinel non richiede né utilizza le credenziali del tuo broker. Non può muovere il tuo capitale perché non vi accede.",
  },
  {
    icon: ShieldAlert,
    title: "Solo monitoraggio, mai esecuzione",
    text: "Il sistema osserva il prezzo e ti notifica. Non apre, modifica o chiude posizioni per conto tuo.",
  },
  {
    icon: FileText,
    title: "Termini chiari, senza sorprese",
    text: "Licenza, rinnovo e limiti di ogni piano sono descritti nei Termini di Servizio, non nascosti in una sezione secondaria.",
  },
];

/**
 * Trust — trasparenza operativa + riepilogo Risk Disclosure (link alla
 * pagina legale completa, testo non duplicato qui).
 */
export function Trust() {
  return (
    <Section id="trust" variant="graphite" align="center" eyebrow="Trasparenza" title="Cosa puoi aspettarti, con chiarezza">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {TRUST_POINTS.map((point, i) => (
          <RevealOnScroll key={point.title} delay={i * 0.06}>
            <div className="h-full rounded-card border border-white/[0.06] bg-obsidian/40 p-7">
              <point.icon size={20} className="text-silver" strokeWidth={1.6} />
              <h3 className="mt-4 text-[16px] font-semibold text-ink">{point.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{point.text}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      <RevealOnScroll delay={0.15}>
        <div className="mx-auto mt-10 max-w-2xl rounded-card border border-amber-500/15 bg-amber-500/[0.04] p-6 text-left">
          <p className="text-[14px] leading-relaxed text-ink-muted">
            Il trading su strumenti finanziari comporta un elevato livello di rischio e può
            comportare la perdita del capitale investito. Trading Sentinel è uno strumento di
            supporto operativo, non un servizio di consulenza finanziaria.
          </p>
          <Link
            href="/risk-disclosure"
            className="mt-3 inline-block text-[14px] font-medium text-sentinel-400 underline underline-offset-2 hover:text-sentinel-300"
          >
            Leggi la Risk Disclosure completa
          </Link>
        </div>
      </RevealOnScroll>
    </Section>
  );
}
