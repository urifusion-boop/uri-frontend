import { InfluencerService } from '@/api/InfluencerService';
import { LinkedInInsightsService } from '@/api/LinkedInInsights';
import { SentimentsAnalysisService } from '@/api/SentimentsAnalysisService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { FIVE_MINUTES } from '@/data/time';
import { MetricsHelper } from '@/helpers/MetricsHelper';
import { TokenType } from '@/models/dtos/InfluencerDto';
import { CommentData } from '@/models/dtos/InstagramInsights';
import { DateFilterEnum } from '@/models/enum-models/DateFIlterEnum';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const useLinkedinAccountTracking = () => {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const influencer_id = router?.query?.influencerId as string;
  let username = router.query?.username as string;

  const {
    data: influencerData,
    isLoading: fetchingInfluencer,
    error,
  } = useQuery({
    queryKey: ['influencerData', influencer_id],
    queryFn: async () => {
      const response = await InfluencerService.getInfluencerByIdApi(influencer_id);

      if (response.status) {
        return response.responseData;
      } else {
        throw new Error(response.responseMessage ?? 'Invalid influencer');
      }
    },
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
  });

  const {
    data: businessDiscovery,
    isLoading: fetchingBusinessDiscovery,
    error: businessDiscoveryError,
  } = useQuery({
    queryKey: ['linkedin-business-discovery', influencer_id],
    queryFn: async () => {
      if (!influencerData?.token) return null;

      const response = await LinkedInInsightsService.getBusinessDiscovery(
        influencerData?.social_user_id ?? '',
        (influencerData?.token as TokenType)?.ACCOUNT_TRACKING ?? (influencerData?.token as TokenType)?.CONTENT_MANAGEMENT ?? ''
      );

      if (response.status) {
        return response.responseData;
      } else {
        throw new Error(response.responseMessage ?? 'Invalid influencer');
      }
    },
    enabled: !!influencerData,
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
  });

  const { data: linkedinAiMediaReport, isLoading: fetchingAiMediaReport } = useQuery({
    queryKey: ['linkedin-ai-media-report', influencer_id],
    queryFn: async () => {
      if (!businessDiscovery?.linkedin_user_cache_key) return null;

      const response = await LinkedInInsightsService.getAiMediaReport(businessDiscovery?.linkedin_user_cache_key);

      if (response.status) {
        return response.responseData;
      } else {
        throw new Error(response.responseMessage ?? 'Invalid influencer');
      }
    },
    enabled: !!businessDiscovery,
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
    retry: (failureCount) => {
      return failureCount < 1; // total 2 attempts
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Error fetching AI media report';
      triggerToast('error', message);
    },
  });

  const { data: lifeTimeStatics, isLoading: fetchingLifeTimeStatics } = useQuery({
    queryKey: ['life-time-statistics', influencer_id],
    queryFn: async () => {
      if (!influencerData?.social_user_id) return null;

      const response = await LinkedInInsightsService.shareStatisticsLifeTime(influencerData?.social_user_id ?? '', (influencerData?.token as TokenType)?.ACCOUNT_TRACKING ?? '');

      if (response.status) {
        return response.responseData;
      } else {
        throw new Error('Invalid influencer');
      }
    },
    enabled: !!influencerData,
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
  });

  const { data: postSTatics, isLoading: fetchingPostStatics } = useQuery({
    queryKey: ['post-statics', influencer_id, selectedPost],
    queryFn: async () => {
      if (!influencerData?.social_user_id) return null;
      if (!selectedPost) return null;

      const postDetails = MetricsHelper.getLinkedinPostIdAndType(selectedPost ?? '');

      const fetchStatistics = postDetails.type === 'ugcPost' ? LinkedInInsightsService.shareStatisticsSpecificUgcPost : LinkedInInsightsService.shareStatisticsSpecificShare;

      const response = await fetchStatistics(influencerData?.social_user_id ?? '', (influencerData?.token as TokenType)?.ACCOUNT_TRACKING ?? '', postDetails.id ?? '');

      if (response.status) {
        return response.responseData;
      } else {
        throw new Error('Invalid influencer');
      }
    },
    enabled: !!influencerData,
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
  });

  const { data: postComments, isLoading: fetchingPostComments } = useQuery({
    queryKey: ['linkedin-post-comments', influencer_id, selectedPost],
    queryFn: async () => {
      if (!influencerData?.social_user_id) return null;
      if (!selectedPost) return null;

      const postDetails = MetricsHelper.getLinkedinPostIdAndType(selectedPost ?? '');

      const response = await LinkedInInsightsService.getLinkedInPostComments(postDetails.id ?? '', (influencerData?.token as TokenType)?.ACCOUNT_TRACKING ?? '');

      if (response.status) {
        return response.responseData;
      } else {
        throw new Error('Invalid influencer');
      }
    },
    enabled: !!influencerData,
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
  });

  const { data: postSentimentData, isLoading: postSentimentLoading } = useQuery({
    queryKey: ['likedIn-comments-sentiment-analysis', selectedPost, postComments],
    queryFn: async () => {
      if (!selectedPost) return null;
      if (!postComments || postComments.length < 1) return null;

      const commentsData: CommentData[] =
        (postComments ?? [])?.map((comment) => ({
          id: comment?.id ?? '',
          text: comment?.message?.text ?? '',
          timestamp: dayjs(comment?.created?.time).format('YYYY-MM-DD HH:mm:ss'),
          username: '',
          // replies: [],
        })) ?? [];

      const response = await SentimentsAnalysisService.getCommentSentimentInsights(commentsData);

      if (response.status) return response.responseData;
      else return null;
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!postComments || !fetchingPostComments,
  });

  const { data: followersStatistics, isLoading: fetchingFollowersStatistics } = useQuery({
    queryKey: ['linkedin-followers-statistics', influencer_id],
    queryFn: async () => {
      if (!influencerData?.social_user_id) return null;

      const response = await LinkedInInsightsService.getTimeBoundFollowersStatistics(
        {
          date_range: DateFilterEnum.LAST_2_MONTHS,
          organization_id: influencerData?.social_user_id ?? '',
          time_granularity: 'DAY',
        },
        (influencerData?.token as TokenType)?.ACCOUNT_TRACKING ?? ''
      );

      if (response.status) {
        return response.responseData;
      } else {
        throw new Error('Invalid influencer');
      }
    },
    enabled: !!influencerData,
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
  });

  const useGetLinkedinPostsQuery = useInfiniteQuery({
    queryKey: ['linkedin-posts', influencer_id],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await LinkedInInsightsService.getAllLinkedinPosts(
        {
          organization_id: influencerData?.social_user_id ?? '',
          count: 10, // Number of posts per request
          start: (pageParam - 1) * 10, // Pagination logic
          sort_by: 'CREATED',
        },
        (influencerData?.token as TokenType)?.ACCOUNT_TRACKING ?? ''
      );

      return result.responseData;
    },
    getNextPageParam: (lastPage, allPages) => {
      // If last page has < 10 posts, it means there are no more pages
      if ((lastPage ?? []).length < 10) return undefined;

      // Otherwise, return the next page number
      return allPages.length + 1;
    },
    enabled: !!influencerData,
  });

  return {
    influencerData,
    errorState: error || businessDiscoveryError,
    isLoading: fetchingInfluencer || fetchingBusinessDiscovery,
    username,
    businessDiscovery,
    linkedinAiMediaReport,
    fetchingAiMediaReport,
    lifeTimeStatics,
    fetchingLifeTimeStatics,
    postSTatics,
    fetchingPostStatics,
    selectedPost,
    setSelectedPost,
    postSentimentData,
    postSentimentLoading,
    followersStatistics,
    fetchingFollowersStatistics,
    useGetLinkedinPostsQuery,
  };
};
