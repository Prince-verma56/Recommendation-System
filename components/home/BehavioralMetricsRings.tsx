'use client';
import { motion, useInView } from 'framer-motion';
import { memo, useRef, useEffect, useState } from 'react';

const METRICS = [
  {
    key: 'DWELL',
    label: 'Avg Dwell Time',
    current: 43,
    target: 60,
    unit: 's',
    color: '#0071e3',
    track: 'rgba(0,113,227,0.12)',
    description: 'Seconds per widget',
  },
  {
    key: 'SCROLL',
    label: 'Scroll Depth',
    current: 45,
    target: 100,
    unit: '%',
    color: '#00c2ff',
    track: 'rgba(0,194,255,0.12)',
    description: 'Page depth reached',
  },
  {
    key: 'ADAPT',
    label: 'Adaptations Today',
    current: 18,
    target: 50,
    unit: '',
    color: '#7f77dd',
    track: 'rgba(127,119,221,0.12)',
    description: 'Layout changes made',
  },
];

const SIZE = 160;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

const Ring = memo(function Ring({
  metric,
  animate,
}: {
  metric: (typeof METRICS)[0];
  animate: boolean;
}) {
  const [count, setCount] = useState(0);
  const pct = metric.current / metric.target;
  const offset = CIRCUMFERENCE * (1 - (animate ? pct : 0));

  useEffect(() => {
    if (!animate) return;
    let start = 0;
    let frameId: number | null = null;
    const end = metric.current;
    const duration = 1600;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const prog = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(prog * end));
      if (prog < 1) {
        frameId = requestAnimationFrame(step);
      }
      else setCount(end);
    };
    frameId = requestAnimationFrame(step);
    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [animate, metric.current]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={metric.track}
            strokeWidth={STROKE}
          />
          {/* Progress */}
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={metric.color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: animate ? offset : CIRCUMFERENCE }}
            transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              filter: `drop-shadow(0 0 8px ${metric.color}80)`,
            }}
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold tabular-nums leading-none"
            style={{ color: metric.color }}
          >
            {count}
            <span className="text-xl">{metric.unit}</span>
          </span>
          <span className="text-[10px] text-zinc-500 mt-1 tracking-widest uppercase">
            {metric.key}
          </span>
        </div>
      </div>

      {/* Label + progress bar */}
      <div className="text-center w-[160px]">
        <p className="text-sm font-semibold text-white mb-1">{metric.label}</p>
        <p className="text-[11px] text-zinc-500 mb-3">{metric.description}</p>
        <div className="h-[2px] w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: metric.color }}
            initial={{ width: 0 }}
            animate={{ width: animate ? `${pct * 100}%` : 0 }}
            transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-zinc-600">0</span>
          <span className="text-[10px] text-zinc-600">
            {metric.target}
            {metric.unit}
          </span>
        </div>
      </div>
    </div>
  );
});

export default function BehavioralMetricsRings() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <section id="metrics" className="relative py-28 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 overflow-hidden">

      {/* Ambient Glow Orbs — center + corners */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#0071e3]/6 rounded-full blur-[120px]" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#0071e3]/4 blur-[130px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#2997ff]/4 blur-[130px]" />
      </div>

      {/* --- BACKGROUND IMAGE (uncomment to enable) ---
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: 'url("/images/metrics-bg.jpg")' }}
      />
      --- END BACKGROUND IMAGE --- */}

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#0071e3] uppercase">
              Live Signal Processing
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Your Behavioral Fingerprint,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0071e3] to-[#00c2ff]">
              Live
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Three signals. Continuously measured. Silently driving your
            personalized interface.
          </p>
        </motion.div>

        {/* Rings */}
        <div ref={ref}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 place-items-center">
            {METRICS.map((metric, i) => (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="flex flex-col items-center p-8 rounded-3xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-colors duration-500"
              >
                <Ring metric={metric} animate={inView} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center text-zinc-600 text-xs mt-14 tracking-wide"
        >
          Updated every 3 seconds · No data leaves your session
        </motion.p>
      </div>
    </section>
  );
}
