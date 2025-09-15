export interface CreateInfluencerDto {
  user_id: string;
  influencer_id?: string;
  email: string;
  social_user_id?: string;
  social_username?: string;
  social_name?: string;
  social_platform?: string;
  profile_image?: string;
  bio?: string;
  tags?: string[];
  location?: string;
  followers?: number;
}

export type TokenType = {
  ACCOUNT_TRACKING?: string;
  CONTENT_MANAGEMENT?: string;
};

export interface InfluencerDto {
  influencer_id: string;
  email: string;
  tags?: string[];
  social_user_id?: string;
  social_username?: string;
  social_name?: string;
  social_platform?: string;
  profile_image?: string;
  bio?: string;
  account_type?: string;
  location?: string;
  followers?: number;
  connected?: boolean | false;
  createdAt?: string;
  token?: string | TokenType;
  profile_pic?: string;
  user_id?: string;
}

export interface InfluencerFilterDto {
  user_id?: string;
  skip: number;
  limit: number;
  name?: string;
  email?: string;
  connected?: boolean;
  platforms?: string;
  location?: string;
  account_type?: string;
}

export interface InfluencerFilterResponseDto {
  data: InfluencerDto[];
  metaData: MetaData;
  total: number;
  pageSize: number;
}

interface MetaData {
  totalConnected: number;
  totalDisconnected: number;
}
