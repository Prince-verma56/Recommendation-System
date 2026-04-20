'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'hero', label: 'Origin' },
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'cognitive-rhythm', label: 'Cognitive Rhythm' },
  { id: 'metrics', label: 'Real-time Metrics' },
  { id: 'live-snapshot', label: 'Live Snapshot' },
  { id: 'neural-cartography', label: 'Blueprint' },
  { id: 'sentient-canvas', label: 'Sentient Canvas' },
  { id: 'process', label: 'Process' },
  { id: 'symbiotic-telemetry', label: 'Telemetry' },
  { id: 'integration', label: 'Connectivity' },
  { id: 'showcase', label: 'Adaptive Showcase' },
  { id: 'tech', label: 'Architecture' },
];

export default function SideNav() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observers = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.2, rootMargin: '-20% 0px -20% 0px' }
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 0;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'auto',
      });
    }
  };

  return (
    <nav className="hidden lg:flex fixed right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-5 z-50">
      {/* Dynamic line connecting dots */}
      <div className="absolute w-px h-full bg-white/5 -z-10" />
      
      {sections.map(({ id, label }) => (
        <NavDot
          key={id}
          active={activeSection === id}
          label={label}
          onClick={() => scrollTo(id)}
        />
      ))}
    </nav>
  );
}

function NavDot({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <div className="group relative flex items-center justify-end">
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-8 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 text-[10px] font-semibold text-white/70 tracking-widest uppercase opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap backdrop-blur-xl shadow-2xl transition-all duration-300"
        >
          {label}
        </motion.div>
      </AnimatePresence>
      
      <button
        onClick={onClick}
        aria-label={`Scroll to ${label}`}
        className="relative flex items-center justify-center w-8 h-8 focus:outline-none"
      >
        <motion.div
          animate={{
            scale: active ? 1.4 : 1,
            backgroundColor: active ? '#0071e3' : 'rgba(255,255,255,0.15)',
          }}
          className={`w-2 h-2 rounded-full transition-shadow duration-500 ${
            active ? 'shadow-[0_0_20px_rgba(0,113,227,0.8)]' : 'hover:bg-white/40'
          }`}
        />
        {active && (
          <motion.div
            layoutId="active-ring"
            className="absolute inset-0 border border-[#0071e3]/30 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        )}
      </button>
    </div>
  );
}
