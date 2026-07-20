import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

const PRINCIPLES = [
  {
    title: "Osservazione, non automazione",
    text: "Trading Sentinel non prende posizioni. Guarda il mercato al posto tuo e ti avvisa — l'esecuzione resta sempre una tua decisione.",
  },
  {
    title: "Silenzio come impostazione predefinita",
    text: "Nessuna notifica superflua. Ricevi un messaggio solo quando succede qualcosa che hai già deciso essere rilevante.",
  },
  {
    title: "Precisione sopra la quantità",
    text: "Un livello monitorato con attenzione vale più di dieci alert generici. Il sistema è costruito attorno ai parametri che imposti tu, non a segnali automatici.",
  },
];

/**
 * Methodology — approccio/filosofia del prodotto ("Quiet Technology").
 */
export function Methodology() {
  return (
    <Section
      id="metodologia"
      variant="dark"
      align="left"
      eyebrow="Il nostro approccio"
      title="Quiet Technology"
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-16">
        <RevealOnScroll>
          <p className="text-body-mobile md:text-body-desktop text-ink-muted">
            Trading Sentinel è costruito attorno a un'idea semplice: la tecnologia migliore è
            quella che si nota solo quando serve davvero.
          </p>
        </RevealOnScroll>

        <div className="flex flex-col gap-8">
          {PRINCIPLES.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 0.08}>
              <div className="border-l border-silver/20 pl-6">
                <h3 className="text-[16px] font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{p.text}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </Section>
  );
}
