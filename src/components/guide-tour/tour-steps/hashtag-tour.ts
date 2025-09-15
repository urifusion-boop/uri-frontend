import { PiMinusCircleBold } from 'react-icons/pi';
import { RiAddBoxLine } from 'react-icons/ri';

export const HASHTAG_TOUR_STEPS = [
  {
    target: '.tour-hashtag-overview-btn',
    content: 'Track Hashtags',
    description: 'Measure reach and engagements of hashtags.',
    placement: 'right-start' as const,
    image: '/assets/images/tour/tour-keyword-dashboard.svg',
  },
  {
    target: '.tour-hashtag-new-btn',
    content: 'Track a Hashtag',
    description: 'Click this button to add a hashtag you want to track, analyze and get insights',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-hashtag-total',
    content: 'Total Number of Hashtags',
    description: 'The total number of hashtags you are tracking shows here',
    placement: 'bottom' as const,
    icon: PiMinusCircleBold,
  },
];
