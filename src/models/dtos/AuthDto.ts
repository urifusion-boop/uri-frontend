export class LoginDto {
  email!: string;
  password!: string;
}

export class GoogleAuthDto {
  code?: string;
  redirectUri?: string;
  userType?: string;
}

export class LogoutDto {
  refreshToken!: string;
}

export class RegisterDto {
  email!: string;
  password!: string;
}

export class ConfirmEmailDto {
  email!: string;
  token!: string;
}

export class ResendConfirmEmailDto {
  email!: string;
}

export class ForgotPasswordDto {
  email!: string;
}

export class ResetPasswordDto {
  email!: string;
  token!: string;
  newPassword!: string;

  constructor(data?: { email: string; token: string; newPassword: string }) {
    if (data) {
      this.email = data.email;
      this.token = data.token;
      this.newPassword = data.newPassword;
    }
  }
}


export class ChangePasswordDto {
  userId!: string;
  currentPassword!: string;
  newPassword!: string;
}

export class RefreshTokenDto {
  userId!: string;
  oldRefreshToken!: string;
}

export class ValidateTokenDto {
  token!: string;
  userId?: string;
}
