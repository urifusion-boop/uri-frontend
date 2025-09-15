export type TLimitObject = {
  limit: number;
  count: number;
  locked: boolean;
};

export interface TFeatureLimit {
  keyword: TLimitObject;
  hashtag: TLimitObject;
  aiMessage: TLimitObject;
  lead: LeadLimitObject;
  mentionInsights: TLimitObject;
  reportGeneration: TLimitObject;
  accountTracking: {
    locked: boolean;
    accounts: TLimitObject;
    facebookAccounts: TLimitObject;
    instagramAccounts: TLimitObject;
    linkedInAccounts: TLimitObject;
  };
}

export interface FeatureLimitDto extends TFeatureLimit {
  _id: string;
  isDeleted: boolean;
  userId: string;
  subscriptionId: string;
  subscriptionStatus: string;
  subscriptionPlan: string;
}

export interface LeadLimitObject {
  limit: number;
  count: number;
  locked: boolean;
  platforms: string[];
  aiReplyContext: boolean;
  credits: Credits;
  noOfLeads: TLimitObject;
}

export interface Credits {
  count: number;
  limit: number;
  locked: boolean;
}
