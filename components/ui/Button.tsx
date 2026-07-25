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
          "sentinel-button group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[6px] font-medium",
          "transition-all duration-300 ease-sentinel",
          "before:pointer-events-none before:absolute before:inset-y-[-20%] before:left-[-28%] before:w-[12%] before:skew-x-[-18deg] before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_18%,rgba(255,255,255,0.78)_48%,rgba(255,255,255,0.18)_68%,transparent_100%)] before:opacity-0 before:transition-[left,opacity] before:duration-[520ms] before:ease-out before:content-[\"\"] group-hover:before:left-[125%] group-hover:before:opacity-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sentinel-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian",
          size === "md" && "px-6 py-3 text-[15px]",
          size === "lg" && "px-8 py-4 text-base",
          variant === "primary" && [
            "border border-white/55 bg-[linear-gradient(110deg,#8f98a4_0%,#d7dbe0_18%,#f1f3f5_34%,#aeb6c0_52%,#e4e7ea_70%,#8b949f_100%)] text-[#0B0D10] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(45,50,58,0.28),0_10px_34px_-18px_rgba(215,219,224,0.72)]",
            "hover:brightness-[1.06] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.86),inset_0_-1px_0_rgba(45,50,58,0.22),0_14px_42px_-18px_rgba(215,219,224,0.9)] hover:-translate-y-0.5",
            "active:translate-y-0",
          ],
          variant === "secondary" && [
            "border border-silver/35 bg-[linear-gradient(110deg,rgba(127,137,150,0.16),rgba(231,235,240,0.08),rgba(127,137,150,0.14))] text-ink backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_24px_-18px_rgba(199,204,212,0.55)]",
            "hover:border-silver/65 hover:bg-[linear-gradient(110deg,rgba(127,137,150,0.22),rgba(231,235,240,0.14),rgba(127,137,150,0.2))] hover:-translate-y-0.5",
          ],
          className
        )}
        {...props}
      >
        <span className="relative z-[1]">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
