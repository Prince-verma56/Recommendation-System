'use client';
import { Activity, Zap, Search, BrainCircuit } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function CognitiveRhythmSection() {
  const [activeMode, setActiveMode] = useState<'focused' | 'exploratory'>('focused');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMode(prev => prev === 'focused' ? 'exploratory' : 'focused');
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="cognitive-rhythm" className="relative z-10 py-28 md:py-48 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black min-h-screen flex items-center">
      
      {/* Ambient Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-40 h-[600px] w-[600px] rounded-full bg-[#0071e3]/10 blur-[140px]" />
        <div className="absolute bottom-1/4 -left-40 h-[600px] w-[600px] rounded-full bg-[#2997ff]/8 blur-[140px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Content Side */}
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 text-[#0071e3] text-xs font-semibold tracking-wider uppercase">
                <BrainCircuit className="w-3 h-3" />
                Adaptive Pacing
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Your Cognitive Rhythm, <br/>
                <span className="text-[#0071e3]">Our Digital Pulse.</span>
              </h2>
              <p className="text-lg text-zinc-400 font-light leading-relaxed max-w-xl">
                PersonaUI doesn't just display data; it senses your velocity. By analyzing behavioral signals, the interface dynamically adjusts its density and speed to match your mental state.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => setActiveMode('focused')}
                className={`p-6 rounded-2xl border transition-all duration-500 text-left ${activeMode === 'focused' ? 'bg-[#0071e3]/10 border-[#0071e3]/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <Zap className={`w-6 h-6 mb-4 ${activeMode === 'focused' ? 'text-[#0071e3]' : 'text-zinc-500'}`} />
                <h4 className="text-lg font-semibold text-white mb-2">Focused Flow</h4>
                <p className="text-sm text-zinc-500">Accelerated navigation & semantic shortcuts for high-velocity creation.</p>
              </button>

              <button 
                onClick={() => setActiveMode('exploratory')}
                className={`p-6 rounded-2xl border transition-all duration-500 text-left ${activeMode === 'exploratory' ? 'bg-[#2997ff]/10 border-[#2997ff]/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <Search className={`w-6 h-6 mb-4 ${activeMode === 'exploratory' ? 'text-[#2997ff]' : 'text-zinc-500'}`} />
                <h4 className="text-lg font-semibold text-white mb-2">Discovery Mode</h4>
                <p className="text-sm text-zinc-500">Enhanced visual context and explorative paths for deeper research.</p>
              </button>
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative aspect-square md:h-[600px] rounded-[40px] border border-white/10 bg-zinc-950/50 backdrop-blur-3xl overflow-hidden shadow-2xl flex items-center justify-center">
            
            {/* Visualizer Background */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            {/* Animated Pulse Wave */}
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                  className="relative w-4/5 h-1/2 flex items-center justify-center"
                >
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    {/* The Wave */}
                    <motion.path
                      d="M 0,100 C 50,100 70,20 100,20 C 130,20 150,180 180,180 C 210,180 230,20 260,20 C 290,20 310,100 400,100"
                      fill="none"
                      stroke={activeMode === 'focused' ? '#0071e3' : '#2997ff'}
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ 
                        pathLength: 1,
                        d: activeMode === 'focused' 
                          ? "M 0,100 C 50,100 70,20 100,20 C 130,20 150,180 180,180 C 210,180 230,20 260,20 C 290,20 310,100 400,100"
                          : "M 0,100 C 20,100 40,80 80,80 C 120,80 160,120 200,120 C 240,120 280,80 320,80 C 360,80 380,100 400,100"
                      }}
                      transition={{ 
                        pathLength: { duration: 1.5, ease: "easeInOut" },
                        d: { duration: 1, ease: "easeInOut" }
                      }}
                    />
                    
                    {/* Glowing point */}
                    <motion.circle
                      r="4"
                      fill={activeMode === 'focused' ? '#0071e3' : '#2997ff'}
                      animate={{ 
                        cx: [0, 400],
                        cy: activeMode === 'focused' 
                          ? [100, 20, 180, 20, 100] 
                          : [100, 80, 120, 80, 100]
                      }}
                      transition={{ 
                        duration: activeMode === 'focused' ? 1.5 : 3, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                    />
                  </svg>
                  
                  {/* Digital Clock/Counter */}
                  <div className="absolute bottom-10 left-10 font-mono text-xs text-zinc-600 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse capitalize ${activeMode === 'focused' ? 'bg-[#0071e3]' : 'bg-[#2997ff]'}`} />
                    RPM: {activeMode === 'focused' ? '120.4' : '45.2'}
                  </div>
                  <div className="absolute top-10 right-10 font-mono text-[10px] text-zinc-700 tracking-widest uppercase">
                    Sync Status: {activeMode === 'focused' ? 'High Precision' : 'Active Discovery'}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-white/5 rounded-tr-[40px]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-white/5 rounded-bl-[40px]" />
          </div>

        </div>
      </motion.div>
    </section>
  );
}