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
 * Primaria: gradiente Sentinel Blue, glow, hover con sollevamento.
 * Secondaria: bordo metallic silver sottile, trasparente.
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sentinel-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian",
          size === "md" && "px-6 py-3 text-[15px]",
          size === "lg" && "px-8 py-4 text-base",
          variant === "primary" && [
            "bg-[#D7DBE0] text-[#0B0D10] shadow-[0_10px_34px_-18px_rgba(215,219,224,0.7)]",
            "hover:bg-[#EEF0F2] hover:shadow-[0_14px_42px_-18px_rgba(215,219,224,0.85)] hover:-translate-y-0.5",
            "active:translate-y-0",
          ],
          variant === "secondary" && [
            "border border-silver/30 bg-white/[0.025] text-ink backdrop-blur-sm",
            "hover:border-silver/55 hover:bg-white/[0.055] hover:-translate-y-0.5",
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
