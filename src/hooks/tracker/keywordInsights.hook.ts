import { useQuery } from "@tanstack/react-query";
import { InstagramService } from "@/api/InstagramService";
import { useState } from "react";
import { BusinessProfileInsight } from "../../models/dtos/InstagramInsights";

interface UseInstagramAnalyticsProps {
  keyword?: string;
  metaAccessToken?: string;
}

export const useInstagramKeywordInsights = ({
  keyword,
  metaAccessToken,
}: UseInstagramAnalyticsProps) => {
  const [afterPagination, setAfterPagination] = useState("");
  const [selectedPost, setSelectedPost] = useState<BusinessProfileInsight>();
  const [postMedia, setPostMedia] = useState<BusinessProfileInsight[]>([]);
  const [nextPagination, setNextPagination] = useState<string>();

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "instagram-keyword-tracking",
      keyword,
      metaAccessToken,
      afterPagination,
    ],
    queryFn: async () => {
      if (keyword || metaAccessToken) {
        const response = await InstagramService.instagramTrackKeyword(
          keyword ?? "",
          metaAccessToken ?? ""
        );
        let responseData = response.responseData;

        // Handle if responseData is an array
        if (Array.isArray(responseData) && responseData.length > 0) {
          responseData = responseData[0]; // Return the first item if it's an array
        }

        // setPostMedia(responseData?.media.data ?? []);
        // setNextPagination(responseData?.media.paging.next);

        return responseData;
      }
      throw new Error("No keywords provided");
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: postSentimentData,
    isLoading: postSentimentLoading,
    error: postSentimentError,
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
    enabled: true, // Only trigger the query if igkeywords is provided
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes before refetching
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });

  return {
    setAfterPagination,
    data,
    isLoading,
    error,
    afterPagination,

    selectedPost,
    setSelectedPost,

    postSentimentData,
    postSentimentLoading,

    postMedia,

    nextPagination,
  };
};
