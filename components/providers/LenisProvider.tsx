'use client';

import { useMemo } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const options = useMemo(
    () => ({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.8,
      infinite: false,
    }),
    []
  );

  return (
    <ReactLenis 
      root 
      options={options}
    >
      {children as unknown as JSX.Element}
    </ReactLenis>
  );
}
