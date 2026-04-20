'use client';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { usePreloader } from '@/components/ui/PreloaderContext';
import { ArrowRight, Zap } from 'lucide-react';
import { useUser, UserButton } from '@clerk/nextjs';

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
  const containerRef = useRef<HTMLElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const { isDone }   = usePreloader();
  const [activeIdx, setActiveIdx] = useState(0);
  const { isLoaded, isSignedIn } = useUser();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  useEffect(() => {
    const id = setInterval(() => setActiveIdx(i => (i + 1) % SIGNALS.length), 2400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isDone) return;
    const t = setTimeout(() => videoRef.current?.play().catch(() => {}), 120);
    return () => clearTimeout(t);
  }, [isDone]);

  return (
    <motion.section
      ref={containerRef as React.RefObject<HTMLElement>}
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isDone ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── FULL-BLEED VIDEO — barely tinted, car fully visible ── */}
      <motion.video
        ref={videoRef}
        muted
        playsInline
        loop
        preload="auto"
        poster="/hero-car.jpg"
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{ scale: videoScale }}
      >
        <source src="/videos/CarVideo1.mp4" type="video/mp4" />
      </motion.video>

      {/* Edge vignette only — center stays fully transparent */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             background: `
               radial-gradient(ellipse 70% 70% at 50% 50%, transparent 35%, rgba(4,4,12,0.52) 100%),
               linear-gradient(to bottom, rgba(4,4,12,0.42) 0%, transparent 16%, transparent 70%, rgba(4,4,12,0.62) 100%)
             `
           }} />

      {/* ── TOP BAR — logo left, auth right, zero background ── */}
      <motion.div
        className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-8 md:px-14 h-[68px]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: isDone ? 0 : -20, opacity: isDone ? 1 : 0 }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-white font-bold text-[18px] tracking-tight select-none">
          Persona<span className="text-[#0071e3]">UI</span>
        </span>

        <div className="flex items-center gap-3">
          {isLoaded && isSignedIn && (
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: {
                    width: "32px", height: "32px",
                    borderRadius: "50%",
                    border: "1.5px solid rgba(255,255,255,0.15)",
                  },
                },
              }}
            />
          )}
          {isLoaded && !isSignedIn && (
            <>
              <Link href="/login">
                <button className="text-[13px] font-medium text-white/65 hover:text-white
                                   transition-colors duration-200 px-3 py-1.5">
                  Sign in
                </button>
              </Link>
              <Link href="/signup">
                <button className="text-[13px] font-semibold text-white px-5 py-2 rounded-full
                                   border border-white/20 hover:bg-white/10
                                   transition-all duration-200">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>
      </motion.div>

      {/* ── TOP-RIGHT — stat pills stacked ── */}
      <motion.div
        className="absolute top-[84px] right-8 md:right-14 z-20 flex flex-col gap-2 items-end"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: isDone ? 1 : 0, x: isDone ? 0 : 16 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        {STATS.map(({ value, label }) => (
          <div key={label}
               className="flex items-center gap-2 px-3 py-1.5 rounded-full
                          border border-white/10 bg-black/20"
               style={{ backdropFilter: 'blur(5px)' }}>
            <span className="text-[13px] font-bold text-white">{value}</span>
            <span className="text-[11px] text-white/40">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* ── MID-RIGHT — auto-adapt badge ── */}
      <motion.div
        className="absolute top-1/2 right-8 md:right-14 -translate-y-1/2 z-20"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: isDone ? 1 : 0, x: isDone ? 0 : 16 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                        border border-[#0071e3]/20 bg-black/20"
             style={{ backdropFilter: 'blur(5px)' }}>
          <Zap className="w-3.5 h-3.5 text-[#0071e3] shrink-0" />
          <div className="mr-1">
            <p className="text-[11px] font-semibold text-white leading-none mb-0.5">Auto-adapt</p>
            <p className="text-[10px] text-white/40 leading-none">Active now</p>
          </div>
          <div className="w-7 h-4 rounded-full bg-[#0071e3] flex items-center justify-end pr-0.5">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
        </div>
      </motion.div>

      {/* ── BOTTOM-LEFT — headline + CTA ── */}
      <motion.div
        className="absolute bottom-[80px] left-8 md:left-14 z-20 max-w-[480px]"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: isDone ? 0 : -30, opacity: isDone ? 1 : 0 }}
        transition={{ delay: 0.2, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[#0071e3] uppercase">
            Real-Time Behavioral AI
          </span>
        </div>

        <h1 className="text-[46px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.03] text-white mb-4">
          Your Workspace,{' '}
          <span className="text-transparent bg-clip-text
                           bg-gradient-to-r from-[#0071e3] to-[#60a5fa]">
            Shaped by You
          </span>
        </h1>

        <p className="text-[14px] text-white/50 leading-relaxed mb-7 max-w-[390px]">
          PersonaUI reads dwell time, scroll depth and time-of-day signals,
          then silently reshapes your dashboard.{' '}
          <span className="text-white/75">No settings. No drag-and-drop.</span>
        </p>

        <div className="flex items-center gap-3">
          <Link href="/demo">
            <button className="group flex items-center gap-2 px-6 py-3 rounded-full
                               bg-[#0071e3] text-white font-semibold text-[13px]
                               shadow-[0_0_26px_rgba(0,113,227,0.5)]
                               hover:shadow-[0_0_40px_rgba(0,113,227,0.68)]
                               hover:-translate-y-0.5 transition-all duration-200">
              Launch Demo
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="px-6 py-3 rounded-full text-white/75 font-semibold text-[13px]
                               border border-white/15 hover:border-white/30 hover:text-white
                               hover:-translate-y-0.5 transition-all duration-200">
              View Dashboard
            </button>
          </Link>
        </div>
      </motion.div>

      {/* ── BOTTOM-RIGHT — live signals ── */}
      <motion.div
        className="absolute bottom-[80px] right-8 md:right-14 z-20 w-[220px]"
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: isDone ? 0 : 30, opacity: isDone ? 1 : 0 }}
        transition={{ delay: 0.35, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5"
             style={{ backdropFilter: 'blur(5px)' }}>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] font-semibold text-white/45 tracking-[0.15em] uppercase">
              Live signals
            </p>
          </div>
          <div className="relative h-[20px] overflow-hidden">
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
                <span className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: s.dot }} />
                <span className="text-[12px] text-white/75 leading-none">{s.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── BOTTOM CENTER — scroll indicator ── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDone ? 0.4 : 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <span className="text-[9px] tracking-[0.3em] text-white/40 uppercase">Scroll</span>
        <motion.div
          className="w-px h-7 bg-gradient-to-b from-white/35 to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.section>
  );
}