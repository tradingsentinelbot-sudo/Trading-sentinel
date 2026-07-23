import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

/**
 * Problem — crea identificazione (Fase 05.3). Testo ufficiale, non riscritto.
 */
export function Problem() {
  return (
    <Section id="problema" variant="graphite" align="left">
      <RevealOnScroll>
        <div className="max-w-2xl">
          <h2 className="text-section-mobile md:text-section-desktop font-display font-semibold text-ink">
            Il problema non è il mercato.
            <br /><span className="text-[0.64em] leading-[1.08]">È doverlo controllare continuamente.</span>
          </h2>

          <div className="mt-8 flex flex-col gap-4 text-body-mobile md:text-body-desktop text-ink-muted">
            <p>Ogni trader conosce questa situazione.</p>
            <p>Apri una posizione. Imposti Entry, SL e TP.</p>
            <p>Poi devi continuare la giornata.</p>
            <p>
              Il mercato si muove, ma per sapere cosa succede devi tornare continuamente
              davanti al grafico.
            </p>
            <p className="font-medium text-ink">
              Questo consuma tempo, attenzione ed energia mentale.
            </p>
          </div>
        </div>
      </RevealOnScroll>
    </Section>
  );
}
