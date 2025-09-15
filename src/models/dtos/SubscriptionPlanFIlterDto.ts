import { PaginationDto } from './PaginationDto';

export class SubscriptionPlanFilterDto extends PaginationDto {
    planId?: string;
    planName?: string;
    features?: string[];
    userType?: string;
    duration?: string;
};