import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { RouteHelper } from '../../helpers/RouteHelper';

const URI_INSIGHTS_SVC_PATH = BackendUrlEnum.INSIGHTS;

type IHashtagTrackerApi = 'track' | 'ai_post_report' | 'ai_hashtag_report' | 'sentiment';

export const rawHashtagTrackerApiRoutes: Record<IHashtagTrackerApi, string> = {
  track: '/hashtag/track',
  ai_post_report: '/hashtag/ai_post_report',
  ai_hashtag_report: '/hashtag/ai_hashtag_report',
  sentiment: '/hashtag/sentiment_analysis',
};

export const hashtagTrackerApiRoutes: Record<IHashtagTrackerApi, string> = RouteHelper.createRoutes(URI_INSIGHTS_SVC_PATH, rawHashtagTrackerApiRoutes);
