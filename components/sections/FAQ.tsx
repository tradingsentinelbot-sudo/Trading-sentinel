"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "@/components/ui/Section";

const FAQS = [
  {
    q: "Trading Sentinel apre operazioni al posto mio?",
    a: "No. Monitora i livelli che imposti tu e ti invia una notifica su Telegram. L'apertura, modifica o chiusura di ogni posizione resta sempre una tua decisione.",
  },
  {
    q: "Serve collegare il mio conto broker?",
    a: "No. Trading Sentinel non richiede né utilizza credenziali del broker: non ha alcun accesso al tuo capitale.",
  },
  {
    q: "Cosa succede dopo la Free Trial di 72 ore?",
    a: "Puoi scegliere di attivare il piano Basic o Pro. Se non attivi nulla, il monitoraggio si interrompe automaticamente: nessun addebito automatico.",
  },
  {
    q: "Qual è la differenza tra Basic e Pro?",
    a: "Basic monitora una posizione alla volta. Pro consente il monitoraggio di più posizioni in parallelo con soglie avanzate. Dettagli nella sezione Versioni.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" variant="dark" align="center" eyebrow="Domande frequenti" title="Prima di iniziare">
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q} className="overflow-hidden rounded-control border border-white/[0.07] bg-white/[0.02]">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-[15px] font-medium text-ink">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-ink-faint transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-sentinel ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden px-5 pb-4">
                  <p className="text-[14px] leading-relaxed text-ink-muted">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
