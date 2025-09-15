import { ExperienceDto } from "./base/ExperienceDto";
import { UserDocDto } from "./base/UserDocDto";

export class PortfolioDto {
  userId?: string;
  category?: string;
  experience?: ExperienceDto;
  media?: UserDocDto;
  coverImage?: UserDocDto;
  portfolioId?: string;
  _id?: string;
}
