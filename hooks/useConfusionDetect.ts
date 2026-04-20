"use client";
import { useEffect, useRef, useState } from "react";

export function useConfusionDetect({
  idleThresholdMs = 25000,
  scrollThreshold = 4,
}: {
  idleThresholdMs?: number;
  scrollThreshold?: number;
} = {}) {
  const [isConfused, setIsConfused] = useState(false);
  const scrollCountRef = useRef(0);
  const clickCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const reset = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (scrollCountRef.current >= scrollThreshold && clickCountRef.current === 0) {
          setIsConfused(true);
        }
        scrollCountRef.current = 0;
        clickCountRef.current = 0;
      }, idleThresholdMs);
    };

    const onScroll = () => { scrollCountRef.current++; reset(); };
    const onClick = () => {
      clickCountRef.current++;
      setIsConfused(false);
      reset();
    };


    
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick);
    reset();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
      clearTimeout(timerRef.current);
    };
  }, [idleThresholdMs, scrollThreshold]);

  return { isConfused, dismiss: () => setIsConfused(false) };
}
