'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { usePreloader } from '@/components/ui/PreloaderContext';
import { ArrowRight, Zap } from 'lucide-react';
import { useUser, UserButton } from '@clerk/nextjs';

const SoftAurora = dynamic(() => import('@/components/SoftAurora'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[radial-gradient(60%_60%_at_20%_20%,rgba(0,113,227,0.35),transparent_70%),radial-gradient(45%_55%_at_80%_70%,rgba(41,151,255,0.25),transparent_75%),linear-gradient(180deg,rgba(4,10,22,0.9)_0%,rgba(0,0,0,0.95)_100%)]" />
  ),
});

const SIGNALS = [
  { dot: '#22d3ee', text: 'Scroll depth tracked — section 3' },
  { dot: '#a78bfa', text: 'Dwell spike — widget A' },
  { dot: '#34d399', text: 'Layout adapted — nav collapsed' },
  { dot: '#f59e0b', text: 'Time-of-day shift detected' },
  { dot: '#f472b6', text: 'Click heatmap updated' },
];

const STATS = [
  { value: '2.4ms', label: 'Avg response' },
  { value: '12k+',  label: 'Active users'  },
  { value: '99.9%', label: 'Uptime'        },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const auroraInView = useInView(sectionRef, { margin: '220px 0px 220px 0px', amount: 0.2 });
  const { isDone } = usePreloader();
  const [activeIdx, setActiveIdx] = useState(0);
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const id = setInterval(() => setActiveIdx(i => (i + 1) % SIGNALS.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: isDone ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Soft Aurora WebGL background */}
      <div className="absolute inset-0">
        <SoftAurora
          enabled={auroraInView && isDone}
          speed={0.45}
          scale={1.4}
          brightness={1.4}
          color1="#0071e3"
          color2="#2997ff"
          noiseFrequency={1.8}
          noiseAmplitude={1.1}
          bandHeight={0.5}
          bandSpread={1.2}
          octaveDecay={0.55}
          layerOffset={0.6}
          colorSpeed={0.9}
          enableMouseInteraction={true}
          mouseInfluence={0.22}
        />
      </div>

      {/* Dark overlay — lighter so aurora shows through */}
      <div className="absolute inset-0 bg-black/42 pointer-events-none" />

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* Ambient glow — top-left */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#0071e3]/12 rounded-full blur-[160px] pointer-events-none" />
      {/* Ambient glow — bottom-right */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#2997ff]/8 rounded-full blur-[140px] pointer-events-none" />

      {/* ── TOP BAR (Logo + Auth) ── */}
      <motion.div
        className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 md:px-10 h-[72px]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: isDone ? 0 : -20, opacity: isDone ? 1 : 0 }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-white font-bold text-xl tracking-tight select-none">
          Persona<span className="text-[#0071e3]">UI</span>
        </span>

        <div className="flex items-center gap-3">
          {isLoaded && isSignedIn && (
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: {
                    width: "34px", height: "34px",
                    borderRadius: "50%",
                    border: "1.5px solid rgba(255,255,255,0.15)",
                  },
                },
              }}
            />
          )}
          {isLoaded && !isSignedIn && (
            <>
              <Link href="/sign-in">
                <button className="text-sm font-medium text-white/70 hover:text-white transition-colors px-3 py-1.5">
                  Sign in
                </button>
              </Link>
              <Link href="/sign-up">
                <button className="text-sm font-semibold text-white px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>
      </motion.div>

      {/* ── TOP-RIGHT STAT PILLS ── */}
      <motion.div
        className="absolute top-[88px] right-6 md:right-10 z-20 flex flex-col gap-2 items-end"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: isDone ? 1 : 0, x: isDone ? 0 : 16 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        {STATS.map(({ value, label }) => (
          <div key={label}
               className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm">
            <span className="text-sm font-bold text-white">{value}</span>
            <span className="text-xs text-white/40">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* ── MID-RIGHT AUTO-ADAPT BADGE ── */}
      <motion.div
        className="absolute top-1/2 right-6 md:right-10 -translate-y-1/2 z-20"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: isDone ? 1 : 0, x: isDone ? 0 : 16 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-[#0071e3]/30 bg-black/30 backdrop-blur-sm">
          <Zap className="w-4 h-4 text-[#0071e3] shrink-0" />
          <div className="mr-1">
            <p className="text-xs font-semibold text-white leading-none mb-0.5">Auto-adapt</p>
            <p className="text-[10px] text-white/40 leading-none">Active now</p>
          </div>
          <div className="w-8 h-5 rounded-full bg-[#0071e3] flex items-center justify-end pr-0.5">
            <div className="w-4 h-4 rounded-full bg-white" />
          </div>
        </div>
      </motion.div>

      {/* ── CENTER CONTENT (Headline + CTA) ── */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: isDone ? 0 : 30, opacity: isDone ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#0071e3] animate-pulse" />
          <span className="text-xs font-semibold tracking-[0.2em] text-[#0071e3] uppercase">
            Real-Time Behavioral AI
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] leading-[1.05] text-white max-w-5xl">
          Your Workspace,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0071e3] to-[#60a5fa]">
            Shaped by You
          </span>
        </h1>

        <p className="text-base md:text-lg text-white/50 max-w-xl mt-6 mb-10">
          PersonaUI reads dwell time, scroll depth and time-of-day signals, then silently reshapes your dashboard. <span className="text-white/80">No settings. No drag-and-drop.</span>
        </p>

        <div className="flex items-center gap-4">
          <Link href="/demo">
            <button className="group flex items-center gap-2 px-8 py-4 rounded-full bg-[#0071e3] text-white font-semibold shadow-[0_0_30px_rgba(0,113,227,0.5)] hover:shadow-[0_0_45px_rgba(0,113,227,0.7)] hover:-translate-y-0.5 transition-all">
              Launch Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="px-8 py-4 rounded-full text-white/80 font-semibold border border-white/20 hover:border-white/40 hover:text-white hover:-translate-y-0.5 transition-all">
              View Dashboard
            </button>
          </Link>
        </div>
      </motion.div>

      {/* ── BOTTOM-RIGHT LIVE SIGNALS ── */}
      <motion.div
        className="absolute bottom-8 right-6 md:right-10 z-20 w-[240px]"
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: isDone ? 0 : 30, opacity: isDone ? 1 : 0 }}
        transition={{ delay: 0.35, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[11px] font-semibold text-white/50 tracking-[0.15em] uppercase">
              Live signals
            </p>
          </div>
          <div className="relative h-5 overflow-hidden">
            {SIGNALS.map((s, i) => (
              <motion.div
                key={i}
                className="absolute inset-x-0 flex items-center gap-2"
                initial={{ opacity: 0, y: 14 }}
                animate={{
                  opacity: activeIdx === i ? 1 : 0,
                  y: activeIdx === i ? 0 : -14,
                }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
                <span className="text-sm text-white/80 leading-tight">{s.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── BOTTOM CENTER SCROLL INDICATOR ── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDone ? 0.5 : 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.section>
  );
}
