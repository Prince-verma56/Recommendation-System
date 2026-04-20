"use client";
import React from "react";
import { motion } from "framer-motion";

export function BackgroundBlob() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none select-none bg-[#050505]">
      {/* Premium Noise Overlay */}
      <svg className="fixed inset-0 w-full h-full opacity-[0.035] contrast-150 brightness-150 mix-blend-overlay">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.65" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Drifting Cinematic Blobs */}
      <motion.div 
        animate={{
          x: [-100, 100, -100],
          y: [-50, 150, -50],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -right-[10%] h-[800px] w-[800px] rounded-full bg-[#0071e3] opacity-[0.08] blur-[140px]"
      />
      
      <motion.div 
        animate={{
          x: [100, -150, 100],
          y: [100, -100, 100],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[30%] -left-[10%] h-[900px] w-[900px] rounded-full bg-[#5E5CE6] opacity-[0.06] blur-[160px]"
      />

      <motion.div 
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[30%] h-[400px] w-[400px] rounded-full bg-cyan-500 opacity-[0.03] blur-[120px]"
      />

      {/* Unified Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505]/80" />
    </div>
  );
}
