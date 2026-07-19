import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/**
 * LegalPageLayout — wrapper condiviso dalle tre pagine legali.
 * Tipografia coerente col design system (Section/typography tokens).
 */
export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pb-24 pt-32 md:pt-44">
        <div className="container-sentinel max-w-3xl">
          <h1 className="text-section-mobile md:text-section-desktop font-display font-semibold text-ink">
            {title}
          </h1>
          <p className="mt-3 text-micro text-ink-faint">Ultimo aggiornamento: {lastUpdated}</p>

          <div className="prose-legal mt-12 flex flex-col gap-8">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[19px] font-semibold text-ink md:text-[21px]">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-ink-muted md:text-[16px]">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-ink-muted md:text-[16px]">
          <span aria-hidden className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
