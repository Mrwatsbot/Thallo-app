'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TourTooltip } from './tour-tooltip';
import { TOUR_STEPS, TourType, TourStep, isTourCompleted, markTourCompleted, getTourCompletionKey } from './tour-steps';

interface TourContextType {
  startTour: (tourType: TourType) => void;
  resetTours: () => void;
  isRunning: boolean;
  currentTour: TourType | null;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within TourProvider');
  }
  return context;
}

interface TourProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
}

interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TourProvider({ children, autoStart = true }: TourProviderProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTour, setCurrentTour] = useState<TourType | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<ElementRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom' | 'left' | 'right' | 'center'>('bottom');
  const [savingTourState, setSavingTourState] = useState(false);
  
  const targetElementRef = useRef<Element | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Auto-start main tour on first login
  useEffect(() => {
    if (autoStart && typeof window !== 'undefined') {
      const hasCompletedMainTour = isTourCompleted('main');
      if (!hasCompletedMainTour) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          startTour('main');
        }, 1000);
      }
    }
  }, [autoStart]);

  const getCurrentStep = useCallback((): TourStep | null => {
    if (!currentTour) return null;
    const steps = TOUR_STEPS[currentTour];
    return steps[stepIndex] || null;
  }, [currentTour, stepIndex]);

  const updateTargetPosition = useCallback(() => {
    const step = getCurrentStep();
    if (!step) return;

    const target = step.target === 'body' ? document.body : document.querySelector(step.target);
    
    if (!target) {
      console.warn(`Tour target not found: ${step.target}`);
      return;
    }

    targetElementRef.current = target;

    const rect = target.getBoundingClientRect();
    const padding = 8;
    
    setTargetRect({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    });

    // Calculate best tooltip position based on viewport space
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const centerY = rect.top + rect.height / 2;
    const centerX = rect.left + rect.width / 2;

    let position: 'top' | 'bottom' | 'left' | 'right' | 'center' = step.placement || 'bottom';

    if (step.placement === 'center' || step.target === 'body') {
      position = 'center';
    } else {
      // Smart positioning based on available space
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = viewportWidth - rect.right;

      if (step.placement === 'top' && spaceAbove < 200) {
        position = 'bottom';
      } else if (step.placement === 'bottom' && spaceBelow < 200) {
        position = 'top';
      } else if (step.placement === 'left' && spaceLeft < 300) {
        position = 'right';
      } else if (step.placement === 'right' && spaceRight < 300) {
        position = 'left';
      }
    }

    setTooltipPosition(position);
  }, [getCurrentStep]);

  const scrollToTarget = useCallback(() => {
    const step = getCurrentStep();
    if (!step || step.target === 'body') return;

    const target = document.querySelector(step.target);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      // Update position after scroll
      setTimeout(updateTargetPosition, 500);
    }
  }, [getCurrentStep, updateTargetPosition]);

  const setupStepObserver = useCallback(() => {
    // Clean up previous observer
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    const step = getCurrentStep();
    if (!step) return;

    const target = step.target === 'body' ? document.body : document.querySelector(step.target);
    if (!target) return;

    // Update position initially
    updateTargetPosition();

    // Observe resize and position changes
    resizeObserverRef.current = new ResizeObserver(() => {
      updateTargetPosition();
    });
    resizeObserverRef.current.observe(target);

    // Also listen to scroll events
    const handleScroll = () => updateTargetPosition();
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      resizeObserverRef.current?.disconnect();
    };
  }, [getCurrentStep, updateTargetPosition]);

  // Update target position when step changes
  useEffect(() => {
    if (!isRunning || !currentTour) return;

    scrollToTarget();
    const cleanup = setupStepObserver();

    return cleanup;
  }, [isRunning, currentTour, stepIndex, scrollToTarget, setupStepObserver]);

  const startTour = useCallback((tourType: TourType) => {
    // Check if already completed
    if (isTourCompleted(tourType)) {
      return;
    }

    const steps = TOUR_STEPS[tourType];
    if (!steps || steps.length === 0) {
      return;
    }

    // Scroll to top for better tour experience
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setCurrentTour(tourType);
    setStepIndex(0);
    setIsRunning(true);
  }, []);

  const resetTours = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Clear all tour completion flags
      localStorage.removeItem('thallo_tour_completed');
      const tours: TourType[] = ['budgets', 'transactions', 'debts', 'savings', 'score'];
      tours.forEach(tour => {
        localStorage.removeItem(getTourCompletionKey(tour));
      });
      setIsRunning(false);
      setCurrentTour(null);
      setStepIndex(0);
      setTargetRect(null);
    }
  }, []);

  const saveTourCompletion = useCallback(async (tourType: TourType) => {
    if (savingTourState) return;
    
    setSavingTourState(true);
    try {
      // Mark as completed in localStorage immediately
      markTourCompleted(tourType);

      // If main tour, also save to user profile via API
      if (tourType === 'main') {
        try {
          await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ has_completed_tour: true }),
          });
        } catch (error) {
          console.error('Failed to save tour completion to API:', error);
          // Non-critical, localStorage is the source of truth
        }
      }
    } finally {
      setSavingTourState(false);
    }
  }, [savingTourState]);

  const handleNext = useCallback(() => {
    if (!currentTour) return;
    
    const steps = TOUR_STEPS[currentTour];
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Tour completed
      saveTourCompletion(currentTour);
      setIsRunning(false);
      setCurrentTour(null);
      setStepIndex(0);
      setTargetRect(null);
    }
  }, [currentTour, stepIndex, saveTourCompletion]);

  const handleBack = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  }, [stepIndex]);

  const handleSkip = useCallback(() => {
    setIsRunning(false);
    setCurrentTour(null);
    setStepIndex(0);
    setTargetRect(null);
  }, []);

  const handleClose = useCallback(() => {
    setIsRunning(false);
    setCurrentTour(null);
    setStepIndex(0);
    setTargetRect(null);
  }, []);

  const step = getCurrentStep();
  const steps = currentTour ? TOUR_STEPS[currentTour] : [];
  const totalSteps = steps.length;

  return (
    <TourContext.Provider
      value={{
        startTour,
        resetTours,
        isRunning,
        currentTour,
      }}
    >
      {children}
      
      <AnimatePresence>
        {isRunning && step && (
          <>
            {/* Spotlight Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9999] pointer-events-none"
              style={{
                background: 'rgba(13, 21, 20, 0.85)',
              }}
            >
              {/* Cutout for target element */}
              {targetRect && tooltipPosition !== 'center' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute"
                  style={{
                    top: targetRect.top,
                    left: targetRect.left,
                    width: targetRect.width,
                    height: targetRect.height,
                    boxShadow: `
                      0 0 0 9999px rgba(13, 21, 20, 0.85),
                      0 0 0 2px #1a7a6d,
                      0 0 20px rgba(26, 122, 109, 0.5)
                    `,
                    borderRadius: '12px',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </motion.div>

            {/* Tooltip */}
            <TourTooltip
              step={step}
              index={stepIndex}
              total={totalSteps}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleSkip}
              onClose={handleClose}
              isFirst={stepIndex === 0}
              isLast={stepIndex === totalSteps - 1}
              position={tooltipPosition}
              targetRect={targetRect}
            />
          </>
        )}
      </AnimatePresence>
    </TourContext.Provider>
  );
}
