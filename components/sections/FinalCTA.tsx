"use client";

import { useRouter } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { resolveCommercialCTA } from "@/lib/commercialCta";

export function FinalCTA() {
  const router = useRouter();

  return (
    <Section variant="spotlight" align="center">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <StatusIndicator label="Sentinel Active — Monitoring XAUUSD" />

        <h2 className="text-section-mobile md:text-section-desktop font-display font-semibold text-ink">
          Inizia a monitorare senza restare incollato al grafico
        </h2>

        <p className="text-body-mobile md:text-body-desktop text-ink-muted">
          72 ore di Free Trial, nessun impegno automatico oltre la prova.
        </p>

        <Button variant="primary" size="lg" onClick={() => router.push(resolveCommercialCTA().href)}>
          Inizia la Free Trial di 72 ore
        </Button>
      </div>
    </Section>
  );
}
