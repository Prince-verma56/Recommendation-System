import React from "react";
import { cn } from "@/lib/utils";

interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "priority" | "glass";
}

/**
 * PersonaUI Unified Card Component
 * Standardizes padding, glassmorphism, and border styles across the app.
 */
export function AppCard({ children, className, variant = "default", ...rest }: AppCardProps) {
  return (
    <div 
      {...rest}
      className={cn(
        "relative rounded-2xl border transition-all duration-500 overflow-hidden group",
        "p-6 md:p-7", // More spacious premium padding
        "bg-[#0a0a0a]/90 backdrop-blur-3xl saturate-[1.8]", // High-end Glass
        "border-zinc-800/50 hover:border-[#0071e3]/40 shadow-2xl hover:shadow-[#0071e3]/10", // Blue Hover Accent
        variant === "priority" && "border-[#0071e3]/40 bg-[#0071e3]/[0.03]",
        variant === "glass" && "bg-white/[0.02] backdrop-blur-2xl border-white/[0.05]",
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
