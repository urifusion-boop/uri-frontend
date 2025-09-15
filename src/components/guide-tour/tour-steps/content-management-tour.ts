import { RiAddBoxLine } from 'react-icons/ri';

export const CONTENT_TOUR_STEPS = [
  {
    target: '.tour-content-btn',
    content: 'Manage Content',
    description: 'Organize and optimize your posts and media.',
    placement: 'right-start' as const,
    image: '/assets/images/tour/tour-content-management-overview.svg',
  },
  {
    target: '.tour-content-new-btn',
    content: 'Create a new post/idea',
    description: 'Click this button to create a new post or a new idea.',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-content-connect-btn',
    content: 'Connect Platform',
    description: 'Click this button to connect a social media platform you want to post your content.',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-content-posts',
    content: 'Posts',
    description: 'All your created posts will be shown here.',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-content-scheduled',
    content: 'Scheduled',
    description: 'Your Scheduled posts are shown on this page',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-content-ideas',
    content: 'Ideas',
    description: 'Your drafts/ ideas are shown on this page',
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
  {
    target: '.tour-content-platforms',
    content: 'Platforms',
    description: "The social media accounts you've connected shows here",
    placement: 'bottom' as const,
    icon: RiAddBoxLine,
  },
];
