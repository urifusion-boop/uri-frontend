import { RiAddBoxLine } from 'react-icons/ri';

export const REPORT_TOUR_STEPS = [
  {
    target: '.tour-report-btn',
    content: 'Report Generation',
    description: 'Generate comprehensive reports to assess your performance.',
    placement: 'top' as const,
    image: '/assets/images/tour/tour-dashboard.svg',
  },
  {
    target: '.tour-report-features',
    content: 'Select a Feature',
    description: 'Select any of Uri features you want to generate report for.',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-report-generate-btn',
    content: 'Generate Report',
    description: 'After modifying your report, click on this button to generate report',
    placement: 'top' as const,
    icon: RiAddBoxLine,
  },
];
