'use client';
import { Eye } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { motion } from 'framer-motion';

export default function SentientCanvasSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      id="sentient-canvas" 
      className="relative z-10 py-32 bg-zinc-900/20 border-y border-white/5 min-h-screen flex items-center"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
         <SectionHeader title="The Sentient Canvas" subtitle="An interface that feels and thinks. Placeholder section ready for your creative injection." align="left" />
         <div className="w-full h-[500px] border border-white/10 rounded-3xl bg-black/40 backdrop-blur-xl flex justify-center items-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-tr from-[#0071e3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <Eye className="w-16 h-16 text-zinc-600 group-hover:text-[#0071e3] transition-colors duration-700" />
         </div>
      </div>
    </motion.section>
  );
}