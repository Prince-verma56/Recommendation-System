'use client';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Connect',
    description:
      'Sign in with Clerk. A lightweight behavioral tracker begins observing your interactions — clicks, dwell time, scroll velocity, idle pauses.',
    accent: 'After login',
  },
  {
    num: '02',
    title: 'Learn',
    description:
      'Convex processes your signals in real-time and builds a persona score: Focus Mode, Exploration Mode, or Power Mode. Updates every session.',
    accent: '< 3 sessions',
  },
  {
    num: '03',
    title: 'Adapt',
    description:
      'Your dashboard widgets reorder, resize, and reconfigure automatically. The AI narrates each change so you always know why the UI just shifted.',
    accent: 'Real-time',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative z-10 py-28 md:py-36 px-6 md:px-12 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-xs tracking-[0.25em] text-zinc-400 uppercase font-medium">
              The Process
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            How PersonaUI Works
          </h2>
          <p className="text-zinc-400 text-xl font-light max-w-xl mx-auto">
            From first login to a fully adapted workspace — in three invisible steps.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-px">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0071e3]/40 to-transparent" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0071e3] to-transparent opacity-60"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 1.2, ease: 'easeInOut' }}
                style={{ originX: 0 }}
              />
            </div>
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.18, duration: 0.6 }}
              className="relative flex flex-col items-center text-center px-6 md:px-10"
            >
              {/* Number badge */}
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-3xl bg-zinc-900/80 backdrop-blur-sm border border-white/10 flex items-center justify-center group hover:border-[#0071e3]/50 transition-colors duration-500">
                  <span className="text-5xl font-bold text-[#0071e3] opacity-80 group-hover:opacity-100 transition-opacity tabular-nums">
                    {step.num}
                  </span>
                </div>
                {/* Glow below badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#0071e3]/20 blur-xl rounded-full" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-zinc-400 text-[15px] leading-relaxed font-light mb-6 max-w-xs">
                {step.description}
              </p>

              {/* Accent chip */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/25">
                <span className="w-1 h-1 rounded-full bg-[#0071e3] animate-pulse" />
                <span className="text-[11px] text-[#0071e3] font-medium tracking-wide">{step.accent}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
