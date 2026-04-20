'use client';
import { createContext, useContext } from 'react';

export const PreloaderContext = createContext<{ isDone: boolean }>({ isDone: false });

export const usePreloader = () => useContext(PreloaderContext);
