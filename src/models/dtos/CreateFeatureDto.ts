export class CreateFeatureDto {
    featureName?: string;
    description?: string;
    accessRoute?: string;
    accessUserTypes?: string[];
    subFeatures?: string[];
}