'use client';
import { Activity } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { motion } from 'framer-motion';

export default function CognitiveRhythmSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      id="cognitive-rhythm" 
      className="relative z-10 py-32 px-6 md:px-12 max-w-7xl mx-auto min-h-screen flex items-center"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
         <div className="order-2 lg:order-1 h-[600px] border border-white/10 rounded-3xl bg-zinc-950/50 flex justify-center items-center shadow-2xl relative">
            <div className="absolute w-[200px] h-[200px] bg-[#0071e3]/20 rounded-full blur-[100px]" />
            <Activity className="w-16 h-16 text-zinc-600" />
         </div>
         <div className="order-1 lg:order-2">
           <SectionHeader title="Cognitive Rhythm" subtitle="Pacing your workflow dynamically. The UI speeds up when you're focused, and slows down when you're exploring. Replace this entirely with your vision." align="left" />
         </div>
      </div>
    </motion.section>
  );
}