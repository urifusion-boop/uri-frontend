import { InfluencerService } from '@/api/InfluencerService';
import { InstagramService } from '@/api/InstagramService';
import { SentimentsAnalysisService } from '@/api/SentimentsAnalysisService';
import { SocialMediaAgentService } from '@/api/SocialMediaAgentService';
import { queryClient } from '@/configs/query-client.config';
import { SIX_HOURS } from '@/data/time';
import { DateHelper } from '@/helpers/DateHelper';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BusinessProfileInsight } from '../../models/dtos/InstagramInsights';

interface UseInstagramAnalyticsProps {
  username?: string;
}

export const useInstagramAnalytics = ({ username }: UseInstagramAnalyticsProps) => {
  const router = useRouter();

  const influencer_id = router?.query?.influencerId as string;

  const [selectedPost, setSelectedPost] = useState<BusinessProfileInsight>();
  const [selectedTag, setSelectedTag] = useState<BusinessProfileInsight>();

  const {
    data: influencerData,
    isLoading: fetchingInfluencer,
    error: influencerError,
  } = useQuery({
    queryKey: ['influencerData', influencer_id],
    queryFn: async () => {
      const response = await InfluencerService.getInfluencerByIdApi(influencer_id);
      console.log('error response', response);
      if (response.status) {
        return response.responseData;
      } else {
        throw new Error(response.responseMessage ?? 'Invalid influencer');
      }
    },
    staleTime: SIX_HOURS,
    refetchOnWindowFocus: false,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['instagramAnalytics', username, influencerData?.meta_access_token], // Unique key for this query
    queryFn: async () => {
      if (username) {
        const response = await InstagramService.instagramBusinessDiscovery({
          username: username,
          meta_access_token: (influencerData?.meta_access_token ?? '') as string,
        });

        if (!response.status) {
          throw new Error(response.responseMessage ?? 'Failed to fetch instagram analytics');
        }

        let responseData = response.responseData;

        // Handle if responseData is an array
        if (Array.isArray(responseData) && responseData.length > 0) {
          responseData = responseData[0];
        }

        return responseData;
      }
      throw new Error('No usernames provided');
    },
    enabled: !!influencerData,
    staleTime: SIX_HOURS,
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });

  const { data: postSentimentData, isLoading: postSentimentLoading } = useQuery({
    queryKey: ['instagramSentimentAnalytics', selectedPost], // Unique key for this query
    queryFn: async () => {
      if (selectedPost && selectedPost.comments) {
        const response = await SentimentsAnalysisService.getCommentSentimentInsights(selectedPost?.comments?.data);
        const responseData = response.responseData;

        if (response.status)
          return responseData; // Otherwise, return it as is
        else return null;
      }

      return null;
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: tagSentimentData, isLoading: tagSentimentLoading } = useQuery({
    queryKey: ['instagramTagSentimentAnalytics', selectedTag], // Unique key for this query
    queryFn: async () => {
      if (selectedTag?.comments?.data) {
        const response = await InstagramService.getInstagramCommentSentimentInsights(selectedTag?.comments?.data);
        const responseData = response.responseData;

        if (response.status)
          return responseData; // Otherwise, return it as is
        else return null;
      }

      return null;
    },
    enabled: !!selectedTag?.comments?.data,
    staleTime: SIX_HOURS,
    refetchOnWindowFocus: false,
  });

  const {
    data: aiMediaReport,
    isLoading: aiMediaReportLoading,
    error: aiMediaReportError,
  } = useQuery({
    queryKey: ['instagramMediaAiReport', data?.cache_key, influencer_id],
    queryFn: async () => {
      if (data?.cache_key) {
        const response = await InstagramService.fetchInstagramAiMediaReport(data?.cache_key ?? '');
        const responseData = response.responseData;

        if (response.status && responseData) {
          // Silently persist insights so auto-content generation can use them
          SocialMediaAgentService.connectInsights({
            influencer_id: influencer_id,
            platform: 'instagram',
            social_user_id: data?.id,
            insights: responseData as unknown as Record<string, unknown>,
          }).catch(() => {
            /* non-critical — swallow silently */
          });
          return responseData;
        }
        return null;
      }

      return null;
    },
    enabled: !!data,
    staleTime: SIX_HOURS,
    refetchOnWindowFocus: false,
  });

  const { data: demographicData, isLoading: demographicDataLoading } = useQuery({
    queryKey: ['instagramDemograhicAnalytics', data], // Unique key for this query
    queryFn: async () => {
      if (data && influencerData?.token) {
        const response = await InstagramService.getInstagramDemographicMetricInsights(
          {
            ig_user_id: data?.id ?? '',
            metrics: 'follower_demographics',
            metric_type: 'total_value',
            breakdowns: 'country',
            period: 'lifetime',
            ...DateHelper.generateUnixTimestampRange(new Date(), 700),
          },
          (influencerData?.meta_access_token ?? '') as string
        );
        const responseData = response.responseData;

        if (response.status) return responseData;
        else return [];
      }

      return [];
    },
    enabled: !!influencerData,
    staleTime: SIX_HOURS,
    refetchOnWindowFocus: false,
  });

  const { mutate: fetchPosts, isLoading: fetchPostsLoading } = useMutation({
    mutationFn: async () => {
      if (!data) return null;
      const result = await InstagramService.fetchBusinessMedia(data.id, (influencerData?.meta_access_token ?? '') as string, data.media.paging.next);

      if (result.status) {
        queryClient.setQueryData(['instagramAnalytics', username, influencerData?.token], (oldData: any) => {
          return {
            ...oldData,
            media: {
              data: oldData.media.data.concat(result.responseData?.data),
              paging: result.responseData?.paging,
            },
          };
        });
      }

      return result.responseData ?? null;
    },
    onError: (error: any) => console.log(error.message),
  });

  return {
    isLoading: isLoading || fetchingInfluencer,
    error: error || influencerError,
    data,
    selectedPost,
    setSelectedPost,
    selectedTag,
    setSelectedTag,
    postSentimentData,
    tagSentimentData,
    demographicData,
    demographicDataLoading,
    tagSentimentLoading,
    fetchPosts,
    fetchPostsLoading,
    postSentimentLoading,
    aiMediaReport,
    aiMediaReportLoading,
    influencerData,
  };
};
