import { UriHttpClient } from '@/configs/http.config';
import { transactionsRoutes } from '@/constants/routes/transactionRoutes';
import { ObjectHelper } from '@/helpers/ObjectHelper';
import { GetTransactionParametersDto, GetTransactionResponseDto, VerifyTransactionResponseDto } from '@/models/dtos/TransactionDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class TransactionService {
  static async verifySubscription(reference: string): Promise<UriResponse<VerifyTransactionResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<VerifyTransactionResponseDto>>> = await UriHttpClient.getClient().post(`${transactionsRoutes.verify}/${reference}`);

    return response.data;
  }

  static async getTransactionByFilters(data: GetTransactionParametersDto): Promise<UriResponse<GetTransactionResponseDto>> {
    const queryString = ObjectHelper.filterMap(data);

    const response: Awaited<AxiosResponse<UriResponse<GetTransactionResponseDto>>> = await UriHttpClient.getClient().get(`${transactionsRoutes.getByFilters}?${queryString}`);
    return response.data;
  }
}
