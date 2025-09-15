import { KeywordTrackerService } from "@/api/KeywordTrackerService";
import { TrackerTypeEnum } from "@/models/enum-models/TrackerTypeEnum";
import { useQuery } from "@tanstack/react-query";
import { useTackerData } from "@/hooks/tracker/trackerData.hook";

export const useHashtagTracking = () => {
  const { trackerData, isLoadingTracker, ...rest } = useTackerData(TrackerTypeEnum.HASHTAG);

  // Hashtag Tracking Suggestions
  const { data: hashtagSuggestions, isLoading: isLoadingHashtagSuggestions } = useQuery({
    queryKey: ["hashtag-suggestions"],
    queryFn: async () => {
      const response = await KeywordTrackerService.getHashtagSuggestions();
      return response.responseData;
    },
  });

  return { ...rest, hashtagTrackers: trackerData, isLoadingHashtagTracker: isLoadingTracker, hashtagSuggestions, isLoadingHashtagSuggestions };
};
