import { BodyFeatureDto } from "./base/BodyFeatureDto";
import { LanguageDto } from "./base/LanguageDto";
import { LocationDetailDto } from "./base/LocationDetailDto";
import { PreferenceDto } from "./base/PreferenceDto";
import { UserDocDto, UserVideoDto } from "./base/UserDocDto";
import { UserDto } from "./UserDto";

export class CreativeProfileDto {
  userId?: string;
  location?: LocationDetailDto;
  creativeCategories?: string[];
  gender?: string;
  bio?: string;
  bodyFeature?: BodyFeatureDto;
  dateOfBirth?: string;
  headshot?: UserDocDto;
  coverImage?: UserDocDto;
  preferences?: PreferenceDto;
  languages?: LanguageDto[];
  images?: UserDocDto[];
  user?: Partial<UserDto>;
  isCompleted?: boolean | { isSetUpComplete: boolean };
  videos?: UserVideoDto[];
}
