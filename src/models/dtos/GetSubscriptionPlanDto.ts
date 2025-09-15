import { SubscriptionPlanDto } from "./SubscriptionPlanDto";

export class GetSubscriptionPlanDto {
  page?: string;
  pageSize?: string;
  data?: SubscriptionPlanDto[];
  total?: string | number;
}
