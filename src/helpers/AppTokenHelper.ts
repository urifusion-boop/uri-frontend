import { UserDto } from "../models/dtos/UserDto";
import { AgreementDto } from "../models/dtos/base/AgreementDto";
import { AppTokenDto } from "../models/dtos/base/AppTokenDto";

export class AppTokenHelper {
  public static getFacebookAccessToken(userDetails: any) {}

  public static addOrUpdateToken(
    userDetails: any,
    token: string,
    tokenUsage: string,
    provider: string = "SYSTEM",
    isEnabled: boolean = true
  ): any[] {
    const existingTokenIndex = this.getTokenIndex(userDetails, tokenUsage);

    if (existingTokenIndex !== -1) {
      userDetails.appTokens[existingTokenIndex].token = token;
      userDetails.appTokens[existingTokenIndex].provider = provider;
      userDetails.appTokens[existingTokenIndex].isEnabled = isEnabled;
    } else {
      userDetails.appTokens.push({
        provider,
        isEnabled,
        token,
        tokenUsage,
      });
    }

    return userDetails.appTokens;
  }

  public static getToken(
    userDetails: UserDto | null,
    tokenUsage: string
  ): string | undefined {
    const existingTokenIndex = this.getTokenIndex(userDetails, tokenUsage);

    if (existingTokenIndex !== -1 && userDetails?.appTokens) {
      return userDetails.appTokens[existingTokenIndex].token;
    }

    return undefined;
  }

  public static hasAgreementType(
    agreements: AgreementDto[],
    agreementType: string
  ): boolean {
    return agreements.some(
      (agreement) => agreement.agreementType === agreementType
    );
  }

  private static getTokenIndex(userDetails: any, tokenUsage: string): number {
    if (!userDetails || !Array.isArray(userDetails.appTokens)) {
      return -1;
    }

    const existingTokenIndex = userDetails.appTokens.findIndex(
      (t: AppTokenDto) => t.tokenUsage === tokenUsage
    );

    return existingTokenIndex;
  }

  public static hasTokenUsage(
    tokens: AppTokenDto[],
    tokenUsage?: string,
    platform?: string
  ): boolean {
    if (tokenUsage) {
      return tokens.some(
        (token) => token.tokenUsage === tokenUsage && token.token
      );
    }

    if (platform) {
      return tokens.some(
        (token) => token.provider === platform.toUpperCase() && token.token
      );
    }

    return false;
  }

  public static getProviderByTokenUsage(
    tokens: AppTokenDto[],
    tokenUsage: string
  ): AppTokenDto | undefined {
    return tokens.find((token) => token.tokenUsage === tokenUsage);
  }

  public static getProvider(
    tokens: AppTokenDto[],
    provider: string
  ): AppTokenDto | undefined {
    return tokens.find((token) => token.provider === provider);
  }
}
