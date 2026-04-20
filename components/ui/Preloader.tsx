'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const startTimeRef = useRef<number>(Date.now());
  const duration = 2200; // ms for the full count

  useEffect(() => {
    let animationFrame: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);

      // Ease-out cubic — fast start, smooth finish
      const eased = 100 - Math.pow(1 - rawProgress / 100, 3) * 100;
      setProgress(Math.floor(eased));

      if (rawProgress < 100) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Hold at 100 briefly, then trigger shutter exit
        setTimeout(() => {
          setIsVisible(false);
          // Fire onComplete after the exit animation finishes (0.9s)
          setTimeout(onComplete, 950);
        }, 300);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [onComplete]);

  // Shutter blade timing — staggered so it looks like panels lifting
  const shutterEase = [0.83, 0, 0.17, 1] as const;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* ── Blade 1: main dark panel wipes up ── */}
          <motion.div
            key="blade-main"
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.95, ease: shutterEase }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950"
          >
            {/* Brand mark */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.55, ease: 'easeOut' }}
              className="text-[11px] tracking-[0.55em] text-zinc-500 uppercase mb-14 font-medium"
            >
              PersonaUI
            </motion.p>

            {/* Counter */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative flex items-end gap-1 leading-none mb-10"
            >
              <span className="text-[96px] font-bold text-white tabular-nums leading-none tracking-tighter">
                {String(progress).padStart(3, '0')}
              </span>
              <span className="text-[48px] font-bold text-[#0071e3] leading-[1.6] tracking-tighter">
                %
              </span>
            </motion.div>

            {/* Progress bar */}
            <div className="relative w-64 h-[2px] bg-zinc-800 rounded-full overflow-visible">
              {/* Track fill */}
              <div
                className="absolute top-0 left-0 h-full bg-[#0071e3] rounded-full transition-none"
                style={{ width: `${progress}%` }}
              />
              {/* Bloom glow on the leading edge */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0071e3] rounded-full blur-md opacity-70 transition-none"
                style={{ left: `calc(${progress}% - 12px)` }}
              />
            </div>

            {/* Ambient glow orb */}
            <div className="absolute w-[520px] h-[520px] bg-[#0071e3]/8 rounded-full blur-[130px] pointer-events-none" />
          </motion.div>

          {/* ── Blade 2: thin accent strip, exits slightly faster ── */}
          <motion.div
            key="blade-accent"
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.78, ease: shutterEase }}
            className="fixed inset-x-0 bottom-0 h-[3px] z-[10000] bg-[#0071e3]"
          />
        </>
      )}
    </AnimatePresence>
  );
}