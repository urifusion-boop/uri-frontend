import ChartLine from '@/utils/icon/ChartLine';
import HeartRateSearch from '@/utils/icon/HeartRateSearch';
import { BsGraphUp } from 'react-icons/bs';
import { FaBuilding, FaComments, FaHeartbeat, FaUser } from 'react-icons/fa';
import { HiHashtag } from 'react-icons/hi';
import { MdAssessment, MdAutorenew, MdRecordVoiceOver } from 'react-icons/md';

export interface WorkflowModule {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: React.ComponentType<any>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  comingSoon: boolean;
  modules: WorkflowModule[];
}

export const WORKFLOWS: Record<string, Workflow> = {
  'social-listening': {
    id: 'social-listening',
    name: 'Social Listening',
    description: 'Track conversations & monitor brand performance',
    icon: BsGraphUp,
    comingSoon: false,
    modules: [
      {
        id: 'account-tracking',
        name: 'Account Tracking',
        description: 'Monitor specific social media accounts',
        route: '/account-tracking',
        icon: ChartLine,
      },
      {
        id: 'keyword-tracking',
        name: 'Keyword Tracking',
        description: 'Track mentions of specific keywords',
        route: '/keyword-tracking/overview',
        icon: HeartRateSearch,
      },
      {
        id: 'hashtag-tracking',
        name: 'Hashtag Tracking',
        description: 'Follow hashtag performance',
        route: '/hashtag-tracking',
        icon: HiHashtag,
      },
      {
        id: 'report-generation',
        name: 'Report Generation',
        description: 'Generate insights reports',
        route: '/report-generation',
        icon: MdAssessment,
      },
    ],
  },
  'lead-generation': {
    id: 'lead-generation',
    name: 'Lead Generation',
    description: 'Find potential customers & leads',
    icon: MdRecordVoiceOver,
    comingSoon: false,
    modules: [
      {
        id: 'individual-leads',
        name: 'Individual Leads',
        description: 'Track and manage individual person leads',
        route: '/leads-tracking/forms/leads?type=individual',
        icon: FaUser,
      },
      {
        id: 'organization-leads',
        name: 'Organization Leads',
        description: 'Track and manage organization leads',
        route: '/leads-tracking/forms/leads?type=organization',
        icon: FaBuilding,
      },
      {
        id: 'conversational-leads',
        name: 'Sales Signals',
        description: 'Public online conversations indicating buying intent, pain, or opportunity',
        route: '/leads-tracking/forms/leads?type=conversational',
        icon: FaComments,
      },
      // Hidden - Google Maps functionality merged into Organization Lead Form via Location Intelligence
      // {
      //   id: 'googlemaps-leads',
      //   name: 'Google Maps',
      //   description: 'Discover local businesses through Google Maps based on location and criteria',
      //   route: '/leads-tracking/forms/leads?type=google-maps',
      //   icon: FaMapMarkerAlt,
      // },
    ],
  },
  crm: {
    id: 'crm',
    name: 'CRM',
    description: 'Monitor dead leads & resurrect opportunities',
    icon: MdAutorenew,
    comingSoon: false,
    modules: [
      {
        id: 'lazarus-protocol',
        name: 'Lazarus Protocol',
        description: 'Track focus contacts & companies for resurrection signals',
        route: '/lazarus',
        icon: FaHeartbeat,
      },
    ],
  },
};

export const WORKFLOW_LIST = Object.values(WORKFLOWS);

// Helper to get module route
export const getModuleRoute = (moduleId: string): string => {
  const routes: Record<string, string> = {
    'account-tracking': '/account-tracking',
    'keyword-tracking': '/keyword-tracking/overview',
    'hashtag-tracking': '/hashtag-tracking',
    'report-generation': '/report-generation',
    'individual-leads': '/leads-tracking/forms/leads?type=individual',
    'organization-leads': '/leads-tracking/forms/leads?type=organization',
    'conversational-leads': '/leads-tracking/forms/leads?type=conversational',
    'googlemaps-leads': '/leads-tracking/forms/leads?type=google-maps',
    'lazarus-protocol': '/lazarus',
  };
  return routes[moduleId] || '/dashboard';
};

// Helper to get modules for a workflow
export const getWorkflowModules = (workflowId: string): string[] => {
  const workflow = WORKFLOWS[workflowId];
  if (!workflow) return [];
  return workflow.modules.map((m) => m.id);
};
