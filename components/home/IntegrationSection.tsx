'use client';
import SectionHeader from './SectionHeader';
import { motion } from 'framer-motion';

export default function IntegrationSection() {
  return (
    <section id="integration" className="relative z-10 py-28 md:py-36 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border-y border-white/5">

      {/* Ambient Glow Orbs — subtle centers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#0071e3]/5 blur-[130px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#2997ff]/4 blur-[130px]" />
      </div>

      {/* --- BACKGROUND IMAGE (uncomment to enable) ---
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: 'url("/images/integration-bg.jpg")' }}
      />
      --- END BACKGROUND IMAGE --- */}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-7xl mx-auto"
      >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeader title="Seamless Integration" subtitle="Connect PersonaUI to your workflow in minutes and start adapting with real interaction data." align="center" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mt-16">
          <StepCard number="1" title="Connect" text="Sign in with Clerk and attach PersonaUI tracking to your dashboard surface." />
          <StepCard number="2" title="Learn" text="Convex aggregates live signals and continuously updates your active behavior profile." />
          <StepCard number="3" title="Adapt" text="Layouts, emphasis, and guidance cues re-order automatically for your current intent." />
        </div>
      </div>
      </motion.div>
    </section>
  );
}

function StepCard({ number, title, text }: { number: string; title: string, text: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl flex items-center justify-center mb-8 text-3xl font-bold text-[#0071e3]">
        {number}
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-white">{title}</h3>
      <p className="text-zinc-400 font-light leading-relaxed">{text}</p>
    </div>
  );
}
