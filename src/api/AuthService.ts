import { UriHttpClient } from '@/configs/http.config';
import { authRoutes } from '@/constants/routes/authRoutes';
import { ChangePasswordDto, ConfirmEmailDto, ForgotPasswordDto, GoogleAuthDto, LoginDto, RefreshTokenDto, ResendConfirmEmailDto, ResetPasswordDto } from '@/models/dtos/AuthDto';
import { CreateUserDto } from '@/models/dtos/CreateUserDto';
import { LoginResponseDto } from '@/models/dtos/LoginResponseDto';
import { UserDto } from '@/models/dtos/UserDto';
import { TokenResponseDto } from '@/models/dtos/base/TokenResponseDto';
import { UriResponse } from '@/models/responses/UriResponse';
import { AxiosResponse } from 'axios';
import { GoogleSignUpResponse } from '../models/dtos/GoogleSignUpResponse';

export class AuthService {
  static async signupApi(data: CreateUserDto): Promise<UriResponse<UserDto>> {
    // data.userType = userType;
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().post(authRoutes.signUp, data);
    return response.data;
  }

  static async loginApi(data: LoginDto): Promise<UriResponse<LoginResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LoginResponseDto>>> = await UriHttpClient.getClient().post(authRoutes.login, data);
    return response.data;
  }

  static async refreshTokenApi(data: RefreshTokenDto): Promise<UriResponse<TokenResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<TokenResponseDto>>> = await UriHttpClient.getClient().post(authRoutes.refreshToken, data);
    return response.data;
  }

  static async signupWithGoogleApi(data: GoogleAuthDto): Promise<UriResponse<GoogleSignUpResponse>> {
    const response: Awaited<AxiosResponse<UriResponse<GoogleSignUpResponse>>> = await UriHttpClient.getClient().post(authRoutes.signUpWithGoogle, data);
    return response.data;
  }

  static async loginWithGoogleApi(data: GoogleAuthDto): Promise<UriResponse<LoginResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LoginResponseDto>>> = await UriHttpClient.getClient().post(authRoutes.signInWithGoogle, data);
    return response.data;
  }

  static async getGoogleAuth(redirectUri: string): Promise<{ url: string }> {
    const response: Awaited<AxiosResponse<{ url: string }>> = await UriHttpClient.getClient().get(`${authRoutes.getGoogleAuth}?redirect_uri=${redirectUri}`);

    return response.data;
  }

  static async confirmEmailApi(data: ConfirmEmailDto): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().post(authRoutes.confirmEmail, data);
    return response.data;
  }

  static async confirmLoginApi(data: ConfirmEmailDto): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().post(authRoutes.confirmLogin, data);
    return response.data;
  }

  static async forgotPasswordApi(data: ForgotPasswordDto): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().post(authRoutes.forgotPassword, data);
    return response.data;
  }

  static async resendConfirmationEmailApi(data: ResendConfirmEmailDto): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().post(authRoutes.resendConfirmationEmail, data);
    return response.data;
  }

  static async resetPasswordApi(data: ResetPasswordDto): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().post(authRoutes.resetPassword, data);
    return response.data;
  }

  static async changePasswordApi(data: ChangePasswordDto): Promise<UriResponse<UserDto> | null> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> = await UriHttpClient.getClient().post(authRoutes.changePassword, data);
    return response.data;
  }
}
