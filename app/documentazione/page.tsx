import type { Metadata } from "next";
import { LegalPageLayout, LegalSection, LegalList } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Manuali Utente — Trading Sentinel",
  description: "Manuali utente di Trading Sentinel Basic e Pro.",
};

function Command({ children }: { children: React.ReactNode }) {
  return (
    <code className="block overflow-x-auto rounded-sm border border-white/[0.08] bg-black/20 px-4 py-3 font-mono text-[13px] text-ink md:text-[14px]">
      {children}
    </code>
  );
}

export default function DocumentationPage() {
  return (
    <LegalPageLayout title="Manuali Utente" lastUpdated="22 luglio 2026">
      <LegalSection title="Manuale utente · Versione Basic">
        <p>Trading Sentinel Basic è un bot Telegram per il monitoraggio automatico delle posizioni su XAUUSD. Voi aprite e gestite la posizione sulla vostra piattaforma di trading; il bot mantiene il monitoraggio del trade e vi invia una notifica quando il prezzo attraversa i livelli definiti attraverso Entry e Stop Loss.</p>
        <p>Il bot gira autonomamente sul server. Il telefono serve per ricevere e inviare i messaggi Telegram: non è necessario tenere aperta la piattaforma di trading.</p>
      </LegalSection>

      <LegalSection title="Basic · 1. Il flusso di utilizzo">
        <LegalList items={[
          "Avviate il bot.",
          "Il bot comunica il prezzo attuale di XAUUSD e il numero di trade già attivi.",
          "Aprite la posizione reale sulla vostra piattaforma di trading.",
          "Registrate il trade nel bot con direzione, Entry e Stop Loss.",
          "Trading Sentinel calcola automaticamente R e i livelli da monitorare.",
          "Il bot controlla il prezzo automaticamente.",
          "Quando il prezzo attraversa un livello, ricevete una notifica Telegram.",
          "Quando chiudete la posizione reale, rimuovete il trade dal monitoraggio del bot.",
        ]} />
      </LegalSection>

      <LegalSection title="Basic · 2. Registrare una posizione">
        <Command>/long ENTRY STOP
/short ENTRY STOP

Esempio:
/long 3320 3310</Command>
        <p>Il bot calcola automaticamente R, cioè la distanza tra Entry e Stop Loss, e costruisce i livelli di monitoraggio.</p>
        <p>Trading Sentinel non apre, modifica o chiude posizioni reali sulla vostra piattaforma. Il bot gestisce esclusivamente il proprio registro di monitoraggio.</p>
      </LegalSection>

      <LegalSection title="Basic · 3. Come funziona il monitoraggio">
        <p>Con i livelli standard il bot monitora +0.3R, +0.7R, -0.3R e -0.7R.</p>
        <p>Una notifica non viene inviata ad ogni controllo. Il bot notifica l&apos;attraversamento effettivo di un livello. Se il prezzo resta sopra o sotto un livello, non ricevete notifiche ripetute finché non avviene un nuovo attraversamento.</p>
      </LegalSection>

      <LegalSection title="Basic · 4. Gestire più posizioni">
        <p>La versione Basic supporta fino a 3 trade contemporaneamente.</p>
        <Command>/long /short — registra il trade 1.
/long2 /short2 — registra il trade 2.
/long3 /short3 — registra il trade 3.
/status — mostra tutti i trade attivi.
/close1 /close2 /close3 — rimuove il trade corrispondente.
/closeall — rimuove tutti i trade dal monitoraggio.</Command>
      </LegalSection>

      <LegalSection title="Basic · 5. Mantenimento overnight">
        <p>A mezzanotte il bot rimuove automaticamente dal proprio registro i trade che non hanno il mantenimento overnight attivo. Questo non chiude la posizione reale sulla piattaforma.</p>
        <Command>/keep1 /keep2 /keep3 — mantiene il trade indicato nel registro durante la notte.
/unkeep1 /unkeep2 /unkeep3 — disattiva il mantenimento overnight.
/keepall — attiva il mantenimento overnight per tutti i trade.
/unkeepall — disattiva il mantenimento overnight.</Command>
      </LegalSection>

      <LegalSection title="Basic · 6. Alert indipendenti dai trade">
        <Command>/alertup PREZZO — notifica quando il prezzo supera il livello indicato.
/alertdown PREZZO — notifica quando il prezzo scende sotto il livello indicato.
/alertupoff — rimuove l&apos;alert UP.
/alertdownoff — rimuove l&apos;alert DOWN.
/alertoff — rimuove entrambi gli alert.
/alertstatus — mostra gli alert attivi.</Command>
      </LegalSection>

      <LegalSection title="Basic · 7. Comandi di servizio">
        <Command>/price — mostra il prezzo attuale di XAUUSD.
/ping — verifica che il bot sia online.
/version — mostra la versione del bot.</Command>
      </LegalSection>

      <LegalSection title="Basic · 8. Riavvio, connessione e dati">
        <p>I trade registrati vengono riletti dal file dati al riavvio. Se la connessione internet viene temporaneamente persa, il ciclo di monitoraggio riprende ai controlli successivi. Le posizioni reali non vengono modificate dal bot.</p>
      </LegalSection>

      <LegalSection title="Basic · 9. Esempio di sessione">
        <LegalList items={[
          "Aprite una posizione long su XAUUSD.",
          "Registrate: /long 3320 3310.",
          "Il bot calcola R e i livelli.",
          "Il prezzo viene controllato automaticamente.",
          "Ricevete una notifica quando il prezzo attraversa un livello.",
          "Se volete mantenere il trade overnight: /keep1.",
          "Quando la posizione reale è chiusa: /close1.",
        ]} />
      </LegalSection>

      <LegalSection title="Manuale utente · Versione Pro">
        <p>Trading Sentinel Pro è la versione avanzata del sistema di monitoraggio Telegram per XAUUSD. Mantiene il flusso operativo del Basic e aggiunge maggiore capacità di gestione, configurazione e controllo.</p>
        <p>Il Pro supporta fino a 5 trade simultanei, livelli personalizzabili per ogni posizione, status individuali, storico delle notifiche automatiche e report operativo.</p>
      </LegalSection>

      <LegalSection title="1. Il flusso di utilizzo">
        <LegalList items={[
          "Avviate il bot e verificate il messaggio di startup.",
          "Aprite la posizione reale sulla vostra piattaforma.",
          "Registrate il trade con direzione, Entry e Stop Loss.",
          "Il bot calcola R e i livelli di monitoraggio.",
          "Il bot controlla XAUUSD ogni 0.5 secondi.",
          "Ricevete notifiche solo quando il prezzo attraversa realmente un livello.",
          "Utilizzate livelli personalizzati, status individuali, storico e report quando necessario.",
          "Quando il trade reale è chiuso, rimuovetelo dal monitoraggio.",
        ]} />
      </LegalSection>

      <LegalSection title="2. Gestire fino a 5 trade">
        <p>Il Pro consente di monitorare contemporaneamente fino a 5 posizioni.</p>
        <Command>/long /short — trade 1.
/long2 /short2 — trade 2.
/long3 /short3 — trade 3.
/long4 /short4 — trade 4.
/long5 /short5 — trade 5.
/status — mostra tutti i trade attivi.
/status1 ... /status5 — mostra solo il trade indicato.
/close1 ... /close5 — rimuove il trade indicato.
/closeall — rimuove tutti i trade dal monitoraggio.</Command>
      </LegalSection>

      <LegalSection title="3. Livelli standard e personalizzati">
        <p>Per impostazione standard il bot monitora +0.3R, +0.7R, -0.3R e -0.7R. Con il Pro potete sostituire questi livelli con una configurazione personalizzata per ogni trade.</p>
        <Command>/levels1 0.25 0.5 1 -0.5</Command>
        <p>È possibile impostare fino a 10 livelli per trade. I moltiplicatori possono andare da -10R a +10R.</p>
        <Command>/levels1 ... /levels5 — imposta livelli personalizzati.
/levelsoff1 ... /levelsoff5 — ripristina i livelli standard del singolo trade.
/resetlevels — ripristina i livelli standard su tutti i trade attivi.</Command>
      </LegalSection>

      <LegalSection title="4. Storico delle notifiche">
        <p>Il Pro registra automaticamente le notifiche generate dal monitoraggio. Lo storico contiene le ultime 10 notifiche automatiche, come attraversamenti di livello, alert prezzo e chiusure automatiche di mezzanotte.</p>
        <Command>/history — mostra le ultime 10 notifiche automatiche.
/clearhistory — cancella lo storico.</Command>
        <p>Le risposte ai comandi manuali non vengono inserite nello storico delle notifiche automatiche.</p>
      </LegalSection>

      <LegalSection title="5. Report operativo">
        <p>Con <strong className="font-medium text-ink">/report</strong> ottenete una fotografia sintetica dello stato operativo: numero di trade attivi, trade con mantenimento overnight, alert UP e DOWN attivi e ultimo prezzo di XAUUSD.</p>
        <Command>/report</Command>
      </LegalSection>

      <LegalSection title="6. Mantenimento overnight">
        <p>Il comportamento è identico al Basic, ma può essere gestito su tutti e 5 gli slot.</p>
        <Command>/keep1 ... /keep5 — mantiene il trade indicato overnight.
/unkeep1 ... /unkeep5 — disattiva il mantenimento overnight.
/keepall — attiva il mantenimento per tutti.
/unkeepall — disattiva il mantenimento per tutti.</Command>
      </LegalSection>

      <LegalSection title="7. Alert indipendenti dai trade">
        <Command>/alertup PREZZO — alert quando il prezzo supera il livello.
/alertdown PREZZO — alert quando il prezzo scende sotto il livello.
/alertupoff — rimuove l'alert UP.
/alertdownoff — rimuove l'alert DOWN.
/alertoff — rimuove entrambi.
/alertstatus — mostra gli alert attivi.</Command>
      </LegalSection>

      <LegalSection title="8. Riavvio e continuità operativa">
        <p>Al riavvio, i trade vengono riletti dal file dati e il monitoraggio riprende. Il Pro conserva inoltre lo stato necessario per ripristinare il comportamento del sistema dopo un riavvio.</p>
        <p>La scrittura dei dati è progettata per ridurre il rischio di corruzione del file durante un'interruzione del processo. La gestione dei messaggi Telegram include inoltre meccanismi di coda e ritentativo per una maggiore robustezza operativa.</p>
      </LegalSection>

      <LegalSection title="9. Comandi di servizio">
        <Command>/price — mostra il prezzo attuale di XAUUSD.
/ping — verifica che il bot sia online.
/version — mostra la versione del bot.</Command>
      </LegalSection>

      <LegalSection title="10. Esempio di sessione avanzata">
        <LegalList items={[
          "Aprite più posizioni su XAUUSD.",
          "Registrate fino a 5 trade nei rispettivi slot.",
          "Controllate tutti i trade con /status oppure uno solo con /status3.",
          "Personalizzate i livelli del trade 1 con /levels1.",
          "Usate /report per una panoramica operativa.",
          "Consultate /history per rivedere le ultime notifiche automatiche.",
          "Se cambiate configurazione, usate /levelsoff1 o /resetlevels per tornare ai livelli standard.",
          "Quando le posizioni reali sono chiuse, rimuovete i relativi trade dal monitoraggio.",
        ]} />
      </LegalSection>
    </LegalPageLayout>
  );
}
