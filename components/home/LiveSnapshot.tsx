'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, Brain, Layers3 } from 'lucide-react';

const SNAPSHOT_ITEMS = [
  {
    icon: Brain,
    label: 'Current Persona',
    value: 'Explorer',
    hint: 'Balanced discovery behavior detected',
    color: '#0071e3',
  },
  {
    icon: Activity,
    label: 'Events Tracked Today',
    value: '1,284',
    hint: 'Dwell, click, scroll, and idle signals',
    color: '#22c55e',
  },
  {
    icon: Layers3,
    label: 'Top Section This Hour',
    value: 'Analytics',
    hint: 'Prioritized by engagement score',
    color: '#38bdf8',
  },
];

export default function LiveSnapshot() {
  return (
    <section
      id="live-snapshot"
      className="relative z-10 py-24 md:py-32 overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#0071e3]/5 blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#2997ff]/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-10"
      >
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/25 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#0071e3] uppercase">
              Live Behavioral Snapshot
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Personalization Status Right Now
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            PersonaUI continuously reshapes your workspace from real interaction signals, not static profile settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SNAPSHOT_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-6 hover:border-white/20 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-2">{item.label}</p>
                <p className="text-3xl font-bold text-white mb-2">{item.value}</p>
                <p className="text-sm text-zinc-400">{item.hint}</p>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/demo" className="px-7 py-3 rounded-full bg-[#0071e3] text-white font-semibold hover:brightness-110 transition">
            Open Live Demo
          </Link>
          <Link href="/dashboard" className="px-7 py-3 rounded-full border border-white/20 text-white/85 hover:text-white hover:border-white/40 transition">
            View Dashboard
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
