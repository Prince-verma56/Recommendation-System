'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

const PERSONAS = [
  {
    icon: '🧭',
    title: 'Explorer',
    subtitle: 'Balanced & Discovery-First',
    tagline: 'Curiosity-driven navigation',
    accentColor: '#0071e3',
    description:
      'You prefer a balanced layout with equal attention across sections. PersonaUI orders your space by exploration patterns, surfacing new content alongside your regulars.',
    traits: [
      { label: 'Dwell', value: 'Moderate', bar: 55 },
      { label: 'Scroll', value: 'Varied', bar: 65 },
      { label: 'Focus', value: 'Broad', bar: 40 },
    ],
    features: ['Moderate dwell time', 'Varied section visits', 'Discovery panels prioritized'],
  },
  {
    icon: '⚡',
    title: 'Quick Scanner',
    subtitle: 'Speed & Highlights',
    tagline: 'Glance-optimized interface',
    accentColor: '#00c2ff',
    description:
      'You scan rapidly and want key numbers front and center. Big metrics surface first, summaries replace details, and navigation stays minimal to keep you moving.',
    traits: [
      { label: 'Dwell', value: 'Short', bar: 20 },
      { label: 'Scroll', value: 'High velocity', bar: 88 },
      { label: 'Focus', value: 'Narrow', bar: 75 },
    ],
    features: ['High scroll velocity', 'Short dwell time', 'Summary-first layout'],
  },
  {
    icon: '🔬',
    title: 'Power User',
    subtitle: 'Density & Depth',
    tagline: 'Analytics-driven workspace',
    accentColor: '#7f77dd',
    description:
      'You want everything visible. Maximum information density with deep stats, advanced filters, and no collapsed sections — every metric front and center.',
    traits: [
      { label: 'Dwell', value: 'Long', bar: 90 },
      { label: 'Scroll', value: 'Deep', bar: 95 },
      { label: 'Focus', value: 'Intense', bar: 85 },
    ],
    features: ['Long dwell time', 'Deep scroll sessions', 'Dense analytics layout'],
  },
];

function FlipCard({ persona }: { persona: (typeof PERSONAS)[0] }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-[420px] cursor-pointer group"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center gap-5 overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 rounded-full blur-[60px] opacity-20 pointer-events-none"
            style={{ background: persona.accentColor }}
          />

          {/* Icon bubble */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
            style={{
              background: `${persona.accentColor}18`,
              border: `1px solid ${persona.accentColor}30`,
            }}
          >
            {persona.icon}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{persona.title}</h3>
            <p className="text-sm font-medium" style={{ color: persona.accentColor }}>
              {persona.subtitle}
            </p>
            <p className="text-xs text-zinc-500 mt-2">{persona.tagline}</p>
          </div>

          {/* Trait bars */}
          <div className="w-full space-y-3 mt-2">
            {persona.traits.map(t => (
              <div key={t.label}>
                <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                  <span>{t.label}</span>
                  <span>{t.value}</span>
                </div>
                <div className="h-[2px] bg-zinc-800 rounded-full w-full">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${t.bar}%`, background: persona.accentColor }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hover hint */}
          <p className="text-[10px] text-zinc-600 mt-2 tracking-widest uppercase">
            Hover to reveal →
          </p>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-sm p-8 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Glow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 rounded-full blur-[60px] opacity-20 pointer-events-none"
            style={{ background: persona.accentColor }}
          />

          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase mb-4"
              style={{
                background: `${persona.accentColor}18`,
                color: persona.accentColor,
                border: `1px solid ${persona.accentColor}30`,
              }}
            >
              {persona.title}
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">{persona.description}</p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
              What PersonaUI does for you
            </p>
            {persona.features.map(f => (
              <div key={f} className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${persona.accentColor}20` }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: persona.accentColor }}
                  />
                </div>
                <span className="text-[13px] text-zinc-300">{f}</span>
              </div>
            ))}

            <Link
              href="/demo"
              className="mt-4 w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 hover:opacity-90 text-center"
              style={{
                background: `${persona.accentColor}20`,
                color: persona.accentColor,
                border: `1px solid ${persona.accentColor}40`,
              }}
            >
              Explore This Persona in Demo
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PersonaFlipCards() {
  return (
    <section className="relative py-28 bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden">

      {/* Ambient Glow Orbs — radial + top-left corner */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(0,113,227,0.06),transparent)]" />
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#0071e3]/4 blur-[130px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#7f77dd]/5 blur-[130px]" />
      </div>

      {/* --- BACKGROUND IMAGE (uncomment to enable) ---
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: 'url("/images/persona-bg.jpg")' }}
      />
      --- END BACKGROUND IMAGE --- */}

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#0071e3] uppercase">
              Persona Engine
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Which Persona Are You?
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            PersonaUI detects your archetype in seconds and shapes the interface around it.
            Hover a card to see your benefits.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PERSONAS.map((persona, i) => (
            <motion.div
              key={persona.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
            >
              <FlipCard persona={persona} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
