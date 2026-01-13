import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import { ISelectData } from '../types';

export const subscriptionDurations: ISelectData[] = [
  {
    label: 'Daily',
    value: 'DAILY',
  },
  {
    label: 'Weekly',
    value: 'WEEKLY',
  },
  {
    label: 'Monthly',
    value: 'MONTHLY',
  },
  {
    label: 'Yearly',
    value: 'YEARLY',
  },
];

export const planFeatures = {
  [SubscriptionTypeEnum.FreeTrial]: {
    includedFeatures: ['Free Trial', '1 keyword trackers', '1 social account', 'Lead tracking', '1 Hashtag', 'Content Management'],
    excludedFeatures: ['AI Insight Assistant', 'Report generation', 'Team Collaboration', 'Alerts', 'Advanced Support'],
  },
  [SubscriptionTypeEnum.Standard]: {
    includedFeatures: ['2 keyword trackers', '2 social accounts', 'Lead tracking', '2 Hashtags', 'Content Management'],
    excludedFeatures: ['AI Insight Assistant', 'Report generation', 'Team Collaboration', 'Alerts', 'Advanced Support'],
  },
  [SubscriptionTypeEnum.Professional]: {
    includedFeatures: ['3 keyword trackers', '3 social accounts', 'Lead tracking', '3 Hashtags', 'Content Management', 'AI Insight Assistant', 'Report generation'],
    excludedFeatures: ['Team Collaboration', 'Alerts', 'Advanced Support'],
  },
  [SubscriptionTypeEnum.Business]: {
    includedFeatures: ['7 keyword trackers', '6 social accounts', 'Lead tracking', '7 Hashtags', 'Content Management', 'AI Insight Assistant', 'Report generation', 'Team Collaboration'],
    excludedFeatures: ['Alerts', 'Advanced Support'],
  },
  [SubscriptionTypeEnum.Enterprise]: {
    includedFeatures: [
      'Unlimited keyword trackers',
      'Unlimited Social Accounts',
      'Lead tracking',
      'Hashtag tracking',
      'Content Management',
      'Advanced AI Insight Assistant',
      'Full Report Generation',
      'Team Collaboration',
      'Alerts',
      'Advanced Support',
    ],
  },
  [SubscriptionTypeEnum.SocialListeningFree]: {
    includedFeatures: ['Social Listening', 'Access to Dera AI', '1 Report per Month', '1 Connected Social Account'],
    excludedFeatures: ['Advanced Support', 'Team Collaboration'],
  },
  [SubscriptionTypeEnum.SocialListeningPaid]: {
    includedFeatures: ['Social Listening', 'Access to Dera AI', '4 Reports per Month', '3 Connected Social Accounts'],
    excludedFeatures: ['Advanced Support'],
  },
  [SubscriptionTypeEnum.LeadsGen]: {
    includedFeatures: ['Lead Generation', 'Export Leads'],
    excludedFeatures: [],
  },
};
