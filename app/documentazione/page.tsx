import type { Metadata } from "next";
import { LegalPageLayout, LegalSection, LegalList } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Documentazione — Trading Sentinel",
  description: "Manuale utente di Trading Sentinel Pro.",
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
    <LegalPageLayout title="Documentazione" lastUpdated="22 luglio 2026">
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
