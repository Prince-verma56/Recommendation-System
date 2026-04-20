import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import BehaviorShowcaseSection from '@/components/home/BehaviorShowcaseSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';
import SideNav from '@/components/home/SideNav';

export default function Home() {
  return (
    <main className="relative bg-black text-white selection:bg-[#0071e3]/30 selection:text-white">
      <SideNav />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BehaviorShowcaseSection />
      <CTASection />
      <Footer />
    </main>
  );
}
