import { cn } from "@/lib/utils";

type StatusIndicatorProps = {
  label: string;
  tone?: "active" | "neutral";
  className?: string;
};

/**
 * StatusIndicator — elemento puramente visuale che comunica continuità
 * operativa (es. "Sentinel Active", "Monitoring XAUUSD").
 * Non rappresenta dati reali (rif. 04.11).
 */
export function StatusIndicator({ label, tone = "active", className }: StatusIndicatorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-micro text-ink-muted",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-pulse-glow rounded-full",
            tone === "active" ? "bg-positive" : "bg-ink-faint"
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            tone === "active" ? "bg-positive" : "bg-ink-faint"
          )}
        />
      </span>
      {label}
    </div>
  );
}
