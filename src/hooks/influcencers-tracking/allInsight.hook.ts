/* eslint-disable import/no-unused-modules */
import { InstagramService } from "@/api/InstagramService";
import {
  InstagramDemographicDto,
  InstagramMediaPostDto,
} from "@/models/dtos/InstagramDto";
import { InstagramBusinessProfile } from "@/models/dtos/InstagramInsights";
import { useQuery } from "@tanstack/react-query";
import { i } from "nuqs/dist/serializer-DjSGvhZt";

// Hook for fetching influencer by ID
export const useGetIGUserInsightsById = (
  userId: string,
  access_token: string
) => {
  const {
    data: userInsightData,
    isLoading: userInsightLoading,
    error: userInsightError,
  } = useQuery({
    queryKey: ["user-insight", userId],
    queryFn: async () => {
      const response = await InstagramService.getInstagramUserInsights(
        userId,
        access_token
      );
      return response.responseData;
    },
    enabled: !!userId && !!access_token, // Only run if influencerId is defined
  });

  return {
    userInsightData,
    userInsightLoading,
    userInsightError,
  };
};

export const useGetInstagramDemographics = ({
  access_token,
  instagramData,
  influencerData,
}: {
  access_token: string;
  instagramData: InstagramDemographicDto;
  influencerData: InstagramBusinessProfile | null | undefined;
}) => {
  const {
    data,
    isLoading: userDemographicLoading,
    error: userDemographicError,
  } = useQuery({
    queryKey: ["instagram-demographics"],
    queryFn: async () => {
      if (!access_token) return [];
      if (!instagramData) return [];

      const response = await InstagramService.getInstagramDemographics(
        access_token,
        instagramData
      );

      return response.responseData;
    },
    enabled: !!influencerData,
    staleTime: 30 * 60 * 1000, // Cache data for 5 minutes before refetching
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });

  return {
    userDemographicData: data,
    userDemographicLoading,
    userDemographicError,
  };
};

export const useGetIGMediaInsightsById = (
  mediaId: string,
  access_token: string
) => {
  return useQuery({
    queryKey: ["media-insight", mediaId],
    queryFn: async () => {
      const response = await InstagramService.getInstagramMediaInsights(
        mediaId,
        access_token
      );
      return response.responseData;
    },
    enabled: !!mediaId, // Only run if influencerId is defined
    staleTime: 30 * 60 * 1000, // Cache data for 5 minutes before refetching
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};

export const useGetMediaPostInsights = ({
  access_token,
  data,
  mediaPostType,
}: {
  access_token: string;
  data: InstagramMediaPostDto;
  mediaPostType: string;
}) => {
  const { data: mediaPostData, isLoading: mediaPostLoading } = useQuery({
    queryKey: ["media-post-insights", mediaPostType, data],
    queryFn: async () => {
      const response = await InstagramService.getInstagramMediaPostInsights(
        access_token,
        data
      );
      return response.responseData;
    },
    enabled: !!access_token && !!data.media_id,
    staleTime: 30 * 60 * 1000, // Cache data for 5 minutes before refetching
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });

  return {
    mediaPostData,
    mediaPostLoading,
  };
};
