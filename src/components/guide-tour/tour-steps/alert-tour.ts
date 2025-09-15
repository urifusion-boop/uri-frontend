import { RiAddBoxLine } from 'react-icons/ri';

export const ALERT_TOUR_STEPS = [
  {
    target: '.tour-alert-btn',
    content: 'Alerts',
    description: 'Set up alerts to monitor your brand mentions and stay informed about important conversations.',
    placement: 'top' as const,
    image: '/assets/images/tour/tour-dashboard.svg',
  },
  {
    target: '.tour-alert-export-btn',
    content: 'Export Alerts',
    description: 'Click this button to export positive /negative alerts.',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-alert-mentions',
    content: 'Mentions',
    description: 'This page will show all received alerts.',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-alert-analytics',
    content: 'Analytics',
    description: 'This page show analytics and insights for all the alerts received.',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
];
