import { Features } from "@/sections/Features";
import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { Footer } from "@/sections/Footer";
import { FAQ } from "@/sections/FAQ";
import { Aurora } from "@/sections/Background";
import { Locations } from "@/sections/Locations";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Aurora в самом низу страницы */}
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none h-[600px]">
        <Aurora />
      </div>

      {/* Основной контент поверх фонов */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <Features />
        <Locations />
        <FAQ />
        <Footer />
      </div>
    </main>
  );
}