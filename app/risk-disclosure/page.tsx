import type { Metadata } from "next";
import { LegalPageLayout, LegalSection, LegalList } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Risk Disclosure — Trading Sentinel",
  description: "Informativa sui rischi relativa all'utilizzo di Trading Sentinel.",
};

export default function RiskDisclosurePage() {
  return (
    <LegalPageLayout title="Risk Disclosure" lastUpdated="22 luglio 2026">
      <LegalSection title="1. Introduzione">
        <p>
          Trading Sentinel è uno strumento software progettato per assistere il trader nel
          monitoraggio operativo delle proprie posizioni sul mercato XAUUSD (Oro).
        </p>
        <p>
          Il servizio fornisce notifiche e informazioni operative relative ai livelli di
          prezzo configurati dall&apos;utente.
        </p>
        <p>
          Trading Sentinel non è un servizio di consulenza finanziaria e non fornisce
          raccomandazioni di investimento.
        </p>
      </LegalSection>

      <LegalSection title="2. Nessuna garanzia di risultato">
        <p>I mercati finanziari sono caratterizzati da elevata incertezza e volatilità.</p>
        <p>
          Trading Sentinel non elimina il rischio di mercato e non può garantire risultati
          finanziari, profitti o operazioni vincenti.
        </p>
        <p>
          Le prestazioni passate di qualsiasi strategia o metodologia non rappresentano una
          garanzia di risultati futuri.
        </p>
      </LegalSection>

      <LegalSection title="3. Responsabilità dell'utente">
        <p>L&apos;utente rimane l&apos;unico responsabile delle proprie decisioni operative.</p>
        <p>Trading Sentinel:</p>
        <LegalList
          items={[
            "non apre operazioni;",
            "non modifica operazioni;",
            "non chiude automaticamente posizioni;",
            "non gestisce il capitale dell'utente.",
          ]}
        />
        <p>Ogni decisione di trading rimane sotto il controllo esclusivo del trader.</p>
      </LegalSection>

      <LegalSection title="4. Rischio finanziario">
        <p>Il trading su strumenti finanziari comporta un elevato livello di rischio.</p>
        <p>È possibile subire perdite parziali o totali del capitale impiegato.</p>
        <p>
          Prima di operare sui mercati finanziari, ogni utente dovrebbe valutare
          attentamente la propria situazione finanziaria, esperienza e tolleranza al
          rischio.
        </p>
      </LegalSection>

      <LegalSection title="5. Utilizzo del software">
        <p>
          Trading Sentinel deve essere considerato uno strumento di supporto operativo e
          non un sostituto della valutazione personale del trader.
        </p>
        <p>L&apos;utilizzo del servizio non modifica la natura rischiosa dell&apos;attività di trading.</p>
      </LegalSection>

      <LegalSection title="6. Accettazione">
        <p>
          Utilizzando Trading Sentinel, l&apos;utente riconosce di comprendere i rischi
          associati al trading e accetta che il servizio venga utilizzato esclusivamente
          come strumento di supporto.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
