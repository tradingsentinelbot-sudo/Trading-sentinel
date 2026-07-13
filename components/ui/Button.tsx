"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  as?: "button";
};

/**
 * Button — CTA primaria e secondaria.
 *
 * Primaria: sfondo Sentinel Blue, glow leggero, hover con sollevamento.
 * Secondaria: trasparente, bordo sottile.
 * Rif. Fase 02.5 / 04.13 (Hover Lift).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 rounded-control font-medium",
          "transition-all duration-300 ease-sentinel",
          "focus-visible:outline-none",
          size === "md" && "px-6 py-3 text-[15px]",
          size === "lg" && "px-8 py-4 text-base",
          variant === "primary" && [
            "bg-sentinel-500 text-white shadow-glow-sm",
            "hover:bg-sentinel-400 hover:shadow-glow hover:-translate-y-0.5",
            "active:translate-y-0 active:shadow-glow-sm",
          ],
          variant === "secondary" && [
            "border border-white/15 bg-transparent text-ink",
            "hover:border-white/30 hover:bg-white/[0.04] hover:-translate-y-0.5",
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
