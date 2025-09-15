import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import { PiMinusCircleBold } from 'react-icons/pi';
import { RiAddBoxLine } from 'react-icons/ri';

export const ACCOUNT_TOUR_STEPS = [
  {
    target: '.tour-account-overview-btn',
    content: 'Monitor Accounts',
    description: 'Track your social accounts and see how to improve them.',
    placement: 'right-start' as const,
    image: '/assets/images/tour/tour-keyword-dashboard.svg',
  },
  {
    target: '.tour-account-new-btn',
    content: 'Add an account',
    description: 'Click this button to add ann account you want to track, analyze and get insights',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-account-total',
    content: 'Total Number of Accounts',
    description: 'The total number of account you are tracking shows here',
    placement: 'bottom' as const,
    icon: PiMinusCircleBold,
  },
  {
    target: '.tour-account-authenticated-total',
    content: 'Total Number of Authenticated Accounts',
    description: 'The total number of authenticated accounts you are tracking shows here',
    placement: 'bottom' as const,
    icon: PiMinusCircleBold,
  },
  {
    target: '.tour-account-unauthenticated-total',
    content: 'Total Number of Unauthenticated Accounts',
    description: 'The total number of unauthenticated accounts you are tracking shows here',
    placement: 'bottom' as const,
    icon: PiMinusCircleBold,
  },
  {
    target: '.tour-account-onOff-btn',
    content: 'Toggle On/Off Authenticated Accounts',
    description: 'Click here to toggle on and off to view all accounts or only authenticated accounts',
    placement: 'bottom' as const,
    icon: MdOutlineTipsAndUpdates,
  },
];
