import React from "react";
import { cn } from "@/lib/utils";

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "priority" | "glass";
}

/**
 * PersonaUI Unified Card Component
 * Standardizes padding, glassmorphism, and border styles across the app.
 */
export function AppCard({ children, className, variant = "default" }: AppCardProps) {
  return (
    <div 
      className={cn(
        "relative rounded-2xl border transition-all duration-300 overflow-hidden",
        "p-4 md:p-5", // Optimized compact padding
        "bg-zinc-900/80 backdrop-blur-xl saturate-150", // Standard Glass
        "border-zinc-800/60 hover:border-zinc-700/80", // Standard Border
        variant === "priority" && "border-[#0071e3]/30 bg-[#0071e3]/5",
        variant === "glass" && "bg-white/[0.03] backdrop-blur-2xl",
        className
      )}
    >
      {/* Priority Accent Line (Conditional) */}
      {variant === "priority" && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0071e3] via-[#2997ff] to-transparent" />
      )}
      
      {children}
    </div>
  );
}
