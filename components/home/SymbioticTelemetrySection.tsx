'use client';
import SectionHeader from './SectionHeader';
import { motion } from 'framer-motion';

export default function SymbioticTelemetrySection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      id="symbiotic-telemetry" 
      className="relative z-10 py-32 bg-zinc-950/80 min-h-screen flex items-center"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full text-center">
         <SectionHeader title="Symbiotic Telemetry" subtitle="Connecting the synapses of your workflow ecosystem." align="center" />
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <BlankShowcaseCard title="Data Ingestion" />
            <BlankShowcaseCard title="Neural Processing" />
            <BlankShowcaseCard title="Visual Output" />
         </div>
      </div>
    </motion.section>
  );
}

function BlankShowcaseCard({ title }: { title: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="h-80 bg-zinc-900/80 rounded-3xl border border-zinc-800 p-8 flex flex-col justify-end group hover:border-[#0071e3]/50 transition-colors duration-500 cursor-crosshair relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#0071e3] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
      <h3 className="text-2xl font-semibold text-white/80 group-hover:text-[#0071e3] transition-colors duration-500 relative z-10">{title}</h3>
    </motion.div>
  );
}