import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

import { Box } from '@mui/material';

interface HorizontalSliderProps {
  children: React.ReactNode;
  gap?: string;
  variant?: 'circle' | 'square';
  scrollThreshold?: number;
}

const HorizontalSlider = ({ children, gap, variant = 'circle', scrollThreshold = 0 }: HorizontalSliderProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 284 + 40; // card width + gap
      container.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;

      setShowLeftArrow(scrollLeft > scrollThreshold);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - (scrollThreshold + 10));
    }
  }, [scrollThreshold]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
    }
    return () => container?.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  return (
    <div className="relative w-full">
      <div
        ref={scrollContainerRef}
        className={`flex ${gap ?? 'md:gap-10 gap-6'} items-stretch overflow-x-auto scroll-smooth ${variant === 'circle' ? 'w-full' : 'w-[96%]'} -my-10 py-10`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory',
        }}
      >
        {children}
      </div>

      {showLeftArrow && (
        <Box
          component={'button'}
          className="bg-[#CD1B78] hover:bg-[#CD1B78] active:bg-[#CD1B78]"
          onClick={() => handleScroll('left')}
          sx={{
            position: 'absolute',
            left: -10,
            top: '50%',
            transform: 'translateY(-50%)',
            padding: 1,
            borderRadius: variant === 'circle' ? '50%' : '6px',
          }}
        >
          <BiChevronLeft className="text-white" size={20} />
        </Box>
      )}

      {showRightArrow && (
        <Box
          component={'button'}
          className="bg-[#CD1B78] hover:bg-[#CD1B78] active:bg-[#CD1B78]"
          onClick={() => handleScroll('right')}
          sx={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            padding: 1,
            borderRadius: variant === 'circle' ? '50%' : '6px',
          }}
        >
          <BiChevronRight className="text-white" size={20} />
        </Box>
      )}
    </div>
  );
};

export default HorizontalSlider;
