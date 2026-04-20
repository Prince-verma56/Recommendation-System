'use client';
import SectionHeader from './SectionHeader';
import { motion } from 'framer-motion';

export default function IntegrationSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      id="integration" 
      className="relative z-10 py-32 bg-zinc-900/40 border-y border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeader title="Seamless Integration" subtitle="Experience the future of personalized interfaces in three simple steps." align="center" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mt-16">
          <StepCard number="1" title="Initialize" text="Deploy the intelligence layer into your existing environment effortlessly." />
          <StepCard number="2" title="Observe" text="The agent silently maps your usage patterns and bottleneck zones." />
          <StepCard number="3" title="Transform" text="Experience an interface that reorganizes structurally for maximum efficiency." />
        </div>
      </div>
    </motion.section>
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