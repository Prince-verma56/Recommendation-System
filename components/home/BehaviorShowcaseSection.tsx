'use client';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Activity, Brain, Target, Zap } from 'lucide-react';

function AnimatedCounter({ to, duration = 1.8 }: { to: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(false);

  return (
    <motion.span
      onViewportEnter={() => {
        if (ref.current) return;
        ref.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = (Date.now() - start) / 1000;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out-expo
          const eased = 1 - Math.pow(2, -10 * progress);
          setDisplay(Math.round(eased * to));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }}
    >
      {display.toLocaleString()}
    </motion.span>
  );
}

const personas = ['Focus Mode', 'Power Mode', 'Exploration', 'Focus Mode'];

export default function BehaviorShowcaseSection() {
  const [personaIdx, setPersonaIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPersonaIdx(i => (i + 1) % personas.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="showcase" className="relative z-10 py-28 md:py-36 px-6 md:px-12">
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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs tracking-[0.25em] text-zinc-400 uppercase font-medium">
              Live Signal Preview
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Intelligence in Motion
          </h2>
          <p className="text-zinc-400 text-xl font-light max-w-2xl mx-auto">
            Here's a glimpse of what PersonaUI tracks and surfaces for every user, every session.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Events Tracked */}
          <MetricCard
            icon={<Activity className="w-5 h-5 text-[#0071e3]" />}
            label="Events Tracked"
            delay={0}
          >
            <span className="text-5xl font-bold text-white tabular-nums">
              <AnimatedCounter to={84719} />
            </span>
            <span className="text-xs text-zinc-500 mt-1">across all active users</span>
          </MetricCard>

          {/* Current Persona */}
          <MetricCard
            icon={<Brain className="w-5 h-5 text-violet-400" />}
            label="Active Persona"
            delay={0.1}
            glowColor="violet"
          >
            <motion.div
              key={personaIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-bold text-violet-300 leading-tight"
            >
              {personas[personaIdx]}
            </motion.div>
            <div className="mt-3 flex gap-1.5">
              {[0.6, 0.85, 0.45].map((v, i) => (
                <div key={i} className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-violet-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${v * 100}%` }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.1 }}
                  />
                </div>
              ))}
            </div>
          </MetricCard>

          {/* Top Section Today */}
          <MetricCard
            icon={<Target className="w-5 h-5 text-emerald-400" />}
            label="Top Section Today"
            delay={0.2}
            glowColor="emerald"
          >
            <div className="text-3xl font-bold text-white leading-tight">Analytics</div>
            <div className="mt-3 space-y-2">
              {[
                { label: 'Analytics', pct: 68 },
                { label: 'Dashboard', pct: 42 },
                { label: 'Profile', pct: 19 },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-500 w-16 shrink-0">{row.label}</span>
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-400/70 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${row.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.35 }}
                    />
                  </div>
                  <span className="text-[11px] text-zinc-600 w-8 text-right">{row.pct}%</span>
                </div>
              ))}
            </div>
          </MetricCard>

          {/* Adaptations Made */}
          <MetricCard
            icon={<Zap className="w-5 h-5 text-amber-400" />}
            label="Adaptations Made"
            delay={0.3}
            glowColor="amber"
          >
            <span className="text-5xl font-bold text-white tabular-nums">
              <AnimatedCounter to={2847} duration={2} />
            </span>
            {/* Mini sparkline */}
            <div className="mt-4 flex items-end gap-1 h-10">
              {[3, 5, 4, 7, 6, 9, 8, 11, 9, 13, 10, 14].map((v, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-amber-400/50 rounded-sm"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(v / 14) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.04 }}
                />
              ))}
            </div>
          </MetricCard>
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-zinc-600 mt-8 tracking-wide">
          Data shown is from a live demo environment. Sign in to see your own behavioral profile.
        </p>
      </div>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  delay,
  glowColor = 'blue',
  children,
}: {
  icon: React.ReactNode;
  label: string;
  delay: number;
  glowColor?: 'blue' | 'violet' | 'emerald' | 'amber';
  children: React.ReactNode;
}) {
  const glows = {
    blue: 'group-hover:shadow-[0_0_40px_rgba(0,113,227,0.12)]',
    violet: 'group-hover:shadow-[0_0_40px_rgba(167,139,250,0.12)]',
    emerald: 'group-hover:shadow-[0_0_40px_rgba(52,211,153,0.12)]',
    amber: 'group-hover:shadow-[0_0_40px_rgba(251,191,36,0.12)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.6 }}
      className={`group relative bg-zinc-900/50 backdrop-blur-sm border border-white/8 rounded-2xl p-6 flex flex-col hover:border-white/15 transition-all duration-500 ${glows[glowColor]}`}
    >
      {/* Label row */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs font-medium text-zinc-500 tracking-wide uppercase">
          {label}
        </span>
      </div>

      {/* Metric content */}
      <div className="flex flex-col flex-1">{children}</div>
    </motion.div>
  );
}
