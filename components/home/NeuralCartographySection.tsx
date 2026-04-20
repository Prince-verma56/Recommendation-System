'use client';
import { Brain } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { motion } from 'framer-motion';

export default function NeuralCartographySection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      id="neural-cartography" 
      className="relative z-10 py-32 px-6 md:px-12 max-w-7xl mx-auto min-h-screen flex items-center"
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
    </motion.section>
  );
}