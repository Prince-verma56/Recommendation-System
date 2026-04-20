'use client';
import { motion } from 'framer-motion';
import { Fingerprint, Clock, AlertCircle, Mic } from 'lucide-react';

const features = [
  {
    icon: <Fingerprint className="w-6 h-6" />,
    title: 'Behavioral Fingerprinting',
    description:
      'We analyze scroll speed, dwell time, and idle patterns to build your unique behavioral persona — updated every session.',
    detail: 'Tracks 12+ signals',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Time-of-Day Intelligence',
    description:
      'Your dashboard anticipates your 9am stats check and automatically reorders widgets before you even open the app.',
    detail: 'Learns in < 3 sessions',
  },
  {
    icon: <AlertCircle className="w-6 h-6" />,
    title: 'Confusion Detection',
    description:
      'Paused too long on an element? PersonaUI surfaces contextual help and rearranges to reduce friction — before you ask.',
    detail: 'Responds in < 200ms',
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: 'AI Narration',
    description:
      'Every layout adaptation is narrated in plain English by an AI voice, explaining exactly why your UI just changed.',
    detail: 'Powered by ElevenLabs',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function FeaturesSection() {
  return (
    <section id="intelligence" className="relative z-10 py-28 md:py-36 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
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

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative bg-zinc-900/40 backdrop-blur-sm border border-white/8 rounded-2xl p-7 hover:border-[#0071e3]/40 transition-colors duration-500 overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0071e3]/0 to-[#0071e3]/0 group-hover:from-[#0071e3]/5 group-hover:to-transparent transition-all duration-700 rounded-2xl" />

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#0071e3]/20 border border-[#0071e3]/30 flex items-center justify-center text-[#0071e3] mb-6 group-hover:bg-[#0071e3]/30 group-hover:scale-110 transition-all duration-500">
                {f.icon}
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light mb-5">
                {f.description}
              </p>

              {/* Detail chip */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="w-1 h-1 rounded-full bg-[#0071e3]" />
                <span className="text-[11px] text-zinc-500 font-medium">{f.detail}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}