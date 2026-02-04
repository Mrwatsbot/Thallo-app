import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { TourStep } from './tour-steps';

interface TourTooltipProps {
  step: TourStep;
  index: number;
  total: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onClose: () => void;
  isFirst: boolean;
  isLast: boolean;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  targetRect: { top: number; left: number; width: number; height: number } | null;
}

export function TourTooltip({
  step,
  index,
  total,
  onNext,
  onBack,
  onSkip,
  onClose,
  isFirst,
  isLast,
  position,
  targetRect,
}: TourTooltipProps) {
  // Calculate tooltip position based on target element and placement
  const getTooltipStyle = (): React.CSSProperties => {
    if (position === 'center' || !targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const gap = 16; // Gap between target and tooltip
    let style: React.CSSProperties = {};

    switch (position) {
      case 'top':
        style = {
          bottom: `${window.innerHeight - targetRect.top + gap}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
        break;
      case 'bottom':
        style = {
          top: `${targetRect.top + targetRect.height + gap}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
        break;
      case 'left':
        style = {
          top: `${targetRect.top + targetRect.height / 2}px`,
          right: `${window.innerWidth - targetRect.left + gap}px`,
          transform: 'translateY(-50%)',
        };
        break;
      case 'right':
        style = {
          top: `${targetRect.top + targetRect.height / 2}px`,
          left: `${targetRect.left + targetRect.width + gap}px`,
          transform: 'translateY(-50%)',
        };
        break;
    }

    return style;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 10 : -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed z-[10000] bg-zinc-900/95 backdrop-blur-xl border border-[#1a7a6d] rounded-xl shadow-2xl max-w-md pointer-events-auto"
      style={getTooltipStyle()}
    >
      {/* Header with step counter */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#1a7a6d33]">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#1a7a6d] animate-pulse" />
          <span className="text-xs font-medium text-[#8aaba6]">
            Step {index + 1} of {total}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[#8aaba6] hover:text-[#e8eded] transition-colors"
          aria-label="Close tour"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {step.title && (
          <h3 className="text-lg font-display font-semibold text-[#e8eded] mb-2">
            {step.title}
          </h3>
        )}
        <div className="text-[#e8eded] text-sm leading-relaxed">
          {step.content}
        </div>
      </div>

      {/* Footer with navigation buttons */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-[#1a7a6d33]">
        <div className="flex items-center gap-2">
          {!isFirst && (
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="border-[#1a7a6d33] text-[#8aaba6] hover:text-[#e8eded] hover:bg-[#1a7a6d22]"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onSkip}
            variant="ghost"
            size="sm"
            className="text-[#8aaba6] hover:text-[#e8eded] hover:bg-[#1a7a6d22]"
          >
            Skip Tour
          </Button>

          <Button
            onClick={onNext}
            size="sm"
            className="bg-[#1a7a6d] text-white hover:bg-[#1a7a6d]/90 border-0"
          >
            {isLast ? (
              'Get Started'
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
