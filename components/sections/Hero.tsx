"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { staggerContainer, fadeUp } from "@/components/motion/variants";

/**
 * Hero — prima impressione e conversione (04.3 / 05.2).
 * L'entità visiva non è più un componente DOM: è la Digital Sculpture 3D
 * renderizzata nel SceneCanvas persistente (montato in app/layout.tsx),
 * visibile dietro a questa sezione. Qui resta solo il contenuto testuale.
 * Desktop: testo nella metà sinistra, la colonna destra resta vuota per
 * lasciare lo spazio compositivo alla scultura, coerente col waypoint
 * camera "hero" (constants/scene.ts).
 * Mobile: badge → titolo → testo → CTA.
 * Entrata progressiva: badge, titolo, testo, pulsanti.
 */
export function Hero() {
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
            <Button variant="primary" size="lg">
              Inizia la Free Trial di 72 ore
            </Button>
            <Button variant="secondary" size="lg">
              Scopri come funziona
            </Button>
          </motion.div>
        </motion.div>

        {/* Colonna destra intenzionalmente vuota su desktop: la Digital
            Sculpture vive nel Canvas 3D dietro la pagina, non qui. */}
        <div aria-hidden className="hidden md:block" />
      </div>
    </section>
  );
}
