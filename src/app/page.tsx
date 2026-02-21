import { Header }       from "@/sections/Header";
import { Hero }         from "@/sections/Hero";
import { Features }     from "@/sections/Features";
import { Locations }    from "@/sections/Locations";
import { FAQ }          from "@/sections/FAQ";
import { AuroraFooter } from "@/sections/AuroraFooter";

export default function Home() {
  return (
    <main style={{ backgroundColor: '#000' }}>
      <Header />
      <Hero />
      <Features />
      <Locations />
      <FAQ />
      <AuroraFooter />

    </main>
  );
}
