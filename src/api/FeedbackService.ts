import { UriHttpClient } from '@/configs/http.config';
import { feedbackRoutes } from '@/constants/routes/feedbackRoutes';
import { CreateFeedbackDto, FeedbackDto } from '@/models/dtos/FeedbackDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class FeedbackService {
  static async createFeedback(feedback: CreateFeedbackDto): Promise<UriResponse<FeedbackDto>> {
    const response: Awaited<AxiosResponse<UriResponse<FeedbackDto>>> = await UriHttpClient.getClient().post(feedbackRoutes.create, feedback);

    return response.data;
  }

  static async getFeedbackByUserId(userId: string): Promise<UriResponse<FeedbackDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<FeedbackDto[]>>> = await UriHttpClient.getClient().get(`${feedbackRoutes.getByUserId}/${userId}`);

    return response.data;
  }
}
