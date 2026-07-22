import type { Metadata } from "next";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "FAQ Tecniche — Trading Sentinel",
  description: "Risposte tecniche sul funzionamento operativo di Trading Sentinel.",
};

const FAQS = [
  ["Il bot funziona anche quando il telefono è spento?", "Sì. Il bot gira sul server. Il telefono riceve le notifiche Telegram non appena viene riacceso o riconnesso."],
  ["Cosa succede se il bot si riavvia mentre ho trade aperti?", "I trade vengono riletti dal file JSON al riavvio. Il bot riprende il monitoraggio automaticamente. Con il Pro, anche lo stato delle notifiche attese (Y/N) viene ripristinato da file."],
  ["Cosa succede se perdo la connessione internet?", "Il ciclo di monitoraggio genera un errore silenzioso e riprende al ciclo successivo (2 secondi dopo). Non vengono perse notifiche già generate. I dati dei trade non vengono alterati."],
  ["Il bot chiude automaticamente le posizioni reali sulla piattaforma?", "No. Il bot è uno strumento di notifica e monitoraggio. Non interagisce con nessuna piattaforma di trading. Le posizioni reali devono essere chiuse manualmente dall'utente."],
  ["Posso avere più trade sullo stesso asset?", "Sì. Il Basic supporta 3 trade contemporanei, il Pro 5. Possono essere tutti long, tutti short, o una combinazione."],
  ["Cosa succede a mezzanotte se ho trade aperti senza flag overnight?", "Il bot li chiude dal proprio registro (non dalla piattaforma reale) e smette di monitorarli. Invia una notifica \"CHIUSURA AUTOMATICA\" con il dettaglio di cosa è stato chiuso e cosa mantenuto."],
  ["Il bot invia notifiche per ogni ciclo di 2 secondi?", "No. Una notifica viene inviata solo nel momento in cui il prezzo attraversa un livello (transizione da sopra a sotto o viceversa). Se il prezzo resta stabilmente sopra un livello, non arrivano ulteriori notifiche fino al prossimo attraversamento."],
  ["Posso impostare un alert su un livello di prezzo specifico indipendente dai trade?", "/alertup 3400 avvisa quando il prezzo supera 3400. /alertdown 3300 avvisa quando scende sotto 3300. Gli alert scattano una sola volta e vengono rimossi automaticamente."],
  ["Con il Pro, se ho livelli personalizzati e poi cambio idea, come torno ai livelli standard?", "/levelsoff3 ripristina i livelli standard (±0.3R e ±0.7R) per il trade 3. /resetlevels li ripristina su tutti i trade attivi contemporaneamente."],
  ["Lo storico di /history (Pro) contiene anche le risposte ai miei comandi?", "No. Lo storico contiene esclusivamente le notifiche automatiche generate dal bot: superamenti di livello, alert prezzo, chiusure di mezzanotte. Le risposte ai comandi manuali non vengono registrate."],
  ["Cosa mostra /report (Pro)?", "Numero di trade attivi, quali trade hanno il flag overnight attivo, alert prezzo UP e DOWN attivi con i relativi valori, e l'ultimo prezzo di XAUUSD."],
] as const;

export default function TechnicalFaqPage() {
  return (
    <LegalPageLayout title="FAQ Tecniche" lastUpdated="22 luglio 2026">
      {FAQS.map(([question, answer], index) => (
        <LegalSection key={question} title={`D${index + 1}. ${question}`}>
          <p><strong className="font-medium text-ink">R:</strong> {answer}</p>
        </LegalSection>
      ))}
    </LegalPageLayout>
  );
}
