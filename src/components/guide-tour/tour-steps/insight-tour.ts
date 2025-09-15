import { RiAddBoxLine } from 'react-icons/ri';

export const INSIGHTS_TOUR_STEPS = [
  {
    target: '.tour-insight-btn',
    content: 'Insights Assistant',
    description: 'Ask any questions related to what you are tracking on URI',
    placement: 'right-start' as const,
    image: '/assets/images/tour/tour-dashboard.svg',
  },
  {
    target: '.tour-insight-features',
    content: 'Select a Feature',
    description: 'Select any of Uri features you want to ask questions or get insights on.',
    placement: 'top' as const,
    icon: RiAddBoxLine,
  },
];
