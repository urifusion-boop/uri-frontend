import { LocationDetailDto } from "./LocationDetailDto";

export class ExperienceDto {

  role!: string;
  businessName!: string;
  startDate!: string;
  endDate?: string;
  location?: LocationDetailDto;
  isCurrent!: boolean;
  description!: string;
}
