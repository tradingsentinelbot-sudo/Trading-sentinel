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
            "border border-[#8f98a4]/70 bg-[linear-gradient(110deg,#4d5661_0%,#7d8793_18%,#aeb6c0_34%,#65707c_52%,#929ca7_70%,#46505b_100%)] text-[#0B0D10] shadow-[inset_0_1px_0_rgba(255,255,255,0.42),inset_0_-1px_0_rgba(20,24,29,0.42),0_8px_26px_-18px_rgba(127,137,150,0.48)]",
            "hover:brightness-[1.08] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.58),inset_0_-1px_0_rgba(20,24,29,0.34),0_12px_32px_-18px_rgba(127,137,150,0.64)] hover:-translate-y-0.5",
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
