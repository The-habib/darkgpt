import Header from "@/components/Header";
import LandingHero from "@/components/LandingHero";
import ProductPreview from "@/components/ProductPreview";
import FeatureGrid from "@/components/FeatureGrid";
import PhilosophySection from "@/components/PhilosophySection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      <Header />
      <main className="flex-1">
        <LandingHero />
        <ProductPreview />
        <FeatureGrid />
        <PhilosophySection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
