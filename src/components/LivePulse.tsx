import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const activities = [
  "Just detected: 14 Buying Signals for 'Real Estate' in Lagos...",
  "Just detected: 3 High-Intent Leads for 'FinTech' in Nairobi...",
  "Just detected: 8 Decision-Makers for 'SaaS Tools' in Accra...",
  "Just detected: 6 Hiring Signals for 'Engineering' in Cape Town...",
];

const LivePulse = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-[72px] z-40 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-b border-primary/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full flex-shrink-0"
          />
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-xs sm:text-sm font-medium text-center"
            >
              {activities[currentIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LivePulse;
