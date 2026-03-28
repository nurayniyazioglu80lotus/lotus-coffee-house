import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import ExperienceSection from "@/components/home/ExperienceSection";
import AnnouncementsPreview from "@/components/home/AnnouncementsPreview";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import SignatureBanner from "@/components/home/SignatureBanner";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="site-shell">
      <Header />
      <Hero />
      <ExperienceSection />
      <AnnouncementsPreview />
      <FeaturedProducts />
      <SignatureBanner />
      <Footer />
    </main>
  );
}