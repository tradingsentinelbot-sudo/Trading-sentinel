import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  id?: string;
  variant?: "dark" | "graphite" | "spotlight";
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
};

/**
 * Section — contenitore base per mantenere coerenza tra le sezioni (04.4).
 * Varianti: dark (obsidian), graphite, spotlight (glow radiale accentuato).
 */
export function Section({
  id,
  variant = "dark",
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative section-padding overflow-hidden",
        variant === "dark" && "bg-transparent",
        variant === "graphite" && "bg-graphite/35",
        variant === "spotlight" && "bg-transparent",
        className
      )}
      {...props}
    >
      {variant === "spotlight" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(61,125,250,0.12)_0%,rgba(10,11,13,0)_70%)]"
        />
      )}

      <div className="container-sentinel relative">
        {(eyebrow || title || subtitle) && (
          <div
            className={cn(
              "mb-14 flex max-w-2xl flex-col gap-4",
              align === "center" && "mx-auto items-center text-center",
              align === "left" && "items-start text-left"
            )}
          >
            {eyebrow && (
              <span className="text-micro font-medium uppercase tracking-[0.14em] text-sentinel-400">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-section-mobile md:text-section-desktop font-display font-semibold text-ink">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-body-mobile md:text-body-desktop text-ink-muted">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
