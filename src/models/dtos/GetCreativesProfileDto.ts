import { CreativeProfileDto } from "./CreativeProfileDto";

export class GetCreativesProfileDto {
  page?: string;
  pageSize?: number;
  data?: CreativeProfileDto[];
  total?: string;
}
  