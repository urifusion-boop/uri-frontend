import { UriHttpClient } from '@/configs/http.config';
import { fileManagementApiRoutes } from '@/constants/routes/fileManagementApiRoutes';
import { UserDto } from '@/models/dtos/UserDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { IFile } from '../hooks/profile/client/clientProfileSetup.hook';

export class DocumentService {
  static async uploadFile(data: FormData, filePath: string): Promise<UriResponse<IFile>> {
    const response: Awaited<AxiosResponse<UriResponse<IFile>>> = await UriHttpClient.getClient().post(`${fileManagementApiRoutes.uploadAzureBlobFile}?filePath=${filePath}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async deleteFile(filePath: string): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().delete(`${fileManagementApiRoutes.deleteAzureBlobFile}?filePath=${filePath}`);
    return response.data;
  }

  static async deleteMultipleFiles(filePaths: string[]): Promise<UriResponse<UserDto>> {
    const filePathsQuery = filePaths.map((path) => `filePaths=${path}`).join('&');

    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().delete(`${fileManagementApiRoutes.deleteMultipleFiles}?${filePathsQuery}`);
    return response.data;
  }
}

export type IFolder = 'BusinessCovers' | 'EventCovers' | 'Works' | 'EventImages' | 'Portfolio' | 'Headshots' | 'Locations' | 'CAC' | 'UtilityBills';
