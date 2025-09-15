import { InfluencerService } from '@/api/InfluencerService';
import { KeywordTrackerService } from '@/api/KeywordTrackerService';
import { TrackerTypeEnum } from '@/models/enum-models/TrackerTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';

const useFeatureOptions = (selectedFeature: string) => {
  const { userDetails } = useAuth();
  const userId = userDetails?.userId;

  // Keyword Trackers query
  const keywordTrackersQuery = useQuery({
    queryKey: ['keyword-trackers', userId],
    queryFn: async () => {
      const response = await KeywordTrackerService.getTrackersByFilters({
        user_id: userId,
        skip: 0,
        tracker_type: TrackerTypeEnum.KEYWORD,
      });
      return response.responseData;
    },
    enabled: selectedFeature === 'keyword',
  });

  // Hashtag Trackers query
  const hashtagTrackersQuery = useQuery({
    queryKey: ['hashtag-trackers', userId],
    queryFn: async () => {
      const response = await KeywordTrackerService.getTrackersByFilters({
        limit: 100,
        user_id: userId,
        skip: 0,
        tracker_type: TrackerTypeEnum.HASHTAG,
      });
      return response.responseData;
    },
    enabled: selectedFeature === 'hashtag',
  });

  // Account Trackers query
  const accountTrackersQuery = useQuery({
    queryKey: ['account-trackers', userId],
    queryFn: async () => {
      const response = await InfluencerService.getInfluencersByFilters({
        limit: 100,
        skip: 0,
        connected: true,
        user_id: userId,
      });
      return response.responseData;
    },
    enabled: selectedFeature === 'account',
  });

  switch (selectedFeature) {
    case 'account':
      return {
        isLoading: accountTrackersQuery.isLoading,
        data: accountTrackersQuery.data?.data?.map((item) => ({
          id: item.influencer_id,
          name: `${item.social_username} - ${item.social_platform}`,
          // Include full influencer data for payload generation
          influencer_id: item.influencer_id,
          social_platform: item.social_platform,
          social_username: item.social_username,
        })),
      };
    case 'hashtag':
      return {
        isLoading: hashtagTrackersQuery.isLoading,
        data: hashtagTrackersQuery?.data?.data?.map((item) => ({
          id: item.tracker_id,
          name: item.keywords?.join(', '),
        })),
      };
    case 'keyword':
      return {
        isLoading: keywordTrackersQuery.isLoading,
        data: keywordTrackersQuery?.data?.data?.map((item) => ({
          id: item.tracker_id,
          name: item.keywords?.join(', '),
        })),
      };
    default:
      return { isLoading: false, data: [] };
  }
};

export default useFeatureOptions;
