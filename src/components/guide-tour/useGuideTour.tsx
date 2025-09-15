import { useEffect, useState } from 'react';

import { CustomStep } from '@/components/guide-tour/guide-tour';

interface IUseGuideTour {
  initialRun?: boolean;
  steps: CustomStep[];
  tourKey: string;
}

const useGuideTour = ({ initialRun = false, steps, tourKey }: IUseGuideTour) => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (initialRun) {
      const hasSeenTour = localStorage.getItem(tourKey);
      if (hasSeenTour === 'true') {
        setRun(false);
      } else {
        setRun(true);
      }
    }
  }, [initialRun, tourKey]);

  const startTour = () => {
    setRun(true);
  };
  const stopTour = () => setRun(false);

  const handleTourFinish = () => {
    localStorage.setItem(tourKey, 'true');
    setRun(false);
  };

  return {
    run,
    startTour,
    stopTour,
    handleTourFinish,
    steps: steps.map((step) => ({
      ...step,
      disableBeacon: true,
    })),
  };
};

export default useGuideTour;
