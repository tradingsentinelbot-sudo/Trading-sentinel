import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SceneCanvasClientOnly } from "@/components/background/SceneCanvasClientOnly";

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
      <body>
        <SceneCanvasClientOnly />
        {children}
      </body>
    </html>
  );
}
