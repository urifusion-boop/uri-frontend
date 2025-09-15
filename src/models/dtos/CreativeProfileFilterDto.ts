import { PaginationDto } from "./PaginationDto";

export class CreativeProfileFilterDto extends PaginationDto {
  categories?: string[];
  country?: string;
  state?: string;
  city?: string;
  searchTerm?: string;
  height?: string;
  bodySize?: string;
  eyeColor?: string;
  skinColor?: string;
}
