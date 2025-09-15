export class GetFacebookPageInsights {
  page_id!: string;
  period!: string;
  metics?: string;
  since?: string;
  until?: string;
  previous?: string;
  next?: string;
}

export class SearchFacebookPage {
  name!: string;
  fields?: string;
}

export class GetFacebookVideoInsights {
  video_id!: string;
  period!: string;
  metics?: string;
  since?: string;
  until?: string;
  previous?: string;
  next?: string;
}

export class GetFacebookPhotoInsights {
  photo_id!: string;
  period!: string;
  metics?: string;
  since?: string;
  until?: string;
  previous?: string;
  next?: string;
}

export class GetFacebookFeedInsights {
  page_id!: string;
  period!: string;
  metics?: string;
  since?: string;
  until?: string;
  previous?: string;
  next?: string;
}

export class GetFaceBookBusinessDiscovery {
  page_id!: string;
  before?: string;
  after?: string;
}

export interface FacebookBusinessDiscoveryResponse {
  id: string;
  name: string;
  followers_count: number;
  fan_count: number;
  about: string;
  link: string;
  verification_status: string;
  website: string;
  picture: Picture;
  post_data: PostData;
  facebook_cache_key: string;
}

export interface Picture {
  data: {
    url: string;
  };
}

export interface PostData {
  feed: Feed;
  id: string;
}

export interface Feed {
  data: FacebookPostDto[];
  paging: Paging;
}

export interface FacebookPostDto {
  id: string;
  created_time?: string | number;
  attachments?: Attachments;
  comments?: Comments;
  reactions?: Reactions;
}

export interface Attachments {
  data: Daum2[];
}

export interface Daum2 {
  media: Media;
  media_type: string;
  url: string;
  description?: string;
  title?: string;
}

export interface Media {
  image: Image;
  source?: string;
}

export interface Image {
  height: number;
  src?: string;
  width: number;
}

export interface Comments {
  data: Daum3[];
  paging: Paging;
}

export interface Daum3 {
  message: string;
  created_time: string;
  id: string;
}

export interface Paging {
  cursors: Cursors;
  next?: string;
}

export interface Cursors {
  before: string;
  after: string;
}

export interface Reactions {
  data: Daum4[];
  paging: Paging;
  summary: Summary;
}

export interface Daum4 {
  id: string;
  name: string;
  type: string;
}

export interface Summary {
  total_count: number;
  viewer_reaction: string;
}

export interface FacebookPageReelsResponse {
  data: ReelsDto[];
  paging: Paging;
}

export interface ReelsDto {
  id: string;
  created_time: string;
  description: string;
  source: string;
  length: number;
  from: From;
}

export interface From {
  name: string;
  id: string;
}

export interface FacebookInsightsResponseDto {
  data: ReelsInsightsDto[];
}

export interface ReelsInsightsDto {
  name: string;
  period: string;
  values: Value[];
  title: string;
  description: string;
  id: string;
}

export interface Value {
  value: any;
}

export interface FacebookMentionsDto {
  id: string;
  message: string;
  created_time: string;
}

export class GetFacebookMentionsResponse {
  data?: FacebookMentionsDto[];
  paging?: Paging;
}

export class GetFacebookMentionDto {
  page_id!: string;
  previous?: string;
  next?: string;
}

export interface FacebookPageInsightsResponse {
  data: FacebookPageInsightsDto[];
  paging: Paging;
}

export interface FacebookPageInsightsDto {
  name: string;
  period: string;
  values: InsightsValueDto[];
  title: string;
  description: string;
  id: string;
}

export interface InsightsValueDto {
  value: number;
  end_time: string;
}
