import { TrackerTypeEnum } from "@/models/enum-models/TrackerTypeEnum";
import { useTackerData } from "@/hooks/tracker/trackerData.hook";

export const useKeywordTracking = () => {
  const { trackerData, isLoadingTracker, ...rest } = useTackerData(TrackerTypeEnum.KEYWORD);

  return { ...rest, keywordTrackers: trackerData, isLoadingKeywordTracker: isLoadingTracker };
};
