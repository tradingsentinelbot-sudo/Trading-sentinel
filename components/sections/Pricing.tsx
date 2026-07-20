"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { resolveCommercialCTA } from "@/lib/commercialCta";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    description: "Monitoraggio essenziale, per chi vuole iniziare senza complicazioni.",
    features: [
      "Monitoraggio XAUUSD in tempo reale",
      "Notifiche su Telegram",
      "Livelli Entry / Stop Loss personalizzati",
      "1 posizione monitorata alla volta",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Per chi gestisce più posizioni e vuole il controllo completo.",
    features: [
      "Tutto quanto incluso in Basic",
      "Posizioni multiple monitorate in parallelo",
      "Livelli e soglie avanzate",
      "Supporto prioritario",
    ],
    highlighted: true,
  },
] as const;

export function Pricing() {
  const router = useRouter();

  return (
    <Section
      id="versioni"
      variant="dark"
      align="center"
      eyebrow="Versioni"
      title="Basic o Pro"
      subtitle="Stesso principio di fondo — osservazione, non automazione. Cambia solo quanto puoi monitorare in parallelo."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={
              plan.highlighted
                ? "relative rounded-card border border-sentinel-500/35 bg-gradient-to-b from-sentinel-500/[0.08] to-transparent p-8"
                : "relative rounded-card border border-white/[0.08] bg-white/[0.03] p-8"
            }
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-8">
                <Badge variant="accent">Più scelto</Badge>
              </div>
            )}

            <h3 className="text-[20px] font-semibold text-ink">{plan.name}</h3>
            <p className="mt-2 text-[14px] text-ink-muted">{plan.description}</p>

            <ul className="mt-6 flex flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[14px] text-ink-muted">
                  <Check size={16} className="mt-0.5 shrink-0 text-sentinel-400" strokeWidth={2.2} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.highlighted ? "primary" : "secondary"}
              size="lg"
              className="mt-8 w-full"
              onClick={() => router.push(resolveCommercialCTA().href)}
            >
              Attiva {plan.name}
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-[13px] text-ink-faint">
        Entrambi i piani includono 72 ore di Free Trial prima dell&apos;attivazione.
      </p>
    </Section>
  );
}
