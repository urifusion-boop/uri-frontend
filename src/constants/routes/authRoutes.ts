import { BackendUrlEnum } from "@/models/enum-models/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IAuthApi =
  | "login"
  | "signUp"
  | "getGoogleAuth"
  | "signUpWithGoogle"
  | "confirmLogin"
  | "signInWithGoogle"
  | "forgotPassword"
  | "resetPassword"
  | "confirmEmail"
  | "resendConfirmationEmail"
  | "refreshToken"
  | "changePassword";

const rawAuthRoutes: Record<IAuthApi, string> = {
  login: "/auth/login",
  signUp: "/auth/signup",
  getGoogleAuth: "/auth/google",
  signUpWithGoogle: "/auth/google/signup",
  confirmLogin: "/auth/confirmLogin",
  signInWithGoogle: "/auth/google/signin",
  forgotPassword: "/auth/forgotPassword",
  resetPassword: "/auth/resetPassword",
  confirmEmail: "/auth/confirmEmail",
  resendConfirmationEmail: "/auth/resendConfirmationEmail",
  refreshToken: "/auth/refreshToken",
  changePassword: "/auth/changePassword",
};

// Use the function to create routes with the base path
export const authRoutes: Record<IAuthApi, string> = RouteHelper.createRoutes(
  URI_BACKEND_SVC_PATH,
  rawAuthRoutes
);
