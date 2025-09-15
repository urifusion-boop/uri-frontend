import { PaginationDto } from './PaginationDto';

export class FeatureFilterDto extends PaginationDto {
    featureId?: string;
    featureName?: string;
    accessUserTypes?: string[];
}