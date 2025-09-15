import { TFeatureLimit } from '@/models/dtos/FeatureLimitDto';
import { create } from 'zustand';

const initialFeatureLimit = { limit: 0, count: 0, locked: false };

export interface FeatureLimitStoreState {
  isLoading: boolean;
  isError: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isInitialState: boolean;
  setIsInitialState: (isInitialState: boolean) => void;
  setIsError: (isError: boolean) => void;
  featureLimit: TFeatureLimit | any;
  setFeatureLimit: (featureLimit: TFeatureLimit) => void;
  resetFeatureLimitStore: () => void;
}

const initialState = {
  isLoading: false,
  isError: false,
  isInitialState: true,
  featureLimit: {
    keyword: initialFeatureLimit,
    hashtag: initialFeatureLimit,
    aiMessage: initialFeatureLimit,
    lead: initialFeatureLimit,
    mentionInsights: initialFeatureLimit,
    reportGeneration: initialFeatureLimit,
    accountTracking: {
      locked: false,
      accounts: initialFeatureLimit,
      facebookAccounts: initialFeatureLimit,
      instagramAccounts: initialFeatureLimit,
      linkedInAccounts: initialFeatureLimit,
    },
  },
};

export const useFeatureLimitStore = create<FeatureLimitStoreState>((set) => ({
  ...initialState,
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsError: (isError) => set({ isError }),
  setFeatureLimit: (featureLimit) => set({ featureLimit }),
  resetFeatureLimitStore: () => set(initialState),
  setIsInitialState: (isInitialState) => set({ isInitialState }),
}));
