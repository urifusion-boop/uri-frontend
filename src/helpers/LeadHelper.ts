import { LeadDto } from '@/models/dtos/LeadsDto';
import { FormTypeEnum } from '@/models/enum-models/FormTypeEnum';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';

export class LeadHelper {
  static getLeadFormType(leadType: LeadTypeEnum) {
    switch (leadType) {
      case LeadTypeEnum.PERSON:
        return 'individual';
      case LeadTypeEnum.ORGANIZATION:
        return 'organization';
      case LeadTypeEnum.BUSINESS:
        return 'business';
      case LeadTypeEnum.CONVERSATIONAL:
        return 'conversational';
      case LeadTypeEnum.GOOGLE_MAPS:
        return 'googlemaps';
      default:
        return '';
    }
  }

  static getFormTypeFromLeadType(leadType: LeadTypeEnum): FormTypeEnum {
    switch (leadType) {
      case LeadTypeEnum.PERSON:
        return FormTypeEnum.PERSON;
      case LeadTypeEnum.ORGANIZATION:
        return FormTypeEnum.ORGANIZATION;
      case LeadTypeEnum.BUSINESS:
        return FormTypeEnum.BUSINESS;
      case LeadTypeEnum.CONVERSATIONAL:
        return FormTypeEnum.CONVERSATIONAL;
      case LeadTypeEnum.GOOGLE_MAPS:
        return FormTypeEnum.GOOGLE_MAPS;
      default:
        return FormTypeEnum.PERSON;
    }
  }

  static getFormTypeFromUrlParam(urlParam: string): FormTypeEnum {
    switch (urlParam) {
      case 'individual':
        return FormTypeEnum.PERSON;
      case 'organization':
        return FormTypeEnum.ORGANIZATION;
      case 'business':
        return FormTypeEnum.BUSINESS;
      case 'conversational':
        return FormTypeEnum.CONVERSATIONAL;
      case 'googlemaps':
        return FormTypeEnum.GOOGLE_MAPS;
      default:
        return FormTypeEnum.PERSON;
    }
  }

  static getLeadInitials = (row?: LeadDto) => {
    if (!row) return '-';
    if (row.username?.length && row.username?.length > 2) return row.username?.slice(0, 2);
    if (row.first_name?.length && row.first_name?.length > 2) return row.first_name?.slice(0, 2);
    if (row.last_name?.length && row.last_name?.length > 2) return row.last_name?.slice(0, 2);
    return '-';
  };
}
