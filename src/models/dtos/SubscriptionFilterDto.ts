import { PaginationDto } from './PaginationDto';

export class SubscriptionFilterDto extends PaginationDto {
    subscriptionId?: string;
    userId?: string;
    subscriptionPlanId?: string;
    status?: string;
    startDate?: Date;
    expiryDate?: Date;
    paymentId?: string;
};