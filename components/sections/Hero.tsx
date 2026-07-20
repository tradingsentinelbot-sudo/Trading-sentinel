"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { staggerContainer, fadeUp } from "@/components/motion/variants";
import { resolveCommercialCTA } from "@/lib/commercialCta";

/**
 * Hero — prima impressione e conversione (04.3 / 05.2).
 *
 * Sistema 3D (Digital Sculpture / SceneCanvas) congelato su richiesta
 * esplicita, in attesa di revisione estetica con strumenti di verifica
 * visiva adeguati — codice preservato in components/background/, non
 * rimosso. L'elemento visivo della Hero è, provvisoriamente, l'immagine
 * statica fornita.
 *
 * Desktop: testo nella metà sinistra, immagine nella colonna destra.
 * Mobile: badge → titolo → testo → CTA → immagine.
 * Entrata progressiva: badge, titolo, testo, pulsanti, poi l'immagine.
 */
export function Hero() {
  const router = useRouter();
  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-44">
      <div className="container-sentinel grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-start text-left"
        >
          <motion.div variants={fadeUp}>
            <Badge variant="accent">XAUUSD Trading Assistant</Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-hero-mobile md:text-hero-desktop font-display font-semibold text-ink"
          >
            Monitora il tuo trade.
            <br />
            Senza restare davanti al grafico.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-md text-body-mobile md:text-body-desktop text-ink-muted"
          >
            Trading Sentinel controlla il prezzo dell&apos;Oro in tempo reale e ti invia
            notifiche operative direttamente su Telegram quando vengono raggiunti livelli
            importanti.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            <Button variant="primary" size="lg" onClick={() => router.push(resolveCommercialCTA().href)}>
              Inizia la Free Trial di 72 ore
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => document.getElementById("come-funziona")?.scrollIntoView({ behavior: "smooth" })}
            >
              Scopri come funziona
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-card md:max-w-none"
        >
          <Image
            src="/hero-artifact.png"
            alt="Trading Sentinel — entità digitale, artefatto centrale della Hero"
            width={1024}
            height={1536}
            priority
            className="h-auto w-full object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
