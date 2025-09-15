export class FeatureDto {
    featureId?: string;
    featureName?: string;
    description?: string;
    accessRoute?: string;
    accessUserTypes?: string[];
    subFeatures?: string[];
    subFeaturesData?: FeatureDto[];
};