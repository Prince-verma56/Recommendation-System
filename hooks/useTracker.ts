"use client";
import { useEffect, useRef, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

interface TrackerOptions {
  section: string;
}

export function useTracker({ section }: TrackerOptions) {
  const { user } = useUser();
  const logEvent = useMutation(api.events.logEvent);
  const computePersona = useMutation(api.personas.computePersonaAndSlots);
  const dwellStart = useRef<number>(Date.now());
  const lastScrollY = useRef<number>(0);
  const scrollSpeeds = useRef<number[]>([]);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const idleStart = useRef<number>(Date.now());

  const flush = useCallback(async (action: string) => {
    if (!user?.id) return;
    const now = Date.now();
    const dwellMs = now - dwellStart.current;
    
    // Check if document.body exists and has meaningful height to prevent NaNs
    const scrollHeight = document.body ? document.body.scrollHeight : 0;
    const innerHeight = window.innerHeight;
    
    let scrollDepth = 0;
    if (scrollHeight > innerHeight) {
      scrollDepth = Math.round((window.scrollY / (scrollHeight - innerHeight)) * 100);
    }
    
    const scrollSpeed = scrollSpeeds.current.length
      ? Math.round(scrollSpeeds.current.reduce((a, b) => a + b, 0) / scrollSpeeds.current.length)
      : 0;
    const idleMs = now - idleStart.current;
    
    await logEvent({
      userId: user.id,
      section,
      action,
      dwellMs,
      scrollDepth: isNaN(scrollDepth) ? 0 : scrollDepth,
      idleMs,
      scrollSpeed,
      hour: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      ts: now,
    });
    
    await computePersona({ userId: user.id });
    scrollSpeeds.current = [];
    dwellStart.current = Date.now();
  }, [user?.id, section, logEvent, computePersona]);

  useEffect(() => {
    let lastTime = Date.now();
    
    const handleScroll = () => {
      const now = Date.now();
      const dy = Math.abs(window.scrollY - lastScrollY.current);
      const dt = (now - lastTime) / 1000;
      if (dt > 0) scrollSpeeds.current.push(dy / dt);
      lastScrollY.current = window.scrollY;
      lastTime = now;
      
      // Reset idle
      idleStart.current = Date.now();
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        flush("idle");
      }, 25000); // 25s idle threshold
    };

    const handleClick = () => {
      flush("click");
      idleStart.current = Date.now();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleClick);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      clearTimeout(idleTimer.current);
      flush("dwell"); // flush on unmount/section change
    };
  }, [flush]);
}
