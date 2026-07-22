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
            "button-metal-primary text-ink shadow-[0_14px_44px_-20px_rgba(0,0,0,0.82)]",
            "hover:shadow-[0_18px_52px_-18px_rgba(0,0,0,0.9)] hover:-translate-y-0.5",
            "active:translate-y-0",
          ],
          variant === "secondary" && [
            "button-metal-secondary text-ink backdrop-blur-sm",
            "hover:border-steel-blue/70 hover:bg-steel-blue/[0.10] hover:-translate-y-0.5",
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
