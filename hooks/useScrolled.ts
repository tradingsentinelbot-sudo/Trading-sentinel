"use client";

import { useEffect, useState } from "react";
import { NAVBAR_SCROLL_THRESHOLD } from "@/constants/site";

/**
 * useScrolled — true quando la pagina ha superato la soglia di scroll indicata.
 * Comportamento identico a quello inline precedentemente in Navbar.tsx.
 */
export function useScrolled(threshold: number = NAVBAR_SCROLL_THRESHOLD) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
