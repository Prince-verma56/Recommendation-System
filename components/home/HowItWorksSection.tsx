'use client';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Fingerprint, Clock, AlertCircle, Mic, Sparkles } from 'lucide-react';

const features = [
  {
    icon: <Fingerprint className="w-7 h-7" />,
    title: 'Behavioral Fingerprinting',
    description:
      'We analyze scroll speed, dwell time, and idle patterns to build your unique behavioral persona — updated every session.',
    detail: 'Tracks 12+ signals',
    size: 'large',
  },
  {
    icon: <Clock className="w-7 h-7" />,
    title: 'Time-of-Day Intelligence',
    description:
      'Your dashboard anticipates your 9am stats check and automatically reorders widgets before you even open the app.',
    detail: 'Learns in < 3 sessions',
    size: 'medium',
  },
  {
    icon: <AlertCircle className="w-7 h-7" />,
    title: 'Confusion Detection',
    description:
      'Paused too long on an element? PersonaUI surfaces contextual help and rearranges to reduce friction — before you ask.',
    detail: 'Responds in < 200ms',
    size: 'medium',
  },
  {
    icon: <Mic className="w-7 h-7" />,
    title: 'AI Narration',
    description:
      'Every layout adaptation is narrated in plain English by an AI voice, explaining exactly why your UI just changed.',
    detail: 'Powered by ElevenLabs',
    size: 'wide',
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function FeaturesSection() {
  return (
    <section
      id="process"
      className="relative z-10 py-28 md:py-36 px-6 md:px-10 overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black"
    >
      {/* Ambient Glow Orbs — top-right + bottom-left */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#0071e3]/5 blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#2997ff]/5 blur-[120px]" />
      </div>

      {/* Central subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0071e3]/3 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
            <span className="text-xs tracking-[0.25em] text-zinc-400 uppercase font-medium">
              Core Intelligence
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            The Engine Behind the Magic
          </h2>
          <p className="text-zinc-400 text-xl font-light max-w-2xl mx-auto">
            PersonaUI isn't a settings panel — it's a behavioral inference engine that watches, learns, and acts.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-min"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Feature 1 - Large Card (spans 2 columns, 2 rows) */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="lg:col-span-2 lg:row-span-2 group relative bg-zinc-900/40 backdrop-blur-sm border border-white/8 rounded-3xl p-8 hover:border-[#0071e3]/40 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0071e3]/0 to-[#0071e3]/0 group-hover:from-[#0071e3]/5 group-hover:to-transparent transition-all duration-700 rounded-3xl" />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#0071e3]/20 border border-[#0071e3]/30 flex items-center justify-center text-[#0071e3] group-hover:bg-[#0071e3]/30 group-hover:scale-110 transition-all duration-500">
                  <Fingerprint className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span className="text-xs font-medium text-[#0071e3]">Primary Signal</span>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-4">Behavioral Fingerprinting</h3>
              <p className="text-zinc-400 text-base leading-relaxed font-light mb-6 max-w-md">
                We analyze scroll speed, dwell time, and idle patterns to build your unique behavioral persona — updated every session.
              </p>

              {/* Visual indicator - mini sparkline or dots */}
              <div className="mt-auto flex items-center gap-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
                  <span className="text-xs text-zinc-500 font-medium">Tracks 12+ signals</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-[#0071e3]/50 to-transparent" />
              </div>

              {/* Decorative waveform */}
              <div className="absolute bottom-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                <svg width="120" height="40" viewBox="0 0 120 40">
                  <path d="M0,20 Q10,5 20,20 T40,20 T60,20 T80,20 T100,20 T120,20" fill="none" stroke="#0071e3" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Feature 2 - Medium */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="lg:col-span-1 group relative bg-zinc-900/40 backdrop-blur-sm border border-white/8 rounded-2xl p-6 hover:border-[#0071e3]/40 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0071e3]/0 to-[#0071e3]/0 group-hover:from-[#0071e3]/5 group-hover:to-transparent transition-all duration-700 rounded-2xl" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#0071e3]/20 border border-[#0071e3]/30 flex items-center justify-center text-[#0071e3] mb-5 group-hover:bg-[#0071e3]/30 group-hover:scale-110 transition-all duration-500">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Time-of-Day Intelligence</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light mb-5">
                Your dashboard anticipates your 9am stats check and automatically reorders widgets before you even open the app.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="w-1 h-1 rounded-full bg-[#0071e3]" />
                <span className="text-[11px] text-zinc-500 font-medium">Learns in &lt; 3 sessions</span>
              </div>
            </div>
          </motion.div>

          {/* Feature 3 - Medium */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="lg:col-span-1 group relative bg-zinc-900/40 backdrop-blur-sm border border-white/8 rounded-2xl p-6 hover:border-[#0071e3]/40 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0071e3]/0 to-[#0071e3]/0 group-hover:from-[#0071e3]/5 group-hover:to-transparent transition-all duration-700 rounded-2xl" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#0071e3]/20 border border-[#0071e3]/30 flex items-center justify-center text-[#0071e3] mb-5 group-hover:bg-[#0071e3]/30 group-hover:scale-110 transition-all duration-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Confusion Detection</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light mb-5">
                Paused too long on an element? PersonaUI surfaces contextual help and rearranges to reduce friction — before you ask.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="w-1 h-1 rounded-full bg-[#0071e3]" />
                <span className="text-[11px] text-zinc-500 font-medium">Responds in &lt; 200ms</span>
              </div>
            </div>
          </motion.div>

          {/* Feature 4 - Wide (spans full width) */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
            className="lg:col-span-2 group relative bg-zinc-900/40 backdrop-blur-sm border border-white/8 rounded-2xl p-6 hover:border-[#0071e3]/40 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0071e3]/0 via-[#0071e3]/5 to-[#0071e3]/0 opacity-0 group-hover:opacity-100 transition-all duration-700" />
            
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-[#0071e3]/20 border border-[#0071e3]/30 flex items-center justify-center text-[#0071e3] group-hover:bg-[#0071e3]/30 group-hover:scale-110 transition-all duration-500 shrink-0">
                <Mic className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">AI Narration</h3>
                  <div className="h-4 w-px bg-white/20" />
                  <span className="text-xs text-zinc-500">Powered by ElevenLabs</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed font-light">
                  Every layout adaptation is narrated in plain English by an AI voice, explaining exactly why your UI just changed.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-10 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/30 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-[#0071e3] animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
