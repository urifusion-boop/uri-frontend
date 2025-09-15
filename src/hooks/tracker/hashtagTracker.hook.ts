import { HashtagTrackingService } from '@/api/HashtagTrackingService';
import { InfluencerService } from '@/api/InfluencerService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { SIX_HOURS } from '@/data/time';
import { SocialMediaEnum } from '@/models/enum-models/SocialMediaEnum';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useQueryState } from 'nuqs';
import { KeywordTrackerService } from '../../api/KeywordTrackerService';
import { TrackerDto } from '../../models/dtos/TrackerDto';
import { useAuth } from '../../providers/AuthProvider';

export const useHashtagTrackerOverview = () => {
  const { query } = useRouter();
  const { userDetails } = useAuth();

  const [activeTab, setActiveTab] = useQueryState('active_tab', {
    defaultValue: 'all-insights',
  });

  const {
    data: currentTrackerData,
    isLoading: currentTrackerDataLoading,
    error,
  } = useQuery({
    queryKey: ['current-tracker-data', query.trackerId],
    queryFn: async () => {
      const trackerId = query.trackerId;
      if (!trackerId || trackerId === '0') return null;

      const result = await KeywordTrackerService.getTrackerByIdApi(String(trackerId));

      if (result.status) {
        return result.responseData as TrackerDto;
      } else throw new Error(result.responseMessage ?? 'Something went wrong');
    },
    enabled: typeof userDetails?.userId === 'string',
    staleTime: SIX_HOURS,
    refetchOnWindowFocus: false,
  });

  const { data: accountProfiles, isLoading: accountProfilesLoading } = useQuery({
    queryKey: ['influencers', userDetails?.userId],
    queryFn: async () => {
      const response = await InfluencerService.getInfluencersByFilters({
        user_id: userDetails?.userId,
        skip: 0,
        limit: 10,
        platforms: SocialMediaEnum.INSTAGRAM,
        connected: true,
      });

      if (response.status) {
        return response.responseData;
      }
      return {
        data: [],
        metaData: {},
        total: 0,
        pageSize: 0,
      };
    },
    enabled: !!currentTrackerData,
  });

  const {
    data: hashtagTracker,
    isLoading: hashtagTrackerLoading,
    error: hashtagTrackerError,
  } = useQuery({
    queryKey: ['hashtag-tracker', query.trackerId],
    queryFn: async () => {
      // const token =  typeof accountProfiles?.data?.[0]?.token === 'string' ? accountProfiles?.data?.[0]?.token : undefined;
      const activeTokens = accountProfiles?.data?.filter((profile) => typeof profile?.token === 'string');
      const token = activeTokens?.[0]?.token as string;
      const result = await HashtagTrackingService.trackHashtagApi(currentTrackerData?.keywords?.[0] ?? '', token);

      if (result.status) {
        return result.responseData;
      } else {
        throw new Error(result.responseMessage ?? 'Error fetching hashtag Tracker');
      }
    },
    enabled: !!currentTrackerData && !!accountProfiles,
    staleTime: SIX_HOURS,
    refetchOnWindowFocus: false,
  });

  const {
    data: aiPostReport,
    isLoading: aiPostReportLoading,
    error: aiPostReportError,
    refetch: refetchAiPostReport,
  } = useQuery({
    queryKey: ['ai-post-report', query.trackerId],
    queryFn: async () => {
      const result = await HashtagTrackingService.aiPostReportApi(currentTrackerData?.keywords?.[0] ?? '');

      if (result.status) {
        return result.responseData;
      } else {
        throw new Error(result.responseMessage ?? 'Error fetching AI post report');
      }
    },
    enabled: !!hashtagTracker,
    staleTime: SIX_HOURS,
    refetchOnWindowFocus: false,
    retry: (failureCount) => {
      return failureCount < 1; // total 2 attempts
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Error fetching hashtag campaigns';
      triggerToast('error', message);
    },
  });

  const {
    data: hashtagSentiment,
    isLoading: hashtagSentimentLoading,
    error: hashtagSentimentError,
    refetch: refetchHashtagSentiment,
  } = useQuery({
    queryKey: ['hashtag-sentiment', query.trackerId],
    queryFn: async () => {
      const result = await HashtagTrackingService.getHashtagSentiment(currentTrackerData?.keywords?.[0] ?? '');
      if (result.status) {
        return result.responseData;
      } else {
        throw new Error(result.responseMessage ?? 'Error fetching hashtag sentiment');
      }
    },
    enabled: !!hashtagTracker,
    staleTime: SIX_HOURS,
    refetchOnWindowFocus: false,
    retry: (failureCount) => {
      return failureCount < 1;
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Error fetching hashtag campaigns';
      triggerToast('error', message);
    },
  });

  const { data: hashtagCampaigns, isLoading: isLoadingHashtagCampaigns } = useQuery({
    queryKey: ['hashtag-campaigns', query.trackerId],
    queryFn: async () => {
      const result = await HashtagTrackingService.getAiConversationInsight(currentTrackerData?.keywords?.[0] ?? '');
      if (result.status) {
        return result.responseData;
      } else {
        throw new Error(result.responseMessage ?? 'Something went wrong');
      }
    },
    enabled: !!hashtagTracker && aiPostReport?.related_hashtags && aiPostReport?.related_hashtags?.length > 0,
    staleTime: SIX_HOURS,
    retry: (failureCount) => {
      return failureCount < 1; // total 2 attempts
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Error fetching hashtag campaigns';
      triggerToast('error', message);
    },
  });

  return {
    activeTab,
    setActiveTab,
    currentTrackerData,
    loadingState: currentTrackerDataLoading || hashtagTrackerLoading || accountProfilesLoading,
    errorState: error || hashtagTrackerError,
    hashtagTrackerLoading,
    hashtagTracker,
    aiPostReport,
    aiPostReportLoading,
    aiPostReportError: (aiPostReportError as AxiosError)?.message,
    refetchAiPostReport,
    hashtagCampaigns,
    isLoadingHashtagCampaigns,
    hashtagSentiment,
    hashtagSentimentLoading,
    hashtagSentimentError: (hashtagSentimentError as AxiosError)?.message,
    refetchHashtagSentiment,
  };
};
