"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/LogoMark";
import { NAV_LINKS } from "@/constants/navigation";
import { useScrolled } from "@/hooks/useScrolled";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { resolveCommercialCTA } from "@/lib/commercialCta";

/**
 * Navbar — orientamento senza distrazione (05.1).
 * Trasparente inizialmente, blur leggero allo scroll, bordo quasi invisibile.
 * Mobile: hamburger con apertura animata, CTA sempre raggiungibile.
 */
export function Navbar() {
  const scrolled = useScrolled();
  const isDesktop = useIsDesktop();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSectionNavigation = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");

    // Le voci della navigazione sono sezioni della homepage. Da una pagina
    // secondaria devono quindi riportare alla home, invece di tentare di
    // cercare un id inesistente nella pagina corrente.
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }

    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
    }, 50);
  };

  // Chiude il menu mobile se la viewport torna desktop (stesso comportamento di prima)
  useEffect(() => {
    if (isDesktop) setMenuOpen(false);
  }, [isDesktop]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-sentinel",
        scrolled
          ? "border-b border-white/[0.06] bg-obsidian/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container-sentinel flex h-16 items-center justify-between md:h-20">
        <a href="/" className="flex items-center gap-2.5" aria-label="Trading Sentinel — Home">
          <LogoMark className="h-7 w-7" />
          <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
            Trading Sentinel
          </span>
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                onClick={() => handleSectionNavigation(link.href)}
                className="text-[14px] font-medium text-ink-muted transition-colors duration-200 hover:text-ink"
              >
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <a
              href="/accedi"
              className="text-[14px] font-medium text-ink-muted transition-colors duration-200 hover:text-ink"
            >
              Accedi
            </a>
          </li>
        </ul>

        <div className="hidden md:block">
          <Button variant="primary" size="md" onClick={() => router.push(resolveCommercialCTA().href)}>
            Inizia Free Trial
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-control text-ink md:hidden"
          aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/[0.06] bg-obsidian/95 backdrop-blur-md md:hidden"
          >
            <ul className="container-sentinel flex flex-col gap-1 py-5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleSectionNavigation(link.href)}
                    className="block w-full rounded-control px-2 py-3 text-left text-[15px] font-medium text-ink-muted transition-colors hover:bg-white/[0.04] hover:text-ink"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/accedi");
                  }}
                  className="block w-full rounded-control px-2 py-3 text-left text-[15px] font-medium text-ink-muted transition-colors hover:bg-white/[0.04] hover:text-ink"
                >
                  Accedi
                </button>
              </li>
              <li className="mt-2">
                <Button variant="primary" size="md" className="w-full" onClick={() => router.push(resolveCommercialCTA().href)}>
                  Inizia Free Trial
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
