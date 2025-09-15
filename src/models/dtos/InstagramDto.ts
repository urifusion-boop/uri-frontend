export class InstagramMediaDto {
  comments_count?: number;
  like_count?: number;
  media_type?: string;
  media_url?: string;
  caption?: string;
  id?: string;
}

export class InstagramInsightDto {
  name?: string;
  period?: string;
  values?: {
    value?: number;
    end_time?: string;
  }[];
  title?: string;
  description?: string;
  id?: string;
}

export class InstagramPagingDto {
  cursors?: {
    after?: string;
  };
}

export class InstagramBusinessDto {
  id?: string;
  ig_id?: number;
  username?: string;
  profile_picture_url?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
  media?: {
    data: InstagramMediaDto[];
    paging?: InstagramPagingDto;
  };
}

export class GetInstagramAuthUrlDto {
  url!: string;
}

export class InstagramMedia {
  id?: string;
  media_type?: "VIDEO" | "IMAGE";
  media_url?: string;
  permalink?: string;
  thumbnail_url?: string;
  caption?: string;
}

export class InstagramPaging {
  cursors?: {
    after?: string;
    before?: string;
    next?: string;
  };
}

export class GetInstagramMedia {
  userId?: string;
  before?: string;
  after?: string;
  next?: string;
}

export class GetInstagramUserDemographicsDto {
  ig_user_id?: string;
  metrics?: string;
  metric_type?: string;
  breakdowns?: string;
  period?: string;
  timeframe?: string;
  since?: number;
  until?: number;
}

export interface InstagramDemographicDto {
  metrics: string;
  metric_type: string;
  breakdowns: string;
  period: string;
  timeframe: string;
  ig_user_id: string;
}

export interface InstagramMediaPostDto {
  media_id: string;
  metrics: string;
}

export interface InsightDemographics {
  name: string;
  period: string;
  title: string;
  description: string;
  total_value: {
    breakdowns: Breakdown[];
  };
  id: string;
}

export interface Breakdown {
  dimension_keys: string[];
  results: Result[];
}

interface Result {
  dimension_values: string[];
  value: number;
}
