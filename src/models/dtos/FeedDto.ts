import { UserDocDto } from "./base/UserDocDto";

export class FeedDto {
  feedId?: string;
  userId?: string;
  contentType?: string;
  category?: string;
  caption?: string;
  content?: UserDocDto;
  likes = 0;
  views = 0;
  tags?: string[];
  likedBy?: string[];
  viewedBy?: string[];
  timeToLive?: Date;
  expiresOn?: Date;
  isSpotlight?: boolean;
}
