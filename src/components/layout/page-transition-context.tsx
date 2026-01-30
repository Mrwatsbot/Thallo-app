'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PageTransitionContextType {
  isTransitioning: boolean;
  direction: 'left' | 'right' | null;
  startTransition: (direction: 'left' | 'right') => void;
  endTransition: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  isTransitioning: false,
  direction: null,
  startTransition: () => {},
  endTransition: () => {},
});

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const startTransition = useCallback((dir: 'left' | 'right') => {
    setDirection(dir);
    setIsTransitioning(true);
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
    setDirection(null);
  }, []);

  return (
    <PageTransitionContext.Provider
      value={{ isTransitioning, direction, startTransition, endTransition }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  return useContext(PageTransitionContext);
}
