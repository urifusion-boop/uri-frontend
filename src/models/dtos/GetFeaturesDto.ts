import { FeatureDto } from "./FeatureDto";

export class GetFeaturesDto {
  page?: string;
  pageSize?: number;
  data?: FeatureDto[];
  total?: number;
}