'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative z-10 py-40 px-6 text-center overflow-hidden"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0071e3]/10 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#0071e3]/15 rounded-full blur-[80px]" />
      </div>

      {/* Border top accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-[#0071e3]/50" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0071e3]/15 border border-[#0071e3]/30 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
            <span className="text-xs tracking-[0.25em] text-[#0071e3] uppercase font-semibold">
              Beta Access Open
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
            Ready to experience an interface{' '}
            <span className="text-[#0071e3]">that learns you?</span>
          </h2>

          <p className="text-xl text-zinc-400 font-light mb-14 max-w-xl mx-auto">
            Sign in once. Your dashboard starts adapting within minutes based on how you actually work.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/demo">
              <button className="group flex items-center gap-2 px-10 py-5 rounded-full bg-[#0071e3] text-white font-semibold text-base shadow-[0_0_50px_rgba(0,113,227,0.45)] hover:shadow-[0_0_70px_rgba(0,113,227,0.65)] hover:-translate-y-1 transition-all duration-300">
                Try the Live Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-10 py-5 rounded-full bg-white/5 border border-white/15 text-white font-semibold text-base hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
                View Dashboard
              </button>
            </Link>
          </div>

          <p className="mt-10 text-xs text-zinc-600 tracking-wide">
            No credit card required · Powered by Convex & Clerk · Real-time behavioral AI
          </p>
        </motion.div>
      </div>

      {/* Border bottom accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-transparent to-[#0071e3]/50" />
    </motion.section>
  );
}