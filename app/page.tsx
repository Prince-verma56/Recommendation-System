import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CognitiveRhythmSection from '@/components/home/CognitiveRhythmSection';
import BehavioralMetricsRings from '@/components/home/BehavioralMetricsRings';
import NeuralCartographySection from '@/components/home/NeuralCartographySection';
import LiveSnapshot from '@/components/home/LiveSnapshot';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';
import SideNav from '@/components/home/SideNav';

const SentientCanvasSection = dynamic(() => import('@/components/home/SentientCanvasSection'), {
  loading: () => <section className="min-h-[60vh] bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />,
});
const HowItWorksSection = dynamic(() => import('@/components/home/HowItWorksSection'), {
  loading: () => <section className="min-h-[60vh] bg-gradient-to-b from-black via-zinc-950 to-black" />,
});
const SymbioticTelemetrySection = dynamic(() => import('@/components/home/SymbioticTelemetrySection'), {
  loading: () => <section className="min-h-[60vh] bg-gradient-to-b from-black via-zinc-950 to-black" />,
});
const IntegrationSection = dynamic(() => import('@/components/home/IntegrationSection'), {
  loading: () => <section className="min-h-[60vh] bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />,
});
const BehaviorShowcaseSection = dynamic(() => import('@/components/home/BehaviorShowcaseSection'), {
  loading: () => <section className="min-h-[60vh] bg-gradient-to-b from-black via-zinc-950 to-black" />,
});
const TechStackScroller = dynamic(() => import('@/components/home/TechStackScroller'), {
  loading: () => <section className="min-h-[45vh] bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />,
});

export default function Home() {
  return (
    <main className="relative bg-black text-white selection:bg-[#0071e3]/30 selection:text-white">
      <SideNav />
      <HeroSection />
      <FeaturesSection />
      <CognitiveRhythmSection />
      <BehavioralMetricsRings />
      <LiveSnapshot />
      <NeuralCartographySection />
      <SentientCanvasSection />
      <HowItWorksSection />
      <SymbioticTelemetrySection />
      <IntegrationSection />
      <BehaviorShowcaseSection />
      <TechStackScroller />
      <CTASection />
      <Footer />
    </main>
  );
}
