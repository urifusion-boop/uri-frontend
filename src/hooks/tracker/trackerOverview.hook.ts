import { KeywordTrackDto, TrackerDto } from '../../models/dtos/TrackerDto';

import { triggerToast } from '@/components/atoms/CustomToast';
import { SIX_HOURS } from '@/data/time';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useQueryState } from 'nuqs';
import { KeywordTrackerService } from '../../api/KeywordTrackerService';
import { useAuth } from '../../providers/AuthProvider';

export const useTrackerOverview = () => {
  const { query } = useRouter();
  const { userDetails } = useAuth();

  const [activeTab, setActiveTab] = useQueryState('active_tab', {
    defaultValue: 'all-insights',
  });

  const {
    data: currentTrackerData,
    isLoading: currentTrackerDataLoading,
    error,
  } = useQuery({
    queryKey: ['current-tracker-data', query.trackerId],
    queryFn: async () => {
      const trackerId = query.trackerId;
      if (!trackerId || trackerId === '0') return null;

      const result = await KeywordTrackerService.getTrackerByIdApi(String(trackerId));

      if (result.status) {
        return result.responseData as TrackerDto;
      } else {
        triggerToast('error', result.responseMessage ?? 'Error getting tracker data');
        throw new Error(result.responseMessage);
      }
    },
    enabled: typeof userDetails?.userId === 'string',
    staleTime: SIX_HOURS,
    refetchOnWindowFocus: false,
  });

  const {
    data: keywordTrack,
    isLoading: keywordTrackLoading,
    error: keywordTrackerError,
  } = useQuery({
    queryKey: ['keyword-track-data', query.trackerId],
    queryFn: async () => {
      const data: KeywordTrackDto = {
        ...(currentTrackerData?.keywords &&
          currentTrackerData?.keywords?.length > 0 && {
            includes: currentTrackerData.keywords,
          }),
        start: 1,
        num: 10,
        sort: 'date',
        filter: 1,
        date_restrict: currentTrackerData?.filter_duration ?? 'w90',
        ...(currentTrackerData?.locations &&
          currentTrackerData?.locations?.length > 0 && {
            locations: currentTrackerData.locations,
          }),

        ...(currentTrackerData?.platforms &&
          currentTrackerData?.platforms?.length > 0 && {
            platforms: currentTrackerData.platforms,
          }),
      };

      const result = await KeywordTrackerService.keywordTrack(data);

      if (result.status) {
        return result.responseData;
      } else {
        triggerToast('error', result.responseMessage ?? 'Error getting keyword track');
        throw new Error(result.responseMessage);
      }
    },
    enabled: !!currentTrackerData,
    staleTime: SIX_HOURS,
  });

  // const { data: twitterTrackData } = useQuery({
  //   queryKey: ["twitter-track-data", query.trackerId],
  //   queryFn: async () => {
  //     if (!currentTrackerData) return null;
  //     const result = await XInsightsService.track({
  //       query: currentTrackerData?.keywords?.[0] ?? "",
  //       ...(currentTrackerData?.keywords &&
  //         currentTrackerData?.keywords?.length > 1 && {
  //           includes: currentTrackerData.keywords.slice(1),
  //         }),
  //       expansions:
  //         "author_id,entities.mentions.username,in_reply_to_user_id,geo.place_id",
  //       tweet_fields:
  //         "attachments,author_id,context_annotations,conversation_id,created_at,edit_controls,edit_history_tweet_ids,entities,geo,id,in_reply_to_user_id,lang,public_metrics,referenced_tweets,reply_settings,text,withheld",
  //       user_fields:
  //         "id,username,connection_status,created_at,description,entities,location,pinned_tweet_id,profile_image_url,public_metrics,url,verified,withheld",
  //       media_fields:
  //         "media_key,type,url,duration_ms,height,preview_image_url,public_metrics,width,alt_text,variants",
  //       place_fields:
  //         "full_name,id,contained_within,country,country_code,geo,name,place_type",
  //       poll_fields: "id,options,duration_minutes,end_datetime,voting_status",
  //       max_results: 25,
  //       sort: "recency",
  //     });

  //     if (result.status) {
  //       return result.responseData;
  //     } else {
  //       triggerToast("error", result.responseMessage ?? "Error getting twitter track data")
  //       throw new Error(result.responseMessage);
  //     }
  //   },
  //   enabled: !!currentTrackerData,
  //   staleTime: SIX_HOURS,
  // });

  // const TWITTER_CACHE_KEY =
  //   twitterTrackData?.twitter_cache_key ?? twitterTrackData?.cache_key;

  const { data: postTypeData, isLoading: postTypeDataLoading } = useQuery({
    queryKey: ['post-type-data', query.trackerId],
    queryFn: async () => {
      if (!keywordTrack?.cache_key) return null;
      const result = await KeywordTrackerService.postType(keywordTrack?.cache_key);

      if (result.status) {
        return result.responseData;
      } else {
        triggerToast('error', 'Error getting post type data');
        throw new Error(result.responseMessage);
      }
    },
    enabled: !!keywordTrack,
    staleTime: SIX_HOURS,
  });

  // const {
  //   data: topCountriesData,
  //   isLoading: topCountriesLoading,
  //   error: topCountriesError,
  // } = useQuery({
  //   queryKey: ["top-countries-data", query.trackerId],
  //   queryFn: async () => {
  //     if (!TWITTER_CACHE_KEY) return null;
  //     const result = await XInsightsService.topCountries(TWITTER_CACHE_KEY);

  //     if (result.status) {
  //       return result.responseData;
  //     } else throw new Error(result.responseMessage);
  //   },
  //   enabled: !!twitterTrackData,
  //   staleTime: SIX_HOURS,
  // });

  // const { data: campaigns, isLoading: isLoadingCampaigns } = useQuery({
  //   queryKey: ["keyword-tracking-campaigns", query.trackerId],
  //   queryFn: async () => {
  //     const result = await KeywordTrackerService.getAiConversationInsight({
  //       keyword: currentTrackerData?.keywords?.[0] ?? "",
  //       cache_key: TWITTER_CACHE_KEY,
  //     });
  //     if (result.status) {
  //       return result.responseData;
  //     } else throw new Error(result.responseMessage);
  //   },
  //   enabled:
  //     !!TWITTER_CACHE_KEY &&
  //     currentTrackerData?.keywords &&
  //     currentTrackerData?.keywords?.length > 0,
  // });

  const { data: dailyFrequencyData, isLoading: dailyFrequencyLoading } = useQuery({
    queryKey: ['daily-frequency-data', query.trackerId],
    queryFn: async () => {
      if (!keywordTrack?.cache_key) return null;
      const result = await KeywordTrackerService.dailyFrequency(keywordTrack?.cache_key);

      if (result.status) {
        return result.responseData;
      } else {
        throw new Error(result.responseMessage);
      }
    },
    enabled: !!keywordTrack,
    staleTime: SIX_HOURS,
    retry: (failureCount) => {
      return failureCount < 1; // total 2 attempts
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Error getting daily frequency data';
      triggerToast('error', message);
    },
  });

  const { data: topWordsData, isLoading: topWordsLoading } = useQuery({
    queryKey: ['top-words-data', query.trackerId],
    queryFn: async () => {
      if (!keywordTrack?.cache_key) return null;
      const result = await KeywordTrackerService.topWords(keywordTrack?.cache_key);

      if (result.status) {
        return result.responseData;
      } else {
        throw new Error(result.responseMessage);
      }
    },
    enabled: !!keywordTrack,
    staleTime: SIX_HOURS,
    retry: (failureCount) => {
      return failureCount < 1; // total 2 attempts
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Error getting top words data';
      triggerToast('error', message);
    },
  });

  const { data: topPlatformsData, isLoading: topPlatformsLoading } = useQuery({
    queryKey: ['top-platform-data', query.trackerId],
    queryFn: async () => {
      if (!keywordTrack?.cache_key) return null;
      const result = await KeywordTrackerService.topPlatforms(keywordTrack?.cache_key);

      if (result.status) {
        return result.responseData;
      } else {
        triggerToast('error', result.responseMessage ?? 'Error getting top platform data');
        throw new Error(result.responseMessage);
      }
    },
    enabled: !!keywordTrack,
    staleTime: SIX_HOURS,
  });

  const { data: sentimentData, isLoading: sentimentDataLoading } = useQuery({
    queryKey: ['sentiment-data', query.trackerId],
    queryFn: async () => {
      const result = await KeywordTrackerService.keywordSentiments({
        num: 10,
        start: 1,
        ...(currentTrackerData?.keywords &&
          currentTrackerData?.keywords?.length > 0 && {
            includes: currentTrackerData.keywords.map((x) => x.trim()),
          }),
        ...(currentTrackerData?.excluded &&
          currentTrackerData?.excluded?.length > 0 && {
            includes: currentTrackerData.excluded.map((x) => x.trim()),
          }),
        ...(currentTrackerData?.locations &&
          currentTrackerData?.locations?.length > 0 && {
            locations: currentTrackerData.locations,
          }),
        ...(currentTrackerData?.platforms &&
          currentTrackerData?.platforms?.length > 0 && {
            platforms: currentTrackerData.platforms,
          }),
        date_restrict: currentTrackerData?.filter_duration ?? 'w90',
      });

      if (result.status) {
        return result.responseData;
      } else {
        throw new Error(result.responseMessage);
      }
    },
    enabled: !!currentTrackerData && activeTab === 'sentiment',
    staleTime: SIX_HOURS,
    retry: (failureCount) => {
      return failureCount < 1; // total 2 attempts
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Error getting sentiment data';
      triggerToast('error', message);
    },
  });

  // const {
  //   data: twitterSentimentData,
  //   isLoading: twitterSentimentDataLoading,
  //   error: twitterSentimentDataLoadingError,
  // } = useQuery({
  //   queryKey: ["twitter-sentiment-data", query.trackerId],
  //   queryFn: async () => {
  //     if (!TWITTER_CACHE_KEY) return null;
  //     const result = await XInsightsService.sentiments(TWITTER_CACHE_KEY);

  //     if (result.status) {
  //       return result.responseData;
  //     } else throw new Error(result.responseMessage);
  //   },
  //   enabled:
  //     !!currentTrackerData && !!twitterTrackData && activeTab === "sentiment",
  //   staleTime: SIX_HOURS,
  // });

  const { data: sentimentOverTime, isLoading: isLoadingSentimentOverTime } = useQuery({
    queryKey: ['sentiment-over-time', query.trackerId],
    queryFn: async () => {
      const result = await KeywordTrackerService.getSentimentOverTime(
        'keyword-web-sentiment-data-' + keywordTrack?.cache_key,
        // "processed-twitter-sentiments-" + TWITTER_CACHE_KEY
        ''
      );
      if (result.status) {
        return result.responseData;
      } else throw new Error(result.responseMessage);
    },
    enabled: !!keywordTrack?.cache_key,
  });

  return {
    currentTrackerData,
    currentTrackerDataLoading,
    keywordTrack,
    keywordTrackLoading,
    activeTab,
    setActiveTab,
    sentimentData,
    sentimentDataLoading,
    postTypeData,
    dailyFrequencyData,
    dailyFrequencyLoading,
    topWordsData,
    topWordsLoading,
    error,
    keywordTrackerError,
    sentimentOverTime,
    isLoadingSentimentOverTime,
    postTypeDataLoading,
    topPlatformsData,
    topPlatformsLoading,
  };
};
