"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { staggerContainer, fadeUp } from "@/components/motion/variants";
import { resolveCommercialCTA } from "@/lib/commercialCta";

/**
 * Hero — testo e conversione sopra l'ambiente 3D persistente.
 *
 * La scena non è un'immagine dentro una colonna: vive dietro l'interfaccia,
 * come ambiente continuo. Il contenuto resta leggibile grazie a una zona di
 * contrasto locale, non a un pannello opaco che nasconde l'artefatto.
 */
export function Hero() {
  const router = useRouter();

  return (
    <section className="relative isolate min-h-[min(900px,100svh)] overflow-hidden pt-28 md:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_22%_48%,rgba(10,11,13,0.96)_0%,rgba(10,11,13,0.82)_38%,rgba(10,11,13,0.32)_68%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent"
      />

      <div className="container-sentinel relative flex min-h-[calc(min(900px,100svh)-7rem)] items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-[720px] pb-20 md:pb-28"
        >
          <motion.div variants={fadeUp}>
            <Badge variant="accent">XAUUSD Trading Assistant</Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-7 max-w-[760px] text-hero-mobile font-display font-semibold tracking-[-0.035em] text-ink md:text-hero-desktop"
          >
            Monitora il tuo trade.
            <br />
            <span className="text-ink/95">Senza restare davanti al grafico.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-[560px] text-body-mobile text-ink-muted md:text-body-desktop"
          >
            Trading Sentinel controlla il prezzo dell&apos;Oro in tempo reale e ti invia
            notifiche operative direttamente su Telegram quando vengono raggiunti livelli
            importanti.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
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

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-5">
            <StatusIndicator label="Monitoring XAUUSD" />
            <span className="h-1 w-1 rounded-full bg-silver/40" aria-hidden />
            <span className="text-micro text-ink-faint">Decisioni sempre tue</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
