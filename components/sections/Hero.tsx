"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { staggerContainer, fadeUp } from "@/components/motion/variants";
import { resolveCommercialCTA } from "@/lib/commercialCta";
import { SceneCanvasClientOnly } from "@/components/background/SceneCanvasClientOnly";

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
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <SceneCanvasClientOnly />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(85%_75%_at_72%_38%,rgba(35,47,58,0.46)_0%,rgba(25,32,40,0.34)_38%,rgba(10,11,13,0.62)_74%,rgba(10,11,13,0.96)_100%),radial-gradient(58%_48%_at_76%_68%,rgba(92,101,110,0.14)_0%,rgba(20,24,29,0.04)_54%,transparent_100%),linear-gradient(180deg,rgba(18,24,30,0.82)_0%,rgba(12,15,19,0.76)_54%,rgba(10,11,13,0.98)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[42%] bg-gradient-to-t from-obsidian via-obsidian/78 to-transparent"
      />
      <div aria-hidden className="pointer-events-none absolute left-[8%] top-[28%] -z-10 h-px w-[34%] bg-gradient-to-r from-transparent via-silver/20 to-transparent" />

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
            <span className="block text-[0.64em] leading-[1.08] text-ink/95">Senza restare davanti al grafico.</span>
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
