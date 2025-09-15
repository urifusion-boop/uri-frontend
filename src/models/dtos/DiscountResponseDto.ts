export interface DiscountResponseDto {
  userId: string;
  planCode: string;
  percentage: number;
  originalPlanAmount: number;
  discountedAmount: number;
  newTotalAmount: number;
  isExpired: boolean;
  isUsed: boolean;
  discountCodeId: string;
  discountCode: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
}
