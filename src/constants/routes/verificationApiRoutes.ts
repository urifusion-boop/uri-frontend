import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IVerificationApi = "requestOtp" | "verifyOtp";

const rawVerificationApiRoutes: Record<IVerificationApi, string> = {
  requestOtp: "/verification/request-otp",
  verifyOtp: "/verification/verify-otp",
};

export const verificationApiRoutes: Record<IVerificationApi, string> =
  RouteHelper.createRoutes(URI_BACKEND_SVC_PATH, rawVerificationApiRoutes);
