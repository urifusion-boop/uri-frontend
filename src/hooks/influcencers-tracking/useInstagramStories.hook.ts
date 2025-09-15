import { useQuery, useMutation } from "@tanstack/react-query";
import { InstagramService } from "@/api/InstagramService";
import { useState } from "react";
import { BusinessProfileInsight } from "../../models/dtos/InstagramInsights";

interface UseInstagramStoriesProps {
  igUserId: string;
  facebookToken?: string;
}

export const useInstagramStories = ({
  igUserId,
  facebookToken,
}: UseInstagramStoriesProps) => {
  const [selectedPost, setSelectedPost] = useState<BusinessProfileInsight>();

  const {
    data: stories,
    isLoading: storiesLoading,
    error,
  } = useQuery({
    queryKey: ["instagramStories", igUserId, facebookToken], // Unique key for this query
    queryFn: async () => {
      if (igUserId && facebookToken) {
        const response = await InstagramService.fetchBusinessStories(
          igUserId,
          facebookToken
        );
        let responseData = response.responseData;

        return responseData ?? []; // Otherwise, return it as is
      }
      throw new Error("No usernames provided");
    },
    enabled: !!igUserId, // Only trigger the query if igUsernames is provided
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes before refetching
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });

  const {
    data: storySentimentData,
    isLoading: storySentimentLoading,
    error: stprySentimentError,
  } = useQuery({
    queryKey: ["instagramSentimentAnalytics", selectedPost], // Unique key for this query
    queryFn: async () => {
      if (selectedPost && selectedPost.comments) {
        const response =
          await InstagramService.getInstagramCommentSentimentInsights(
            selectedPost?.comments?.data
          );
        const responseData = response.responseData;

        if (response.status)
          return responseData; // Otherwise, return it as is
        else return null;
      }

      return null;
    },
    enabled: true, // Only trigger the query if igUsernames is provided
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes before refetching
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });

  return {
    stories,
    storiesLoading,
    error,

    selectedStory: selectedPost,
    setSelectedStory: setSelectedPost,

    storySentimentData,
    storySentimentLoading,
  };
};
