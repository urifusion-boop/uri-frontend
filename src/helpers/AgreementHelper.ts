import { InfluencerDto } from "@/models/dtos/InfluencerDto";
import { AgreementTypeEnum } from "@/models/enum-models/AgreementTypeEnum";

export class AgreementHelper {
  public static getAgreementType(
    account: InfluencerDto
  ): AgreementTypeEnum | string {
    const platform = account.social_platform?.toUpperCase();

    switch (platform) {
      case "FACEBOOK":
        return AgreementTypeEnum.FACEBOOK;
      case "TIKTOK":
        return AgreementTypeEnum.TIKTOK;
      case "X": // Twitter (now known as X)
        return AgreementTypeEnum.X;
      case "LINKEDIN":
        return AgreementTypeEnum.LINKEDIN;
      default:
        return "";
    }
  }
}
