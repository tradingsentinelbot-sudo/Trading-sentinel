"use client";

import { Eye, BellRing, ShieldCheck } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { staggerContainer, fadeUp } from "@/components/motion/variants";
import { motion } from "motion/react";

const POINTS = [
  {
    icon: Eye,
    title: "Osserva sempre",
    text: "Monitora il prezzo XAUUSD in tempo reale, anche quando non sei davanti allo schermo.",
  },
  {
    icon: BellRing,
    title: "Avvisa al momento giusto",
    text: "Invia una notifica su Telegram solo quando viene raggiunto un livello che hai definito tu.",
  },
  {
    icon: ShieldCheck,
    title: "Non decide al posto tuo",
    text: "Non apre, modifica o chiude posizioni. Resta uno strumento di supporto, non un pilota automatico.",
  },
];

/**
 * Solution — "Cos'è Trading Sentinel": risposta diretta al problema
 * appena descritto.
 */
export function Solution() {
  return (
    <Section
      id="cosa-e"
      variant="dark"
      align="center"
      eyebrow="Cos'è Trading Sentinel"
      title="Un osservatore silenzioso per il tuo trade"
      subtitle="Trading Sentinel non sostituisce le tue decisioni. Le libera dal bisogno di essere prese in ogni istante."
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="grid grid-cols-1 gap-5 md:grid-cols-3"
      >
        {POINTS.map((point) => (
          <motion.div
            key={point.title}
            variants={fadeUp}
            className="group relative rounded-card border border-white/[0.08] bg-gradient-to-br from-white/[0.045] via-white/[0.02] to-transparent p-7 transition-all duration-300 hover:border-silver/25 hover:shadow-metal-soft"
          >
            <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-silver/25 to-transparent" />
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-control border border-silver/15 bg-gradient-to-br from-silver/10 via-white/[0.03] to-amber/10 text-silver transition-colors group-hover:text-amber-soft">
              <point.icon size={20} strokeWidth={1.6} />
            </div>
            <h3 className="text-[17px] font-semibold text-ink">{point.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{point.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
