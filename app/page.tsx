import HeroSection from "@/components/landing/HeroSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import WorkflowSection from "@/components/landing/WorkflowSection";
import Testimonials from "@/components/landing/Testimonials";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-hidden">
   
      <HeroSection />
      <FeatureGrid />
      <WorkflowSection />
      <Testimonials />
    </main>
  );
}
