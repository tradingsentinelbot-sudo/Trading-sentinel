"use client";

import { useEffect, useState } from "react";
import { DESKTOP_BREAKPOINT } from "@/constants/site";

/**
 * useIsDesktop — true quando la viewport è >= breakpoint desktop.
 * Comportamento identico a quello inline precedentemente in Navbar.tsx
 * (usato lì per chiudere il menu mobile al resize verso desktop).
 */
export function useIsDesktop(breakpoint: number = DESKTOP_BREAKPOINT) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= breakpoint);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isDesktop;
}
