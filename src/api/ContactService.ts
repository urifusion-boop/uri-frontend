import { UriHttpClient } from '@/configs/http.config';
import { contactMessageApiRoutes } from '@/constants/routes/contactMessageApiRoutes';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { CreateContactMessageDto } from '../models/dtos/ContactMessageDto';

export class ContactMessageService {
  static async createMessageApi(data: CreateContactMessageDto): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(contactMessageApiRoutes.createMessage, data);
    return response.data;
  }
}
