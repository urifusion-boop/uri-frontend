import { FacebookInsightsService } from '@/api/FacebookInsightsService';
import { InfluencerService } from '@/api/InfluencerService';
import { InstagramService } from '@/api/InstagramService';
import { SentimentsAnalysisService } from '@/api/SentimentsAnalysisService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { queryClient } from '@/configs/query-client.config';
import { FIVE_MINUTES, THIRTY_MINUTES } from '@/data/time';
import { DateHelper } from '@/helpers/DateHelper';
import { MetricsHelper } from '@/helpers/MetricsHelper';
import { CommentData, MediaResponse } from '@/models/dtos/InstagramInsights';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';

type SelectedType = {
  comments?: CommentData[];
  id: string;
  media_type?: string;
};

export const useFacebookInfluencerAnalysis = () => {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<SelectedType>();
  const [selectedReels, setSelectedReels] = useState<SelectedType>();

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
    isLoading: fetchingDiscovery,
    error: businessDiscoveryError,
  } = useQuery({
    queryKey: ['facebookBusinessDiscovery', influencer_id],
    queryFn: async () => {
      if (!influencerData?.token) return null;

      const response = await FacebookInsightsService.getBusinessDiscovery(
        {
          page_id: influencerData?.social_user_id ?? '',
        },
        influencerData?.token as string
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

  const { data: postSentimentData, isLoading: postSentimentLoading } = useQuery({
    queryKey: ['postSentimentAnalytics', selectedPost, influencer_id],
    queryFn: async () => {
      if (!selectedPost) return null;

      const response = await SentimentsAnalysisService.getCommentSentimentInsights(selectedPost.comments ?? []);
      const responseData = response.responseData;

      if (response.status) return responseData;
      else return null;
    },
    staleTime: THIRTY_MINUTES,
    refetchOnWindowFocus: false,
  });

  const { data: facebookReelsData, isLoading: facebookReelsDataLoading } = useQuery({
    queryKey: ['facebookReelsData', influencer_id],
    queryFn: async () => {
      if (!influencerData?.token) return null;

      const response = await FacebookInsightsService.getFacebookReels(
        {
          page_id: influencerData?.social_user_id ?? '',
        },
        influencerData?.token as string
      );

      if (response.status) return response.responseData;
      else return null;
    },
    staleTime: THIRTY_MINUTES,
    refetchOnWindowFocus: false,
    enabled: !!influencerData,
  });

  const { data: facebookPostData, isLoading: facebookPostDataLoading } = useQuery({
    queryKey: ['facebookPostData', influencer_id],
    queryFn: async () => {
      if (!influencerData?.token) return null;

      const response = await FacebookInsightsService.getFacebookPost(influencerData?.token as string);

      if (response.status) return response.responseData;
      else return null;
    },
    staleTime: THIRTY_MINUTES,
    refetchOnWindowFocus: false,
    enabled: !!influencerData,
  });

  const { data: facebookVideoInsightsData, isLoading: facebookVideoInsightsDataLoading } = useQuery({
    queryKey: ['facebookReelsInsights', selectedReels, influencer_id],
    queryFn: async () => {
      if (!selectedReels) return null;

      const response = await FacebookInsightsService.getFacebookVideoInsights((influencerData?.token ?? '') as string, selectedReels.id);

      if (response.status) return response.responseData;
      else return null;
    },
    staleTime: THIRTY_MINUTES,
    refetchOnWindowFocus: false,
  });

  const { data: facebookPostInsightsData, isLoading: facebookPostInsightsDataLoading } = useQuery({
    queryKey: ['facebookPostInsights', selectedPost, influencer_id],
    queryFn: async () => {
      if (!selectedPost) return null;

      const response = await FacebookInsightsService.getFacebookPostInsights(
        (influencerData?.token ?? '') as string,
        selectedPost?.id ?? '',
        MetricsHelper.getFacebookPostMetrics(selectedPost?.media_type ?? '')
      );

      if (response.status) return response.responseData;
      else return null;
    },
    staleTime: THIRTY_MINUTES,
    refetchOnWindowFocus: false,
  });

  const { data: facebookMentionsData, isLoading: facebookMentionsDataLoading } = useQuery({
    queryKey: ['facebookMentionData', influencer_id],
    queryFn: async () => {
      if (!influencerData) return null;

      const response = await FacebookInsightsService.getFacebookMentions(
        {
          page_id: influencerData?.social_user_id ?? '',
        },
        (influencerData?.token ?? '') as string
      );

      if (response.status) return response.responseData;
      else return null;
    },
    staleTime: THIRTY_MINUTES,
    refetchOnWindowFocus: false,
    enabled: !!influencerData,
  });

  const { data: facebookPageInsightsData, isLoading: facebookPageInsightsLoading } = useQuery({
    queryKey: ['facebookPageInsightsData', influencer_id],
    queryFn: async () => {
      if (!influencerData) return null;

      const { since, until } = DateHelper.generateUnixTimestampRange(new Date(), 28);

      const response = await FacebookInsightsService.getFacebookPageInsights(
        {
          page_id: influencerData?.social_user_id ?? '',
          period: 'day',
          since: String(since),
          until: String(until),
          metics: 'page_impressions,page_post_engagements,page_follows,page_views_total,page_posts_impressions',
        },
        (influencerData?.token ?? '') as string
      );

      if (response.status) return response.responseData;
      else return null;
    },
    staleTime: THIRTY_MINUTES,
    refetchOnWindowFocus: false,
    enabled: !!influencerData,
  });

  const { data: mentionsSentimentData, isLoading: mentionsSentimentLoading } = useQuery({
    queryKey: ['mentionsSentimentData', selectedPost, influencer_id],
    queryFn: async () => {
      const response = await SentimentsAnalysisService.getCommentSentimentInsights(
        facebookMentionsData?.data?.map((mention) => ({
          id: mention.id,
          text: mention.message,
          timestamp: mention.created_time,
          username: '',
        })) ?? []
      );
      const responseData = response.responseData;

      if (response.status) return responseData;
      else return null;
    },
    staleTime: THIRTY_MINUTES,
    refetchOnWindowFocus: false,
    enabled: !!facebookMentionsData,
  });

  const { mutate: fetchPosts, isLoading: fetchPostsLoading } = useMutation({
    mutationFn: async () => {
      if (!facebookPostData) return null;
      const result = await InstagramService.fetchBusinessMedia(facebookPostData.id, (influencerData?.token ?? '') as string, facebookPostData.feed.paging.next);

      if (result.status) {
        queryClient.setQueryData(['facebookPostData', influencer_id], (oldData: any) => {
          return {
            ...oldData,
            feed: {
              ...oldData.feed,
              data: [...oldData.feed.data, ...(result.responseData?.data ?? [])],
              paging: result.responseData?.paging ?? oldData.feed.paging,
            },
          };
        });
      }

      return result.responseData ?? null;
    },
    onSuccess: async (response: MediaResponse | null) => {},
    onError: (error: any) => console.log(error.message),
  });

  const {
    data: aiMediaReport,
    isLoading: aiMediaReportLoading,
    error: aiMediaReportError,
  } = useQuery({
    queryKey: ['facebookMediaAiReport', businessDiscovery?.facebook_cache_key],
    queryFn: async () => {
      if (businessDiscovery?.facebook_cache_key) {
        const response = await FacebookInsightsService.fetchFacebookAiMediaReport(businessDiscovery?.facebook_cache_key ?? '');
        const responseData = response.responseData;

        if (response.status) return responseData;
        else throw new Error(response.responseMessage);
      }

      return null;
    },
    enabled: !!businessDiscovery,
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
    retry: (failureCount) => {
      return failureCount < 1; // total 2 attempts
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Error fetching ai media report';
      triggerToast('error', message);
    },
  });

  return {
    username,
    businessDiscovery,
    isLoading: fetchingInfluencer || fetchingDiscovery,
    errorState: error || businessDiscoveryError,
    postSentimentData,
    postSentimentLoading,
    setSelectedPost,
    selectedPost,
    facebookReelsData,
    facebookReelsDataLoading,
    facebookVideoInsightsData,
    facebookVideoInsightsDataLoading,
    setSelectedReels,
    selectedReels,
    facebookPostInsightsData,
    facebookPostInsightsDataLoading,
    facebookMentionsData,
    facebookMentionsDataLoading,
    facebookPageInsightsData,
    facebookPageInsightsLoading,
    mentionsSentimentData,
    mentionsSentimentLoading,
    fetchPosts,
    fetchPostsLoading,
    aiMediaReport,
    aiMediaReportLoading,
    aiMediaReportError,
    facebookPostData,
    facebookPostDataLoading,
  };
};
