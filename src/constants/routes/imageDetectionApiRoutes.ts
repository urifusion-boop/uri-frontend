import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IImageDetectionApi =
  | "detectFaces"
  | "detectFullBody"
  | "detectText"
  | "removeBg"
  | "analyze";

const rawImageDetectionApiRoutes: Record<IImageDetectionApi, string> = {
  detectFaces: "/detectfaces/",
  detectFullBody: "/detectfullbody/",
  detectText: "/detecttext/",
  removeBg: "/imageProcessing/removeBg",
  analyze: "/imageProcessing/analyzeImage",
};

export const imageDetectionApiRoutes: Record<IImageDetectionApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawImageDetectionApiRoutes);
