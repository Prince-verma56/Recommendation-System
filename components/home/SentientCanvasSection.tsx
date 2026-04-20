'use client';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { motion } from 'framer-motion';

export default function SentientCanvasSection() {
  return (
    <section id="sentient-canvas" className="relative z-10 py-28 md:py-36 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-zinc-950 via-black to-zinc-950 min-h-screen flex items-center">

      {/* Ambient Glow Orbs — top-left + bottom-right */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#0071e3]/5 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#2997ff]/4 blur-[120px]" />
      </div>

      {/* --- BACKGROUND IMAGE (uncomment to enable) ---
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url("/images/canvas-bg.jpg")' }}
      />
      --- END BACKGROUND IMAGE --- */}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-7xl mx-auto"
      >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
         <SectionHeader
           title="The Sentient Canvas"
           subtitle="PersonaUI promotes the modules you need most right now, then fades distractions into the background as your intent shifts."
           align="left"
         />
         <div className="w-full h-[500px] border border-white/10 rounded-3xl bg-black/40 backdrop-blur-xl flex justify-center items-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-tr from-[#0071e3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <Eye className="w-16 h-16 text-zinc-600 group-hover:text-[#0071e3] transition-colors duration-700" />
         </div>
         <div className="mt-8 flex flex-wrap gap-4">
           <Link href="/demo" className="px-6 py-3 rounded-full bg-[#0071e3] text-white font-semibold hover:brightness-110 transition">
             Watch It Adapt
           </Link>
           <Link href="/sign-in" className="px-6 py-3 rounded-full border border-white/20 text-white/85 hover:text-white hover:border-white/40 transition">
             Sign In To Personalize
           </Link>
         </div>
      </div>
      </motion.div>
    </section>
  );
}
