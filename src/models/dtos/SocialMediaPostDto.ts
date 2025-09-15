import { PaginationDto } from "./PaginationDto";

export class SocialMediaPostDto {
  post_id?: string;
  user_id?: string;
  platform?: string;
  post_type?: string;
  content?: string;
  media?: MediaData[];
  hashtags?: string[];
  mentions?: string[];
  post_url?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  status?: string;
  social_user_id?: string;
  influencer_id?: string;
}

export interface MediaData {
  url: string;
  media_type: string;
  caption: string;
  alt_text: string;
}

export class GetSocialMediaPostsByFilterDto extends PaginationDto {
  user_id?: string;
  platform?: string;
  status?: string;
  post_type?: string;
  skip?: number | 0;
  limit?: number | 10;
}

export class SocialMediaPostResponse {
  data?: SocialMediaPostDto[];
  total?: number;
  pageSize?: number;
  page?: number;
}
