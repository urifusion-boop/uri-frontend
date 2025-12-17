import { ObjectHelper } from '@/helpers/ObjectHelper';
import { FundWalletRequestDto, FundWalletResponseDto, WalletBalanceResponseDto, WalletHistoryResponseDto } from '@/models/dtos/WalletDto';
import { UriResponse } from '@/models/responses/UriResponse';

// MOCK DATA FOR TESTING
const MOCK_BALANCE = {
  balance: 25000,
  currency: 'NGN',
};

const MOCK_HISTORY = {
  transactions: [
    {
      id: '1',
      type: 'credit',
      amount: 50000,
      currency: 'NGN',
      description: 'Wallet Funding',
      date: new Date().toISOString(),
      status: 'success',
      reference: 'REF-123456',
    },
    {
      id: '2',
      type: 'debit',
      amount: 750,
      currency: 'NGN',
      description: 'Lead Scan',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'success',
      reference: 'REF-123457',
    },
    {
      id: '3',
      type: 'debit',
      amount: 225,
      currency: 'NGN',
      description: 'Lead Purchase',
      date: new Date(Date.now() - 172800000).toISOString(),
      status: 'success',
      reference: 'REF-123458',
    },
  ],
  total: 3,
  page: 1,
  limit: 10,
};

export class WalletService {
  static async getBalance(): Promise<UriResponse<WalletBalanceResponseDto>> {
    // UNCOMMENT FOR REAL API
    // const response: Awaited<AxiosResponse<UriResponse<WalletBalanceResponseDto>>> = await UriHttpClient.getClient().get(walletRoutes.balance);
    // return response.data;

    // MOCK RESPONSE
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          responseCode: 200,
          responseMessage: 'Success',
          responseData: MOCK_BALANCE,
        } as UriResponse<WalletBalanceResponseDto>);
      }, 500);
    });
  }

  static async initiateFunding(data: FundWalletRequestDto): Promise<UriResponse<FundWalletResponseDto>> {
    // const response: Awaited<AxiosResponse<UriResponse<FundWalletResponseDto>>> = await UriHttpClient.getClient().post(walletRoutes.fund, data);
    // return response.data;

    // MOCK RESPONSE
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          responseCode: 200,
          responseMessage: 'Success',
          responseData: {
            authorization_url: 'https://checkout.paystack.com/fake-url',
            access_code: 'fake-access-code',
            reference: 'fake-ref-' + Date.now(),
          },
        } as UriResponse<FundWalletResponseDto>);
      }, 1000);
    });
  }

  static async verifyFunding(reference: string): Promise<UriResponse<WalletBalanceResponseDto>> {
    // const response: Awaited<AxiosResponse<UriResponse<WalletBalanceResponseDto>>> = await UriHttpClient.getClient().post(`${walletRoutes.verify}/${reference}`);
    // return response.data;

    // MOCK RESPONSE
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          responseCode: 200,
          responseMessage: 'Success',
          responseData: {
            balance: MOCK_BALANCE.balance + 5000,
            currency: 'NGN',
          },
        } as UriResponse<WalletBalanceResponseDto>);
      }, 1000);
    });
  }

  static async getTransactions(page: number = 1, limit: number = 10): Promise<UriResponse<WalletHistoryResponseDto>> {
    const queryString = ObjectHelper.filterMap({ page, limit });
    // const response: Awaited<AxiosResponse<UriResponse<WalletHistoryResponseDto>>> = await UriHttpClient.getClient().get(`${walletRoutes.transactions}?${queryString}`);
    // return response.data;

    // MOCK RESPONSE
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          responseCode: 200,
          responseMessage: 'Success',
          responseData: MOCK_HISTORY as any,
        } as UriResponse<WalletHistoryResponseDto>);
      }, 800);
    });
  }
}
