'use client';

import { ReactLenis } from '@studio-freight/react-lenis';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        duration: 1.2, 
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 2,
        infinite: false,
      }}
    >

      {children}
    </ReactLenis>
  );
}
