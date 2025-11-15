export interface LinkedinPostDto {
  author: string;
  text: string;
  url: string;
  created_at: string;
  sentiment?: string;
  confidence?: number;
  author_profile?: string;
}

export interface LinkedinFetchResponseDataDto {
  success: boolean;
  total_posts: number;
  posts: LinkedinPostDto[];
  keyword: string;
}

export interface LinkedinFetchResponseDto {
  status: boolean;
  responseCode: number;
  responseMessage: string;
  responseData: LinkedinFetchResponseDataDto;
}