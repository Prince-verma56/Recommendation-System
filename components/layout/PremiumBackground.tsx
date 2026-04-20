"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function PremiumBackground() {
  const pathname = usePathname();

  // Hide the background on the root landing page as requested
  if (pathname === "/") return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden">
      {/* Top Right Blob */}
      <div 
        className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#0071e3] opacity-20 blur-[120px]" 
        aria-hidden="true"
      />
      
      {/* Bottom Left Blob */}
      <div 
        className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#0071e3] opacity-10 blur-[120px]" 
        aria-hidden="true"
      />
    </div>
  );
}
