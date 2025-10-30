export interface TwitterTweetDto {
  author: string;
  text: string;
  url: string;
  created_at: string;
  sentiment: string;
  confidence: number;
}

export interface TwitterFetchResponseDataDto {
  success: boolean;
  total_tweets: number;
  tweets: TwitterTweetDto[];
  keyword: string;
}

export interface TwitterFetchResponseDto {
  status: boolean;
  responseCode: number;
  responseMessage: string;
  responseData: TwitterFetchResponseDataDto;
}