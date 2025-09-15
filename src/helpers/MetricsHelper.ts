import { MediaTypeEnum } from '@/models/enum-models/MediaTypeEnum';
import { MetricsCategoryEnum } from '@/models/enum-models/MetricEnum';

export class MetricsHelper {
  static getMediaMetrics(mediaType: string | null, postType: string) {
    if (postType === 'stories' && mediaType === MediaTypeEnum.VIDEO) {
      return 'impressions,reach,replies,follows,profile_visits,shares,total_interactions';
    }
    if (!mediaType) return '';

    switch (mediaType) {
      case MediaTypeEnum.VIDEO:
        return 'plays,clips_replays_count,ig_reels_video_view_total_time,ig_reels_avg_watch_time,ig_reels_aggregated_all_plays_count,comments,likes,reach,saved,shares,total_interactions';
      default:
        return 'comments,likes,reach,saved,shares,total_interactions,follows,profile_visits';
    }
  }

  static getMetrics(category: string) {
    switch (category) {
      case MetricsCategoryEnum.COMMENTS_LIKES_SHARES:
        return 'comments,likes,shares';
      case MetricsCategoryEnum.REACH_IMPRESSIONS:
        return 'reach,impressions';
      case MetricsCategoryEnum.REACH:
        return 'reach';
      default:
        return '';
    }
  }

  static getFacebookPostMetrics(postType: string) {
    switch (postType) {
      case MediaTypeEnum.PHOTO.toLowerCase():
        return 'post_impressions,post_impressions_unique,post_clicks,post_reactions_by_type_total';
      default:
        return 'post_impressions,post_impressions_unique,post_clicks,post_reactions_by_type_total,total_video_impressions_unique,total_video_impressions,total_video_reactions_by_type_total,post_video_views,post_video_avg_time_watched,post_video_complete_views_30s,post_video_views_unique';
    }
  }

  static getLinkedinPostIdAndType(postId: string): {
    type: 'share' | 'ugcPost' | 'unknown';
    id: string | null;
  } {
    const match = postId.match(/^urn:li:(share|ugcPost):(\d+)$/);

    if (match) {
      return {
        type: match[1] as 'share' | 'ugcPost',
        id: match[2],
      };
    }

    return { type: 'unknown', id: null };
  }
}
