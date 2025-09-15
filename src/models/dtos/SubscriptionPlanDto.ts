import { FeatureDto } from "./FeatureDto";

export class SubscriptionPlanDto {
    planId?: string;
    planName?: string;
    features?: string[];
    price?: number;
    userType?: string;
    duration?: string;
    durationInDays?: number;
    description?: string;
    featuresData?: FeatureDto[];
};
