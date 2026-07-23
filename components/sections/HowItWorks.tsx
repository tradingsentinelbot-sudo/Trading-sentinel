"use client";

import { Section } from "@/components/ui/Section";
import { motion } from "motion/react";
import { staggerContainer, fadeUp } from "@/components/motion/variants";

const STEPS = [
  {
    step: "01",
    title: "Configura i livelli",
    text: "Imposta i livelli di prezzo XAUUSD che vuoi monitorare — Entry, SL e TP, oppure soglie personalizzate.",
  },
  {
    step: "02",
    title: "Collega Telegram",
    text: "Trading Sentinel invia le notifiche direttamente nella chat del bot ufficiale, senza altre app da controllare.",
  },
  {
    step: "03",
    title: "Torna alla tua giornata",
    text: "Il monitoraggio resta attivo in background. Nessun bisogno di tenere aperto il grafico.",
  },
  {
    step: "04",
    title: "Ricevi la notifica",
    text: "Quando un livello viene raggiunto, ricevi un messaggio operativo chiaro — la decisione resta sempre tua.",
  },
];

export function HowItWorks() {
  return (
    <Section
      id="come-funziona"
      variant="graphite"
      align="center"
      eyebrow="Come funziona"
      title={<>Quattro passaggi.<span className="block text-[0.64em] leading-[1.08]">Non un pannello di controllo</span></>}
      subtitle="Nessuna curva di apprendimento. Il flusso operativo è deliberatamente semplice."
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer}
        className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4"
      >
        {STEPS.map((s) => (
          <motion.div key={s.step} variants={fadeUp} className="bg-graphite p-7">
            <span className="font-display text-[13px] font-semibold tracking-[0.1em] text-sentinel-400">
              {s.step}
            </span>
            <h3 className="mt-3 text-[16px] font-semibold text-ink">{s.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{s.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
