"use client";

import { motion, type Variants } from "motion/react";
import { fadeUp } from "@/components/motion/variants";

type RevealOnScrollProps = {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  once?: boolean;
};

/**
 * RevealOnScroll — wrapper generico per l'animazione di reveal allo scroll.
 * Pensato per essere riutilizzato da tutte le sezioni (Hero, Problema,
 * Come funziona, scene di Fase 06-B, ...) senza duplicare la logica.
 */
export function RevealOnScroll({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  once = true,
}: RevealOnScrollProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.25 }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
