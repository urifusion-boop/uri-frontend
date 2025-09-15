import { RiAddBoxLine } from 'react-icons/ri';

export const LEAD_TOUR_STEPS = [
  {
    target: '.tour-lead-overview-btn',
    content: 'Capture Leads',
    description: 'Identify and convert potential customers',
    placement: 'right-start' as const,
    image: '/assets/images/tour/tour-lead-overview.svg',
  },
  {
    target: '.tour-lead-new-btn',
    content: 'Generate New Leads',
    description: 'Click this button to enter your business details for new leads to be generated.',
    placement: 'top' as const,
    icon: RiAddBoxLine,
  },
  // {
  //   target: '.tour-lead-mention',
  //   content: 'Mentions',
  //   description: 'Generated leads are displayed on this page.',
  //   placement: 'bottom' as const,
  //   icon: RiAddBoxLine,
  // },
  {
    target: '.tour-lead-leads',
    content: 'Leads',
    description: 'This page shows the full details of all generated leads, their status, interest levels, summary and many more',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-lead-manage',
    content: 'Manage',
    description: 'Manage your leads here',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-lead-analytics',
    content: 'Analytics',
    description: 'On this page, you can see the insights and analytics of all generated leads',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-lead-details',
    content: 'Details',
    description: 'All your saved business details shows on this page',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
];
