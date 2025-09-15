import { AgreementTypeEnum } from "@/models/enum-models/AgreementTypeEnum";

export interface AgreementDto {
  agreementType: AgreementTypeEnum;
  accepted: boolean;
  acceptedAt?: Date | null;
  content: string;
}
