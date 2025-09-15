export class GetInstagramInsightsDto {
  access_token?: string;
  metrics?: string;
  period?: string;
  since?: number;
  until?: number;
}

export class GetInstagramHashtagSearchDto {
  access_token?: string;
  hashtag?: string;
}

export class GetInstagramMentionsDto {
  access_token?: string;
  media_id?: string;
}

export class SearchDynamicKeywords {
  includes?: string;
  excludes?: string;
  phrases?: string;
  locations?: string;
  languages?: string;
  platforms?: string;
  page_number?: number;
  page_size?: number;
}
