export class GetTiktokInsightDto {
  user_id!: string;
  influencer_id!: string;
  username!: string;
}

export class TiktokInsightDto {
  username!: string;
  fields?: string;
}

export class TiktokBusinessDiscoveryResponseDataDto {
  avatar_url_100?: string;
  likes_count?: number;
  open_id?: string;
  avatar_large_url?: string;
  avatar_url?: string;
  video_count?: number;
  bio_description?: string;
  username?: string;
  following_count?: number;
  is_verified?: boolean;
  profile_deep_link?: string;
  union_id?: string;
  display_name?: string;
  follower_count?: number;
  media?: TiktokMedia[];
}

export class TiktokMedia {
  cover_image_url?: string;
  duration?: number;
  embed_link?: string;
  id?: string;
  title?: string;
  video_description?: string;
  comment_count?: number;
  like_count?: number;
  share_count?: number;
  view_count?: number;
}
