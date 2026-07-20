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
            className="rounded-card border border-white/[0.06] bg-white/[0.03] p-7 transition-colors duration-300 hover:border-sentinel-500/25 hover:bg-white/[0.05]"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-control bg-gradient-to-b from-sentinel-500/20 to-sentinel-600/10 text-sentinel-400">
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
