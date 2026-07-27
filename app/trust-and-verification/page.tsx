import type { Metadata } from "next";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Trust and Verification — Trading Sentinel",
  description: "Verifica indipendente dell'infrastruttura, dei pagamenti, della metodologia e della reputazione di Trading Sentinel.",
};

export default function TrustAndVerificationPage() {
  return (
    <LegalPageLayout title="Trust and Verification" lastUpdated="27 luglio 2026">
      <section className="border-b border-white/[0.08] pb-10">
        <p className="text-[24px] leading-tight text-ink md:text-[32px]">Progettato per essere verificato.</p>
        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-muted md:text-[18px]">
          Non chiediamo di fidarvi ciecamente. Potete verificare autonomamente l&apos;infrastruttura, i pagamenti, la metodologia e la reputazione del servizio.
        </p>
      </section>

      <LegalSection title="Pagamenti sicuri">
        <p>I pagamenti sono elaborati in modo sicuro tramite Stripe.</p>
      </LegalSection>

      <LegalSection title="Infrastruttura protetta">
        <p>Trading Sentinel è ospitato e protetto tramite infrastruttura Cloudflare.</p>
      </LegalSection>

      <LegalSection title="Metodologia trasparente">
        <p>Documentazione del prodotto, metodologia e limitazioni del servizio sono disponibili prima dell&apos;utilizzo.</p>
      </LegalSection>

      <LegalSection title="Reputazione indipendente">
        <p>Le recensioni dei clienti sono pubblicamente consultabili su Trustpilot.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
