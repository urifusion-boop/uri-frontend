import { UriHttpClient } from '@/configs/http.config';
import { discountRoutes } from '@/constants/routes/discountRoutes';
import { DiscountResponseDto } from '@/models/dtos/DiscountResponseDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class DiscountService {
  static async getDiscountByCodeApi(code: string): Promise<UriResponse<DiscountResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<DiscountResponseDto>>> = await UriHttpClient.getClient().get(discountRoutes.getDiscountByCode + `/${code}`);
    return response.data;
  }
}
