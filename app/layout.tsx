import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Sistema 3D (SceneCanvas + Digital Sculpture) congelato su richiesta
// esplicita: design in attesa di revisione con strumenti di verifica
// visiva adeguati. Codice preservato in components/background/, non
// rimosso. Per riattivarlo: reintrodurre l'import e <SceneCanvasClientOnly />.
// import { SceneCanvasClientOnly } from "@/components/background/SceneCanvasClientOnly";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Nota: metadata SEO definitiva verrà completata in Fase 07.15
export const metadata: Metadata = {
  title: "Trading Sentinel — Monitora il tuo trade, senza restare davanti al grafico",
  description:
    "Trading Sentinel controlla il prezzo dell'Oro in tempo reale e ti invia notifiche operative direttamente su Telegram quando vengono raggiunti livelli importanti.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
