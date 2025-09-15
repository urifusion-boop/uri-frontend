import { UriHttpClient } from '@/configs/http.config';
import { imageDetectionApiRoutes } from '@/constants/routes/imageDetectionApiRoutes';
import { UriResponse } from '@/models/responses/UriResponse';
import axios, { AxiosResponse } from 'axios';

export class ImageDetectionService {
  static async detectFaces(data: FormData): Promise<any> {
    const response: Awaited<AxiosResponse<any>> = await axios.post(`${process.env.NEXT_PUBLIC_URI_IMAGE_DETECTION_API_BASE_URL}${imageDetectionApiRoutes.detectFaces}`, data);
    return response.data;
  }

  static async detectFullbody(data: FormData): Promise<any> {
    const response: Awaited<AxiosResponse<any>> = await axios.post(`${process.env.NEXT_PUBLIC_URI_IMAGE_DETECTION_API_BASE_URL}${imageDetectionApiRoutes.detectFullBody}`, data);
    return response.data;
  }

  static async analyze(data: FormData): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> = await UriHttpClient.getClient().post(`${imageDetectionApiRoutes.analyze}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async removeBackground(data: FormData): Promise<string> {
    const response: Awaited<AxiosResponse<string>> = await UriHttpClient.getClient().post(`${imageDetectionApiRoutes.removeBg}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
    });
    return response.data;
  }
}
