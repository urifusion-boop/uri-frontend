import { PiMinusCircleBold } from 'react-icons/pi';
import { RiAddBoxLine } from 'react-icons/ri';

// target definition:: tour - typeoftour - target  - if button (btn)
export const KEYWORD_TOUR_STEPS = [
  {
    target: '.tour-keyword-keyword-btn',
    content: 'Track Conversations',
    description: 'Monitor keywords to discover audience engagement.',
    placement: 'right-start' as const,
    image: '/assets/images/tour/tour-keyword-dashboard.svg',
  },
  {
    target: '.tour-keyword-new-btn',
    content: 'Add new Keyword',
    description: 'Click this button to add new keywords you want to track, analyze and get insights',
    placement: 'right-start' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-keyword-total',
    content: 'Number of Keyword',
    description: 'The total number of keywords you are tracking shows here',
    placement: 'bottom' as const,
    icon: PiMinusCircleBold,
  },
];
