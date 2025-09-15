import { UserDocDto } from "./base/UserDocDto";

export class CreateFeedDto {
  userId?: string;
  contentType?: string;
  category?: string;
  caption?: string;
  content?: UserDocDto;
  tags?: string[];
  isSpotlight?: boolean;
}
