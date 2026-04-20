'use client';
import { motion, type Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const TECH_STACK = [
  'Next.js 16',
  'Convex',
  'Clerk Auth',
  'OpenRouter',
  'Mistral 7B',
  'Framer Motion',
  'Tailwind CSS',
  'Shadcn/ui',
  'TypeScript',
  'Vercel',
  'Real-time DB',
  'AI Narration',
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: (index: number) => ({
    opacity: 0,
    x: index % 2 === 0 ? -80 : 80,
    rotate: index % 2 === 0 ? -6 : 6,
  }),
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 90, damping: 16 },
  },
};

export default function TechStackScroller() {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      itemsRef.current = [];
    };
  }, []);

  const setupObserver = (el: HTMLDivElement | null, index: number) => {
    if (!el || itemsRef.current[index]) return;
    itemsRef.current[index] = el;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const i = itemsRef.current.findIndex(item => item === entry.target);
              if (i !== -1) setActiveIdx(i);
            }
          });
        },
        { threshold: 0.7, root: containerRef.current, rootMargin: '-40% 0px -40% 0px' }
      );
    }
    observerRef.current.observe(el);
  };

  return (
    <section id="tech" className="relative py-28 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 overflow-hidden">

      {/* Ambient Glow Orbs — sides + corners */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-[500px] bg-[#0071e3]/6 rounded-full blur-[100px]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-[500px] bg-[#7f77dd]/5 rounded-full blur-[100px]" />
        <div className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#0071e3]/4 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#2997ff]/4 blur-[120px]" />
      </div>

      {/* --- BACKGROUND IMAGE (uncomment to enable) ---
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: 'url("/images/tech-bg.jpg")' }}
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
              Under the Hood
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Powered By
          </h2>
          <p className="text-zinc-400 text-lg max-w-lg mx-auto">
            Battle-tested infrastructure built for real-time intelligence at scale.
          </p>
        </motion.div>

        {/* Scroller */}
        <div className="relative mx-auto max-w-2xl">
          {/* Fade top */}
          <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-zinc-950 to-transparent z-10 pointer-events-none" />
          {/* Fade bottom */}
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none" />

          <div
            ref={containerRef}
            className="h-[420px] overflow-y-auto relative flex flex-col items-center scrollbar-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="h-[160px]" />
            <motion.div
              animate="visible"
              initial="hidden"
              variants={containerVariants}
              className="flex w-full flex-col items-center"
            >
              {TECH_STACK.map((tech, index) => (
                <motion.div
                  key={tech}
                  ref={el => setupObserver(el, index)}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-20% 0px -20% 0px' }}
                  className="whitespace-nowrap px-4 py-6 font-bold text-5xl md:text-6xl transition-all duration-300 select-none"
                  style={{
                    color:
                      activeIdx === index
                        ? '#0071e3'
                        : 'rgba(255,255,255,0.08)',
                    textShadow:
                      activeIdx === index
                        ? '0 0 40px rgba(0,113,227,0.4)'
                        : 'none',
                    transform: activeIdx === index ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {tech}
                </motion.div>
              ))}
            </motion.div>
            <div className="h-[160px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
