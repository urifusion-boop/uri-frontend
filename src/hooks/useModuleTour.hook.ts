import { useEffect } from 'react';
import useGuideTour from '@/components/guide-tour/useGuideTour';
import { CustomStep } from '@/components/guide-tour/guide-tour';

interface UseModuleTourProps {
  moduleId: string;
  steps: CustomStep[];
}

/**
 * Hook to auto-trigger module tours for new users who just completed onboarding
 * Tours only show once per module
 */
export const useModuleTour = ({ moduleId, steps }: UseModuleTourProps) => {
  const tourKey = `hasSeenTour_${moduleId}`;
  const { run, startTour, stopTour, handleTourFinish, steps: processedSteps } = useGuideTour({
    initialRun: false,
    steps,
    tourKey,
  });

  useEffect(() => {
    // Check if user should see module tours (just completed onboarding)
    const showModuleTours = localStorage.getItem('showModuleTours');
    const hasSeenThisTour = localStorage.getItem(tourKey);

    // Auto-start tour if:
    // 1. User just completed onboarding (showModuleTours flag exists)
    // 2. Haven't seen this specific module tour yet
    if (showModuleTours === 'true' && hasSeenThisTour !== 'true') {
      // Small delay to let page load
      const timer = setTimeout(() => {
        startTour();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [moduleId, tourKey, startTour]);

  const handleFinish = () => {
    handleTourFinish();
    // Check if we should clear the showModuleTours flag
    // (This happens after all module tours have been seen)
  };

  return {
    run,
    startTour,
    stopTour,
    handleTourFinish: handleFinish,
    steps: processedSteps,
  };
};
