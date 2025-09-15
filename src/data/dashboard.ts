import { BiBook } from 'react-icons/bi';
import { FaFolder } from 'react-icons/fa';
import { FaMagnifyingGlassChart, FaUserTie } from 'react-icons/fa6';
import { GrAction, GrNotification } from 'react-icons/gr';

import AlertOnFilled from '@/utils/icon/AlertOnFilled';
import ChartLine from '@/utils/icon/ChartLine';
import HeartRateSearch from '@/utils/icon/HeartRateSearch';
import { BiBot } from 'react-icons/bi';
import { FaList } from 'react-icons/fa';
import { FiHelpCircle } from 'react-icons/fi';
import { GoChecklist } from 'react-icons/go';
import { HiHashtag } from 'react-icons/hi';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { IoMdPricetags } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { IconType } from 'react-icons/lib';
import { MdRecordVoiceOver } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';

interface ILink {
  label: string;
  route: string;
  icon: IconType;
  tourKey?: string;
  subLinkers?: {
    label: string;
    route: string;
    needId?: boolean;
    icon: IconType;
  }[];
}

export const dashboardLinks: ILink[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: RxDashboard, // Clean dashboard icon for the central hub.
    tourKey: 'tour-dashboard-btn',
  },
  {
    label: 'Keyword Tracking',
    icon: HeartRateSearch, // A magnifying glass icon for tracking keywords.
    route: '/keyword-tracking/overview',
    tourKey: 'tour-keyword-keyword-btn',
  },
  {
    label: 'Account Tracking',
    icon: ChartLine, // A trending graph for tracking influencer metrics.
    route: '/account-tracking',
    tourKey: 'tour-account-overview-btn',
    // subLinkers: [
    //   {
    //     label: 'Overview',
    //     route: '/overview',
    //     icon: FaUsers, // A camera icon for influencer media overview.
    //   },
    // {
    //   label: "Comparison Analysis",
    //   route: "/comparison-analysis",
    //   needId: true,
    //   icon: AiOutlineVideoCamera, // A video camera for comparison analysis.
    // },
    //],
  },
  {
    label: 'Hashtag Tracking',
    icon: HiHashtag, // A camera for managing content/media.
    route: '/hashtag-tracking',
    tourKey: 'tour-hashtag-overview-btn',
  },
  {
    label: 'Content Management',
    icon: FaFolder, // A camera for managing content/media.
    route: '/content-management/create',
    tourKey: 'tour-content-btn',
  },
  {
    label: 'Insight Assistant',
    route: '/uri-assistant',
    icon: BiBot,
    tourKey: 'tour-insight-btn',
  },
  {
    label: 'Leads Tracking',
    icon: MdRecordVoiceOver,
    route: '/leads-tracking',
    tourKey: 'tour-lead-overview-btn',
    subLinkers: [
      {
        label: 'Forms',
        route: '/forms',
        icon: BiBook,
      },
      {
        label: 'History',
        route: '/history',
        icon: FaList,
      },
    ],
    // subLinkers: [
    //   // {
    //   //   label: 'Overview',
    //   //   route: '/overview',
    //   //   icon: FaUsers, // A camera icon for influencer media overview.
    //   // },
    //   {
    //     label: 'Forms',
    //     route: '/forms',
    //     icon: FaBook, // A camera icon for influencer media overview.
    //   },
    // ],
  },
  {
    label: 'Alerts',
    icon: AlertOnFilled,
    route: '/alert',
    tourKey: 'tour-alert-btn',
  },
  {
    label: 'Report Generation',
    icon: GoChecklist,
    route: '/report-generation',
    tourKey: 'tour-report-btn',
  },
  // {
  //   label: 'Teams',
  //   icon: LiaUsersCogSolid,
  //   route: '/teams',
  //   tourKey: 'tour-teams-btn',
  // },
];

export const dashboardAdminLinks: ILink[] = [
  {
    label: 'Dashboard',
    route: '/admin/dashboard',
    icon: RxDashboard,
  },
  {
    label: 'Features',
    route: '/admin/features',
    icon: GrAction,
  },
  {
    label: 'Pricing',
    route: '/admin/pricing',
    icon: IoMdPricetags,
  },
  {
    label: 'Creatives',
    route: '/admin/creatives',
    icon: HiMiniUserGroup,
  },
  {
    label: 'Clients',
    route: '/admin/clients',
    icon: FaUserTie,
  },
  {
    label: 'Notifications',
    route: '/admin/notifications',
    icon: GrNotification,
  },
];

export const dashboardBottomLinks: ILink[] = [
  {
    label: 'Help',
    route: '/help',
    icon: FiHelpCircle,
  },
  {
    label: 'Settings',
    route: '/settings',
    icon: IoSettingsOutline,
  },
];

export const dashboardAdminBottomLinks: ILink[] = [
  {
    label: 'Settings',
    route: '/admin/settings',
    icon: IoSettingsOutline,
  },
];

export const trackerLinks = {
  label: 'Keyword Tracking',
  icon: FaMagnifyingGlassChart,
  route: '/tracker',
  subLinkers: [
    {
      label: 'Overview',
      route: '/overview',
    },
    {
      label: 'Posts',
      route: '/posts',
    },
    {
      label: 'All Trackers',
      route: '/all-trackers',
    },
    {
      label: 'Manage',
      route: '/manage',
    },
    {
      label: 'Influencers',
      route: '/influencers',
    },
  ],
};
