import { BusinessDetailDto } from "./base/BusinessDetailDto";
import { LocationDetailDto } from "./base/LocationDetailDto";
import { UserDocDto, UserVideoDto } from "./base/UserDocDto";
import { UserDto } from "./UserDto";

export class ClientProfileDto {
  userId?: string;
  bio?: string;
  specialDetails?: string;
  clientType?: string;
  businessDetail?: BusinessDetailDto;
  coverImage?: UserDocDto;
  logo?: UserDocDto;
  businessLocation?: LocationDetailDto;
  businessDoc?: UserDocDto;
  serviceRequirements?: string[];
  user?: Partial<UserDto>;
  isCompleted?: boolean | { isSetUpComplete: boolean };
  images?: UserDocDto[];
  videos?: UserVideoDto[];
}
