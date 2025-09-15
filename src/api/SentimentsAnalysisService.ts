import { UriHttpClient } from '@/configs/http.config';
import { sentimentAnalysisInsightsRoutes } from '@/constants/routes/sentimentsRoutes';
import { CommentData, CommentSentimentAnalysis } from '@/models/dtos/InstagramInsights';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';

export class SentimentsAnalysisService {
  static async getCommentSentimentInsights(comments: CommentData[]): Promise<UriResponse<CommentSentimentAnalysis>> {
    const response: Awaited<AxiosResponse<UriResponse<CommentSentimentAnalysis>>> = await UriHttpClient.getClient().post(sentimentAnalysisInsightsRoutes.commentSentiment, { comments });
    return response.data;
  }
}
