import type { Metadata } from "next";
import { LegalPageLayout, LegalSection, LegalList } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Trading Sentinel",
  description: "Informativa sulla privacy di Trading Sentinel.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="[DATA]">
      <LegalSection title="1. Introduzione">
        <p>
          Trading Sentinel rispetta la privacy degli utenti e si impegna a trattare i dati
          personali in modo trasparente e responsabile.
        </p>
        <p>
          Questa Privacy Policy descrive quali informazioni possono essere raccolte e come
          vengono utilizzate.
        </p>
      </LegalSection>

      <LegalSection title="2. Dati raccolti">
        <p>Durante l&apos;utilizzo del servizio possono essere raccolti:</p>
        <p className="font-medium text-ink">Dati account</p>
        <LegalList
          items={[
            "informazioni necessarie alla gestione della licenza;",
            "informazioni di contatto fornite dall'utente.",
          ]}
        />
        <p className="font-medium text-ink">Dati operativi</p>
        <LegalList
          items={[
            "configurazioni inserite dall'utente;",
            "parametri necessari al funzionamento del monitoraggio.",
          ]}
        />
        <p className="font-medium text-ink">Dati tecnici</p>
        <LegalList
          items={[
            "informazioni relative all'utilizzo del servizio;",
            "dati necessari alla sicurezza e manutenzione del sistema.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Utilizzo dei dati">
        <p>I dati vengono utilizzati per:</p>
        <LegalList
          items={[
            "fornire il servizio richiesto;",
            "gestire le licenze;",
            "inviare notifiche operative;",
            "migliorare affidabilità e sicurezza del sistema.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Telegram">
        <p>
          Trading Sentinel utilizza Telegram come canale di comunicazione per l&apos;invio
          delle notifiche.
        </p>
        <p>L&apos;utilizzo del servizio Telegram è soggetto ai termini e alle condizioni di Telegram.</p>
      </LegalSection>

      <LegalSection title="5. Conservazione dei dati">
        <p>
          I dati vengono conservati solamente per il periodo necessario a fornire il
          servizio o rispettare eventuali obblighi normativi.
        </p>
      </LegalSection>

      <LegalSection title="6. Protezione dei dati">
        <p>
          Trading Sentinel adotta misure tecniche e organizzative ragionevoli per proteggere
          le informazioni degli utenti.
        </p>
        <p>Nessun sistema digitale può tuttavia garantire sicurezza assoluta.</p>
      </LegalSection>

      <LegalSection title="7. Condivisione dei dati">
        <p>
          I dati personali non vengono venduti o utilizzati per finalità pubblicitarie non
          autorizzate.
        </p>
        <p>
          Eventuali fornitori tecnici utilizzati per il funzionamento del servizio possono
          trattare dati esclusivamente secondo necessità operative.
        </p>
      </LegalSection>

      <LegalSection title="8. Diritti dell'utente">
        <p>L&apos;utente può richiedere:</p>
        <LegalList
          items={["accesso ai propri dati;", "modifica delle informazioni;", "cancellazione dei dati quando applicabile."]}
        />
      </LegalSection>

      <LegalSection title="9. Contatti">
        <p>Per richieste relative alla privacy: [INSERIRE EMAIL UFFICIALE]</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
