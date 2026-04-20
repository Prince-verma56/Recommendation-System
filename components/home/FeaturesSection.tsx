'use client';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Fingerprint, Clock, AlertCircle, Mic, Activity, Cpu } from 'lucide-react';

const features = [
  {
    id: 'fingerprint',
    icon: Fingerprint,
    title: 'Behavioral Fingerprinting',
    description: '12+ signals analyzed in real‑time',
    detail: 'Scroll speed, dwell, idle',
    position: 'top-left',
    color: '#0071e3',
  },
  {
    id: 'time',
    icon: Clock,
    title: 'Time‑of‑Day Intelligence',
    description: 'Anticipates your 9am workflow',
    detail: 'Learns in <3 sessions',
    position: 'top-right',
    color: '#2997ff',
  },
  {
    id: 'confusion',
    icon: AlertCircle,
    title: 'Confusion Detection',
    description: 'Proactive help before you ask',
    detail: 'Responds <200ms',
    position: 'bottom-left',
    color: '#3b82f6',
  },
  {
    id: 'narration',
    icon: Mic,
    title: 'AI Narration',
    description: 'Every change explained in plain English',
    detail: 'Powered by ElevenLabs',
    position: 'bottom-right',
    color: '#60a5fa',
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const nodeVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

const lineVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 0.4, transition: { duration: 1.2, ease: 'easeInOut' } },
};

export default function FeaturesSection() {
  return (
    <section
      id="intelligence"
      className="relative z-10 py-28 md:py-48 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black min-h-screen flex items-center"
    >
      {/* Ambient Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#0071e3]/5 blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#2997ff]/5 blur-[120px]" />
      </div>

      {/* Central Core Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0071e3]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header - minimal, integrated into the core concept */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Cpu className="w-4 h-4 text-[#0071e3]" />
            <span className="text-xs tracking-[0.2em] text-zinc-400 uppercase font-medium">
              Behavioral Inference Engine
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0071e3] to-[#60a5fa]">
              Intelligence
            </span>{' '}
            at the Core
          </h2>
        </motion.div>

        {/* The "Neural Hub" Layout */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Left Side: Central Visual Hub */}
          <motion.div
            className="relative w-full lg:w-5/12 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Pulsing Core */}
            <div className="relative">
              <motion.div
                className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-[#0071e3]/20 to-[#2997ff]/20 border border-[#0071e3]/30 backdrop-blur-sm flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Activity className="w-16 h-16 md:w-20 md:h-20 text-[#0071e3]" />
              </motion.div>
              {/* Orbiting Rings */}
              <motion.div
                className="absolute inset-0 rounded-full border border-[#0071e3]/20"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute -inset-4 rounded-full border border-[#2997ff]/10"
                animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Connecting Lines (SVG) - visible on larger screens */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
              viewBox="0 0 400 400"
              preserveAspectRatio="xMidYMid meet"
            >
              <motion.path
                d="M200,200 L80,80"
                stroke="#0071e3"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
                variants={lineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              />
              <motion.path
                d="M200,200 L320,80"
                stroke="#2997ff"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
                variants={lineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              />
              <motion.path
                d="M200,200 L80,320"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
                variants={lineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              />
              <motion.path
                d="M200,200 L320,320"
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
                variants={lineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              />
            </svg>
          </motion.div>

          {/* Right Side: Feature Nodes (2x2 Grid) */}
          <motion.div
            className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  variants={nodeVariants}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="group relative bg-zinc-900/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6 hover:border-[#0071e3]/50 transition-all duration-500 overflow-hidden"
                >
                  {/* Colored accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
                    style={{
                      background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                    }}
                  />

                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500"
                      style={{
                        backgroundColor: `${feature.color}20`,
                        borderColor: `${feature.color}40`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: feature.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-zinc-400 mb-3">{feature.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: feature.color }}
                        />
                        <span className="text-zinc-500">{feature.detail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Animated signal lines on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#0071e3]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom status bar - live signal indicator */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-zinc-900/50 border border-white/10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0071e3] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0071e3]" />
            </span>
            <span className="text-xs text-zinc-400">
              <span className="text-white font-medium">12+ signals</span> processed in real‑time
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-500">Updated 2s ago</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
