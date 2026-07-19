import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        {/*
          Le sezioni successive (Problema, Cos'è, Come funziona, ...)
          vengono aggiunte in questo file una alla volta, fase per fase,
          secondo l'ordine definito in Fase 07.5.
        */}
      </main>
      <Footer />
    </>
  );
}
