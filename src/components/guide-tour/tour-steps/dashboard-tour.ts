import { GiSettingsKnobs } from 'react-icons/gi';
import { LuLayoutDashboard } from 'react-icons/lu';
import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import { RxComponent1 } from 'react-icons/rx';

export const DASHBOARD_TOUR_STEPS = [
  {
    target: '.tour-dashboard-btn',
    content: 'Navigate all your features',
    description: 'Get quick access to all Features, Tools and Recent Update',
    placement: 'right-start' as const,
    icon: LuLayoutDashboard,
    image: '/assets/images/tour/tour-dashboard.svg',
  },
  {
    target: '.tour-settings-btn',
    content: 'Configure your settings',
    description: 'Connect accounts, Update your notification preference, Invite your team and much more',
    placement: 'top' as const,
    icon: GiSettingsKnobs,
    image: '/assets/images/tour/tour-settings.svg',
  },
  {
    target: '.tour-notification-btn',
    content: 'Stay Updated with Notifications',
    description: 'Get notifications for all leads, mentions and tracking updates',
    placement: 'bottom' as const,
    icon: MdOutlineTipsAndUpdates,
    image: '/assets/images/tour/tour-notifications.svg',
  },
  {
    target: '.tour-features',
    content: 'Access All Key Features in One Place',
    description: 'Explore powerful tools for tracking, analytics, and engagement',
    placement: 'right-start' as const,
    icon: RxComponent1,
    image: '/assets/images/tour/tour-features.svg',
  },
];
