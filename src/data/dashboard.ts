import { FaBuilding, FaComments, FaHeartbeat, FaUser, FaWallet } from 'react-icons/fa';
import { FaMagnifyingGlassChart, FaUserTie } from 'react-icons/fa6';
import { GrAction, GrNotification } from 'react-icons/gr';

import ChartLine from '@/utils/icon/ChartLine';
import HeartRateSearch from '@/utils/icon/HeartRateSearch';
import { BiBot } from 'react-icons/bi';
import { BsGraphUp } from 'react-icons/bs';
import { FaList } from 'react-icons/fa';
import { FiHelpCircle } from 'react-icons/fi';
import { GoChecklist } from 'react-icons/go';
import { HiHashtag } from 'react-icons/hi';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { IoMdPricetags } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { IconType } from 'react-icons/lib';
import { MdAutorenew, MdRecordVoiceOver, MdSettings, MdViewModule } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';

interface ILink {
  label: string;
  route?: string;
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
    icon: RxDashboard,
    tourKey: 'tour-dashboard-btn',
  },
  {
    label: 'Social Listening',
    icon: BsGraphUp,
    route: '/social-listening',
    tourKey: 'tour-social-listening-btn',
    subLinkers: [
      {
        label: 'Account Tracking',
        route: '/account-tracking',
        icon: ChartLine,
      },
      {
        label: 'Keyword Tracking',
        route: '/keyword-tracking/overview',
        icon: HeartRateSearch,
      },
      {
        label: 'Hashtag Tracking',
        route: '/hashtag-tracking',
        icon: HiHashtag,
      },
      {
        label: 'Report Generation',
        route: '/report-generation',
        icon: GoChecklist,
      },
    ],
  },
  {
    label: 'Lead Generation',
    icon: MdRecordVoiceOver,
    route: '/leads-tracking',
    tourKey: 'tour-lead-overview-btn',
    subLinkers: [
      {
        label: 'Overview',
        route: '/leads-tracking/forms',
        icon: MdViewModule,
      },
      {
        label: 'Individual Leads',
        route: '/leads-tracking/forms/manage?type=individual',
        icon: FaUser,
      },
      {
        label: 'Organization Leads',
        route: '/leads-tracking/forms/manage?type=organization',
        icon: FaBuilding,
      },
      {
        label: 'Sales Signals',
        route: '/leads-tracking/forms/manage?type=conversational',
        icon: FaComments,
      },
      {
        label: 'History',
        route: '/leads-tracking/history',
        icon: FaList,
      },
    ],
  },
  {
    label: 'CRM',
    icon: MdAutorenew,
    route: '/lazarus',
    tourKey: 'tour-crm-btn',
    subLinkers: [
      {
        label: 'Lazarus Protocol',
        route: '/lazarus',
        icon: FaHeartbeat,
      },
      {
        label: 'Auto-Detection Settings',
        route: '/lazarus/settings',
        icon: MdSettings,
      },
    ],
  },
  {
    label: 'Wallet',
    icon: FaWallet,
    tourKey: 'tour-wallet-btn',
    subLinkers: [
      {
        label: 'Overview',
        route: '/wallet',
        icon: FaWallet,
      },
      {
        label: 'History',
        route: '/wallet/history',
        icon: FaList,
      },
    ],
  },
  {
    label: 'Insight Assistant',
    route: '/uri-assistant',
    icon: BiBot,
    tourKey: 'tour-insight-btn',
  },
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
