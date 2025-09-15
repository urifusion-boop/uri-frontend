import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type FileManagamentApi =
  | "uploadAzureBlobFile"
  | "deleteAzureBlobFile"
  | "uploadCloudinaryFile"
  | "deleteCloudinaryFile"
  | "deleteMultipleFiles";

const rawFileManagementApiRoutes: Record<FileManagamentApi, string> = {
  uploadAzureBlobFile: "/files/azure/blob/upload-file",
  deleteAzureBlobFile: "/files/azure/blob/delete-file",
  uploadCloudinaryFile: "/files/cloudinary/upload-file",
  deleteCloudinaryFile: "/files/cloudinary/delete-file",
  deleteMultipleFiles: "/files/azure/blob/delete-multiple-files",
};

export const fileManagementApiRoutes: Record<FileManagamentApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawFileManagementApiRoutes);
