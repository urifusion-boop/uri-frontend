import { useMutation, useQuery } from '@tanstack/react-query';
import { BusinessProfileInsight, InstagramBusinessProfile, TagsResponse } from '../../models/dtos/InstagramInsights';

import { InstagramService } from '@/api/InstagramService';
import { useState } from 'react';

interface UseInstagramTagsProps {
  data: InstagramBusinessProfile | null | undefined;
  facebookToken?: string;
}

export const useInstagramTags = ({ facebookToken, data }: UseInstagramTagsProps) => {
  const [tagsMedia, setTagsMedia] = useState<BusinessProfileInsight[]>([]);
  const [afterPagination, setAfterPagination] = useState<string>();

  const {
    data: tags,
    isLoading: tagsLoading,
    error,
  } = useQuery({
    queryKey: ['instagramTags', data?.id, afterPagination], // Unique key for this query
    queryFn: async () => {
      if (!data) return {} as TagsResponse;

      if (data.id && facebookToken) {
        const response = await InstagramService.fetchBusinessTags(data.id, facebookToken, afterPagination);
        let responseData = response.responseData;

        // Handle if responseData is an array
        if (Array.isArray(responseData) && responseData.length > 0) {
          responseData = responseData[0]; // Return the first item if it's an array
        }

        setTagsMedia(responseData?.posts ?? []);
        setAfterPagination(responseData?.paging?.cursors?.after);

        return responseData; // Otherwise, return it as is
      }
      throw new Error('No usernames provided');
    },
    enabled: !!data,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes before refetching
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });

  const { mutate: fetchTags, isLoading: fetchTagsLoading } = useMutation({
    mutationFn: async () => {
      if (!tags) return null;
      const result = await InstagramService.fetchBusinessTags(data?.id ?? '', facebookToken ?? '', afterPagination);
      return result.responseData ?? null;
    },
    onSuccess: async (response: TagsResponse | null) => {
      if (response && response.posts?.length > 0) {
        setTagsMedia(tagsMedia.concat(response.posts));
        setAfterPagination(response.paging?.cursors?.after ?? undefined);
      } else return;
    },
    onError: (error: any) => console.log(error.message),
  });

  return {
    setAfterPagination,
    tags,
    tagsLoading,
    error,
    afterPagination,

    tagsMedia,
    tagsAfterPagination: afterPagination,

    fetchTags,
    fetchTagsLoading,
  };
};
