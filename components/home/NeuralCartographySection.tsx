'use client';
import { Brain } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { motion } from 'framer-motion';

export default function NeuralCartographySection() {
  return (
    <section id="neural-cartography" className="relative z-10 py-28 md:py-36 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black min-h-screen flex items-center">

      {/* Ambient Glow Orbs — top-right + bottom-left */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#0071e3]/5 blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#7f77dd]/4 blur-[120px]" />
      </div>

      {/* --- BACKGROUND IMAGE (uncomment to enable) ---
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url("/images/neural-bg.jpg")' }}
      />
      --- END BACKGROUND IMAGE --- */}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-7xl mx-auto"
      >
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
         <div>
           <SectionHeader title="Neural Cartography" subtitle="Mapping your habits into an actionable blueprint. Your interaction heatmaps translate into living architecture." align="left" />
         </div>
         <div className="h-[600px] border border-zinc-800 rounded-3xl bg-[#05050A] flex justify-center items-center relative overflow-hidden">
             <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
             <Brain className="w-20 h-20 text-[#0071e3]/50 animate-pulse" />
         </div>
      </div>
      </motion.div>
    </section>
  );
}