import type { Metadata } from "next";
import { LegalPageLayout, LegalSection, LegalList } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms of Service — Trading Sentinel",
  description: "Termini di servizio di Trading Sentinel.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="22 luglio 2026">
      <LegalSection title="1. Accettazione dei termini">
        <p>
          Accedendo o utilizzando Trading Sentinel, l&apos;utente accetta i presenti
          Termini di Servizio.
        </p>
        <p>Se non accetta questi termini, non deve utilizzare il servizio.</p>
      </LegalSection>

      <LegalSection title="2. Descrizione del servizio">
        <p>
          Trading Sentinel è un software di monitoraggio operativo che consente agli
          utenti di ricevere notifiche relative ai movimenti di prezzo XAUUSD tramite
          Telegram.
        </p>
        <p>Il servizio permette all&apos;utente di:</p>
        <LegalList
          items={[
            "registrare informazioni relative alle proprie operazioni;",
            "monitorare livelli di prezzo;",
            "ricevere notifiche operative.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Limitazioni del servizio">
        <p>Trading Sentinel non:</p>
        <LegalList
          items={[
            "esegue operazioni di trading;",
            "accede ai conti broker degli utenti;",
            "gestisce fondi;",
            "fornisce consulenza finanziaria.",
          ]}
        />
        <p>L&apos;utente mantiene pieno controllo sulle proprie attività operative.</p>
      </LegalSection>

      <LegalSection title="4. Licenza di utilizzo">
        <p>L&apos;accesso al servizio avviene tramite licenza mensile.</p>
        <p>
          La licenza consente esclusivamente l&apos;utilizzo personale del servizio secondo
          il piano acquistato.
        </p>
        <p>È vietato:</p>
        <LegalList
          items={[
            "condividere la licenza con terzi;",
            "tentare di modificare il software;",
            "utilizzare il servizio per scopi illegittimi.",
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Versioni del servizio">
        <p>Trading Sentinel può essere disponibile in differenti versioni, incluse:</p>
        <LegalList items={["Basic;", "Pro."]} />
        <p>Ogni versione può includere funzionalità e limiti operativi differenti.</p>
        <p>Le caratteristiche dei piani disponibili sono indicate nella pagina ufficiale del servizio.</p>
      </LegalSection>

      <LegalSection title="6. Disponibilità del servizio">
        <p>
          Il servizio è progettato per garantire continuità operativa, ma non può essere
          garantita disponibilità assoluta senza interruzioni.
        </p>
        <p>
          Eventuali manutenzioni, aggiornamenti o problemi tecnici possono temporaneamente
          limitare il funzionamento del servizio.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitazione di responsabilità">
        <p>Trading Sentinel non è responsabile per:</p>
        <LegalList
          items={[
            "perdite finanziarie derivanti da attività di trading;",
            "decisioni operative dell'utente;",
            "mancata esecuzione di strategie personali;",
            "eventi esterni indipendenti dal servizio.",
          ]}
        />
      </LegalSection>

      <LegalSection title="8. Modifiche al servizio">
        <p>
          Il servizio può essere aggiornato o modificato per migliorare funzionalità,
          sicurezza e affidabilità.
        </p>
        <p>Eventuali modifiche sostanziali saranno comunicate attraverso i canali disponibili.</p>
      </LegalSection>

      <LegalSection title="9. Contatti">
        <p>Per informazioni relative al servizio, accedi a Telegram:</p>
        <a
          href="/accedi"
          className="inline-flex w-fit items-center justify-center rounded-full border border-ink-faint/40 bg-ink/5 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink/10"
        >
          Accedere a Telegram
        </a>
      </LegalSection>
    </LegalPageLayout>
  );
}
