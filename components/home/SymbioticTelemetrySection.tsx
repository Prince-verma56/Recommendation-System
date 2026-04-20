'use client';
import SectionHeader from './SectionHeader';
import { motion } from 'framer-motion';

export default function SymbioticTelemetrySection() {
  return (
    <section id="symbiotic-telemetry" className="relative z-10 py-28 md:py-36 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black min-h-screen flex items-center">

      {/* Ambient Glow Orbs — alternate sides */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#0071e3]/5 blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#2997ff]/5 blur-[120px]" />
      </div>

      {/* --- BACKGROUND IMAGE (uncomment to enable) ---
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url("/images/telemetry-bg.jpg")' }}
      />
      --- END BACKGROUND IMAGE --- */}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-7xl mx-auto"
      >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full text-center">
         <SectionHeader
           title="Symbiotic Telemetry"
           subtitle="Signals flow from interaction to inference to UI adaptation in one closed-loop pipeline."
           align="center"
         />
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <BlankShowcaseCard title="Signal Capture" description="PersonaUI captures dwell, scroll depth, idle windows, and click intent in real time." />
            <BlankShowcaseCard title="Behavioral Inference" description="Convex scoring turns raw interaction streams into persona and section-priority predictions." />
            <BlankShowcaseCard title="Adaptive Rendering" description="The dashboard updates hierarchy, emphasis, and guidance cues without disrupting flow." />
         </div>
      </div>
      </motion.div>
    </section>
  );
}

function BlankShowcaseCard({ title, description }: { title: string; description: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="h-80 bg-zinc-900/80 rounded-3xl border border-zinc-800 p-8 flex flex-col justify-end group hover:border-[#0071e3]/50 transition-colors duration-500 cursor-crosshair relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#0071e3] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
      <h3 className="text-2xl font-semibold text-white/80 group-hover:text-[#0071e3] transition-colors duration-500 relative z-10">{title}</h3>
      <p className="text-sm text-zinc-500 mt-3 leading-relaxed relative z-10">{description}</p>
    </motion.div>
  );
}
