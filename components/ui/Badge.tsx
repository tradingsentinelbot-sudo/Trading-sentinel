import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "accent";
};

/**
 * Badge — pillola informativa (es. Hero: "XAUUSD Trading Assistant").
 */
export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-micro font-medium tracking-wide",
        "border backdrop-blur-sm",
        variant === "default" && "border-white/10 bg-white/[0.04] text-ink-muted",
        variant === "accent" && "border-sentinel-500/30 bg-sentinel-500/[0.08] text-sentinel-400",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
