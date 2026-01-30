import { UriHttpClient } from '@/configs/http.config';
import { paymentGatingRoutes } from '@/constants/routes/paymentGatingRoutes';
import {
  ActionCostsDto,
  AllActionCostsDto,
  CheckPaymentBalanceRequestDto,
  DeductPaymentRequestDto,
  DeductPaymentResponseDto,
  LeadActionTypeEnum,
  PaymentBalanceResponseDto,
} from '@/models/dtos/PaymentGatingDto';
import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class PaymentGatingService {
  private static buildTaskManagerUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${BackendUrlEnum.TASK_MANAGER}${normalizedPath}`;
  }

  static async checkBalance(data: CheckPaymentBalanceRequestDto): Promise<UriResponse<PaymentBalanceResponseDto>> {
    const params = new URLSearchParams({
      userId: data.userId,
      paymentMode: data.paymentMode,
      actionType: data.actionType,
      ...(data.quantity && { quantity: String(data.quantity) }),
    });

    const response: Awaited<AxiosResponse<UriResponse<PaymentBalanceResponseDto>>> = await UriHttpClient.getClient().get(
      this.buildTaskManagerUrl(`${paymentGatingRoutes.checkBalance}?${params.toString()}`)
    );
    return response.data;
  }

  static async deductPayment(data: DeductPaymentRequestDto): Promise<UriResponse<DeductPaymentResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<DeductPaymentResponseDto>>> = await UriHttpClient.getClient().post(this.buildTaskManagerUrl(paymentGatingRoutes.deduct), data);
    return response.data;
  }

  static async getActionCosts(actionType: LeadActionTypeEnum): Promise<UriResponse<ActionCostsDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ActionCostsDto>>> = await UriHttpClient.getClient().get(this.buildTaskManagerUrl(paymentGatingRoutes.actionCosts), { params: { actionType } });
    return response.data;
  }

  static async getAllActionCosts(): Promise<UriResponse<AllActionCostsDto>> {
    const response: Awaited<AxiosResponse<UriResponse<AllActionCostsDto>>> = await UriHttpClient.getClient().get(this.buildTaskManagerUrl(paymentGatingRoutes.allActionCosts));
    return response.data;
  }
}
