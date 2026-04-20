'use client';
import { useState } from 'react';
import { Preloader } from '@/components/ui/Preloader';
import { PreloaderContext } from '@/components/ui/PreloaderContext';

export function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [isDone, setIsDone] = useState(false);

  return (
    <PreloaderContext.Provider value={{ isDone }}>
      {!isDone && <Preloader onComplete={() => setIsDone(true)} />}
      {children}
    </PreloaderContext.Provider>
  );
}
