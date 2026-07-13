import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina class Tailwind evitando conflitti (es. px-4 vs px-6).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
