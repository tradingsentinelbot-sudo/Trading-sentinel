import type { Variants } from "motion/react";

/**
 * Varianti Motion condivise tra le sezioni (pacchetto "motion",
 * già "framer-motion"; stessa API, import da "motion/react").
 * Rif. Fase 04.13 — Scroll Motion (reveal, profondità, no effetti gratuiti).
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Contenitore per animazioni "a cascata" (es. griglie di card).
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};
