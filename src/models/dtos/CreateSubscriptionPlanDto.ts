export class CreateSubscriptionPlanDto {
    planName?: string;
    features?: string[];
    price?: number;
    userType?: string;
    duration?: string;
    description?: string;
};